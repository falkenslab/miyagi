import { ActionList, classroomPageItem, useActions } from "./Actions";
import { useEffect, useRef, useState } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { BrowserTab } from "../types";
import { Icon } from "./Icons";
import { Menu } from "./Shell";

// The side panel's web browser (#86), only in the desktop app: the bar drawn here, the page itself a
// native view over the place this component reserves. The native side holds the tabs and tells them
// on the host's events; here is what the teacher does. A native view is painted over the page, so
// while a menu or a dialog of the page would fall under it, a still takes its place. No address or
// page content is sent anywhere but to the host's browser actions.

/** The native side's actions, one after the other: a rectangle sent before a "hide" must not land after it. */
let queue: Promise<unknown> = Promise.resolve();
export function native<T = Record<string, unknown>>(action: string, data: Record<string, unknown> = {}): Promise<T & { error?: string }> {
  const next = queue.then(() => act<T>(action, data));
  queue = next.catch(() => undefined);
  return next;
}

export const tabTitle = (tab: BrowserTab | undefined, T: Texts) => tab?.title || tab?.url || T.webNewPage;

/** Something of the page drawn over `box` (a menu, a dialog, a sheet), found where the pointer would: grid points every 40 px. */
function covered(box: HTMLElement, rect: DOMRect): boolean {
  const STEP = 40;
  for (let y = rect.top + 8; y < rect.bottom; y += STEP) {
    for (let x = rect.left + 8; x < rect.right; x += STEP) {
      const top = document.elementFromPoint(x, y);
      // The panel's divider overlaps the edge of its body, and stays reachable.
      if (top && !box.contains(top) && !top.closest(".side-handle")) return true;
    }
  }
  return false;
}

/** The rows above the page: back, forward, reload, the address in a pill, and the rest under ⋯ when the panel is narrow. */
export function WebBar({ tab, tabs, T }: { tab: BrowserTab; tabs: BrowserTab[]; T: Texts }) {
  const [draft, setDraft] = useState(tab.url);
  // The classroom page open here, as an item its actions apply to (#107).
  const pageItem = classroomPageItem(tab.url, tab.title);
  const pageActions = useActions()?.actions.filter((action) => pageItem && action.appliesTo?.includes(pageItem.kind)) ?? [];
  const typing = useRef(false);
  const [refusal, setRefusal] = useState("");
  const [copied, setCopied] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  // The address the page reached, unless the teacher is typing another.
  useEffect(() => {
    if (!typing.current) setDraft(tab.url);
  }, [tab.url]);
  // A new tab waits for an address.
  useEffect(() => {
    if (!tab.url) field.current?.focus();
  }, []);
  const go = async () => {
    setRefusal("");
    const result = await native<{ url?: string }>("browser-navigate", { id: tab.id, url: draft });
    if (result.error) setRefusal(result.error === "refused" ? T.webRefused : T.webInvalid);
    else {
      typing.current = false;
      field.current?.blur();
    }
  };
  const copy = () => {
    void navigator.clipboard?.writeText(tab.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }, () => undefined);
  };
  const external = () => void native("browser-external", { id: tab.id });
  const zoom = (delta: number) => void native("browser-zoom", { id: tab.id, delta });
  const others = tabs.filter((one) => one.id !== tab.id);
  return (
    <div className="web-bar">
      <div className="web-row">
        <button type="button" className="ibtn plain web-back" title={T.webBack} aria-label={T.webBack} disabled={!tab.canBack} onClick={() => void native("browser-back", { id: tab.id })}>
          <Icon name="left" />
        </button>
        <button type="button" className="ibtn plain web-forward" title={T.webForward} aria-label={T.webForward} disabled={!tab.canForward} onClick={() => void native("browser-forward", { id: tab.id })}>
          <Icon name="right" />
        </button>
        <button type="button" className="ibtn plain web-reload" title={T.webReload} aria-label={T.webReload} disabled={!tab.url} onClick={() => void native("browser-reload", { id: tab.id })}>
          <Icon name="reload" />
        </button>
        <button type="button" className="ibtn plain web-wide web-external" title={T.webOpenSystem} aria-label={T.webOpenSystem} disabled={!tab.url} onClick={external}>
          <Icon name="external" />
        </button>
        <form
          className="web-address"
          onSubmit={(event) => {
            event.preventDefault();
            void go();
          }}
        >
          <input ref={field} className="field" value={draft} aria-label={T.webAddress} placeholder={T.webPlaceholder} spellCheck={false} onFocus={(event) => event.target.select()} onBlur={() => { if (!draft.trim()) { typing.current = false; setDraft(tab.url); } }} onChange={(event) => { typing.current = true; setDraft(event.target.value); setRefusal(""); }} />
        </form>
        <button type="button" className="ibtn plain web-wide web-copy" title={T.webCopyLink} aria-label={T.webCopyLink} disabled={!tab.url} onClick={copy}>
          <Icon name={copied ? "check" : "copy"} />
        </button>
        <Menu title={T.webMore} ariaLabel={T.webMore} className="ibtn plain web-more" label={<span aria-hidden="true">⋯</span>}>
          {(close) => (
            <>
              {pageItem && pageActions.length > 0 && <ActionList list={pageActions} value={tab.url} item={pageItem} kinds={[pageItem.kind]} close={close} />}
              <button type="button" disabled={!tab.url} onClick={() => (external(), close())}>
                <Icon name="external" />
                <span>{T.webOpenSystem}</span>
              </button>
              <button type="button" disabled={!tab.url} onClick={() => (copy(), close())}>
                <Icon name="copy" />
                <span>{T.webCopyLink}</span>
              </button>
              <button type="button" disabled={!tab.url} onClick={() => zoom(1)}>
                <Icon name="plus" />
                <span>{T.webZoomIn}</span>
              </button>
              <button type="button" disabled={!tab.url} onClick={() => zoom(-1)}>
                <Icon name="minus" />
                <span>{T.webZoomOut}</span>
              </button>
              <button type="button" disabled={!tab.url} onClick={() => (zoom(0), close())}>
                <Icon name="search" />
                <span>{T.webZoomReset}</span>
              </button>
              <button type="button" disabled={!others.length} onClick={() => { others.forEach((one) => void native("browser-close", { id: one.id })); close(); }}>
                <Icon name="x" />
                <span>{T.webCloseOthers}</span>
              </button>
            </>
          )}
        </Menu>
      </div>
      {refusal && (
        <p className="web-refusal" role="alert">
          {refusal}
        </p>
      )}
    </div>
  );
}

/** The tab's place in the panel: the native view is put over it, frame by frame; a still while it would hide something of the page. */
export function WebBody({ tab, active, classroom, T }: { tab: BrowserTab; active: boolean; classroom?: string; T: Texts }) {
  const box = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState<string>();
  const shows = active && Boolean(tab.url) && !tab.failed;
  const id = tab.id;
  useEffect(() => {
    if (!shows) return;
    let frame = 0;
    let placed = "";
    let frozen = false;
    let turn = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const el = box.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0;
      if (visible && covered(el, rect)) {
        if (frozen) return;
        frozen = true;
        const mine = ++turn;
        void native<{ image?: string }>("browser-capture", { id }).then(({ image }) => {
          if (mine !== turn) return;
          setStill(image);
          void native("browser-bounds", { rect: null });
        });
        return;
      }
      const shape = visible ? { x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) } : null;
      const key = JSON.stringify(shape);
      if (key === placed && !frozen) return;
      placed = key;
      frozen = false;
      turn++;
      void native("browser-bounds", { rect: shape }).then(() => setStill(undefined));
    };
    tick();
    return () => {
      cancelAnimationFrame(frame);
      turn++;
      setStill(undefined);
      void native("browser-bounds", { rect: null });
    };
  }, [shows, id]);
  return (
    <div className="web-page" ref={box}>
      {still && <img className="web-still" src={still} alt="" />}
      {active && !tab.url && (
        <div className="web-empty">
          <Icon name="globe" size={36} />
          <p className="muted">{T.webEmpty}</p>
          {classroom && (
            <button type="button" className="btn small tall" onClick={() => void native("browser-navigate", { id, url: classroom })}>
              {T.webClassroom}
            </button>
          )}
        </div>
      )}
      {active && tab.failed && (
        <div className="web-empty">
          <p className="muted">{T.webFailed}</p>
        </div>
      )}
    </div>
  );
}
