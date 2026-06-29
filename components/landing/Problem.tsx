"use client";

import { motion } from "framer-motion";

const NOTIFICATIONS = [
  {
    source: "Gmail",
    msg: "Prof Lee: deadline moved to Friday",
    x: "8%",
    y: "10%",
  },
  {
    source: "Canvas",
    msg: "Assignment due in 2 hours",
    x: "62%",
    y: "5%",
  },
  {
    source: "Slack",
    msg: "#eng · standup in 5 min",
    x: "75%",
    y: "40%",
  },
  {
    source: "Discord",
    msg: "Anyone have the notes?",
    x: "5%",
    y: "55%",
  },
  {
    source: "GitHub",
    msg: "PR review requested",
    x: "55%",
    y: "68%",
  },
  {
    source: "Calendar",
    msg: "CS 101 · 3:00 PM today",
    x: "25%",
    y: "72%",
  },
];

const SOURCE_COLORS: Record<string, string> = {
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
      className="scroll-mt-24 overflow-hidden px-6 py-32"
    >
      <div className="mx-auto mb-16 max-w-5xl text-center">
        <h2 className="text-5xl font-black tracking-[-0.04em] text-slate-950 md:text-6xl">
          You have 11 tabs open
          <span className="block font-thin text-slate-400">right now.</span>
        </h2>
      </div>

      <div className="relative mx-auto h-[420px] max-w-4xl">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 800 420"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M 80 60 C 80 200, 400 350, 400 420"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 200 30 C 220 180, 400 330, 400 420"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 500 20 C 480 180, 400 320, 400 420"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 660 50 C 600 200, 410 340, 400 420"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 340 10 C 360 180, 395 300, 400 420"
            stroke="#c7d2fe"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M 560 80 C 520 220, 405 350, 400 420"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 130 30 C 200 200, 395 360, 400 420"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {NOTIFICATIONS.map((notification, index) => (
          <motion.div
            key={notification.source}
            className="absolute w-52 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/[0.08]"
            style={{ left: notification.x, top: notification.y }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {notification.source}
              </span>
              <span
                className={`size-2 rounded-full ${SOURCE_COLORS[notification.source]}`}
              />
            </div>
            <p className="text-sm font-medium leading-snug text-slate-800">
              {notification.msg}
            </p>
          </motion.div>
        ))}

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-indigo-500 shadow-lg shadow-indigo-200">
            <span className="text-lg font-black text-white">O</span>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Orbi sorts it all.
          </p>
        </div>
      </div>
    </section>
  );
}
