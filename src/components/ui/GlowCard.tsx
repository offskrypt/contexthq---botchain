"use client";

import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  badge?: string;
}

export default function GlowCard({ children, className = "", title, badge }: GlowCardProps) {
  return (
    <div className={`glow-card p-5 ${className}`}>
      {(title || badge) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted">
              {title}
            </h3>
          )}
          {badge && (
            <span className="badge badge-green text-[10px]">{badge}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
