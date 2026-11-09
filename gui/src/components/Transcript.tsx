import { useEffect, useRef, useState } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import { Markdown } from "../markdown";
import { canPreview, turnOfEntry } from "../sideTabs";
import type { ChatState, TranscriptCall, TranscriptEntry } from "../types";
import type { CourseView } from "./Course";
import { actionLabel, launched, useActions } from "./Actions";
import { Icon } from "./Icons";
import { Logo } from "./Logo";
import { Waiting } from "./Waiting";
import { whileBusy } from "./StatusBar";

/** Where the host says a named item opens (`resolve`, #66). */
interface ItemPlace {
  view: CourseView;
  item?: string;
}
type Opener = ((target: string) => void) & { has: (target: string) => boolean };

/** What the agent's replies name that may be one of the subject's items: link targets and inline code that look like a path or a page id. */
function namedTargets(transcript: TranscriptEntry[]): string[] {
  const found = new Set<string>();
  for (const entry of transcript) {
    if (entry.kind !== "agent") continue;
    for (const match of entry.text.matchAll(/\]\(([^)\s]+)\)|`([^`\s]+\/[^`\s]+)`/g)) {
      const target = match[1] ?? match[2]!;
      if (!/^[a-z]+:/i.test(target)) found.add(target);
    }
  }
  return [...found];
}

/**
 * The items named in the conversation that exist, asked to the host as they appear (one call for
 * the new ones), and how to open each. Those that don't exist are asked again after the turn: the
 * agent may name a file before writing it.
 */
function useItemLinks(chat: ChatState, go: (view: CourseView, item?: string) => void, beside: (file: string) => void): Opener {
  const [places, setPlaces] = useState<Record<string, ItemPlace>>({});
  const asked = useRef(new Set<string>());
  useEffect(() => {
    if (!chat.busy) asked.current = new Set(Object.keys(places));
  }, [chat.busy]);
  useEffect(() => {
    const fresh = namedTargets(chat.transcript).filter((target) => !asked.current.has(target));
    if (!fresh.length) return;
    for (const target of fresh) asked.current.add(target);
    void act<{ items?: Record<string, ItemPlace> }>("resolve", { targets: fresh })
      .then((answer) => answer.items && Object.keys(answer.items).length && setPlaces((known) => ({ ...known, ...answer.items })))
      .catch(() => {});
  }, [chat.transcript, chat.busy]);
  return Object.assign(
    (target: string) => {
      const place = places[target];
      if (!place) return;
      // A file the panel can show opens beside the conversation (#85), without leaving it.
      if (place.view === "materials" && place.item && canPreview(place.item)) beside(place.item);
      else go(place.view, place.item);
    },
    { has: (target: string) => target in places },
  );
}

/** The SDK's tool that hands a task to a subagent (`Agent`, `Task` before). */
const SUBAGENT_TOOLS = new Set(["Agent", "Task"]);

/** "35 s", "4 min": the same in the four languages. */
const lasted = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min`;
};

/** How long a subagent call has been running, from when the page first saw it, ticking each second. */
function useSince(id: string | undefined) {
  const started = useRef<{ id: string | undefined; at: number }>({ id, at: Date.now() });
  if (started.current.id !== id) started.current = { id, at: Date.now() };
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!id) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [id]);
  return now - started.current.at;
}

/**
 * A turn's tool calls, one dim line (#60): the last call and how many, or the running one; it opens
 * the turn's activity in the side panel (#70). While a subagent works, a second line says what it's
 * doing now, for how long and how many actions it has taken (#63), so a long research doesn't look stuck.
 */
function Tools({ calls, running, T, onOpen }: { calls: TranscriptCall[]; running: boolean; T: Texts; onOpen: () => void }) {
  const failed = calls.filter((call) => call.result?.isError).length;
  const last = calls[calls.length - 1];
  const sub = running && last && !last.result && (SUBAGENT_TOOLS.has(last.toolName) || last.children.length > 0) ? last : undefined;
  const since = useSince(sub ? (sub.id ?? sub.label) : undefined);
  return (
    <div className="tool">
      <button type="button" className="tool-head" onClick={onOpen}>
        {running && <span className="spinner" aria-hidden="true" />}
        <span className="tool-label">{running && last ? last.label : last ? `${last.label} · ${T.calls(calls.length)}` : T.calls(calls.length)}</span>
        {failed > 0 && <span className="badge sun">{failed} {T.toolFailed}</span>}
        <Icon name="right" size={16} />
      </button>
      {sub && (
        <button type="button" className="sub-activity" onClick={onOpen}>
          <span className="ellipsis">{sub.children.at(-1) ?? T.subagentStarting}</span>
          {/* The clock ticks every second: kept out of what a screen reader announces. */}
          <span aria-hidden="true">· {lasted(since)}</span>
          {sub.children.length > 0 && <span>· {T.calls(sub.children.length)}</span>}
        </button>
      )}
    </div>
  );
}

/** Under a finished reply: Copy (its markdown) and how long the turn took. */
function TurnEnd({ text, seconds, T }: { text: string; seconds: number; T: Texts }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <div className="turn-summary">
      {text && (
        <button
          type="button"
          className="copy"
          title={copied ? T.copied : T.copy}
          aria-label={copied ? T.copied : T.copy}
          onClick={() => void navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})}
        >
          <Icon name={copied ? "check" : "copy"} size={18} />
        </button>
      )}
      <span>✻ {T.seconds(seconds)}</span>
    </div>
  );
}

function Entry({ entry, running, reply, T, open, onActivity }: { entry: TranscriptEntry; running: boolean; reply: string; T: Texts; open: Opener; onActivity: (entry: number) => void }) {
  switch (entry.kind) {
    case "user":
      return <UserLine text={entry.text} />;
    case "agent":
      return (
        <div className="msg agent">
          <div className="body md">
            <Markdown text={entry.text} onPage={open} />
          </div>
        </div>
      );
    case "tools":
      return <Tools calls={entry.calls} running={running} T={T} onOpen={() => onActivity(entry.id)} />;
    case "notice":
      return <div className={`notice ${entry.tone}`}>{entry.text}</div>;
    case "turn-summary":
      return <TurnEnd text={reply} seconds={entry.seconds} T={T} />;
  }
}

/**
 * What the teacher wrote; an action launched from the page (#67) as its name and its value, so the
 * conversation reads as what they asked for.
 */
function UserLine({ text }: { text: string }) {
  const api = useActions();
  const found = api && launched(api.actions, text);
  return (
    <div className="msg user">
      {found ? (
        <div className="body">
          <span className="cmd-chip">
            <span aria-hidden="true">{found.action.icon ?? "/"}</span> {actionLabel(found.action, api.lang)}
            {found.value && <span className="cmd-value"> · {found.value}</span>}
          </span>
        </div>
      ) : (
        <div className="body">{text}</div>
      )}
    </div>
  );
}

/** What to start with in a conversation the person hasn't written in yet: the catalog's suggested actions as rows (#67). */
function Suggestions({ chat }: { chat: ChatState }) {
  const api = useActions();
  const [pending, setPending] = useState(0);
  useEffect(() => {
    void act<{ sources?: { pending: number } }>("today")
      .then((today) => setPending(today.sources?.pending ?? 0))
      .catch(() => {});
  }, []);
  if (!api) return null;
  const suggested = api.actions.filter((action) => action.suggest);
  const usable = suggested.filter((action) => api.connected || !action.needsClassroom);
  return (
    <div className="suggest">
      {usable.map((action) => (
        <button key={action.command} type="button" {...whileBusy(chat.busy)} onClick={() => api.run(action)}>
          <span className="act-icon" aria-hidden="true">
            {action.icon}
          </span>
          <span className="grow">{actionLabel(action, api.lang)}</span>
          {action.command === "knowledge:ingest" && pending > 0 && <span className="badge warn">{pending}</span>}
        </button>
      ))}
      {usable.length < suggested.length && (
        <button type="button" onClick={api.onLink}>
          <Icon name="link" />
          <span className="grow">{api.A.linkClassroom}</span>
        </button>
      )}
    </div>
  );
}

/** The greeting by the hour, as the person's clock says. */
function greeting(T: Texts) {
  const hour = new Date().getHours();
  return T.greeting(hour < 6 || hour >= 21 ? "night" : hour < 13 ? "morning" : "afternoon");
}

/** The conversation, scrolled to the end while the person is at the end; ↓ takes them back there. */
export function Transcript({ chat, T, go, beside, onActivity }: { chat: ChatState; T: Texts; go: (view: CourseView, item?: string) => void; beside: (file: string) => void; onActivity: (turn: number | null) => void }) {
  const open = useItemLinks(chat, go, beside);
  const box = useRef<HTMLDivElement>(null);
  const atEnd = useRef(true);
  const [away, setAway] = useState(false);
  useEffect(() => {
    if (atEnd.current) box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [chat.transcript, chat.activity, chat.panel]);
  // Another conversation (a search result, a pinned one) starts at its end.
  useEffect(() => {
    atEnd.current = true;
    setAway(false);
  }, [chat.run?.dir]);
  const last = chat.transcript[chat.transcript.length - 1];
  const fresh = !chat.transcript.some((entry) => entry.kind === "user");
  // Each turn's summary copies the reply right before it.
  let reply = "";
  return (
    <div className="msgs-wrap">
      <div
        className="msgs"
        ref={box}
        onScroll={(event) => {
          const el = event.currentTarget;
          atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          setAway(!atEnd.current);
        }}
        aria-live="polite"
      >
        <div className="col" data-select-actions>
          {fresh && (
            <div className="welcome">
              <Logo size={64} />
              <h2>{greeting(T)}</h2>
              {/* The session starting and the greeting on its way: tens of seconds the first time. */}
              {chat.busy && chat.transcript.length === 0 && <Waiting text={T.starting} still={T.stillWorking} />}
            </div>
          )}
          {chat.transcript.map((entry) => {
            if (entry.kind === "agent") reply = reply ? `${reply}

${entry.text}` : entry.text;
            const text = reply;
            if (entry.kind === "user" || entry.kind === "turn-summary") reply = "";
            return <Entry key={entry.id} entry={entry} running={chat.busy && entry === last} reply={text} T={T} open={open} onActivity={(id) => onActivity(turnOfEntry(chat.transcript, id))} />;
          })}
          {chat.busy && chat.activity && last?.kind !== "tools" && (
            <div className="activity">
              <span className="spinner" aria-hidden="true" /> {chat.activity}
            </div>
          )}
          {fresh && !chat.busy && <Suggestions chat={chat} />}
        </div>
      </div>
      {away && (
        <button type="button" className="to-end" aria-label={T.toEnd} title={T.toEnd} onClick={() => box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" })}>
          <Icon name="toEnd" size={18} />
        </button>
      )}
    </div>
  );
}
