"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import CopyButton from "@/components/ui/CopyButton";
import { WalletContext } from "@/lib/types";

interface ContextObjectProps {
  context: WalletContext;
}

export default function ContextObject({ context }: ContextObjectProps) {
  const [expanded, setExpanded] = useState(false);
  const jsonString = JSON.stringify(context, null, 2);
  const previewLines = 20;

  const displayJson = expanded
    ? jsonString
    : jsonString.split("\n").slice(0, previewLines).join("\n") + "\n  ...";

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `context-${context.address.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlowCard title="CONTEXT OBJECT" badge="AGENT-READY">
        {/* Actions */}
        <div className="flex items-center gap-2 mb-4">
          <CopyButton text={jsonString} label="Copy Context" />
          <button
            onClick={handleDownload}
            className="neon-button rounded text-xs flex items-center gap-2 px-3 py-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download JSON
          </button>
        </div>

        {/* JSON Viewer */}
        <div className="code-block p-4 max-h-[500px] overflow-auto">
          <pre className="text-neutral-300 whitespace-pre text-[11px] leading-relaxed font-[family-name:var(--font-jetbrains)]">
            {displayJson}
          </pre>
        </div>

        {/* Expand/Collapse */}
        {jsonString.split("\n").length > previewLines && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-neutral-400 hover:text-white transition-colors font-[family-name:var(--font-jetbrains)]"
          >
            {expanded ? "▲ Collapse" : `▼ Show full object (${jsonString.split("\n").length} lines)`}
          </button>
        )}

        {/* API hint */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-[10px] text-muted font-[family-name:var(--font-jetbrains)]">
            GET /api/v1/context?address={context.address.slice(0, 10)}... → Returns this object
          </p>
        </div>
      </GlowCard>
    </motion.div>
  );
}
