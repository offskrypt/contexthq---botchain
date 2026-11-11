"use client";

import { motion } from "framer-motion";
import { LOADING_STEPS, LoadingStep } from "@/lib/types";

interface LoadingStateProps {
  currentStep: LoadingStep;
}

export default function LoadingState({ currentStep }: LoadingStateProps) {
  const currentIndex = LOADING_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glow-card p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-3 w-3 rounded-full bg-neon animate-glow-pulse" />
            <span className="text-xs font-[family-name:var(--font-jetbrains)] text-neon tracking-wider uppercase">
              Analyzing Wallet
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {LOADING_STEPS.map((step, i) => {
              const isComplete = i < currentIndex;
              const isCurrent = i === currentIndex;
              const isPending = i > currentIndex;

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  {/* Status indicator */}
                  <div className="w-5 flex justify-center">
                    {isComplete && (
                      <svg className="w-4 h-4 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isCurrent && (
                      <div className="h-2 w-2 rounded-full bg-neon animate-pulse" />
                    )}
                    {isPending && (
                      <div className="h-1.5 w-1.5 rounded-full bg-muted/30" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-[family-name:var(--font-jetbrains)] transition-colors ${
                      isComplete
                        ? "text-neon/60"
                        : isCurrent
                        ? "text-neon"
                        : "text-muted/30"
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-8 h-0.5 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neon rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentIndex + 1) / LOADING_STEPS.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
