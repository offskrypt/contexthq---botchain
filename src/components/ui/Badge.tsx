"use client";

interface BadgeProps {
  variant?: "green" | "yellow" | "red" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
