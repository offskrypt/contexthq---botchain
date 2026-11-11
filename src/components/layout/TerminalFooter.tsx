"use client";

import { useEffect, useState } from "react";

const COMMANDS = [
  "contexthq@mainnet:~$ fetching wallet context...",
  "contexthq@mainnet:~$ scanning 100+ chains for activity...",
  "contexthq@mainnet:~$ generating AI-ready context object...",
  "contexthq@mainnet:~$ type wallet address, get structured intelligence...",
  "contexthq@mainnet:~$ context as a service - ready for agents...",
];

export default function TerminalFooter() {
  const [commandIndex, setCommandIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const command = COMMANDS[commandIndex];

    if (charIndex < command.length) {
      const timer = window.setTimeout(() => {
        setDisplayText(command.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 30);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setCommandIndex((prev) => (prev + 1) % COMMANDS.length);
      setCharIndex(0);
      setDisplayText("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [charIndex, commandIndex]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-neon-border bg-[#050505]/95">
      <div className="px-5 py-2.5 sm:px-8 lg:px-11">
        <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-jetbrains)]">
          <span className="text-neon opacity-75">{displayText}</span>
          <span className="blink h-3 w-2 bg-neon" />
        </div>
      </div>
    </footer>
  );
}
