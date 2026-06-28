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

function Card({ quote, name, role }: Testimonial) {
  return (
    <figure className="mr-4 w-[320px] shrink-0 rounded-2xl bg-[#fafafa] px-6 py-5 ring-1 ring-black/5">
      <blockquote className="text-sm leading-relaxed text-slate-600">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-xs font-medium text-slate-400">
        — {name}, {role}
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
      className="scroll-mt-24 overflow-hidden bg-white py-32 sm:py-40"
    >
      <h2 className="mb-12 px-6 text-4xl font-bold tracking-tight text-slate-900">
        People who let Orbi run their week.
      </h2>

      <div className="space-y-4">
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
