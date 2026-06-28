import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import {
  saveCanvasIcalUrl,
  syncCanvasIcal,
} from "@/lib/integrations/canvas-ical";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as { icalUrl?: string };
    if (!body.icalUrl) {
      return NextResponse.json(
        { error: "Canvas Calendar Feed URL is required" },
        { status: 400 },
      );
    }
    await saveCanvasIcalUrl(user.id, body.icalUrl);
    const result = await syncCanvasIcal(user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return apiError(error);
  }
}
