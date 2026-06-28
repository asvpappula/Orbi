"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, Orbit } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.53h3.14c1.84-1.7 2.91-4.2 2.91-7.31Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.53c-.87.58-1.98.92-3.29.92-2.53 0-4.67-1.71-5.44-4.01H3.32v2.61A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.56 13.77A5.85 5.85 0 0 1 6.25 12c0-.62.11-1.22.31-1.77V7.62H3.32A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.07 4.38l3.24-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.22c1.43 0 2.71.49 3.72 1.45l2.78-2.79A9.32 9.32 0 0 0 12 2.25a9.72 9.72 0 0 0-8.68 5.37l3.24 2.61C7.33 7.93 9.47 6.22 12 6.22Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/calendar.readonly",
          ].join(" "),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (signInError) throw signInError;
    } catch {
      setError("Couldn’t start Google sign-in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-12">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-indigo-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 size-[560px] rounded-full bg-fuchsia-100/80 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.13)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />

      <section className="glass relative w-full max-w-[470px] overflow-hidden rounded-[34px] p-3">
        <div className="rounded-[26px] border border-white/90 bg-white/60 px-6 py-10 text-center shadow-inner sm:px-10 sm:py-12">
          <a
            href="/"
            className="mx-auto inline-flex items-center gap-2.5"
            aria-label="Orbi home"
          >
            <span className="grid size-11 place-items-center rounded-full bg-primary text-white shadow-xl shadow-indigo-300/60">
              <Orbit size={23} strokeWidth={2.4} />
            </span>
            <span className="text-2xl font-black tracking-[-0.05em] text-slate-950">
              Orbi
            </span>
          </a>

          <div className="mx-auto my-9 h-px w-16 bg-indigo-100" />

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Your unified inbox
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-5xl">
            Connect your
            <span className="block font-light text-slate-400">student life</span>
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
            Canvas, Gmail, Discord, GroupMe, and every deadline—finally in one
            calm place.
          </p>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="group mt-9 flex h-14 w-full items-center justify-between rounded-[18px] bg-primary px-4 text-sm font-bold text-white shadow-[0_16px_35px_-13px_rgba(99,102,241,0.75)] transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="grid size-8 place-items-center rounded-full bg-white">
              <GoogleIcon />
            </span>
            <span>{loading ? "Connecting…" : "Continue with Google"}</span>
            <span className="grid size-8 place-items-center rounded-full bg-white/15">
              {loading ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              )}
            </span>
          </button>

          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose-600">
            {error}
          </p>

          <p className="mt-5 text-xs leading-relaxed text-slate-400">
            By continuing, you agree to let Orbi connect your student tools.
            We&apos;ll never send anything without your say-so.
          </p>
        </div>
      </section>
    </main>
  );
}
