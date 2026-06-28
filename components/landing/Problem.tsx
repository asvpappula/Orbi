"use client";

import { ArrowDown, Orbit } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpInView } from "./motion";

const BUBBLES = [
  {
    app: "Gmail",
    text: "Prof. Lee: The deadline has been moved to—",
    pos: "left-[1%] top-[6%] rotate-[-3deg]",
  },
  {
    app: "Canvas",
    text: "Assignment due in 2 hours",
    pos: "right-[2%] top-[0%] rotate-[2deg]",
  },
  {
    app: "GitHub",
    text: "PR review requested",
    pos: "left-[34%] top-[30%] rotate-[-1deg]",
  },
  {
    app: "Slack",
    text: "@here standup in 5min",
    pos: "left-[6%] top-[62%] rotate-[2deg]",
  },
  {
    app: "Discord",
    text: "Study group: anyone have the notes?",
    pos: "right-[3%] top-[55%] rotate-[-2deg]",
  },
  {
    app: "Calendar",
    text: "CS 101 · 3:00 PM",
    pos: "right-[28%] top-[78%] rotate-[3deg]",
  },
];

export function Problem() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      id="features"
      {...fadeUpInView(reduce)}
      className="scroll-mt-24 bg-white px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mx-auto max-w-3xl text-center text-[clamp(2.75rem,6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.05em] text-slate-950">
          You have 11 tabs open{" "}
          <span className="font-thin text-slate-400">right now.</span>
        </h2>

        <div className="relative mx-auto mt-20 h-72 max-w-4xl sm:h-80">
          {BUBBLES.map((bubble, index) => (
            <motion.div
              key={bubble.app}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={
                reduce ? undefined : { delay: index * 0.1, duration: 0.4 }
              }
              className={`absolute ${bubble.pos}`}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 3 + index * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
                className="rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/10"
              >
                <span className="whitespace-nowrap text-xs font-medium text-slate-700">
                  {bubble.text}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5">
          <ArrowDown size={40} strokeWidth={1} className="text-slate-300" />
          <Orbit size={48} className="text-indigo-500" />
          <p className="text-2xl font-semibold text-slate-900">
            Orbi sorts it all.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
