"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, X } from "lucide-react";

export function CanvasConnectModal({
  open,
  onClose,
  onConnected,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}) {
  const [domain, setDomain] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/integrations/canvas/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, token }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Connection failed");
      setToken("");
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Connect Canvas
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              Add your school account
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close Canvas connection">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Canvas domain
            <input
              required
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="university.instructure.com"
              className="mt-1.5 h-12 w-full rounded-xl border border-white bg-white/70 px-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Personal access token
            <input
              required
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-1.5 h-12 w-full rounded-xl border border-white bg-white/70 px-4 font-normal outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <p className="min-h-5 text-sm text-rose-600">{error}</p>
          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white disabled:opacity-60"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading ? "Connecting…" : "Connect Canvas"}
          </button>
        </form>
      </section>
    </div>
  );
}
