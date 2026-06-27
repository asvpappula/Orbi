import { BookOpen, CheckCircle2, Mail, MessageCircle } from "lucide-react";

export function ContextFeature() {
  return (
    <section className="relative flex min-h-screen items-center py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[620px] -translate-y-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="page-shell relative grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-primary">
            One context, not six tabs
          </p>
          <h2 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
            Canvas. Gmail. Discord.
            <span className="mt-3 block font-light text-slate-400">
              All connected. All in one view.
            </span>
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-600">
            Orbi finds every message, file, and deadline tied to the work in
            front of you—then puts the whole story in order.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-7 rounded-[44px] bg-gradient-to-br from-indigo-200/50 via-fuchsia-100/40 to-sky-100/50 blur-2xl" />
          <article className="glass relative overflow-hidden rounded-[30px] bg-white/70 p-3 sm:p-4">
            <div className="rounded-[22px] border border-slate-200/70 bg-white/80">
              <header className="flex flex-col gap-4 border-b border-slate-200/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    Orbi context view
                  </p>
                  <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    Project 3: Hash Table Maps
                  </h3>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">
                  <span className="size-1.5 rounded-full bg-rose-500" /> Due today
                </span>
              </header>

              <div className="space-y-3 p-3 sm:p-5">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/45 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-rose-500 shadow-sm">
                      <BookOpen size={17} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-500">
                          Canvas assignment
                        </p>
                        <span className="text-xs text-slate-400">· 11:59 PM</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-900 sm:text-base">
                        Implement a hash table-backed map and submit your analysis.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-lg bg-white px-2.5 py-1 shadow-sm">spec.pdf</span>
                        <span className="rounded-lg bg-white px-2.5 py-1 shadow-sm">starter-code.zip</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-sky-50/45 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-sky-500 shadow-sm">
                      <Mail size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-500">
                        Gmail · Prof. Chen
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 sm:text-base">
                        “One clarification on the rubric…”
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        You only need to benchmark resize operations for the final
                        section. I&apos;ve attached the updated rubric here.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-violet-50/45 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-violet-500 shadow-sm">
                      <MessageCircle size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500">
                          Discord · #study-group
                        </p>
                        <span className="rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          3 new
                        </span>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p><strong className="text-slate-900">Maya</strong> wait did anyone get q4?</p>
                        <p><strong className="text-slate-900">Leo</strong> I think it&apos;s amortized O(1)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="flex items-center gap-2 border-t border-slate-200/70 px-5 py-4 text-xs font-medium text-emerald-600 sm:px-7">
                <CheckCircle2 size={15} />
                3 sources stitched into one context
              </footer>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
