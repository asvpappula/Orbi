import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CanvasIcon,
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  GoogleCalendarIcon,
  NotionIcon,
  SlackIcon,
} from "@/app/app/onboarding/icons";

const TOOLS = [
  { name: "Canvas", Icon: CanvasIcon, tile: "bg-[#d5273e]" },
  { name: "Gmail", Icon: GmailIcon, tile: "bg-white ring-1 ring-slate-200" },
  { name: "Slack", Icon: SlackIcon, tile: "bg-white ring-1 ring-slate-200" },
  { name: "GitHub", Icon: GithubIcon, tile: "bg-slate-900 text-white" },
  { name: "Discord", Icon: DiscordIcon, tile: "bg-[#5865f2]" },
  { name: "Notion", Icon: NotionIcon, tile: "bg-white ring-1 ring-slate-200" },
  {
    name: "Google Calendar",
    Icon: GoogleCalendarIcon,
    tile: "bg-white ring-1 ring-slate-200",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        Your unified student + founder inbox
      </p>

      <h1 className="mt-6 max-w-4xl text-[clamp(3rem,7vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-slate-900">
        Everything that matters,
        <br />
        finally in one place.
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
        Canvas assignments, Gmail, Slack, Discord, and every deadline — pulled
        together by AI that knows how you communicate.
      </p>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="#waitlist"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-300/40 transition hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          Get early access
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          See how it works
        </a>
      </div>

      <div className="mt-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Works with your tools
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {TOOLS.map(({ name, Icon, tile }) => (
            <span
              key={name}
              title={name}
              className={cn(
                "grid size-11 place-items-center rounded-xl shadow-sm",
                tile,
              )}
            >
              <Icon className="size-6" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
