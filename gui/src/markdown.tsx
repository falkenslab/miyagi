import { Fragment, type MouseEvent, type ReactNode } from "react";

// A small markdown renderer for the agent's text: paragraphs, headings, lists, quotes, code
// and tables, with bold, italics, inline code and links. It builds React elements and never
// injects HTML, so nothing the model writes can run in the page. A knowledge base page's links
// to other pages (`[Bowline](concept/bowline)`) work only where the view passes `onPage`; with
// its `has`, so do the subject's items named in the chat (#66), as links or as inline code
// (`sources/plan.pdf`): the ones `has` knows open, the rest stay text.

/** Where a link goes instead of a new window: the desktop app's browser (#86), set by the page; Ctrl+click still leaves. */
let openLink: ((url: string) => void) | null = null;
export const setOpenLink = (open: typeof openLink) => {
  openLink = open;
};
const followLink = (event: MouseEvent, url: string) => {
  if (!openLink || event.ctrlKey || event.metaKey || event.shiftKey || event.button) return;
  event.preventDefault();
  openLink(url);
};

type OnPage = (((target: string) => void) & { has?: (target: string) => boolean }) | undefined;

const PAGE_ID = /^[a-z][a-z0-9-]*\/[\w-]+$/;
const opens = (onPage: OnPage, target: string) => Boolean(onPage && (onPage.has ? onPage.has(target) : PAGE_ID.test(target)));

const INLINE = /(`[^`]+`)|(\*\*(?:[^*]|\*(?!\*))+?\*\*)|(\[[^\]]+\]\((?:https?:\/\/[^)\s]+|[\w.-]+(?:\/[\w.%-]+)+)\))|(https?:\/\/[^\s<)]+)|((?:^|(?<=[\s(]))\*[^*\s][^*]*?\*(?!\w))|((?:^|(?<=[\s(]))_[^_\s][^_]*?_(?!\w))/g;

function inline(text: string, key: string, onPage?: OnPage): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [whole, code, bold, link, url, star, under] = match;
    const k = `${key}-${n++}`;
    if (code) {
      const target = code.slice(1, -1);
      out.push(
        opens(onPage, target) ? (
          <a key={k} href={`#${target}`} className="page-link" onClick={(event) => (event.preventDefault(), onPage!(target))}>
            <code>{target}</code>
          </a>
        ) : (
          <code key={k}>{target}</code>
        ),
      );
    }
    else if (bold) out.push(<strong key={k}>{inline(bold.slice(2, -2), k, onPage)}</strong>);
    else if (link) {
      const [, label, href] = /^\[([^\]]+)\]\((.+)\)$/.exec(link) ?? [];
      if (!/^https?:/.test(href)) {
        out.push(
          opens(onPage, href) ? (
            <a key={k} href={`#${href}`} className="page-link" onClick={(event) => (event.preventDefault(), onPage!(href))}>
              {label}
            </a>
          ) : (
            label
          ),
        );
        last = at + whole.length;
        continue;
      }
      out.push(
        <a key={k} href={href} target="_blank" rel="noopener noreferrer" onClick={(event) => followLink(event, href)}>
          {label}
        </a>,
      );
    } else if (url)
      out.push(
        <a key={k} href={url} target="_blank" rel="noopener noreferrer" onClick={(event) => followLink(event, url)}>
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

const indentOf = (line: string) => /^\s*/.exec(line)![0].length;

/**
 * A list from line `start`, and the line after it: its items, and the items indented under one
 * as a list of their own inside it (the options of a numbered point stayed numbered with it).
 */
function list(lines: string[], start: number, key: string, onPage?: OnPage): [ReactNode, number] {
  const indent = indentOf(lines[start]);
  const ordered = /^\s*\d/.test(lines[start]);
  const items: { at: number; text: string; nested: ReactNode[] }[] = [];
  let i = start;
  while (i < lines.length && ITEM.test(lines[i]) && indentOf(lines[i]) >= indent) {
    if (indentOf(lines[i]) > indent && items.length) {
      const [nested, next] = list(lines, i, `${key}-${i}`, onPage);
      items[items.length - 1].nested.push(nested);
      i = next;
      continue;
    }
    items.push({ at: i, text: lines[i].replace(ITEM, ""), nested: [] });
    i++;
  }
  const lis = items.map((item) => (
    <li key={`${key}-${item.at}`}>
      {inline(item.text, `${key}-${item.at}`, onPage)}
      {item.nested}
    </li>
  ));
  return [ordered ? <ol key={key} start={Number(/\d+/.exec(lines[start])?.[0] ?? 1)}>{lis}</ol> : <ul key={key}>{lis}</ul>, i];
}

export function Markdown({ text, onPage }: { text: string; onPage?: OnPage }): ReactNode {
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
      out.push(<h4 key={key}>{inline(line.replace(/^#+\s/, ""), key, onPage)}</h4>);
      i++;
    } else if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      for (; i < lines.length && /^>\s?/.test(lines[i]); i++) quote.push(lines[i].replace(/^>\s?/, ""));
      out.push(
        <blockquote key={key}>
          <Markdown text={quote.join("\n")} onPage={onPage} />
        </blockquote>,
      );
    } else if (ITEM.test(line)) {
      const [node, next] = list(lines, i, key, onPage);
      out.push(node);
      i = next;
    } else if (/^\|.*\|\s*$/.test(line)) {
      const rows: string[][] = [];
      for (; i < lines.length && /^\|.*\|\s*$/.test(lines[i]); i++) if (!/^\|[\s:|-]+\|\s*$/.test(lines[i])) rows.push(lines[i].trim().slice(1, -1).split("|").map((cell) => cell.trim()));
      out.push(
        <div className="tbl" key={key}>
          <table>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (r === 0 ? <th key={c}>{inline(cell, `${key}-${r}-${c}`, onPage)}</th> : <td key={c}>{inline(cell, `${key}-${r}-${c}`, onPage)}</td>))}
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
              {inline(part, `${key}-${p}`, onPage)}
            </Fragment>
          ))}
        </p>,
      );
    }
  }
  return out;
}
