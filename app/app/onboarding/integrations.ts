export type IntegrationId =
  | "canvas"
  | "gmail"
  | "google_calendar"
  | "discord"
  | "groupme"
  | "notion";

export type Integration = {
  id: IntegrationId;
  name: string;
  /** What Orbi pulls in once this app is connected. */
  description: string;
  /** Which OAuth provider powers the real connect handshake. */
  provider?: "google" | "canvas" | "discord" | "groupme";
  /**
   * OAuth scopes requested during the real provider flow. Stored in the short
   * form the product spec uses; the full Google scope URLs are
   * `https://www.googleapis.com/auth/<scope>`.
   */
  scopes?: string[];
  /** Tailwind classes for the icon tile background. */
  accent: string;
  /** Locked integrations render a "Coming soon" badge and can't be connected. */
  locked?: boolean;
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "canvas",
    name: "Canvas",
    description: "Assignments, grades, and course announcements",
    provider: "canvas",
    accent: "bg-[#d5273e]",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Important email, summarized and sorted",
    provider: "google",
    scopes: ["gmail.readonly", "gmail.send"],
    accent: "bg-white ring-1 ring-slate-200",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Classes, deadlines, and events in one timeline",
    provider: "google",
    scopes: ["calendar.readonly"],
    accent: "bg-white ring-1 ring-slate-200",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Server pings and class group chats",
    provider: "discord",
    accent: "bg-[#5865f2]",
  },
  {
    id: "groupme",
    name: "GroupMe",
    description: "Group chats and project threads",
    provider: "groupme",
    accent: "bg-[#00aff0]",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Notes and shared workspaces",
    accent: "bg-white ring-1 ring-slate-200",
    locked: true,
  },
];

/** Ids that can actually be connected (everything except locked apps). */
export const CONNECTABLE_IDS = INTEGRATIONS.filter((i) => !i.locked).map(
  (i) => i.id,
);
