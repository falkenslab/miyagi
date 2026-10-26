import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { enabledExtensions } from "../extensions.js";

/**
 * A visual style for what the exporters write (appearance, #21): an extension's `style/` folder,
 * one HTML template per kind with `{{placeholders}}` the exporter fills. Templates come from
 * anyone (a school's marketplace, the teacher's own extension), so each is made accessible when
 * it's read: real headings in order, emojis hidden from screen readers, no font of its own or
 * background over the classroom's theme, and only colours that contrast. The file isn't changed;
 * what was fixed is said, for the teacher.
 */

export const STYLE_KINDS = ["page", "assignment", "code", "question", "feedback"] as const;
export type StyleKind = (typeof STYLE_KINDS)[number];

/** Where a template's headings start: the classroom titles an activity with its h1, and a quiz's question number is an h3. */
const TOP: Record<StyleKind, number> = { page: 2, assignment: 2, code: 2, question: 4, feedback: 4 };

export interface Template {
  html: string;
  /** Where the headings of `{{body}}` start: one below the template's last heading before it. */
  bodyTop: number;
}

export interface Style {
  name: string;
  templates: Partial<Record<StyleKind, Template>>;
  /** What was fixed in its templates, by file. */
  warnings: string[];
}

/** The appearance that follows the course's theme: no style, the plain accessible HTML. The default. */
export const COURSE_APPEARANCE = "course";

/** The styles this subject can use: each enabled extension with a `style/` folder, by name. */
export async function styleExtensions(workspaceDir: string): Promise<Map<string, string>> {
  const styles = new Map<string, string>();
  for (const ext of await enabledExtensions(workspaceDir).catch(() => [])) {
    const dir = path.join(ext.dir, "style");
    if (existsSync(dir)) styles.set(ext.name, dir);
  }
  return styles;
}

/** A style's templates from its folder (`<extension>/style/`); a kind it doesn't have stays plain. */
export async function loadStyle(name: string, dir: string): Promise<Style> {
  const style: Style = { name, templates: {}, warnings: [] };
  for (const kind of STYLE_KINDS) {
    const raw = await readFile(path.join(dir, `${kind}.html`), "utf8").catch(() => undefined);
    if (raw === undefined) continue;
    const fixed = accessibleTemplate(raw, TOP[kind]);
    style.templates[kind] = fixed.template;
    style.warnings.push(...fixed.warnings.map((warning) => `${kind}.html: ${warning}`));
  }
  return style;
}

/** A template with its placeholders filled; one with no value is left empty. */
export function fill(template: Template, values: Record<string, string>): string {
  return template.html.replace(/\{\{\s*([\w:-]+)\s*\}\}/g, (_, key: string) => values[key] ?? "");
}

// ---------- accessibility ----------

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const EMOJI = /(?:\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)+/gu;
const BOLD = /^(bold|bolder|[6-9]00)$/;

type Decl = [string, string];
const parseStyle = (style: string): Decl[] =>
  style
    .split(";")
    .map((part) => part.split(":"))
    .filter((pair) => pair.length >= 2 && pair[0]!.trim())
    .map(([prop, ...value]) => [prop!.trim().toLowerCase(), value.join(":").trim()]);
const styleText = (decls: Decl[]) => decls.map(([prop, value]) => `${prop}: ${value}`).join("; ");
const valueOf = (decls: Decl[], prop: string) => decls.find(([name]) => name === prop)?.[1];

/** A CSS colour as [r, g, b], for the forms a template writes inline; undefined for any other. */
function rgb(color: string | undefined): [number, number, number] | undefined {
  if (!color) return undefined;
  const value = color.trim().toLowerCase();
  if (value === "white") return [255, 255, 255];
  if (value === "black") return [0, 0, 0];
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
  }
  const parts = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(value);
  return parts ? [Number(parts[1]), Number(parts[2]), Number(parts[3])] : undefined;
}

/** WCAG's contrast ratio between two colours. */
export function contrast(a: [number, number, number], b: [number, number, number]): number {
  const luminance = (c: [number, number, number]) => {
    const [r, g, bl] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

interface Open {
  tag: string;
  /** What it's written as: a heading's level is decided at the end (`miyagi-h<n>`). */
  out: string;
  background: [number, number, number];
}

/** A template made accessible, and what was fixed in it. */
export function accessibleTemplate(raw: string, top: number): { template: Template; warnings: string[] } {
  const warnings = new Set<string>();
  // A paragraph that only holds bold text is a title too.
  const source = raw.replace(/<p(\s[^>]*)?>\s*<(strong|b)>([^<]*)<\/\2>\s*<\/p>/gi, (_, attrs = "", __, text: string) => `<p${attrs} data-miyagi-bold>${text}</p>`);
  const headings: { relative: number | null; original: number }[] = [];
  const stack: Open[] = [];
  let out = "";
  const tokens = source.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+|</g) ?? [];
  for (const token of tokens) {
    if (token.startsWith("<!--")) continue;
    const end = /^<\/([a-zA-Z][\w-]*)/.exec(token);
    if (end) {
      const tag = end[1]!.toLowerCase();
      const index = stack.map((open) => open.tag).lastIndexOf(tag);
      if (index < 0) continue;
      const closed = stack.splice(index);
      out += closed.reverse().map((open) => `</${open.out}>`).join("");
      continue;
    }
    const start = /^<([a-zA-Z][\w-]*)([^>]*?)(\/?)>$/.exec(token);
    if (!start) {
      // Text: an emoji is decoration, read aloud otherwise.
      out += token.replace(EMOJI, (emoji, offset: number, whole: string) => {
        const before = out + whole.slice(0, offset);
        if (/<span aria-hidden="true">\s*$/.test(before)) return emoji;
        warnings.add("an emoji would be read aloud: hidden from screen readers");
        return `<span aria-hidden="true">${emoji}</span>`;
      });
      continue;
    }
    const tag = start[1]!.toLowerCase();
    let attrs = start[2]!;
    let decls = parseStyle(/\sstyle\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ?? "");
    attrs = attrs.replace(/\sstyle\s*=\s*"[^"]*"/i, "");
    const bold = /\sdata-miyagi-bold\b/.test(attrs) || (tag === "p" && BOLD.test(valueOf(decls, "font-weight") ?? ""));
    attrs = attrs.replace(/\sdata-miyagi-bold\b/, "");
    // Its own font and, at the top, its own page: both over the classroom's theme.
    if (decls.some(([prop, value]) => prop === "font-family" && !/monospace/i.test(value))) {
      decls = decls.filter(([prop]) => prop !== "font-family");
      warnings.add("a font of its own (font-family) removed: the classroom's theme sets it");
    }
    if (!stack.length && decls.some(([prop]) => prop === "background" || prop === "background-color")) {
      decls = decls.filter(([prop]) => prop !== "background" && prop !== "background-color");
      warnings.add("a fixed background on the whole content removed: the classroom's theme sets it");
    }
    const background = rgb(valueOf(decls, "background-color") ?? valueOf(decls, "background")) ?? stack.at(-1)?.background ?? [255, 255, 255];
    const color = rgb(valueOf(decls, "color"));
    if (color && contrast(color, background) < 4.5) {
      decls = decls.filter(([prop]) => prop !== "color");
      warnings.add(`a colour without enough contrast removed (${contrast(color, background).toFixed(1)}:1, at least 4.5:1)`);
    }
    let name = tag;
    const level = /^h([1-6])$/.exec(tag);
    if (level || (tag === "p" && bold)) {
      if (!level) warnings.add("a bold paragraph used as a title became a real heading");
      headings.push({ relative: level ? null : headings.length ? 1 : 0, original: level ? Number(level[1]) : 0 });
      name = `miyagi-h${headings.length - 1}`;
    }
    const written = `<${name}${attrs}${decls.length ? ` style="${styleText(decls)}"` : ""}${start[3] ? " /" : ""}>`;
    out += written;
    if (!start[3] && !VOID.has(tag)) stack.push({ tag, out: name, background });
  }
  out += stack.reverse().map((open) => `</${open.out}>`).join("");

  // Headings in order from `top`, never skipping a level; a converted title is one below the first heading.
  const first = headings.find((heading) => heading.relative === null)?.original;
  const levels: number[] = [];
  for (const [index, heading] of headings.entries()) {
    const relative = heading.relative ?? heading.original - (first ?? heading.original);
    const previous = levels[index - 1];
    levels.push(Math.min(6, Math.max(top, Math.min(top + relative, previous === undefined ? top : previous + 1))));
    if (heading.relative === null && levels[index] !== heading.original) warnings.add(`headings renumbered to start at h${top}, in order`);
  }
  const html = out.replace(/(<\/?)miyagi-h(\d+)/g, (_, open: string, index: string) => `${open}h${levels[Number(index)]}`);
  // The body's headings go below the template's last heading before it.
  const beforeBody = html.split(/\{\{\s*body\s*\}\}/)[0]!;
  const last = [...beforeBody.matchAll(/<h([1-6])\b/g)].at(-1)?.[1];
  return { template: { html, bodyTop: last ? Math.min(6, Number(last) + 1) : top }, warnings: [...warnings] };
}
