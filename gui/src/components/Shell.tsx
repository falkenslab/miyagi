import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { CourseTexts } from "../i18n/course";
import type { ExtTexts } from "../i18n/extensions";
import type { ChatState, Info } from "../types";
import { Icon, type IconName } from "./Icons";
import { Logo } from "./Logo";
import { SubjectList, useSubjects } from "./Subjects";
import { whileBusy } from "./StatusBar";

// The page's frame, three zones as a chat app (#83): an icon rail with the places (and the theme and
// the versions), a sidebar for the conversations (the subject, a new one, the recent ones) that can
// be collapsed and resized, and the view with its header (its title, a ⋯ menu) and, for a place with
// several views, their tabs. The mode, the quick actions and the capabilities are in the composer.

export type Theme = "system" | "light" | "dark";
type GroupView = "plan" | "topics" | "materials" | "oven" | "knowledge" | "sources";
export type View = "today" | "chat" | "classroom" | "extensions" | GroupView;
type Group = "course" | "memory";

/** The rail's places that hold several views: their tabs, at the top of the view. */
const GROUPS: Record<Group, GroupView[]> = { course: ["plan", "topics", "materials", "oven"], memory: ["knowledge", "sources"] };
const groupOf = (view: View) => (Object.keys(GROUPS) as Group[]).find((group) => GROUPS[group].includes(view as GroupView));

const SIDE_COLLAPSED_KEY = "miyagi.sideCollapsed";
const SIDE_WIDTH_KEY = "miyagi.sideWidth";
const SIDE_WIDTH = 272;
const SIDE_MIN = 220;
const SIDE_MAX = 420;
const SIDE_STEP = 16;
const clampSide = (width: number) => Math.round(Math.min(SIDE_MAX, Math.max(SIDE_MIN, width)));

/** Kept for the next visit, if the page may remember it. */
function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A page without storage keeps it for this visit only.
  }
}

function recalled(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Whether the sidebar is collapsed, as the person left it. */
export function useSideCollapsed(): [boolean, (collapsed: boolean) => void] {
  const [collapsed, setCollapsed] = useState(() => recalled(SIDE_COLLAPSED_KEY) === "1");
  return [
    collapsed,
    (next) => {
      setCollapsed(next);
      remember(SIDE_COLLAPSED_KEY, next ? "1" : "0");
    },
  ];
}

function storedSideWidth(): number {
  const value = Number(recalled(SIDE_WIDTH_KEY));
  return value ? clampSide(value) : SIDE_WIDTH;
}

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
    <Menu title={T.theme} ariaLabel={T.theme} className="ibtn plain theme-btn" popClass="up left" label={<span aria-hidden="true">{icons[theme]}</span>}>
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

/** The narrow column of places: each group opens at the view last left open in it. */
function Rail({ info, chat, view, go, theme, setTheme, T, X, C }: { info: Info | null; chat: ChatState | null; view: View; go: (view: View) => void; theme: Theme; setTheme: (theme: Theme) => void; T: Texts; X: ExtTexts; C: CourseTexts }) {
  const last = useRef<Record<Group, View>>({ course: "plan", memory: "knowledge" });
  useEffect(() => {
    const group = groupOf(view);
    if (group) last.current[group] = view;
  }, [view]);
  const here = groupOf(view) ?? view;
  const place = (id: View | Group, icon: IconName, label: string, badge?: ReactNode) => (
    <button type="button" className="rail-item" data-rail={id} title={label} aria-label={label} aria-current={here === id ? "page" : undefined} onClick={() => go(id === "course" || id === "memory" ? last.current[id] : id)}>
      <Icon name={icon} size={22} />
      {badge}
    </button>
  );
  const room = info?.classroom;
  return (
    <div className="rail">
      <div className="brand" title={`miyagi · ${X.tagline}`}>
        <Logo size={36} />
      </div>
      <nav className="rail-nav" aria-label={X.menu}>
        {chat && (
          <>
            {place("today", "sun", C.nav.today)}
            {place("course", "layers", C.sec.subject)}
            {place("memory", "folder", C.sec.memory)}
            {place("classroom", "classroom", X.navClassroom, <span className={`dot ${room?.connected ? "ok" : room ? "warn" : ""}`} aria-hidden="true" />)}
            {place("extensions", "grid", X.navExtensions)}
          </>
        )}
      </nav>
      <div className="rail-foot">
        <ThemeMenu theme={theme} setTheme={setTheme} T={T} />
        {info && (
          <Menu title={T.versions} ariaLabel={T.versions} className="ibtn plain ver-btn" popClass="up left" label={<span className="rail-ver">{info.version}</span>}>
            {() => <p className="pop-help">{`miyagi ${info.version} · agent-kit ${info.kit}`}</p>}
          </Menu>
        )}
      </div>
    </div>
  );
}

/** The sidebar's edge: dragged, or with the arrow keys, between its limits; a double click puts it back. */
function SideHandle({ width, resize, label }: { width: number; resize: (width: number) => void; label: string }) {
  const grab = useRef(0);
  return (
    <div
      className="side-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={SIDE_MIN}
      aria-valuemax={SIDE_MAX}
      aria-valuenow={width}
      tabIndex={0}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        // Where it was grabbed: the edge moves with the pointer, without jumping to it.
        grab.current = (event.currentTarget.parentElement?.offsetWidth ?? width) - event.clientX;
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) resize(event.clientX + grab.current);
      }}
      onDoubleClick={() => resize(SIDE_WIDTH)}
      onKeyDown={(event) => {
        // From what's on screen: a narrow window can be showing less than the width asked for.
        const shown = event.currentTarget.parentElement?.offsetWidth ?? width;
        const next = ({ ArrowLeft: shown - SIDE_STEP, ArrowRight: shown + SIDE_STEP, Home: SIDE_MIN, End: SIDE_MAX } as Record<string, number>)[event.key];
        if (next === undefined) return;
        event.preventDefault();
        resize(next);
      }}
    />
  );
}

/** The rail and the sidebar; at 760 px or less, both in the drawer the burger opens. */
export function Frame({
  info,
  chat,
  view,
  setView,
  open,
  setOpen,
  collapsed,
  setCollapsed,
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
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  T: Texts;
  X: ExtTexts;
  C: CourseTexts;
  onNewSubject: () => void;
  onOpenExisting: () => void;
}) {
  const [width, setWidth] = useState(storedSideWidth);
  const resize = (next: number) => {
    const clamped = clampSide(next);
    setWidth(clamped);
    remember(SIDE_WIDTH_KEY, String(clamped));
  };
  const go = (next: View) => {
    setView(next);
    setOpen(false);
  };
  return (
    <>
      {open && <div className="side-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className={`frame${open ? " on" : ""}${collapsed ? " collapsed" : ""}`}>
        <Rail info={info} chat={chat} view={view} go={go} theme={theme} setTheme={setTheme} T={T} X={X} C={C} />
        {info?.workspace && (
          <aside className="side" aria-label={T.conversations} style={{ "--side-width": `${width}px` } as CSSProperties}>
            <div className="side-top">
              <SubjectSwitcher info={info} busy={Boolean(chat?.busy)} T={T} X={X} onNew={onNewSubject} onOpenExisting={onOpenExisting} />
              <button type="button" className="ibtn plain side-collapse" title={T.collapseSidebar} aria-label={T.collapseSidebar} onClick={() => setCollapsed(true)}>
                <Icon name="panel" />
              </button>
            </div>
            {chat && (
              <button type="button" className="new-conv" {...whileBusy(chat.busy)} onClick={() => newConversation(chat, () => go("chat"))}>
                <Icon name="edit" />
                <span>{T.newConversation}</span>
              </button>
            )}
            <div className="nav">{chat && <Conversations chat={chat} T={T} inChat={view === "chat"} onOpen={() => go("chat")} />}</div>
            <SideHandle width={width} resize={resize} label={T.resizeSidebar} />
          </aside>
        )}
      </div>
    </>
  );
}

/** The views of the place on screen, as tabs at the top of the view; nothing for a place with one. */
export function ViewTabs({ view, setView, C }: { view: View; setView: (view: View) => void; C: CourseTexts }) {
  const group = groupOf(view);
  if (!group) return null;
  return (
    <div className="tabs view-tabs" role="tablist" aria-label={group === "course" ? C.sec.subject : C.sec.memory}>
      {GROUPS[group].map((id) => (
        <button key={id} type="button" role="tab" aria-selected={view === id} className={view === id ? "on" : ""} onClick={() => setView(id)}>
          {C.nav[id]}
        </button>
      ))}
    </div>
  );
}

/** Each view's header: the menu (on a phone), the sidebar's button when it's collapsed, the title, and the conversation's ⋯. */
export function Header({ title, subtitle, chat, chatShown, collapsed, T, X, onMenu, onExpand, onOpenChat }: { title: string; subtitle?: string; chat: ChatState | null; chatShown: boolean; collapsed: boolean; T: Texts; X: ExtTexts; onMenu: () => void; onExpand: () => void; onOpenChat: () => void }) {
  return (
    <header className="top">
      <button type="button" className="ibtn plain burger" title={X.menu} aria-label={X.menu} onClick={onMenu}>
        <Icon name="menu" />
      </button>
      {collapsed && (
        <button type="button" className="ibtn plain side-open" title={T.expandSidebar} aria-label={T.expandSidebar} onClick={onExpand}>
          <Icon name="panel" />
        </button>
      )}
      <h1>
        {title}
        {subtitle && <small>{subtitle}</small>}
      </h1>
      {chat && chatShown && (
        <Menu title={T.moreOptions} ariaLabel={T.moreOptions} className="ibtn plain more-btn" label={<span aria-hidden="true">⋯</span>}>
          {(close) => (
            <button
              type="button"
              {...whileBusy(chat.busy)}
              onClick={() => {
                newConversation(chat, onOpenChat);
                close();
              }}
            >
              <Icon name="edit" />
              <span>{T.newConversation}</span>
            </button>
          )}
        </Menu>
      )}
    </header>
  );
}
