<pre align="center">
 ██████  ██████  ███    ██ ████████ ███████  ██    ██ ████████ ██   ██  ██████  
    ██      ██  ██  ████   ██    ██    ██        ██  ██     ██    ██   ██ ██    ██    
 ██      ██  ██  ██ ██  ██    ██    █████      ████      ██    ███████ ██    ██ 
 ██      ██  ██  ██  ██ ██    ██    ██        ██  ██     ██    ██   ██ ██ ▄▄ ██ 
 ██████  ██████  ██   ████    ██    ███████  ██    ██    ██    ██   ██  ██████  
                                                                            ▀▀ 
</pre>

<p align="center"><strong>AI-Ready Context Layer for BOT Chain & On-Chain Intelligence</strong></p>

---

## Overview
ContextHQ is a **Context as a Service** engine for on-chain wallets, natively integrated with **BOT Chain** (Chain ID: `677`). It queries verified multi-chain and BOT Chain data via native EVM JSON-RPC, verifies on-chain wallet registrations through the `ContextRegistration` smart contract, refines behavior metrics, and uses **Google Gemini AI** to output human-readable profiles and agent-consumable JSON objects.

---

## BOT Chain Integration
- **Network**: BOT Chain Mainnet
- **Chain ID**: `677` (`0x2a5`)
- **RPC URL**: `https://rpc.botchain.ai`
- **Native Currency**: `BOT`
- **Block Explorer**: `https://scan.botchain.ai`
- **ContextRegistration Contract**: `0x6C94e78FE2544CCE5bCBeDd10f14D0dbF42E7416`
- **Contract Registration Fee**: `0.001 BOT`

---

## Key Features
- **BOT Chain Registration & Verification**: Connect Web3 wallets (MetaMask, OKX, Rabby, etc.), switch to BOT Chain with one click, register wallet addresses via smart contract payment, and verify status in real-time.
- **Cross-Chain Scanning**: Maps wallet balances and transaction activity natively across BOT Chain and major EVM chains.
- **AI-Powered Identity & DNA**: Classifies wallet types (e.g., DeFi Power User, Yield Farmer) and extracts specific behavior tags (e.g., Gas Optimizer, Multi-chain Native).
- **Affinity & Risk Profiles**: Calculates protocol interactions and runs automated checks for concentration risk, inactivity, and asset distribution.
- **Multichannel Outputs**: Exposes context objects via a Next.js web application, a public REST API, a TypeScript SDK, and an MCP server.

---

## Tech Stack
- **Frontend / UI**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, TypeScript
- **Smart Contracts & Web3**: Solidity 0.8.20, Ethers.js v6, BOT Chain JSON-RPC
- **AI Summarization**: `@google/generative-ai` (Gemini 1.5 Flash)
- **Agent Integrations**: Model Context Protocol (MCP) SDK

---

## Directory Structure
```
contexthq/
├── contracts/
│   ├── ContextRegistration.sol    # Solidity smart contract for BOT Chain registration
│   └── deployed.json              # Deployed contract metadata and address
├── scripts/
│   ├── deploy.js                  # Deployment script for BOT Chain
│   └── test-registration.js       # Live on-chain verification script
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page with BOT Chain registration card
│   │   ├── docs/                  # In-app integration guides
│   │   ├── analyze/[address]/     # Dynamic analysis dashboard routes
│   │   └── api/
│   │       ├── analyze/           # Internal analysis pipeline endpoint
│   │       └── v1/context/        # Public API route (Auth: X-API-Key)
│   ├── components/                # Layout, Landing, & Dashboard widgets
│   ├── contracts/                 # ContextRegistration ABI & deployment config
│   ├── context/                   # BotChainContext for wallet connectivity
│   ├── lib/
│   │   ├── botchain.ts            # BOT Chain RPC client & multi-chain provider
│   │   ├── gemini.ts              # Prompt template & model configuration
│   │   └── analyzer.ts            # Mathematical scoring & processing logic
│   └── hooks/                     # useAnalysis and useBotChain client state hooks
├── contexthq-sdk/                 # Standalone TypeScript SDK package
└── contexthq-mcp/                 # Standalone Model Context Protocol stdio server
```

---

## Getting Started

### 1. Configure Environment (`.env.local`)
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_BOTCHAIN_RPC=https://rpc.botchain.ai
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x6C94e78FE2544CCE5bCBeDd10f14D0dbF42E7416
GEMINI_API_KEY=your_gemini_api_key_here
CONTEXT_API_KEYS=ctx_dev_test_key
```

### 2. Install & Start Server
```bash
npm install
npm run dev
```

### 3. Deploy Smart Contract (Optional / Re-deploy)
```bash
node scripts/deploy.js
```

---

## Testing Smart Contract Flow
```bash
node scripts/test-registration.js
```
