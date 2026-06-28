"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type DockItem = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

/**
 * macOS-style magnifying dock. Vertical by default (for the dashboard sidebar):
 * icons scale up as the cursor approaches, with a spring for the liquid feel.
 */
export function AnimatedDock({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) {
  const mouseY = useMotionValue(Infinity);

  return (
    <motion.nav
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "flex flex-col items-center gap-2 rounded-[22px] border border-white/70 bg-white/55 p-2 shadow-[0_18px_60px_-25px_rgba(79,70,229,0.35)] backdrop-blur-2xl",
        className,
      )}
    >
      {items.map((item, i) => (
        <DockButton key={i} mouseY={mouseY} {...item} />
      ))}
    </motion.nav>
  );
}

function DockButton({
  mouseY,
  icon,
  label,
  active,
  onClick,
}: DockItem & { mouseY: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const widthSync = useTransform(distance, [-110, 0, 110], [44, 62, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 170, damping: 14 });
  const iconScale = useTransform(width, [44, 62], [1, 1.32]);

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group relative grid aspect-square place-items-center rounded-[14px] transition-colors",
        active
          ? "bg-primary text-white shadow-lg shadow-indigo-300/50"
          : "text-slate-500 hover:bg-white/80 hover:text-primary",
      )}
    >
      <motion.span style={{ scale: iconScale }} className="grid place-items-center">
        {icon}
      </motion.span>
      <span className="pointer-events-none absolute left-full ml-3 z-10 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 md:block">
        {label}
      </span>
    </motion.button>
  );
}
