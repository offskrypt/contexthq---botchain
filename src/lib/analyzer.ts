// ContextHQ — Data Analyzer
// Pure data processing: transforms on-chain data into structured wallet context

import {
  WalletContext,
  ChainActivity,
  TokenHolding,
  ProtocolInteraction,
  RiskSignal,
  ActivityEvent,
} from "./types";
import {
  SUPPORTED_CHAINS,
  RawChainData,
  RawBalance,
  RawTransaction,
} from "./botchain";

export interface RawActiveChain {
  name: string;
  chainId: string;
  chainName: string;
  lastActive: string | null;
}

export interface RawWalletData {
  address: string;
  activeChains: RawActiveChain[];
  chainData: RawChainData[];
}

/**
 * Calculate chain distribution by portfolio value
 */
export function calculateChainDistribution(
  chainData: RawChainData[]
): ChainActivity[] {
  const chainValues = chainData.map((cd) => {
    const totalValue = cd.balances.reduce(
      (sum: number, b: RawBalance) => sum + (b.valueUSD || 0),
      0
    );
    return {
      name: cd.chainLabel,
      chainId: cd.chainName,
      label:
        SUPPORTED_CHAINS.find((c) => c.id === cd.chainName)?.label ||
        cd.chainName,
      balanceUSD: totalValue,
      lastActive: cd.summary?.latestTransaction || new Date().toISOString(),
    };
  });

  const totalPortfolio = chainValues.reduce((s, c) => s + c.balanceUSD, 0);

  return chainValues
    .map((c) => ({
      ...c,
      percentage: totalPortfolio > 0 ? (c.balanceUSD / totalPortfolio) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Extract top token holdings across all chains
 */
export function extractTopHoldings(
  chainData: RawChainData[]
): TokenHolding[] {
  const allTokens: TokenHolding[] = [];

  for (const cd of chainData) {
    for (const token of cd.balances) {
      allTokens.push({
        symbol: token.symbol,
        name: token.name,
        contractAddress: token.contractAddress,
        balance: token.balance,
        valueUSD: token.valueUSD,
        percentage: 0, // calculated below
        chain:
          SUPPORTED_CHAINS.find((c) => c.id === cd.chainName)?.name ||
          cd.chainName,
      });
    }
  }

  const totalValue = allTokens.reduce((s, t) => s + t.valueUSD, 0);

  return allTokens
    .map((t) => ({
      ...t,
      percentage: totalValue > 0 ? (t.valueUSD / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.valueUSD - a.valueUSD)
    .slice(0, 15);
}

/**
 * Extract protocol usage from transaction data
 */
export function extractProtocolUsage(
  chainData: RawChainData[]
): ProtocolInteraction[] {
  const protocolMap = new Map<
    string,
    { count: number; address: string; chain: string; lastUsed: string }
  >();

  for (const cd of chainData) {
    for (const tx of cd.transactions) {
      const label = tx.toLabel || tx.to;
      if (!label) continue;

      const key = label.toLowerCase();
      const existing = protocolMap.get(key);

      if (existing) {
        existing.count++;
        if (tx.date > existing.lastUsed) existing.lastUsed = tx.date;
      } else {
        protocolMap.set(key, {
          count: 1,
          address: tx.to,
          chain: cd.chainLabel,
          lastUsed: tx.date || new Date().toISOString(),
        });
      }
    }
  }

  // Categorize protocols
  const categorize = (name: string): string => {
    const n = name.toLowerCase();
    if (
      n.includes("swap") ||
      n.includes("uniswap") ||
      n.includes("sushi") ||
      n.includes("pancake") ||
      n.includes("1inch") ||
      n.includes("dex")
    )
      return "DEX";
    if (
      n.includes("aave") ||
      n.includes("compound") ||
      n.includes("lend") ||
      n.includes("borrow")
    )
      return "Lending";
    if (
      n.includes("bridge") ||
      n.includes("hop") ||
      n.includes("stargate") ||
      n.includes("across")
    )
      return "Bridge";
    if (
      n.includes("stake") ||
      n.includes("lido") ||
      n.includes("rocket") ||
      n.includes("staking")
    )
      return "Staking";
    if (
      n.includes("nft") ||
      n.includes("opensea") ||
      n.includes("blur") ||
      n.includes("seaport")
    )
      return "NFT";
    if (
      n.includes("vault") ||
      n.includes("yearn") ||
      n.includes("convex") ||
      n.includes("farm")
    )
      return "Yield";
    return "Other";
  };

  return Array.from(protocolMap.entries())
    .map(([name, data]) => ({
      name: name.length > 42 ? `${name.slice(0, 6)}...${name.slice(-4)}` : name,
      address: data.address,
      interactions: data.count,
      category: categorize(name),
      lastUsed: data.lastUsed,
    }))
    .sort((a, b) => b.interactions - a.interactions)
    .slice(0, 10);
}

/**
 * Assess risk profile from wallet data
 */
export function assessRiskProfile(
  chainData: RawChainData[],
  chains: ChainActivity[]
): { level: "low" | "medium" | "high"; score: number; signals: RiskSignal[] } {
  const signals: RiskSignal[] = [];
  let riskScore = 0;

  // Check concentration risk
  if (chains.length > 0 && chains[0].percentage > 90) {
    signals.push({
      type: "concentration",
      severity: "medium",
      description: `${chains[0].percentage.toFixed(0)}% of portfolio on a single chain (${chains[0].name})`,
    });
    riskScore += 20;
  }

  // Check dormancy
  const allTxDates = chainData.flatMap((cd) =>
    cd.transactions.map((tx: RawTransaction) => new Date(tx.date).getTime())
  );
  if (allTxDates.length > 0) {
    const lastTx = Math.max(...allTxDates);
    const daysSinceLastTx =
      (Date.now() - lastTx) / (1000 * 60 * 60 * 24);
    if (daysSinceLastTx > 180) {
      signals.push({
        type: "dormancy",
        severity: "medium",
        description: `No transactions in ${Math.floor(daysSinceLastTx)} days`,
      });
      riskScore += 15;
    } else if (daysSinceLastTx > 365) {
      signals.push({
        type: "dormancy",
        severity: "high",
        description: `Wallet dormant for over a year`,
      });
      riskScore += 30;
    }
  }

  // Check token diversity
  const allTokens = chainData.flatMap((cd) => cd.balances);
  const totalValue = allTokens.reduce(
    (s: number, t: RawBalance) => s + (t.valueUSD || 0),
    0
  );
  if (allTokens.length > 0 && totalValue > 0) {
    const topTokenPct =
      ((allTokens[0]?.valueUSD || 0) / totalValue) * 100;
    if (topTokenPct > 80) {
      signals.push({
        type: "token_concentration",
        severity: "medium",
        description: `${topTokenPct.toFixed(0)}% in single token (${allTokens[0]?.symbol})`,
      });
      riskScore += 15;
    }
  }

  // Check multi-chain diversification (positive signal)
  const activeChainsCount = chains.filter((c) => c.balanceUSD > 0).length;
  if (activeChainsCount >= 3) {
    signals.push({
      type: "diversification",
      severity: "low",
      description: `Active across ${activeChainsCount} chains — well-diversified`,
    });
  }

  // Check transaction volume
  const totalTxns = chainData.reduce(
    (s, cd) => s + (cd.summary?.totalCount || cd.transactions.length),
    0
  );
  if (totalTxns > 1000) {
    signals.push({
      type: "high_activity",
      severity: "low",
      description: `High transaction volume (${totalTxns.toLocaleString()} txns) indicates experienced user`,
    });
  } else if (totalTxns < 10) {
    signals.push({
      type: "low_activity",
      severity: "medium",
      description: `Very low transaction count (${totalTxns}) — limited on-chain history`,
    });
    riskScore += 10;
  }

  // Determine risk level
  let level: "low" | "medium" | "high" = "low";
  if (riskScore >= 40) level = "high";
  else if (riskScore >= 20) level = "medium";

  return {
    level,
    score: Math.min(riskScore, 100),
    signals,
  };
}

/**
 * Extract recent activity events
 */
export function extractActivityEvents(
  chainData: RawChainData[]
): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const cd of chainData) {
    for (const tx of cd.transactions.slice(0, 5)) {
      const isOutgoing =
        tx.from?.toLowerCase() === cd.chainName.toLowerCase() || tx.valueQuote > 0;

      events.push({
        date: tx.date,
        chain: cd.chainLabel,
        type: tx.toLabel ? "Contract Interaction" : isOutgoing ? "Transfer Out" : "Transfer In",
        description: tx.toLabel
          ? `Interacted with ${tx.toLabel}`
          : `${isOutgoing ? "Sent" : "Received"} ${tx.valueQuote > 0 ? `$${tx.valueQuote.toFixed(2)}` : "tokens"}`,
        valueUSD: tx.valueQuote || undefined,
      });
    }
  }

  return events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);
}

/**
 * Calculate activity metrics
 */
export function calculateActivityMetrics(chainData: RawChainData[]) {
  let totalTransactions = 0;
  let firstSeen = new Date().toISOString();
  let lastSeen = "1970-01-01T00:00:00Z";

  for (const cd of chainData) {
    totalTransactions += cd.summary?.totalCount || cd.transactions.length;

    if (cd.summary?.earliestTransaction && cd.summary.earliestTransaction < firstSeen) {
      firstSeen = cd.summary.earliestTransaction;
    }
    if (cd.summary?.latestTransaction && cd.summary.latestTransaction > lastSeen) {
      lastSeen = cd.summary.latestTransaction;
    }
  }

  const firstDate = new Date(firstSeen);
  const lastDate = new Date(lastSeen);
  const monthsDiff =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (lastDate.getMonth() - firstDate.getMonth()) + 1;

  return {
    totalTransactions,
    firstSeen,
    lastSeen: lastSeen === "1970-01-01T00:00:00Z" ? new Date().toISOString() : lastSeen,
    avgTxPerMonth: monthsDiff > 0 ? Math.round(totalTransactions / monthsDiff) : totalTransactions,
    activeMonths: Math.max(monthsDiff, 1),
  };
}

/**
 * Build the complete WalletContext object from raw data + AI analysis
 */
export function buildWalletContext(
  rawData: RawWalletData,
  aiAnalysis: {
    aiSummary: string;
    identity: string;
    identityConfidence: number;
    walletDNA: string[];
    behaviorSummary: string;
    riskAssessment?: string;
  },
  startTime: number
): WalletContext {
  const chains = calculateChainDistribution(rawData.chainData);
  const topHoldings = extractTopHoldings(rawData.chainData);
  const protocols = extractProtocolUsage(rawData.chainData);
  const risk = assessRiskProfile(rawData.chainData, chains);
  const activity = calculateActivityMetrics(rawData.chainData);
  const recentEvents = extractActivityEvents(rawData.chainData);

  const totalValueUSD = topHoldings.reduce((s, t) => s + t.valueUSD, 0);

  return {
    address: rawData.address,
    analyzedAt: new Date().toISOString(),

    summary: {
      aiSummary: aiAnalysis.aiSummary,
      identity: aiAnalysis.identity,
      identityConfidence: aiAnalysis.identityConfidence,
      walletDNA: aiAnalysis.walletDNA,
      behaviorSummary: aiAnalysis.behaviorSummary,
    },

    chains,

    portfolio: {
      totalValueUSD,
      tokenCount: topHoldings.length,
      topHoldings,
    },

    activity: {
      ...activity,
      recentEvents,
    },

    protocols,
    risk,

    meta: {
      version: "1.0.0",
      generatedBy: "ContextHQ",
      dataSource: "BOT Chain & EVM Native RPC",
      apiEndpoint: "/api/v1/context",
      processingTimeMs: Date.now() - startTime,
    },
  };
}
