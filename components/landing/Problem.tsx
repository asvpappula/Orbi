export function Problem() {
  return (
    <section className="page-shell pb-12 sm:pb-20">
      <div className="relative overflow-hidden rounded-[32px] bg-[#29236f] px-6 py-16 text-white shadow-[0_32px_90px_-36px_rgba(49,46,129,0.75)] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="absolute -right-20 -top-32 size-96 rounded-full border-[70px] border-white/[0.035]" />
        <div className="absolute bottom-0 left-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />

        <div className="relative grid items-end gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <blockquote className="max-w-4xl text-2xl font-medium leading-[1.45] tracking-[-0.035em] text-indigo-100 sm:text-4xl lg:text-[2.7rem]">
            <span className="block">You have the assignment on Canvas.</span>
            <span className="block text-white">The rubric landed in Gmail.</span>
            <span className="block">Your study group is losing it on Discord.</span>
            <span className="mt-7 block text-indigo-300">
              And you&apos;re still opening 6 different apps.
            </span>
          </blockquote>

          <div className="lg:justify-self-end lg:text-right">
            <p className="text-[11rem] font-black leading-[0.68] tracking-[-0.1em] text-white sm:text-[15rem] lg:text-[18rem]">
              6
            </p>
            <p className="mt-10 max-w-[240px] text-xl font-semibold leading-tight text-indigo-200 lg:ml-auto lg:text-2xl">
              apps. for one assignment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
