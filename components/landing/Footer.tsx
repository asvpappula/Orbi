import { Orbit } from "lucide-react";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3 sm:items-start">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-white">
              <Orbit size={19} strokeWidth={2.4} />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.04em] text-slate-900">
              Orbi
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Your unified student and founder inbox, powered by AI.
          </p>
        </div>

        <nav
          className="flex flex-col gap-2 sm:items-center"
          aria-label="Footer navigation"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-3 sm:justify-end">
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Orbi on X"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary"
          >
            <XIcon />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Orbi on GitHub"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary"
          >
            <GithubMark />
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-sm text-slate-400">
        © 2026 Orbi. All rights reserved.
      </p>
    </footer>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.372 6.839 9.728.5.095.682-.222.682-.494 0-.244-.009-.89-.014-1.746-2.782.62-3.369-1.374-3.369-1.374-.455-1.184-1.11-1.499-1.11-1.499-.908-.636.069-.623.069-.623 1.003.073 1.531 1.057 1.531 1.057.892 1.566 2.341 1.114 2.91.852.091-.663.349-1.114.635-1.37-2.221-.259-4.555-1.139-4.555-5.068 0-1.119.39-2.034 1.03-2.752-.103-.26-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.051A9.34 9.34 0 0 1 12 6.982a9.35 9.35 0 0 1 2.504.345c1.909-1.327 2.748-1.051 2.748-1.051.545 1.412.202 2.454.099 2.714.64.718 1.029 1.633 1.029 2.752 0 3.939-2.338 4.806-4.566 5.06.359.317.679.944.679 1.903 0 1.374-.012 2.482-.012 2.82 0 .274.18.594.688.493C19.138 20.625 22 16.784 22 12.253 22 6.59 17.523 2 12 2Z" />
    </svg>
  );
}
