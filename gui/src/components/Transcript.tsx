import { useEffect, useRef, useState } from "react";
import type { Texts } from "../i18n";
import { Markdown } from "../markdown";
import type { ChatState, TranscriptCall, TranscriptEntry } from "../types";
import { Logo } from "./Logo";

/** A turn's tool calls, folded into one line with the kit's labels; opened, each call with ✓/✕ and its subagent's steps. */
function Tools({ calls, running, T }: { calls: TranscriptCall[]; running: boolean; T: Texts }) {
  const [open, setOpen] = useState(false);
  const failed = calls.filter((call) => call.result?.isError).length;
  const last = calls[calls.length - 1];
  return (
    <div className={`tool${open ? " open" : ""}`}>
      <button type="button" className="tool-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="chev" aria-hidden="true">{open ? "▾" : "▸"}</span>
        <span className="tool-label">{running && last ? last.label : T.calls(calls.length)}</span>
        {failed > 0 && <span className="badge sun">{failed} {T.toolFailed}</span>}
        {running && <span className="spinner" aria-hidden="true" />}
      </button>
      {open && (
        <ul className="tool-calls">
          {calls.map((call, index) => (
            <li key={call.id ?? index} className={call.result?.isError ? "err" : ""}>
              <span className="mark" aria-hidden="true">{call.result ? (call.result.isError ? "✕" : "✓") : "…"}</span>
              <span>{call.label}</span>
              {call.result?.text && <small>{call.result.text}</small>}
              {call.children.length > 0 && (
                <ul>
                  {call.children.map((child, c) => (
                    <li key={c}>{child}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Entry({ entry, running, T }: { entry: TranscriptEntry; running: boolean; T: Texts }) {
  switch (entry.kind) {
    case "user":
      return (
        <div className="msg user">
          <div className="body">{entry.text}</div>
        </div>
      );
    case "agent":
      return (
        <div className="msg agent">
          <div className="av" aria-hidden="true">
            <Logo size={22} />
          </div>
          <div className="body md">
            <Markdown text={entry.text} />
          </div>
        </div>
      );
    case "tools":
      return <Tools calls={entry.calls} running={running} T={T} />;
    case "notice":
      return <div className={`notice ${entry.tone}`}>{entry.text}</div>;
    case "turn-summary":
      return <div className="turn-summary">✻ {T.seconds(entry.seconds)}</div>;
  }
}

/** The conversation, scrolled to the end while the person is at the end. */
export function Transcript({ chat, workspace, T }: { chat: ChatState; workspace: string; T: Texts }) {
  const box = useRef<HTMLDivElement>(null);
  const atEnd = useRef(true);
  useEffect(() => {
    if (atEnd.current) box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [chat.transcript, chat.activity]);
  const last = chat.transcript[chat.transcript.length - 1];
  return (
    <div
      className="msgs"
      ref={box}
      onScroll={(event) => {
        const el = event.currentTarget;
        atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
      aria-live="polite"
    >
      <div className="col">
        {chat.transcript.length === 0 && (
          <div className="welcome">
            <Logo size={72} />
            <h2>{T.welcome(workspace)}</h2>
          </div>
        )}
        {chat.transcript.map((entry) => (
          <Entry key={entry.id} entry={entry} running={chat.busy && entry === last} T={T} />
        ))}
        {chat.busy && chat.activity && last?.kind !== "tools" && (
          <div className="activity">
            <span className="spinner" aria-hidden="true" /> {chat.activity}
          </div>
        )}
      </div>
    </div>
  );
}
