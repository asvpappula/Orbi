import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { fetchEvents } from "@/lib/integrations/calendar";
import { syncCanvas } from "@/lib/integrations/canvas";
import { fetchMessages } from "@/lib/integrations/discord";
import { fetchEmails, getSentEmails } from "@/lib/integrations/gmail";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { user, supabase } = await getAuthenticatedContext();
    const { data, error } = await supabase
      .from("user_integrations")
      .select("integration_name, access_token")
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);

    const names = new Set((data ?? []).map((row) => row.integration_name));
    const jobs: Array<{ name: string; run: () => Promise<unknown> }> = [];
    if (names.has("canvas")) jobs.push({ name: "canvas", run: () => syncCanvas(user.id) });
    if (names.has("gmail")) {
      jobs.push({ name: "gmail", run: () => fetchEmails(user.id) });
      jobs.push({ name: "gmail_sent", run: () => getSentEmails(user.id, 50) });
    }
    if (names.has("google_calendar")) {
      jobs.push({ name: "google_calendar", run: () => fetchEvents(user.id) });
    }
    if (names.has("discord")) jobs.push({ name: "discord", run: () => fetchMessages(user.id) });

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
