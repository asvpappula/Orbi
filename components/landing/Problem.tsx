const PROBLEMS = [
  {
    num: "01",
    emoji: "🗂️",
    title: "Scattered everywhere",
    body: "Your assignments are in Canvas, emails in Gmail, messages in Slack and Discord. Nothing talks to each other.",
  },
  {
    num: "02",
    emoji: "🤖",
    title: "AI that actually knows you",
    body: "Learns how you write and think, drafts replies in your exact voice. You just confirm.",
  },
  {
    num: "03",
    emoji: "✅",
    title: "One calm place",
    body: "Everything urgent surfaces automatically. Reply to anyone without switching apps.",
  },
];

export function Problem() {
  return (
    <section id="features" className="scroll-mt-24 bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          The problem
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
          You&apos;re juggling too many tabs.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((item) => (
            <div
              key={item.num}
              className="rounded-2xl bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.18)] ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {item.num}
                </span>
                <span className="text-2xl" aria-hidden="true">
                  {item.emoji}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-500">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
