"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type FormState = "idle" | "submitting" | "success" | "error";

export function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("waitlist").insert({ email });

      if (error) {
        if (error.code === "23505") {
          setStatus("success");
          setMessage("You’re already on the list.");
          return;
        }
        throw error;
      }

      setStatus("success");
      setMessage("You’re in. We’ll be in touch.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went sideways. Please try again.");
    }
  }

  return (
    <section id="waitlist" className="page-shell py-20 sm:py-28">
      <div className="grid items-end gap-12 border-y border-indigo-100 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Your tabs can wait
          </p>
          <h2 className="mt-4 text-[clamp(5.5rem,15vw,12rem)] font-black leading-[0.72] tracking-[-0.09em] text-slate-950">
            Ready?
          </h2>
        </div>

        <div className="lg:pb-1">
          <p className="mb-6 max-w-lg text-lg leading-relaxed text-slate-600">
            Be first in line when Orbi opens its doors. One inbox, zero tab
            archaeology.
          </p>
          <form onSubmit={handleSubmit} className="glass rounded-[26px] p-2 sm:flex">
            <label htmlFor="waitlist-email" className="sr-only">
              School email
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@university.edu"
              disabled={status === "submitting"}
              className="h-14 w-full min-w-0 bg-transparent px-4 text-base text-slate-950 outline-none placeholder:text-slate-400 disabled:opacity-60 sm:h-16 sm:px-5"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[19px] bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 sm:h-16 sm:w-auto"
            >
              {status === "submitting" ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : status === "success" ? (
                <Check size={17} />
              ) : (
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
              {status === "submitting" ? "Joining…" : "Get early access"}
            </button>
          </form>
          <p
            aria-live="polite"
            className={`mt-3 min-h-5 pl-3 text-sm font-medium ${
              status === "error" ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
