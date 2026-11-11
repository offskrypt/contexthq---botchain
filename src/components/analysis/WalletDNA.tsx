"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";

interface WalletDNAProps {
  traits: string[];
}

const TRAIT_COLORS: Record<string, string> = {
  "Multi-chain": "badge-green",
  "Multi-chain Native": "badge-green",
  "Cross-chain": "badge-green",
  "DeFi Heavy": "badge-green",
  "DeFi Native": "badge-green",
  "DEX Trader": "badge-green",
  "Yield Seeker": "badge-yellow",
  "Yield Farmer": "badge-yellow",
  "NFT Curious": "badge-neutral",
  "NFT Collector": "badge-neutral",
  "Bridge User": "badge-green",
  "Early Adopter": "badge-green",
  "High Frequency": "badge-yellow",
  "Gas Optimizer": "badge-green",
  "Governance Active": "badge-neutral",
  "Whale": "badge-yellow",
  "Smart Money": "badge-green",
  "Airdrop Farmer": "badge-yellow",
};

export default function WalletDNA({ traits }: WalletDNAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <GlowCard title="WALLET DNA">
        <div className="flex flex-wrap gap-2">
          {traits.map((trait, i) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`badge ${TRAIT_COLORS[trait] || "badge-neutral"} font-[family-name:var(--font-jetbrains)] text-[10px] uppercase font-bold`}
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </GlowCard>
    </motion.div>
  );
}
