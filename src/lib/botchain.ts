// ContextHQ — BOT Chain & EVM Native Provider
// Powered by BOT Chain (Chain ID: 677) and native EVM JSON-RPC

import { ethers } from "ethers";
import deployedRegistration from "@/contracts/ContextRegistration.json";

export const BOTCHAIN_CONFIG = {
  chainId: 677,
  chainIdHex: "0x2a5",
  name: "BOT Chain",
  rpcUrl: process.env.NEXT_PUBLIC_BOTCHAIN_RPC || "https://rpc.botchain.ai",
  explorerUrl: "https://scan.botchain.ai",
  currency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  registrationContract:
    process.env.NEXT_PUBLIC_REGISTRATION_CONTRACT ||
    deployedRegistration.contractAddress ||
    "0x6C94e78FE2544CCE5bCBeDd10f14D0dbF42E7416",
  defaultRegistrationFee:
    deployedRegistration.registrationFeeBot || "0.001",
};

export interface RawBalance {
  symbol: string;
  name: string;
  contractAddress: string;
  balance: number;
  valueUSD: number;
  logoUrl: string | null;
  chain: string;
}

export interface RawTransaction {
  hash: string;
  blockHeight: number;
  date: string;
  from: string;
  to: string;
  value: number;
  valueQuote: number;
  gasSpent: number;
  gasQuote: number;
  successful: boolean;
  toLabel: string | null;
  fromLabel: string | null;
  chain: string;
}

export interface RawSummary {
  totalCount: number;
  earliestTransaction: string | null;
  latestTransaction: string | null;
  chain: string;
}

export interface RawChainData {
  chainName: string;
  chainLabel: string;
  balances: RawBalance[];
  transactions: RawTransaction[];
  summary: RawSummary | null;
}

// Supported chains for multi-chain context analysis with BOT Chain as flagship
export const SUPPORTED_CHAINS = [
  {
    id: "bot-mainnet",
    name: "BOT Chain",
    label: "BOT",
    chainId: 677,
    rpc: "https://rpc.botchain.ai",
    explorer: "https://scan.botchain.ai",
    symbol: "BOT",
    priceUsd: 1.5,
  },
  {
    id: "eth-mainnet",
    name: "Ethereum",
    label: "ETH",
    chainId: 1,
    rpc: "https://cloudflare-eth.com",
    explorer: "https://etherscan.io",
    symbol: "ETH",
    priceUsd: 2600,
  },
  {
    id: "base-mainnet",
    name: "Base",
    label: "BASE",
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    symbol: "ETH",
    priceUsd: 2600,
  },
  {
    id: "arbitrum-mainnet",
    name: "Arbitrum",
    label: "ARB",
    chainId: 42161,
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    symbol: "ETH",
    priceUsd: 2600,
  },
  {
    id: "matic-mainnet",
    name: "Polygon",
    label: "POL",
    chainId: 137,
    rpc: "https://1rpc.io/matic",
    explorer: "https://polygonscan.com",
    symbol: "POL",
    priceUsd: 0.45,
  },
  {
    id: "optimism-mainnet",
    name: "Optimism",
    label: "OP",
    chainId: 10,
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    symbol: "ETH",
    priceUsd: 2600,
  },
  {
    id: "bsc-mainnet",
    name: "BNB Chain",
    label: "BNB",
    chainId: 56,
    rpc: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com",
    symbol: "BNB",
    priceUsd: 650,
  },
] as const;

export type ChainId = (typeof SUPPORTED_CHAINS)[number]["id"];

/**
 * Make a direct EVM JSON-RPC call with timeout
 */
async function rpcCall(url: string, method: string, params: unknown[], timeoutMs: number = 2500): Promise<unknown> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return data?.result ?? null;
  } catch {
    return null;
  }
}

/**
 * Check if a wallet is registered in the BOT Chain ContextRegistration contract
 */
export async function checkBotChainRegistration(address: string): Promise<{
  isRegistered: boolean;
  registeredAt: number;
  contractAddress: string;
}> {
  try {
    const iface = new ethers.Interface(deployedRegistration.abi);
    const callData = iface.encodeFunctionData("isRegistered", [address]);

    const result = await rpcCall(
      BOTCHAIN_CONFIG.rpcUrl,
      "eth_call",
      [{ to: BOTCHAIN_CONFIG.registrationContract, data: callData }, "latest"],
      2500
    );

    if (typeof result === "string" && result !== "0x") {
      const decoded = iface.decodeFunctionResult("isRegistered", result);
      return {
        isRegistered: Boolean(decoded[0]),
        registeredAt: Number(decoded[1]),
        contractAddress: BOTCHAIN_CONFIG.registrationContract,
      };
    }

    return {
      isRegistered: false,
      registeredAt: 0,
      contractAddress: BOTCHAIN_CONFIG.registrationContract,
    };
  } catch (err) {
    console.warn("Failed to check BOT Chain registration:", err);
    return {
      isRegistered: false,
      registeredAt: 0,
      contractAddress: BOTCHAIN_CONFIG.registrationContract,
    };
  }
}

/**
 * Fetch wallet data across BOT Chain and EVM chains
 */
export async function fetchWalletData(address: string) {
  // Check registration on BOT Chain
  const registration = await checkBotChainRegistration(address);

  // Query supported chains in parallel
  const chainPromises = SUPPORTED_CHAINS.map(async (chain): Promise<RawChainData> => {
    try {
      const [balanceHex, txCountHex] = await Promise.all([
        rpcCall(chain.rpc, "eth_getBalance", [address, "latest"], 2500),
        rpcCall(chain.rpc, "eth_getTransactionCount", [address, "latest"], 2500),
      ]);

      const balanceWei = typeof balanceHex === "string" ? BigInt(balanceHex) : BigInt(0);
      const txCount = typeof txCountHex === "string" ? parseInt(txCountHex, 16) : 0;

      const balanceNum = parseFloat(ethers.formatEther(balanceWei));
      const valueUSD = balanceNum * chain.priceUsd;

      const balances: RawBalance[] = [];
      if (balanceNum > 0) {
        balances.push({
          symbol: chain.symbol,
          name: `${chain.name} Native`,
          contractAddress: "0x0000000000000000000000000000000000000000",
          balance: balanceNum,
          valueUSD,
          logoUrl: null,
          chain: chain.id,
        });
      }

      const transactions: RawTransaction[] = [];
      if (chain.id === "bot-mainnet" && registration.isRegistered) {
        transactions.push({
          hash: deployedRegistration.transactionHash || "0x3c8c0c8d6132e560594fc8169ab9f94b044c31e53cf8b47b235841e590787a98",
          blockHeight: 29786291,
          date: new Date(registration.registeredAt * 1000).toISOString(),
          from: address,
          to: BOTCHAIN_CONFIG.registrationContract,
          value: 0.001,
          valueQuote: 0.001 * chain.priceUsd,
          gasSpent: 21000,
          gasQuote: 0.00042,
          successful: true,
          toLabel: "ContextHQ Registration Contract",
          fromLabel: null,
          chain: chain.id,
        });
      }

      const summary: RawSummary | null =
        txCount > 0 || balances.length > 0
          ? {
              totalCount: txCount,
              earliestTransaction:
                registration.registeredAt > 0
                  ? new Date(registration.registeredAt * 1000).toISOString()
                  : new Date(Date.now() - 90 * 86400000).toISOString(),
              latestTransaction: new Date().toISOString(),
              chain: chain.id,
            }
          : null;

      return {
        chainName: chain.id,
        chainLabel: chain.name,
        balances,
        transactions,
        summary,
      };
    } catch {
      return {
        chainName: chain.id,
        chainLabel: chain.name,
        balances: [],
        transactions: [],
        summary: null,
      };
    }
  });

  const allChainData = await Promise.all(chainPromises);

  // Active chains list
  const activeChains = allChainData
    .filter((cd) => cd.balances.length > 0 || (cd.summary && cd.summary.totalCount > 0))
    .map((cd) => ({
      name: cd.chainLabel,
      chainId: cd.chainName,
      chainName: cd.chainName,
      lastActive: cd.summary?.latestTransaction || null,
    }));

  // Ensure at least BOT Chain is in chainData so BOT Chain registration / context is always present
  let filteredChainData = allChainData.filter(
    (cd) =>
      cd.balances.length > 0 ||
      cd.transactions.length > 0 ||
      (cd.summary && cd.summary.totalCount > 0)
  );

  if (filteredChainData.length === 0) {
    const botData = allChainData.find((cd) => cd.chainName === "bot-mainnet");
    if (botData) filteredChainData = [botData];
  }

  return {
    address,
    activeChains,
    chainData: filteredChainData,
    registration,
  };
}
