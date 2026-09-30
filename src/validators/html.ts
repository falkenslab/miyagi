import { existsSync } from "node:fs";
import path from "node:path";
import type { ValidationResult } from "./gift.js";

/**
 * An HTML file uploaded as a Moodle resource: what makes it break or read badly once
 * students open it. A missing viewport made a page unreadable on phones in
 * tests/2026-09-28T15-41-draft-testing; a reference to a file that isn't uploaded with it is
 * a broken image or script. `file` is the HTML file's path, to resolve local references.
 */
export function validateHtml(source: string, file: string): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];
  const lineOf = (index: number) => source.slice(0, index).split("\n").length;

  if (!/<meta[^>]+name\s*=\s*["']?viewport/i.test(source)) {
    errors.push({ line: 1, message: 'no <meta name="viewport" content="width=device-width, initial-scale=1">: on a phone the page shows zoomed out and unreadable' });
  }
  const html = /<html\b[^>]*>/i.exec(source);
  if (!html || !/\slang\s*=/i.test(html[0])) {
    warnings.push({ line: html ? lineOf(html.index) : 1, message: 'no lang on <html> (e.g. <html lang="es">): screen readers read it in the wrong language' });
  }

  const dir = path.dirname(file);
  for (const m of source.matchAll(/<(script|link|img|source|audio|video|iframe|a)\b[^>]*?\s(src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const [, tag, , ref] = m;
    if (/^(https?:)?\/\//i.test(ref)) {
      if (/^(script|link)$/i.test(tag)) {
        warnings.push({ line: lineOf(m.index), message: `<${tag.toLowerCase()}> loaded from another site (${ref}): it may be blocked or change; prefer a copy uploaded with the page` });
      }
      continue;
    }
    if (/^(#|mailto:|tel:|data:|javascript:)/i.test(ref) || tag.toLowerCase() === "a" && !/\.[a-z0-9]{2,5}([?#].*)?$/i.test(ref)) continue;
    const local = path.resolve(dir, decodeURIComponent(ref.split(/[?#]/)[0]));
    if (!existsSync(local)) {
      errors.push({ line: lineOf(m.index), message: `"${ref}" doesn't exist next to the page (${path.relative(dir, local)}): upload it with the page or fix the reference` });
    }
  }
  return { errors, warnings };
}
