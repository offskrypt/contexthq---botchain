"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import { ChainActivity } from "@/lib/types";

interface ChainJourneyProps {
  chains: ChainActivity[];
}

export default function ChainJourney({ chains }: ChainJourneyProps) {
  const maxPercentage = Math.max(...chains.map((c) => c.percentage), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <GlowCard title="CROSS-CHAIN JOURNEY">
        <div className="space-y-3">
          {chains.map((chain, i) => (
            <div key={chain.chainId} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{chain.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted font-[family-name:var(--font-jetbrains)]">
                    ${chain.balanceUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-foreground font-bold font-[family-name:var(--font-jetbrains)] w-12 text-right">
                    {chain.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1 bg-surface rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(chain.percentage / maxPercentage) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                />
              </div>
            </div>
          ))}

          {chains.length === 0 && (
            <p className="text-xs text-muted">No cross-chain activity detected.</p>
          )}
        </div>
      </GlowCard>
    </motion.div>
  );
}
