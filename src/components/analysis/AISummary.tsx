"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";

interface AISummaryProps {
  summary: string;
  behaviorSummary: string;
}

export default function AISummary({ summary, behaviorSummary }: AISummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlowCard title="AI SUMMARY" badge="AI GENERATED">
        <p className="text-foreground text-sm leading-relaxed mb-4">{summary}</p>
        <div className="border-t border-neutral-800/60 pt-4 mt-4">
          <p className="text-xs text-neutral-400 leading-relaxed font-[family-name:var(--font-jetbrains)]">{behaviorSummary}</p>
        </div>
      </GlowCard>
    </motion.div>
  );
}
