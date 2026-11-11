"use client";

import { useState, useCallback } from "react";
import { WalletContext, LoadingStep } from "@/lib/types";

interface UseAnalysisReturn {
  data: WalletContext | null;
  error: string | null;
  isLoading: boolean;
  loadingStep: LoadingStep;
  analyze: (address: string) => Promise<void>;
}

export function useAnalysis(): UseAnalysisReturn {
  const [data, setData] = useState<WalletContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("resolving");

  const analyze = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Simulate step progression while API processes
      setLoadingStep("resolving");
      await delay(600);

      setLoadingStep("scanning");
      await delay(800);

      setLoadingStep("fetching");

      // Start the actual API call
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      setLoadingStep("analyzing");
      await delay(500);

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Analysis failed");
      }

      setLoadingStep("generating");
      await delay(400);

      setLoadingStep("complete");
      await delay(300);

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, loadingStep, analyze };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
