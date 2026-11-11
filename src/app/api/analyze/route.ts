// ContextHQ — Internal Analysis API Route
// POST /api/analyze — Powers the UI analysis flow

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { fetchWalletData, RawChainData } from "@/lib/botchain";
import { generateWalletAnalysis } from "@/lib/gemini";
import {
  calculateChainDistribution,
  extractTopHoldings,
  extractProtocolUsage,
  assessRiskProfile,
  buildWalletContext,
} from "@/lib/analyzer";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body or empty payload" },
        { status: 400 }
      );
    }
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Validate format
    const isValidAddress =
      /^0x[a-fA-F0-9]{40}$/.test(address) ||
      /^[a-zA-Z0-9-]+\.[a-zA-Z]+$/.test(address);

    if (!isValidAddress) {
      return NextResponse.json(
        { error: "Invalid wallet address or ENS name" },
        { status: 400 }
      );
    }

    // Step 1: Fetch wallet data from BOT Chain & EVM RPC
    const rawData = await fetchWalletData(address);

    // Step 2: Process data for AI prompt
    const chains = calculateChainDistribution(rawData.chainData);
    const topHoldings = extractTopHoldings(rawData.chainData);
    const protocols = extractProtocolUsage(rawData.chainData);
    const risk = assessRiskProfile(rawData.chainData, chains);

    const totalTransactions = rawData.chainData.reduce(
      (s: number, cd: RawChainData) => s + (cd.summary?.totalCount || cd.transactions.length),
      0
    );

    const firstSeen = rawData.chainData.reduce((earliest: string, cd: RawChainData) => {
      const t = cd.summary?.earliestTransaction;
      return t && t < earliest ? t : earliest;
    }, new Date().toISOString());

    const lastSeen = rawData.chainData.reduce((latest: string, cd: RawChainData) => {
      const t = cd.summary?.latestTransaction;
      return t && t > latest ? t : latest;
    }, "1970-01-01T00:00:00Z");

    // Step 3: Generate AI analysis
    const aiAnalysis = await generateWalletAnalysis({
      address,
      chains: chains.map((c) => ({
        name: c.name,
        balanceUSD: c.balanceUSD,
        percentage: c.percentage,
      })),
      portfolio: {
        totalValueUSD: topHoldings.reduce((s, t) => s + t.valueUSD, 0),
        tokenCount: topHoldings.length,
        topTokens: topHoldings.slice(0, 5).map((t) => `${t.symbol} ($${t.valueUSD.toFixed(2)})`),
      },
      activity: {
        totalTransactions,
        firstSeen,
        lastSeen,
        activeMonths: Math.max(
          1,
          Math.ceil(
            (new Date(lastSeen).getTime() - new Date(firstSeen).getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        ),
      },
      protocols: protocols.map((p) => ({
        name: p.name,
        interactions: p.interactions,
        category: p.category,
      })),
      riskScore: risk.score,
      riskSignals: risk.signals.map((s) => s.description),
    });

    // Step 4: Build complete context object
    const walletContext = buildWalletContext(rawData, aiAnalysis, startTime);

    return NextResponse.json({
      ok: true,
      data: walletContext,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Analysis failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
