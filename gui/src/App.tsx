import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { act, useMiyagi } from "./api";
import type { ActionLaunch } from "./types";
import { ActionsContext, actionLine, SelectionMenu, ViewActions, type ActionsApi } from "./components/Actions";
import { Composer, Todos } from "./components/Composer";
import { KnowledgeView, MaterialsView, OvenView, PlanView, SourcesView, TodayView, TopicsView, type CourseView } from "./components/Course";
import { ClassroomView, ExtensionsView, LinkWizard, type ExtTab } from "./components/Extensions";
import { Panel } from "./components/Panel";
import { Frame, Header, useSideCollapsed, ViewTabs, type Theme, type View } from "./components/Shell";
import { SidePanel, useSidePanel } from "./components/SidePanel";
import { SignIn } from "./components/SignIn";
import { setCanPick } from "./components/PathField";
import { setBusyReason, StatusBar } from "./components/StatusBar";
import { NewSubjectForm, OpenExisting, StartScreen } from "./components/Subjects";
import { setOpenLink } from "./markdown";
import { TipsWindow } from "./components/Tips";
import { TitleBar } from "./components/TitleBar";
import { Tour, useTour } from "./components/Tour";
import { Transcript } from "./components/Transcript";
import { Waiting } from "./components/Waiting";
import { texts } from "./i18n";
import { actionTexts } from "./i18n/actions";
import { courseTexts } from "./i18n/course";
import { extTexts } from "./i18n/extensions";
import { tipsTexts } from "./i18n/tips";
import { tourTexts } from "./i18n/tour";
import { tipIndex } from "./tips";
import { tipsFor } from "./tipsContent";
import { TOUR_VERSION } from "./tour";
import { canBack, canForward, NO_HISTORY, step, visit, type ViewHistory } from "./viewHistory";

const THEME_KEY = "miyagi.theme";

/** What the page remembers of the teacher in ~/.miyagi/config.json (#81, #82). */
interface PageSettings {
  tourSeen?: number;
  showTips?: boolean;
  tipsNext?: number;
}

/** The theme the person chose before, if the page may remember it; the system's otherwise. */
function storedTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function App() {
  const { info, state, connection, browser, refused } = useMiyagi();
  const [theme, setThemeState] = useState<Theme>(storedTheme);
  const [toast, setToast] = useState("");
  const [newSubject, setNewSubject] = useState(false);
  const [openExisting, setOpenExisting] = useState(false);
  const [view, setView] = useState<View>("today");
  const [kbPage, setKbPage] = useState<string | null>(null);
  const [item, setItem] = useState<string | null>(null);
  const [extTab, setExtTab] = useState<ExtTab>("installed");
  const [history, setHistory] = useState<ViewHistory<View>>(NO_HISTORY);
  const [sideOpen, setSideOpen] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useSideCollapsed();
  const side = useSidePanel(state?.chat?.run?.dir, browser);
  const [linking, setLinking] = useState(false);
  const closeLink = useCallback(() => setLinking(false), []);
  const chat = state?.chat ?? null;
  const resetSide = side.reset;
  useEffect(() => resetSide(), [info?.workspace, resetSide]);
  const T = texts(chat?.language ?? info?.language);
  const X = extTexts(chat?.language ?? info?.language);
  const C = courseTexts(chat?.language ?? info?.language);
  const G = tourTexts(chat?.language ?? info?.language);
  const H = tipsTexts(chat?.language ?? info?.language);
  setBusyReason(T.status.why);
  setCanPick(Boolean(info?.pickFolder));
  // In the desktop app a link in the chat opens a tab of its browser (#86); refused, it says so.
  const canBrowse = Boolean(info?.browser);
  setOpenLink(canBrowse ? (url) => void side.openWeb(url).then((error) => error && setToast(T.webRefused)) : null);
  /** A line to the chat from a view's button: sent as the teacher would type it, and the conversation shown. */
  const ask = (line: string, launch?: ActionLaunch) => {
    if (!chat || chat.busy) return;
    void act("send", { line, ...(launch ? { launch } : {}) });
    setView("chat");
  };
  const go = (next: CourseView | "chat", page?: string) => {
    if (next === "knowledge") {
      if (page) setKbPage(page);
    } else setItem(page ?? null);
    setView(next);
  };
  /** A file beside the conversation (#85), with the conversation shown next to it. */
  const beside = (file: string) => {
    side.openFile(file);
    setView("chat");
  };
  /** A text left in the chat's box to finish (an item's "Ask miyagi about this", a quote), and the conversation shown. */
  const [draft, setDraft] = useState<{ text: string; at: number } | null>(null);
  const language = chat?.language ?? info?.language;
  const actions: ActionsApi | null = chat
    ? {
        actions: chat.actions ?? [],
        lang: (language ?? "en").slice(0, 2).toLowerCase(),
        A: actionTexts(language),
        connected: Boolean(info?.classroom?.connected),
        busy: chat.busy,
        run: (action, value, launch) => (action.opens ? go("knowledge", action.opens) : ask(actionLine(action, value), launch && { ...launch, command: action.command })),
        compose: (text) => {
          setDraft({ text, at: Date.now() });
          setView("chat");
        },
        onLink: () => setLinking(true),
      }
    : null;

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // A page without storage keeps the theme for this visit only.
    }
  };
  useEffect(() => {
    if (theme === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    document.title = info?.workspace ? `${info.workspace} · miyagi` : "miyagi";
    document.documentElement.lang = (chat?.language ?? info?.language ?? "es").slice(0, 2);
  }, [info, chat?.language]);
  // Shift+Tab switches the mode, as in the terminal.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !event.shiftKey || !chat?.mode || chat.panel || chat.choice) return;
      const modes = chat.switchableModes;
      if (modes.length < 2) return;
      event.preventDefault();
      void act("mode", { mode: modes[(modes.indexOf(chat.mode) + 1) % modes.length] });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chat]);
  // A page tried to go where the browser doesn't: the disk, or the host's own address.
  useEffect(() => {
    if (refused) setToast(T.webRefused);
  }, [refused]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  // An approval or a question needs the person where the conversation is.
  useEffect(() => {
    if (chat?.panel || chat?.choice) setView("chat");
  }, [chat?.panel, chat?.choice]);

  const status = connection === "replaced" ? T.replaced : connection === "lost" ? T.lost : !state ? T.connecting : null;
  const shown: View = chat ? view : "chat";
  const titles: Record<View, [string, string?]> = {
    today: [C.nav.today, new Date().toLocaleDateString(chat?.language ?? info?.language ?? undefined, { weekday: "long", day: "numeric", month: "long" })],
    plan: [C.nav.plan, C.sub.plan],
    topics: [C.nav.topics],
    materials: [C.nav.materials, C.sub.materials],
    oven: [C.nav.oven, C.sub.oven],
    knowledge: [C.nav.knowledge, "knowledge/"],
    sources: [C.nav.sources, C.sub.sources],
    // The conversation's title once it has one; before, the subject and whether it has a classroom.
    chat: chat?.run?.title ? [chat.run.title] : [info?.workspace ?? "miyagi", info?.workspace ? (info.classroom?.connected ? X.withClassroom : X.withoutClassroom) : undefined],
    classroom: [X.navClassroom, X.classroomSubtitle],
    extensions: [X.navExtensions, X.extSubtitle],
  };
  const [title, subtitle] = titles[shown];
  // An approval or a question brings the conversation back at once, whatever the panel covers.
  const asking = Boolean(chat?.panel || chat?.choice);
  const withPanel = Boolean(chat && side.shown);
  // The views visited, for the title bar's ← and → (#87).
  // Only from a conversation on: before it, the page shows the conversation's place for lack of one.
  const started = Boolean(chat);
  const [settings, setSettings] = useState<PageSettings | null>(null);
  useEffect(() => {
    if (started) void act<PageSettings>("page-settings").then((saved) => saved.error || setSettings(saved));
  }, [started]);
  // The classroom's wizard, opened on creating the subject (#96), comes first as an approval does.
  const tour = useTour({ info, chat, asking: asking || linking, seen: settings ? (settings.tourSeen ?? 0) : null, onSeen: () => setSettings((now) => ({ ...now, tourSeen: TOUR_VERSION })), view: shown, setView, setDrawer: setSideOpen, collapsed: sideCollapsed, setCollapsed: setSideCollapsed });
  // The tips (#82): on opening a subject, after the tour, not over an approval; next time, the next one.
  const [tipAt, setTipAt] = useState<number | null>(null);
  const tipsTotal = tipsFor(language).tips.length;
  /** The furthest tip seen: only going beyond it moves what the next open shows. */
  const tipHead = useRef(0);
  const saveSettings = (changes: PageSettings) => {
    setSettings((now) => ({ ...now, ...changes }));
    void act("page-settings-save", { ...changes });
  };
  const showTip = () => {
    const at = tipIndex(settings?.tipsNext, tipsTotal);
    tipHead.current = at;
    setTipAt(at);
    saveSettings({ tipsNext: (at + 1) % tipsTotal });
  };
  const moveTip = (delta: number) => {
    if (tipAt === null) return;
    const at = (tipAt + delta + tipsTotal) % tipsTotal;
    setTipAt(at);
    if (at === (tipHead.current + 1) % tipsTotal) {
      tipHead.current = at;
      saveSettings({ tipsNext: (at + 1) % tipsTotal });
    }
  };
  // Once per subject opened, and never while the tour is due or on.
  const tipShownFor = useRef<string | null>(null);
  const tourDue = !settings || (settings.tourSeen ?? 0) < TOUR_VERSION;
  useEffect(() => {
    if (!chat || !info?.workspace || asking || linking || tour.step || tourDue || tipAt !== null) return;
    if (tipShownFor.current === info.workspace) return;
    tipShownFor.current = info.workspace;
    if (settings?.showTips !== false) showTip();
  }, [Boolean(chat), info?.workspace, asking, linking, Boolean(tour.step), tourDue, settings?.showTips]);
  // An approval or a question comes first: the tip goes, and doesn't come back.
  useEffect(() => {
    if (asking) setTipAt(null);
  }, [asking]);
  // The views the tour shows aren't visits.
  const touring = Boolean(tour.step);
  useEffect(() => {
    if (started && !touring) setHistory((now) => visit(now, shown));
  }, [started, shown, touring]);
  const travel = (delta: -1 | 1) => {
    const next = step(history, delta);
    setHistory(next);
    setView(next.list[next.at]);
  };
  return (
    <ActionsContext.Provider value={actions}>
    {info?.frame && <TitleBar info={info} T={T} canGoBack={canBack(history)} canGoForward={canForward(history)} onBack={() => travel(-1)} onForward={() => travel(1)} onSide={() => (matchMedia("(max-width: 760px)").matches ? setSideOpen(true) : setSideCollapsed(!sideCollapsed))} theme={theme} onNotice={setToast} />}
    <div className={`app${info?.frame ? " with-titlebar" : ""}${withPanel ? " with-panel" : ""}${withPanel && side.expanded ? " panel-full" : ""}${asking ? " asking" : ""}`} style={{ "--panel-width": `${side.width}px` } as CSSProperties}>
      <Frame info={info} chat={chat} view={shown} setView={setView} open={sideOpen} setOpen={setSideOpen} collapsed={sideCollapsed} setCollapsed={setSideCollapsed} theme={theme} setTheme={setTheme} T={T} X={X} C={C} G={G} H={H} tourStep={tour.step} onTour={tour.start} onTips={showTip} onNewSubject={() => setNewSubject(true)} onOpenExisting={() => setOpenExisting(true)} />
      <section className="main">
        <Header title={title} subtitle={subtitle} chat={chat} chatShown={shown === "chat"} collapsed={sideCollapsed && Boolean(info?.workspace)} T={T} X={X} onMenu={() => setSideOpen(true)} onExpand={() => setSideCollapsed(false)} onOpenChat={() => setView("chat")} panelTabs={chat ? side.tabs.list.length : 0} canBrowse={Boolean(chat && canBrowse)} panelShown={withPanel} onPanel={side.tabs.list.length ? side.toggle : () => void side.openWeb()} />
        <ViewTabs view={shown} setView={setView} C={C} />
        {status && (
          <div className="banner" role="status">
            {status}
          </div>
        )}
        <main className="view">
          {state && !state.signedIn && <SignIn T={T} state={state} />}
          {state?.signedIn && info && info.workspace === null && !state.opening && <StartScreen T={T} onLink={() => setLinking(true)} />}
          {/* A subject opening: its session starts before the conversation can show. */}
          {state?.signedIn && state.opening && !chat && <Waiting block text={T.opening} still={T.stillWorking} />}
          {chat && shown === "chat" && (
            <div className="chat">
              <Transcript chat={chat} T={T} go={go} beside={beside} onActivity={side.openActivity} />
              {/* A checkpoint takes the composer's place; the composer stays mounted, so a draft isn't lost. */}
              <div className="dock">
                <Panel chat={chat} T={T} />
                <div className="writer" hidden={Boolean(chat.panel || chat.choice)}>
                  <Todos chat={chat} T={T} />
                  <Composer
                    chat={chat}
                    T={T}
                    X={X}
                    onNotice={setToast}
                    onCapabilities={() => {
                      setExtTab("capabilities");
                      setView("extensions");
                    }}
                    draft={draft}
                  />
                </div>
              </div>
            </div>
          )}
          {chat && info && (() => {
            const common = { chat, info, C, ask, go, item, onLink: () => setLinking(true), linkTitle: X.linkTitle, beside };
            const bar = <ViewActions view={shown === "oven" ? "drafts" : shown} />;
            const body = (() => {
            switch (shown) {
              case "today":
                return <TodayView {...common} />;
              case "plan":
                return <PlanView {...common} />;
              case "topics":
                return <TopicsView {...common} />;
              case "materials":
                return <MaterialsView {...common} />;
              case "oven":
                return <OvenView {...common} />;
              case "knowledge":
                return <KnowledgeView {...common} page={kbPage} setPage={setKbPage} />;
              case "sources":
                return <SourcesView {...common} onNotice={setToast} />;
              default:
                return null;
            }
            })();
            return body && (
              <>
                {bar}
                {body}
              </>
            );
          })()}
          {chat && info && shown === "extensions" && <ExtensionsView chat={chat} info={info} X={X} tab={extTab} setTab={setExtTab} onNotice={setToast} onLink={() => setLinking(true)} />}
          {chat && info && shown === "classroom" && (
            <>
              <ViewActions view="classroom" />
              <ClassroomView chat={chat} info={info} X={X} onLink={() => setLinking(true)} />
            </>
          )}
        </main>
        <StatusBar chat={chat} T={T} inChat={shown === "chat"} onOpenChat={() => setView("chat")} showing={tour.step?.current.id === "statusBar" ? G.statusLine : undefined} />
      </section>
      {withPanel && chat && <SidePanel panel={side} chat={chat} browser={browser} canBrowse={canBrowse} classroom={info?.classroom?.url} T={T} C={C} />}
      {linking && info && (
        <LinkWizard
          info={info}
          busy={Boolean(chat?.busy)}
          X={X}
          onClose={closeLink}
          onNotice={setToast}
        />
      )}
      {openExisting && (
        <div className="scrim">
          <div className="dialog" role="dialog" aria-modal="true" aria-label={T.openExisting}>
            <OpenExisting T={T} onCancel={() => setOpenExisting(false)} />
          </div>
        </div>
      )}
      {newSubject && (
        <div className="scrim">
          <div className="dialog" role="dialog" aria-modal="true" aria-label={T.newSubject}>
            <NewSubjectForm T={T} onCancel={() => setNewSubject(false)} onLink={() => setLinking(true)} />
          </div>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      <SelectionMenu />
      {tipAt !== null && !tour.step && <TipsWindow at={tipAt} language={language} showTips={settings?.showTips !== false} H={H} onMove={moveTip} onShowTips={(show) => saveSettings({ showTips: show })} onClose={() => setTipAt(null)} />}
      {tour.step && !asking && !linking && <Tour step={tour.step.current} at={tour.step.at} total={tour.step.total} G={G} T={T} onMove={tour.move} onClose={tour.close} />}
    </div>
    </ActionsContext.Provider>
  );
}
