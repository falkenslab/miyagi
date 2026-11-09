import { useEffect } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { Info } from "../types";
import { Icon } from "./Icons";
import { Menu, type Theme } from "./Shell";

// The desktop app's title bar (#87), drawn in the page: draggable, with the app's ← → over the views
// visited, the sidebar's button and the menus; the window's own buttons are the system's, over its
// right end. Each entry is carried out by the host, as the window's roles (no preload, ADR-022); the
// keyboard shortcuts stay in the app's native menu. It only shows when the host says it's the app.

const DOCS = "https://falkenslab.github.io/miyagi/";

/** The menu's entries: the window's roles, with what today's native menu has. */
const roles = (T: Texts, devTools: boolean): { label: string; items: ([string, string, string?] | "-")[] }[] => [
  { label: T.menuFile, items: [[T.menuClose, "close", "Alt+F4"]] },
  { label: T.menuEdit, items: [[T.menuUndo, "undo", "Ctrl+Z"], [T.menuRedo, "redo", "Ctrl+Y"], "-", [T.menuCut, "cut", "Ctrl+X"], [T.menuCopy, "copy", "Ctrl+C"], [T.menuPaste, "paste", "Ctrl+V"], [T.menuDelete, "delete", "Supr"], [T.menuSelectAll, "selectAll", "Ctrl+A"]] },
  { label: T.menuView, items: [[T.menuReload, "reload", "Ctrl+R"], [T.menuResetZoom, "resetZoom", "Ctrl+0"], [T.menuZoomIn, "zoomIn", "Ctrl++"], [T.menuZoomOut, "zoomOut", "Ctrl+-"], "-", [T.menuFullScreen, "togglefullscreen", "F11"], ...(devTools ? ([[T.menuDevTools, "toggleDevTools", "Ctrl+Shift+I"]] as [string, string, string][]) : [])] },
];

export function TitleBar({ info, T, canGoBack, canGoForward, onBack, onForward, onSide, theme, onNotice }: { info: Info; T: Texts; canGoBack: boolean; canGoForward: boolean; onBack: () => void; onForward: () => void; onSide: () => void; theme: Theme; onNotice: (text: string) => void }) {
  // The system's window buttons take the bar's colours: at each change of theme, and of the system's.
  useEffect(() => {
    const send = () =>
      requestAnimationFrame(() => {
        const style = getComputedStyle(document.documentElement);
        void act("window-colors", { color: style.getPropertyValue("--bg-2").trim(), symbolColor: style.getPropertyValue("--text").trim() });
      });
    send();
    const dark = matchMedia("(prefers-color-scheme: dark)");
    dark.addEventListener("change", send);
    return () => dark.removeEventListener("change", send);
  }, [theme]);
  // Alt plus a menu's initial, as the native menu had.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.shiftKey) return;
      const menu = [...document.querySelectorAll<HTMLElement>(".titlebar .tb-menu")].find((button) => button.textContent?.[0]?.toLowerCase() === event.key.toLowerCase());
      if (!menu) return;
      event.preventDefault();
      menu.click();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const run = (role: string, close: () => void) => {
    void act("window-role", { role });
    close();
  };
  return (
    <div className="titlebar">
      <button type="button" className="tb-btn tb-back" title={T.tbBack} aria-label={T.tbBack} disabled={!canGoBack} onClick={onBack}>
        <Icon name="left" size={18} />
      </button>
      <button type="button" className="tb-btn tb-forward" title={T.tbForward} aria-label={T.tbForward} disabled={!canGoForward} onClick={onForward}>
        <Icon name="right" size={18} />
      </button>
      <button type="button" className="tb-btn tb-side" title={T.tbSidebar} aria-label={T.tbSidebar} onClick={onSide}>
        <Icon name="panel" size={18} />
      </button>
      <span className="tb-sep" aria-hidden="true" />
      {roles(T, Boolean(info.frameDevTools)).map((menu) => (
        <Menu key={menu.label} title={menu.label} ariaLabel={menu.label} className="tb-menu" popClass="tb-pop" label={menu.label}>
          {(close) => (
            <>
              {menu.items.map((item, index) =>
                item === "-" ? (
                  <hr key={index} className="tb-rule" />
                ) : (
                  <button type="button" key={item[1]} onMouseDown={(event) => event.preventDefault()} onClick={() => run(item[1], close)}>
                    <span className="grow">{item[0]}</span>
                    {item[2] && <small>{item[2]}</small>}
                  </button>
                ),
              )}
            </>
          )}
        </Menu>
      ))}
      <Menu title={T.menuHelp} ariaLabel={T.menuHelp} className="tb-menu" popClass="tb-pop" label={T.menuHelp}>
        {(close) => (
          <>
            <button type="button" onClick={() => { window.open(DOCS, "_blank"); close(); }}>
              <span className="grow">{T.menuDocs}</span>
            </button>
            <button type="button" onClick={() => { onNotice(`miyagi ${info.version} · agent-kit ${info.kit}`); close(); }}>
              <span className="grow">{T.menuAbout}</span>
            </button>
          </>
        )}
      </Menu>
      <span className="tb-drag" />
    </div>
  );
}
