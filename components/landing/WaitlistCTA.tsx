"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { fadeUpInView } from "./motion";

export function WaitlistCTA() {
  const reduce = useReducedMotion() ?? false;
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
    <motion.section
      id="waitlist"
      {...fadeUpInView(reduce)}
      className="mx-6 mb-8 scroll-mt-24 overflow-hidden rounded-[32px] bg-slate-950 px-6 py-24 text-center text-white sm:py-32"
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-5xl font-black tracking-[-0.04em] md:text-6xl">
          Stay on top of
          <br />
          <span className="text-indigo-400">Everything.</span>
        </h2>
        <p className="mt-5 text-slate-400">Join the waitlist. No spam, ever.</p>

        {status === "done" ? (
          <p className="mt-10 text-xl font-semibold text-white">
            You&apos;re on the list.
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
              className="h-14 w-full rounded-full border border-white/20 bg-white/10 px-6 text-white outline-none transition placeholder:text-slate-500 focus:border-white/40 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-500 px-8 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-70"
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
          <p className="mt-3 text-sm text-slate-400">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </motion.section>
  );
}
