"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Search that starts as an icon button and expands into a full input on click,
 * with a spring width animation. Collapses on blur (when empty) or Escape.
 */
export function ExpandingSearch({
  placeholder = "Search across all your apps…",
  className,
  expandedWidth = 420,
  onSearch,
}: {
  placeholder?: string;
  className?: string;
  expandedWidth?: number;
  onSearch?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setValue("");
    setOpen(false);
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: open ? expandedWidth : 44 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={cn(
        "flex h-11 max-w-full items-center overflow-hidden rounded-full border border-white/70 bg-white/60 backdrop-blur-xl",
        open
          ? "shadow-[0_12px_40px_-18px_rgba(79,70,229,0.45)] ring-1 ring-primary/15"
          : "shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => (open ? inputRef.current?.focus() : setOpen(true))}
        aria-label="Search"
        className="grid size-11 shrink-0 place-items-center text-slate-500 transition-colors hover:text-primary"
      >
        <Search size={18} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.input
            ref={inputRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "Enter") onSearch?.(value);
            }}
            onBlur={() => {
              if (!value) setOpen(false);
            }}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent pr-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && value && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-label="Clear search"
            className="grid size-11 shrink-0 place-items-center text-slate-400 transition-colors hover:text-slate-700"
          >
            <X size={15} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
