// ContextHQ SDK — Type Definitions
// Canonical WalletContext interface for consumers

export interface ChainActivity {
  name: string;
  chainId: string;
  label: string;
  percentage: number;
  lastActive: string;
  balanceUSD: number;
}

export interface TokenHolding {
  symbol: string;
  name: string;
  contractAddress: string;
  balance: number;
  valueUSD: number;
  percentage: number;
  chain: string;
}

export interface ProtocolInteraction {
  name: string;
  address: string;
  interactions: number;
  category: string;
  lastUsed: string;
}

export interface RiskSignal {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
}

export interface ActivityEvent {
  date: string;
  chain: string;
  type: string;
  description: string;
  valueUSD?: number;
}

export interface WalletContext {
  address: string;
  resolvedName?: string;
  analyzedAt: string;

  summary: {
    aiSummary: string;
    identity: string;
    identityConfidence: number;
    walletDNA: string[];
    behaviorSummary: string;
  };

  chains: ChainActivity[];

  portfolio: {
    totalValueUSD: number;
    tokenCount: number;
    topHoldings: TokenHolding[];
  };

  activity: {
    totalTransactions: number;
    firstSeen: string;
    lastSeen: string;
    avgTxPerMonth: number;
    activeMonths: number;
    recentEvents: ActivityEvent[];
  };

  protocols: ProtocolInteraction[];

  risk: {
    level: "low" | "medium" | "high";
    score: number;
    signals: RiskSignal[];
  };

  meta: {
    version: string;
    generatedBy: string;
    dataSource: string;
    apiEndpoint: string;
    processingTimeMs: number;
  };
}

export interface ContextAPIResponse {
  ok: boolean;
  data?: WalletContext;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    version: string;
    generatedAt: string;
    source: string;
  };
}

export interface ContextHQConfig {
  apiKey: string;
  baseUrl?: string;
}
