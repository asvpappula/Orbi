import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Confirm that the versioned Supabase migrations required by sync are present.
 *
 * Runtime clients intentionally cannot execute DDL. Granting an authenticated
 * request permission to create tables or policies would let any signed-in user
 * change the database schema. The SQL lives in supabase/migrations; this check
 * is safe to run on every sync and produces a useful warning if deployment
 * migrations were missed.
 */
export async function runMigrations(supabase: SupabaseClient) {
  const checks = await Promise.all([
    supabase
      .from("user_integrations")
      .select("canvas_ical_url, expires_at, canvas_domain")
      .limit(0),
    supabase.from("canvas_items").select("id").limit(0),
    supabase.from("gmail_items").select("id").limit(0),
    supabase.from("user_style_profiles").select("id").limit(0),
    supabase.from("slack_items").select("id").limit(0),
    supabase.from("github_items").select("id").limit(0),
    supabase.from("custom_connectors").select("id").limit(0),
    supabase.from("custom_items").select("id").limit(0),
  ]);

  const errors = checks.flatMap(({ error }) => (error ? [error.message] : []));
  if (errors.length > 0) {
    throw new Error(`Supabase migrations are not ready: ${errors.join("; ")}`);
  }
}
