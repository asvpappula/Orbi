import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { fetchEvents } from "@/lib/integrations/calendar";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { user } = await getAuthenticatedContext();
    const events = await fetchEvents(user.id, 30);
    return NextResponse.json({ events });
  } catch (error) {
    return apiError(error);
  }
}
