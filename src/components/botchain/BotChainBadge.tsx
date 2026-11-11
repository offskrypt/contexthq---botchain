"use client";

import { useState } from "react";
import BotChainLogo from "./BotChainLogo";
import { BOTCHAIN_CONFIG } from "@/lib/botchain";

interface BotChainBadgeProps {
  className?: string;
}

export default function BotChainBadge({ className = "" }: BotChainBadgeProps) {
  const [copied, setCopied] = useState(false);
  const contractAddress = BOTCHAIN_CONFIG.registrationContract;
  const shortAddress = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;
  const explorerUrl = `${BOTCHAIN_CONFIG.explorerUrl}/address/${contractAddress}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative inline-flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl border border-neutral-800/90 bg-[#08090b]/95 px-5 py-3.5 shadow-2xl backdrop-blur-md transition-all hover:border-neutral-700 ${className}`}
    >
      {/* 1. Left: BOT Chain Logo */}
      <a
        href="https://botchain.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center transition-transform hover:scale-105"
        title="Visit BOT Chain"
      >
        <BotChainLogo height={28} />
      </a>

      {/* Divider */}
      <div className="hidden h-8 w-px bg-neutral-800/80 sm:block" />

      {/* 2. Middle: POWERED BY BOT Chain */}
      <div className="flex flex-col justify-center font-[family-name:var(--font-jetbrains)]">
        <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          POWERED BY
        </span>
        <span className="text-sm font-black text-white tracking-wide">
          BOT Chain
        </span>
      </div>

      {/* Divider */}
      <div className="hidden h-8 w-px bg-neutral-800/80 sm:block" />

      {/* 3. Right: Verified Contract & Mainnet Badge */}
      <div className="flex flex-col justify-center gap-1 font-[family-name:var(--font-jetbrains)]">
        {/* Top line: Label + Pulse Dot + Available Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            VERIFIED CONTRACT
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e599] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e599]" />
          </span>
          <span className="rounded bg-[#00e599] px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-neutral-950">
            AVAILABLE ON MAINNET NOW
          </span>
        </div>

        {/* Bottom line: Address + Explorer link + Copy button */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-bold text-neutral-200 transition-colors hover:text-[#00e599]"
            title={`View ${contractAddress} on BOT Chain Explorer`}
          >
            {shortAddress}
          </a>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 transition-colors hover:text-[#00e599]"
            title="Open in BOT Chain Explorer"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="text-neutral-400 transition-colors hover:text-white"
            title="Copy Contract Address"
          >
            {copied ? (
              <span className="text-[10px] font-bold text-[#00e599]">COPIED</span>
            ) : (
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
