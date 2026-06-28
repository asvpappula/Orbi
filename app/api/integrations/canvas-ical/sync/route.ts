import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { syncCanvasIcal } from "@/lib/integrations/canvas-ical";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { user } = await getAuthenticatedContext();
    return NextResponse.json(await syncCanvasIcal(user.id));
  } catch (error) {
    return apiError(error);
  }
}
