import { assertUserId } from "@/lib/auth/server";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

const GITHUB_API = "https://api.github.com";

type GithubNotification = {
  id: string;
  reason?: string;
  updated_at?: string;
  subject: {
    title: string;
    type?: string;
    url?: string | null;
  };
  repository: {
    full_name: string;
  };
};

type GithubSubject = {
  title?: string;
  state?: string;
  html_url?: string;
};

async function githubRequest<T>(token: string, url: string) {
  if (!url.startsWith(`${GITHUB_API}/`)) {
    throw new Error("GitHub returned an unsupported API URL");
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Orbi",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);
  return (await response.json()) as T;
}

async function githubToken(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("access_token")
    .eq("user_id", userId)
    .eq("integration_name", "github")
    .single();

  if (error || !data?.access_token) throw new Error("GitHub is not connected");
  const token = decryptSecret(data.access_token);
  if (!token) throw new Error("GitHub credentials are unavailable");
  return token;
}

export async function saveGithubToken(userId: string, token: string) {
  const { supabase } = await assertUserId(userId);
  const normalizedToken = token.trim();
  if (!normalizedToken) throw new Error("GitHub token is required");

  await githubRequest(normalizedToken, `${GITHUB_API}/user`);

  const { error } = await supabase.from("user_integrations").upsert(
    {
      user_id: userId,
      integration_name: "github",
      access_token: encryptSecret(normalizedToken),
      connected_at: new Date().toISOString(),
    },
    { onConflict: "user_id,integration_name" },
  );
  if (error) throw new Error(error.message);
}

export async function syncGithub(userId: string) {
  const { supabase } = await assertUserId(userId);
  const token = await githubToken(userId);
  const notifications = await githubRequest<GithubNotification[]>(
    token,
    `${GITHUB_API}/notifications?all=false&per_page=20`,
  );

  const enriched = await Promise.all(
    notifications.map(async (notification) => {
      let detail: GithubSubject = {};
      if (notification.subject.url) {
        try {
          detail = await githubRequest<GithubSubject>(
            token,
            notification.subject.url,
          );
        } catch {
          // Keep the notification even if its linked issue or PR is unavailable.
        }
      }
      return { notification, detail };
    }),
  );

  if (enriched.length > 0) {
    const fetchedAt = new Date().toISOString();
    const { error } = await supabase.from("github_items").upsert(
      enriched.map(({ notification, detail }) => ({
        user_id: userId,
        github_id: notification.id,
        type: notification.reason ?? notification.subject.type ?? null,
        title: detail.title ?? notification.subject.title,
        repo: notification.repository.full_name,
        url: detail.html_url ?? notification.subject.url ?? null,
        state: detail.state ?? "unread",
        timestamp: notification.updated_at ?? fetchedAt,
        fetched_at: fetchedAt,
      })),
      { onConflict: "user_id,github_id" },
    );
    if (error) throw new Error(error.message);
  }

  return { synced: enriched.length };
}
