import { NextResponse, type NextRequest } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import {
  saveCustomConnector,
  syncAllCustomConnectors,
} from "@/lib/integrations/custom";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as {
      name?: string;
      url?: string;
      apiKey?: string;
      feedType?: string;
    };

    const name = (body.name ?? "").trim();
    const url = (body.url ?? "").trim();
    if (!name || !url) throw new Error("Name and URL are required");

    await saveCustomConnector(
      user.id,
      name,
      url,
      body.apiKey ?? "",
      body.feedType ?? "json",
    );
    await syncAllCustomConnectors(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
