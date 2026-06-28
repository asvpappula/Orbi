const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Twitter", href: "https://x.com" },
  { label: "GitHub", href: "https://github.com" },
];

export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-black/5 bg-white px-6 py-8">
      <div className="flex items-baseline">
        <span className="font-black text-slate-950">Orbi</span>
        <span className="ml-2 text-xs text-slate-400">© 2026</span>
      </div>

      <nav className="flex gap-6" aria-label="Footer">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-slate-400 transition hover:text-slate-900"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
