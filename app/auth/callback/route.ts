import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
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
    return NextResponse.redirect(new URL("/login?error=profile", request.url));
  }

  const destination = profile.onboarding_complete
    ? "/app/dashboard"
    : "/app/onboarding";
  const response = NextResponse.redirect(new URL(destination, request.url));

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
