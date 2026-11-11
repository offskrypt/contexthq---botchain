"use client";

import { useState } from "react";
import Link from "next/link";
import BotChainBadge from "@/components/botchain/BotChainBadge";
import BotChainLogo from "@/components/botchain/BotChainLogo";
import { BOTCHAIN_CONFIG } from "@/lib/botchain";

export default function StructuralFooter() {
  const [copied, setCopied] = useState(false);
  const contractAddress = BOTCHAIN_CONFIG.registrationContract;
  const shortAddress = `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-auto border-t border-neutral-800/80 bg-[#040404] py-16 pb-28 w-full px-6 lg:px-12 xl:px-16 text-neutral-400 font-[family-name:var(--font-jetbrains)]">
      {/* 1. Verified Contract Attribute Badge (Image 1 Style in Footer) */}
      <div className="mb-14 flex justify-center md:justify-start">
        <BotChainBadge />
      </div>

      {/* 2. Colophon / About 3-Column Section (Image 2 Style) */}
      <div className="border-t border-neutral-900 pt-12">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
            04 / COLOPHON
          </span>
          <h2 className="text-3xl font-black text-white mt-1">About</h2>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Column 1: About the Project (5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-300">
              ABOUT THE PROJECT
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400">
              ContextHQ is an autonomous context-as-a-service engine and wallet
              intelligence protocol designed for BOT Chain. It provides deterministic
              multi-chain balance extraction, verifies on-chain registrations through the{" "}
              <span className="text-neutral-200">ContextRegistration</span> smart
              contract, and synthesizes clinical behavior DNA for humans and AI agents.
            </p>
          </div>

          {/* Column 2: Powered By BOT Chain (4 cols) */}
          <div className="md:col-span-3 lg:col-span-4 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-300">
              POWERED BY
            </h3>

            {/* BOT Chain Card Button */}
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-[#090b0e] px-4 py-2.5 transition-all hover:border-neutral-700 hover:bg-[#0c1015]"
            >
              <BotChainLogo height={24} />
            </a>

            {/* Links */}
            <div className="space-y-1.5 text-xs">
              <div>
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="text-[#00e599]">•</span>
                  <span>BOT Chain Website</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
              <div>
                <a
                  href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="text-[#00e599]">•</span>
                  <span>Smart Contract</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            {/* Contract Address & Copy */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="font-mono text-[#00e599] font-semibold">
                {shortAddress}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="border border-neutral-800 bg-neutral-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:border-neutral-700 hover:text-white transition-all"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          {/* Column 3: Links (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-300">
              LINKS
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-neutral-600">•</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-neutral-600">•</span> Documentation
                </Link>
              </li>
              <li>
                <a
                  href={BOTCHAIN_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-neutral-600">•</span> BOT Chain Explorer ↗
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://github.com/Iam-jayant/contexthq---botchain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white hover:text-neon transition-colors uppercase tracking-wider text-[11px]"
                >
                  GITHUB REPOSITORY ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Line */}
        <div className="mt-14 border-t border-neutral-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
          <div>
            <span>ContextHQ Protocol</span>
            <span className="mx-2">•</span>
            <span>BOT Chain Mainnet (Chain ID 677)</span>
          </div>
          <div>
            <span>Autonomous Wallet Intelligence Layer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
