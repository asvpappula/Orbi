import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function getAuthenticatedContext() {
  const supabase = createSupabaseServerClient(cookies());
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new AuthenticationError();

  return { supabase, user: user as User };
}

export async function assertUserId(userId: string) {
  const context = await getAuthenticatedContext();
  if (context.user.id !== userId) throw new AuthenticationError("Forbidden");
  return context;
}
