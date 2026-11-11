import Navbar from "@/components/layout/Navbar";
import TerminalFooter from "@/components/layout/TerminalFooter";
import Hero from "@/components/landing/Hero";
import WalletInput from "@/components/landing/WalletInput";
import BotChainRegistrationCard from "@/components/botchain/BotChainRegistrationCard";
import About from "@/components/landing/About";
import HowItWorks from "@/components/landing/HowItWorks";
import Integration from "@/components/landing/Integration";
import StructuralFooter from "@/components/layout/StructuralFooter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero & Search Block */}
      <div className="w-full px-6 lg:px-12 xl:px-16 dot-grid border-b border-border/40">
        <div className="grid min-h-[calc(100vh-80px)] w-full grid-cols-1 gap-12 pb-16 pt-14 lg:grid-cols-2 lg:pb-12 lg:pt-9">
          <section className="flex min-w-0 flex-col justify-center -mt-10 lg:-mt-16">
            <Hero />
          </section>

          <section className="flex min-w-0 flex-col justify-center lg:pl-8">
            <WalletInput />
            <BotChainRegistrationCard />
          </section>
        </div>
      </div>

      {/* Informational Sections */}
      <div className="w-full px-6 lg:px-12 xl:px-16 bg-background">
        <About />
        <HowItWorks />
        <Integration />
      </div>

      <StructuralFooter />
      <TerminalFooter />
    </main>
  );
}
