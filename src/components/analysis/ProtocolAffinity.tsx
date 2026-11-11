"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { ProtocolInteraction } from "@/lib/types";

interface ProtocolAffinityProps {
  protocols: ProtocolInteraction[];
}

const CATEGORY_VARIANT: Record<string, "green" | "yellow" | "red" | "neutral"> = {
  DEX: "green",
  Lending: "yellow",
  Bridge: "green",
  Staking: "green",
  NFT: "neutral",
  Yield: "yellow",
  Other: "neutral",
};

export default function ProtocolAffinity({ protocols }: ProtocolAffinityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <GlowCard title="PROTOCOL AFFINITY">
        {protocols.length > 0 ? (
          <div className="space-y-2.5">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground truncate max-w-[180px]">
                    {protocol.name}
                  </span>
                  <Badge variant={CATEGORY_VARIANT[protocol.category] || "neutral"}>
                    {protocol.category}
                  </Badge>
                </div>
                <span className="text-xs text-foreground font-bold font-[family-name:var(--font-jetbrains)]">
                  {protocol.interactions}x
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted">No protocol interactions detected.</p>
        )}
      </GlowCard>
    </motion.div>
  );
}
