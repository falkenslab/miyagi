import { Fragment, type ReactNode } from "react";

// A small markdown renderer for the agent's text: paragraphs, headings, lists, quotes, code
// and tables, with bold, italics, inline code and links. It builds React elements and never
// injects HTML, so nothing the model writes can run in the page.

const INLINE = /(`[^`]+`)|(\*\*(?:[^*]|\*(?!\*))+?\*\*)|(\[[^\]]+\]\(https?:\/\/[^)\s]+\))|(https?:\/\/[^\s<)]+)|((?:^|(?<=[\s(]))\*[^*\s][^*]*?\*(?!\w))|((?:^|(?<=[\s(]))_[^_\s][^_]*?_(?!\w))/g;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [whole, code, bold, link, url, star, under] = match;
    const k = `${key}-${n++}`;
    if (code) out.push(<code key={k}>{code.slice(1, -1)}</code>);
    else if (bold) out.push(<strong key={k}>{inline(bold.slice(2, -2), k)}</strong>);
    else if (link) {
      const [, label, href] = /^\[([^\]]+)\]\((.+)\)$/.exec(link) ?? [];
      out.push(
        <a key={k} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else if (url)
      out.push(
        <a key={k} href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>,
      );
    else if (star || under) out.push(<em key={k}>{(star ?? under).slice(1, -1)}</em>);
    else out.push(whole);
    last = at + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const BLOCK = /^(```|#{1,6}\s|>\s?|\s*([-*+]|\d+[.)])\s|\|)/;
const ITEM = /^\s*([-*+]|\d+[.)])\s/;

export function Markdown({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let i = 0;
  let b = 0;
  while (i < lines.length) {
    const line = lines[i];
    const key = `b${b++}`;
    if (line.startsWith("```")) {
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      i++;
      out.push(
        <pre key={key}>
          <code>{code.join("\n")}</code>
        </pre>,
      );
    } else if (/^#{1,6}\s/.test(line)) {
      out.push(<h4 key={key}>{inline(line.replace(/^#+\s/, ""), key)}</h4>);
      i++;
    } else if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      for (; i < lines.length && /^>\s?/.test(lines[i]); i++) quote.push(lines[i].replace(/^>\s?/, ""));
      out.push(
        <blockquote key={key}>
          <Markdown text={quote.join("\n")} />
        </blockquote>,
      );
    } else if (ITEM.test(line)) {
      const ordered = /^\s*\d/.test(line);
      const items: ReactNode[] = [];
      for (; i < lines.length && ITEM.test(lines[i]); i++) items.push(<li key={`${key}-${i}`}>{inline(lines[i].replace(ITEM, ""), `${key}-${i}`)}</li>);
      out.push(ordered ? <ol key={key} start={Number(/\d+/.exec(line)?.[0] ?? 1)}>{items}</ol> : <ul key={key}>{items}</ul>);
    } else if (/^\|.*\|\s*$/.test(line)) {
      const rows: string[][] = [];
      for (; i < lines.length && /^\|.*\|\s*$/.test(lines[i]); i++) if (!/^\|[\s:|-]+\|\s*$/.test(lines[i])) rows.push(lines[i].trim().slice(1, -1).split("|").map((cell) => cell.trim()));
      out.push(
        <div className="tbl" key={key}>
          <table>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (r === 0 ? <th key={c}>{inline(cell, `${key}-${r}-${c}`)}</th> : <td key={c}>{inline(cell, `${key}-${r}-${c}`)}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (!line.trim()) {
      i++;
    } else {
      const paragraph: string[] = [];
      for (; i < lines.length && lines[i].trim() && !BLOCK.test(lines[i]); i++) paragraph.push(lines[i]);
      if (!paragraph.length) paragraph.push(lines[i++]);
      out.push(
        <p key={key}>
          {paragraph.map((part, p) => (
            <Fragment key={p}>
              {p > 0 && <br />}
              {inline(part, `${key}-${p}`)}
            </Fragment>
          ))}
        </p>,
      );
    }
  }
  return out;
}
