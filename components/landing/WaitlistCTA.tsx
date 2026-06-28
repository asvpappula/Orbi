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
      className="scroll-mt-24 bg-primary px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
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
              className="h-14 w-full rounded-full bg-white px-6 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-white/70 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group relative inline-flex h-14 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-indigo-700 px-7 font-semibold text-white transition-all duration-300 hover:bg-indigo-800 disabled:opacity-70"
            >
              <span
                aria-hidden="true"
                className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                {status === "loading" ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  "Join waitlist"
                )}
              </span>
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-indigo-100">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </motion.section>
  );
}
