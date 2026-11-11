"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { RiskSignal } from "@/lib/types";

interface RiskSignalsProps {
  level: "low" | "medium" | "high";
  score: number;
  signals: RiskSignal[];
}

const LEVEL_CONFIG = {
  low: { variant: "green" as const, label: "LOW RISK", color: "text-risk-low" },
  medium: { variant: "yellow" as const, label: "MEDIUM RISK", color: "text-risk-medium" },
  high: { variant: "red" as const, label: "HIGH RISK", color: "text-risk-high" },
};

export default function RiskSignals({ level, score, signals }: RiskSignalsProps) {
  const config = LEVEL_CONFIG[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <GlowCard title="RISK SIGNALS">
        <div className="space-y-4">
          {/* Risk level + score */}
          <div className="flex items-center justify-between">
            <Badge variant={config.variant}>{config.label}</Badge>
            <span className={`text-lg font-bold font-[family-name:var(--font-jetbrains)] ${config.color}`}>
              {score}
              <span className="text-xs text-muted">/100</span>
            </span>
          </div>

          {/* Score bar */}
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  level === "low"
                    ? "var(--risk-low)"
                    : level === "medium"
                    ? "var(--risk-medium)"
                    : "var(--risk-high)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>

          {/* Signals */}
          <div className="space-y-2 pt-2">
            {signals.map((signal, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs"
              >
                <span
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                    signal.severity === "low"
                      ? "bg-risk-low"
                      : signal.severity === "medium"
                      ? "bg-risk-medium"
                      : "bg-risk-high"
                  }`}
                />
                <span className="text-muted">{signal.description}</span>
              </div>
            ))}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
