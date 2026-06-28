"use client";

// Placeholder UI + data for the Settings page. Codex wires real data later.
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { APP_ICON } from "./app-icons";
import { APP_META, type AppKey } from "./data";

const CONNECTED: { app: AppKey; status: string; syncing?: boolean }[] = [
  { app: "canvas", status: "Connected · syncing", syncing: true },
  { app: "gmail", status: "Connected · syncing", syncing: true },
  { app: "discord", status: "Connected" },
  { app: "groupme", status: "Connected" },
  { app: "calendar", status: "Connected" },
];

export function SettingsView() {
  const [tone, setTone] = useState<"Casual" | "Professional">("Casual");
  const [learn, setLearn] = useState(true);
  const [askBefore, setAskBefore] = useState(true);
  const [urgency, setUrgency] = useState(true);
  const [digest, setDigest] = useState(true);
  const [quiet, setQuiet] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
      <div className="mx-auto max-w-2xl space-y-5 pb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account, connections, and how Orbi writes for you.
          </p>
        </div>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                AR
              </span>
              <div>
                <p className="font-semibold text-slate-900">Alex Rivera</p>
                <p className="text-xs text-slate-500">
                  alex.rivera@purdue.edu · Junior
                </p>
              </div>
            </div>
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary">
              Edit profile
            </button>
          </div>
        </Card>

        <Card>
          <SectionLabel>Connected apps</SectionLabel>
          <div className="divide-y divide-slate-100">
            {CONNECTED.map(({ app, status }) => {
              const Icon = APP_ICON[app];
              return (
                <div
                  key={app}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-lg",
                        APP_META[app].tile,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {APP_META[app].label}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {status}
                      </p>
                    </div>
                  </div>
                  <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary">
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionLabel>AI voice &amp; replies</SectionLabel>
          <SettingRow
            title="Default reply tone"
            desc="The voice Orbi uses for new drafts."
            control={
              <div className="flex rounded-full bg-slate-100 p-0.5">
                {(["Casual", "Professional"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                      tone === t ? "bg-primary text-white shadow" : "text-slate-500",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow
            title="Learn from my sent messages"
            desc="Orbi studies how you write to match your voice. Learned from 47 messages."
            control={<Toggle checked={learn} onChange={setLearn} />}
          />
          <SettingRow
            title="Always ask before sending"
            desc="Review every AI draft before it goes out."
            control={<Toggle checked={askBefore} onChange={setAskBefore} />}
          />
        </Card>

        <Card>
          <SectionLabel>Notifications</SectionLabel>
          <SettingRow
            title="Urgency alerts"
            desc="Get pinged only for time-sensitive items."
            control={<Toggle checked={urgency} onChange={setUrgency} />}
          />
          <SettingRow
            title="Daily digest"
            desc="One summary every morning at 8 AM."
            control={<Toggle checked={digest} onChange={setDigest} />}
          />
          <SettingRow
            title="Quiet hours"
            desc="Mute everything 10 PM – 8 AM."
            control={<Toggle checked={quiet} onChange={setQuiet} />}
          />
        </Card>
      </div>
    </main>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur-xl">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function SettingRow({
  title,
  desc,
  control,
}: {
  title: string;
  desc: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "absolute top-1 size-4 rounded-full bg-white shadow transition-all",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}
