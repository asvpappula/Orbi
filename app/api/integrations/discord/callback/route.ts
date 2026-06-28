import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { connectDiscord } from "@/lib/integrations/discord";
import { verifyState } from "@/lib/security/encryption";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("discord_oauth_state")?.value;

  try {
    const { user } = await getAuthenticatedContext();
    const stateValue = state ? verifyState(state) : null;
    if (
      !code ||
      !state ||
      state !== cookieState ||
      !stateValue?.startsWith(`${user.id}:`)
    ) {
      throw new Error("Invalid Discord OAuth state");
    }

    await connectDiscord(user.id, code);
    const response = NextResponse.redirect(
      new URL("/app/onboarding?connected=discord", request.url),
    );
    response.cookies.delete("discord_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(
      new URL("/app/onboarding?error=discord", request.url),
    );
  }
}
