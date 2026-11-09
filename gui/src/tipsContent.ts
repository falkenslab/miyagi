import { parseTips, tipsLanguage, type Tip } from "./tips";
import en from "../tips/tips.en.md?raw";
import es from "../tips/tips.es.md?raw";

// The tips as the page ships them: the Markdown files and their images, bundled by Vite.

const images = import.meta.glob("../tips/img/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const parsed = { es: parseTips(es), en: parseTips(en) };

/** The tips for a language code. */
export function tipsFor(language: string | undefined): { tips: Tip[]; language: "es" | "en" } {
  const lang = tipsLanguage(language);
  return { tips: parsed[lang], language: lang };
}

/** An image's address in the built page. */
export const tipImage = (src: string): string | undefined => images[`../tips/${src}`];
