import { createHash } from "crypto";
import { assertUserId } from "@/lib/auth/server";

function validateIcalUrl(value: string, requireIcs = true) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Enter a valid Canvas Calendar Feed URL");
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const privateIpv4 =
    /^(?:10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(
      hostname,
    );
  if (
    url.protocol !== "https:" ||
    (requireIcs && !url.href.toLowerCase().includes(".ics")) ||
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    /^(?:fc|fd|fe8|fe9|fea|feb)/i.test(hostname) ||
    privateIpv4
  ) {
    throw new Error("Enter a public HTTPS Canvas URL containing .ics");
  }
  return url;
}

async function fetchIcal(value: string) {
  const requestedUrl = validateIcalUrl(value);
  const response = await fetch(requestedUrl, {
    cache: "no-store",
    redirect: "follow",
    headers: { Accept: "text/calendar, text/plain;q=0.9" },
  });
  validateIcalUrl(response.url || requestedUrl.href, false);
  if (response.status !== 200) {
    throw new Error(`Canvas Calendar Feed returned ${response.status}`);
  }
  const text = await response.text();
  if (!text.includes("BEGIN:VCALENDAR")) {
    throw new Error("That URL did not return a valid iCalendar feed");
  }
  return text;
}

export function unfoldIcal(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

export function property(block: string, name: string) {
  const match = block.match(new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, "im"));
  return match?.[1]?.trim() ?? "";
}

export function unescapeIcal(value: string) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function offsetAt(date: Date, timeZone: string) {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return (
    Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second,
    ) - date.getTime()
  );
}

function zonedDate(parts: DateParts, timeZone: string) {
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  let result = new Date(localAsUtc - offsetAt(new Date(localAsUtc), timeZone));
  result = new Date(localAsUtc - offsetAt(result, timeZone));
  return result;
}

export function parseIcalDate(block: string) {
  const line = block.match(/^DTSTART(?:;([^:]+))?:(\S+)$/im);
  if (!line?.[2]) return null;
  const parameters = line[1] ?? "";
  const value = line[2].trim();
  const timezone = parameters
    .split(";")
    .find((part) => part.toUpperCase().startsWith("TZID="))
    ?.slice(5);
  const match = value.match(
    /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?$/,
  );
  if (!match) return null;
  const parts: DateParts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
    second: Number(match[6] ?? 0),
  };

  try {
    const date = match[7]
      ? new Date(
          Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute,
            parts.second,
          ),
        )
      : timezone
        ? zonedDate(parts, timezone)
        : new Date(
            Date.UTC(
              parts.year,
              parts.month - 1,
              parts.day,
              parts.hour,
              parts.minute,
              parts.second,
            ),
          );
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

function courseFromUrl(value: string) {
  if (!value) return "Canvas";
  try {
    const courseId = new URL(value).pathname.match(/\/courses\/([^/]+)/)?.[1];
    return courseId ? `Course ${decodeURIComponent(courseId)}` : "Canvas";
  } catch {
    return "Canvas";
  }
}

function fallbackCanvasId(title: string, dueDate: string | null) {
  return createHash("sha256")
    .update(`${title}\n${dueDate ?? ""}`)
    .digest("hex");
}

export async function saveCanvasIcalUrl(userId: string, icalUrl: string) {
  const { supabase } = await assertUserId(userId);
  const url = validateIcalUrl(icalUrl);
  await fetchIcal(url.href);

  const { error } = await supabase.from("user_integrations").upsert(
    {
      user_id: userId,
      integration_name: "canvas_ical",
      canvas_ical_url: url.href,
      connected_at: new Date().toISOString(),
    },
    { onConflict: "user_id,integration_name" },
  );
  if (error) throw new Error(error.message);
}

export async function syncCanvasIcal(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("canvas_ical_url")
    .eq("user_id", userId)
    .eq("integration_name", "canvas_ical")
    .single();
  if (error || !data?.canvas_ical_url) {
    throw new Error("Canvas Calendar Feed is not connected");
  }

  const text = unfoldIcal(await fetchIcal(data.canvas_ical_url));
  const events = Array.from(text.matchAll(/BEGIN:VEVENT\s*([\s\S]*?)END:VEVENT/gim));
  const fetchedAt = new Date().toISOString();
  const rows = events
    .map((match) => {
      const block = match[1];
      const title = unescapeIcal(property(block, "SUMMARY"));
      if (!title) return null;
      const description = unescapeIcal(property(block, "DESCRIPTION"));
      const dueDate = parseIcalDate(block);
      const canvasUrl = unescapeIcal(property(block, "URL"));
      return {
        user_id: userId,
        canvas_id: canvasUrl || fallbackCanvasId(title, dueDate),
        type: "assignment",
        title,
        course_name: courseFromUrl(canvasUrl),
        due_date: dueDate,
        description,
        status: "todo",
        fetched_at: fetchedAt,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (rows.length) {
    const { error: upsertError } = await supabase
      .from("canvas_items")
      .upsert(rows, { onConflict: "user_id,canvas_id" });
    if (upsertError) throw new Error(upsertError.message);
  }
  return { synced: rows.length };
}
