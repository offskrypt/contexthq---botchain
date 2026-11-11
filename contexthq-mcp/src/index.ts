#!/usr/bin/env node

// ContextHQ MCP Server
// Exposes wallet context tools to AI agents via Model Context Protocol

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = process.env.CONTEXTHQ_API_URL || "https://contexthq.vercel.app";
const API_KEY = process.env.CONTEXTHQ_API_KEY || "";

async function fetchContext(address: string): Promise<any> {
  const response = await fetch(
    `${API_URL}/api/v1/context?address=${encodeURIComponent(address)}`,
    {
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as any;
    throw new Error(
      error?.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data = (await response.json()) as any;
  if (!data.ok) {
    throw new Error(data.error?.message || "Analysis failed");
  }

  return data.data;
}

// Create MCP server
const server = new McpServer({
  name: "contexthq",
  version: "1.0.0",
});

// Tool: Get full wallet context
server.tool(
  "get_wallet_context",
  "Get comprehensive AI-analyzed wallet context including identity, behavior, chain distribution, protocol usage, and risk assessment. Returns a structured context object ready for AI consumption.",
  {
    address: z
      .string()
      .describe(
        "Wallet address (0x...) or ENS name (e.g., vitalik.eth)"
      ),
  } as any,
  async ({ address }: any) => {
    try {
      const context = await fetchContext(address);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(context, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get chain activity
server.tool(
  "get_chain_activity",
  "Get which blockchains a wallet is active on, including balance distribution and last activity timestamps.",
  {
    address: z
      .string()
      .describe("Wallet address (0x...) or ENS name"),
  } as any,
  async ({ address }: any) => {
    try {
      const context = await fetchContext(address);
      const result = {
        address: context.address,
        activeChains: context.chains,
        totalValueUSD: context.portfolio.totalValueUSD,
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text" as const, text: `Error: ${error.message}` },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get risk profile
server.tool(
  "get_risk_profile",
  "Get risk assessment for a wallet including risk level, score, and specific risk signals.",
  {
    address: z
      .string()
      .describe("Wallet address (0x...) or ENS name"),
  } as any,
  async ({ address }: any) => {
    try {
      const context = await fetchContext(address);
      const result = {
        address: context.address,
        identity: context.summary.identity,
        risk: context.risk,
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text" as const, text: `Error: ${error.message}` },
        ],
        isError: true,
      };
    }
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ContextHQ MCP server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
