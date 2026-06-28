"use client";

// Placeholder UI + data for the Replies page. Codex wires real data later.
import { useState } from "react";
import { Pencil, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Reply = {
  id: string;
  to: string;
  source: string;
  time: string;
  initials: string;
  accent: string;
  tone: string;
  original: string;
  draft: string;
};

const REPLIES: Reply[] = [
  {
    id: "alvarez",
    to: "Prof. Alvarez",
    source: "Gmail · Re: Extension on Project 3",
    time: "40m ago",
    initials: "PA",
    accent: "bg-emerald-500",
    tone: "Casual",
    original:
      "I can give you until Friday, but please send me whatever you have on the hash map so far.",
    draft:
      "Hey Professor Alvarez — thanks so much, that really helps! I'll send over my current map.cpp tonight so you can see where I'm at, and I'll have the full version in by Friday.",
  },
  {
    id: "stat240",
    to: "STAT 240 Group",
    source: "GroupMe · Meeting at 5?",
    time: "28m ago",
    initials: "MA",
    accent: "bg-[#00aff0]",
    tone: "Casual",
    original: "can we meet at 5 to finish the regression slides? library room 204",
    draft:
      "5 works for me — I'll be there. I can take the intro + methodology slides if we split it evenly.",
  },
  {
    id: "cs251-study",
    to: "#cs251-study",
    source: "Discord · rehash test",
    time: "12m ago",
    initials: "JK",
    accent: "bg-[#5865f2]",
    tone: "Casual",
    original:
      "anyone figure out the rehash test? mine seg faults right at load factor 0.75",
    draft:
      "i hit that too — rehash BEFORE inserting when load factor crosses 0.75, not after. the seg fault was iterating old buckets after freeing them. happy to share my resize().",
  },
];

export function RepliesView() {
  const [tab, setTab] = useState<"review" | "sent">("review");

  return (
    <main className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-2xl pb-10">
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Replies</h1>
        <p className="mt-1 text-sm text-slate-500">
          Orbi drafts replies in your voice. Review, then send.
        </p>

        <div className="mt-5 flex items-center gap-4 border-b border-slate-200">
          <Tab active={tab === "review"} onClick={() => setTab("review")}>
            Needs review
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-bold text-primary">
              3
            </span>
          </Tab>
          <Tab active={tab === "sent"} onClick={() => setTab("sent")}>
            Sent
          </Tab>
        </div>

        {tab === "review" ? (
          <div className="mt-5 space-y-4">
            {REPLIES.map((reply) => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center text-sm text-slate-400">
            No sent replies yet.
          </div>
        )}
      </div>
    </main>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center pb-3 text-sm font-semibold transition",
        active ? "text-primary" : "text-slate-400 hover:text-slate-600",
      )}
    >
      {children}
      {active && (
        <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
      )}
    </button>
  );
}

function ReplyCard({ reply }: { reply: Reply }) {
  const [status, setStatus] = useState<"idle" | "sent" | "discarded">("idle");

  if (status === "discarded") return null;
  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
        Sent to {reply.to} ✓
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white",
              reply.accent,
            )}
          >
            {reply.initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">To {reply.to}</p>
            <p className="truncate text-xs text-slate-400">
              {reply.source} · {reply.time}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {reply.tone}
        </span>
      </div>

      <p className="mt-4 rounded-xl border-l-2 border-l-slate-300 bg-slate-50 px-3 py-2 text-sm italic text-slate-500">
        &ldquo;{reply.original}&rdquo;
      </p>

      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Sparkles size={13} /> Orbi drafted this in your voice
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{reply.draft}</p>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => setStatus("sent")}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-500"
        >
          <Send size={14} /> Confirm &amp; Send
        </button>
        <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary">
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => setStatus("discarded")}
          className="rounded-full px-4 py-2.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
