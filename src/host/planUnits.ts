/**
 * The units of a teaching plan (`course/teaching-plan`), read from its markdown so the topics view
 * lists every unit the plan has, whether the agent made its topic page or not (#74): the first
 * table with a row per unit, its first column the unit's number (`1`, `UT1`, `U2`…), and either a
 * row linking to a topic page or a header naming a unit or a title (so the objectives' table,
 * `O1`, `O2`…, isn't taken for it). The title is
 * the cell that links to a topic page, else the column headed as one (título, title…), else the
 * second; the rest of the row is kept as the unit's details. Rows without a number (a total, a
 * make-up period) aren't units. A section on the units wins over any other table, and its units
 * may be bullet points linking to their topics (#90).
 */
export interface PlanUnit {
  number: string;
  title: string;
  /** The topic page the row links to, as a page id (`topic/<slug>`). */
  topic: string | null;
  /** The other cells, as "Header: value", for the card. */
  details: string;
}

const TITLE_HEADER = /t[íi]tulo|title|titre|titel|nombre|name|unidad|unit\b/i;
const UNIT_HEADER = /^(?:ut|u|ud|unidad|unidades|unit|units|unité|einheit|tema|topic|thème|thema)\b/i;
const UNITS_HEADING = /^#{1,3}\s+(?:\d+\.?\s*)?(?:temas?|unidades?(?:\s+did[áa]cticas?)?|units?|topics?|th[èe]mes?|unit[ée]s?|themen|einheiten)\s*(?:\[[^\]]*\])?\s*$/i;
const NUMBERED_TITLE = /^\p{L}{1,10}\.?\s*\d+\s*[.:–—-]\s*/u;
const TOPIC_LINK = /\]\((?:topics?\/)([a-z0-9]+(?:-[a-z0-9]+)*)(?:\.md)?(?:#[^)]*)?\)/;

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

/** A cell as plain text: links by their text, no emphasis nor code marks. */
const plain = (cell: string) =>
  cell
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** The lines of the plan's own section on its units, when it has one. */
function unitsSection(lines: string[]): { start: number; end: number } | undefined {
  const start = lines.findIndex((line) => UNITS_HEADING.test(line));
  if (start < 0) return undefined;
  const level = /^#+/.exec(lines[start]!)![0].length;
  const next = lines.findIndex((line, index) => index > start && /^#+\s/.test(line) && /^#+/.exec(line)![0].length <= level);
  return { start, end: next < 0 ? lines.length : next };
}

/** The units a section lists as bullet points, each linking to its topic page (#90). */
function listedUnits(lines: string[]): PlanUnit[] {
  const items = lines.filter((line) => /^\s*[-*]\s/.test(line) && TOPIC_LINK.test(line));
  return items.map((line, index) => {
    const link = /\[([^\]]+)\]\([^)]*\)/.exec(line)!;
    const named = plain(link[1]!);
    const number = /\d+/.exec(named)?.[0] ?? String(index + 1);
    const after = plain(line.slice(link.index + link[0].length)).replace(/^[\s,.:;·–—-]+/, "");
    return { number, title: named.replace(NUMBERED_TITLE, "") || named, topic: `topic/${TOPIC_LINK.exec(line)![1]}`, details: after };
  });
}

export function planUnits(markdown: string): PlanUnit[] {
  const lines = markdown.split(/\r?\n/);
  const section = unitsSection(lines);
  const listed = section ? listedUnits(lines.slice(section.start, section.end)) : [];
  if (listed.length >= 2) return listed;
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!lines[i]!.trim().startsWith("|") || !/^\s*\|?\s*:?-{3,}/.test(lines[i + 1]!)) continue;
    const header = cells(lines[i]!).map(plain);
    const rows: string[][] = [];
    let j = i + 2;
    for (; j < lines.length && lines[j]!.trim().startsWith("|"); j++) rows.push(cells(lines[j]!));
    const units = rows.filter((row) => /^(?:[A-Za-z]{1,3}\.?\s*)?\d+$/.test(plain(row[0] ?? "")));
    const unitTable =
      units.some((row) => row.some((cell) => TOPIC_LINK.test(cell))) || (UNIT_HEADER.test(header[0] ?? "") && (!section || (i > section.start && i < section.end))) || header.some((name, index) => index > 0 && TITLE_HEADER.test(name));
    if (units.length >= 2 && unitTable) {
      const titleColumn = Math.max(1, header.findIndex((name, index) => index > 0 && TITLE_HEADER.test(name)));
      return units.map((row) => {
        const linked = row.findIndex((cell, index) => index > 0 && TOPIC_LINK.test(cell));
        const column = linked > 0 ? linked : titleColumn;
        const slug = TOPIC_LINK.exec(row[column] ?? "")?.[1];
        // A linked title is the link's text: what follows it in the cell is a note on the unit.
        const title = plain(/\[([^\]]+)\]\([^)]*\)/.exec(row[column] ?? "")?.[1] ?? row[column] ?? "");
        const details = row
          .map((cell, index) => (index === 0 || index === column || !plain(cell) || plain(cell) === "—" ? "" : header[index] ? `${header[index]}: ${plain(cell)}` : plain(cell)))
          .filter(Boolean)
          .join(" · ");
        return { number: plain(row[0]!), title, topic: slug ? `topic/${slug}` : null, details };
      });
    }
    i = j;
  }
  return [];
}
