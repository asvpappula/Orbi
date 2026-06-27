import { ArrowUpRight, Orbit } from "lucide-react";

export function Navbar() {
  return (
    <header className="relative z-50 pt-5 sm:pt-7">
      <nav
        aria-label="Main navigation"
        className="glass mx-auto flex w-[calc(100%-2rem)] max-w-[1360px] items-center justify-between rounded-full px-3 py-3 sm:w-[calc(100%-3rem)] sm:px-4"
      >
        <a
          href="#top"
          className="group flex items-center gap-2.5 rounded-full px-2 text-slate-950"
          aria-label="Orbi home"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary text-white shadow-lg shadow-indigo-300/60 transition-transform duration-300 group-hover:-rotate-12">
            <Orbit size={19} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.04em]">Orbi</span>
        </a>

        <a
          href="#waitlist"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:px-5"
        >
          Get early access
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </nav>
    </header>
  );
}
