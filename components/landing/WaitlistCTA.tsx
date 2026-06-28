import { ArrowRight } from "lucide-react";

export function WaitlistCTA() {
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
            Sign in with Google and bring your student life into one inbox.
            Zero tab archaeology.
          </p>
          <div className="glass rounded-[26px] p-2 sm:flex">
            <a
              href="/login"
              className="group flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[19px] bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:h-16"
            >
              Get early access
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
