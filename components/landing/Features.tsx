const FEATURES = [
  {
    emoji: "📥",
    title: "Unified inbox",
    body: "Gmail, Slack, Canvas, Discord in one prioritized feed.",
  },
  {
    emoji: "🎓",
    title: "Canvas integration",
    body: "Assignments, due dates, and syllabi pulled automatically. No token needed.",
  },
  {
    emoji: "🤖",
    title: "AI replies",
    body: "Drafts responses in your exact voice. You review and confirm before anything sends.",
  },
  {
    emoji: "🔗",
    title: "Cross-app context",
    body: "See the Canvas assignment, the related professor email, and the Discord study thread all together.",
  },
  {
    emoji: "📅",
    title: "Smart calendar",
    body: "Every deadline and event in one visual week view.",
  },
  {
    emoji: "🔌",
    title: "Custom connectors",
    body: "Add any tool with a URL and API key. Ed Discussion, Notion, anything.",
  },
];

export function Features() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-white px-6 py-24 sm:py-32"
    >
      {/* Anchor alias so the Navbar's existing "How it works" (#how) link lands here. */}
      <span id="how" aria-hidden="true" className="block -translate-y-24" />
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          How it works
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
          Built for how students and founders actually work
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-[#f5f4ff] p-8">
              <span className="text-3xl" aria-hidden="true">
                {feature.emoji}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-500">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
