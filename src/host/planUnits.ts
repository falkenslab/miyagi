/**
 * The units of a teaching plan (`course/teaching-plan`), read from its markdown so the topics view
 * lists every unit the plan has, whether the agent made its topic page or not (#74): the first
 * table with a row per unit, its first column the unit's number (`1`, `UT1`, `U2`…), and either a
 * row linking to a topic page or a header naming a unit or a title (so the objectives' table,
 * `O1`, `O2`…, isn't taken for it). The title is
 * the cell that links to a topic page, else the column headed as one (título, title…), else the
 * second; the rest of the row is kept as the unit's details. Rows without a number (a total, a
 * make-up period) aren't units.
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

export function planUnits(markdown: string): PlanUnit[] {
  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!lines[i]!.trim().startsWith("|") || !/^\s*\|?\s*:?-{3,}/.test(lines[i + 1]!)) continue;
    const header = cells(lines[i]!).map(plain);
    const rows: string[][] = [];
    let j = i + 2;
    for (; j < lines.length && lines[j]!.trim().startsWith("|"); j++) rows.push(cells(lines[j]!));
    const units = rows.filter((row) => /^(?:[A-Za-z]{1,3}\.?\s*)?\d+$/.test(plain(row[0] ?? "")));
    const unitTable =
      units.some((row) => row.some((cell) => TOPIC_LINK.test(cell))) || UNIT_HEADER.test(header[0] ?? "") || header.some((name, index) => index > 0 && TITLE_HEADER.test(name));
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
