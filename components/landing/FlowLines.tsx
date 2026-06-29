export function FlowLines() {
  return (
    <div className="relative mx-auto h-28 max-w-5xl overflow-hidden px-6" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 112"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M500 0 C500 48 110 60 70 112" stroke="#e0e7ff" strokeWidth="1.5" />
        <path d="M500 0 C500 45 300 66 270 112" stroke="#c7d2fe" strokeWidth="1.5" />
        <path d="M500 0 C500 48 500 72 500 112" stroke="#6366f1" strokeWidth="2" opacity="0.35" />
        <path d="M500 0 C500 45 700 66 730 112" stroke="#c7d2fe" strokeWidth="1.5" />
        <path d="M500 0 C500 48 890 60 930 112" stroke="#e0e7ff" strokeWidth="1.5" />
      </svg>
      <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-indigo-500 shadow-[0_0_0_6px_rgba(99,102,241,0.1)]" />
    </div>
  );
}
