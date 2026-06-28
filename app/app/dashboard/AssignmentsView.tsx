"use client";

import { CalendarDays, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedItem } from "./data";

type AssignmentGroup = "Due Today" | "This Week" | "Later";

function groupFor(timestamp?: string | null): AssignmentGroup {
  if (!timestamp) return "Later";
  const due = new Date(timestamp);
  const now = new Date();
  const endToday = new Date(now);
  endToday.setHours(23, 59, 59, 999);
  const endWeek = new Date(endToday);
  endWeek.setDate(endWeek.getDate() + 7);
  if (due <= endToday) return "Due Today";
  if (due <= endWeek) return "This Week";
  return "Later";
}

function formatDue(timestamp?: string | null) {
  if (!timestamp) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function AssignmentsView({
  items,
  onConnectCanvas,
}: {
  items: FeedItem[];
  onConnectCanvas: () => void;
}) {
  const groups: AssignmentGroup[] = ["Due Today", "This Week", "Later"];

  return (
    <main className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6 pb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">Across your Canvas courses, sorted by due date</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/70 bg-white/70 p-8 text-center backdrop-blur-xl">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Link2 size={22} />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Connect Canvas to see your assignments</h2>
            <button
              onClick={onConnectCanvas}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            >
              Connect Canvas
            </button>
          </div>
        ) : (
          groups.map((group) => {
            const groupedItems = items.filter((item) => groupFor(item.timestamp) === group);
            if (groupedItems.length === 0) return null;
            return (
              <section key={group} className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{group}</p>
                {groupedItems.map((item) => (
                  <article
                    key={item.id}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border border-l-4 border-white/70 bg-white/70 p-4 backdrop-blur-xl",
                      group === "Due Today" ? "border-l-rose-400" : group === "This Week" ? "border-l-amber-400" : "border-l-slate-300",
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.context.eyebrow}</p>
                      <h2 className="mt-1 truncate text-sm font-bold text-slate-900">{item.context.title}</h2>
                      {item.preview && <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.preview}</p>}
                    </div>
                    <p className="shrink-0 text-right text-xs font-semibold text-slate-600">{formatDue(item.timestamp)}</p>
                  </article>
                ))}
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
