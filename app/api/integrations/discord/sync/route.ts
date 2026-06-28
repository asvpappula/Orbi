import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { fetchGuilds, fetchMessages } from "@/lib/integrations/discord";

export async function POST() {
  try {
    const { user } = await getAuthenticatedContext();
    const [guilds, messages] = await Promise.all([
      fetchGuilds(user.id),
      fetchMessages(user.id),
    ]);
    return NextResponse.json({
      synced: messages.length,
      guilds: guilds.length,
    });
  } catch (error) {
    return apiError(error);
  }
}
