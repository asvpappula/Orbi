"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, LoaderCircle, X } from "lucide-react";

export type TokenIntegration = "slack" | "github";

const TOKEN_CONFIG: Record<
  TokenIntegration,
  { name: string; helper: string; placeholder: string }
> = {
  slack: {
    name: "Slack",
    helper:
      "Get from api.slack.com → Your Apps → OAuth & Permissions → User OAuth Token (starts with xoxp-)",
    placeholder: "xoxp-…",
  },
  github: {
    name: "GitHub",
    helper:
      "GitHub → Settings → Developer Settings → Personal Access Tokens (classic) → Generate new token → check: notifications, repo, read:user",
    placeholder: "ghp_…",
  },
};

export function TokenConnectModal({
  integration,
  onClose,
  onConnected,
}: {
  integration: TokenIntegration | null;
  onClose: () => void;
  onConnected: (integration: TokenIntegration) => void;
}) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setToken("");
    setError("");
    setLoading(false);
  }, [integration]);

  if (!integration) return null;
  const integrationName = integration;
  const config = TOKEN_CONFIG[integrationName];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/integrations/${integrationName}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Connection failed");
      onConnected(integrationName);
      onClose();
    } catch (value) {
      setError(value instanceof Error ? value.message : "Connection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm">
      <section className="glass w-full max-w-md rounded-[24px] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Connect {config.name}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              Add your user token
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label={`Close ${config.name} connection`}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            {config.name} token
            <div className="relative mt-1.5">
              <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="password"
                autoComplete="off"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder={config.placeholder}
                className="h-12 w-full rounded-xl border border-white bg-white/70 pl-11 pr-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </label>
          <p className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm leading-relaxed text-indigo-800">
            {config.helper}
          </p>
          <p aria-live="polite" className="min-h-5 text-sm text-rose-600">{error}</p>
          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white disabled:opacity-60"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading ? "Connecting…" : `Connect ${config.name}`}
          </button>
        </form>
      </section>
    </div>
  );
}
