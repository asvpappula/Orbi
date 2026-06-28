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

async function fetchInBatches(token: string, ids: string[], batchSize = 5) {
  const messages = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => fetchMessage(token, id)));
    messages.push(...results);
    if (i + batchSize < ids.length) await new Promise((r) => setTimeout(r, 200));
  }
  return messages;
}

export async function fetchEmails(userId: string, maxResults = 20) {
  await assertUserId(userId);
  const token = await getGoogleAccessToken(userId, "gmail");
  const limit = Math.min(Math.max(maxResults, 1), 50);
  const list = await gmailRequest<{ messages?: { id: string }[] }>(
    token,
    `/messages?maxResults=${limit}&q=${encodeURIComponent("-in:spam -in:trash")}`,
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

export async function getSentEmails(userId: string, limit = 50) {
  await assertUserId(userId);
  const token = await getGoogleAccessToken(userId, "gmail");
  const maxResults = Math.min(Math.max(limit, 1), 100);
  const list = await gmailRequest<{ messages?: { id: string }[] }>(
    token,
    `/messages?maxResults=${maxResults}&labelIds=SENT`,
  );
  const messages = await Promise.all(
    (list.messages ?? []).map(({ id }) => fetchMessage(token, id)),
  );
  await persistMessages(userId, messages);
  return messages.map((message) => toRow(userId, message));
}
