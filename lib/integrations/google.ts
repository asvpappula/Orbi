import { assertUserId } from "@/lib/auth/server";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

export type GoogleIntegrationName = "gmail" | "google_calendar";

export async function getGoogleAccessToken(
  userId: string,
  integrationName: GoogleIntegrationName,
) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .eq("integration_name", integrationName)
    .single();

  if (error || !data?.access_token) {
    throw new Error(`${integrationName} is not connected`);
  }

  const currentToken = decryptSecret(data.access_token);
  const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : 0;

  if (currentToken && expiresAt > Date.now() + 5 * 60 * 1000) {
    return currentToken;
  }

  const refreshToken = decryptSecret(data.refresh_token);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    if (currentToken && !expiresAt) return currentToken;
    throw new Error("Google authorization has expired; reconnect Google");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Google token refresh failed");
  const payload = (await response.json()) as {
    access_token: string;
    expires_in?: number;
  };
  const nextExpiry = new Date(
    Date.now() + (payload.expires_in ?? 3600) * 1000,
  ).toISOString();

  const { error: updateError } = await supabase
    .from("user_integrations")
    .update({
      access_token: encryptSecret(payload.access_token),
      expires_at: nextExpiry,
    })
    .eq("user_id", userId)
    .eq("integration_name", integrationName);

  if (updateError) throw new Error(updateError.message);
  return payload.access_token;
}
