"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useBotChain } from "@/context/BotChainContext";
import { BOTCHAIN_CONFIG } from "@/lib/botchain";
import Navbar from "@/components/layout/Navbar";
import TerminalFooter from "@/components/layout/TerminalFooter";
import LoadingState from "@/components/analysis/LoadingState";
import AISummary from "@/components/analysis/AISummary";
import WalletIdentity from "@/components/analysis/WalletIdentity";
import WalletDNA from "@/components/analysis/WalletDNA";
import ChainJourney from "@/components/analysis/ChainJourney";
import ProtocolAffinity from "@/components/analysis/ProtocolAffinity";
import RiskSignals from "@/components/analysis/RiskSignals";
import ActivityTimeline from "@/components/analysis/ActivityTimeline";
import ContextObject from "@/components/analysis/ContextObject";

export default function AnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const address = decodeURIComponent(params.address as string);
  const { data, error, isLoading, loadingStep, analyze } = useAnalysis();
  const {
    account,
    isCorrectNetwork,
    connectWallet,
    switchToBotChain,
    checkRegistrationForAddress,
    registerWallet,
    isRegistering,
    isConnecting,
    registrationFee,
    txHash,
    txError,
    clearTxState,
  } = useBotChain();

  const [targetRegistration, setTargetRegistration] = useState<{
    registered: boolean;
    timestamp: number;
  }>({ registered: false, timestamp: 0 });

  useEffect(() => {
    if (address) {
      analyze(address);
      checkRegistrationForAddress(address).then(setTargetRegistration);
    }
  }, [address, analyze, checkRegistrationForAddress]);

  const handlePayRegistration = async () => {
    if (!account) {
      await connectWallet();
      return;
    }
    if (!isCorrectNetwork) {
      const switched = await switchToBotChain();
      if (!switched) return;
    }
    const res = await registerWallet();
    if (res.success) {
      setTargetRegistration({
        registered: true,
        timestamp: Math.floor(Date.now() / 1000),
      });
      // Refresh analysis
      analyze(address);
    }
  };

  const shorten = (str: string) => `${str.slice(0, 6)}...${str.slice(-4)}`;

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 pb-20">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-xs text-muted hover:text-neon transition-colors font-[family-name:var(--font-jetbrains)]"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to search
        </button>

        {/* Loading */}
        {isLoading && <LoadingState currentStep={loadingStep} />}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-card p-8 text-center"
            style={{ borderColor: "rgba(255, 59, 59, 0.3)" }}
          >
            <p className="text-risk-high text-sm font-[family-name:var(--font-jetbrains)] mb-4">
              {error}
            </p>
            <button
              onClick={() => analyze(address)}
              className="neon-button rounded text-xs"
            >
              Retry Analysis
            </button>
          </motion.div>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-2"
            >
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Wallet Context
                </h1>
                <p className="text-xs text-muted font-[family-name:var(--font-jetbrains)] mt-0.5">
                  {address}
                </p>
              </div>
              <span className="text-[10px] text-muted font-[family-name:var(--font-jetbrains)]">
                {data.meta.processingTimeMs}ms · {data.meta.dataSource}
              </span>
            </motion.div>

            {/* PAYMENT REQUIREMENT / REGISTRATION STATUS SECTION */}
            {targetRegistration.registered ? (
              /* State A: Wallet is registered on BOT Chain */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-neon/50 bg-[#00ff41]/5 px-4 py-3 font-[family-name:var(--font-jetbrains)]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_#00ff41]" />
                  <span className="text-xs font-bold text-neon uppercase tracking-wide">
                    ✓ Verified on BOT Chain (Chain ID: 677)
                  </span>
                  {targetRegistration.timestamp > 0 && (
                    <span className="text-[10px] text-neutral-400">
                      Registered: {new Date(targetRegistration.timestamp * 1000).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <a
                  href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neon underline hover:text-neon-dim font-mono"
                >
                  View on BOT Chain Explorer ↗
                </a>
              </div>
            ) : (
              /* State B: PAYMENT REQUIRED ON BOT CHAIN */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-neon/80 bg-[#070b08] p-5 sm:p-6 shadow-[0_0_30px_rgba(0,255,65,0.15)] font-[family-name:var(--font-jetbrains)] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                          PAYMENT REQUIRED
                        </span>
                        <span className="rounded bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 text-[9px] font-mono text-neutral-300">
                          Chain ID: 677
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        Register Wallet with ContextHQ on BOT Chain
                      </h2>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                      Registration Fee
                    </span>
                    <span className="text-lg font-black text-neon font-mono">
                      {registrationFee} BOT
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-neutral-300">
                  This wallet has not yet completed on-chain registration. Pay{" "}
                  <strong className="text-white font-mono">{registrationFee} BOT</strong> to the{" "}
                  <strong className="text-neon">ContextRegistration</strong> smart contract on BOT Chain to register this address permanently and unlock full AI context.
                </p>

                {/* Pay Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  {!account ? (
                    <button
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="w-full sm:w-auto border border-neon bg-neon text-background text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-neon-dim transition-all shadow-[0_0_20px_rgba(0,255,65,0.25)] font-mono"
                    >
                      {isConnecting ? "Connecting Wallet..." : `Connect Wallet & Pay ${registrationFee} BOT`}
                    </button>
                  ) : !isCorrectNetwork ? (
                    <button
                      onClick={switchToBotChain}
                      className="w-full sm:w-auto border border-amber-400 bg-amber-400 text-background text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-amber-300 transition-all font-mono"
                    >
                      Switch to BOT Chain (677) to Pay
                    </button>
                  ) : (
                    <button
                      onClick={handlePayRegistration}
                      disabled={isRegistering}
                      className="w-full sm:w-auto border border-neon bg-neon text-background text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-neon-dim transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)] disabled:opacity-50 font-mono"
                    >
                      {isRegistering
                        ? "Confirming 0.001 BOT Payment..."
                        : `Pay ${registrationFee} BOT to Register Now`}
                    </button>
                  )}

                  <span className="text-[10px] text-neutral-500 font-mono">
                    Contract: {shorten(BOTCHAIN_CONFIG.registrationContract)}
                  </span>
                </div>

                {/* In-flight alert */}
                {isRegistering && (
                  <div className="border border-neon/50 bg-neon/10 p-3 text-xs text-neon flex items-center gap-2 font-mono">
                    <span className="animate-spin">⟳</span>
                    <span>Waiting for wallet signature & BOT Chain block confirmation...</span>
                  </div>
                )}

                {/* Success alert */}
                {txHash && (
                  <div className="border border-neon/50 bg-[#00ff41]/10 p-3 text-xs text-foreground font-mono flex items-center justify-between">
                    <span>✓ Payment confirmed on-chain!</span>
                    <a
                      href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon underline hover:text-neon-dim text-[11px]"
                    >
                      View Tx: {shorten(txHash)} ↗
                    </a>
                  </div>
                )}

                {/* Error alert */}
                {txError && (
                  <div className="border border-red-500/50 bg-red-950/20 p-3 text-xs text-red-400 flex items-center justify-between">
                    <span>{txError}</span>
                    <button onClick={clearTxState} className="text-[10px] text-neutral-400 hover:text-white">
                      ✕
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* AI Summary — Full width */}
            <AISummary
              summary={data.summary.aiSummary}
              behaviorSummary={data.summary.behaviorSummary}
            />

            {/* Identity + DNA — Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WalletIdentity
                identity={data.summary.identity}
                confidence={data.summary.identityConfidence}
                address={data.address}
                totalValueUSD={data.portfolio.totalValueUSD}
              />
              <WalletDNA traits={data.summary.walletDNA} />
            </div>

            {/* Chain Journey + Protocol Affinity — Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChainJourney chains={data.chains} />
              <ProtocolAffinity protocols={data.protocols} />
            </div>

            {/* Risk + Activity — Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <RiskSignals
                level={data.risk.level}
                score={data.risk.score}
                signals={data.risk.signals}
              />
              <ActivityTimeline
                totalTransactions={data.activity.totalTransactions}
                firstSeen={data.activity.firstSeen}
                lastSeen={data.activity.lastSeen}
                avgTxPerMonth={data.activity.avgTxPerMonth}
                activeMonths={data.activity.activeMonths}
              />
            </div>

            {/* Context Object — Full width */}
            <ContextObject context={data} />
          </div>
        )}
      </div>

      <TerminalFooter />
    </main>
  );
}
