import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { saveCanvasCredentials, syncCanvas } from "@/lib/integrations/canvas";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as { domain?: string; token?: string };

    if (!body.domain || !body.token) {
      return NextResponse.json(
        { error: "Canvas domain and token are required" },
        { status: 400 },
      );
    }

    await saveCanvasCredentials(user.id, body.domain, body.token);
    const result = await syncCanvas(user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return apiError(error);
  }
}
