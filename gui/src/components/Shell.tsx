import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { CourseTexts } from "../i18n/course";
import type { ExtTexts } from "../i18n/extensions";
import type { ChatState, Info, Mode } from "../types";
import { Logo } from "./Logo";
import { SubjectList, useSubjects } from "./Subjects";

// The page's frame, as the mockup draws it: a sidebar (miyagi, the subject, the views, the
// conversations, the versions and the theme) and each view's header (its title, the mode,
// quick actions and capabilities). Only views that exist are listed.

export type Theme = "system" | "light" | "dark";
export type View = "today" | "chat" | "plan" | "topics" | "materials" | "oven" | "classroom" | "knowledge" | "sources" | "extensions";

/** A button with a popover, closed by Escape or a click outside. */
function Menu({ label, title, children, className = "", popClass = "" }: { label: ReactNode; title: string; className?: string; popClass?: string; children: (close: () => void) => ReactNode }) {
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
      <button type="button" className={className || "ibtn"} title={title} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
        {label}
      </button>
      {open && <div className={`pop ${popClass}`}>{children(() => setOpen(false))}</div>}
    </div>
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

/** The subject open, as the sidebar's button: the others to switch to, and a new one. */
function SubjectSwitcher({ info, busy, T, X, onNew }: { info: Info; busy: boolean; T: Texts; X: ExtTexts; onNew: () => void }) {
  const { subjects, reload } = useSubjects();
  if (!info.workspace) return null;
  return (
    <div className="ws">
      <Menu
        title={T.subjects}
        className="ws-btn subject-btn"
        popClass="ws-pop"
        label={
          <>
            <span aria-hidden="true">📘</span>
            <span className="t">
              <b className="subject-name">{info.workspace}</b>
              <span>{info.classroom?.connected ? X.withClassroom : X.withoutClassroom}</span>
            </span>
            <span className="muted" aria-hidden="true">
              ▾
            </span>
          </>
        }
      >
        {(close) => (
          <Loader onOpen={reload}>
            {subjects && <SubjectList subjects={subjects.filter((subject) => subject.name !== info.workspace)} T={T} onOpen={close} onChanged={() => void reload()} />}
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
    </div>
  );
}

/** The conversations kept in this subject, in the sidebar: resume one, or start a new one. */
function Conversations({ chat, T, X, onOpen }: { chat: ChatState; T: Texts; X: ExtTexts; onOpen: () => void }) {
  const [runs, setRuns] = useState<{ label: string; dir: string }[] | null>(null);
  const load = useCallback(async () => setRuns((await act<{ runs: { label: string; dir: string }[] }>("runs")).runs ?? []), []);
  // Again when the conversation changes (a new one, one resumed, a turn that names it).
  const current = chat.run?.dir;
  useEffect(() => {
    void load();
  }, [load, current, chat.turns]);
  return (
    <>
      <h6>{X.secConversations}</h6>
      <a
        role="button"
        tabIndex={0}
        aria-disabled={chat.busy}
        onClick={() => {
          if (chat.busy) return;
          void act("new");
          onOpen();
        }}
        onKeyDown={(event) => event.key === "Enter" && !chat.busy && (void act("new"), onOpen())}
      >
        <span className="ico" aria-hidden="true">
          ＋
        </span>
        <span>{T.newConversation}</span>
      </a>
      {runs?.length === 0 && <p className="muted pad small">{T.noConversations}</p>}
      {runs?.slice(0, 12).map((run) => (
        <a
          key={run.dir}
          role="button"
          tabIndex={0}
          className={run.dir === current ? "conv on-conv" : "conv"}
          aria-current={run.dir === current}
          title={run.label}
          onClick={() => {
            if (!chat.busy && run.dir !== current) void act("resume", { dir: run.dir });
            onOpen();
          }}
          onKeyDown={(event) => event.key === "Enter" && !chat.busy && (void act("resume", { dir: run.dir }), onOpen())}
        >
          <span className="ico" aria-hidden="true">
            💬
          </span>
          <span className="ellipsis">{run.label}</span>
        </a>
      ))}
    </>
  );
}

function ThemeMenu({ theme, setTheme, T }: { theme: Theme; setTheme: (theme: Theme) => void; T: Texts }) {
  const icons: Record<Theme, string> = { system: "🖥️", light: "☀️", dark: "🌙" };
  return (
    <Menu title={T.theme} popClass="up" label={<span aria-hidden="true">{icons[theme]}</span>}>
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

export function Sidebar({
  info,
  chat,
  view,
  setView,
  open,
  setOpen,
  theme,
  setTheme,
  T,
  X,
  C,
  onNewSubject,
}: {
  info: Info | null;
  chat: ChatState | null;
  view: View;
  setView: (view: View) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  T: Texts;
  X: ExtTexts;
  C: CourseTexts;
  onNewSubject: () => void;
}) {
  const go = (next: View) => {
    setView(next);
    setOpen(false);
  };
  const item = (id: View, icon: string, label: string, badge?: ReactNode) => (
    <a role="button" tabIndex={0} className={view === id ? "on" : ""} aria-current={view === id ? "page" : undefined} onClick={() => go(id)} onKeyDown={(event) => event.key === "Enter" && go(id)}>
      <span className="ico" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      {badge}
    </a>
  );
  const room = info?.classroom;
  return (
    <>
      {open && <div className="side-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={`side ${open ? "on" : ""}`} aria-label={X.menu}>
        <div className="brand">
          <Logo size={38} />
          <div>
            <b>miyagi</b>
            <small>{X.tagline}</small>
          </div>
        </div>
        {info && <SubjectSwitcher info={info} busy={Boolean(chat?.busy)} T={T} X={X} onNew={onNewSubject} />}
        <nav className="nav">
          {chat && (
            <>
              {item("today", "☀️", C.nav.today)}
              {item("chat", "💬", X.navChat, chat.busy ? <span className="spinner" aria-hidden="true" /> : undefined)}
              <h6>{C.sec.subject}</h6>
              {item("plan", "🗺️", C.nav.plan)}
              {item("topics", "🧱", C.nav.topics)}
              {item("materials", "📦", C.nav.materials)}
              {item("oven", "🔥", C.nav.oven)}
              <h6>{X.secClassroom}</h6>
              {item("classroom", "🎓", X.navClassroom, <span className={`dot ${room?.connected ? "ok" : room ? "warn" : ""}`} aria-hidden="true" />)}
              <h6>{C.sec.memory}</h6>
              {item("knowledge", "📚", C.nav.knowledge)}
              {item("sources", "🗂️", C.nav.sources)}
              <h6>{X.secMiyagi}</h6>
              {item("extensions", "🧩", X.navExtensions)}
              <Conversations chat={chat} T={T} X={X} onOpen={() => go("chat")} />
            </>
          )}
        </nav>
        <div className="side-foot">
          <span className="dot ok" aria-hidden="true" />
          <span>{info ? `miyagi ${info.version} · agent-kit ${info.kit}` : "miyagi"}</span>
          <span className="sp" />
          <ThemeMenu theme={theme} setTheme={setTheme} T={T} />
        </div>
      </aside>
    </>
  );
}

/** The mode now, and the ones this session can switch to (Shift+Tab does the same). */
function ModeMenu({ chat, T }: { chat: ChatState; T: Texts }) {
  if (!chat.mode) return null;
  const now = chat.mode;
  return (
    <Menu
      title={T.modeTitle}
      className={`ibtn mode ${now}`}
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

/** Quick actions: what the teacher asks often, sent to the chat as they'd type it. */
function QuickActions({ chat, info, X, onLink, onSent }: { chat: ChatState; info: Info; X: ExtTexts; onLink: () => void; onSent: () => void }) {
  const connected = Boolean(info.classroom?.connected);
  const send = (line: string) => {
    void act("send", { line });
    onSent();
  };
  const items: [string, string, () => void][] = [
    ["🧱", X.quick.prepare, () => send(X.quickPrompts.prepare)],
    ["📚", X.quick.ingest, () => send(X.quickPrompts.ingest)],
    ...(connected
      ? ([
          ["📥", X.quick.grade, () => send(X.quickPrompts.grade)],
          ["🗨️", X.quick.forum, () => send(X.quickPrompts.forum)],
        ] as [string, string, () => void][])
      : ([["🔗", X.linkTitle, onLink]] as [string, string, () => void][])),
  ];
  return (
    <Menu
      title={X.actions}
      label={
        <>
          <span aria-hidden="true">⚡</span>
          <span className="lbl">{X.actions}</span>
        </>
      }
    >
      {(close) =>
        items.map(([icon, label, run]) => (
          <button
            key={label}
            type="button"
            disabled={chat.busy}
            onClick={() => {
              run();
              close();
            }}
          >
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </button>
        ))
      }
    </Menu>
  );
}

export function Header({ title, subtitle, chat, info, T, X, onMenu, onCapabilities, onLink, onSent }: { title: string; subtitle?: string; chat: ChatState | null; info: Info | null; T: Texts; X: ExtTexts; onMenu: () => void; onCapabilities: () => void; onLink: () => void; onSent: () => void }) {
  return (
    <header className="top">
      <button type="button" className="ibtn burger" title={X.menu} aria-label={X.menu} onClick={onMenu}>
        ☰
      </button>
      <h1>
        {title}
        {subtitle && <small>{subtitle}</small>}
      </h1>
      {chat && <ModeMenu chat={chat} T={T} />}
      {chat && info && <QuickActions chat={chat} info={info} X={X} onLink={onLink} onSent={onSent} />}
      {chat && (
        <button type="button" className="ibtn" title={X.capsTitle} onClick={onCapabilities}>
          <span aria-hidden="true">🧩</span>
          <span className="lbl">{X.capsButton}</span>
        </button>
      )}
    </header>
  );
}
