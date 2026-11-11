# @contexthq/mcp-server

MCP server for **ContextHQ** — AI-ready wallet context for on-chain data.

Connect AI agents (Claude, Cursor, Windsurf, etc.) directly to structured wallet intelligence.

## Setup

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CONTEXTHQ_API_URL` | Yes | ContextHQ API base URL (e.g., `https://contexthq.vercel.app`) |
| `CONTEXTHQ_API_KEY` | Yes | Your ContextHQ API key |

### Claude Desktop Configuration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "contexthq": {
      "command": "npx",
      "args": ["@contexthq/mcp-server"],
      "env": {
        "CONTEXTHQ_API_URL": "https://contexthq.vercel.app",
        "CONTEXTHQ_API_KEY": "your_api_key"
      }
    }
  }
}
```

## Available Tools

### `get_wallet_context`
Returns full AI-analyzed wallet context including identity, behavior, chain distribution, protocol usage, and risk assessment.

**Parameters:**
- `address` (string, required): Wallet address (0x...) or ENS name

### `get_chain_activity`
Returns which blockchains a wallet is active on with balance distribution.

**Parameters:**
- `address` (string, required): Wallet address or ENS name

### `get_risk_profile`
Returns risk assessment including risk level, score, and specific signals.

**Parameters:**
- `address` (string, required): Wallet address or ENS name

## Development

```bash
npm install
npm run dev
```
