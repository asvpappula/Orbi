"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "./motion";

const UNIVERSITIES = ["Stanford", "MIT", "Berkeley", "Georgia Tech", "NYU"];

const NAV = ["Inbox", "Canvas", "Calendar", "Settings"];

const MESSAGES = [
  { dot: "bg-rose-500", label: "Canvas · Assignment due Friday" },
  { dot: "bg-sky-500", label: "Gmail · Professor Lee replied" },
  { dot: "bg-violet-500", label: "Slack · 3 new in #study-group" },
];

export function Hero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="top"
      className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pb-24 pt-32 text-center"
    >
      <motion.span
        {...fadeUp(reduce, 0)}
        className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-indigo-200"
      >
        Now in early access
      </motion.span>

      <motion.h1
        {...fadeUp(reduce, 0.1)}
        className="mt-8 max-w-4xl text-[clamp(3.5rem,8vw,6.5rem)] font-black leading-[1] tracking-[-0.05em] text-slate-950"
      >
        Everything you need to know,
        <br />
        <span className="font-thin text-slate-400">finally in one place.</span>
      </motion.h1>

      <motion.p
        {...fadeUp(reduce, 0.2)}
        className="mx-auto mt-6 max-w-xl text-xl font-light leading-relaxed text-slate-400"
      >
        Canvas, Gmail, Slack, Discord, GitHub — pulled together by AI that knows
        how you work.
      </motion.p>

      <motion.div {...fadeUp(reduce, 0.3)} className="mt-10">
        <a
          href="#waitlist"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
        >
          Get early access
          <ArrowRight size={18} />
        </a>
      </motion.div>

      <motion.div
        {...fadeUp(reduce, 0.4)}
        className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-medium text-slate-400"
      >
        <span>Trusted by students at</span>
        {UNIVERSITIES.map((name, index) => (
          <span key={name} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">·</span>}
            {name}
          </span>
        ))}
      </motion.div>

      {/* Product mockup — the visual anchor of the hero */}
      <motion.div
        {...fadeUp(reduce, 0.5)}
        className="mx-auto mt-16 w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-black/10 ring-1 ring-black/10"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-black/5 bg-slate-50 px-4 py-3">
          <span className="size-3 rounded-full bg-rose-400/80" />
          <span className="size-3 rounded-full bg-amber-400/80" />
          <span className="size-3 rounded-full bg-emerald-400/80" />
          <div className="ml-3 h-6 flex-1 rounded-md bg-white ring-1 ring-black/5" />
        </div>

        {/* app */}
        <div className="flex text-left">
          <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-black/5 bg-slate-50 p-4 sm:flex">
            {NAV.map((item, index) => (
              <div
                key={item}
                className={
                  index === 0
                    ? "flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-900 ring-1 ring-black/5"
                    : "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500"
                }
              >
                <span
                  className={
                    index === 0
                      ? "size-1.5 rounded-full bg-indigo-500"
                      : "size-1.5 rounded-full bg-slate-300"
                  }
                />
                {item}
              </div>
            ))}
          </aside>

          <div className="flex-1 space-y-3 bg-white p-5">
            {MESSAGES.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 rounded-xl px-3 py-3 ring-1 ring-black/5"
              >
                <span className={`size-2 shrink-0 rounded-full ${row.dot}`} />
                <span className="text-sm font-medium text-slate-700">
                  {row.label}
                </span>
                <span className="ml-auto h-2 w-16 rounded-full bg-gradient-to-r from-slate-200 to-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
