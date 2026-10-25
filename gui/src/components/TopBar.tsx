import { useEffect, useRef, useState, type ReactNode } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { ChatState, Mode } from "../types";
import { Logo } from "./Logo";
import { SubjectList, useSubjects } from "./Subjects";

export type Theme = "system" | "light" | "dark";

/** A button with a popover under it, closed by Escape or a click outside. */
function Menu({ label, title, children, className = "" }: { label: ReactNode; title: string; className?: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div className="menu" ref={box}>
      <button type="button" className={`ibtn ${className}`} title={title} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
        {label}
      </button>
      {open && <div className="pop">{children(() => setOpen(false))}</div>}
    </div>
  );
}

/** The mode now, and the ones this session can switch to (Shift+Tab does the same). */
function ModeMenu({ chat, T }: { chat: ChatState; T: Texts }) {
  if (!chat.mode) return null;
  const now = chat.mode;
  return (
    <Menu
      title={T.modeTitle}
      className={`mode ${now}`}
      label={
        <>
          <span className="sw" aria-hidden="true" />
          <span className="lbl">{T.modes[now].name}</span>
        </>
      }
    >
      {(close) =>
        chat.switchableModes.map((mode: Mode) => (
          <button
            key={mode}
            type="button"
            aria-current={mode === now}
            onClick={() => {
              void act("mode", { mode });
              close();
            }}
          >
            <span className={`sw ${mode}`} aria-hidden="true" />
            <span>
              {T.modes[mode].name}
              <small>{T.modes[mode].help}</small>
            </span>
          </button>
        ))
      }
    </Menu>
  );
}

/** Runs `onOpen` once, when the popover opens. */
function Loader({ onOpen, children }: { onOpen: () => void | Promise<void>; children: ReactNode }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    void onOpen();
  }, [onOpen]);
  return <>{children}</>;
}

/** The conversations kept in this subject: resume one, or start a new one. */
function Conversations({ chat, T }: { chat: ChatState; T: Texts }) {
  const [runs, setRuns] = useState<{ label: string; dir: string }[] | null>(null);
  const load = async () => setRuns((await act<{ runs: { label: string; dir: string }[] }>("runs")).runs ?? []);
  return (
    <Menu
      title={T.conversations}
      label={
        <>
          <span aria-hidden="true">🗂</span>
          <span className="lbl">{T.conversations}</span>
        </>
      }
    >
      {(close) => (
        <Loader onOpen={load}>
          <button
            type="button"
            disabled={chat.busy}
            onClick={() => {
              void act("new");
              close();
            }}
          >
            <span aria-hidden="true">＋</span>
            <span>{T.newConversation}</span>
          </button>
          {runs?.length === 0 && <p className="muted pad">{T.noConversations}</p>}
          {runs?.map((run) => (
            <button
              key={run.dir}
              type="button"
              disabled={chat.busy}
              aria-current={run.dir === chat.run?.dir}
              onClick={() => {
                void act("resume", { dir: run.dir });
                close();
              }}
            >
              <span aria-hidden="true">💬</span>
              <span>
                {run.label}
                {run.dir === chat.run?.dir && <small>{T.current}</small>}
              </span>
            </button>
          ))}
        </Loader>
      )}
    </Menu>
  );
}

function ThemeMenu({ theme, setTheme, T }: { theme: Theme; setTheme: (theme: Theme) => void; T: Texts }) {
  const icons: Record<Theme, string> = { system: "◐", light: "☀", dark: "☾" };
  return (
    <Menu title={T.theme} label={<span aria-hidden="true">{icons[theme]}</span>}>
      {(close) =>
        (["system", "light", "dark"] as Theme[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-current={option === theme}
            onClick={() => {
              setTheme(option);
              close();
            }}
          >
            <span aria-hidden="true">{icons[option]}</span>
            <span>{T.themes[option]}</span>
          </button>
        ))
      }
    </Menu>
  );
}

/** The subject open, as a button: the others to switch to, and a new one. */
function SubjectMenu({ workspace, busy, T, onNew }: { workspace: string; busy: boolean; T: Texts; onNew: () => void }) {
  const { subjects, reload } = useSubjects();
  return (
    <Menu
      title={T.subjects}
      className="subject-btn"
      label={
        <>
          <span className="subject-name">{workspace}</span>
          <span aria-hidden="true">▾</span>
        </>
      }
    >
      {(close) => (
        <Loader onOpen={reload}>
          {subjects && (
            <SubjectList
              subjects={subjects.filter((subject) => subject.name !== workspace)}
              T={T}
              onOpen={close}
            />
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              onNew();
              close();
            }}
          >
            <span aria-hidden="true">＋</span>
            <span>{T.newSubject}</span>
          </button>
        </Loader>
      )}
    </Menu>
  );
}

export function TopBar({ chat, workspace, theme, setTheme, T, onNewSubject }: { chat: ChatState | null; workspace: string | null; theme: Theme; setTheme: (theme: Theme) => void; T: Texts; onNewSubject: () => void }) {
  return (
    <header className="top">
      <Logo size={30} />
      <div className="title">
        {workspace ? <SubjectMenu workspace={workspace} busy={Boolean(chat?.busy)} T={T} onNew={onNewSubject} /> : <h1>miyagi</h1>}
      </div>
      {chat && <Conversations chat={chat} T={T} />}
      {chat && <ModeMenu chat={chat} T={T} />}
      <ThemeMenu theme={theme} setTheme={setTheme} T={T} />
    </header>
  );
}
