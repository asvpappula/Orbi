import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { connectOutlook } from "@/lib/integrations/outlook";
import { verifyState } from "@/lib/security/encryption";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("microsoft_oauth_state")?.value;

  try {
    const { user } = await getAuthenticatedContext();
    const stateValue = state ? verifyState(state) : null;
    if (
      !code ||
      !state ||
      state !== cookieState ||
      !stateValue?.startsWith(`${user.id}:`)
    ) {
      throw new Error("Invalid Microsoft OAuth state");
    }

    const redirectUri = `${request.nextUrl.origin}/api/auth/microsoft/callback`;
    await connectOutlook(user.id, code, redirectUri);
    const response = NextResponse.redirect(
      new URL("/app/dashboard", request.url),
    );
    response.cookies.delete("microsoft_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(
      new URL("/app/onboarding?error=outlook", request.url),
    );
  }
}
