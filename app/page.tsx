"use client";

import { Orbit } from "lucide-react";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { Features } from "@/components/landing/Features";
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

function InboxCard() {
  const rows = [
    {
      dot: "bg-indigo-500",
      source: "Gmail",
      msg: "Professor Lee: The deadline has been moved to Friday",
      time: "2m",
    },
    {
      dot: "bg-red-500",
      source: "Canvas",
      msg: "System Design HW due tomorrow",
      time: "1h",
    },
    {
      dot: "bg-purple-500",
      source: "Slack",
      msg: "#eng: PR review needed before standup",
      time: "3h",
    },
    {
      dot: "bg-green-500",
      source: "GitHub",
      msg: "Issue assigned to you: Fix auth bug",
      time: "5h",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-5 py-3">
        <Orbit size={14} className="text-indigo-500" />
        <span className="text-xs font-bold text-slate-400">Inbox</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.source}
          className="flex items-center gap-3 border-b border-slate-100 px-5 py-3"
        >
          <span className={`size-2 shrink-0 rounded-full ${row.dot}`} />
          <span className="w-12 shrink-0 text-xs font-semibold text-slate-500">
            {row.source}
          </span>
          <span className="flex-1 truncate text-xs text-slate-700">
            {row.msg}
          </span>
          <span className="ml-auto shrink-0 text-xs text-slate-400">
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function DraftCard() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-950">
      <div className="px-5 pb-2 pt-4 text-xs font-semibold tracking-widest text-indigo-400">
        AI Draft
      </div>
      <div className="mx-4 rounded-2xl rounded-tl-sm bg-slate-800 p-3 text-xs leading-relaxed text-slate-300">
        Hi, I wanted to follow up on the midterm extension request...
      </div>
      <div className="mx-4 mt-3 rounded-2xl rounded-tr-sm border border-indigo-400/30 bg-indigo-500/20 p-3 text-xs leading-relaxed text-slate-200">
        Hi Professor, thanks for reaching out. I&apos;ve been working on the
        project and would appreciate the extra time...
      </div>
      <div className="mt-auto flex gap-2 px-4 pb-4">
        <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
          Edit
        </span>
        <span className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white">
          Send →
        </span>
      </div>
    </div>
  );
}

function CanvasCard() {
  const items = [
    {
      title: "System Design HW",
      course: "CSE 130",
      badge: "Due Tomorrow",
      badgeColor: "bg-red-50 text-red-600",
    },
    {
      title: "Research Paper",
      course: "WRIT 2",
      badge: "Due in 3 days",
      badgeColor: "bg-amber-50 text-amber-600",
    },
    {
      title: "Lab Report",
      course: "CHEM 1A",
      badge: "Due Friday",
      badgeColor: "bg-blue-50 text-blue-600",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#fdf8ff]">
      <div className="px-5 pt-4 text-xs font-bold tracking-widest text-[#d5273e]">
        Canvas
      </div>
      <div className="px-5 pb-3 text-base font-bold text-slate-900">
        Upcoming
      </div>
      {items.map((item) => (
        <div
          key={item.title}
          className="mx-4 mb-2 flex items-center rounded-xl bg-white px-4 py-3 shadow-sm"
        >
          <div>
            <div className="text-sm font-semibold text-slate-800">
              {item.title}
            </div>
            <div className="text-xs text-slate-400">{item.course}</div>
          </div>
          <span
            className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${item.badgeColor}`}
          >
            {item.badge}
          </span>
        </div>
      ))}
    </div>
  );
}

function WeekCard() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const events = [
    {
      border: "border-emerald-500",
      bg: "bg-emerald-50",
      title: "CS 101 Lecture",
      titleColor: "text-emerald-800",
      time: "10:00 AM",
      timeColor: "text-emerald-600",
    },
    {
      border: "border-indigo-500",
      bg: "bg-indigo-50",
      title: "Project Due",
      titleColor: "text-indigo-800",
      time: "11:59 PM",
      timeColor: "text-indigo-600",
    },
    {
      border: "border-red-500",
      bg: "bg-red-50",
      title: "HW Submission",
      titleColor: "text-red-800",
      time: "9:00 AM",
      timeColor: "text-red-600",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f0fdf4]">
      <div className="px-5 pb-2 pt-4 text-base font-bold text-slate-900">
        This Week
      </div>
      <div className="grid grid-cols-7 px-4 pb-2">
        {days.map((day, index) => (
          <span key={index} className="text-center text-xs text-slate-400">
            {day}
          </span>
        ))}
      </div>
      {events.map((event) => (
        <div
          key={event.title}
          className={`mx-4 mb-2 flex items-center gap-2 rounded-xl border-l-2 px-3 py-2.5 ${event.border} ${event.bg}`}
        >
          <span className={`text-xs font-semibold ${event.titleColor}`}>
            {event.title}
          </span>
          <span className={`ml-auto text-xs ${event.timeColor}`}>
            {event.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function ContextCard() {
  const items = [
    {
      border: "border-indigo-400",
      tag: "Canvas",
      tagColor: "text-indigo-600",
      msg: "System Design HW due Friday",
    },
    {
      border: "border-red-400",
      tag: "Gmail",
      tagColor: "text-red-600",
      msg: "Prof Lee: submission portal is now open",
    },
    {
      border: "border-purple-400",
      tag: "Discord",
      tagColor: "text-purple-600",
      msg: "anyone have the starter code?",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="px-5 pb-2 pt-4 text-xs font-semibold text-slate-400">
        #study-group · 3 sources
      </div>
      {items.map((item) => (
        <div
          key={item.tag}
          className={`mx-4 mb-2 rounded-xl border-l-2 bg-slate-50 px-4 py-3 ${item.border}`}
        >
          <div className={`text-xs font-bold ${item.tagColor}`}>{item.tag}</div>
          <div className="mt-0.5 text-xs text-slate-700">{item.msg}</div>
        </div>
      ))}
    </div>
  );
}

function OrbiCard({ id }: { id: string | number; active: boolean }) {
  switch (id) {
    case 1:
      return <InboxCard />;
    case 2:
      return <DraftCard />;
    case 3:
      return <CanvasCard />;
    case 4:
      return <WeekCard />;
    case 5:
      return <ContextCard />;
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
        <section className="overflow-hidden py-24">
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
        <Problem />
        <Features />
        <Testimonials />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
