import { useEffect, useState } from "react";
import { act, useMiyagi } from "./api";
import { Composer, Todos } from "./components/Composer";
import { Panel } from "./components/Panel";
import { SignIn } from "./components/SignIn";
import { NewSubjectForm, StartScreen } from "./components/Subjects";
import { TopBar, type Theme } from "./components/TopBar";
import { Transcript } from "./components/Transcript";
import { texts } from "./i18n";

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
  const chat = state?.chat ?? null;
  const T = texts(chat?.language ?? info?.language);

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

  const status = connection === "replaced" ? T.replaced : connection === "lost" ? T.lost : !state ? T.connecting : state.opening ? T.opening : null;
  return (
    <div className="app">
      <TopBar chat={chat} workspace={info?.workspace ?? null} theme={theme} setTheme={setTheme} T={T} onNewSubject={() => setNewSubject(true)} />
      {status && (
        <div className="banner" role="status">
          {status}
        </div>
      )}
      <main className="chat">
        {state && !state.signedIn && <SignIn T={T} />}
        {state?.signedIn && info && info.workspace === null && !state.opening && <StartScreen T={T} />}
        {chat && (
          <>
            <Transcript chat={chat} workspace={info?.workspace ?? ""} T={T} />
            <div className="dock">
              <Todos chat={chat} />
              <Composer chat={chat} T={T} onNotice={setToast} />
            </div>
            <Panel chat={chat} T={T} />
          </>
        )}
      </main>
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
