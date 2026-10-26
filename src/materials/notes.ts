import { existsSync } from "node:fs";
import path from "node:path";
import { marked, Renderer, type Token, type Tokens } from "marked";
import { validateHtml } from "../validators/html.js";
import { splitFrontmatter } from "./frontmatter.js";
import { finding, type Finding, type Parsed } from "./model.js";

/**
 * A unit's notes, `<slug>.notes.md` (ADR-015): Markdown the teacher reads and edits, published as
 * a page or as a book (one chapter per `##`). The exporter writes accessible HTML by code: the
 * headings start under the classroom's own title, code keeps its indentation, every image has its
 * alternative text and travels with the page, a link says where it goes. The output is checked
 * with the HTML validator, as a fragment of the classroom's page.
 *
 *     ---
 *     title: Variables y tipos
 *     as: page                     # page (default) or book
 *     ---
 *     Una **variable** es…
 */

export interface Chapter {
  title: string;
  markdown: string;
}

export interface Notes {
  kind: "notes";
  title: string;
  as: "page" | "book";
  /** A page's whole text; a book's text before its first chapter (its introduction). */
  markdown: string;
  chapters: Chapter[];
}

const VAGUE_LINK = /^(aquí|aqui|here|click here|pincha aquí|haz clic aquí|enlace|link|este enlace|this link|ici|hier|más|more)$/i;

/** The checks on what Markdown says, before any HTML: alt texts, link texts, headings in order, local images. */
function checkTokens(tokens: Token[], firstLine: number, dir: string | undefined, errors: Finding[], warnings: Finding[]): void {
  let line = firstLine;
  let lastDepth = 0;
  const walk = (list: Token[], at: number) => {
    for (const token of list) {
      if (token.type === "image") {
        const image = token as Tokens.Image;
        if (!image.text.trim()) errors.push(finding(at, `the image ${image.href} has no alternative text: ![what it shows](${image.href})`));
        if (dir && !/^(https?:|data:)/i.test(image.href) && !existsSync(path.resolve(dir, decodeURIComponent(image.href)))) errors.push(finding(at, `the image ${image.href} isn't next to the notes`));
      }
      if (token.type === "link") {
        const link = token as Tokens.Link;
        if (VAGUE_LINK.test(link.text.trim())) warnings.push(finding(at, `the link "${link.text}" doesn't say where it goes: its text should (the page's or document's name)`));
        if (link.text.trim() === link.href) warnings.push(finding(at, `a bare address (${link.href}): give the link a text that says where it goes`));
      }
      if (token.type === "html" && !/^<!--/.test((token as Tokens.HTML).text.trim())) warnings.push(finding(at, "raw HTML in the notes isn't checked and may not reach students as written: use Markdown"));
      const children = (token as { tokens?: Token[] }).tokens;
      if (children) walk(children, at);
      if (token.type === "list") for (const item of (token as Tokens.List).items) walk(item.tokens, at);
      if (token.type === "table") {
        const table = token as Tokens.Table;
        for (const cell of [...table.header, ...table.rows.flat()]) walk(cell.tokens, at);
      }
    }
  };
  for (const token of tokens) {
    if (token.type === "heading") {
      const depth = (token as Tokens.Heading).depth;
      if (lastDepth && depth > lastDepth + 1) warnings.push(finding(line, `the heading "${(token as Tokens.Heading).text}" skips a level (## to ####): screen readers navigate by them`));
      lastDepth = depth;
    }
    walk([token], line);
    line += (token.raw.match(/\n/g) ?? []).length;
  }
}

export function parseNotes(source: string, file?: string): Parsed<Notes> {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const { data, body, bodyLine, error } = splitFrontmatter(source);
  if (error) errors.push(finding(1, `the frontmatter isn't valid YAML: ${error}`));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) errors.push(finding(1, `the frontmatter needs a "title"`));
  const as = String(data.as ?? "page").toLowerCase();
  if (as !== "page" && as !== "book") errors.push(finding(1, `"as" is page or book, not "${String(data.as)}"`));
  const tokens = marked.lexer(body);
  checkTokens(tokens, bodyLine, file ? path.dirname(file) : undefined, errors, warnings);
  if (tokens.some((token) => token.type === "heading" && (token as Tokens.Heading).depth === 1)) warnings.push(finding(bodyLine, "a # heading repeats the title: the classroom shows the title already; start at ##"));

  // A book's chapters: each ## and what follows, until the next.
  const chapters: Chapter[] = [];
  let intro = "";
  if (as === "book") {
    let current: Chapter | null = null;
    for (const token of tokens) {
      if (token.type === "heading" && (token as Tokens.Heading).depth === 2) {
        current = { title: (token as Tokens.Heading).text.trim(), markdown: "" };
        chapters.push(current);
      } else if (current) current.markdown += token.raw;
      else intro += token.raw;
    }
    if (!chapters.length) errors.push(finding(bodyLine, "a book needs its chapters, each starting with a ## heading"));
    for (const chapter of chapters) chapter.markdown = chapter.markdown.trim();
  }
  if (!body.trim()) errors.push(finding(bodyLine, "the notes are empty"));
  return { material: { kind: "notes", title, as: as === "book" ? "book" : "page", markdown: as === "book" ? intro.trim() : body.trim(), chapters }, findings: { errors, warnings } };
}

/** A code block's HTML from its escaped text and its language: a style's (style.ts) or the plain one. */
export type CodeBlock = (escaped: string, language: string) => string;

export const escapeHtml = (text: string) => text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
export const plainCode: CodeBlock = (escaped, language) => `<pre${language ? ` data-language="${language}"` : ""}><code>${escaped}</code></pre>\n`;

/** Markdown to accessible HTML: headings shifted to start at `top`, code without classes, tables with column headers. */
export function accessibleHtml(markdown: string, top: number, code: CodeBlock = plainCode): string {
  const tokens = marked.lexer(markdown);
  const depths = tokens.filter((token) => token.type === "heading").map((token) => (token as Tokens.Heading).depth);
  const shift = depths.length ? top - Math.min(...depths) : 0;
  const renderer = new Renderer();
  renderer.heading = function ({ tokens: inner, depth }) {
    const level = Math.min(6, Math.max(top, depth + shift));
    return `<h${level}>${this.parser.parseInline(inner)}</h${level}>\n`;
  };
  renderer.code = ({ text, lang }) => code(escapeHtml(text), (lang ?? "").replace(/[^\w-]/g, ""));
  const html = marked.parser(tokens, { renderer });
  return html.replace(/<th>/g, '<th scope="col">').replace(/<th align="(\w+)">/g, '<th scope="col" style="text-align:$1">');
}

/** The files a page's images point to on this computer: what goes up with it. */
export function localImages(markdown: string): string[] {
  const out: string[] = [];
  marked.walkTokens(marked.lexer(markdown), (token) => {
    if (token.type === "image" && !/^(https?:|data:)/i.test((token as Tokens.Image).href)) out.push(decodeURIComponent((token as Tokens.Image).href));
  });
  return [...new Set(out)];
}

/** Checks an exported fragment as the classroom will show it (references next to it, no broken ones). */
export function checkExported(html: string, file: string): Finding[] {
  return validateHtml(html, file, { fragment: true }).errors;
}
