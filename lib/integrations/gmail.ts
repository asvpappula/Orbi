import { assertUserId } from "@/lib/auth/server";
import { getGoogleAccessToken } from "@/lib/integrations/google";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

type GmailHeader = { name: string; value: string };
type GmailPart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPart[];
};
type GmailMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string;
  payload?: GmailPart & { headers?: GmailHeader[] };
};
type GmailThread = { id: string; messages?: GmailMessage[] };

async function gmailRequest<T>(
  token: string,
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(`${GMAIL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Gmail request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

function header(message: GmailMessage, name: string) {
  return message.payload?.headers?.find(
    (value) => value.name.toLowerCase() === name.toLowerCase(),
  )?.value;
}

function decodeBody(value?: string) {
  if (!value) return "";
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return "";
  }
}

function messageBody(part?: GmailPart): string {
  if (!part) return "";
  if (part.mimeType === "text/plain" && part.body?.data) {
    return decodeBody(part.body.data);
  }

  for (const child of part.parts ?? []) {
    const body = messageBody(child);
    if (body) return body;
  }

  if (part.body?.data) return decodeBody(part.body.data);
  return "";
}

function parseFrom(value?: string) {
  if (!value) return { name: "", email: "" };
  const match = value.match(/^(.*?)\s*<([^>]+)>$/);
  if (!match) return { name: value.split("@")[0], email: value };
  return {
    name: match[1].replace(/^"|"$/g, "").trim(),
    email: match[2].trim(),
  };
}

function toRow(userId: string, message: GmailMessage) {
  const from = parseFrom(header(message, "From"));
  const body = messageBody(message.payload);
  return {
    user_id: userId,
    gmail_id: message.id,
    thread_id: message.threadId,
    from_name: from.name,
    from_email: from.email,
    subject: header(message, "Subject") ?? "(no subject)",
    preview: message.snippet ?? body.slice(0, 240),
    body,
    timestamp: message.internalDate
      ? new Date(Number(message.internalDate)).toISOString()
      : new Date().toISOString(),
    is_read: !(message.labelIds ?? []).includes("UNREAD"),
    labels: message.labelIds ?? [],
  };
}

async function fetchMessage(token: string, id: string) {
  return gmailRequest<GmailMessage>(
    token,
    `/messages/${encodeURIComponent(id)}?format=full`,
  );
}

async function persistMessages(userId: string, messages: GmailMessage[]) {
  if (!messages.length) return;
  const { supabase } = await assertUserId(userId);
  const { error } = await supabase
    .from("gmail_items")
    .upsert(messages.map((message) => toRow(userId, message)), {
      onConflict: "user_id,gmail_id",
    });
  if (error) throw new Error(error.message);
}

function gmailDateFilter(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "/");
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchInBatches(token: string, ids: string[], batchSize = 5) {
  const messages: GmailMessage[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => fetchMessage(token, id)));
    messages.push(...results);
    if (i + batchSize < ids.length) await delay(250);
  }
  return messages;
}

export async function fetchEmails(userId: string, maxResults = 20) {
  await assertUserId(userId);
  const token = await getGoogleAccessToken(userId, "gmail");
  const limit = Math.min(Math.max(maxResults, 1), 20);
  const after = gmailDateFilter(30);
  const query = [
    "-in:spam",
    "-in:trash",
    "-in:promotions",
    "-category:promotions",
    "-category:social",
    "-category:updates",
    "-category:forums",
    `after:${after}`,
  ].join(" ");
  const list = await gmailRequest<{ messages?: { id: string }[] }>(
    token,
    `/messages?maxResults=${limit}&q=${encodeURIComponent(query)}`,
  );
  const ids = (list.messages ?? []).map(({ id }) => id);
  const messages = await fetchInBatches(token, ids);
  await persistMessages(userId, messages);
  return messages.map((message) => toRow(userId, message));
}

export async function parseThread(threadId: string, userId: string) {
  await assertUserId(userId);
  const token = await getGoogleAccessToken(userId, "gmail");
  const thread = await gmailRequest<GmailThread>(
    token,
    `/threads/${encodeURIComponent(threadId)}?format=full`,
  );
  const messages = thread.messages ?? [];
  await persistMessages(userId, messages);
  return messages.map((message) => toRow(userId, message));
}

function encodeMimeMessage(to: string, subject: string, body: string) {
  const normalizedSubject = subject.replace(/[\r\n]+/g, " ");
  const normalizedTo = to.replace(/[\r\n]+/g, "");
  const mime = [
    `To: ${normalizedTo}`,
    `Subject: ${normalizedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");
  return Buffer.from(mime).toString("base64url");
}

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  body: string,
  threadId?: string,
) {
  await assertUserId(userId);
  if (!to || !subject || !body) throw new Error("To, subject, and body are required");
  const token = await getGoogleAccessToken(userId, "gmail");

  return gmailRequest<GmailMessage>(token, "/messages/send", {
    method: "POST",
    body: JSON.stringify({
      raw: encodeMimeMessage(to, subject, body),
      ...(threadId ? { threadId } : {}),
    }),
  });
}

export async function getSentEmails(userId: string, limit = 20) {
  await assertUserId(userId);
  const token = await getGoogleAccessToken(userId, "gmail");
  const maxResults = Math.min(Math.max(limit, 1), 20);
  const after = gmailDateFilter(30);
  const list = await gmailRequest<{ messages?: { id: string }[] }>(
    token,
    `/messages?maxResults=${maxResults}&labelIds=SENT&q=${encodeURIComponent(`after:${after}`)}`,
  );
  const ids = (list.messages ?? []).map(({ id }) => id);
  const messages = await fetchInBatches(token, ids);
  await persistMessages(userId, messages);
  return messages.map((message) => toRow(userId, message));
}

function parseCanvasSubject(subject: string) {
  const bracket = subject.match(/^\s*\[([^\]]+)\]\s*/);
  const courseName = bracket?.[1]?.trim() || "Canvas";
  let title = bracket ? subject.slice(bracket[0].length) : subject;
  const submission = title.match(
    /^Your submission for\s+(.+?)\s+has been received\.?$/i,
  );
  if (submission?.[1]) title = submission[1];
  title = title
    .replace(/^(?:Reminder|New Assignment):\s*/i, "")
    .replace(/\s+due\b.*$/i, "")
    .trim();
  return { title: title || subject.trim() || "Canvas assignment", courseName };
}

function parseCanvasDueDate(body: string) {
  const match = body.match(
    /due\s+(?:by|on|date(?:\s+is)?\s*:?)[\s:]*([^\n\r.]{4,100})/i,
  );
  if (!match?.[1]) return null;
  const candidate = match[1]
    .replace(/\s+at\s+/i, " ")
    .replace(/\s+(?:view|open|submit|click)\b.*$/i, "")
    .trim();
  const timestamp = Date.parse(candidate);
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString();
}

export async function syncCanvasFromEmails(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data: emails, error } = await supabase
    .from("gmail_items")
    .select("gmail_id, subject, body")
    .eq("user_id", userId)
    .ilike("from_email", "%instructure.com%")
    .order("timestamp", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  if (!emails?.length) return { synced: 0 };

  const fetchedAt = new Date().toISOString();
  const rows = emails.map((email) => {
    const subject = email.subject ?? "Canvas assignment";
    const parsed = parseCanvasSubject(subject);
    return {
      user_id: userId,
      canvas_id: `email:${email.gmail_id}`,
      type: "assignment",
      title: parsed.title,
      course_name: parsed.courseName,
      due_date: parseCanvasDueDate(email.body ?? ""),
      description: email.body ?? "",
      status: "todo",
      fetched_at: fetchedAt,
    };
  });

  const { error: upsertError } = await supabase.from("canvas_items").upsert(rows, {
    onConflict: "user_id,canvas_id",
  });
  if (upsertError) throw new Error(upsertError.message);
  return { synced: rows.length };
}

function parseEdSubject(subject: string) {
  const bracket = subject.match(/^\s*\[([^\]]+)\]\s*/);
  const courseName = bracket?.[1]?.trim() || "Ed Discussion";
  const title = (bracket ? subject.slice(bracket[0].length) : subject).trim();
  return { courseName, title: title || subject.trim() || "Ed discussion post" };
}

export async function syncEdFromEmails(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data: emails, error } = await supabase
    .from("gmail_items")
    .select("gmail_id, subject, body")
    .eq("user_id", userId)
    .or("from_email.ilike.%edstem.org%,subject.ilike.%[Ed]%")
    .order("timestamp", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  if (!emails?.length) return { synced: 0 };

  const fetchedAt = new Date().toISOString();
  const rows = emails.map((email) => {
    const parsed = parseEdSubject(email.subject ?? "Ed discussion post");
    return {
      user_id: userId,
      canvas_id: `ed:${email.gmail_id}`,
      type: "discussion",
      title: parsed.title,
      course_name: parsed.courseName,
      due_date: null,
      description: email.body ?? "",
      status: "unread",
      fetched_at: fetchedAt,
    };
  });

  const { error: upsertError } = await supabase.from("canvas_items").upsert(rows, {
    onConflict: "user_id,canvas_id",
  });
  if (upsertError) throw new Error(upsertError.message);
  return { synced: rows.length };
}
