import Navbar from "@/components/layout/Navbar";
import TerminalFooter from "@/components/layout/TerminalFooter";

export default function DocsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 pb-20">
        {/* Header */}
        <div className="mb-12">
          <div className="badge badge-green text-[10px] font-[family-name:var(--font-jetbrains)] mb-4 inline-flex">
            DEVELOPER DOCS
          </div>
          <h1 className="text-4xl font-black text-neon uppercase mb-3">
            Integrate Context
          </h1>
          <p className="text-sm text-muted max-w-lg">
            Consume structured wallet intelligence through REST API, TypeScript SDK, or MCP server.
            Three channels, one context object.
          </p>
        </div>

        <div className="space-y-12">
          {/* API Reference */}
          <section id="api">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-neon">01</span> REST API
            </h2>
            <div className="glow-card p-5 space-y-4">
              <div>
                <p className="text-xs text-muted mb-2">Endpoint</p>
                <div className="code-block px-4 py-2.5">
                  <code className="text-neon text-xs font-[family-name:var(--font-jetbrains)]">
                    GET /api/v1/context?address=0x...
                  </code>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted mb-2">Authentication</p>
                <div className="code-block px-4 py-2.5">
                  <pre className="text-neon/80 text-xs font-[family-name:var(--font-jetbrains)]">{`curl -X GET "https://your-domain.com/api/v1/context?address=vitalik.eth" \\
  -H "X-API-Key: ctx_live_your_key_here"`}</pre>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted mb-2">Response</p>
                <div className="code-block px-4 py-3">
                  <pre className="text-neon/80 text-xs font-[family-name:var(--font-jetbrains)]">{`{
  "ok": true,
  "data": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "summary": {
      "identity": "DeFi Power User",
      "identityConfidence": 0.87,
      "walletDNA": ["Multi-chain Native", "DeFi Heavy", ...],
      "aiSummary": "..."
    },
    "chains": [...],
    "portfolio": { "totalValueUSD": 1234567.89, ... },
    "risk": { "level": "low", "score": 12, ... },
    ...
  },
  "meta": { "version": "1.0", "source": "contexthq" }
}`}</pre>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-muted">
                <span>Rate limit: <span className="text-foreground">60 req/min</span></span>
                <span>Auth: <span className="text-foreground">X-API-Key header</span></span>
              </div>
            </div>
          </section>

          {/* SDK */}
          <section id="sdk">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-neon">02</span> TypeScript SDK
            </h2>
            <div className="glow-card p-5 space-y-4">
              <div>
                <p className="text-xs text-muted mb-2">Install</p>
                <div className="code-block px-4 py-2.5">
                  <code className="text-neon text-xs font-[family-name:var(--font-jetbrains)]">
                    npm install @contexthq/sdk
                  </code>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted mb-2">Usage</p>
                <div className="code-block px-4 py-3">
                  <pre className="text-neon/80 text-xs font-[family-name:var(--font-jetbrains)]">{`import { ContextHQ } from '@contexthq/sdk';

const ctx = new ContextHQ({ apiKey: 'ctx_live_...' });

// Get full wallet context
const context = await ctx.getContext('vitalik.eth');

console.log(context.summary.identity);    // "DeFi Power User"
console.log(context.risk.level);           // "low"
console.log(context.chains);               // [{ name: "Ethereum", ... }]

// Pass to your AI agent
const prompt = \`Analyze this wallet: \${JSON.stringify(context)}\`;`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* MCP */}
          <section id="mcp">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-neon">03</span> MCP Server
            </h2>
            <div className="glow-card p-5 space-y-4">
              <p className="text-sm text-muted">
                Connect AI agents directly to ContextHQ via the Model Context Protocol.
                Works with Claude, Cursor, Windsurf, and any MCP-compatible client.
              </p>

              <div>
                <p className="text-xs text-muted mb-2">Configuration (claude_desktop_config.json)</p>
                <div className="code-block px-4 py-3">
                  <pre className="text-neon/80 text-xs font-[family-name:var(--font-jetbrains)]">{`{
  "mcpServers": {
    "contexthq": {
      "command": "npx",
      "args": ["@contexthq/mcp-server"],
      "env": {
        "CONTEXTHQ_API_URL": "https://contexthq.vercel.app",
        "CONTEXTHQ_API_KEY": "ctx_live_your_key"
      }
    }
  }
}`}</pre>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted mb-2">Available Tools</p>
                <div className="space-y-2">
                  {[
                    { name: "get_wallet_context", desc: "Returns full AI-analyzed wallet context" },
                    { name: "get_chain_activity", desc: "Returns active chains for a wallet" },
                    { name: "get_risk_profile", desc: "Returns risk assessment for a wallet" },
                  ].map((tool) => (
                    <div key={tool.name} className="flex items-start gap-3 p-2 rounded bg-surface">
                      <code className="text-neon text-xs font-[family-name:var(--font-jetbrains)] shrink-0">
                        {tool.name}
                      </code>
                      <span className="text-xs text-muted">{tool.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Schema */}
          <section id="schema">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-neon">04</span> Context Object Schema
            </h2>
            <div className="glow-card p-5">
              <div className="code-block px-4 py-3">
                <pre className="text-neon/80 text-xs font-[family-name:var(--font-jetbrains)]">{`interface WalletContext {
  address: string;
  analyzedAt: string;
  summary: {
    aiSummary: string;
    identity: string;           // "DeFi Power User", "NFT Collector", ...
    identityConfidence: number; // 0.5 — 0.95
    walletDNA: string[];        // ["Multi-chain", "Yield Seeker", ...]
    behaviorSummary: string;
  };
  chains: {
    name: string;
    chainId: string;
    percentage: number;
    balanceUSD: number;
  }[];
  portfolio: {
    totalValueUSD: number;
    tokenCount: number;
    topHoldings: { symbol: string; valueUSD: number }[];
  };
  activity: {
    totalTransactions: number;
    firstSeen: string;
    lastSeen: string;
  };
  protocols: { name: string; interactions: number; category: string }[];
  risk: {
    level: "low" | "medium" | "high";
    score: number;              // 0 — 100
    signals: { type: string; severity: string; description: string }[];
  };
  meta: {
    version: string;
    generatedBy: "ContextHQ";
    dataSource: "BOT Chain & EVM Native RPC";
  };
}`}</pre>
              </div>
            </div>
          </section>
        </div>
      </div>

      <TerminalFooter />
    </main>
  );
}
