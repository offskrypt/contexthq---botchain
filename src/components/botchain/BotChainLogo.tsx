"use client";

import Image from "next/image";

interface BotChainLogoProps {
  className?: string;
  height?: number;
}

export function BotChainMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/botchain-mark.png"
      alt="BOT Chain Mark"
      width={Math.round((size * 60) / 80)}
      height={size}
      className={`object-contain inline-block shrink-0 ${className}`}
      priority
    />
  );
}

export default function BotChainLogo({
  className = "",
  height = 30,
}: BotChainLogoProps) {
  // icon_title_logo is 409 x 80
  const width = Math.round((height * 409) / 80);

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        src="/icon_title_logo.png"
        alt="BOT Chain"
        width={width}
        height={height}
        className="object-contain h-auto shrink-0"
        priority
      />
    </div>
  );
}
