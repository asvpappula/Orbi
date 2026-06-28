import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { saveGithubToken, syncGithub } from "@/lib/integrations/github";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as { token?: string };
    if (!body.token) {
      return NextResponse.json({ error: "GitHub token is required" }, { status: 400 });
    }
    await saveGithubToken(user.id, body.token);
    const result = await syncGithub(user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return apiError(error);
  }
}
