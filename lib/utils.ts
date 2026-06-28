import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts (shadcn / 21st.dev convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
