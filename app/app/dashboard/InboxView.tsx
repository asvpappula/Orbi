"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ICON } from "./app-icons";
import { APP_META, type FeedItem } from "./data";

export function InboxView({ items }: { items: FeedItem[] }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    setSelectedId((current) =>
      items.some((item) => item.id === current)
        ? current
        : (items[0]?.id ?? ""),
    );
  }, [items]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  if (items.length === 0) {
    return (
      <main className="grid flex-1 place-items-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Inbox</h1>
          <p className="mt-3 text-sm text-slate-500">
            Your inbox is empty or still syncing.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex w-full shrink-0 flex-col overflow-hidden border-r border-white/60 md:w-[400px]">
        <div className="px-5 pt-6">
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">Inbox</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Your important Gmail messages
          </p>
        </div>

        <div className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {items.map((message) => {
            const Icon = APP_ICON[message.app];
            return (
              <button
                key={message.id}
                onClick={() => setSelectedId(message.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl p-3 text-left transition",
                  selected?.id === message.id
                    ? "bg-white shadow-sm ring-1 ring-primary/15"
                    : "hover:bg-white/60",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", APP_META[message.app].tile)}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {message.context.thread?.from ?? "Gmail"}
                    </p>
                    <span className="shrink-0 text-[10px] text-slate-400">{message.time}</span>
                  </div>
                  <p className="truncate text-xs font-medium text-slate-700">{message.context.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{message.preview}</p>
                </div>
                {message.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden flex-1 overflow-y-auto px-6 py-7 md:block sm:px-10">
        {selected && (
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Gmail · {selected.time}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {selected.context.title}
            </h2>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-900">
                {selected.context.thread?.from ?? "Unknown sender"}
              </p>
              <p className="text-xs text-slate-400">
                {selected.context.thread?.fromEmail ?? "Gmail"}
              </p>
            </div>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {selected.context.detail?.body || selected.preview}
            </p>
            {selected.context.aiReply.trim() && (
              <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles size={13} /> Orbi drafted a reply in your voice
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.context.aiReply}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
