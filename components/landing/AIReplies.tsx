import { ArrowUp, Sparkles, WandSparkles } from "lucide-react";

export function AIReplies() {
  return (
    <section className="page-shell pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-gradient-to-br from-indigo-100/80 via-white/70 to-fuchsia-100/70 px-5 py-20 shadow-[0_40px_100px_-50px_rgba(79,70,229,0.5)] sm:px-10 sm:py-28 lg:px-16">
        <div className="absolute left-[8%] top-0 h-40 w-40 rounded-full bg-white/80 blur-3xl" />
        <div className="relative grid items-center gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <span className="grid size-11 place-items-center rounded-2xl bg-primary text-white shadow-xl shadow-indigo-300/50">
              <WandSparkles size={20} />
            </span>
            <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              It texts back.
              <span className="mt-3 block font-light text-primary">
                In your voice.
              </span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-600">
              Orbi reads your past emails. Drafts the reply. You hit confirm.
            </p>
          </div>

          <div className="relative pb-8 pt-4 sm:px-8">
            <div className="absolute inset-x-16 bottom-0 top-12 rotate-3 rounded-[30px] border border-white bg-white/25 shadow-xl backdrop-blur-xl" />
            <div className="glass animate-drift relative rounded-[28px] bg-white/65 p-3 sm:p-4">
              <div className="rounded-[21px] border border-white bg-white/80 p-5 shadow-inner sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-400 text-xs font-bold text-white">
                      AC
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">To: Prof. Chen</p>
                      <p className="text-xs text-slate-400">Re: Project 3 rubric</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles size={11} /> AI draft
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-indigo-100/80 bg-indigo-50/40 p-4 text-[15px] leading-relaxed text-slate-700 sm:p-5">
                  Hi Professor Chen — thanks for the clarification! Just to make
                  sure I&apos;ve got it: we only need to include resize benchmarks in
                  the final analysis, not the checkpoint due tonight. Is that
                  right?
                  <br />
                  <br />
                  Thanks,
                  <br />
                  Alex
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button className="rounded-full px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-slate-700">
                    Edit draft
                  </button>
                  <button className="group inline-flex items-center gap-2 rounded-full bg-primary py-2 pl-4 pr-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">
                    Confirm & send
                    <span className="grid size-7 place-items-center rounded-full bg-white/20">
                      <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="glass absolute -bottom-2 -left-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-600 sm:left-0">
              <span className="mr-1.5 text-emerald-500">●</span> sounds like you
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
