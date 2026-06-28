import type { Transition } from "framer-motion";

/**
 * Shared entrance-animation props for the landing page. Each helper returns
 * an empty object when the user prefers reduced motion, so spreading it onto a
 * `motion.*` element falls back to an instant, static render.
 */

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Fade + slide up on load (cascade with an increasing `delay`). */
export function fadeUp(reduce: boolean, delay = 0) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  };
}

/** Fade + slide up when scrolled into view (fires once). */
export function fadeUpInView(reduce: boolean, delay = 0) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, delay, ease: EASE },
  };
}
