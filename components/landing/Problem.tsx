"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUpInView } from "./motion";

const PROBLEMS = [
  {
    num: "01",
    emoji: "🗂️",
    title: "Scattered everywhere",
    body: "Your assignments are in Canvas, emails in Gmail, messages in Slack and Discord. Nothing talks to each other.",
  },
  {
    num: "02",
    emoji: "🤖",
    title: "AI that actually knows you",
    body: "Learns how you write and think, drafts replies in your exact voice. You just confirm.",
  },
  {
    num: "03",
    emoji: "✅",
    title: "One calm place",
    body: "Everything urgent surfaces automatically. Reply to anyone without switching apps.",
  },
];

export function Problem() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      id="features"
      {...fadeUpInView(reduce)}
      className="scroll-mt-24 bg-white px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          The problem
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          You&apos;re juggling too many tabs.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((item, index) => (
            <motion.div
              key={item.num}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={
                reduce
                  ? undefined
                  : { duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <motion.div
                whileHover={
                  reduce
                    ? undefined
                    : { y: -6, boxShadow: "0 20px 40px rgba(99,102,241,0.15)" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="h-full rounded-2xl bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.18)] ring-1 ring-slate-100 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.num}
                  </span>
                  <span className="text-2xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-500">{item.body}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
