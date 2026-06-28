import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { encryptSecret } from "@/lib/security/encryption";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      new URL("/login?error=configuration", request.url),
    );
  }

  let pendingCookies: PendingCookie[] = [];
  const redirectWithCookies = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  };
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        pendingCookies = cookiesToSet;
      },
    },
  });

  const {
    data: { session },
    error: authError,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (authError || !session?.user) {
    return redirectWithCookies("/login?error=oauth");
  }

  const user = session.user;
  const metadata = user.user_metadata;
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: metadata.full_name ?? metadata.name ?? null,
        avatar_url: metadata.avatar_url ?? metadata.picture ?? null,
      },
      { onConflict: "id" },
    )
    .select("onboarding_complete")
    .single();

  if (profileError) {
    return redirectWithCookies("/login?error=profile");
  }

  if (session.provider_token) {
    try {
      const integrationNames = ["gmail", "google_calendar"];
      const { data: existingRows } = await supabase
        .from("user_integrations")
        .select("integration_name, refresh_token")
        .eq("user_id", user.id)
        .in("integration_name", integrationNames);
      const existingRefresh = new Map(
        (existingRows ?? []).map((row) => [
          row.integration_name,
          row.refresh_token,
        ]),
      );
      const refreshToken = session.provider_refresh_token
        ? encryptSecret(session.provider_refresh_token)
        : null;

      await supabase.from("user_integrations").upsert(
        integrationNames.map((integrationName) => ({
          user_id: user.id,
          integration_name: integrationName,
          access_token: encryptSecret(session.provider_token!),
          refresh_token:
            refreshToken ?? existingRefresh.get(integrationName) ?? null,
          expires_at: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
          connected_at: new Date().toISOString(),
        })),
        { onConflict: "user_id,integration_name" },
      );
    } catch (error) {
      console.error("Could not persist Google integration tokens", error);
    }
  }

  const destination = profile.onboarding_complete
    ? "/app/dashboard"
    : "/app/onboarding";
  return redirectWithCookies(destination);
}
