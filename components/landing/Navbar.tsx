"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Layers,
  MessagesSquare,
  Orbit,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURE_LINKS = [
  { icon: Layers, title: "Unified feed", desc: "Every app in one timeline", href: "#features" },
  { icon: Sparkles, title: "AI replies", desc: "Drafts written in your voice", href: "#features" },
  { icon: MessagesSquare, title: "Context stitching", desc: "Threads that connect across apps", href: "#features" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openFeatures, setOpenFeatures] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        aria-label="Main navigation"
        initial={false}
        animate={{
          width: scrolled ? "min(880px, 100%)" : "min(1200px, 100%)",
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "flex items-center justify-between gap-4 rounded-full px-3 sm:px-4",
          scrolled
            ? "border border-white/70 bg-white/60 shadow-[0_18px_50px_-20px_rgba(79,70,229,0.4)] backdrop-blur-2xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 px-2 text-slate-950"
          aria-label="Orbi home"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary text-white shadow-lg shadow-indigo-300/60 transition-transform duration-300 group-hover:-rotate-12">
            <Orbit size={19} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.04em]">Orbi</span>
        </a>

        <div
          className="hidden items-center gap-1 md:flex"
          onMouseLeave={() => setOpenFeatures(false)}
        >
          <div
            className="relative"
            onMouseEnter={() => setOpenFeatures(true)}
          >
            <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-slate-950">
              Features
              <ChevronDown
                size={14}
                className={cn("transition-transform", openFeatures && "rotate-180")}
              />
            </button>
            <AnimatePresence>
              {openFeatures && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_24px_70px_-28px_rgba(79,70,229,0.45)] backdrop-blur-2xl"
                >
                  {FEATURE_LINKS.map((f) => (
                    <a
                      key={f.title}
                      href={f.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-primary/5"
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <f.icon size={17} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">
                          {f.title}
                        </span>
                        <span className="block text-xs text-slate-500">{f.desc}</span>
                      </span>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#how"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-slate-950"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-slate-950"
          >
            Pricing
          </a>
        </div>

        <a
          href="#waitlist"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:px-5"
        >
          Get early access
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </motion.nav>
    </header>
  );
}
