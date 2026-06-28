import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { discordAuthorizationUrl } from "@/lib/integrations/discord";
import { signState } from "@/lib/security/encryption";

export async function GET() {
  try {
    const { user } = await getAuthenticatedContext();
    const state = signState(`${user.id}:${randomUUID()}`);
    const response = NextResponse.redirect(discordAuthorizationUrl(state));
    response.cookies.set("discord_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
