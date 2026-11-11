"use client";

import { useBotChain } from "@/context/BotChainContext";
import { BOTCHAIN_CONFIG } from "@/lib/botchain";
import { useRouter } from "next/navigation";

export default function BotChainRegistrationCard() {
  const router = useRouter();
  const {
    account,
    chainId,
    isCorrectNetwork,
    balance,
    isRegistered,
    registeredAt,
    registrationFee,
    isConnecting,
    isRegistering,
    txHash,
    txError,
    txSuccess,
    connectWallet,
    switchToBotChain,
    registerWallet,
    clearTxState,
  } = useBotChain();

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="relative mt-8 w-full max-w-[620px] border border-neutral-800 bg-[#070707]/90 p-5 shadow-2xl backdrop-blur-md">
      {/* Top Banner / Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                account && isCorrectNetwork ? "bg-neon" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                account && isCorrectNetwork ? "bg-neon" : "bg-amber-400"
              }`}
            />
          </span>
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-300 font-[family-name:var(--font-jetbrains)]">
            BOT Chain Registration & Payment
          </span>
          <span className="rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 text-[9px] font-mono text-neon">
            ID: 677
          </span>
        </div>

        <a
          href={BOTCHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-neutral-500 hover:text-neon transition-colors font-mono"
        >
          scan.botchain.ai ↗
        </a>
      </div>

      {/* Body Section */}
      <div className="pt-4 space-y-4 font-[family-name:var(--font-jetbrains)]">
        {!account ? (
          /* Step 1: Connect Wallet */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-200 font-semibold">
                Pay {registrationFee} BOT to register your wallet on BOT Chain.
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                On-chain fee:{" "}
                <span className="text-neon font-mono font-bold">
                  {registrationFee} BOT
                </span>{" "}
                (Sent directly to ContextRegistration smart contract)
              </p>
            </div>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full sm:w-auto border border-neon bg-neon text-background text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-all hover:bg-neon-dim shadow-[0_0_15px_rgba(0,255,65,0.2)]"
            >
              {isConnecting ? "Connecting..." : `Connect & Pay ${registrationFee} BOT`}
            </button>
          </div>
        ) : !isCorrectNetwork ? (
          /* Step 2: Switch Network */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-950/20 border border-amber-500/30 p-3">
            <div>
              <p className="text-xs text-amber-400 font-semibold">
                Wrong Network Detected (Chain ID: {chainId || "Unknown"})
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Please switch to BOT Chain Mainnet (Chain ID: 677).
              </p>
            </div>
            <button
              onClick={switchToBotChain}
              className="w-full sm:w-auto border border-amber-400 bg-amber-400 text-background hover:bg-amber-300 text-xs font-bold px-4 py-2 transition-all"
            >
              Switch to BOT Chain
            </button>
          </div>
        ) : (
          /* Step 3: Connected & on BOT Chain */
          <div>
            {/* Wallet Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-neutral-800 bg-[#040404] p-3 text-[11px]">
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">
                  Wallet
                </span>
                <span className="text-neutral-200 font-mono font-medium">
                  {shortenAddress(account)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">
                  BOT Balance
                </span>
                <span className="text-neon font-mono font-medium">
                  {balance} BOT
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">
                  Reg. Fee
                </span>
                <span className="text-neutral-300 font-mono">
                  {registrationFee} BOT
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">
                  Status
                </span>
                {isRegistered ? (
                  <span className="text-neon font-bold">✓ Registered</span>
                ) : (
                  <span className="text-amber-400 font-bold">Unregistered</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              {isRegistered ? (
                <>
                  <div className="flex-1 text-xs text-neon/90 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-neon" />
                    <span>
                      Wallet is verified on BOT Chain{" "}
                      {registeredAt ? (
                        <span className="text-neutral-500 text-[10px]">
                          ({new Date(registeredAt * 1000).toLocaleDateString()})
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/analyze/${account}`)}
                    className="w-full sm:w-auto border border-neon bg-neon text-background text-xs font-bold px-4 py-2 hover:bg-neon-dim transition-all"
                  >
                    View ContextHQ DNA →
                  </button>
                </>
              ) : (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-neutral-300">
                    Pay <strong className="text-neon">{registrationFee} BOT</strong> to register your address on-chain.
                  </span>
                  <button
                    onClick={registerWallet}
                    disabled={isRegistering}
                    className="w-full sm:w-auto border border-neon bg-neon text-background text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-neon-dim transition-all shadow-[0_0_15px_rgba(0,255,65,0.25)] disabled:opacity-50"
                  >
                    {isRegistering ? "Confirming Payment..." : `Pay ${registrationFee} BOT & Register`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transaction In-Flight / Loading Alert */}
        {isRegistering && (
          <div className="border border-neon/40 bg-neon/5 p-3 flex items-center gap-3 text-xs text-neon">
            <span className="animate-spin text-sm">⟳</span>
            <span>
              Transaction submitted! Waiting for block confirmation on BOT Chain...
            </span>
          </div>
        )}

        {/* Transaction Success Alert */}
        {txSuccess && txHash && (
          <div className="border border-neon/60 bg-neon/10 p-3 text-xs text-foreground space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neon">
                ✓ Registration Confirmed On-Chain!
              </span>
              <button
                onClick={clearTxState}
                className="text-[10px] text-neutral-400 hover:text-foreground"
              >
                ✕ Dismiss
              </button>
            </div>
            <p className="text-[11px] text-neutral-300">
              Contract received {registrationFee} BOT. Wallet is now permanently registered.
            </p>
            <div className="pt-1">
              <a
                href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-neon underline hover:text-neon-dim font-mono"
              >
                View on BOT Chain Explorer: {shortenAddress(txHash)} ↗
              </a>
            </div>
          </div>
        )}

        {/* Transaction / Network Error Alert */}
        {txError && (
          <div className="border border-red-500/50 bg-red-950/20 p-3 text-xs text-red-400 flex items-start justify-between gap-2">
            <div>
              <span className="font-bold block mb-0.5">Registration Error</span>
              <p className="text-[11px] text-neutral-300">{txError}</p>
            </div>
            <button
              onClick={clearTxState}
              className="text-[11px] text-neutral-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
