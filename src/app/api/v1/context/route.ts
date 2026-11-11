// ContextHQ — Public API v1
// GET /api/v1/context?address=0x... — Returns structured WalletContext for agent consumption

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
import { ContextAPIResponse } from "@/lib/types";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(apiKey);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(apiKey, { count: 1, resetAt: now + 60000 }); // 60 req/min
    return true;
  }

  if (entry.count >= 60) return false;

  entry.count++;
  return true;
}

function validateApiKey(key: string | null): boolean {
  if (!key) return false;

  // In development, accept any non-empty key
  if (process.env.NODE_ENV === "development") return true;

  const validKeys = (process.env.CONTEXT_API_KEYS || "").split(",").map((k) => k.trim());
  return validKeys.includes(key);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Auth
  const apiKey = request.headers.get("x-api-key");
  if (!validateApiKey(apiKey)) {
    const response: ContextAPIResponse = {
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or missing API key. Pass via X-API-Key header." },
      meta: { version: "1.0", generatedAt: new Date().toISOString(), source: "contexthq" },
    };
    return NextResponse.json(response, { status: 401 });
  }

  // Rate limit
  if (!checkRateLimit(apiKey!)) {
    const response: ContextAPIResponse = {
      ok: false,
      error: { code: "RATE_LIMITED", message: "Rate limit exceeded. Max 60 requests per minute." },
      meta: { version: "1.0", generatedAt: new Date().toISOString(), source: "contexthq" },
    };
    return NextResponse.json(response, { status: 429 });
  }

  // Get address
  const address = request.nextUrl.searchParams.get("address");
  if (!address) {
    const response: ContextAPIResponse = {
      ok: false,
      error: { code: "MISSING_ADDRESS", message: "Query parameter 'address' is required." },
      meta: { version: "1.0", generatedAt: new Date().toISOString(), source: "contexthq" },
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Validate
  const isValid =
    /^0x[a-fA-F0-9]{40}$/.test(address) ||
    /^[a-zA-Z0-9-]+\.[a-zA-Z]+$/.test(address);

  if (!isValid) {
    const response: ContextAPIResponse = {
      ok: false,
      error: { code: "INVALID_ADDRESS", message: "Invalid wallet address or ENS name." },
      meta: { version: "1.0", generatedAt: new Date().toISOString(), source: "contexthq" },
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    // Fetch and analyze
    const rawData = await fetchWalletData(address);

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

    const aiAnalysis = await generateWalletAnalysis({
      address,
      chains: chains.map((c) => ({ name: c.name, balanceUSD: c.balanceUSD, percentage: c.percentage })),
      portfolio: {
        totalValueUSD: topHoldings.reduce((s, t) => s + t.valueUSD, 0),
        tokenCount: topHoldings.length,
        topTokens: topHoldings.slice(0, 5).map((t) => `${t.symbol} ($${t.valueUSD.toFixed(2)})`),
      },
      activity: {
        totalTransactions,
        firstSeen,
        lastSeen,
        activeMonths: Math.max(1, Math.ceil((new Date(lastSeen).getTime() - new Date(firstSeen).getTime()) / (1000 * 60 * 60 * 24 * 30))),
      },
      protocols: protocols.map((p) => ({ name: p.name, interactions: p.interactions, category: p.category })),
      riskScore: risk.score,
      riskSignals: risk.signals.map((s) => s.description),
    });

    const walletContext = buildWalletContext(rawData, aiAnalysis, startTime);

    const response: ContextAPIResponse = {
      ok: true,
      data: walletContext,
      meta: {
        version: "1.0",
        generatedAt: new Date().toISOString(),
        source: "contexthq",
      },
    };

    return NextResponse.json(response, {
      headers: {
        "X-ContextHQ-Version": "1.0",
        "X-Processing-Time-Ms": String(Date.now() - startTime),
      },
    });
  } catch (error) {
    console.error("Public API error:", error);
    const response: ContextAPIResponse = {
      ok: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: error instanceof Error ? error.message : "Analysis failed.",
      },
      meta: { version: "1.0", generatedAt: new Date().toISOString(), source: "contexthq" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
