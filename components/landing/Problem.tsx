"use client";

import { Orbit } from "lucide-react";
import { motion } from "framer-motion";

const NOTIFICATIONS = [
  {
    source: "Gmail",
    message: "Prof Lee: deadline moved to Friday",
    position:
      "left-[3%] top-[4%] md:left-[3.5%] md:top-[7%]",
  },
  {
    source: "Canvas",
    message: "Assignment due in 2 hours",
    position:
      "right-[3%] top-[20%] md:left-[30%] md:right-auto md:top-[3%]",
  },
  {
    source: "Slack",
    message: "#eng · standup in 5 min",
    position:
      "left-[3%] top-[36%] md:left-auto md:right-[3.5%] md:top-[14%]",
  },
  {
    source: "Discord",
    message: "Anyone have the notes?",
    position:
      "right-[3%] top-[52%] md:left-[5.5%] md:right-auto md:top-[54%]",
  },
  {
    source: "GitHub",
    message: "PR review requested",
    position:
      "left-[3%] top-[60%] md:left-[58%] md:top-[42%]",
  },
  {
    source: "Calendar",
    message: "CS 101 · 3:00 PM today",
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
          <path
            d="M 150 105 C 190 300, 585 475, 720 530"
            stroke="#6366f1"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M 530 85 C 500 265, 610 455, 720 530"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 1285 150 C 1215 315, 885 465, 720 530"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 180 365 C 315 430, 585 495, 720 530"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 940 305 C 915 405, 800 490, 720 530"
            stroke="#6366f1"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.48"
          />
          <path
            d="M 1240 470 C 1080 485, 865 520, 720 530"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {NOTIFICATIONS.map((notification, index) => (
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
              <span className="text-xs font-semibold text-slate-400">
                {notification.source}
              </span>
              <span
                className={`size-2 shrink-0 rounded-full ${SOURCE_COLORS[notification.source]}`}
              />
            </div>
            <p className="text-sm font-medium leading-snug text-slate-800">
              {notification.message}
            </p>
          </motion.article>
        ))}

        <div className="absolute left-1/2 top-[488px] z-20 -translate-x-1/2">
          <motion.div
            className="flex flex-col items-center gap-1"
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
            <div className="relative grid size-12 place-items-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-200">
              <span className="absolute -inset-3 -z-10 rounded-full bg-indigo-200/55 blur-md" />
              <span className="absolute -inset-1 rounded-full ring-1 ring-indigo-300/50" />
              <Orbit size={22} strokeWidth={2.4} />
            </div>
            <p className="whitespace-nowrap text-sm font-semibold text-slate-500">
              Orbi sorts it all.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
