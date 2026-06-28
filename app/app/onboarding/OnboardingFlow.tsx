"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LoaderCircle, Lock, Orbit } from "lucide-react";
import { INTEGRATIONS, type Integration } from "./integrations";
import { INTEGRATION_ICONS } from "./icons";
import { completeOnboarding, connectIntegration } from "./actions";
import { CanvasConnectModal } from "./CanvasConnectModal";
import {
  TokenConnectModal,
  type TokenIntegration,
} from "./TokenConnectModal";

const TOTAL_STEPS = 3;

type Props = {
  firstName: string;
  initialConnected?: string[];
  initialStep?: number;
};

export function OnboardingFlow({
  firstName,
  initialConnected = [],
  initialStep = 1,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [connected, setConnected] = useState<Set<string>>(
    () => new Set(initialConnected),
  );
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [canvasModalOpen, setCanvasModalOpen] = useState(false);
  const [tokenModal, setTokenModal] = useState<TokenIntegration | null>(null);
  const [, startTransition] = useTransition();

  function handleConnect(integration: Integration) {
    if (connecting || connected.has(integration.id)) return;

    if (integration.id === "canvas") {
      setCanvasModalOpen(true);
      return;
    }

    if (integration.id === "discord") {
      window.location.assign("/api/integrations/discord/connect");
      return;
    }
    if (integration.id === "slack" || integration.id === "github") {
      setTokenModal(integration.id);
      return;
    }
    setError("");
    setConnecting(integration.id);
    // Optimistic: flip to connected immediately, reconcile with the server.
    setConnected((prev) => new Set(prev).add(integration.id));

    startTransition(async () => {
      const result = await connectIntegration(integration.id);
      setConnecting(null);
      if (!result.ok) {
        setConnected((prev) => {
          const next = new Set(prev);
          next.delete(integration.id);
          return next;
        });
        setError(`Couldn't connect ${integration.name}. Please try again.`);
      }
    });
  }

  // Entering the final step: persist completion, dwell on the loader, then go.
  useEffect(() => {
    if (step !== 3) return;
    let cancelled = false;
    void completeOnboarding();
    const timer = setTimeout(() => {
      if (cancelled) return;
      router.push("/app/dashboard");
      router.refresh();
    }, 2600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step, router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 pb-12 pt-28">
      {/* Ambient lavender wash, matching the login screen. */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-indigo-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 size-[560px] rounded-full bg-fuchsia-100/80 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.10)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <ProgressBar step={step} />

      <div
        className={`relative w-full ${
          step === 2 ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        {step === 1 && (
          <WelcomeStep firstName={firstName} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <ConnectStep
            connected={connected}
            connecting={connecting}
            error={error}
            onConnect={handleConnect}
            onContinue={() => setStep(3)}
          />
        )}
        {step === 3 && <DoneStep />}
      </div>

      <CanvasConnectModal
        open={canvasModalOpen}
        onClose={() => setCanvasModalOpen(false)}
        onConnected={() =>
          setConnected((previous) => new Set(previous).add("canvas"))
        }
      />
      <TokenConnectModal
        integration={tokenModal}
        onClose={() => setTokenModal(null)}
        onConnected={(integration) =>
          setConnected((previous) => new Set(previous).add(integration))
        }
      />
    </main>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = (step / TOTAL_STEPS) * 100;
  return (
    <div className="absolute inset-x-0 top-0 z-10 px-5 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-3xl items-center gap-3 sm:gap-4">
        <span className="flex shrink-0 items-center gap-2 text-slate-950">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-white shadow-md shadow-indigo-200">
            <Orbit size={16} strokeWidth={2.4} />
          </span>
          <span className="hidden text-sm font-black tracking-[-0.04em] sm:inline">
            Orbi
          </span>
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-indigo-100">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>
    </div>
  );
}

function WelcomeStep({
  firstName,
  onNext,
}: {
  firstName: string;
  onNext: () => void;
}) {
  return (
    <section className="glass animate-rise rounded-[32px] p-3">
      <div className="rounded-[24px] border border-white bg-white/60 px-7 py-12 text-center sm:px-12 sm:py-16">
        <div className="relative mx-auto grid size-20 place-items-center">
          <span className="pointer-events-none absolute size-20 animate-spin-slow rounded-full border border-dashed border-indigo-300/70" />
          <span className="animate-logo-pop grid size-16 place-items-center rounded-[22px] bg-primary text-white shadow-xl shadow-indigo-300/60">
            <Orbit size={34} strokeWidth={2.2} />
          </span>
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Welcome to Orbi
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
          Good to meet you, {firstName}.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Let&apos;s connect your apps.
        </p>
        <button
          onClick={onNext}
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          Let&apos;s go
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
}

function ConnectStep({
  connected,
  connecting,
  error,
  onConnect,
  onContinue,
}: {
  connected: Set<string>;
  connecting: string | null;
  error: string;
  onConnect: (integration: Integration) => void;
  onContinue: () => void;
}) {
  const connectedCount = connected.size;

  return (
    <section className="animate-rise">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Step 2 · Connect
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Bring your apps into Orbi
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">
          Connect at least one to get started. Orbi only reads what you allow,
          and never posts without asking.
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {INTEGRATIONS.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            isConnected={connected.has(integration.id)}
            isConnecting={connecting === integration.id}
            onConnect={() => onConnect(integration)}
          />
        ))}
      </div>

      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-center text-sm font-medium text-rose-600"
      >
        {error}
      </p>

      <div className="mt-4 flex flex-col items-center gap-2">
        {connectedCount > 0 ? (
          <button
            onClick={onContinue}
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500"
          >
            Continue
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        ) : (
          <p className="py-3 text-sm text-slate-400">
            Connect at least one app to continue
          </p>
        )}
        {connectedCount > 0 && (
          <p className="text-xs text-slate-400">
            {connectedCount} app{connectedCount > 1 ? "s" : ""} connected · you
            can add the rest later
          </p>
        )}
      </div>
    </section>
  );
}

function IntegrationCard({
  integration,
  isConnected,
  isConnecting,
  onConnect,
}: {
  integration: Integration;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
}) {
  const Icon = INTEGRATION_ICONS[integration.id];
  const locked = integration.locked;

  return (
    <div
      className={`glass relative flex flex-col rounded-[22px] p-4 transition ${
        locked ? "opacity-70" : ""
      } ${isConnected ? "ring-1 ring-emerald-300" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-[14px] ${integration.accent}`}
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-semibold tracking-[-0.02em] text-slate-950">
              {integration.name}
            </h3>
            {locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <Lock size={9} /> Soon
              </span>
            )}
            {isConnected && !locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <Check size={10} strokeWidth={3} /> Connected
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm leading-snug text-slate-500">
            {integration.description}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {locked ? (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-400"
          >
            Coming soon
          </button>
        ) : isConnected ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            <Check size={15} strokeWidth={3} /> Connected
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isConnecting ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                Connect
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function DoneStep() {
  return (
    <section className="glass animate-rise rounded-[32px] p-3">
      <div className="rounded-[24px] border border-white bg-white/60 px-7 py-16 text-center sm:px-12">
        <OrbitLoader />
        <h1 className="mt-10 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Orbi is reading your apps.
        </h1>
        <p className="mt-3 text-lg text-slate-600">Give us a moment.</p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400">
          <LoaderCircle size={14} className="animate-spin" />
          Setting up your inbox…
        </div>
      </div>
    </section>
  );
}

function OrbitLoader() {
  return (
    <div className="relative mx-auto size-24">
      <span className="absolute inset-1 animate-spin-slow rounded-full border border-dashed border-indigo-200" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-12 place-items-center rounded-[18px] bg-primary text-white shadow-xl shadow-indigo-300/60">
          <Orbit size={26} strokeWidth={2.2} />
        </span>
      </span>
      <span className="absolute inset-0 animate-spin-slow">
        <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-indigo-400" />
      </span>
      <span className="absolute inset-0 animate-spin-rev">
        <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-fuchsia-300" />
      </span>
    </div>
  );
}
