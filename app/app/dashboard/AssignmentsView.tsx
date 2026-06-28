"use client";

// Placeholder UI + data for the Assignments page. Codex wires real data later.
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "in_progress" | "not_started" | "submitted";
type Group = "today" | "week";
type Accent = "rose" | "amber" | "slate" | "emerald";

type Assignment = {
  id: string;
  course: string;
  status: Status;
  statusLabel: string;
  title: string;
  meta: string;
  dueLabel: string;
  dueSub: string;
  group: Group;
  accent: Accent;
  done: boolean;
};

const ASSIGNMENTS: Assignment[] = [
  {
    id: "cs251-p3",
    course: "CS 251",
    status: "in_progress",
    statusLabel: "In progress · 18/20 tests",
    title: "Project 3: Hash Table Maps",
    meta: "100 points · map.cpp + writeup.pdf",
    dueLabel: "Today",
    dueSub: "11:59 PM",
    group: "today",
    accent: "rose",
    done: false,
  },
  {
    id: "bio110-q4",
    course: "BIO 110",
    status: "not_started",
    statusLabel: "Not started",
    title: "Quiz 4: Cellular Respiration",
    meta: "25 points · one attempt, 30 min",
    dueLabel: "Today",
    dueSub: "Closes 11:59 PM",
    group: "today",
    accent: "rose",
    done: false,
  },
  {
    id: "stat240-reg",
    course: "STAT 240",
    status: "in_progress",
    statusLabel: "In progress",
    title: "Group Regression Report",
    meta: "80 points · slides + written report",
    dueLabel: "Fri",
    dueSub: "Jul 3",
    group: "week",
    accent: "amber",
    done: false,
  },
  {
    id: "cs251-lab9",
    course: "CS 251",
    status: "not_started",
    statusLabel: "Not started",
    title: "Lab 9: Balanced Trees",
    meta: "40 points · in-lab checkoff",
    dueLabel: "Thu",
    dueSub: "Jul 2",
    group: "week",
    accent: "slate",
    done: false,
  },
  {
    id: "hist295-rr4",
    course: "HIST 295",
    status: "submitted",
    statusLabel: "Submitted",
    title: "Reading Response 4",
    meta: "20 points · submitted 2 days early",
    dueLabel: "Done",
    dueSub: "Jul 1",
    group: "week",
    accent: "emerald",
    done: true,
  },
];

const STAT_CARDS = [
  { value: "2", label: "Due today", color: "text-rose-500" },
  { value: "5", label: "Due this week", color: "text-amber-500" },
  { value: "8", label: "Submitted", color: "text-slate-700" },
];

const GROUP_LABELS: Record<Group, string> = {
  today: "Due today",
  week: "This week",
};

const ACCENT_BORDER: Record<Accent, string> = {
  rose: "border-l-rose-400",
  amber: "border-l-amber-400",
  slate: "border-l-slate-300",
  emerald: "border-l-emerald-400",
};

const STATUS_BADGE: Record<Status, string> = {
  in_progress: "bg-amber-100 text-amber-700",
  not_started: "bg-slate-100 text-slate-500",
  submitted: "bg-emerald-100 text-emerald-700",
};

const DUE_SECTIONS: Group[] = ["today", "week"];
const COURSE_ORDER = ["CS 251", "BIO 110", "STAT 240", "HIST 295"];

type Section = { key: string; label: string; items: Assignment[] };

export function AssignmentsView() {
  const [groupBy, setGroupBy] = useState<"By due" | "By course">("By due");
  const [doneIds, setDoneIds] = useState<Set<string>>(
    () => new Set(ASSIGNMENTS.filter((a) => a.done).map((a) => a.id)),
  );

  function toggleDone(id: string) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const byDueSections = useMemo<Section[]>(
    () =>
      DUE_SECTIONS.map((group) => ({
        key: group,
        label: GROUP_LABELS[group],
        items: ASSIGNMENTS.filter((a) => a.group === group),
      })).filter((section) => section.items.length > 0),
    [],
  );

  const byCourseSections = useMemo<Section[]>(
    () =>
      COURSE_ORDER.map((course) => ({
        key: course,
        label: course,
        items: ASSIGNMENTS.filter((a) => a.course === course),
      })).filter((section) => section.items.length > 0),
    [],
  );

  const sections = groupBy === "By due" ? byDueSections : byCourseSections;

  return (
    <main className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6 pb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Assignments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Across all your courses, sorted by what is due first
            </p>
          </div>
          <div className="flex shrink-0 rounded-full bg-slate-100 p-0.5">
            {(["By due", "By course"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setGroupBy(option)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  groupBy === option
                    ? "bg-primary text-white shadow"
                    : "text-slate-500",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {STAT_CARDS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-xl"
            >
              <p className={cn("text-3xl font-bold", stat.color)}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {sections.map((section) => (
          <div key={section.key} className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {section.label}
            </p>
            <div className="space-y-3">
              {section.items.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  done={doneIds.has(assignment.id)}
                  onToggle={() => toggleDone(assignment.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function AssignmentCard({
  assignment,
  done,
  onToggle,
}: {
  assignment: Assignment;
  done: boolean;
  onToggle: () => void;
}) {
  const dueColor =
    assignment.dueLabel === "Today"
      ? "text-rose-500"
      : assignment.dueLabel === "Done"
        ? "text-emerald-600"
        : "text-slate-700";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-l-4 border-white/70 bg-white/70 p-4 backdrop-blur-xl",
        ACCENT_BORDER[assignment.accent],
      )}
    >
      <button
        type="button"
        aria-pressed={done}
        onClick={onToggle}
        className={cn(
          "size-5 shrink-0 rounded-md",
          done
            ? "grid place-items-center bg-emerald-500"
            : "border-2 border-slate-300",
        )}
      >
        {done && <Check size={12} className="text-white" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
            {assignment.course}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              STATUS_BADGE[assignment.status],
            )}
          >
            {assignment.statusLabel}
          </span>
        </div>
        <p
          className={cn(
            "mt-1 text-sm font-bold text-slate-900",
            done && "text-slate-400 line-through",
          )}
        >
          {assignment.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{assignment.meta}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className={cn("text-xs font-bold", dueColor)}>{assignment.dueLabel}</p>
        <p className="text-[11px] text-slate-400">{assignment.dueSub}</p>
      </div>
    </div>
  );
}
