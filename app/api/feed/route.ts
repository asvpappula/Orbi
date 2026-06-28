import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { getUnifiedFeed } from "@/lib/feed";

export async function GET() {
  try {
    const { user } = await getAuthenticatedContext();
    const items = await getUnifiedFeed(user.id);
    return NextResponse.json({ items });
  } catch (error) {
    return apiError(error);
  }
}
