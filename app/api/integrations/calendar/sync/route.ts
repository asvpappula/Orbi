import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { fetchEvents } from "@/lib/integrations/calendar";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json().catch(() => ({}))) as { days?: number };
    const events = await fetchEvents(user.id, body.days ?? 7);
    return NextResponse.json({ synced: events.length, events });
  } catch (error) {
    return apiError(error);
  }
}
