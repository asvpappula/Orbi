"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ContextData } from "./data";

const TONES = ["Casual", "Professional", "Short", "Detailed"] as const;
type Tone = (typeof TONES)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AiReplyComposer({
  open,
  onClose,
  thread,
  initialReply,
}: {
  open: boolean;
  onClose: () => void;
  thread?: ContextData["thread"];
  initialReply: string;
}) {
  const [tone, setTone] = useState<Tone>("Casual");
  const [draft, setDraft] = useState(initialReply);
  const [sent, setSent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generate = useCallback(async (nextTone: Tone) => {
    if (!thread) return;
    setGenerating(true);
    setError("");
    setDraft("");
    try {
      const response = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: thread.preview,
          subject: thread.subject,
          recipient: thread.from,
          tone: nextTone.toLowerCase(),
        }),
      });
      if (!response.ok || !response.body) throw new Error("Could not draft a reply");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setDraft((current) => current + decoder.decode(value, { stream: true }));
      }
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : "Could not draft a reply");
      setDraft(initialReply);
    } finally {
      setGenerating(false);
    }
  }, [initialReply, thread]);

  useEffect(() => {
    if (!open) return;
    setDraft(initialReply);
    setTone("Casual");
    setSent(false);
    setError("");
    void generate("Casual");
  }, [open, initialReply, generate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function pickTone(t: Tone) {
    setTone(t);
    void generate(t);
  }

  async function send() {
    if (!thread?.fromEmail) {
      setError("No Gmail recipient was found for this item");
      return;
    }
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/integrations/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: thread.fromEmail,
          subject: thread.subject.startsWith("Re:") ? thread.subject : `Re: ${thread.subject}`,
          body: draft,
          threadId: thread.threadId,
        }),
      });
      if (!response.ok) throw new Error("Could not send reply");
      setSent(true);
      window.setTimeout(onClose, 1500);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="AI Reply Composer"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="glass relative w-full max-w-lg rounded-[24px] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h2 className="text-sm font-bold text-slate-900">
                  AI Reply Composer
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid size-7 place-items-center rounded-full bg-white/70 text-slate-400 transition hover:text-slate-700"
              >
                <X size={15} />
              </button>
            </div>

            {sent ? (
              <div className="grid place-items-center py-14 text-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600"
                >
                  <Check size={24} strokeWidth={3} />
                </motion.span>
                <p className="mt-4 font-semibold text-slate-900">
                  Sent to {thread?.from ?? "recipient"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Your reply is on its way.
                </p>
              </div>
            ) : (
              <>
                {thread && (
                  <div className="mt-4 rounded-2xl border border-white/70 border-l-4 border-l-rose-400 bg-white/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                          {initials(thread.from)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {thread.from}{" "}
                            <span className="font-normal text-slate-400">
                              · Gmail
                            </span>
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {thread.subject}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">
                        40m ago
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      &ldquo;{thread.preview}&rdquo;
                    </p>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles size={13} /> Orbi drafted this in your voice
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    based on 47 of your past emails
                  </span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  placeholder={generating ? "Orbi is drafting…" : "Write a reply…"}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/80 bg-white/70 p-4 text-sm leading-relaxed text-slate-700 outline-none transition focus:ring-2 focus:ring-primary/20"
                />

                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Tone
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => pickTone(t)}
                      disabled={generating}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                        tone === t
                          ? "bg-primary text-white shadow shadow-indigo-200"
                          : "border border-slate-200 bg-white/70 text-slate-600 hover:border-primary/40 hover:text-primary",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={send}
                    disabled={generating || sending || !draft.trim()}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                  >
                    <Send size={15} /> {sending ? "Sending…" : "Confirm & Send"}
                  </button>
                  <button
                    onClick={() => textareaRef.current?.focus()}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-full px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
                  >
                    Discard
                  </button>
                </div>
                {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
