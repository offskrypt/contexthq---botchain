"use client";

import { motion } from "framer-motion";
import BotChainBadge from "@/components/botchain/BotChainBadge";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mb-7 inline-flex items-center gap-2 border border-neon bg-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon font-[family-name:var(--font-jetbrains)]">
          <span className="h-1.5 w-1.5 rounded-full bg-neon" />
          Context as a service
        </div>

        <h1 className="max-w-[8.6em] text-[54px] font-black uppercase leading-[0.82] tracking-normal text-neon sm:text-[74px] md:text-[86px] lg:text-[74px] xl:text-[88px] 2xl:text-[100px]">
          The
          <br />
          Context
          <br />
          Layer
        </h1>
      </motion.div>

      <motion.p
        className="mt-7 max-w-[560px] text-sm leading-6 text-neutral-400 font-[family-name:var(--font-jetbrains)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        Verified wallet intelligence across 100+ chains.
        <br />
        Structured for humans. Ready for agents.
      </motion.p>

      <motion.div
        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted font-[family-name:var(--font-jetbrains)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-neon" />
          Cross-Chain
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-neon" />
          AI-Ready
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-neon" />
          Agent-Friendly
        </span>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <BotChainBadge />
      </motion.div>
    </div>
  );
}
