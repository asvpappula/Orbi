import { assertUserId } from "@/lib/auth/server";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

const MICROSOFT_AUTH_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const MICROSOFT_TOKEN_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const GRAPH_MESSAGES_URL = "https://graph.microsoft.com/v1.0/me/messages";
const OUTLOOK_SCOPE = "offline_access Mail.Read Calendars.Read";

function microsoftConfig() {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Microsoft OAuth is not configured");
  }
  return { clientId, clientSecret };
}

export function outlookAuthorizationUrl(state: string, redirectUri: string) {
  const { clientId } = microsoftConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: OUTLOOK_SCOPE,
    response_mode: "query",
    state,
  });
  return `${MICROSOFT_AUTH_URL}?${params.toString()}`;
}

type MicrosoftToken = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

export async function connectOutlook(
  userId: string,
  code: string,
  redirectUri: string,
) {
  const { supabase } = await assertUserId(userId);
  const { clientId, clientSecret } = microsoftConfig();
  const response = await fetch(MICROSOFT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      scope: OUTLOOK_SCOPE,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Microsoft token exchange failed");
  const payload = (await response.json()) as MicrosoftToken;

  const { error } = await supabase.from("user_integrations").upsert(
    {
      user_id: userId,
      integration_name: "outlook",
      access_token: encryptSecret(payload.access_token),
      refresh_token: payload.refresh_token
        ? encryptSecret(payload.refresh_token)
        : null,
      expires_at: new Date(
        Date.now() + (payload.expires_in ?? 3600) * 1000,
      ).toISOString(),
      connected_at: new Date().toISOString(),
    },
    { onConflict: "user_id,integration_name" },
  );
  if (error) throw new Error(error.message);
}

export async function getOutlookAccessToken(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .eq("integration_name", "outlook")
    .single();

  if (error || !data?.access_token) {
    throw new Error("outlook is not connected");
  }

  const currentToken = decryptSecret(data.access_token);
  const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : 0;

  if (currentToken && expiresAt > Date.now() + 5 * 60 * 1000) {
    return currentToken;
  }

  const refreshToken = decryptSecret(data.refresh_token);
  const { clientId, clientSecret } = microsoftConfig();

  if (!refreshToken) {
    if (currentToken && !expiresAt) return currentToken;
    throw new Error("Microsoft authorization has expired; reconnect Outlook");
  }

  const response = await fetch(MICROSOFT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: OUTLOOK_SCOPE,
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Microsoft token refresh failed");
  const payload = (await response.json()) as MicrosoftToken;
  const nextExpiry = new Date(
    Date.now() + (payload.expires_in ?? 3600) * 1000,
  ).toISOString();

  const { error: updateError } = await supabase
    .from("user_integrations")
    .update({
      access_token: encryptSecret(payload.access_token),
      ...(payload.refresh_token
        ? { refresh_token: encryptSecret(payload.refresh_token) }
        : {}),
      expires_at: nextExpiry,
    })
    .eq("user_id", userId)
    .eq("integration_name", "outlook");

  if (updateError) throw new Error(updateError.message);
  return payload.access_token;
}

type GraphAddress = { name?: string; address?: string };
type GraphMessage = {
  id: string;
  subject?: string;
  bodyPreview?: string;
  receivedDateTime?: string;
  isRead?: boolean;
  from?: { emailAddress?: GraphAddress };
  body?: { contentType?: string; content?: string };
};

function outlookRow(userId: string, message: GraphMessage) {
  const address = message.from?.emailAddress ?? {};
  const content = message.body?.content ?? "";
  return {
    user_id: userId,
    gmail_id: `outlook:${message.id}`,
    thread_id: `outlook:${message.id}`,
    from_name: address.name ?? "",
    from_email: address.address ?? "",
    subject: message.subject ?? "(no subject)",
    preview: message.bodyPreview ?? content.slice(0, 240),
    body: content,
    timestamp: message.receivedDateTime ?? new Date().toISOString(),
    is_read: message.isRead ?? true,
    labels: [] as string[],
  };
}

export async function syncOutlook(userId: string) {
  const { supabase } = await assertUserId(userId);
  const token = await getOutlookAccessToken(userId);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const filter = encodeURIComponent(`receivedDateTime ge ${since}`);
  const url =
    `${GRAPH_MESSAGES_URL}?$filter=${filter}&$top=20` +
    `&$select=id,subject,from,receivedDateTime,isRead,bodyPreview,body`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Microsoft Graph request failed (${response.status})`);
  }

  const payload = (await response.json()) as { value?: GraphMessage[] };
  const messages = payload.value ?? [];
  if (!messages.length) return { synced: 0 };

  const rows = messages.map((message) => outlookRow(userId, message));
  const { error } = await supabase
    .from("gmail_items")
    .upsert(rows, { onConflict: "user_id,gmail_id" });
  if (error) throw new Error(error.message);
  return { synced: rows.length };
}
