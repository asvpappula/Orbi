"use client";

import { useState } from "react";
import { Pencil, Send, Sparkles } from "lucide-react";
import type { FeedItem } from "./data";

export function RepliesView({ items }: { items: FeedItem[] }) {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-2xl pb-10">
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Replies</h1>
        <p className="mt-1 text-sm text-slate-500">Orbi drafts replies in your voice. Review, then send.</p>

        <div className="mt-5 border-b border-slate-200 pb-3 text-sm font-semibold text-primary">
          Needs review
          <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-bold">{items.length}</span>
        </div>

        {items.length === 0 ? (
          <div className="mt-20 text-center text-sm text-slate-400">No pending replies.</div>
        ) : (
          <div className="mt-5 space-y-4">
            {items.map((item) => <ReplyCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </main>
  );
}

function ReplyCard({ item }: { item: FeedItem }) {
  const [status, setStatus] = useState<"idle" | "sent" | "discarded">("idle");
  const thread = item.context.thread;

  if (status === "discarded") return null;
  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
        Sent to {thread?.from ?? "recipient"} ✓
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur-xl">
      <div>
        <p className="text-sm font-semibold text-slate-900">To {thread?.from ?? "Gmail sender"}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">Gmail · {thread?.subject ?? item.context.title} · {item.time}</p>
      </div>
      <p className="mt-4 rounded-xl border-l-2 border-l-slate-300 bg-slate-50 px-3 py-2 text-sm italic text-slate-500">&ldquo;{thread?.preview || item.preview}&rdquo;</p>
      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles size={13} /> Orbi drafted this in your voice</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.context.aiReply}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setStatus("sent")} className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200">
          <Send size={14} /> Confirm &amp; Send
        </button>
        <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
          <Pencil size={13} /> Edit
        </button>
        <button onClick={() => setStatus("discarded")} className="rounded-full px-4 py-2.5 text-sm font-semibold text-rose-500">Discard</button>
      </div>
    </article>
  );
}
