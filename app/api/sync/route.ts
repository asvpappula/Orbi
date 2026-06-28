import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { runMigrations } from "@/lib/db/migrate";
import { fetchEvents } from "@/lib/integrations/calendar";
import { syncCanvas } from "@/lib/integrations/canvas";
import { syncCanvasIcal } from "@/lib/integrations/canvas-ical";
import { fetchMessages } from "@/lib/integrations/discord";
import { syncGithub } from "@/lib/integrations/github";
import {
  fetchEmails,
  getSentEmails,
  syncCanvasFromEmails,
  syncEdFromEmails,
} from "@/lib/integrations/gmail";
import { syncAllCustomConnectors } from "@/lib/integrations/custom";
import { syncOutlook } from "@/lib/integrations/outlook";
import { syncSlack } from "@/lib/integrations/slack";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { user, supabase } = await getAuthenticatedContext();
    try {
      await runMigrations(supabase);
    } catch (error) {
      console.warn("Supabase migration readiness check failed", error);
    }
    const { data, error } = await supabase
      .from("user_integrations")
      .select("integration_name, access_token")
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);

    const names = new Set((data ?? []).map((row) => row.integration_name));
    const jobs: Array<{ name: string; run: () => Promise<unknown> }> = [];
    if (names.has("canvas")) jobs.push({ name: "canvas", run: () => syncCanvas(user.id) });
    if (names.has("canvas_ical")) {
      jobs.push({ name: "canvas_ical", run: () => syncCanvasIcal(user.id) });
    }
    if (names.has("gmail")) {
      const gmailSync = fetchEmails(user.id);
      jobs.push({ name: "gmail", run: () => gmailSync });
      jobs.push({ name: "gmail_sent", run: () => getSentEmails(user.id, 20) });
      jobs.push({
        name: "canvas_emails",
        run: async () => {
          await gmailSync;
          return syncCanvasFromEmails(user.id);
        },
      });
      jobs.push({
        name: "ed_emails",
        run: async () => {
          await gmailSync;
          return syncEdFromEmails(user.id);
        },
      });
    }
    if (names.has("google_calendar")) {
      jobs.push({ name: "google_calendar", run: () => fetchEvents(user.id) });
    }
    if (names.has("discord")) jobs.push({ name: "discord", run: () => fetchMessages(user.id) });
    if (names.has("slack")) {
      jobs.push({ name: "slack", run: () => syncSlack(user.id) });
    }
    if (names.has("github")) {
      jobs.push({ name: "github", run: () => syncGithub(user.id) });
    }
    if (names.has("outlook")) {
      jobs.push({ name: "outlook", run: () => syncOutlook(user.id) });
    }

    const { count: customCount } = await supabase
      .from("custom_connectors")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((customCount ?? 0) > 0) {
      jobs.push({
        name: "custom",
        run: () => syncAllCustomConnectors(user.id),
      });
    }

    const settled = await Promise.allSettled(jobs.map(({ run }) => run()));
    const integrations = settled.map((result, index) => ({
      name: jobs[index].name,
      ok: result.status === "fulfilled",
      ...(result.status === "rejected"
        ? { error: result.reason instanceof Error ? result.reason.message : "Sync failed" }
        : {}),
    }));
    return Response.json({ ok: true, syncedAt: new Date().toISOString(), integrations });
  } catch (error) {
    return apiError(error);
  }
}
