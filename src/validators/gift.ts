/**
 * A GIFT checker, no Moodle involved: what Moodle's importer would reject, silently
 * misread or mangle, reported with line numbers so the agent can fix the file in drafts/
 * before uploading it. Written from Moodle's GIFT format (questions separated by blank lines,
 * `//` comments, `::name::`, `[format]`, one `{…}` answer block) and from what a real import
 * did: the importer trims every line, so indented code lost its indentation (see
 * tests/2026-09-28T15-41-draft-testing).
 */

export interface Finding {
  line: number;
  message: string;
}

export interface ValidationResult {
  errors: Finding[];
  warnings: Finding[];
}

interface Block {
  text: string;
  /** Line number (1-based) of each character of `text`. */
  lines: number[];
}

const NUMBER = /^-?\d+(\.\d+)?(e-?\d+)?$/i;
const TRUE_FALSE = /^(T|F|TRUE|FALSE)(#[^#]*){0,2}$/is;
const INDENT_FIX =
  "the importer trims every line, so leading spaces or tabs are lost; write the question as [html] and indent with &nbsp; inside <pre> (four &nbsp; per level)";

/** Questions: runs of non-blank lines, without `//` comment lines and `$CATEGORY:` lines. */
function blocks(source: string): Block[] {
  const out: Block[] = [];
  let current: Block | null = null;
  source.split(/\r?\n/).forEach((raw, i) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      current = null;
      return;
    }
    if (trimmed.startsWith("//") || /^\$CATEGORY:/i.test(trimmed)) return;
    if (!current) {
      current = { text: "", lines: [] };
      out.push(current);
    } else {
      current.text += "\n";
      current.lines.push(i + 1);
    }
    current.text += raw;
    for (let k = 0; k < raw.length; k++) current.lines.push(i + 1);
  });
  return out;
}

/** Indexes of `char` in `text` that aren't escaped with a backslash. */
function unescaped(text: string, char: string): number[] {
  const found: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\\") {
      i++;
      continue;
    }
    if (text[i] === char) found.push(i);
  }
  return found;
}

function lineAt(block: Block, index: number): number {
  return block.lines[Math.min(Math.max(index, 0), block.lines.length - 1)] ?? 0;
}

/** Splits an answer block into answers at unescaped `=` / `~` that start an answer. */
function answers(body: string, offset: number, block: Block, errors: Finding[]): { mark: string; text: string; at: number }[] {
  const multiline = body.includes("\n");
  const out: { mark: string; text: string; at: number }[] = [];
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c !== "=" && c !== "~") continue;
    const before = body.slice(0, i);
    const lineStart = before.slice(before.lastIndexOf("\n") + 1);
    const startsAnswer = multiline ? lineStart.trim() === "" : before.trim() === "" || /\s$/.test(before);
    if (!startsAnswer) {
      const line = lineAt(block, offset + i);
      if (errors.some((e) => e.line === line && e.message.startsWith("unescaped"))) continue; // one per line
      const context = body.slice(Math.max(0, i - 15), i + 15).replace(/\s+/g, " ").trim();
      errors.push({
        line,
        message: `unescaped "${c}" inside an answer ("…${context}…"): GIFT reads it as the start of a new answer; write it as \\${c}`,
      });
      continue;
    }
    out.push({ mark: c, text: "", at: offset + i });
  }
  // Each answer's text runs to the next answer's marker.
  const starts = out.map((a) => a.at - offset);
  out.forEach((a, k) => {
    a.text = body.slice(starts[k] + 1, k + 1 < starts.length ? starts[k + 1] : body.length).trim();
  });
  return out;
}

function checkNumerical(body: string, at: number, block: Block, errors: Finding[]): void {
  const spec = body.slice(1).trim();
  const entries = spec.startsWith("=")
    ? spec.split(/(?<!\\)=/).map((e) => e.trim()).filter(Boolean)
    : [spec];
  for (const entry of entries) {
    const value = entry.replace(/^%-?\d+(\.\d+)?%/, "").split(/(?<!\\)#/)[0].trim();
    const [a, b] = value.includes("..") ? value.split("..") : value.split(":");
    const ok = value.includes("..")
      ? NUMBER.test(a.trim()) && NUMBER.test((b ?? "").trim())
      : NUMBER.test(a.trim()) && (b === undefined || NUMBER.test(b.trim()));
    if (!ok) {
      const comma = /\d,\d/.test(value) ? " (decimals go with a point, not a comma)" : "";
      errors.push({
        line: lineAt(block, at),
        message: `malformed numerical answer "${value}"${comma}: use {#value}, {#value:tolerance} or {#min..max}`,
      });
    }
  }
}

function checkChoices(list: { mark: string; text: string; at: number }[], block: Block, errors: Finding[], warnings: Finding[]): void {
  const weightOf = (text: string): number | null => {
    const m = /^%(-?\d+(?:\.\d+)?)%/.exec(text);
    return m ? Number(m[1]) : null;
  };
  for (const a of list) {
    const w = weightOf(a.text);
    if (w !== null && (w < -100 || w > 100)) {
      errors.push({ line: lineAt(block, a.at), message: `weight ${w}% is outside -100…100` });
    }
    const hashes = unescaped(a.text.replace(/####.*$/s, ""), "#");
    if (hashes.length > 1) {
      errors.push({ line: lineAt(block, a.at), message: `more than one unescaped "#" in an answer: the first starts its feedback; write a literal # as \\#` });
    }
  }
  const isChoice = list.some((a) => a.mark === "~");
  if (!isChoice) {
    const pairs = list.filter((a) => /(?<!\\)->/.test(a.text));
    if (pairs.length > 0 && pairs.length < list.length) {
      errors.push({ line: lineAt(block, list[0].at), message: 'matching question with answers that have no "->"' });
    } else if (pairs.length > 0 && pairs.length < 3) {
      warnings.push({ line: lineAt(block, list[0].at), message: "matching question with fewer than 3 pairs: Moodle needs at least 2 questions and 3 answers" });
    }
    return;
  }
  const right = list.filter((a) => a.mark === "=");
  const weights = list.map((a) => weightOf(a.text)).filter((w): w is number => w !== null);
  const positive = weights.filter((w) => w > 0);
  if (right.length === 0 && positive.length === 0) {
    errors.push({ line: lineAt(block, list[0].at), message: 'multiple choice with no right answer: mark it with "=" (or give partial weights like ~%50%)' });
  }
  if (right.length > 1) {
    errors.push({
      line: lineAt(block, right[1].at),
      message: 'multiple choice with several "=" answers: only one can be right; for several right answers use ~%50% style weights, or escape a literal = as \\=',
    });
  }
  if (right.length === 0 && positive.length > 0) {
    const sum = positive.reduce((s, w) => s + w, 0);
    if (Math.abs(sum - 100) > 0.5) {
      warnings.push({ line: lineAt(block, list[0].at), message: `the right answers' weights add up to ${sum}%, not 100%` });
    }
  }
}

/** Lines of a question (after its first) that start with spaces or tabs and would lose them. */
function checkIndentation(block: Block, html: boolean, answerStart: number, errors: Finding[]): void {
  const rows = block.text.split("\n");
  let offset = rows[0].length + 1;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const start = offset;
    offset += row.length + 1;
    if (!/^[ \t]+\S/.test(row)) continue;
    const trimmed = row.trim();
    // Indented answers ("  =right", "  ~wrong") are normal: the markers are what count there.
    if (start > answerStart && answerStart >= 0 && /^[=~#}]/.test(trimmed)) continue;
    const before = block.text.slice(0, start);
    const inPre = (before.match(/<pre\b/gi)?.length ?? 0) > (before.match(/<\/pre>/gi)?.length ?? 0);
    if (html && !inPre) continue;
    errors.push({ line: block.lines[start] ?? 0, message: `indentation will be lost ("${trimmed.slice(0, 40)}"): ${INDENT_FIX}` });
  }
}

export function validateGift(source: string): ValidationResult {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const names = new Map<string, number>();

  for (const block of blocks(source)) {
    let text = block.text;
    let pos = 0;
    const first = block.lines[0] ?? 0;

    const lead = text.length - text.trimStart().length;
    if (text.trimStart().startsWith("::")) {
      const close = unescaped(text, ":").filter((i) => i > lead + 1 && text[i + 1] === ":")[0];
      if (close === undefined) {
        errors.push({ line: first, message: 'question name opened with "::" but never closed' });
        continue;
      }
      const name = text.slice(lead + 2, close).trim();
      if (names.has(name)) {
        errors.push({ line: first, message: `question name "${name}" repeated (first on line ${names.get(name)}): names must be unique` });
      } else {
        names.set(name, first);
      }
      pos = close + 2;
    }
    const format = /^\s*\[(html|moodle|plain|markdown)\]/i.exec(text.slice(pos));
    const html = format?.[1].toLowerCase() === "html";
    text = block.text;

    const opens = unescaped(text, "{").filter((i) => i >= pos);
    const closes = unescaped(text, "}").filter((i) => i >= pos);
    if (opens.length !== closes.length || opens.length > 1 || (opens.length === 1 && closes[0] < opens[0])) {
      const where = opens[1] ?? closes[1] ?? opens[0] ?? closes[0] ?? 0;
      errors.push({
        line: lineAt(block, where),
        message:
          opens.length > 1 || closes.length > 1
            ? 'more than one "{…}" in a question: a literal brace must be escaped as \\{ or \\} (and a blank line always ends a question)'
            : 'unbalanced "{ }": every question has one answer block; escape a literal brace as \\{ or \\}',
      });
      continue;
    }
    if (opens.length === 0) {
      checkIndentation(block, html, -1, errors);
      continue; // a description, no answers
    }

    const bodyStart = opens[0] + 1;
    const body = text.slice(bodyStart, closes[0]);
    const trimmedBody = body.trim();
    checkIndentation(block, html, opens[0], errors);

    if (trimmedBody === "") continue; // essay
    if (trimmedBody.startsWith("#")) {
      checkNumerical(trimmedBody, bodyStart, block, errors);
      continue;
    }
    if (TRUE_FALSE.test(trimmedBody)) continue;
    const list = answers(body, bodyStart, block, errors);
    if (list.length === 0) {
      errors.push({ line: lineAt(block, bodyStart), message: 'answer block with no answers: start each one with "=" (right) or "~" (wrong)' });
      continue;
    }
    checkChoices(list, block, errors, warnings);
  }
  return { errors, warnings };
}
