import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Mail,
  MessageCircle,
} from "lucide-react";

const notifications = [
  {
    app: "Canvas",
    title: "Project 3 is due today",
    detail: "Hash Table Maps · 11:59 PM",
    icon: BookOpen,
    border: "border-l-rose-400",
    iconStyle: "bg-rose-50 text-rose-500",
    position: "left-0 top-5 -rotate-2 lg:left-8",
  },
  {
    app: "Gmail",
    title: "2 unread from Prof. Chen",
    detail: "Re: rubric clarification",
    icon: Mail,
    border: "border-l-sky-400",
    iconStyle: "bg-sky-50 text-sky-500",
    position: "right-0 top-32 rotate-[2.5deg] lg:right-3",
  },
  {
    app: "Discord",
    title: "3 new in #study-group",
    detail: "Maya: wait did anyone get q4?",
    icon: MessageCircle,
    border: "border-l-violet-400",
    iconStyle: "bg-violet-50 text-violet-500",
    position: "left-2 top-[248px] -rotate-1 lg:left-0",
  },
  {
    app: "Calendar",
    title: "Study session in 20 min",
    detail: "Library · Room 3B",
    icon: CalendarDays,
    border: "border-l-emerald-400",
    iconStyle: "bg-emerald-50 text-emerald-600",
    position: "right-1 top-[360px] rotate-2 lg:right-10",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-92px)] items-center overflow-hidden pb-24 pt-16 sm:pt-24 lg:pb-28 lg:pt-20"
    >
      <div className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[500px] rounded-full bg-fuchsia-100/70 blur-3xl" />
      <div className="page-shell relative grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(99,102,241,0.12)]" />
            The unified inbox for college
          </div>

          <h1 className="max-w-[860px] text-[clamp(4.25rem,10vw,9.4rem)] font-light leading-[0.78] tracking-[-0.075em] text-slate-900">
            Stop living in
            <span className="mt-5 block font-black text-primary">12 tabs.</span>
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Orbi pulls Canvas, Gmail, Discord, and GroupMe into one place. AI
            handles the replies.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_16px_35px_-12px_rgba(99,102,241,0.7)] transition hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Get early access
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <p className="text-sm font-medium text-slate-500">
              <span className="font-bold text-slate-900">1,200</span> students
              already waiting
            </p>
          </div>
        </div>

        <div className="relative mx-auto h-[485px] w-full max-w-[540px] lg:mx-0 lg:justify-self-end">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/35 blur-3xl" />
          <div className="glass absolute inset-x-12 inset-y-4 rounded-[42px] border-white/60 bg-white/25" />
          <div className="absolute inset-x-16 inset-y-8 rounded-[36px] border border-white/60 bg-gradient-to-br from-white/20 to-indigo-100/20 shadow-inner" />

          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <article
                key={notification.app}
                className={`glass animate-drift absolute w-[92%] max-w-[390px] rounded-[22px] border-l-4 p-4 sm:p-5 ${notification.border} ${notification.position}`}
                style={{ animationDelay: `${index * -1.4}s` }}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-2xl ${notification.iconStyle}`}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {notification.app}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400">
                        now
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900 sm:text-base">
                      {notification.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                      {notification.detail}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
