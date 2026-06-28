"use client";

// Placeholder UI + data for the Inbox page. Codex wires real data later.
import { useState } from "react";
import { Pencil, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ICON } from "./app-icons";
import { APP_META, type AppKey } from "./data";

const FILTERS = ["All", "Canvas", "Gmail", "Discord", "GroupMe"] as const;
type Filter = (typeof FILTERS)[number];

type InboxMessage = {
  id: string;
  app: AppKey;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  eyebrow: string;
  to: string;
  initials: string;
  accent: string;
  body: string[];
  aiReply: string;
};

const MESSAGES: InboxMessage[] = [
  {
    id: "alvarez",
    app: "gmail",
    from: "Prof. Alvarez",
    subject: "Re: Extension on Project 3",
    preview: "Hi Alex — I can give you until Friday, but please send me…",
    time: "40m",
    unread: true,
    eyebrow: "Gmail · 40m ago",
    to: "me",
    initials: "PA",
    accent: "bg-emerald-500",
    body: [
      "Hi Alex — I can give you until Friday, but please send me whatever you have on the hash map so far so I can see your progress. Stop by office hours if you're stuck.",
      "Best,",
      "Prof. Alvarez",
    ],
    aiReply:
      "Hey Professor Alvarez — thanks so much, that really helps! I'll send over my current map.cpp tonight and have the full version in by Friday.",
  },
  {
    id: "canvas-p3",
    app: "canvas",
    from: "Canvas · CS 251",
    subject: "Project 3: Hash Table Maps",
    preview: "Reminder: this assignment is due today at 11:59 PM. 18/2…",
    time: "2h",
    eyebrow: "Canvas · 2h ago",
    to: "me",
    initials: "C",
    accent: "bg-[#d5273e]",
    body: [
      "Reminder: Project 3 is due today at 11:59 PM. You're currently passing 18 of 20 auto-grader tests.",
      "Submit map.cpp and a brief writeup before the deadline.",
    ],
    aiReply:
      "Note to self: finish the rehash edge cases and the writeup before 11:59 PM tonight.",
  },
  {
    id: "cs251-study",
    app: "discord",
    from: "jordan_k · #cs251-study",
    subject: "rehash test help",
    preview: "anyone figure out the rehash test? mine seg faults at load…",
    time: "1h",
    unread: true,
    eyebrow: "Discord · 1h ago",
    to: "#cs251-study",
    initials: "JK",
    accent: "bg-[#5865f2]",
    body: [
      "anyone figure out the rehash test? mine seg faults right at load factor 0.75. pretty sure it's the resize but i can't see it.",
    ],
    aiReply:
      "i hit that too — rehash BEFORE inserting when load factor crosses 0.75, not after. happy to share my resize().",
  },
  {
    id: "stat240",
    app: "groupme",
    from: "Maya · STAT 240 Group",
    subject: "Meeting at 5?",
    preview: "can we meet at 5 to finish the regression slides? library…",
    time: "2h",
    eyebrow: "GroupMe · 2h ago",
    to: "STAT 240 Group",
    initials: "MA",
    accent: "bg-[#00aff0]",
    body: [
      "can we meet at 5 to finish the regression slides? library room 204. i can do the model diagnostics part if someone takes the intro.",
    ],
    aiReply:
      "5 works for me — I'll grab room 204. I can take the intro slides if you've got the diagnostics.",
  },
  {
    id: "finaid",
    app: "gmail",
    from: "Financial Aid Office",
    subject: "Fall disbursement schedule",
    preview: "Your fall financial aid is scheduled to disburse on August…",
    time: "1d",
    eyebrow: "Gmail · 1d ago",
    to: "me",
    initials: "FA",
    accent: "bg-slate-500",
    body: [
      "Your fall financial aid is scheduled to disburse on August 18. No action is needed unless your enrollment changes.",
      "Review your award details in the student portal.",
    ],
    aiReply:
      "Thanks for the heads up — confirming I'm still enrolled full-time for the fall.",
  },
  {
    id: "office-hours",
    app: "calendar",
    from: "Google Calendar",
    subject: "Office Hours — Dr. Lin",
    preview: "Today · 4:00–5:00 PM · Heavilon 205",
    time: "3h",
    eyebrow: "Google Calendar · Today",
    to: "me",
    initials: "31",
    accent: "bg-[#4285F4]",
    body: [
      "Office Hours with Dr. Lin — Today, 4:00–5:00 PM, Heavilon 205.",
      "Bring your Project 3 questions.",
    ],
    aiReply:
      "Adding a reminder to head to Heavilon 205 by 4 with my rehash question.",
  },
];

export function InboxView() {
  const [selectedId, setSelectedId] = useState(MESSAGES[0].id);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All"
      ? MESSAGES
      : MESSAGES.filter((m) => APP_META[m.app].label === filter);
  const selected =
    filtered.find((m) => m.id === selectedId) ?? filtered[0] ?? MESSAGES[0];

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex w-[400px] shrink-0 flex-col overflow-hidden border-r border-white/60">
        <div className="px-5 pt-6">
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">Inbox</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            One stream from every connected app
          </p>
          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-white/70 text-slate-500 hover:text-slate-800",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {filtered.map((message) => (
            <MessageRow
              key={message.id}
              message={message}
              selected={selected?.id === message.id}
              onClick={() => setSelectedId(message.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-10">
        {selected && <MessageDetail message={selected} />}
      </div>
    </div>
  );
}

function MessageRow({
  message,
  selected,
  onClick,
}: {
  message: InboxMessage;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = APP_ICON[message.app];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition",
        selected ? "bg-white shadow-sm ring-1 ring-primary/15" : "hover:bg-white/60",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg",
          APP_META[message.app].tile,
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">
            {message.from}
          </p>
          <span className="shrink-0 text-[10px] text-slate-400">
            {message.time}
          </span>
        </div>
        <p className="truncate text-xs font-medium text-slate-700">
          {message.subject}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-400">
          {message.preview}
        </p>
      </div>
      {message.unread && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

function MessageDetail({ message }: { message: InboxMessage }) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
        {message.eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
        {message.subject}
      </h2>

      <div className="mt-5 flex items-center gap-2.5">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-full text-xs font-bold text-white",
            message.accent,
          )}
        >
          {message.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{message.from}</p>
          <p className="text-xs text-slate-400">To {message.to}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
        {message.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/[0.04] p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles size={13} /> Orbi drafted a reply in your voice
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {message.aiReply}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-500">
            <Send size={14} /> Confirm &amp; Send
          </button>
          <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary">
            <Pencil size={13} /> Edit draft
          </button>
        </div>
      </div>
    </div>
  );
}
