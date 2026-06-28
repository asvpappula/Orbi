import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { syncCanvas } from "@/lib/integrations/canvas";

export async function POST() {
  try {
    const { user } = await getAuthenticatedContext();
    return NextResponse.json(await syncCanvas(user.id));
  } catch (error) {
    return apiError(error);
  }
}
