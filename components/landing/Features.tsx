"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpInView } from "./motion";

const FEED = [
  { dot: "bg-rose-500", label: "Canvas · Project 3 due Friday" },
  { dot: "bg-sky-500", label: "Gmail · Prof. Lee replied" },
  { dot: "bg-violet-500", label: "Slack · @here standup at 9" },
];

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const DEADLINES: Record<number, string> = {
  1: "bg-indigo-400",
  3: "bg-emerald-400",
  4: "bg-indigo-400",
};

const THREAD = [
  { dot: "bg-rose-500", label: "Canvas", sub: "Project 3 assignment" },
  { dot: "bg-sky-500", label: "Gmail", sub: "Rubric clarification" },
  { dot: "bg-indigo-500", label: "Discord", sub: "#study-group thread" },
];

function BentoCard({
  index,
  reduce,
  className,
  children,
}: {
  index: number;
  reduce: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        reduce
          ? undefined
          : { duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }
      }
      className={`rounded-3xl p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Features() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      id="how-it-works"
      {...fadeUpInView(reduce)}
      className="scroll-mt-24 bg-white px-6 py-32 sm:py-40"
    >
      {/* Anchor alias so the Navbar's existing "How it works" (#how) link lands here. */}
      <span id="how" aria-hidden="true" className="block -translate-y-24" />
      <div className="mx-auto max-w-5xl">
        <h2 className="mx-auto max-w-3xl text-center text-[clamp(2.75rem,6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.05em] text-slate-950">
          Built for how you{" "}
          <span className="font-thin text-slate-400">actually work</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Unified inbox — tall left */}
          <BentoCard index={0} reduce={reduce} className="bg-[#f6f5ff] md:row-span-2">
            <h3 className="text-xl font-bold text-slate-900">Unified inbox</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Gmail, Slack, Canvas, and Discord in one prioritized feed.
            </p>
            <div className="mt-8 space-y-2">
              {FEED.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-black/5"
                >
                  <span className={`size-2 shrink-0 rounded-full ${row.dot}`} />
                  <span className="text-sm font-medium text-slate-700">
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* AI replies — dark top right */}
          <BentoCard index={1} reduce={reduce} className="bg-slate-950 text-white">
            <h3 className="text-xl font-bold text-white">
              AI replies in your voice
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Drafts responses that sound like you. Review, then send.
            </p>
            <div className="mt-8 space-y-3">
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-sm text-slate-200">
                Can you send last week&apos;s notes?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-500 px-4 py-3 text-sm text-white">
                Just shared them in the drive — link&apos;s in the thread.
              </div>
            </div>
          </BentoCard>

          {/* Every deadline — green bottom right */}
          <BentoCard index={2} reduce={reduce} className="bg-[#f0fdf4]">
            <h3 className="text-xl font-bold text-slate-900">
              Every deadline in view
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Assignments and events in one visual week.
            </p>
            <div className="mt-8 grid grid-cols-7 gap-1.5">
              {WEEK.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-slate-400">
                    {day}
                  </span>
                  <div className="h-16 w-full rounded-md bg-white p-1 ring-1 ring-black/5">
                    {DEADLINES[i] && (
                      <span
                        className={`block h-1.5 w-full rounded-full ${DEADLINES[i]}`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Cross-app context — full width bottom */}
          <BentoCard
            index={3}
            reduce={reduce}
            className="bg-white ring-1 ring-black/5 md:col-span-2"
          >
            <h3 className="text-xl font-bold text-slate-900">
              Cross-app context
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              See the assignment, the professor&apos;s email, and the study
              thread as one.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
              {THREAD.map((node, i) => (
                <Fragment key={node.label}>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-black/5 sm:flex-1">
                    <span className={`size-2 shrink-0 rounded-full ${node.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {node.label}
                      </p>
                      <p className="text-xs text-slate-500">{node.sub}</p>
                    </div>
                  </div>
                  {i < THREAD.length - 1 && (
                    <div className="mx-auto h-6 w-px bg-slate-200 sm:mx-3 sm:h-px sm:w-8" />
                  )}
                </Fragment>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </motion.section>
  );
}
