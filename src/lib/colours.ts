/**
 * Project colour palette – SINGLE SOURCE OF TRUTH
 * Edit src/lib/colours.json – changes apply everywhere after dev/build.
 *
 * Tailwind: bg-colour1, text-colour3, border-colour2, etc.
 * JS/TS: import { colours } from "@/lib/colours"
 */
import palette from "./colours.json";

export const colours = palette as {
  colour1: string;
  colour2: string;
  colour3: string;
  colour4: string;
};
