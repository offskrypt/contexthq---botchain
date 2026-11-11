"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CopyButton from "@/components/ui/CopyButton";

const TABS = [
  {
    id: "api",
    name: "REST API",
    desc: "Integrate ContextHQ using HTTP requests directly into any backend service. Authenticate via custom header key.",
    code: `curl -X GET "https://api.contexthq.dev/api/v1/context?address=vitalik.eth" \\
  -H "X-API-Key: ctx_live_your_key_here"`,
    lang: "bash",
  },
  {
    id: "sdk",
    name: "TypeScript SDK",
    desc: "A lightweight, fully typed package for React, Next.js, Node.js, and browser environments.",
    code: `import { ContextHQ } from '@contexthq/sdk';

const ctx = new ContextHQ({ apiKey: 'ctx_live_...' });
const context = await ctx.getContext('vitalik.eth');

console.log(context.summary.identity); // "DeFi Power User"`,
    lang: "typescript",
  },
  {
    id: "mcp",
    name: "MCP Server",
    desc: "Hook autonomous agents directly into wallet context. Exposes structured tools to LLMs natively.",
    code: `{
  "mcpServers": {
    "contexthq": {
      "command": "npx",
      "args": ["-y", "@contexthq/mcp-server"],
      "env": {
        "CONTEXTHQ_API_URL": "https://api.contexthq.dev",
        "CONTEXTHQ_API_KEY": "ctx_live_your_key"
      }
    }
  }
}`,
    lang: "json",
  },
];

export default function Integration() {
  const [activeTab, setActiveTab] = useState("api");

  const activeData = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="py-20 border-t border-border/40">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge badge-green text-[10px] font-[family-name:var(--font-jetbrains)] mb-4 inline-flex">
            DEVELOPER INTEGRATIONS
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase mb-4">
            Three Channels. One Interface.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-[family-name:var(--font-jetbrains)] max-w-2xl mb-10">
            Consume wallet context programmatically through REST endpoints, a dedicated NPM package, 
            or link agents directly via Model Context Protocol (MCP).
          </p>
        </motion.div>

        {/* Tab triggers */}
        <div className="flex border-b border-border mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs font-bold font-[family-name:var(--font-jetbrains)] border-b-2 -mb-px transition-colors relative ${
                activeTab === tab.id
                  ? "border-neon text-neon"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-4">
          <p className="text-xs text-neutral-400 font-[family-name:var(--font-jetbrains)]">
            {activeData.desc}
          </p>

          <div className="relative">
            <CopyButton
              text={activeData.code}
              className="absolute right-3 top-3 z-10 bg-surface/80"
            />
            <div className="code-block p-5 max-h-[300px] overflow-auto">
              <pre className="text-[11px] text-neon/90 font-[family-name:var(--font-jetbrains)] whitespace-pre leading-relaxed">
                {activeData.code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
