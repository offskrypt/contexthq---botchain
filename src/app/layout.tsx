import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import InteractiveGrid from "@/components/layout/InteractiveGrid";
import { BotChainProvider } from "@/context/BotChainContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContextHQ — AI-Ready Context Layer for On-Chain Data",
  description:
    "Turn raw blockchain data into structured intelligence. Verified wallet context across 100+ chains, ready for humans and AI agents.",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "wallet context",
    "on-chain AI",
    "blockchain intelligence",
    "wallet analysis",
    "cross-chain",
    "context layer",
  ],
  openGraph: {
    title: "ContextHQ — The Context Layer for On-Chain AI",
    description:
      "Verified wallet intelligence across 100+ chains. Structured for humans. Ready for agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <InteractiveGrid />
        <BotChainProvider>{children}</BotChainProvider>
      </body>
    </html>
  );
}
