"use client";

import { useEffect, useMemo, useState } from "react";

const GLYPHS = "<>{}[]/\\|+=*#$01";

function glyphAt(x: number, y: number, frame: number) {
  return GLYPHS[(x * 7 + y * 11 + frame) % GLYPHS.length];
}

function generateContextCore(width: number, height: number, frame: number): string[] {
  const rows: string[] = [];
  const cx = width * 0.54;
  const cy = height * 0.52;

  for (let y = 0; y < height; y++) {
    let row = "";

    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / (width * 0.42);
      const ny = (y - cy) / (height * 0.44);
      const radius = Math.sqrt(nx * nx + ny * ny);
      const angle = Math.atan2(ny, nx);
      const aperture = Math.abs(nx) < 0.23 && Math.abs(ny) < 0.22;
      const outer = radius < 1 && radius > 0.35;
      const band = Math.abs(Math.sin((angle + frame * 0.01) * 5) * 0.08 + radius - 0.68) < 0.055;
      const gridLine = x % 2 === 0 || (y + frame) % 6 === 0;
      const stream = Math.abs(((x - y + frame) % 19) - 9) < 1 && radius < 0.95;

      if (aperture) {
        row += " ";
      } else if (outer && (gridLine || band || stream)) {
        row += glyphAt(x, y, frame);
      } else if (radius < 1.04 && radius > 0.96 && x % 2 === 0) {
        row += "+";
      } else {
        row += " ";
      }
    }

    rows.push(row);
  }

  return rows;
}

export default function AsciiArt() {
  const [frame, setFrame] = useState(0);
  const width = 96;
  const height = 42;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrame((prev) => prev + 1);
    }, 420);

    return () => window.clearInterval(interval);
  }, []);

  const lines = useMemo(() => generateContextCore(width, height, frame), [frame]);

  return (
    <div className="relative flex h-full w-full items-center justify-end overflow-hidden">
      <div className="absolute inset-y-8 right-0 w-[82%] border-y border-neon-border/40 opacity-70" />
      <div className="absolute right-[16%] top-[18%] h-[64%] w-[42%] border border-neon-border/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_48%,rgba(0,255,65,0.12),transparent_34%),linear-gradient(90deg,var(--background)_0%,transparent_22%,transparent_78%,var(--background)_100%)]" />

      <pre className="ascii-art relative z-10 text-[9px] leading-[0.92] opacity-90 xl:text-[11px] 2xl:text-[12px]" aria-hidden="true">
        {lines.map((line, index) => (
          <div key={index} className={index % 5 === frame % 5 ? "opacity-100" : "opacity-75"}>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
