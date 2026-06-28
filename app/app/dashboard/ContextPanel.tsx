"use client";

import { useState } from "react";
import { Check, Minus, Pencil, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ICON } from "./app-icons";
import {
  APP_META,
  BADGE_TONES,
  type ChecklistState,
  type ContextData,
} from "./data";

export function ContextPanel({
  context,
  onEdit,
  onSend,
  className,
}: {
  context: ContextData;
  onEdit: () => void;
  onSend: (reply: string) => Promise<void>;
  className?: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const DetailIcon = context.detail ? APP_ICON[context.detail.app] : null;

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col overflow-y-auto border-l border-white/60 bg-white/40 px-5 py-6 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Context view
        </p>
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          <Sparkles size={10} /> {context.sourceCount ?? 1} sources stitched
        </span>
      </div>

      <p className="mt-5 text-xs font-medium text-slate-400">{context.eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
        {context.title}
      </h2>
      {context.due && (
        <span
          className={cn(
            "mt-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold",
            BADGE_TONES[context.due.tone],
          )}
        >
          {context.due.label}
        </span>
      )}

      {context.detail && DetailIcon && (
        <div className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-4">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid size-8 place-items-center rounded-lg",
                APP_META[context.detail.app].tile,
              )}
            >
              <DetailIcon className="size-5" />
            </span>
            <p className="text-sm font-semibold text-slate-900">
              {context.detail.heading}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {context.detail.meta.map((m) => (
              <div key={m.label}>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {m.label}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {context.detail.body}
          </p>
          {context.detail.checklist && (
            <ul className="mt-4 space-y-2">
              {context.detail.checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  <ChecklistDot state={c.state} />
                  <span
                    className={
                      c.state === "done" ? "text-slate-400 line-through" : "text-slate-700"
                    }
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {context.thread && (
        <div className="mt-4 rounded-2xl border border-white/70 border-l-4 border-l-rose-300 bg-white/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Gmail thread
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {context.thread.from} · {context.thread.subject}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            &ldquo;{context.thread.preview}&rdquo;
          </p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.04] p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles size={13} /> AI suggested reply
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {context.aiReply}
        </p>
        {sent ? (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <Check size={15} strokeWidth={3} /> Sent
          </p>
        ) : (
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={async () => {
                setSending(true);
                setError("");
                try {
                  await onSend(context.aiReply);
                  setSent(true);
                } catch (sendError) {
                  setError(sendError instanceof Error ? sendError.message : "Could not send reply");
                } finally {
                  setSending(false);
                }
              }}
              disabled={sending || !context.aiReply}
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-500"
            >
              <Send size={14} /> {sending ? "Sending…" : "Confirm & Send"}
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
            >
              <Pencil size={13} /> Edit
            </button>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
      </div>
      <div className="h-4 shrink-0" />
    </aside>
  );
}

function ChecklistDot({ state }: { state: ChecklistState }) {
  if (state === "done") {
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
        <Check size={10} strokeWidth={3.5} />
      </span>
    );
  }
  if (state === "partial") {
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-amber-400 text-white">
        <Minus size={10} strokeWidth={3.5} />
      </span>
    );
  }
  return <span className="size-4 shrink-0 rounded-full border-2 border-slate-300" />;
}
