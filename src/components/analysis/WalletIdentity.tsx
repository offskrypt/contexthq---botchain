"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";

interface WalletIdentityProps {
  identity: string;
  confidence: number;
  address: string;
  totalValueUSD: number;
}

export default function WalletIdentity({
  identity,
  confidence,
  address,
  totalValueUSD,
}: WalletIdentityProps) {
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <GlowCard title="WALLET IDENTITY">
        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-[family-name:var(--font-jetbrains)]">
              {shortAddr}
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-foreground font-bold font-[family-name:var(--font-jetbrains)]">
              ${totalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Identity label */}
          <h2 className="text-2xl font-black text-foreground uppercase">{identity}</h2>

          {/* Confidence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-[family-name:var(--font-jetbrains)]">Confidence</span>
              <span className="text-xs text-foreground font-bold font-[family-name:var(--font-jetbrains)]">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1 bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
