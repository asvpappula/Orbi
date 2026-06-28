"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";

export function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="scroll-mt-24 bg-primary px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
          Be the first to try Orbi
        </h2>
        <p className="mt-4 text-lg text-indigo-100">
          No spam. Early access to students and founders first.
        </p>

        {status === "done" ? (
          <p className="mt-10 text-2xl font-semibold text-white">
            You&apos;re on the list 🎉
          </p>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@university.edu"
              disabled={status === "loading"}
              className="h-14 w-full rounded-full bg-white px-6 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/70 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-700 px-7 font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-70"
            >
              {status === "loading" ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                "Join waitlist"
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-indigo-100">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
