import { assertUserId } from "@/lib/auth/server";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

const DISCORD_API = "https://discord.com/api/v10";

type DiscordToken = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

type DiscordGuild = { id: string; name: string };
type DiscordChannel = { id: string; name?: string; type: number };
type DiscordMessage = {
  id: string;
  channel_id: string;
  content?: string;
  timestamp?: string;
  author?: { username?: string; global_name?: string };
};

function discordConfig() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  if (!clientId || !clientSecret) {
    throw new Error("Discord OAuth is not configured");
  }
  return {
    clientId,
    clientSecret,
    redirectUri: `${appUrl.replace(/\/$/, "")}/api/integrations/discord/callback`,
  };
}

async function discordRequest<T>(token: string, path: string) {
  const response = await fetch(`${DISCORD_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Discord request failed (${response.status})`);
  return (await response.json()) as T;
}

async function discordAccessToken(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .eq("integration_name", "discord")
    .single();

  if (error || !data?.access_token) throw new Error("Discord is not connected");
  const accessToken = decryptSecret(data.access_token);
  const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : 0;
  if (accessToken && expiresAt > Date.now() + 5 * 60 * 1000) return accessToken;

  const refreshToken = decryptSecret(data.refresh_token);
  if (!refreshToken) {
    if (accessToken && !expiresAt) return accessToken;
    throw new Error("Discord authorization expired; reconnect Discord");
  }

  const config = discordConfig();
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Discord token refresh failed");
  const payload = (await response.json()) as DiscordToken;

  const { error: updateError } = await supabase
    .from("user_integrations")
    .update({
      access_token: encryptSecret(payload.access_token),
      refresh_token: payload.refresh_token
        ? encryptSecret(payload.refresh_token)
        : data.refresh_token,
      expires_at: new Date(
        Date.now() + (payload.expires_in ?? 3600) * 1000,
      ).toISOString(),
    })
    .eq("user_id", userId)
    .eq("integration_name", "discord");
  if (updateError) throw new Error(updateError.message);
  return payload.access_token;
}

export async function connectDiscord(userId: string, code: string) {
  const { supabase } = await assertUserId(userId);
  const config = discordConfig();
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Discord authorization failed");
  const payload = (await response.json()) as DiscordToken;

  const { error } = await supabase.from("user_integrations").upsert(
    {
      user_id: userId,
      integration_name: "discord",
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

export async function fetchGuilds(userId: string) {
  const token = await discordAccessToken(userId);
  return discordRequest<DiscordGuild[]>(token, "/users/@me/guilds");
}

export async function fetchMessages(userId: string) {
  const { supabase } = await assertUserId(userId);
  const token = await discordAccessToken(userId);
  const guilds = await discordRequest<DiscordGuild[]>(token, "/users/@me/guilds");
  const collected: Array<DiscordMessage & { guild: DiscordGuild; channel: DiscordChannel }> = [];

  for (const guild of guilds.slice(0, 10)) {
    let channels: DiscordChannel[] = [];
    try {
      channels = await discordRequest<DiscordChannel[]>(
        token,
        `/guilds/${guild.id}/channels`,
      );
    } catch {
      continue;
    }

    for (const channel of channels.filter((item) => item.type === 0).slice(0, 10)) {
      try {
        const messages = await discordRequest<DiscordMessage[]>(
          token,
          `/channels/${channel.id}/messages?limit=25`,
        );
        collected.push(
          ...messages.map((message) => ({ ...message, guild, channel })),
        );
      } catch {
        // Some servers or channels do not grant message history to this token.
      }
    }
  }

  if (collected.length) {
    const { error } = await supabase.from("discord_items").upsert(
      collected.map((message) => ({
        user_id: userId,
        discord_id: message.id,
        guild_id: message.guild.id,
        guild_name: message.guild.name,
        channel_id: message.channel_id,
        channel_name: message.channel.name ?? null,
        author_name:
          message.author?.global_name ?? message.author?.username ?? "Unknown",
        content: message.content ?? "",
        timestamp: message.timestamp ?? null,
        fetched_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,discord_id" },
    );
    if (error) throw new Error(error.message);
  }

  return collected;
}

export function discordAuthorizationUrl(state: string) {
  const config = discordConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "identify guilds messages.read",
    state,
    prompt: "consent",
  });
  return `https://discord.com/oauth2/authorize?${params}`;
}
