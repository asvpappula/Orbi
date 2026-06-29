"use client";

import { HeroWithMockup } from "@/components/ui/hero-with-mockup";

function OrbiDashboardMockup() {
  return (
    <div className="flex h-[500px] w-full bg-slate-50 text-left">
      {/* Sidebar */}
      <div className="flex w-48 shrink-0 flex-col gap-1 border-r border-slate-100 bg-white px-3 py-5">
        <div className="flex items-center gap-2 px-2 pb-4">
          <div className="flex size-7 items-center justify-center rounded-full bg-indigo-500">
            <span className="text-xs font-bold text-white">O</span>
          </div>
          <span className="text-sm font-black text-slate-900">Orbi</span>
        </div>
        {["Inbox", "Assignments", "Calendar", "Replies", "Settings"].map(
          (item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium ${
                i === 0 ? "bg-indigo-50 text-indigo-600" : "text-slate-500"
              }`}
            >
              <div
                className={`size-1.5 rounded-full ${
                  i === 0 ? "bg-indigo-500" : "bg-slate-300"
                }`}
              />
              {item}
            </div>
          ),
        )}
      </div>
      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Inbox
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          {[
            {
              color: "bg-indigo-500",
              source: "Gmail",
              msg: "Professor Lee: The deadline has been moved to Friday",
              time: "2m",
            },
            {
              color: "bg-red-500",
              source: "Canvas",
              msg: "System Design HW due tomorrow — submit via portal",
              time: "1h",
            },
            {
              color: "bg-purple-500",
              source: "Slack",
              msg: "#engineering · PR review needed before standup",
              time: "3h",
            },
            {
              color: "bg-slate-800",
              source: "GitHub",
              msg: "Issue assigned: Fix auth redirect bug in prod",
              time: "5h",
            },
            {
              color: "bg-blue-500",
              source: "Discord",
              msg: "study-group · Anyone have the lecture 8 notes?",
              time: "6h",
            },
          ].map((row) => (
            <div
              key={row.source}
              className="flex items-center gap-3 border-b border-slate-50 px-5 py-3.5 last:border-0"
            >
              <span className={`size-2 shrink-0 rounded-full ${row.color}`} />
              <span className="w-14 shrink-0 text-xs font-semibold text-slate-500">
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
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <HeroWithMockup
      title="Everything you need to know, finally in one place."
      description="Canvas, Gmail, Slack, Discord, GitHub — pulled together by AI that knows how you work."
      primaryCta={{ text: "Get early access →", href: "#waitlist" }}
      secondaryCta={{ text: "See how it works", href: "#how-it-works" }}
    >
      <OrbiDashboardMockup />
    </HeroWithMockup>
  );
}
