import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { outlookAuthorizationUrl } from "@/lib/integrations/outlook";
import { signState } from "@/lib/security/encryption";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedContext();
    const state = signState(`${user.id}:${randomUUID()}`);
    const redirectUri = `${request.nextUrl.origin}/api/auth/microsoft/callback`;
    const response = NextResponse.redirect(
      outlookAuthorizationUrl(state, redirectUri),
    );
    response.cookies.set("microsoft_oauth_state", state, {
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
