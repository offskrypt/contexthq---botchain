"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";

interface ActivityTimelineProps {
  totalTransactions: number;
  firstSeen: string;
  lastSeen: string;
  avgTxPerMonth: number;
  activeMonths: number;
}

export default function ActivityTimeline({
  totalTransactions,
  firstSeen,
  lastSeen,
  avgTxPerMonth,
  activeMonths,
}: ActivityTimelineProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const metrics = [
    { label: "Total Txns", value: totalTransactions.toLocaleString() },
    { label: "First Seen", value: formatDate(firstSeen) },
    { label: "Last Active", value: formatDate(lastSeen) },
    { label: "Avg/Month", value: avgTxPerMonth.toString() },
    { label: "Active Months", value: activeMonths.toString() },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <GlowCard title="ACTIVITY TIMELINE">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="text-xs text-muted mb-1">{metric.label}</p>
              <p className="text-sm font-semibold text-foreground font-[family-name:var(--font-jetbrains)]">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Visual timeline */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="font-[family-name:var(--font-jetbrains)]">{formatDate(firstSeen)}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-neutral-500 to-white/10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-neutral-500" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
            <span className="font-[family-name:var(--font-jetbrains)]">{formatDate(lastSeen)}</span>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
