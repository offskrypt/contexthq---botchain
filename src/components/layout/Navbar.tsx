"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBotChain } from "@/context/BotChainContext";

const NAV_ITEMS = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/docs#api" },
  { label: "SDK", href: "/docs#sdk" },
  {
    label: "GitHub",
    href: "https://github.com/Iam-jayant/contexthq---botchain",
    external: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    account,
    isCorrectNetwork,
    balance,
    isRegistered,
    connectWallet,
    disconnectWallet,
    switchToBotChain,
    registerWallet,
    isRegistering,
    isConnecting,
  } = useBotChain();

  const shorten = (str: string) => `${str.slice(0, 6)}...${str.slice(-4)}`;

  return (
    <nav className="relative z-50 w-full border-b border-neutral-800/40 bg-background/90 pt-[10px]">
      <div className="flex h-14 w-full items-center justify-between px-6 lg:px-12 xl:px-16">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex h-9 items-center border border-neutral-800 hover:border-neon/40 transition-all bg-[#050505]/80 px-5"
          >
            <span className="text-[13.5px] font-black tracking-[0.2em] text-foreground font-[family-name:var(--font-jetbrains)]">
              CONTEXT<span className="text-neon">HQ</span>
            </span>
          </Link>

          {/* Network Indicator Pill */}
          <div className="hidden md:flex h-9 items-center border border-neutral-800 bg-[#050505]/80 px-3 gap-2 text-[10px] font-mono">
            <span
              className={`h-2 w-2 rounded-full ${
                account && isCorrectNetwork
                  ? "bg-neon shadow-[0_0_8px_#00ff41]"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-neutral-400 uppercase tracking-wider">
              BOT Chain <span className="text-neutral-600">677</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Links */}
          <div className="hidden h-9 items-center border border-neutral-800 bg-[#050505]/80 sm:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`h-full flex items-center border-l border-neutral-800 px-5 text-[10.5px] font-bold uppercase tracking-[0.18em] transition-colors first:border-l-0 hover:text-neon font-[family-name:var(--font-jetbrains)] ${
                  pathname === item.href ? "text-neon" : "text-neutral-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Web3 Wallet Connect Button */}
          {!account ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="h-9 border border-neon/80 bg-neon/10 hover:bg-neon hover:text-background text-neon text-[10.5px] font-bold uppercase tracking-[0.16em] px-4 transition-all font-[family-name:var(--font-jetbrains)]"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : !isCorrectNetwork ? (
            <button
              onClick={switchToBotChain}
              className="h-9 border border-amber-400 bg-amber-400/10 hover:bg-amber-400 hover:text-background text-amber-400 text-[10.5px] font-bold uppercase tracking-[0.16em] px-4 transition-all font-[family-name:var(--font-jetbrains)]"
            >
              Switch to BOT Chain
            </button>
          ) : (
            <div className="flex h-9 items-center border border-neutral-800 bg-[#050505]/80 text-[10.5px] font-mono">
              <span className="border-r border-neutral-800 px-3 text-neon font-semibold">
                {balance} BOT
              </span>
              {!isRegistered && (
                <button
                  onClick={registerWallet}
                  disabled={isRegistering}
                  className="h-full border-r border-neutral-800 bg-neon px-3 font-bold uppercase tracking-wider text-background hover:bg-neon-dim transition-all shadow-[0_0_12px_rgba(0,255,65,0.25)]"
                  title="Pay 0.001 BOT to register your wallet on BOT Chain"
                >
                  {isRegistering ? "Paying..." : "Pay 0.001 BOT to Register"}
                </button>
              )}
              <button
                onClick={disconnectWallet}
                title="Click to disconnect"
                className="flex items-center gap-1.5 px-3 text-neutral-300 hover:text-risk-high transition-colors"
              >
                {isRegistered && (
                  <span
                    title="Registered on BOT Chain"
                    className="text-neon text-xs font-bold"
                  >
                    ✓
                  </span>
                )}
                <span>{shorten(account)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
