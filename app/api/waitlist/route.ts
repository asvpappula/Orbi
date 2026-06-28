import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || email.length > 320 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient(cookies());
    const { error } = await supabase.from("waitlist").insert({ email });

    // 23505 = unique violation — the email is already on the list, treat as success.
    if (error && error.code !== "23505") {
      return NextResponse.json(
        { error: "Could not join the waitlist" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not join the waitlist" },
      { status: 500 },
    );
  }
}
