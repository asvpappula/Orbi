"use client";

import { Orbit } from "lucide-react";
import { motion } from "framer-motion";
import {
  CanvasIcon,
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  GoogleCalendarIcon,
  SlackIcon,
} from "@/app/app/onboarding/icons";

const NOTIFICATIONS = [
  {
    source: "Gmail",
    message: "Prof Lee: deadline moved to Friday",
    Icon: GmailIcon,
    iconClass: "bg-white",
    position:
      "left-[3%] top-[4%] md:left-[3.5%] md:top-[7%]",
  },
  {
    source: "Canvas",
    message: "Assignment due in 2 hours",
    Icon: CanvasIcon,
    iconClass: "bg-[#d5273e]",
    position:
      "right-[3%] top-[20%] md:left-[30%] md:right-auto md:top-[3%]",
  },
  {
    source: "Slack",
    message: "#eng · standup in 5 min",
    Icon: SlackIcon,
    iconClass: "bg-white",
    position:
      "left-[3%] top-[36%] md:left-auto md:right-[3.5%] md:top-[14%]",
  },
  {
    source: "Discord",
    message: "Anyone have the notes?",
    Icon: DiscordIcon,
    iconClass: "bg-indigo-500",
    position:
      "right-[3%] top-[52%] md:left-[5.5%] md:right-auto md:top-[54%]",
  },
  {
    source: "GitHub",
    message: "PR review requested",
    Icon: GithubIcon,
    iconClass: "bg-slate-100 text-slate-800",
    position:
      "left-[3%] top-[60%] md:left-[58%] md:top-[42%]",
  },
  {
    source: "Calendar",
    message: "CS 101 · 3:00 PM today",
    Icon: GoogleCalendarIcon,
    iconClass: "bg-white",
    position:
      "right-[3%] top-[74%] md:right-[7%] md:top-auto md:bottom-[14%]",
  },
] as const;

const SOURCE_COLORS: Record<(typeof NOTIFICATIONS)[number]["source"], string> = {
  Gmail: "bg-red-500",
  Canvas: "bg-[#d5273e]",
  Slack: "bg-purple-500",
  Discord: "bg-indigo-500",
  GitHub: "bg-slate-800",
  Calendar: "bg-blue-500",
};

export function Problem() {
  return (
    <section
      id="features"
      className="scroll-mt-24 overflow-hidden bg-white pt-32"
    >
      <div className="mb-24 px-6 text-center">
        <h2 className="text-6xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
          You have 11 tabs open
          <span className="block font-thin text-slate-300">right now.</span>
        </h2>
      </div>

      <div className="relative h-[560px] w-full">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="outgoing-ray"
              x1="720"
              y1="330"
              x2="720"
              y2="560"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#6366f1" stopOpacity="0.6" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <filter
              id="thread-glow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="3" result="thread-blur" />
              <feMerge>
                <feMergeNode in="thread-blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 150 105 C 220 235, 535 305, 720 330"
            stroke="#6366f1"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.42"
            filter="url(#thread-glow)"
          />
          <path
            d="M 530 85 C 555 215, 650 305, 720 330"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 1285 150 C 1160 245, 870 310, 720 330"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 180 365 C 350 350, 585 335, 720 330"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 940 305 C 870 315, 785 325, 720 330"
            stroke="#6366f1"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.48"
            filter="url(#thread-glow)"
          />
          <path
            d="M 1240 470 C 1065 415, 855 345, 720 330"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M 720 330 C 625 390, 260 470, 70 560"
            stroke="url(#outgoing-ray)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 720 330 C 660 405, 440 485, 330 560"
            stroke="url(#outgoing-ray)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 720 330 C 700 415, 665 500, 640 560"
            stroke="url(#outgoing-ray)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 720 330 C 740 415, 775 500, 800 560"
            stroke="url(#outgoing-ray)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 720 330 C 780 405, 1000 485, 1110 560"
            stroke="url(#outgoing-ray)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 720 330 C 815 390, 1180 470, 1370 560"
            stroke="url(#outgoing-ray)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        {NOTIFICATIONS.map((notification, index) => {
          const Icon = notification.Icon;

          return (
            <motion.article
              key={notification.source}
              className={`absolute z-10 w-52 rounded-2xl bg-white px-4 py-3.5 shadow-md ring-1 ring-black/[0.06] ${notification.position}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-lg ring-1 ring-black/[0.05] ${notification.iconClass}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {notification.source}
                  </span>
                </div>
                <span
                  className={`size-2 shrink-0 rounded-full ${SOURCE_COLORS[notification.source]}`}
                />
              </div>
              <p className="text-sm font-medium leading-snug text-slate-800">
                {notification.message}
              </p>
            </motion.article>
          );
        })}

        <div className="absolute left-1/2 top-[58.93%] z-20 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative grid size-12 place-items-center rounded-full bg-indigo-500 text-white shadow-2xl shadow-indigo-400/60 ring-4 ring-indigo-200/40"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.72,
              duration: 0.55,
              type: "spring",
              stiffness: 240,
              damping: 18,
            }}
          >
            <span className="absolute left-1/2 top-1/2 -z-10 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/25 blur-2xl" />
            <Orbit size={22} strokeWidth={2.4} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
