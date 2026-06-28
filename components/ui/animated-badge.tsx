"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BadgeStatus = "connected" | "syncing";

const STYLES: Record<
  BadgeStatus,
  { dot: string; ring: string; text: string; bg: string; label: string; speed: number }
> = {
  connected: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    label: "Connected",
    speed: 1.9,
  },
  syncing: {
    dot: "bg-amber-500",
    ring: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    label: "Syncing",
    speed: 1,
  },
};

/**
 * Pulsing status indicator for connected apps. Green pulse = connected,
 * amber (faster) pulse = syncing. Render as a bare dot or with a label pill.
 */
export function AnimatedBadge({
  status,
  showLabel = false,
  label,
  className,
}: {
  status: BadgeStatus;
  showLabel?: boolean;
  label?: string;
  className?: string;
}) {
  const s = STYLES[status];

  const dot = (
    <span className="relative inline-flex size-2.5 items-center justify-center">
      <motion.span
        className={cn("absolute inline-flex size-full rounded-full", s.ring)}
        animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
        transition={{ duration: s.speed, repeat: Infinity, ease: "easeOut" }}
      />
      <span className={cn("relative inline-flex size-2.5 rounded-full", s.dot)} />
    </span>
  );

  if (!showLabel) {
    return <span className={cn("inline-flex", className)}>{dot}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        s.bg,
        className,
      )}
    >
      {dot}
      <span className={cn("text-[11px] font-semibold", s.text)}>
        {label ?? s.label}
      </span>
    </span>
  );
}
