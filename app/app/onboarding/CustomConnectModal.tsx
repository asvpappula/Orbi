"use client";

import { FormEvent, useEffect, useState } from "react";
import { Globe, LoaderCircle, X } from "lucide-react";

const FEED_TYPES = [
  { value: "json", label: "JSON API" },
  { value: "ical", label: "iCal Feed" },
  { value: "rss", label: "RSS Feed" },
] as const;

export function CustomConnectModal({
  open,
  onClose,
  onConnected,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [feedType, setFeedType] = useState<string>("json");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setUrl("");
      setApiKey("");
      setFeedType("json");
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/integrations/custom/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, apiKey, feedType }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Connection failed");
      onConnected();
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
              Custom source
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              Connect any feed
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close custom source">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Course site, club RSS, …"
              className="mt-1.5 h-12 w-full rounded-xl border border-white bg-white/70 px-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            URL
            <div className="relative mt-1.5">
              <Globe className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://…"
                className="h-12 w-full rounded-xl border border-white bg-white/70 pl-11 pr-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            API key <span className="font-normal text-slate-400">(optional)</span>
            <input
              type="password"
              autoComplete="off"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Bearer token, if the feed needs one"
              className="mt-1.5 h-12 w-full rounded-xl border border-white bg-white/70 px-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Type
            <select
              value={feedType}
              onChange={(event) => setFeedType(event.target.value)}
              className="mt-1.5 h-12 w-full rounded-xl border border-white bg-white/70 px-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
            >
              {FEED_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <p aria-live="polite" className="min-h-5 text-sm text-rose-600">
            {error}
          </p>
          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white disabled:opacity-60"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading ? "Connecting…" : "Connect source"}
          </button>
        </form>
      </section>
    </div>
  );
}
