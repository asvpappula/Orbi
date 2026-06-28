"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUpInView } from "./motion";

type Testimonial = { quote: string; name: string; role: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Finally I don't miss assignment deadlines buried in Canvas",
    name: "Maya R.",
    role: "CS Student",
  },
  {
    quote: "The AI reply feature saves me 30 min a day on emails",
    name: "Jordan K.",
    role: "Founder",
  },
  {
    quote: "Connected my GitHub and Slack for my internship — game changer",
    name: "Priya S.",
    role: "SWE Intern",
  },
  {
    quote:
      "Cross-app context is insane. Saw my Canvas assignment and prof email in one view",
    name: "Alex T.",
    role: "Pre-med",
  },
  {
    quote: "Orbi replaced four tabs I had open every morning",
    name: "Sam W.",
    role: "Product Manager",
  },
  {
    quote: "The calendar view with all my deadlines in one place is everything",
    name: "Keisha M.",
    role: "Biology Student",
  },
  {
    quote:
      "Finally an inbox that understands I'm a student AND running a startup",
    name: "Dev P.",
    role: "Founder",
  },
  {
    quote: "Reply drafts sound exactly like me. My professor had no idea",
    name: "Chris L.",
    role: "Junior",
  },
];

const ROW_ONE = TESTIMONIALS.slice(0, 4);
const ROW_TWO = TESTIMONIALS.slice(4);

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=random&color=fff&size=64`;
}

function Card({ quote, name, role }: Testimonial) {
  return (
    <figure className="mr-5 flex w-[340px] shrink-0 flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.25)] ring-1 ring-slate-100">
      <blockquote className="text-[15px] leading-relaxed text-slate-700">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl(name)}
          alt={name}
          width={48}
          height={48}
          loading="lazy"
          className="size-12 rounded-full"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      id="testimonials"
      {...fadeUpInView(reduce)}
      className="scroll-mt-24 overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Testimonials
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Loved by students and founders
        </h2>
      </div>

      <div className="mt-14 space-y-5">
        <div className="group flex overflow-hidden">
          <div className="flex w-max animate-scroll-left group-hover:[animation-play-state:paused]">
            {[...ROW_ONE, ...ROW_ONE].map((t, i) => (
              <Card key={`row1-${i}`} {...t} />
            ))}
          </div>
        </div>
        <div className="group flex overflow-hidden">
          <div className="flex w-max animate-scroll-right group-hover:[animation-play-state:paused]">
            {[...ROW_TWO, ...ROW_TWO].map((t, i) => (
              <Card key={`row2-${i}`} {...t} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
