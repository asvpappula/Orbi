// All mock data for the dashboard UI. Codex wires real data later.

export type AppKey = "canvas" | "gmail" | "discord" | "groupme" | "calendar";

export const APP_META: Record<AppKey, { label: string; tile: string }> = {
  canvas: { label: "Canvas", tile: "bg-[#d5273e]" },
  gmail: { label: "Gmail", tile: "bg-white ring-1 ring-slate-200" },
  discord: { label: "Discord", tile: "bg-[#5865f2]" },
  groupme: { label: "GroupMe", tile: "bg-[#00aff0]" },
  calendar: { label: "Calendar", tile: "bg-white ring-1 ring-slate-200" },
};

export type BadgeTone = "due" | "unread" | "new" | "soon";

export const BADGE_TONES: Record<BadgeTone, string> = {
  due: "bg-rose-100 text-rose-700",
  unread: "bg-sky-100 text-sky-700",
  new: "bg-slate-100 text-slate-600",
  soon: "bg-amber-100 text-amber-700",
};

export type ChecklistState = "done" | "partial" | "todo";

export type ContextData = {
  eyebrow: string;
  title: string;
  due?: { label: string; tone: BadgeTone };
  detail?: {
    app: AppKey;
    heading: string;
    meta: { label: string; value: string }[];
    body: string;
    checklist?: { label: string; state: ChecklistState }[];
  };
  thread?: { app: AppKey; from: string; subject: string; preview: string };
  aiReply: string;
};

export type FeedItem = {
  id: string;
  app: AppKey;
  title: string;
  preview: string;
  time: string;
  badge: { label: string; tone: BadgeTone };
  unread?: boolean;
  context: ContextData;
};

export const FEED: FeedItem[] = [
  {
    id: "project-3",
    app: "canvas",
    title: "Project 3: Hash Table Maps",
    preview:
      "Implement a separate-chaining hash map and submit map.cpp. Auto-grader runs 20 unit tests.",
    time: "2h ago",
    badge: { label: "Due today", tone: "due" },
    unread: true,
    context: {
      eyebrow: "CS 251 · Data Structures",
      title: "Project 3: Hash Table Maps",
      due: { label: "Due Today · 11:59 PM", tone: "due" },
      detail: {
        app: "canvas",
        heading: "Canvas assignment",
        meta: [
          { label: "Points", value: "100" },
          { label: "Due", value: "Tue, Jun 30" },
          { label: "Time", value: "11:59 PM" },
        ],
        body: "Implement a separate-chaining hash map (map.cpp) and submit a brief writeup. The auto-grader runs 20 unit tests.",
        checklist: [
          { label: "map.cpp implemented", state: "done" },
          { label: "writeup.pdf — not started", state: "todo" },
          { label: "passing 18 / 20 tests", state: "partial" },
        ],
      },
      thread: {
        app: "gmail",
        from: "Prof. Alvarez",
        subject: "Re: Extension on Project 3",
        preview:
          "Hi Alex — I can give you until Friday, but please send me whatever you have on the hash map so far so I can see your progress. Stop by office hours if you're stuck.",
      },
      aiReply:
        "Hey Professor Alvarez — thanks so much, that really helps! I'll send over my current map.cpp tonight so you can see where I'm at, and I'll have the full version in by Friday. Might swing by office hours too if I'm still stuck on the rehash.",
    },
  },
  {
    id: "alvarez",
    app: "gmail",
    title: "Prof. Alvarez · Re: Extension on Project 3",
    preview:
      "Hi Alex — I can give you until Friday, but please send me whatever you have on the hash map so far so I can see your progress.",
    time: "40m ago",
    badge: { label: "Unread", tone: "unread" },
    unread: true,
    context: {
      eyebrow: "Gmail · CS 251",
      title: "Re: Extension on Project 3",
      detail: {
        app: "gmail",
        heading: "From Prof. Alvarez",
        meta: [
          { label: "To", value: "Alex Rivera" },
          { label: "When", value: "40m ago" },
        ],
        body: "Hi Alex — I can give you until Friday, but please send me whatever you have on the hash map so far so I can see your progress. Stop by office hours if you're stuck.",
      },
      aiReply:
        "Hey Professor Alvarez — thanks so much, that really helps! I'll send over my current map.cpp tonight so you can see where I'm at, and I'll have the full version in by Friday. Might swing by office hours too if I'm still stuck on the rehash.",
    },
  },
  {
    id: "cs251-study",
    app: "discord",
    title: "#cs251-study · jordan_k",
    preview:
      "anyone figure out the rehash test? mine seg faults right at load factor 0.75",
    time: "1h ago",
    badge: { label: "3 new", tone: "new" },
    context: {
      eyebrow: "Discord · #cs251-study",
      title: "Rehash test seg faults",
      detail: {
        app: "discord",
        heading: "jordan_k",
        meta: [{ label: "Channel", value: "#cs251-study" }],
        body: "anyone figure out the rehash test? mine seg faults right at load factor 0.75. pretty sure it's the resize but i can't see it.",
      },
      aiReply:
        "i hit that too — check that you're rehashing BEFORE inserting when load factor crosses 0.75, not after. the seg fault was me iterating the old buckets after freeing them. happy to share my resize() if it helps.",
    },
  },
  {
    id: "stat240",
    app: "groupme",
    title: "STAT 240 Group · Maya",
    preview:
      "can we meet at 5 to finish the regression slides? library room 204",
    time: "2h ago",
    badge: { label: "Unread", tone: "unread" },
    unread: true,
    context: {
      eyebrow: "GroupMe · STAT 240 Group",
      title: "Meet at 5 for regression slides",
      detail: {
        app: "groupme",
        heading: "Maya",
        meta: [{ label: "Group", value: "STAT 240" }],
        body: "can we meet at 5 to finish the regression slides? library room 204. i can do the model diagnostics part if someone takes the intro.",
      },
      aiReply:
        "5 works for me — I'll grab room 204. I can take the intro slides if you've got the diagnostics. See you there!",
    },
  },
  {
    id: "office-hours",
    app: "calendar",
    title: "Office Hours — Dr. Lin",
    preview:
      "Today 4:00–5:00 PM · Heavilon 205. Bring your Project 3 questions.",
    time: "3h ago",
    badge: { label: "Soon", tone: "soon" },
    context: {
      eyebrow: "Google Calendar · Today",
      title: "Office Hours — Dr. Lin",
      due: { label: "Today · 4:00–5:00 PM", tone: "soon" },
      detail: {
        app: "calendar",
        heading: "Event",
        meta: [
          { label: "Where", value: "Heavilon 205" },
          { label: "When", value: "4:00–5:00 PM" },
        ],
        body: "Weekly office hours with Dr. Lin. Bring your Project 3 questions — good time to ask about the rehash edge cases.",
      },
      aiReply:
        "Adding a reminder to head to Heavilon 205 by 4. I'll bring the rehash seg-fault question and my current map.cpp.",
    },
  },
  {
    id: "bio110-quiz",
    app: "canvas",
    title: "BIO 110 — Quiz 4: Cellular Respiration",
    preview: "Quiz is now available. One attempt and a 30-minute timer.",
    time: "5h ago",
    badge: { label: "New", tone: "new" },
    context: {
      eyebrow: "BIO 110 · General Biology",
      title: "Quiz 4: Cellular Respiration",
      due: { label: "Available now · 30 min", tone: "new" },
      detail: {
        app: "canvas",
        heading: "Canvas quiz",
        meta: [
          { label: "Attempts", value: "1" },
          { label: "Timer", value: "30 min" },
        ],
        body: "Quiz 4 covers glycolysis, the citric acid cycle, and the electron transport chain. One attempt, 30-minute timer once you start.",
        checklist: [
          { label: "Lecture 12 notes reviewed", state: "done" },
          { label: "Practice set", state: "partial" },
          { label: "Quiz attempt", state: "todo" },
        ],
      },
      aiReply:
        "Reminder to self: review the electron transport chain before starting — that's the section I keep missing. 30-minute timer, one shot.",
    },
  },
];

// Canned tone variants for the AI Reply Composer (mock — no real generation).
export const TONE_DRAFTS: Record<string, string> = {
  Casual:
    "Hey Professor Alvarez — thanks so much, that really helps! I'll send over my current map.cpp tonight so you can see where I'm at, and I'll have the full version in by Friday. Might swing by office hours too if I'm still stuck on the rehash.",
  Professional:
    "Dear Professor Alvarez, thank you for the extension — I appreciate it. I'll send my current map.cpp this evening so you can review my progress, and I'll submit the complete version by Friday. I may also stop by office hours if I'm still working through the rehash logic.",
  Short:
    "Thanks, Professor! I'll send my current map.cpp tonight and the full version by Friday.",
  Detailed:
    "Hi Professor Alvarez, thank you for the extension to Friday — that takes a lot of pressure off. I'll email my current map.cpp tonight; it implements separate chaining and passes 18 of the 20 tests, with the rehash at load factor 0.75 still seg-faulting. I'll have the remaining cases fixed and the writeup done by Friday, and I'll come to office hours today if I can't crack the resize bug on my own.",
};
