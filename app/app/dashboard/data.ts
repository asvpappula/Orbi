export type AppKey =
  | "canvas"
  | "gmail"
  | "discord"
  | "groupme"
  | "calendar"
  | "slack"
  | "github"
  | "custom";

export const APP_META: Record<AppKey, { label: string; tile: string }> = {
  canvas: { label: "Canvas", tile: "bg-[#d5273e]" },
  gmail: { label: "Gmail", tile: "bg-white ring-1 ring-slate-200" },
  discord: { label: "Discord", tile: "bg-[#5865f2]" },
  groupme: { label: "GroupMe", tile: "bg-[#00aff0]" },
  calendar: { label: "Calendar", tile: "bg-white ring-1 ring-slate-200" },
  slack: { label: "Slack", tile: "bg-white ring-1 ring-slate-200" },
  github: { label: "GitHub", tile: "bg-slate-950 text-white" },
  custom: { label: "Custom", tile: "bg-indigo-500 text-white" },
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
  contextSummary?: string;
  sourceCount?: number;
  due?: { label: string; tone: BadgeTone };
  detail?: {
    app: AppKey;
    heading: string;
    meta: { label: string; value: string }[];
    body: string;
    checklist?: { label: string; state: ChecklistState }[];
  };
  thread?: {
    app: AppKey;
    from: string;
    fromEmail?: string;
    subject: string;
    preview: string;
    threadId?: string;
    messageId?: string;
  };
  aiReply: string;
};

export type FeedItem = {
  id: string;
  itemType?: "canvas" | "gmail" | "slack" | "github" | "custom";
  app: AppKey;
  title: string;
  preview: string;
  time: string;
  timestamp?: string | null;
  badge: { label: string; tone: BadgeTone };
  unread?: boolean;
  context: ContextData;
};
