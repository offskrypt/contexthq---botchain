# @contexthq/sdk

TypeScript SDK for **ContextHQ** — AI-ready wallet context for on-chain data.

## Install

```bash
npm install @contexthq/sdk
```

## Quick Start

```typescript
import { ContextHQ } from '@contexthq/sdk';

const ctx = new ContextHQ({
  apiKey: 'ctx_live_your_key',
  baseUrl: 'https://your-deployment.com' // optional, defaults to https://contexthq.dev
});

// Get full wallet context
const context = await ctx.getContext('vitalik.eth');

console.log(context.summary.identity);     // "DeFi Power User"
console.log(context.summary.walletDNA);    // ["Multi-chain Native", "DeFi Heavy", ...]
console.log(context.risk.level);            // "low"
console.log(context.portfolio.totalValueUSD); // 1234567.89
console.log(context.chains);                // [{ name: "Ethereum", percentage: 75.2, ... }]
```

## API

### `new ContextHQ(config)`

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | string | Yes | Your ContextHQ API key |
| `baseUrl` | string | No | API base URL (default: `https://contexthq.dev`) |

### Methods

| Method | Returns | Description |
|---|---|---|
| `getContext(address)` | `WalletContext` | Full AI-analyzed wallet context |
| `getRiskProfile(address)` | `WalletContext['risk']` | Risk assessment |
| `getChainActivity(address)` | `ChainActivity[]` | Active chains + distribution |
| `getIdentity(address)` | `WalletContext['summary']` | AI identity classification |
| `getRawResponse(address)` | `ContextAPIResponse` | Raw API response with metadata |

## Use with AI Agents

```typescript
const context = await ctx.getContext('0x...');

// Feed to any LLM
const prompt = `Given this wallet context: ${JSON.stringify(context)}, 
  should we approve this wallet for our lending protocol?`;
```

## License

MIT
