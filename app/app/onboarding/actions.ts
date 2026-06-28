"use server";

import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase";
import { CONNECTABLE_IDS, type IntegrationId } from "./integrations";

type ActionResult = { ok: true } | { ok: false; error: string };

function isConnectable(name: string): name is IntegrationId {
  return (CONNECTABLE_IDS as string[]).includes(name);
}

/**
 * Record a connected integration for the signed-in user.
 *
 * TODO(oauth): once provider OAuth apps are registered, kick off the real
 * handshake (redirect → callback → token exchange) and persist the returned
 * `access_token` / `refresh_token` here. Until then we store the connection so
 * the onboarding flow and the dashboard work end to end; tokens stay null.
 */
export async function connectIntegration(
  integrationName: string,
): Promise<ActionResult> {
  if (!isConnectable(integrationName)) {
    return { ok: false, error: "Unknown integration" };
  }

  try {
    const supabase = createSupabaseServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { ok: false, error: "Not signed in" };

    if (integrationName === "canvas" || integrationName === "discord") {
      return {
        ok: false,
        error: `${integrationName} requires its dedicated connection flow`,
      };
    }

    if (
      integrationName === "gmail" ||
      integrationName === "google_calendar"
    ) {
      const { data } = await supabase
        .from("user_integrations")
        .select("access_token")
        .eq("user_id", user.id)
        .eq("integration_name", integrationName)
        .maybeSingle();
      if (!data?.access_token) {
        return { ok: false, error: "Reconnect with Google to grant access" };
      }
      return { ok: true };
    }

    const { error } = await supabase.from("user_integrations").upsert(
      {
        user_id: user.id,
        integration_name: integrationName,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id,integration_name" },
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "Connection failed" };
  }
}

/** Remove a previously connected integration. */
export async function disconnectIntegration(
  integrationName: string,
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { ok: false, error: "Not signed in" };

    const { error } = await supabase
      .from("user_integrations")
      .delete()
      .eq("user_id", user.id)
      .eq("integration_name", integrationName);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "Disconnect failed" };
  }
}

/** Mark onboarding complete so the user lands on the dashboard from now on. */
export async function completeOnboarding(): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { ok: false, error: "Not signed in" };

    const { error } = await supabase
      .from("users")
      .update({ onboarding_complete: true })
      .eq("id", user.id);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not complete onboarding" };
  }
}
