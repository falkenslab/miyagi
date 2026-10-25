import { useCallback, useEffect, useState } from "react";
import { act, useMiyagi } from "./api";
import { Composer, Todos } from "./components/Composer";
import { KnowledgeView, MaterialsView, OvenView, PlanView, SourcesView, TodayView, TopicsView, type CourseView } from "./components/Course";
import { ClassroomView, ExtensionsView, LinkWizard, type ExtTab } from "./components/Extensions";
import { Panel } from "./components/Panel";
import { Header, Sidebar, type Theme, type View } from "./components/Shell";
import { SignIn } from "./components/SignIn";
import { NewSubjectForm, StartScreen } from "./components/Subjects";
import { Transcript } from "./components/Transcript";
import { texts } from "./i18n";
import { courseTexts } from "./i18n/course";
import { extTexts } from "./i18n/extensions";

const THEME_KEY = "miyagi.theme";

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
  const { info, state, connection } = useMiyagi();
  const [theme, setThemeState] = useState<Theme>(storedTheme);
  const [toast, setToast] = useState("");
  const [newSubject, setNewSubject] = useState(false);
  const [view, setView] = useState<View>("today");
  const [kbPage, setKbPage] = useState<string | null>(null);
  const [extTab, setExtTab] = useState<ExtTab>("installed");
  const [sideOpen, setSideOpen] = useState(false);
  const [linking, setLinking] = useState(false);
  const closeLink = useCallback(() => setLinking(false), []);
  const chat = state?.chat ?? null;
  const T = texts(chat?.language ?? info?.language);
  const X = extTexts(chat?.language ?? info?.language);
  const C = courseTexts(chat?.language ?? info?.language);
  /** A line to the chat from a view's button: sent as the teacher would type it, and the conversation shown. */
  const ask = (line: string) => {
    if (!chat || chat.busy) return;
    void act("send", { line });
    setView("chat");
  };
  const go = (next: CourseView | "chat", page?: string) => {
    if (page) setKbPage(page);
    setView(next);
  };

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
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  // An approval or a question needs the person where the conversation is.
  useEffect(() => {
    if (chat?.panel || chat?.choice) setView("chat");
  }, [chat?.panel, chat?.choice]);

  const status = connection === "replaced" ? T.replaced : connection === "lost" ? T.lost : !state ? T.connecting : state.opening ? T.opening : null;
  const shown: View = chat ? view : "chat";
  const titles: Record<View, [string, string?]> = {
    today: [C.nav.today, new Date().toLocaleDateString(chat?.language ?? info?.language ?? undefined, { weekday: "long", day: "numeric", month: "long" })],
    plan: [C.nav.plan, C.sub.plan],
    topics: [C.nav.topics],
    materials: [C.nav.materials, C.sub.materials],
    oven: [C.nav.oven, C.sub.oven],
    knowledge: [C.nav.knowledge, "knowledge/"],
    sources: [C.nav.sources, C.sub.sources],
    chat: [info?.workspace ?? "miyagi"],
    classroom: [X.navClassroom, X.classroomSubtitle],
    extensions: [X.navExtensions, X.extSubtitle],
  };
  const [title, subtitle] = titles[shown];
  return (
    <div className="app">
      <Sidebar info={info} chat={chat} view={shown} setView={setView} open={sideOpen} setOpen={setSideOpen} theme={theme} setTheme={setTheme} T={T} X={X} C={C} onNewSubject={() => setNewSubject(true)} />
      <section className="main">
        <Header
          title={title}
          subtitle={subtitle}
          chat={chat}
          info={info}
          T={T}
          X={X}
          onMenu={() => setSideOpen(true)}
          onCapabilities={() => {
            setExtTab("capabilities");
            setView("extensions");
          }}
          onLink={() => setLinking(true)}
          onSent={() => setView("chat")}
        />
        {status && (
          <div className="banner" role="status">
            {status}
          </div>
        )}
        <main className="view">
          {state && !state.signedIn && <SignIn T={T} />}
          {state?.signedIn && info && info.workspace === null && !state.opening && <StartScreen T={T} />}
          {chat && shown === "chat" && (
            <div className="chat">
              <Transcript chat={chat} workspace={info?.workspace ?? ""} T={T} />
              <div className="dock">
                <Todos chat={chat} />
                <Composer chat={chat} T={T} onNotice={setToast} />
              </div>
            </div>
          )}
          {chat && info && (() => {
            const common = { chat, info, C, ask, go, onLink: () => setLinking(true), linkTitle: X.linkTitle };
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
          })()}
          {chat && info && shown === "extensions" && <ExtensionsView chat={chat} info={info} X={X} tab={extTab} setTab={setExtTab} onNotice={setToast} onLink={() => setLinking(true)} />}
          {chat && info && shown === "classroom" && <ClassroomView chat={chat} info={info} X={X} onLink={() => setLinking(true)} />}
          {chat && <Panel chat={chat} T={T} />}
        </main>
      </section>
      {linking && info && (
        <LinkWizard
          info={info}
          busy={Boolean(chat?.busy)}
          X={X}
          onClose={closeLink}
          onNotice={setToast}
        />
      )}
      {newSubject && (
        <div className="scrim">
          <div className="dialog" role="dialog" aria-modal="true" aria-label={T.newSubject}>
            <NewSubjectForm T={T} onCancel={() => setNewSubject(false)} />
          </div>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
