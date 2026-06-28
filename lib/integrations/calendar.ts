import { assertUserId } from "@/lib/auth/server";
import { getGoogleAccessToken } from "@/lib/integrations/google";

const CALENDAR_API =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

type CalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

export async function fetchEvents(userId: string, days = 7) {
  await assertUserId(userId);
  const token = await getGoogleAccessToken(userId, "google_calendar");
  const dayCount = Math.min(Math.max(days, 1), 90);
  const timeMin = new Date();
  const timeMax = new Date(timeMin.getTime() + dayCount * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });

  const response = await fetch(`${CALENDAR_API}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Google Calendar request failed (${response.status})`);
  }

  const payload = (await response.json()) as { items?: CalendarEvent[] };
  return (payload.items ?? []).map((event) => ({
    id: event.id,
    title: event.summary ?? "Untitled event",
    start: event.start?.dateTime ?? event.start?.date ?? null,
    end: event.end?.dateTime ?? event.end?.date ?? null,
    location: event.location ?? null,
    description: event.description ?? null,
  }));
}
