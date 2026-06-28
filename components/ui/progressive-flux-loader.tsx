"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Full-screen "flux" loader: a morphing gradient orb over drifting blobs, with
 * a progress bar whose indigo→fuchsia gradient flows while the fill advances.
 * Calls onComplete once the progress reaches 100% over `duration` ms.
 */
export function ProgressiveFluxLoader({
  text = "Orbi is reading your apps…",
  subtext = "Stitching your feed together",
  duration = 3000,
  progress: controlledProgress,
  onComplete,
  className,
}: {
  text?: string;
  subtext?: string;
  duration?: number;
  /** Controlled progress (0–100). When set, the internal timer is disabled. */
  progress?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const isControlled = controlledProgress != null;
  const [internal, setInternal] = useState(0);

  useEffect(() => {
    if (isControlled) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeInOut for an organic, non-linear "flux" fill
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setInternal(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, onComplete, isControlled]);

  const progress = isControlled
    ? Math.max(0, Math.min(100, Math.round(controlledProgress)))
    : internal;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 grid place-items-center overflow-hidden bg-background",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute size-[420px] rounded-full bg-indigo-300/40 blur-[90px]"
        animate={{ x: [-60, 40, -60], y: [-30, 50, -30], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute size-[360px] rounded-full bg-fuchsia-300/30 blur-[90px]"
        animate={{ x: [50, -40, 50], y: [40, -40, 40], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center px-8 text-center">
        <div className="relative grid size-24 place-items-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 blur-md"
            animate={{ rotate: 360, scale: [1, 1.08, 1] }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <span className="relative grid size-16 place-items-center rounded-[20px] bg-primary text-white shadow-xl shadow-indigo-400/50">
            <Orbit size={30} strokeWidth={2.2} />
          </span>
          <motion.span
            className="absolute inset-0 rounded-full border border-dashed border-indigo-300/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <h2 className="mt-9 text-balance text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          {text}
        </h2>
        {subtext && <p className="mt-2 text-sm text-slate-500">{subtext}</p>}

        <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-indigo-100">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1,#a855f7,#ec4899,#6366f1)] bg-[length:200%_100%]"
            style={{ width: `${progress}%` }}
            animate={{ backgroundPositionX: ["0%", "-200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="mt-3 text-xs font-medium tabular-nums text-slate-400">
          {progress}%
        </span>
      </div>
    </div>
  );
}
