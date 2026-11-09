// The startup tips (#82): how a tips file in Markdown (gui/tips/tips.<lang>.md) becomes tips, and
// which one comes next. Pure, so it can be tested without a browser or the build.

export interface Tip {
  /** Its heading's id: the same in every language. */
  id: string;
  title: string;
  /** One to three lines. */
  body: string;
  /** Its optional image, relative to gui/tips/. */
  image?: { src: string; alt: string };
  /** The docs page that tells more, relative to the site (`guia/chat`, `guia/chat#atajos`). */
  link?: { label: string; page: string };
}

const IMAGE = /^!\[([^\]]*)\]\((img\/[^)\s]+)\)\s*$/;
const LINK = /^\[([^\]]+)\]\(((?:guia|avanzado|casos-de-uso)\/[^)\s]*)\)\s*$/;

/** The tips of a file: one per `##` heading with an `{#id}`. */
export function parseTips(markdown: string): Tip[] {
  return markdown
    .replace(/\r/g, "")
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [heading, ...rest] = block.split("\n");
      const [, title, id] = /^(.*?)\s*\{#([^}]+)\}\s*$/.exec(heading) ?? [];
      const tip: Tip = { id: id ?? "", title: title ?? heading.trim(), body: "" };
      const body: string[] = [];
      for (const line of rest) {
        const image = IMAGE.exec(line);
        const link = LINK.exec(line);
        if (image) tip.image = { alt: image[1], src: image[2] };
        else if (link) tip.link = { label: link[1], page: link[2] };
        else if (line.trim()) body.push(line.trim());
      }
      tip.body = body.join("\n");
      return tip;
    });
}

/** The file for a language: Spanish, or English for every other one. */
export function tipsLanguage(language: string | undefined): "es" | "en" {
  return (language ?? "").slice(0, 2).toLowerCase() === "es" ? "es" : "en";
}

/** A tip's docs page in its language's site (the Spanish one is the root). */
export function tipUrl(page: string, language: "es" | "en"): string {
  return `https://falkenslab.github.io/miyagi/${language === "es" ? "" : "en/"}${page}`;
}

/** The index a saved `tipsNext` means for a list of `total` tips; a stale one wraps round. */
export function tipIndex(tipsNext: number | undefined, total: number): number {
  return total ? (((tipsNext ?? 0) % total) + total) % total : 0;
}
