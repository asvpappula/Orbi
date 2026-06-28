"use client";

// Placeholder UI + data for the Calendar page. Codex wires real data later.
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = [
  { label: "MON", date: 22 },
  { label: "TUE", date: 23 },
  { label: "WED", date: 24, today: true },
  { label: "THU", date: 25 },
  { label: "FRI", date: 26 },
  { label: "SAT", date: 27 },
  { label: "SUN", date: 28 },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const HOUR_HEIGHT = 56;
const START_HOUR = 8;

type EventType = "class" | "deadline" | "group";
const EVENT_STYLES: Record<EventType, string> = {
  class: "bg-sky-100 text-sky-800 border-l-2 border-l-sky-400",
  deadline: "bg-rose-100 text-rose-800 border-l-2 border-l-rose-400",
  group: "bg-emerald-100 text-emerald-800 border-l-2 border-l-emerald-400",
};

type CalEvent = {
  day: number;
  start: number;
  end: number;
  title: string;
  sub?: string;
  type: EventType;
};

const EVENTS: CalEvent[] = [
  { day: 0, start: 10.17, end: 11.17, title: "CS 251 Lecture", sub: "10:10 AM", type: "class" },
  { day: 0, start: 14, end: 15, title: "BIO 110", sub: "2:00 PM", type: "class" },
  { day: 1, start: 9.17, end: 10.17, title: "STAT 240 Lecture", sub: "9:10 AM", type: "class" },
  { day: 1, start: 16.4, end: 17.2, title: "Project 3 Due", sub: "11:59 PM", type: "deadline" },
  { day: 2, start: 10.17, end: 11.17, title: "CS 251 Lecture", sub: "10:10 AM", type: "class" },
  { day: 2, start: 16, end: 17, title: "Office Hours — Dr. Lin", sub: "4:00 PM", type: "class" },
  { day: 3, start: 16.5, end: 17.3, title: "STAT group · rm 204", sub: "5:00 PM", type: "group" },
  { day: 4, start: 10.17, end: 11.17, title: "CS 251 Lecture", sub: "10:10 AM", type: "class" },
  { day: 4, start: 12, end: 13, title: "Study Jam (Discord)", sub: "12:00 PM", type: "group" },
];

function formatHour(hour: number) {
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export function CalendarView() {
  const [view, setView] = useState<"Week" | "Month">("Week");

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">June 2026</h1>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous"
              className="grid size-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-primary"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              aria-label="Next"
              className="grid size-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-primary"
            >
              <ChevronRight size={15} />
            </button>
          </div>
          <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:text-primary">
            Today
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-xs text-slate-500 sm:flex">
            <Legend color="bg-sky-400" label="Class" />
            <Legend color="bg-rose-400" label="Deadline" />
            <Legend color="bg-emerald-400" label="Group" />
          </div>
          <div className="flex rounded-full bg-slate-100 p-0.5">
            {(["Week", "Month"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setView(option)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  view === option
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/60 backdrop-blur-xl">
        <div
          className="grid shrink-0 border-b border-slate-100"
          style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}
        >
          <div />
          {DAYS.map((day) => (
            <div key={day.date} className="border-l border-slate-100 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {day.label}
              </p>
              <p
                className={cn(
                  "mx-auto mt-0.5 grid size-7 place-items-center rounded-full text-sm font-semibold",
                  day.today ? "bg-primary text-white" : "text-slate-700",
                )}
              >
                {day.date}
              </p>
            </div>
          ))}
        </div>

        {view === "Week" ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
              <div>
                {HOURS.map((hour) => (
                  <div key={hour} style={{ height: HOUR_HEIGHT }} className="relative">
                    <span className="absolute -top-1.5 right-2 text-[10px] text-slate-400">
                      {formatHour(hour)}
                    </span>
                  </div>
                ))}
              </div>
              {DAYS.map((day, dayIndex) => (
                <div key={day.date} className="relative border-l border-slate-100">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      style={{ height: HOUR_HEIGHT }}
                      className="border-b border-slate-50"
                    />
                  ))}
                  {EVENTS.filter((event) => event.day === dayIndex).map((event, index) => (
                    <div
                      key={index}
                      style={{
                        top: (event.start - START_HOUR) * HOUR_HEIGHT + 1,
                        height: (event.end - event.start) * HOUR_HEIGHT - 3,
                      }}
                      className={cn(
                        "absolute inset-x-1 overflow-hidden rounded-md px-1.5 py-1 text-[10px] font-semibold leading-tight",
                        EVENT_STYLES[event.type],
                      )}
                    >
                      <p className="truncate">{event.title}</p>
                      {event.sub && (
                        <p className="truncate font-normal opacity-70">{event.sub}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid flex-1 place-items-center text-sm text-slate-400">
            Month view coming soon
          </div>
        )}
      </div>
    </main>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", color)} />
      {label}
    </span>
  );
}
