"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    name: "EXTRACT & AGGREGATE",
    desc: "Queries BOT Chain (Chain ID: 677) and EVM mainnets. Retrieves active chains, token balances, transaction history, and contract registrations in parallel.",
    command: "GET /api/v1/context?address=0x...",
  },
  {
    step: "02",
    name: "CLASSIFY & SCORE",
    desc: "Applies deterministic heuristics. Calculates risk markers, parses protocol interaction logs, and generates a structured behavior profile.",
    command: "analyzer.ts -> buildWalletContext()",
  },
  {
    step: "03",
    name: "SUMMARIZE & CONTEXTUALIZE",
    desc: "Uses Gemini 1.5 Flash to synthesize behavior patterns into readable English summaries, assigns high-level identities, and outputs JSON.",
    command: "gemini.ts -> generateWalletAnalysis()",
  },
];

export default function HowItWorks() {
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
            WORKFLOW
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase mb-12">
            The Transformation Pipeline
          </h2>
        </motion.div>

        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
            >
              {/* Step indicator */}
              <div className="flex items-center gap-3">
                <span className="text-neon font-black text-3xl font-[family-name:var(--font-jetbrains)] leading-none">
                  {step.step}
                </span>
                <div className="h-[2px] w-8 bg-neon-border hidden md:block" />
              </div>

              {/* Step content */}
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-bold text-foreground font-[family-name:var(--font-jetbrains)] tracking-wider">
                  {step.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-[family-name:var(--font-jetbrains)] max-w-xl">
                  {step.desc}
                </p>
                <div className="code-block px-3 py-1.5 inline-flex rounded bg-[#090909]">
                  <code className="text-[10px] text-neon/80 font-[family-name:var(--font-jetbrains)]">
                    {step.command}
                  </code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
