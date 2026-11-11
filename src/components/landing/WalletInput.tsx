"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBotChain } from "@/context/BotChainContext";

function isValidAddress(input: string): boolean {
  if (/^0x[a-fA-F0-9]{40}$/.test(input)) return true;
  if (/^[a-zA-Z0-9-]+\.eth$/.test(input)) return true;
  if (input.includes(".")) return true;
  return false;
}

export default function WalletInput() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    account,
    isRegistered,
    registerWallet,
    isRegistering,
    registrationFee,
  } = useBotChain();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      setError("Enter a wallet address");
      return;
    }

    if (!isValidAddress(trimmed)) {
      setError("Invalid wallet address or ENS name");
      return;
    }

    setError("");
    router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mt-12 w-full max-w-[620px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError("");
            }}
            placeholder="Enter wallet address or ENS name..."
            className="h-12 w-full border border-neon-border bg-[#0b0b0b] px-4 text-sm text-foreground transition-all placeholder:text-muted/45 focus:border-neon focus:outline-none focus:shadow-[0_0_18px_rgba(0,255,65,0.12)] font-[family-name:var(--font-jetbrains)]"
            spellCheck={false}
            autoComplete="off"
          />
          {error && (
            <p className="absolute -bottom-6 left-0 text-xs text-risk-high font-[family-name:var(--font-jetbrains)]">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="h-12 border border-neon bg-neon px-8 text-sm font-bold text-background transition-all hover:bg-neon-dim hover:shadow-[0_0_25px_rgba(0,255,65,0.25)] sm:min-w-[170px]"
        >
          Get Context -&gt;
        </button>
      </div>

      {account && !isRegistered && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-amber-500/50 bg-amber-950/20 px-4 py-2.5 text-xs text-amber-300 font-[family-name:var(--font-jetbrains)]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              Connected wallet is not registered. Pay <strong>{registrationFee} BOT</strong> to activate.
            </span>
          </div>
          <button
            type="button"
            onClick={registerWallet}
            disabled={isRegistering}
            className="w-full sm:w-auto border border-neon bg-neon px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-background hover:bg-neon-dim transition-all shadow-[0_0_12px_rgba(0,255,65,0.25)]"
          >
            {isRegistering ? "Confirming..." : `Pay ${registrationFee} BOT`}
          </button>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted/50 font-[family-name:var(--font-jetbrains)]">
        <span>Try:</span>
        <button
          type="button"
          onClick={() => setAddress("0x129aB54BD8d303Fa14B224930B26596dA00Cbc63")}
          className="text-neutral-400 hover:text-neon underline transition-colors"
        >
          0x129a...bc63 (BOT Chain)
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => setAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")}
          className="text-neutral-400 hover:text-neon underline transition-colors"
        >
          vitalik.eth
        </button>
        {account && (
          <>
            <span>/</span>
            <button
              type="button"
              onClick={() => setAddress(account)}
              className="text-neon hover:underline font-semibold"
            >
              Use My Connected Wallet
            </button>
          </>
        )}
      </div>
    </motion.form>
  );
}
