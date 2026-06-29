"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  ClipboardList,
  Home as HomeIcon,
  Inbox,
  type LucideIcon,
  Orbit,
  Reply,
  Settings,
} from "lucide-react";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { Features } from "@/components/landing/Features";
import { FlowLines } from "@/components/landing/FlowLines";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Problem } from "@/components/landing/Problem";
import { Testimonials } from "@/components/landing/Testimonials";
import { WaitlistCTA } from "@/components/landing/WaitlistCTA";

const ORBI_CARDS: CardStackItem[] = [
  {
    id: 1,
    title: "Unified Inbox",
    description: "Canvas, Gmail, Slack, Discord — one prioritized feed",
    href: "#waitlist",
  },
  {
    id: 2,
    title: "AI Reply Drafts",
    description: "Responds in your exact voice. You just confirm.",
    href: "#waitlist",
  },
  {
    id: 3,
    title: "Canvas Assignments",
    description: "Every deadline pulled automatically. No token needed.",
    href: "#waitlist",
  },
  {
    id: 4,
    title: "Smart Calendar",
    description: "All deadlines and events in one visual week view.",
    href: "#waitlist",
  },
  {
    id: 5,
    title: "Cross-App Context",
    description: "See the assignment, email, and Discord thread — together.",
    href: "#waitlist",
  },
];

/** Renders a full 1200×750 dashboard replica shrunk into the card bounds. */
function ScaledScreen({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <div
        style={{
          width: 1200,
          height: 750,
          transform: "scale(0.433)",
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const SHELL_NAV: { label: string; Icon: LucideIcon }[] = [
  { label: "Home", Icon: HomeIcon },
  { label: "Inbox", Icon: Inbox },
  { label: "Assignments", Icon: ClipboardList },
  { label: "Calendar", Icon: CalendarDays },
  { label: "Replies", Icon: Reply },
  { label: "Settings", Icon: Settings },
];

function DashShell({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-900">
      <aside className="flex h-full w-56 flex-col border-r border-slate-100 bg-white px-4 py-6">
        <div className="flex items-center gap-2.5 px-2">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-600 text-white">
            <Orbit size={19} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.04em]">Orbi</span>
        </div>
        <nav className="mt-8 space-y-1">
          {SHELL_NAV.map(({ label, Icon }) => (
            <div
              key={label}
              className={
                active === label
                  ? "flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600"
                  : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500"
              }
            >
              <Icon size={18} strokeWidth={2.2} />
              {label}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-hidden bg-slate-50 p-8">{children}</main>
    </div>
  );
}

function InboxMain() {
  const rows = [
    {
      source: "Gmail",
      badge: "bg-sky-50 text-sky-600",
      from: "Professor Lee",
      subject: "Re: Midterm extension request",
      time: "2m",
    },
    {
      source: "Canvas",
      badge: "bg-rose-50 text-rose-600",
      from: "CSE 130",
      subject: "System Design HW due tomorrow",
      time: "1h",
    },
    {
      source: "Slack",
      badge: "bg-violet-50 text-violet-600",
      from: "#engineering",
      subject: "PR review needed before standup",
      time: "3h",
    },
    {
      source: "GitHub",
      badge: "bg-slate-100 text-slate-700",
      from: "orbi-app",
      subject: "Issue assigned: Fix auth redirect bug",
      time: "5h",
    },
    {
      source: "Discord",
      badge: "bg-indigo-50 text-indigo-600",
      from: "study-group",
      subject: "Anyone have the lecture notes?",
      time: "6h",
    },
  ];
  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-6 text-2xl font-bold tracking-[-0.03em] text-slate-900">
        Inbox
      </h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {rows.map((row) => (
          <div
            key={row.source}
            className="flex items-center gap-4 border-b border-slate-50 px-6 py-4 hover:bg-slate-50"
          >
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.badge}`}
            >
              {row.source}
            </span>
            <span className="font-semibold text-slate-800">{row.from}</span>
            <span className="flex-1 truncate text-slate-500">{row.subject}</span>
            <span className="text-xs text-slate-400">{row.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DraftMain() {
  return (
    <div className="flex h-full flex-col">
      <div className="text-lg font-bold text-slate-900">Professor Lee</div>
      <div className="mb-6 text-sm text-slate-400">Re: Midterm extension</div>
      <div className="space-y-4">
        <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-slate-100 p-5 text-slate-700">
          Hi, I wanted to follow up on the midterm extension request I submitted
          last week. Let me know if you need anything else from me.
        </div>
        <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm border border-indigo-200 bg-indigo-50 p-5 text-slate-700">
          Hi Professor Lee, thank you for getting back to me. I appreciate the
          extra time and will have the project submitted by Monday at the latest.
        </div>
      </div>
      <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-5">
        <span className="text-xs text-slate-400">
          AI drafted · sounds like you
        </span>
        <div className="ml-auto flex gap-3">
          <span className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700">
            Edit
          </span>
          <span className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">
            Send reply →
          </span>
        </div>
      </div>
    </div>
  );
}

function AssignmentsMain() {
  const columns = [
    {
      heading: "Due Soon",
      items: [
        {
          course: "CSE 130",
          courseColor: "bg-rose-50 text-rose-600",
          title: "System Design HW",
          due: "Due tomorrow",
          chip: "Urgent",
          chipColor: "bg-rose-100 text-rose-700",
        },
        {
          course: "CHEM 1A",
          courseColor: "bg-blue-50 text-blue-600",
          title: "Lab Report 4",
          due: "Due Friday",
          chip: "In progress",
          chipColor: "bg-amber-100 text-amber-700",
        },
      ],
    },
    {
      heading: "This Week",
      items: [
        {
          course: "WRIT 2",
          courseColor: "bg-amber-50 text-amber-600",
          title: "Research Paper",
          due: "Due in 3 days",
          chip: "Not started",
          chipColor: "bg-slate-100 text-slate-600",
        },
        {
          course: "MATH 19",
          courseColor: "bg-emerald-50 text-emerald-600",
          title: "Problem Set 7",
          due: "Due Thursday",
          chip: "In progress",
          chipColor: "bg-amber-100 text-amber-700",
        },
      ],
    },
    {
      heading: "Upcoming",
      items: [
        {
          course: "CS 101",
          courseColor: "bg-indigo-50 text-indigo-600",
          title: "Final Project",
          due: "Due next week",
          chip: "Not started",
          chipColor: "bg-slate-100 text-slate-600",
        },
      ],
    },
  ];
  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Assignments</h1>
      <div className="grid flex-1 grid-cols-3 gap-5">
        {columns.map((column) => (
          <div key={column.heading}>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              {column.heading}
            </p>
            {column.items.map((item) => (
              <div
                key={item.title}
                className="mb-3 rounded-xl bg-white p-5 shadow-sm"
              >
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${item.courseColor}`}
                >
                  {item.course}
                </span>
                <p className="mt-2 font-semibold text-slate-800">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.due}</p>
                <span
                  className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${item.chipColor}`}
                >
                  {item.chip}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const CAL_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const CAL_ROW = 50;

function calHourLabel(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display} ${period}`;
}

function CalendarMain() {
  const days = [
    { day: "Mon", date: 13 },
    { day: "Tue", date: 14 },
    { day: "Wed", date: 15 },
    { day: "Thu", date: 16 },
    { day: "Fri", date: 17, today: true },
    { day: "Sat", date: 18 },
    { day: "Sun", date: 19 },
  ];
  const events = [
    {
      col: 0,
      start: 10,
      end: 11.5,
      title: "CS 101 Lecture",
      cls: "border-indigo-500 bg-indigo-100 text-indigo-800",
    },
    {
      col: 1,
      start: 14,
      end: 15,
      title: "Study Group",
      cls: "border-emerald-500 bg-emerald-100 text-emerald-800",
    },
    {
      col: 2,
      start: 9,
      end: 10,
      title: "Office Hours",
      cls: "border-blue-500 bg-blue-100 text-blue-800",
    },
    {
      col: 3,
      start: 12,
      end: 13,
      title: "Lab Section",
      cls: "border-blue-500 bg-blue-100 text-blue-800",
    },
    {
      col: 4,
      start: 11,
      end: 12,
      title: "Project Due",
      cls: "border-red-500 bg-red-100 text-red-800",
    },
    {
      col: 4,
      start: 16,
      end: 17,
      title: "HW Submission",
      cls: "border-red-500 bg-red-100 text-red-800",
    },
  ];
  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">October 2025</h1>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div
          className="grid border-b border-slate-100"
          style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}
        >
          <div />
          {days.map((d) => (
            <div key={d.day} className="border-l border-slate-100 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {d.day}
              </p>
              <p
                className={
                  d.today
                    ? "mx-auto mt-1 grid size-7 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
                    : "mx-auto mt-1 grid size-7 place-items-center rounded-full text-sm font-semibold text-slate-700"
                }
              >
                {d.date}
              </p>
            </div>
          ))}
        </div>
        <div
          className="grid flex-1"
          style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}
        >
          <div className="relative">
            {CAL_HOURS.map((hour, index) => (
              <span
                key={hour}
                className="absolute right-2 text-[10px] text-slate-400"
                style={{ top: index * CAL_ROW - 5 }}
              >
                {calHourLabel(hour)}
              </span>
            ))}
          </div>
          {days.map((d, col) => (
            <div key={d.day} className="relative border-l border-slate-100">
              {CAL_HOURS.slice(0, -1).map((hour) => (
                <div
                  key={hour}
                  className="border-b border-slate-50"
                  style={{ height: CAL_ROW }}
                />
              ))}
              {events
                .filter((event) => event.col === col)
                .map((event) => (
                  <div
                    key={event.title}
                    className={`absolute inset-x-1 overflow-hidden rounded-lg border-l-4 px-2 py-1.5 text-xs font-semibold ${event.cls}`}
                    style={{
                      top: (event.start - 8) * CAL_ROW,
                      height: (event.end - event.start) * CAL_ROW - 3,
                    }}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CrossAppMain() {
  const sources = [
    {
      tag: "Canvas",
      tagColor: "text-rose-600",
      border: "border-rose-500",
      title: "System Design HW",
      body: "Due Friday 11:59 PM · Worth 15% of grade · Submit via course portal",
    },
    {
      tag: "Gmail",
      tagColor: "text-sky-600",
      border: "border-sky-500",
      title: "Professor Lee",
      body: "\"The submission portal is now open — late work accepted until Sunday.\"",
    },
    {
      tag: "Discord",
      tagColor: "text-purple-600",
      border: "border-purple-500",
      title: "#study-group",
      body: "Maya: anyone have the starter code? · Dev: just pushed it to the repo",
    },
  ];
  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Context for: System Design HW
      </h1>
      <div className="relative flex-1 pl-8">
        <svg
          className="pointer-events-none absolute"
          style={{ left: 14, top: 28, bottom: 28, width: 2 }}
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 5"
          />
        </svg>
        {sources.map((source) => (
          <div
            key={source.tag}
            className={`relative mb-3 rounded-xl border-l-4 bg-white p-5 shadow-sm ${source.border}`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-wider ${source.tagColor}`}
            >
              {source.tag}
            </span>
            <p className="mt-1 font-semibold text-slate-800">{source.title}</p>
            <p className="mt-1 text-sm text-slate-500">{source.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrbiCard({ id }: { id: string | number; active: boolean }) {
  switch (id) {
    case 1:
      return (
        <ScaledScreen>
          <DashShell active="Inbox">
            <InboxMain />
          </DashShell>
        </ScaledScreen>
      );
    case 2:
      return (
        <ScaledScreen>
          <DashShell active="Replies">
            <DraftMain />
          </DashShell>
        </ScaledScreen>
      );
    case 3:
      return (
        <ScaledScreen>
          <DashShell active="Assignments">
            <AssignmentsMain />
          </DashShell>
        </ScaledScreen>
      );
    case 4:
      return (
        <ScaledScreen>
          <DashShell active="Calendar">
            <CalendarMain />
          </DashShell>
        </ScaledScreen>
      );
    case 5:
      return (
        <ScaledScreen>
          <DashShell active="Home">
            <CrossAppMain />
          </DashShell>
        </ScaledScreen>
      );
    default:
      return null;
  }
}

export default function Home() {
  return (
    <div className="overflow-clip bg-white">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <FlowLines />
        <section className="overflow-hidden pb-24 pt-0">
          <div className="mb-12 px-6 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-500">
              See it in action
            </p>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-slate-950">
              Every view, one app.
            </h2>
          </div>
          <div className="mx-auto w-full max-w-5xl px-8">
            <CardStack
              items={ORBI_CARDS}
              initialIndex={2}
              autoAdvance
              intervalMs={2500}
              pauseOnHover
              showDots
              renderCard={(item, { active }) => (
                <OrbiCard id={item.id} active={active} />
              )}
            />
          </div>
        </section>
        <Features />
        <Testimonials />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
