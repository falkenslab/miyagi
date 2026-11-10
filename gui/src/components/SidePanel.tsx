import { useCallback, useEffect, useRef, useState } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { CourseTexts } from "../i18n/course";
import { ACTIVITY_TAB, activityTab, addTab, closeTab, fileTab, NO_TABS, selectTab, shownTurn, syncWebTabs, turnsOf, type SideTab, type SideTabs } from "../sideTabs";
import type { BrowserTab, ChatState } from "../types";
import { native, tabTitle, WebBar, WebBody } from "./Browser";
import { TaskList } from "./Composer";
import { Preview } from "./Course";
import { Icon } from "./Icons";
import { ClassroomLink } from "./Transcript";
import { recalled, remember, SideHandle } from "./Shell";
import { useElapsed } from "./StatusBar";

// The panel on the right of the conversation (#85): tabs with what the teacher is looking at, a
// divider to resize it, expand and close. Under about 1100 px it takes the conversation's place,
// and at 760 px or less the whole screen, as the stylesheet draws it; an approval brings the
// conversation back (`.asking`), and the panel returns once it's answered. Its activity tab (#70)
// is everything a turn is doing, live; Esc or its ✕ closes it, and each conversation remembers
// whether it was open for this visit. In the desktop app its tabs can also be web pages (#86): the
// native side holds them, and tells which there are.

const PANEL_WIDTH_KEY = "miyagi.panelWidth";
const PANEL_WIDTH = 480;
const PANEL_MIN = 320;
const PANEL_MAX = 960;
const clampPanel = (width: number) => Math.round(Math.min(PANEL_MAX, Math.max(PANEL_MIN, width)));

const activityKey = (dir: string) => `miyagi.activity:${dir}`;

function wasActivityOpen(dir: string): boolean {
  try {
    return sessionStorage.getItem(activityKey(dir)) === "1";
  } catch {
    return false;
  }
}

function keepActivityOpen(dir: string, open: boolean) {
  try {
    if (open) sessionStorage.setItem(activityKey(dir), "1");
    else sessionStorage.removeItem(activityKey(dir));
  } catch {
    // A page without storage forgets it on reloading.
  }
}

function storedPanelWidth(): number {
  const value = Number(recalled(PANEL_WIDTH_KEY));
  return value ? clampPanel(value) : PANEL_WIDTH;
}

/** The panel's state, in the page: its tabs, whether it's on screen and expanded, and its width. `dir` is the conversation open. */
export function useSidePanel(dir: string | undefined, browser: BrowserTab[]) {
  const [tabs, setTabs] = useState<SideTabs>(NO_TABS);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [width, setWidth] = useState(storedPanelWidth);
  const resize = (next: number) => {
    const clamped = clampPanel(next);
    setWidth(clamped);
    remember(PANEL_WIDTH_KEY, String(clamped));
  };
  const showTab = (tab: SideTab) => {
    setTabs((now) => addTab(now, tab));
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    setExpanded(false);
  };
  // Another conversation brings back its own activity tab, or none.
  const seen = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!dir || dir === seen.current) return;
    seen.current = dir;
    if (wasActivityOpen(dir)) {
      setTabs((now) => addTab(now, activityTab(null)));
      setOpen(true);
    } else setTabs((now) => closeTab(now, ACTIVITY_TAB));
  }, [dir]);
  const activityOpen = open && tabs.list.some((tab) => tab.kind === "activity");
  useEffect(() => {
    if (dir) keepActivityOpen(dir, activityOpen);
  }, [dir, activityOpen]);
  // The browser's tabs, as the native side says: a new one (a link, a pop-up, "+") comes forward.
  const nativeTabs = browser.map((tab) => tab.id).join(" ");
  const knownTabs = useRef("");
  useEffect(() => {
    const ids = nativeTabs ? nativeTabs.split(" ") : [];
    const opened = ids.some((id) => !knownTabs.current.split(" ").includes(id));
    knownTabs.current = nativeTabs;
    setTabs((now) => syncWebTabs(now, ids));
    if (opened) setOpen(true);
  }, [nativeTabs]);
  /** A subject's files don't stay open in another: they aren't there (the activity tab goes with the conversation, above). */
  const reset = useCallback(() => {
    setTabs((now) => now.list.reduce((left, tab) => (tab.kind === "file" ? closeTab(left, tab.id) : left), now));
    setExpanded(false);
  }, []);
  return {
    tabs,
    /** On screen: open, and with something to show. */
    shown: open && tabs.list.length > 0,
    expanded,
    width,
    resize,
    openFile: (file: string) => showTab(fileTab(file)),
    openActivity: (turn: number | null) => showTab(activityTab(turn)),
    /** A web page in a tab of its own (empty: a new tab); refused, says why. */
    openWeb: async (url?: string) => (await act<{ id?: string; error?: string }>("browser-open", url ? { url } : {})).error,
    select: (id: string) => setTabs((now) => selectTab(now, id)),
    close: (id: string) => {
      const web = tabs.list.find((tab) => tab.id === id && tab.kind === "web");
      if (web?.kind === "web") return void native("browser-close", { id: web.tab });
      const next = closeTab(tabs, id);
      setTabs(next);
      if (!next.list.length) hide();
    },
    toggle: () => (open ? hide() : setOpen(true)),
    hide,
    setExpanded,
    reset,
  };
}

export type SidePanelState = ReturnType<typeof useSidePanel>;

/** A turn's activity (#70): each call in order with what it answered, a subagent's actions under it, live and following the end unless scrolled up. */
function ActivityBody({ turn: chosen, chat, T }: { turn: number | null; chat: ChatState; T: Texts }) {
  const turns = turnsOf(chat.transcript);
  const turn = shownTurn(turns, chosen, chat.busy);
  const latest = turn !== undefined && turn === turns.at(-1);
  const running = chat.busy && latest;
  const elapsed = useElapsed(running ? chat.turnStartedAt : null);
  const box = useRef<HTMLDivElement>(null);
  const atEnd = useRef(true);
  const calls = turn?.calls ?? [];
  const steps = calls.reduce((n, call) => n + 1 + (call.result ? 1 : 0) + call.children.length, 0);
  useEffect(() => {
    atEnd.current = true;
  }, [turn?.id]);
  useEffect(() => {
    if (atEnd.current) box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [turn?.id, steps]);
  return (
    <div className="activity-panel">
      <div className="activity-head">
        {running && <span className="spinner" aria-hidden="true" />}
        <span className="muted status-time">{running ? elapsed : turn?.seconds ? `✻ ${T.seconds(turn.seconds)}` : ""}</span>
        <span className="sp" />
        {running && (
          <button type="button" className="btn small tall" onClick={() => void act("interrupt")}>
            {T.stop}
          </button>
        )}
      </div>
      {latest && chat.todos?.some((todo) => todo.status !== "completed") && (
        <div className="todos">
          <TaskList todos={chat.todos} />
        </div>
      )}
      <div
        className="activity-list"
        ref={box}
        onScroll={(event) => {
          const el = event.currentTarget;
          atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
      >
        {calls.length === 0 && <p className="muted">{T.noActions}</p>}
        <ul className="tool-calls">
          {calls.map((call, index) => (
            <li key={call.id ?? index} className={call.result?.isError ? "err" : ""}>
              <span className="mark" aria-hidden="true">{call.result ? (call.result.isError ? "✕" : "✓") : "…"}</span>
              <span>{call.label}</span>
              {call.result?.text && <small>{call.result.text}</small>}
              {call.page && <ClassroomLink url={call.page} T={T} />}
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
      </div>
    </div>
  );
}

/** A web tab's icon: its page's, or a spinner while it loads. */
function WebIcon({ tab }: { tab?: BrowserTab }) {
  if (tab?.loading) return <span className="spinner web-fav" aria-hidden="true" />;
  return tab?.favicon ? <img className="web-fav" src={tab.favicon} alt="" /> : <span className="web-fav"><Icon name="globe" size={16} /></span>;
}

/** What a tab shows. */
function TabBody({ tab, chat, T, C }: { tab: SideTab; chat: ChatState; T: Texts; C: CourseTexts }) {
  if (tab.kind === "web") return null;
  return tab.kind === "activity" ? <ActivityBody turn={tab.turn} chat={chat} T={T} /> : <Preview file={tab.file} C={C} />;
}

export function SidePanel({ panel, chat, browser, canBrowse, classroom, T, C }: { panel: SidePanelState; chat: ChatState; browser: BrowserTab[]; canBrowse: boolean; classroom?: string; T: Texts; C: CourseTexts }) {
  const { list, active } = panel.tabs;
  const page = (tab: SideTab) => (tab.kind === "web" ? browser.find((one) => one.id === tab.tab) : undefined);
  const shownPage = list.find((tab) => tab.id === active);
  const web = shownPage && page(shownPage);
  // The native side shows the tab the panel shows, and none while it's another kind.
  useEffect(() => {
    void native("browser-select", { id: web?.id ?? null });
  }, [web?.id]);
  // Esc closes the activity tab, unless something else on screen answers to it (a menu, a dialog, a field with text).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || active !== ACTIVITY_TAB) return;
      if (document.querySelector(".pop, .scrim, .select-menu")) return;
      const field = event.target as HTMLElement;
      if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && field.value) return;
      panel.close(ACTIVITY_TAB);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel, active]);
  const titleOf = (tab: SideTab) => (tab.kind === "activity" ? T.activity : tab.kind === "web" ? tabTitle(page(tab), T) : tab.title);
  return (
    <aside className="spanel" aria-label={T.sidePanel}>
      <SideHandle left width={panel.width} resize={panel.resize} label={T.resizePanel} min={PANEL_MIN} max={PANEL_MAX} initial={PANEL_WIDTH} />
      <div className="spanel-bar">
        <button type="button" className="ibtn plain spanel-back" title={T.backToChat} aria-label={T.backToChat} onClick={panel.hide}>
          <Icon name="left" />
        </button>
        <div className="spanel-tabs" role="tablist" aria-label={T.sidePanel}>
          {list.map((tab) => (
            <div key={tab.id} className={`spanel-tab${tab.id === active ? " on" : ""}`}>
              <button type="button" role="tab" aria-selected={tab.id === active} title={tab.kind === "file" ? tab.file : tab.kind === "web" ? page(tab)?.url || titleOf(tab) : T.activity} className="ellipsis" onClick={() => panel.select(tab.id)}>
                {tab.kind === "web" && <WebIcon tab={page(tab)} />}
                {titleOf(tab)}
              </button>
              <button type="button" className="ibtn plain spanel-x" title={T.closeTab(titleOf(tab))} aria-label={T.closeTab(titleOf(tab))} onClick={() => panel.close(tab.id)}>
                <Icon name="x" size={16} />
              </button>
            </div>
          ))}
        </div>
        {canBrowse && (
          <button type="button" className="ibtn plain spanel-new" title={T.webNewTab} aria-label={T.webNewTab} onClick={() => void panel.openWeb()}>
            <Icon name="plus" />
          </button>
        )}
        <button type="button" className="ibtn plain spanel-expand" title={panel.expanded ? T.shrinkPanel : T.expandPanel} aria-label={panel.expanded ? T.shrinkPanel : T.expandPanel} aria-pressed={panel.expanded} onClick={() => panel.setExpanded(!panel.expanded)}>
          <Icon name={panel.expanded ? "shrink" : "expand"} />
        </button>
        <button type="button" className="ibtn plain spanel-close" title={T.closePanel} aria-label={T.closePanel} onClick={panel.hide}>
          <Icon name="x" />
        </button>
      </div>
      {web && <WebBar key={web.id} tab={web} tabs={browser} T={T} />}
      <div className="spanel-body">
        {/* Every tab stays mounted, so changing tab doesn't reload a PDF or lose its place. */}
        {list.map((tab) => (
          <div key={tab.id} className={`spanel-page${tab.kind === "web" ? " web" : ""}`} role="tabpanel" hidden={tab.id !== active}>
            {tab.kind === "web" && page(tab) ? <WebBody tab={page(tab)!} active={tab.id === active} classroom={classroom} T={T} /> : <TabBody tab={tab} chat={chat} T={T} C={C} />}
          </div>
        ))}
      </div>
    </aside>
  );
}
