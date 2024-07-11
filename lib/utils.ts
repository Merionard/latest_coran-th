import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanTashkeel = (text: string) => {
  let ayatWhitoutHarakts = text.replace(/[ؐ-ًؕ-ٖٓ-ٟۖ-ٰٰۭ]/g, "");
  ayatWhitoutHarakts = ayatWhitoutHarakts.replace(/(آ|إ|أ|ٱ)/g, "ا");
  ayatWhitoutHarakts = ayatWhitoutHarakts.replace(/(ة)/g, "ه");
  ayatWhitoutHarakts = ayatWhitoutHarakts.replace(/(ئ|ؤ)/g, "ء");
  ayatWhitoutHarakts = ayatWhitoutHarakts.replace(/(ى)/g, "ي");
  return ayatWhitoutHarakts;
};
