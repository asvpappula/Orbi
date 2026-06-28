import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { fetchEmails } from "@/lib/integrations/gmail";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json().catch(() => ({}))) as {
      maxResults?: number;
    };
    const items = await fetchEmails(user.id, body.maxResults ?? 20);
    return NextResponse.json({ synced: items.length, items });
  } catch (error) {
    return apiError(error);
  }
}
