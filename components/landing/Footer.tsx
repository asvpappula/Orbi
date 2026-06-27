import { Orbit } from "lucide-react";

export function Footer() {
  return (
    <footer className="page-shell pb-8">
      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-indigo-100 pt-7 text-sm font-medium text-slate-500 sm:justify-start">
        <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
          <Orbit size={14} className="text-primary" /> Orbi
        </span>
        <span aria-hidden="true">·</span>
        <a href="#" className="transition hover:text-primary">
          Twitter
        </a>
        <span aria-hidden="true">·</span>
        <span>Built for students</span>
      </div>
    </footer>
  );
}
