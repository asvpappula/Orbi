import { assertUserId } from "@/lib/auth/server";

type BadgeTone = "due" | "unread" | "new" | "soon";

export type UnifiedFeedItem = {
  id: string;
  itemType: "canvas" | "gmail" | "slack" | "github" | "custom";
  app: "canvas" | "gmail" | "slack" | "github" | "custom";
  title: string;
  preview: string;
  time: string;
  timestamp: string | null;
  urgency: number;
  badge: { label: string; tone: BadgeTone };
  unread?: boolean;
  context: {
    eyebrow: string;
    title: string;
    sourceCount?: number;
    due?: { label: string; tone: BadgeTone };
    detail?: {
      app: "canvas" | "gmail" | "slack" | "github" | "custom";
      heading: string;
      meta: { label: string; value: string }[];
      body: string;
    };
    thread?: {
      app: "gmail";
      from: string;
      fromEmail?: string;
      subject: string;
      preview: string;
      threadId?: string;
      messageId?: string;
    };
    aiReply: string;
  };
};

function relativeTime(value: string | null) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diff / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function dueUrgency(value: string | null) {
  if (!value) return { score: 1, label: "Assignment", tone: "new" as const };
  const due = new Date(value);
  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const diff = due.getTime() - now.getTime();

  if (diff < 0) return { score: 50, label: "Overdue", tone: "due" as const };
  if (due <= endOfToday) {
    return { score: 40, label: "Due today", tone: "due" as const };
  }
  if (diff <= 3 * 24 * 60 * 60 * 1000) {
    return { score: 20, label: "Due soon", tone: "soon" as const };
  }
  return { score: 2, label: "Upcoming", tone: "new" as const };
}

function dueLabel(value: string | null) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function getUnifiedFeed(userId: string) {
  const { supabase } = await assertUserId(userId);
  const [
    { data: canvas, error: canvasError },
    { data: gmail, error: gmailError },
    { data: slack, error: slackError },
    { data: github, error: githubError },
    { data: custom, error: customError },
  ] = await Promise.all([
      supabase
        .from("canvas_items")
        .select("*")
        .eq("user_id", userId)
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(100),
      supabase
        .from("gmail_items")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(100),
      supabase
        .from("slack_items")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(100),
      supabase
        .from("github_items")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(100),
      supabase
        .from("custom_items")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false, nullsFirst: false })
        .limit(100),
    ]);

  if (canvasError) throw new Error(canvasError.message);
  if (gmailError) throw new Error(gmailError.message);
  if (slackError) throw new Error(slackError.message);
  if (githubError) throw new Error(githubError.message);
  if (customError) throw new Error(customError.message);

  const canvasItems: UnifiedFeedItem[] = (canvas ?? []).map((item) => {
    const urgency = dueUrgency(item.due_date);
    return {
      id: `canvas:${item.id}`,
      itemType: "canvas",
      app: "canvas",
      title: item.title,
      preview: item.description?.replace(/<[^>]*>/g, " ").slice(0, 240) ?? "",
      time: relativeTime(item.fetched_at),
      timestamp: item.due_date,
      urgency: urgency.score,
      badge: { label: urgency.label, tone: urgency.tone },
      unread: item.status !== "submitted" && item.status !== "graded",
      context: {
        eyebrow: `${item.course_name ?? "Canvas"} · Assignment`,
        title: item.title,
        sourceCount: 1,
        due: { label: dueLabel(item.due_date), tone: urgency.tone },
        detail: {
          app: "canvas",
          heading: "Canvas assignment",
          meta: [
            { label: "Course", value: item.course_name ?? "Canvas" },
            { label: "Points", value: String(item.points ?? "—") },
            { label: "Status", value: item.status ?? "todo" },
          ],
          body: item.description?.replace(/<[^>]*>/g, " ") ?? "",
        },
        aiReply: "",
      },
    };
  });

  const excludedGmailLabels = new Set([
    "CATEGORY_PROMOTIONS",
    "CATEGORY_SOCIAL",
    "CATEGORY_UPDATES",
    "CATEGORY_FORUMS",
  ]);
  const importantGmail = (gmail ?? []).filter(
    (item) =>
      !(item.labels ?? []).some((label: string) =>
        excludedGmailLabels.has(label),
      ),
  );

  const gmailItems: UnifiedFeedItem[] = importantGmail.map((item) => ({
    id: `gmail:${item.id}`,
    itemType: "gmail",
    app: "gmail",
    title: `${item.from_name || item.from_email || "Unknown"} · ${item.subject || "(no subject)"}`,
    preview: item.preview ?? item.body?.slice(0, 240) ?? "",
    time: relativeTime(item.timestamp),
    timestamp: item.timestamp,
    urgency: item.is_read ? 1 : 30,
    badge: item.is_read
      ? { label: "Email", tone: "new" }
      : { label: "Unread", tone: "unread" },
    unread: !item.is_read,
    context: {
      eyebrow: "Gmail",
      title: item.subject ?? "(no subject)",
      sourceCount: 1,
      detail: {
        app: "gmail",
        heading: `From ${item.from_name || item.from_email || "Unknown"}`,
        meta: [
          { label: "From", value: item.from_email ?? "—" },
          { label: "When", value: relativeTime(item.timestamp) },
        ],
        body: item.body ?? item.preview ?? "",
      },
      thread: {
        app: "gmail",
        from: item.from_name || item.from_email || "Unknown",
        fromEmail: item.from_email ?? undefined,
        subject: item.subject ?? "(no subject)",
        preview: item.preview ?? "",
        threadId: item.thread_id,
        messageId: item.gmail_id,
      },
      aiReply: "",
    },
  }));

  const slackItems: UnifiedFeedItem[] = (slack ?? []).map((item) => ({
    id: `slack:${item.id}`,
    itemType: "slack",
    app: "slack",
    title: `${item.channel_name || "Slack"} · ${item.author_name || "Unknown"}`,
    preview: item.content ?? "",
    time: relativeTime(item.timestamp),
    timestamp: item.timestamp,
    urgency: 15,
    badge: { label: "Slack", tone: "new" },
    context: {
      eyebrow: `Slack · ${item.channel_name || "Message"}`,
      title: item.content?.slice(0, 80) || "Slack message",
      sourceCount: 1,
      detail: {
        app: "slack",
        heading: item.author_name || "Slack message",
        meta: [
          { label: "Channel", value: item.channel_name ?? "—" },
          { label: "When", value: relativeTime(item.timestamp) },
        ],
        body: item.content ?? "",
      },
      aiReply: "",
    },
  }));

  const githubItems: UnifiedFeedItem[] = (github ?? []).map((item) => {
    const reviewRequested = item.type === "review_requested";
    return {
      id: `github:${item.id}`,
      itemType: "github",
      app: "github",
      title: `${item.repo || "GitHub"} · ${item.title || "Notification"}`,
      preview: [item.type, item.state].filter(Boolean).join(" · "),
      time: relativeTime(item.timestamp),
      timestamp: item.timestamp,
      urgency: reviewRequested ? 25 : 15,
      badge: reviewRequested
        ? { label: "Review requested", tone: "unread" as const }
        : { label: "GitHub", tone: "new" as const },
      unread: true,
      context: {
        eyebrow: `GitHub · ${item.repo || "Notification"}`,
        title: item.title || "GitHub notification",
        sourceCount: 1,
        detail: {
          app: "github" as const,
          heading: item.type || "GitHub notification",
          meta: [
            { label: "Repository", value: item.repo ?? "—" },
            { label: "State", value: item.state ?? "unread" },
          ],
          body: item.url ?? item.title ?? "",
        },
        aiReply: "",
      },
    };
  });

  const customItems: UnifiedFeedItem[] = (custom ?? []).map((item) => ({
    id: `custom:${item.id}`,
    itemType: "custom",
    app: "custom",
    title: `${item.source_name} · ${item.title || "Update"}`,
    preview: (item.body ?? "").replace(/<[^>]*>/g, " ").slice(0, 240),
    time: relativeTime(item.timestamp ?? item.fetched_at),
    timestamp: item.timestamp,
    urgency: 12,
    badge: { label: item.source_name, tone: "new" },
    context: {
      eyebrow: `Custom · ${item.source_name}`,
      title: item.title || item.source_name,
      sourceCount: 1,
      detail: {
        app: "custom",
        heading: item.source_name,
        meta: [
          { label: "Source", value: item.source_name },
          {
            label: "When",
            value: relativeTime(item.timestamp ?? item.fetched_at),
          },
        ],
        body: (item.body ?? "").replace(/<[^>]*>/g, " "),
      },
      aiReply: "",
    },
  }));

  return [
    ...canvasItems,
    ...gmailItems,
    ...slackItems,
    ...githubItems,
    ...customItems,
  ].sort((a, b) => {
    if (b.urgency !== a.urgency) return b.urgency - a.urgency;
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return bTime - aTime;
  });
}
