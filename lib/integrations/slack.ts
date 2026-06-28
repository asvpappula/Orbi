import { assertUserId } from "@/lib/auth/server";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

const SLACK_API = "https://slack.com/api";

type SlackResponse = {
  ok: boolean;
  error?: string;
};

type SlackChannel = {
  id: string;
  name?: string;
  user?: string;
};

type SlackMessage = {
  ts: string;
  text?: string;
  user?: string;
  username?: string;
  user_profile?: {
    display_name?: string;
    real_name?: string;
  };
};

async function slackRequest<T extends SlackResponse>(
  token: string,
  path: string,
  params?: Record<string, string>,
) {
  const query = new URLSearchParams(params);
  const response = await fetch(
    `${SLACK_API}/${path}${query.size ? `?${query}` : ""}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error(`Slack request failed (${response.status})`);

  const payload = (await response.json()) as T;
  if (!payload.ok) {
    throw new Error(`Slack request failed: ${payload.error ?? "unknown_error"}`);
  }
  return payload;
}

async function slackToken(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("access_token")
    .eq("user_id", userId)
    .eq("integration_name", "slack")
    .single();

  if (error || !data?.access_token) throw new Error("Slack is not connected");
  const token = decryptSecret(data.access_token);
  if (!token) throw new Error("Slack credentials are unavailable");
  return token;
}

export async function saveSlackToken(userId: string, token: string) {
  const { supabase } = await assertUserId(userId);
  const normalizedToken = token.trim();
  if (!normalizedToken) throw new Error("Slack token is required");

  await slackRequest<SlackResponse>(normalizedToken, "auth.test");

  const { error } = await supabase.from("user_integrations").upsert(
    {
      user_id: userId,
      integration_name: "slack",
      access_token: encryptSecret(normalizedToken),
      connected_at: new Date().toISOString(),
    },
    { onConflict: "user_id,integration_name" },
  );
  if (error) throw new Error(error.message);
}

export async function syncSlack(userId: string) {
  const { supabase } = await assertUserId(userId);
  const token = await slackToken(userId);
  const channels = await slackRequest<
    SlackResponse & { channels?: SlackChannel[] }
  >(token, "conversations.list", {
    types: "public_channel,private_channel,im",
    limit: "50",
  });
  const oldest = String(Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60);
  const collected: Array<SlackMessage & { channel: SlackChannel }> = [];

  const channelList = channels.channels ?? [];
  for (let index = 0; index < channelList.length; index += 5) {
    const batch = channelList.slice(index, index + 5);
    const histories = await Promise.all(
      batch.map(async (channel) => {
        try {
          const history = await slackRequest<
            SlackResponse & { messages?: SlackMessage[] }
          >(token, "conversations.history", {
            channel: channel.id,
            oldest,
            limit: "10",
          });
          return (history.messages ?? []).map((message) => ({
            ...message,
            channel,
          }));
        } catch {
          // A token may see a channel without permission to read its history.
          return [];
        }
      }),
    );
    collected.push(...histories.flat());
  }

  if (collected.length > 0) {
    const fetchedAt = new Date().toISOString();
    const { error } = await supabase.from("slack_items").upsert(
      collected.map((message) => ({
        user_id: userId,
        slack_id: `${message.channel.id}:${message.ts}`,
        channel_name:
          message.channel.name ??
          (message.channel.user ? `DM ${message.channel.user}` : "Direct message"),
        author_name:
          message.user_profile?.display_name ||
          message.user_profile?.real_name ||
          message.username ||
          message.user ||
          "Unknown",
        content: message.text ?? "",
        timestamp: new Date(Number(message.ts) * 1000).toISOString(),
        fetched_at: fetchedAt,
      })),
      { onConflict: "user_id,slack_id" },
    );
    if (error) throw new Error(error.message);
  }

  return { synced: collected.length };
}
