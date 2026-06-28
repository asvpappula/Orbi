"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Home,
  Inbox,
  type LucideIcon,
  Orbit,
  Reply,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBadge, type BadgeStatus } from "@/components/ui/animated-badge";
import { ExpandingSearch } from "@/components/ui/expanding-search";
import { APP_ICON } from "./app-icons";
import {
  APP_META,
  BADGE_TONES,
  FEED,
  type AppKey,
  type BadgeTone,
  type FeedItem,
} from "./data";
import { ContextPanel } from "./ContextPanel";
import { AiReplyComposer } from "./AiReplyComposer";

const NAV: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
  dot?: boolean;
}[] = [
  { icon: Home, label: "Home", active: true },
  { icon: Inbox, label: "Inbox", badge: "2" },
  { icon: ClipboardList, label: "Assignments" },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Reply, label: "Replies", dot: true },
  { icon: Settings, label: "Settings" },
];

const CONNECTED: { app: AppKey; status: BadgeStatus }[] = [
  { app: "canvas", status: "connected" },
  { app: "gmail", status: "connected" },
  { app: "discord", status: "connected" },
  { app: "groupme", status: "connected" },
  { app: "calendar", status: "syncing" },
];

const ACCENT: Record<BadgeTone, string> = {
  due: "border-l-rose-400",
  unread: "border-l-sky-400",
  new: "border-l-slate-300",
  soon: "border-l-amber-400",
};

export function Dashboard() {
  const [selectedId, setSelectedId] = useState(FEED[0].id);
  const [composerOpen, setComposerOpen] = useState(false);

  const selected = FEED.find((f) => f.id === selectedId) ?? FEED[0];
  const context = selected.context;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-slate-950">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <Feed selectedId={selectedId} onSelect={setSelectedId} />
          <ContextPanel
            key={selectedId}
            context={context}
            onEdit={() => setComposerOpen(true)}
            className="hidden w-[384px] shrink-0 xl:flex"
          />
        </div>
      </div>

      <AiReplyComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        thread={context.thread}
        initialReply={context.aiReply}
      />
    </div>
  );
}

function Sidebar() {
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              item.active
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
                  item.active ? "bg-white/25 text-white" : "bg-primary text-white",
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
        {CONNECTED.map(({ app, status }) => {
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
          AR
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            Alex Rivera
          </p>
          <p className="truncate text-xs text-slate-400">Purdue · Junior</p>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-white/60 px-6 py-3.5">
      <ExpandingSearch className="shrink-0" />
      <div className="flex-1" />
      <button
        aria-label="Notifications"
        className="relative grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-slate-500 transition hover:text-primary"
      >
        <Bell size={18} />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>
      <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
        AR
      </span>
    </header>
  );
}

function Feed({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Good morning, Alex
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Orbi pulled 12 things that need attention across your 5 apps.
            </p>
          </div>
          <button className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:text-primary sm:flex">
            Sorted by urgency
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {FEED.map((item) => (
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
