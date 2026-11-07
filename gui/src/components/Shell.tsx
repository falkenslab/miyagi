import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { CourseTexts } from "../i18n/course";
import type { ExtTexts } from "../i18n/extensions";
import type { ChatState, Info } from "../types";
import { Icon, type IconName } from "./Icons";
import { Logo } from "./Logo";
import { SubjectList, useSubjects } from "./Subjects";
import { whileBusy } from "./StatusBar";

// The page's frame, organised as the Claude app (#60): a sidebar (miyagi, a new conversation, the
// subject, the views, the recent conversations, the versions and the theme) and each view's header
// (the menu, its title, a new conversation). The mode, the quick actions and the capabilities are
// in the composer. Only views that exist are listed.

export type Theme = "system" | "light" | "dark";
export type View = "today" | "chat" | "plan" | "topics" | "materials" | "oven" | "classroom" | "knowledge" | "sources" | "extensions";

/**
 * A button with a popover, closed by Escape or a click outside; on a phone (≤760 px) the popover is
 * a bottom sheet over a scrim (#60), as the stylesheet draws it.
 */
export function Menu({ label, title, children, className = "", popClass = "", ariaLabel }: { label: ReactNode; title: string; className?: string; popClass?: string; ariaLabel?: string; children: (close: () => void) => ReactNode }) {
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
      <button type="button" className={className || "ibtn"} title={title} aria-label={ariaLabel} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
        {label}
      </button>
      {open && <div className="pop-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      {open && (
        <div className={`pop ${popClass}`}>
          <span className="grab" aria-hidden="true" />
          {children(() => setOpen(false))}
        </div>
      )}
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
function SubjectSwitcher({ info, busy, T, X, onNew, onOpenExisting }: { info: Info; busy: boolean; T: Texts; X: ExtTexts; onNew: () => void; onOpenExisting: () => void }) {
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
            <Icon name="book" />
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
              {...whileBusy(busy)}
              onClick={() => {
                onNew();
                close();
              }}
            >
              <span aria-hidden="true">＋</span>
              <span>{T.newSubject}</span>
            </button>
            <button
              type="button"
              {...whileBusy(busy)}
              onClick={() => {
                onOpenExisting();
                close();
              }}
            >
              <span aria-hidden="true">📂</span>
              <span>{T.openExisting}</span>
            </button>
          </Loader>
        )}
      </Menu>
    </div>
  );
}

/** The recent conversations of this subject, the current one marked: resume one. */
/**
 * The recent conversations. The open one is highlighted as the view only while the chat is on
 * screen (`inChat`); in another view it keeps a quiet dot, so one item looks selected (#65).
 */
function Conversations({ chat, T, inChat, onOpen }: { chat: ChatState; T: Texts; inChat: boolean; onOpen: () => void }) {
  const [runs, setRuns] = useState<{ label: string; dir: string }[] | null>(null);
  const load = useCallback(async () => setRuns((await act<{ runs: { label: string; dir: string }[] }>("runs")).runs ?? []), []);
  // Again when the conversation changes (a new one, one resumed, a turn that names it).
  const current = chat.run?.dir;
  useEffect(() => {
    void load();
  }, [load, current, chat.turns]);
  // The current one, even before it's kept: the way back to it from another view.
  const shown = runs && current && !runs.some((run) => run.dir === current) ? [{ label: chat.run?.title ?? T.thisConversation, dir: current }, ...runs] : runs;
  return (
    <div className="recents">
      <h6>{T.recent}</h6>
      {shown?.length === 0 && <p className="muted pad small">{T.noConversations}</p>}
      {shown?.slice(0, 12).map((run) => (
        <a
          key={run.dir}
          role="button"
          tabIndex={0}
          className={run.dir !== current ? "conv" : inChat ? "conv on-conv" : "conv open-conv"}
          aria-current={run.dir === current && inChat ? "page" : undefined}
          title={run.label}
          onClick={() => {
            if (!chat.busy && run.dir !== current) void act("resume", { dir: run.dir });
            onOpen();
          }}
          onKeyDown={(event) => event.key === "Enter" && !chat.busy && (run.dir === current || void act("resume", { dir: run.dir }), onOpen())}
        >
          <span className="ellipsis">{run.label}</span>
          {run.dir === current && (chat.busy ? <span className="spinner" aria-hidden="true" /> : !inChat && <span className="dot sun" aria-hidden="true" />)}
        </a>
      ))}
    </div>
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

/** A new conversation, from the sidebar or the header: the conversation shown. */
function newConversation(chat: ChatState, onOpen: () => void) {
  if (chat.busy) return;
  void act("new");
  onOpen();
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
  onOpenExisting,
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
  onOpenExisting: () => void;
}) {
  // On a phone the views other than Today and the classroom fold into one line (#60).
  const [folded, setFolded] = useState(true);
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
  const tile = (id: View, icon: IconName, label: string, badge?: ReactNode) => (
    <a role="button" tabIndex={0} className={`tile${view === id ? " on" : ""}`} aria-current={view === id ? "page" : undefined} onClick={() => go(id)} onKeyDown={(event) => event.key === "Enter" && go(id)}>
      <Icon name={icon} size={18} />
      <span className="ellipsis">{label}</span>
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
        {chat && (
          <button type="button" className="new-conv" {...whileBusy(chat.busy)} onClick={() => newConversation(chat, () => go("chat"))}>
            <Icon name="edit" />
            <span>{T.newConversation}</span>
          </button>
        )}
        {info && <SubjectSwitcher info={info} busy={Boolean(chat?.busy)} T={T} X={X} onNew={onNewSubject} onOpenExisting={onOpenExisting} />}
        <nav className="nav">
          {chat && (
            <>
              <div className="tiles">
                {tile("today", "sun", C.nav.today)}
                {tile("classroom", "classroom", X.navClassroom, <span className={`dot ${room?.connected ? "ok" : room ? "warn" : ""}`} aria-hidden="true" />)}
              </div>
              <button type="button" className="fold" aria-expanded={!folded} onClick={() => setFolded(!folded)}>
                <span className="ellipsis">{[C.sec.subject, C.sec.memory, X.secMiyagi].join(" · ")}</span>
                <Icon name={folded ? "right" : "down"} size={14} />
              </button>
              <div className={`views${folded ? " folded" : ""}`}>
                <h6>{C.sec.subject}</h6>
                {item("plan", "🗺️", C.nav.plan)}
                {item("topics", "🧱", C.nav.topics)}
                {item("materials", "📦", C.nav.materials)}
                {item("oven", "🔥", C.nav.oven)}
                <h6>{C.sec.memory}</h6>
                {item("knowledge", "📚", C.nav.knowledge)}
                {item("sources", "🗂️", C.nav.sources)}
                <h6>{X.secMiyagi}</h6>
                {item("extensions", "🧩", X.navExtensions)}
              </div>
              <Conversations chat={chat} T={T} inChat={view === "chat"} onOpen={() => go("chat")} />
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

/** Each view's header: the menu (on a phone), the title, and a new conversation in the conversation. */
export function Header({ title, subtitle, chat, chatShown, T, X, onMenu, onOpenChat }: { title: string; subtitle?: string; chat: ChatState | null; chatShown: boolean; T: Texts; X: ExtTexts; onMenu: () => void; onOpenChat: () => void }) {
  return (
    <header className="top">
      <button type="button" className="ibtn plain burger" title={X.menu} aria-label={X.menu} onClick={onMenu}>
        <Icon name="menu" />
      </button>
      <h1>
        {title}
        {subtitle && <small>{subtitle}</small>}
      </h1>
      {chat && chatShown && (
        <button type="button" className="ibtn plain new-chat" title={T.newConversation} aria-label={T.newConversation} {...whileBusy(chat.busy)} onClick={() => newConversation(chat, onOpenChat)}>
          <Icon name="edit" />
        </button>
      )}
    </header>
  );
}
