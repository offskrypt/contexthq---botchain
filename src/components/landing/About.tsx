"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";

const FEATURES = [
  {
    title: "Verified Cross-Chain Intelligence",
    description:
      "Direct API-driven querying across 100+ EVM chains. Eliminates multi-hop indexers and query latency.",
    badge: "BOT Chain Native",
  },
  {
    title: "AI-Ready Structured Context",
    description:
      "Output targets JSON schemas optimized directly for LLMs, autonomous agents, and decision engines.",
    badge: "Agent Optimized",
  },
  {
    title: "Clinical Behavior DNA",
    description:
      "Deep wallet classifications, protocol affinities, and real-time risk markers parsed deterministically.",
    badge: "Risk & Affinity Score",
  },
];

export default function About() {
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
            ABOUT THE PROJECT
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase mb-6">
            The Infrastructure Layer for On-Chain Agents
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-[family-name:var(--font-jetbrains)] max-w-2xl mb-12">
            ContextHQ bridges the gap between raw, distributed blockchain transactions and structured, intelligent context. 
            By standardizing cross-chain histories into structured DNA profiles, we turn complex transactions into actionable context 
            for autonomous agent workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlowCard title={feat.title} badge={feat.badge} className="h-full flex flex-col justify-between">
                <p className="text-xs text-neutral-400 leading-relaxed font-[family-name:var(--font-jetbrains)] mt-2">
                  {feat.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
