import { NextResponse } from "next/server";
import { AuthenticationError } from "@/lib/auth/server";

export function apiError(error: unknown) {
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Forbidden" ? 403 : 401 },
    );
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: 500 });
}
