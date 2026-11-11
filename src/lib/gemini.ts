// ContextHQ — Gemini AI Integration
// Generates AI-powered wallet analysis using Google Gemini

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface WalletDataForAI {
  address: string;
  chains: { name: string; balanceUSD: number; percentage: number }[];
  portfolio: { totalValueUSD: number; tokenCount: number; topTokens: string[] };
  activity: {
    totalTransactions: number;
    firstSeen: string;
    lastSeen: string;
    activeMonths: number;
  };
  protocols: { name: string; interactions: number; category: string }[];
  riskScore: number;
  riskSignals: string[];
}

interface AIAnalysisResult {
  aiSummary: string;
  identity: string;
  identityConfidence: number;
  walletDNA: string[];
  behaviorSummary: string;
}

/**
 * Generate AI-powered wallet analysis
 */
export async function generateWalletAnalysis(
  data: WalletDataForAI
): Promise<AIAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildPrompt(data);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return parseAIResponse(text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return getFallbackAnalysis(data);
  }
}

function buildPrompt(data: WalletDataForAI): string {
  return `You are an expert blockchain analyst. Analyze this wallet data and provide structured intelligence.

WALLET DATA:
- Address: ${data.address}
- Portfolio Value: $${data.portfolio.totalValueUSD.toFixed(2)}
- Token Count: ${data.portfolio.tokenCount}
- Top Tokens: ${data.portfolio.topTokens.join(", ")}
- Active Chains: ${data.chains.map((c) => `${c.name} (${c.percentage.toFixed(1)}%)`).join(", ")}
- Total Transactions: ${data.activity.totalTransactions}
- First Activity: ${data.activity.firstSeen}
- Last Activity: ${data.activity.lastSeen}
- Active Months: ${data.activity.activeMonths}
- Protocol Interactions: ${data.protocols.map((p) => `${p.name} (${p.category}, ${p.interactions}x)`).join(", ")}
- Risk Score: ${data.riskScore}/100
- Risk Signals: ${data.riskSignals.join("; ")}

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, pure JSON):
{
  "aiSummary": "A concise 2-3 sentence summary of this wallet's on-chain identity and behavior. Be specific, use data points. Write like an analyst, not a marketer.",
  "identity": "One of: DeFi Power User, NFT Collector, Yield Farmer, Cross-chain Explorer, Dormant Whale, Active Trader, Protocol Tester, New User, Bridge Specialist, Staking Maximalist, Airdrop Farmer, Smart Money, Casual User, DAO Participant",
  "identityConfidence": 0.85,
  "walletDNA": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "behaviorSummary": "A detailed 3-4 sentence behavioral analysis. Cover trading patterns, protocol preferences, risk appetite, and notable behaviors."
}

RULES:
- walletDNA should be 4-6 concise behavioral traits like "Multi-chain Native", "DeFi Heavy", "Gas Optimizer", "Early Adopter", "High Frequency", "Yield Seeker", "NFT Curious", "Bridge User", "Governance Active"
- identityConfidence should be between 0.5 and 0.95
- Be data-driven. Reference specific numbers.
- Keep tone analytical, concise, and professional.`;
}

function parseAIResponse(text: string): AIAnalysisResult {
  try {
    // Clean up any markdown formatting that Gemini might add
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    return {
      aiSummary: parsed.aiSummary || "Analysis unavailable.",
      identity: parsed.identity || "Unknown",
      identityConfidence: Math.min(
        Math.max(parsed.identityConfidence || 0.5, 0.5),
        0.95
      ),
      walletDNA: Array.isArray(parsed.walletDNA)
        ? parsed.walletDNA.slice(0, 6)
        : [],
      behaviorSummary: parsed.behaviorSummary || "Behavior analysis unavailable.",
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Raw response:", text);
    return {
      aiSummary: text.slice(0, 300),
      identity: "Unknown",
      identityConfidence: 0.5,
      walletDNA: ["Unclassified"],
      behaviorSummary: text.slice(0, 500),
    };
  }
}

function getFallbackAnalysis(data: WalletDataForAI): AIAnalysisResult {
  // Deterministic fallback when Gemini is unavailable
  const traits: string[] = [];
  let identity = "Casual User";

  if (data.chains.length >= 3) traits.push("Multi-chain Native");
  if (data.activity.totalTransactions > 500) {
    traits.push("High Frequency");
    identity = "Active Trader";
  }
  if (data.portfolio.totalValueUSD > 100000) {
    traits.push("Whale");
    identity = "DeFi Power User";
  }
  if (data.protocols.some((p) => p.category === "DEX"))
    traits.push("DEX Trader");
  if (data.protocols.some((p) => p.category === "Lending"))
    traits.push("DeFi Heavy");
  if (data.protocols.some((p) => p.category === "Bridge"))
    traits.push("Bridge User");
  if (data.activity.activeMonths > 24) traits.push("Early Adopter");

  if (traits.length === 0) traits.push("Explorer");

  return {
    aiSummary: `Wallet ${data.address.slice(0, 6)}...${data.address.slice(-4)} holds $${data.portfolio.totalValueUSD.toFixed(2)} across ${data.chains.length} chain(s) with ${data.activity.totalTransactions} total transactions over ${data.activity.activeMonths} months of activity.`,
    identity,
    identityConfidence: 0.6,
    walletDNA: traits.slice(0, 6),
    behaviorSummary: `This wallet has been active for ${data.activity.activeMonths} months across ${data.chains.length} chains. Portfolio is valued at $${data.portfolio.totalValueUSD.toFixed(2)} with ${data.portfolio.tokenCount} tokens.`,
  };
}
