"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  Inbox,
  LogOut,
  type LucideIcon,
  Orbit,
  Reply,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { AnimatedBadge, type BadgeStatus } from "@/components/ui/animated-badge";
import { ExpandingSearch } from "@/components/ui/expanding-search";
import { APP_ICON } from "./app-icons";
import {
  APP_META,
  BADGE_TONES,
  type AppKey,
  type BadgeTone,
  type FeedItem,
} from "./data";
import { ContextPanel } from "./ContextPanel";
import { AiReplyComposer } from "./AiReplyComposer";
import { InboxView } from "./InboxView";
import { SettingsView } from "./SettingsView";
import { RepliesView } from "./RepliesView";
import { AssignmentsView } from "./AssignmentsView";
import { CanvasConnectModal } from "@/app/app/onboarding/CanvasConnectModal";

type CalendarEvent = {
  id: string;
  title: string;
  start: string | null;
  end: string | null;
  location: string | null;
  description: string | null;
};

type NavLabel =
  | "Home"
  | "Inbox"
  | "Assignments"
  | "Calendar"
  | "Replies"
  | "Settings";

const NAV: {
  icon: LucideIcon;
  label: NavLabel;
  badge?: string;
  dot?: boolean;
}[] = [
  { icon: Home, label: "Home" },
  { icon: Inbox, label: "Inbox", badge: "2" },
  { icon: ClipboardList, label: "Assignments" },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Reply, label: "Replies", dot: true },
  { icon: Settings, label: "Settings" },
];

const ACCENT: Record<BadgeTone, string> = {
  due: "border-l-rose-400",
  unread: "border-l-sky-400",
  new: "border-l-slate-300",
  soon: "border-l-amber-400",
};

export function Dashboard({
  fullName,
  connectedApps,
  initialNav = "Home",
}: {
  fullName: string;
  connectedApps: string[];
  initialNav?: NavLabel;
}) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [activeNav, setActiveNav] = useState<NavLabel>(initialNav);
  const [syncErrors, setSyncErrors] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [canvasModalOpen, setCanvasModalOpen] = useState(false);
  const firstName = fullName.split(/\s+/)[0] || "Student";

  const loadFeed = useCallback(async () => {
    const response = await fetch("/api/feed", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load your feed");
    const payload = (await response.json()) as { items: FeedItem[] };
    setFeed(payload.items);
    setSelectedId((current) =>
      payload.items.some((item) => item.id === current)
        ? current
        : (payload.items[0]?.id ?? ""),
    );
  }, []);

  const sync = useCallback(async () => {
    const response = await fetch("/api/sync", { method: "POST" });
    const payload = (await response.json().catch(() => ({}))) as {
      syncedAt?: string;
      error?: string;
      integrations?: Array<{ name: string; ok: boolean; error?: string }>;
    };
    const failures = (payload.integrations ?? []).filter(
      (integration) => !integration.ok,
    );
    setSyncErrors(
      failures.length > 0
        ? failures.map(
            (integration) =>
              `${integration.name}: ${integration.error ?? "Sync failed"}`,
          )
        : response.ok
          ? []
          : [payload.error ?? "Sync failed"],
    );
    if (response.ok) {
      setLastSynced(payload.syncedAt ? new Date(payload.syncedAt) : new Date());
    }
    await loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    void sync().catch(console.error);
    const interval = window.setInterval(() => void sync().catch(console.error), 15 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [sync]);

  useEffect(() => {
    if (!["Inbox", "Assignments", "Replies"].includes(activeNav)) return;
    void loadFeed().catch(console.error);
  }, [activeNav, loadFeed]);

  useEffect(() => {
    if (activeNav !== "Calendar") return;
    let cancelled = false;
    setCalendarLoading(true);
    setCalendarError("");
    void fetch("/api/integrations/calendar/events", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as {
          events?: CalendarEvent[];
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error ?? "Could not load your calendar");
        if (!cancelled) setCalendarEvents(payload.events ?? []);
      })
      .catch((error) => {
        if (!cancelled) {
          setCalendarEvents([]);
          setCalendarError(error instanceof Error ? error.message : "Could not load your calendar");
        }
      })
      .finally(() => {
        if (!cancelled) setCalendarLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeNav]);

  const selectItem = useCallback(async (id: string) => {
    setSelectedId(id);
    const item = feed.find((value) => value.id === id);
    if (!item?.itemType) return;
    try {
      const response = await fetch("/api/ai/stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: {
            title: item.title,
            body: item.preview,
            course: item.context.eyebrow,
            app: item.app,
          },
        }),
      });
      if (!response.ok || !response.body) return;
      const text = await response.text();
      const lines = text.trim().split("\n");
      const result = lines
        .map((line) => JSON.parse(line) as { type: string; data?: string })
        .find((line) => line.type === "result")?.data;
      if (!result) return;
      setFeed((current) =>
        current.map((value) => {
          if (value.id !== id) return value;
          return {
            ...value,
            context: { ...value.context, contextSummary: result },
          };
        }),
      );
    } catch (error) {
      console.error("Could not stitch context", error);
    }
  }, [feed]);

  const filteredFeed = useMemo(() => {
    switch (activeNav) {
      case "Inbox":
        return feed.filter((item) => item.app === "gmail");
      case "Assignments":
        return feed.filter((item) => item.app === "canvas");
      case "Calendar":
        return feed;
      case "Replies":
        return feed.filter(
          (item) =>
            item.app === "gmail" &&
            item.unread === true &&
            item.context.aiReply.trim().length > 0,
        );
      case "Settings":
        return [];
      default:
        return feed;
    }
  }, [activeNav, feed]);

  useEffect(() => {
    if (activeNav === "Settings") return;
    setSelectedId((current) =>
      filteredFeed.some((item) => item.id === current)
        ? current
        : (filteredFeed[0]?.id ?? ""),
    );
  }, [activeNav, filteredFeed]);

  const selected = useMemo(
    () =>
      filteredFeed.find((item) => item.id === selectedId) ?? filteredFeed[0],
    [filteredFeed, selectedId],
  );
  const context = selected?.context;
  const isFeedView = activeNav === "Home";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-slate-950">
      <Sidebar
        fullName={fullName}
        connectedApps={connectedApps}
        activeNav={activeNav}
        onNavSelect={setActiveNav}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar fullName={fullName} lastSynced={lastSynced} />
        <div className="flex min-h-0 flex-1">
          {activeNav === "Inbox" ? (
            <InboxView items={filteredFeed} />
          ) : activeNav === "Assignments" ? (
            <AssignmentsView
              items={filteredFeed}
              onConnectCanvas={() => setCanvasModalOpen(true)}
            />
          ) : activeNav === "Calendar" ? (
            <CalendarView
              events={calendarEvents}
              loading={calendarLoading}
              error={calendarError}
            />
          ) : activeNav === "Replies" ? (
            <RepliesView items={filteredFeed} />
          ) : activeNav === "Settings" ? (
            <SettingsView />
          ) : (
            <>
              <Feed
                items={filteredFeed}
                firstName={firstName}
                selectedId={selectedId}
                syncErrors={syncErrors}
                onSelect={selectItem}
              />
              {context && (
                <ContextPanel
                  key={selectedId}
                  context={context}
                  onEdit={() => setComposerOpen(true)}
                  onSend={async (reply) => {
                    if (!context.thread?.fromEmail) throw new Error("No Gmail recipient found");
                    const response = await fetch("/api/integrations/gmail/send", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        to: context.thread.fromEmail,
                        subject: context.thread.subject.startsWith("Re:")
                          ? context.thread.subject
                          : `Re: ${context.thread.subject}`,
                        body: reply,
                        threadId: context.thread.threadId,
                      }),
                    });
                    if (!response.ok) throw new Error("Could not send reply");
                  }}
                  className="hidden w-[384px] shrink-0 xl:flex"
                />
              )}
            </>
          )}
        </div>
      </div>

      {isFeedView && context && (
        <AiReplyComposer
          open={composerOpen}
          onClose={() => setComposerOpen(false)}
          thread={context.thread}
          initialReply={context.aiReply}
        />
      )}

      <CanvasConnectModal
        open={canvasModalOpen}
        onClose={() => setCanvasModalOpen(false)}
        onConnected={() => void sync().catch(console.error)}
      />
    </div>
  );
}

const CALENDAR_START_HOUR = 7;
const CALENDAR_END_HOUR = 22;
const CALENDAR_HOUR_HEIGHT = 64;
const CALENDAR_HOURS = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_, index) => CALENDAR_START_HOUR + index,
);

type CalendarMode = "Week" | "Month";
type CalendarEventKind = "regular" | "deadline" | "group";

const CALENDAR_EVENT_STYLES: Record<CalendarEventKind, string> = {
  regular: "border-blue-400 bg-blue-100 text-blue-800",
  deadline: "border-rose-400 bg-rose-100 text-rose-800",
  group: "border-emerald-400 bg-emerald-100 text-emerald-800",
};

function calendarDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calendarEventDateKey(value: string | null) {
  if (!value) return "";
  if (!value.includes("T")) return value.slice(0, 10);
  return calendarDateKey(new Date(value));
}

function calendarWeekStart(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  return date;
}

function addCalendarDays(value: Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

function calendarEventKind(event: CalendarEvent): CalendarEventKind {
  const text = `${event.title} ${event.description ?? ""}`.toLowerCase();
  if (/\b(due|deadline|submit|assignment|exam|quiz)\b/.test(text)) {
    return "deadline";
  }
  if (/\b(group|social|study|club|team|party|meetup|hangout)\b/.test(text)) {
    return "group";
  }
  return "regular";
}

function calendarTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function calendarHourLabel(hour: number) {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? "PM" : "AM"}`;
}

function CalendarView({
  events,
  loading,
  error,
}: {
  events: CalendarEvent[];
  loading: boolean;
  error: string;
}) {
  const [mode, setMode] = useState<CalendarMode>("Week");
  const [weekStart, setWeekStart] = useState(() => calendarWeekStart(new Date()));
  const todayKey = calendarDateKey(new Date());
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addCalendarDays(weekStart, index)),
    [weekStart],
  );
  const monthAnchor = addCalendarDays(weekStart, 3);

  const eventsByDay = useMemo(() => {
    const result = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = calendarEventDateKey(event.start);
      if (!key) continue;
      result.set(key, [...(result.get(key) ?? []), event]);
    }
    return result;
  }, [events]);

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="mr-1 text-2xl font-semibold tracking-[-0.04em]">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(monthAnchor)}
          </h1>
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => setWeekStart((current) => addCalendarDays(current, -7))}
            className="grid size-8 place-items-center rounded-full border border-white/80 bg-white/70 text-slate-500 shadow-sm transition hover:text-primary"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => setWeekStart((current) => addCalendarDays(current, 7))}
            className="grid size-8 place-items-center rounded-full border border-white/80 bg-white/70 text-slate-500 shadow-sm transition hover:text-primary"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(calendarWeekStart(new Date()))}
            className="rounded-full border border-primary/15 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-[11px] text-slate-500 lg:flex">
            <CalendarLegend color="bg-blue-500" label="Event" />
            <CalendarLegend color="bg-rose-500" label="Deadline" />
            <CalendarLegend color="bg-emerald-500" label="Group" />
          </div>
          <div className="flex rounded-full bg-white/55 p-1">
            {(["Week", "Month"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  mode === option
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-400 hover:text-slate-600",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      <div className="mt-4 min-h-0 flex-1 overflow-auto rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl">
        {loading ? (
          <div className="grid h-full min-h-80 place-items-center text-sm text-slate-400">
            Loading your calendar…
          </div>
        ) : mode === "Week" ? (
          <CalendarWeekGrid
            eventsByDay={eventsByDay}
            todayKey={todayKey}
            weekDays={weekDays}
          />
        ) : (
          <CalendarMonthGrid
            anchor={monthAnchor}
            eventsByDay={eventsByDay}
            todayKey={todayKey}
          />
        )}
      </div>
    </main>
  );
}

function CalendarWeekGrid({
  eventsByDay,
  todayKey,
  weekDays,
}: {
  eventsByDay: Map<string, CalendarEvent[]>;
  todayKey: string;
  weekDays: Date[];
}) {
  const timedHeight = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT;

  return (
    <div className="min-w-[900px]">
      <div
        className="sticky top-0 z-20 grid border-b border-slate-100 bg-white/90 backdrop-blur-xl"
        style={{ gridTemplateColumns: "64px repeat(7, minmax(112px, 1fr))" }}
      >
        <div />
        {weekDays.map((day) => {
          const key = calendarDateKey(day);
          return (
            <div key={key} className="border-l border-slate-100 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day)}
              </p>
              <p
                className={cn(
                  "mx-auto mt-0.5 grid size-7 place-items-center rounded-full text-sm font-semibold",
                  key === todayKey ? "bg-primary text-white" : "text-slate-700",
                )}
              >
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="grid border-b border-slate-100 bg-white/45"
        style={{ gridTemplateColumns: "64px repeat(7, minmax(112px, 1fr))" }}
      >
        <div className="flex items-center justify-end px-2 py-2 text-[10px] font-semibold text-slate-400">
          All-day
        </div>
        {weekDays.map((day) => {
          const key = calendarDateKey(day);
          const allDayEvents = (eventsByDay.get(key) ?? []).filter(
            (event) => event.start && !event.start.includes("T"),
          );
          return (
            <div key={key} className="min-h-11 space-y-1 border-l border-slate-100 p-1.5">
              {allDayEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "truncate rounded-md border-l-2 px-2 py-1 text-[10px] font-semibold",
                    CALENDAR_EVENT_STYLES[calendarEventKind(event)],
                  )}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "64px repeat(7, minmax(112px, 1fr))" }}
      >
        <div className="relative" style={{ height: timedHeight }}>
          {CALENDAR_HOURS.map((hour, index) => (
            <span
              key={hour}
              className="absolute right-2 -translate-y-1/2 text-[10px] text-slate-400"
              style={{ top: index * CALENDAR_HOUR_HEIGHT }}
            >
              {calendarHourLabel(hour)}
            </span>
          ))}
        </div>

        {weekDays.map((day) => {
          const key = calendarDateKey(day);
          const timedEvents = (eventsByDay.get(key) ?? []).filter(
            (event) => event.start?.includes("T"),
          );
          return (
            <div
              key={key}
              className={cn(
                "relative border-l border-slate-100",
                key === todayKey && "bg-primary/[0.025]",
              )}
              style={{ height: timedHeight }}
            >
              {CALENDAR_HOURS.slice(0, -1).map((hour) => (
                <div
                  key={hour}
                  className="border-b border-slate-100/80"
                  style={{ height: CALENDAR_HOUR_HEIGHT }}
                />
              ))}
              {timedEvents.map((event) => {
                const start = new Date(event.start as string);
                const rawEnd = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
                const startHour = start.getHours() + start.getMinutes() / 60;
                const endHour = rawEnd.getHours() + rawEnd.getMinutes() / 60;
                if (endHour <= CALENDAR_START_HOUR || startHour >= CALENDAR_END_HOUR) return null;
                const visibleStart = Math.max(startHour, CALENDAR_START_HOUR);
                const visibleEnd = Math.min(Math.max(endHour, startHour + 0.5), CALENDAR_END_HOUR);
                const top = (visibleStart - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT;
                const height = Math.max(28, (visibleEnd - visibleStart) * CALENDAR_HOUR_HEIGHT - 3);
                return (
                  <div
                    key={event.id}
                    title={`${event.title} · ${calendarTime(start)}`}
                    className={cn(
                      "absolute inset-x-1.5 z-10 overflow-hidden rounded-lg border-l-[3px] px-2 py-1.5 text-[10px] leading-tight shadow-sm",
                      CALENDAR_EVENT_STYLES[calendarEventKind(event)],
                    )}
                    style={{ top, height }}
                  >
                    <p className="truncate font-bold">{event.title}</p>
                    <p className="mt-0.5 truncate opacity-70">
                      {calendarTime(start)}–{calendarTime(rawEnd)}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarMonthGrid({
  anchor,
  eventsByDay,
  todayKey,
}: {
  anchor: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  todayKey: string;
}) {
  const firstDay = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const lastDay = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const leadingDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const cells: Array<Date | null> = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from(
      { length: lastDay.getDate() },
      (_, index) => new Date(anchor.getFullYear(), anchor.getMonth(), index + 1),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="min-w-[700px] p-4">
      <div className="grid grid-cols-7 border-b border-slate-100 pb-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="min-h-24 border-b border-r border-slate-100/80" />;
          const key = calendarDateKey(day);
          const dayEvents = eventsByDay.get(key) ?? [];
          return (
            <div key={key} className="min-h-24 border-b border-r border-slate-100/80 p-2">
              <span className={cn("grid size-7 place-items-center rounded-full text-xs font-semibold", key === todayKey ? "bg-primary text-white" : "text-slate-600")}>{day.getDate()}</span>
              <div className="mt-2 flex flex-wrap gap-1">
                {dayEvents.slice(0, 5).map((event) => (
                  <span key={event.id} title={event.title} className={cn("size-2 rounded-full", calendarEventKind(event) === "deadline" ? "bg-rose-500" : calendarEventKind(event) === "group" ? "bg-emerald-500" : "bg-blue-500")} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarLegend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-sm", color)} />
      {label}
    </span>
  );
}

function Sidebar({
  fullName,
  connectedApps,
  activeNav,
  onNavSelect,
}: {
  fullName: string;
  connectedApps: string[];
  activeNav: NavLabel;
  onNavSelect: (label: NavLabel) => void;
}) {
  const initials = fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const candidates: { app: AppKey; integrations: string[]; status: BadgeStatus }[] = [
    { app: "canvas", integrations: ["canvas", "canvas_ical"], status: "connected" },
    { app: "gmail", integrations: ["gmail"], status: "connected" },
    { app: "discord", integrations: ["discord"], status: "connected" },
    { app: "slack", integrations: ["slack"], status: "connected" },
    { app: "github", integrations: ["github"], status: "connected" },
    { app: "groupme", integrations: ["groupme"], status: "connected" },
    { app: "calendar", integrations: ["google_calendar"], status: "connected" },
  ];
  const connected = candidates.filter(({ integrations }) =>
    integrations.some((integration) => connectedApps.includes(integration)),
  );
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/60 bg-white/45 px-4 py-5 backdrop-blur-xl md:flex">
      <div className="flex items-center gap-2.5 px-2">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-white shadow-lg shadow-indigo-300/60">
          <Orbit size={19} strokeWidth={2.4} />
        </span>
        <span className="text-xl font-extrabold tracking-[-0.04em]">Orbi</span>
      </div>

      <nav className="mt-8 space-y-1">
        {NAV.map((item) => (
          <motion.button
            key={item.label}
            onClick={() => onNavSelect(item.label)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeNav === item.label
                ? "bg-primary text-white shadow-md shadow-indigo-200"
                : "text-slate-600 hover:bg-white/80 hover:text-slate-950",
            )}
          >
            <item.icon size={18} strokeWidth={2.2} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                  activeNav === item.label
                    ? "bg-white/25 text-white"
                    : "bg-primary text-white",
                )}
              >
                {item.badge}
              </span>
            )}
            {item.dot && (
              <span className="size-1.5 rounded-full bg-primary" />
            )}
          </motion.button>
        ))}
      </nav>

      <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Connected apps
      </p>
      <div className="mt-2 space-y-0.5">
        {connected.map(({ app, status }) => {
          const Icon = APP_ICON[app];
          return (
            <div
              key={app}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2"
            >
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-md",
                  APP_META[app].tile,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-slate-700">
                {APP_META[app].label}
              </span>
              <AnimatedBadge status={status} />
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/60 p-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {fullName}
          </p>
          <p className="truncate text-xs text-slate-400">Purdue · Junior</p>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ fullName, lastSynced }: { fullName: string; lastSynced: Date | null }) {
  const initials = fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);
  const minutes = lastSynced
    ? Math.max(0, Math.floor((now - lastSynced.getTime()) / 60_000))
    : null;
  return (
    <header className="flex items-center gap-4 border-b border-white/60 px-6 py-3.5">
      <ExpandingSearch className="shrink-0" />
      <span className="text-xs text-slate-400">
        {minutes === null
          ? "Syncing…"
          : `Last synced ${minutes < 1 ? "<1 min" : `${minutes}m`} ago`}
      </span>
      <div className="flex-1" />
      <button
        aria-label="Notifications"
        className="relative grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-slate-500 transition hover:text-primary"
      >
        <Bell size={18} />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>
      <ProfileMenu initials={initials} />
    </header>
  );
}

function ProfileMenu({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const items = [
    {
      icon: User,
      label: "Account",
      onClick: () => console.log("Account — coming soon"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => console.log("Settings — coming soon"),
    },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "grid size-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white transition",
          open
            ? "shadow-lg shadow-indigo-300/50 ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
            : "hover:shadow-md hover:shadow-indigo-200",
        )}
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            style={{ transformOrigin: "top right" }}
            className="glass absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl p-1.5"
          >
            {items.map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={onClick}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Feed({
  items,
  firstName,
  selectedId,
  syncErrors,
  onSelect,
}: {
  items: FeedItem[];
  firstName: string;
  selectedId: string;
  syncErrors: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Good morning, {firstName}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Orbi pulled {items.length} things that need attention across your apps.
            </p>
            {syncErrors.length > 0 && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Some integrations had issues: {syncErrors.join(", ")}
              </div>
            )}
          </div>
          <button className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:text-primary sm:flex">
            Sorted by urgency
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function FeedCard({
  item,
  selected,
  onSelect,
}: {
  item: FeedItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = APP_ICON[item.app];
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-2xl border border-l-4 p-4 text-left transition",
        ACCENT[item.badge.tone],
        selected
          ? "border-primary/30 bg-white shadow-[0_18px_50px_-30px_rgba(99,102,241,0.5)] ring-1 ring-primary/20"
          : "border-white/60 bg-white/55 hover:-translate-y-0.5 hover:bg-white/80",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl",
            APP_META[item.app].tile,
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {APP_META[item.app].label}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  BADGE_TONES[item.badge.tone],
                )}
              >
                {item.badge.label}
              </span>
              <span className="text-[10px] text-slate-400">{item.time}</span>
            </div>
          </div>
          <p className="mt-1 flex items-center gap-2 truncate text-sm font-bold text-slate-900">
            {item.unread && (
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
            )}
            {item.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {item.preview}
          </p>
        </div>
      </div>
    </button>
  );
}
