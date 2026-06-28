"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";
import {
  CanvasIcon,
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  GoogleCalendarIcon,
  NotionIcon,
  SlackIcon,
} from "@/app/app/onboarding/icons";

const TOOLS = [
  { name: "Canvas", Icon: CanvasIcon, tile: "bg-[#d5273e]" },
  { name: "Gmail", Icon: GmailIcon, tile: "bg-white ring-1 ring-slate-200" },
  { name: "Slack", Icon: SlackIcon, tile: "bg-white ring-1 ring-slate-200" },
  { name: "GitHub", Icon: GithubIcon, tile: "bg-slate-900 text-white" },
  { name: "Discord", Icon: DiscordIcon, tile: "bg-[#5865f2]" },
  { name: "Notion", Icon: NotionIcon, tile: "bg-white ring-1 ring-slate-200" },
  {
    name: "Google Calendar",
    Icon: GoogleCalendarIcon,
    tile: "bg-white ring-1 ring-slate-200",
  },
];

export function Hero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center"
    >
      {/* Animated gradient mesh + dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="animate-float absolute -left-32 -top-24 size-[520px] rounded-full bg-[#6366f1] opacity-40 blur-3xl" />
        <div className="animate-float-rev absolute -bottom-32 -right-24 size-[560px] rounded-full bg-[#8b5cf6] opacity-40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.15)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <motion.p
        {...fadeUp(reduce, 0)}
        className="text-xs font-semibold uppercase tracking-[0.22em] text-primary"
      >
        Your unified student + founder inbox
      </motion.p>

      <motion.h1
        {...fadeUp(reduce, 0.1)}
        className="mt-6 max-w-4xl text-6xl font-black leading-[1.05] tracking-tight text-slate-900 md:text-8xl"
      >
        Everything that matters,
        <br />
        finally in one place.
      </motion.h1>

      <motion.p
        {...fadeUp(reduce, 0.2)}
        className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500"
      >
        Canvas assignments, Gmail, Slack, Discord, and every deadline — pulled
        together by AI that knows how you communicate.
      </motion.p>

      <motion.div
        {...fadeUp(reduce, 0.3)}
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        <a
          href="#waitlist"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          Get early access
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
        >
          See how it works
        </a>
      </motion.div>

      <motion.div {...fadeUp(reduce, 0.4)} className="mt-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Works with your tools
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {TOOLS.map(({ name, Icon, tile }, index) => (
            <motion.span
              key={name}
              title={name}
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.15,
                      ease: "easeInOut",
                    }
              }
              className={cn(
                "grid size-11 place-items-center rounded-xl shadow-sm transition-all duration-300",
                tile,
              )}
            >
              <Icon className="size-6" />
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
