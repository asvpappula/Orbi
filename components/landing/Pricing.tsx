"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

const TIERS = [
  {
    name: "Free",
    tagline: "For getting your tabs under control",
    monthly: 0,
    features: [
      "2 app integrations",
      "Basic unified feed",
      "5 AI replies / month",
      "Web access",
    ],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Pro",
    tagline: "For students who live across every app",
    monthly: 9,
    features: [
      "All integrations",
      "Unlimited AI replies",
      "Context stitching",
      "Smart prioritization",
      "Priority support",
    ],
    cta: "Get Pro",
    popular: true,
  },
];

function perMonth(monthly: number, billing: Billing) {
  if (monthly === 0) return "0";
  const value = billing === "annual" ? monthly * 0.8 : monthly;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="pricing" className="page-shell py-20 sm:py-28">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Pricing
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
          Student pricing. Obviously.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-slate-600">
          Start free. Upgrade when Orbi becomes the only tab you open.
        </p>

        <div className="mt-8 inline-flex items-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              billing === "monthly" ? "text-slate-900" : "text-slate-400",
            )}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={billing === "annual"}
            aria-label="Toggle annual billing"
            onClick={() =>
              setBilling((b) => (b === "monthly" ? "annual" : "monthly"))
            }
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              billing === "annual" ? "bg-primary" : "bg-slate-300",
            )}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={cn(
                "absolute top-1 size-5 rounded-full bg-white shadow",
                billing === "annual" ? "left-6" : "left-1",
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              billing === "annual" ? "text-slate-900" : "text-slate-400",
            )}
          >
            Annual
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
            Save 20%
          </span>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
        {TIERS.map((tier) => {
          const price = perMonth(tier.monthly, billing);
          return (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-[24px] p-7 sm:p-8",
                tier.popular
                  ? "border-2 border-primary/30 bg-white shadow-[0_30px_80px_-30px_rgba(99,102,241,0.5)]"
                  : "glass",
              )}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-lg shadow-indigo-300/50">
                  <Sparkles size={12} /> Most popular
                </span>
              )}

              <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{tier.tagline}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="mb-2 text-lg font-semibold text-slate-400">$</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-5xl font-bold tracking-[-0.04em] tabular-nums text-slate-950"
                  >
                    {price}
                  </motion.span>
                </AnimatePresence>
                <span className="mb-1.5 text-sm text-slate-500">/mo</span>
              </div>
              <p className="mt-1 h-4 text-xs text-slate-400">
                {tier.monthly === 0
                  ? "Free forever"
                  : billing === "annual"
                    ? `Billed annually ($${Math.round(tier.monthly * 0.8 * 12)}/yr)`
                    : "Billed monthly"}
              </p>

              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-slate-600"
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full",
                        tier.popular
                          ? "bg-primary/10 text-primary"
                          : "bg-emerald-100 text-emerald-600",
                      )}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "group mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
                  tier.popular
                    ? "bg-primary text-white shadow-lg shadow-indigo-300/50 hover:-translate-y-0.5 hover:bg-indigo-500"
                    : "border border-slate-200 bg-white text-slate-900 hover:border-primary/40 hover:text-primary",
                )}
              >
                {tier.cta}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
