"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type CardStackItem = {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  href: string;
};

/** How many cards peek behind the front card. */
const VISIBLE = 3;

export function CardStack({
  items,
  interval = 3500,
}: {
  items: CardStackItem[];
  interval?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const [cards, setCards] = useState(items);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setCards(items);
  }, [items]);

  const advance = () =>
    setCards((prev) =>
      prev.length <= 1 ? prev : [...prev.slice(1), prev[0]],
    );

  useEffect(() => {
    if (reduce || paused || cards.length <= 1) return;
    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  }, [reduce, paused, interval, cards.length]);

  return (
    <div
      className="relative mx-auto h-[440px] w-full max-w-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {cards.map((card, index) => {
        const isFront = index === 0;
        const hidden = index > VISIBLE;
        return (
          <motion.a
            key={card.id}
            href={card.href}
            aria-hidden={!isFront}
            tabIndex={isFront ? 0 : -1}
            onClick={(event) => {
              if (!isFront) {
                event.preventDefault();
                advance();
              }
            }}
            className="absolute inset-x-6 top-0 block overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 ring-1 ring-black/5"
            style={{ zIndex: cards.length - index }}
            initial={false}
            animate={{
              y: index * 18,
              scale: 1 - index * 0.05,
              opacity: hidden ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.imageSrc}
              alt={card.title}
              loading="lazy"
              className="h-52 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {card.description}
              </p>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
