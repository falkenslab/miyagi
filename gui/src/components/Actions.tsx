import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { act, upload } from "../api";
import type { ActionTexts } from "../i18n/actions";
import type { ActionLaunch, ActionParameter, ItemData, PageAction } from "../types";
import { whileBusy } from "./StatusBar";

// miyagi's commands as actions of the page (contextual-actions #67): the catalog in ＋, the ⋯ menu
// of each item (also its right click, Shift+F10 or the menu key, and a long press on a phone), and
// the menu of selected text. An action sends its command through the chat as if typed, so the
// turn, its approvals and the register go as always; the page gets no power of its own.

export interface ActionsApi {
  actions: PageAction[];
  /** The page's language, two letters. */
  lang: string;
  A: ActionTexts;
  connected: boolean;
  busy: boolean;
  /** Sends the action's command with its value, or opens its page (`opens`); its item and form go with it (#106). */
  run: (action: PageAction, value?: string, launch?: Omit<ActionLaunch, "command">) => void;
  /** Leaves a text in the chat's box, to finish and send. */
  compose: (text: string) => void;
  onLink: () => void;
}

export const ActionsContext = createContext<ActionsApi | null>(null);
export const useActions = () => useContext(ActionsContext);

/** An action's name in the page's language; an extension's command without one, from its name. */
export function actionLabel(action: PageAction, lang: string): string {
  const own = action.label?.[lang] ?? action.label?.en ?? action.label?.["*"];
  if (own) return own;
  const base = action.command.slice(action.command.indexOf(":") + 1).replace(/-/g, " ");
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** What the chat gets: the command and its value, one line. */
export const actionLine = (action: PageAction, value?: string) => `/${action.command}${value ? ` ${value}` : ""}`;

/** A value for a command's line: one line, not endless. */
export const oneLine = (text: string) => text.replace(/\s+/g, " ").trim().slice(0, 500);

/** The action a line of the conversation launched, and its value, if it's one of the catalog's. */
export function launched(actions: PageAction[], line: string): { action: PageAction; value: string } | null {
  const match = /^\/(\S+)(?:\s+([\s\S]*))?$/.exec(line.trim());
  const action = match && actions.find((one) => one.command === match[1]);
  return action ? { action, value: (match[2] ?? "").trim() } : null;
}

const GROUPS = ["day", "create", "plan", "memory", "classroom"];

/** A text in the page's language, from `{ es, en, … }` or `{ "*": … }`. */
export const inLanguage = (text: Record<string, string> | undefined, lang: string) => text?.[lang] ?? text?.en ?? text?.["*"] ?? "";

/** The form's values as the command's line: `name: value` pairs, one line (#68). */
export const argumentsLine = (values: Record<string, string>) =>
  Object.entries(values)
    .filter(([, value]) => value.trim())
    .map(([name, value]) => `${name}: ${oneLine(value)}`)
    .join("; ");

/** What goes with an action's line: the item it was launched on and the form's values (#106). */
const launchOf = (item?: ItemData, form?: Record<string, string>): Omit<ActionLaunch, "command"> | undefined =>
  item || form ? { ...(item ? { kind: item.kind, item: item.data } : {}), ...(form ? { form: Object.fromEntries(Object.entries(form).filter(([, value]) => value.trim())) } : {}) } : undefined;

/** The item a menu was opened on fills the first parameter of its kind (a topic's title for a `topic`). */
function initialValues(parameters: ActionParameter[], value: string | undefined, kinds: string[]): Record<string, string> {
  const filled = parameters.find((one) => value && kinds.includes(one.type));
  return Object.fromEntries(parameters.map((one) => [one.name, one === filled ? value! : one.default !== undefined ? String(one.default) : ""]));
}

/**
 * An own command's form (#68): a field per parameter, prefilled from the item and the defaults,
 * checked before it's sent (required, numbers within their range). `unsaved`: the editor's try of
 * a command with changes not saved yet, which can be seen but not sent (#78).
 */
export function ParameterForm({ action, value, item, kinds, close, back, unsaved = false }: { action: PageAction; value?: string; item?: ItemData; kinds: string[]; close: () => void; back: () => void; unsaved?: boolean }) {
  const api = useActions()!;
  const { A, lang } = api;
  const parameters = action.parameters ?? [];
  const [values, setValues] = useState(() => initialValues(parameters, value, kinds));
  // The classroom's activities, for an `activity` field (#107).
  const [activities, setActivities] = useState<{ id: number; type: string; title?: string; url: string }[]>([]);
  useEffect(() => {
    if (!parameters.some((one) => one.type === "activity")) return;
    void act<{ items?: { id: number; type: string; title?: string; url: string }[] }>("classroom-items").then((result) => setActivities(result.items ?? []));
    // Once, when the form opens.
  }, []);
  // A field with `showIf` shows only while the other one has that value (#107); hidden, it's not sent.
  const shown = (one: ActionParameter) => !one.showIf || (values[one.showIf.name] ?? "").split(", ").includes(one.showIf.value);
  const problem = (one: ActionParameter) => {
    if (!shown(one)) return "";
    const text = values[one.name]?.trim() ?? "";
    if (one.required && !text) return A.required;
    if (one.type === "number" && text) {
      const number = Number(text);
      if (!Number.isFinite(number) || (one.min !== undefined && number < one.min) || (one.max !== undefined && number > one.max)) return A.between(one.min, one.max);
    }
    return "";
  };
  const invalid = parameters.some((one) => problem(one));
  // Opened on a topic, a word list starts with its concepts (#78); what's typed meanwhile stays.
  useEffect(() => {
    const words = parameters.find((one) => one.type === "words");
    if (!words || !value || !kinds.includes("topic")) return;
    let gone = false;
    act<{ words?: string[] }>("topic-words", { topic: value })
      .then((result) => {
        if (!gone && result.words?.length) setValues((now) => (now[words.name]?.trim() ? now : { ...now, [words.name]: result.words!.join(", ") }));
      })
      .catch(() => undefined);
    return () => {
      gone = true;
    };
    // Once, when the form opens.
  }, []);
  const set = (name: string, text: string) => setValues((now) => ({ ...now, [name]: text }));
  return (
    <form
      className="ask-form param-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (invalid || unsaved) return;
        close();
        const sent = Object.fromEntries(Object.entries(values).filter(([name]) => parameters.some((one) => one.name === name && shown(one))));
        api.run(action, argumentsLine(sent), launchOf(item, sent));
      }}
    >
      <b>
        <span aria-hidden="true">{action.icon}</span> {actionLabel(action, lang)}
      </b>
      {parameters.filter(shown).map((one, index) => {
        const id = `param-${action.command}-${one.name}`;
        const help = inLanguage(one.help, lang);
        // Required fields say so with their *; a value out of range, as it's typed.
        const error = Boolean(values[one.name]?.trim()) && problem(one);
        return (
          <label key={one.name} htmlFor={id}>
            <span>
              {inLanguage(one.label, lang) || one.name}
              {one.required && <span aria-hidden="true"> *</span>}
            </span>
            {one.type === "choice" ? (
              <select id={id} className="field" value={values[one.name]} onChange={(event) => set(one.name, event.target.value)}>
                {!one.required && <option value="" />}
                {one.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : one.type === "multichoice" ? (
              <span id={id} className="checks" role="group">
                {one.options?.map((option) => {
                  const chosen = (values[one.name] ?? "").split(", ").filter(Boolean);
                  return (
                    <label key={option} className="check">
                      <input type="checkbox" checked={chosen.includes(option)} onChange={(event) => set(one.name, (event.target.checked ? [...chosen, option] : chosen.filter((other) => other !== option)).join(", "))} /> {option}
                    </label>
                  );
                })}
              </span>
            ) : one.type === "activity" ? (
              <select id={id} className="field" value={values[one.name]} onChange={(event) => set(one.name, event.target.value)}>
                <option value="" />
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.url}>
                    {activity.title ?? `${activity.type} ${activity.id}`}
                  </option>
                ))}
              </select>
            ) : one.type === "file" ? (
              <span className="row">
                <input
                  id={id}
                  type="file"
                  className="field"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(file).then((result) => set(one.name, result.path ?? result.duplicateOf ?? ""));
                  }}
                />
                {values[one.name] && <small className="muted">{values[one.name]}</small>}
              </span>
            ) : one.type === "words" ? (
              <textarea id={id} className="field" rows={2} value={values[one.name]} onChange={(event) => set(one.name, event.target.value)} />
            ) : (
              <input
                id={id}
                className="field"
                autoFocus={index === 0}
                type={one.type === "number" ? "number" : one.type === "date" ? "date" : "text"}
                min={one.min}
                max={one.max}
                required={one.required}
                value={values[one.name]}
                onChange={(event) => set(one.name, event.target.value)}
              />
            )}
            {help && <small className="muted">{help}</small>}
            {error && <small className="field-error">{error}</small>}
          </label>
        );
      })}
      {unsaved && <small className="muted">{A.saveToSend}</small>}
      <div className="row">
        <span className="sp" />
        <button type="button" className="btn small" onClick={back}>
          {A.cancel}
        </button>
        <button type="submit" className="btn small primary" {...whileBusy(api.busy, invalid || unsaved)}>
          {A.send}
        </button>
      </div>
    </form>
  );
}

/**
 * Actions as the rows of a popover. One that needs a value and has none asks for it right there;
 * one that needs the classroom without one is disabled and says why. Grouped, in the catalog.
 */
export function ActionList({ list, value, item, kinds = [], close, grouped = false }: { list: PageAction[]; value?: string; item?: ItemData; kinds?: string[]; close: () => void; grouped?: boolean }) {
  const api = useActions();
  const [asking, setAsking] = useState<PageAction | null>(null);
  const [text, setText] = useState("");
  if (!api) return null;
  const { A, lang } = api;
  if (asking?.parameters?.length) return <ParameterForm action={asking} value={value} item={item} kinds={kinds} close={close} back={() => setAsking(null)} />;
  if (asking)
    return (
      <form
        className="ask-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!text.trim()) return;
          close();
          api.run(asking, oneLine(text), launchOf(item));
        }}
      >
        <label>
          <b>
            <span aria-hidden="true">{asking.icon}</span> {actionLabel(asking, lang)}
          </b>
          <span className="muted">{asking.ask?.[lang] ?? asking.ask?.en}</span>
          <input className="field" autoFocus value={text} onChange={(event) => setText(event.target.value)} />
        </label>
        <div className="row">
          <span className="sp" />
          <button type="button" className="btn small" onClick={() => setAsking(null)}>
            {A.cancel}
          </button>
          <button type="submit" className="btn small primary" {...whileBusy(api.busy, !text.trim())}>
            {A.send}
          </button>
        </div>
      </form>
    );
  const row = (action: PageAction) => {
    const off = Boolean(action.needsClassroom && !api.connected);
    return (
      <button
        key={action.command}
        type="button"
        role="menuitem"
        data-command={action.command}
        {...whileBusy(api.busy && !action.opens, off)}
        {...(off ? { title: A.needsClassroom } : {})}
        onClick={() => {
          if (action.parameters?.length || (action.ask && !value && !action.opens)) return setAsking(action);
          close();
          api.run(action, value, launchOf(item));
        }}
      >
        <span className="act-icon" aria-hidden="true">
          {action.icon ?? "•"}
        </span>
        <span className="grow">
          {actionLabel(action, lang)}
          {off && <small>{A.needsClassroom}</small>}
        </span>
      </button>
    );
  };
  if (!grouped) return <>{list.map(row)}</>;
  const extensions = [...new Set(list.filter((action) => !GROUPS.includes(action.group ?? "")).map((action) => action.extension ?? "other"))];
  return (
    <>
      {GROUPS.map((group) => {
        const rows = list.filter((action) => action.group === group);
        return (
          rows.length > 0 && (
            <div key={group} role="group" aria-label={A.groups[group]}>
              <h4 className="pop-title small-caps">{A.groups[group]}</h4>
              {group === "classroom" && !api.connected && (
                <button
                  type="button"
                  onClick={() => {
                    close();
                    api.onLink();
                  }}
                >
                  <span className="act-icon" aria-hidden="true">
                    🔗
                  </span>
                  <span className="grow">{A.linkClassroom}</span>
                </button>
              )}
              {rows.map(row)}
            </div>
          )
        );
      })}
      {extensions.map((name) => (
        <div key={name} role="group" aria-label={name}>
          <h4 className="pop-title small-caps">{name === "other" ? A.groups.other : name}</h4>
          {list.filter((action) => !GROUPS.includes(action.group ?? "") && (action.extension ?? "other") === name).map(row)}
        </div>
      ))}
    </>
  );
}

/** Where a menu opened: at the ⋯ button, or where the right click was. */
type At = "button" | { x: number; y: number } | null;

/**
 * An item's menu (a topic, a material, a source, a page, the plan…): the actions that apply to
 * its kinds, with the item as their value, and "Ask miyagi about this". `bind` goes on the item
 * (right click, Shift+F10 or the menu key, a long press), `button` is its ⋯ with the menu.
 */
export function useItemMenu(kinds: string[], value: string, name = value, item?: ItemData) {
  const api = useActions();
  const [at, setAt] = useState<At>(null);
  const pop = useRef<HTMLDivElement>(null);
  const press = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!at) return;
    const away = (event: globalThis.MouseEvent) => {
      if (!pop.current?.contains(event.target as Node)) setAt(null);
    };
    const key = (event: globalThis.KeyboardEvent) => event.key === "Escape" && setAt(null);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", key);
    };
  }, [at]);
  const list = api?.actions.filter((action) => action.appliesTo?.some((kind) => kinds.includes(kind))) ?? [];
  const release = () => window.clearTimeout(press.current);
  const bind = {
    onContextMenu: (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("input, textarea, .pop")) return;
      event.preventDefault();
      setAt({ x: event.clientX, y: event.clientY });
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
      event.preventDefault();
      setAt("button");
    },
    onTouchStart: () => {
      release();
      press.current = window.setTimeout(() => setAt("button"), 550);
    },
    onTouchEnd: release,
    onTouchMove: release,
    onTouchCancel: release,
  };
  if (!api) return { bind: {}, button: null };
  const close = () => setAt(null);
  const point: CSSProperties | undefined =
    at && at !== "button" ? ({ "--x": `${Math.max(8, Math.min(at.x, innerWidth - 300))}px`, "--y": `${Math.max(8, Math.min(at.y, innerHeight - 340))}px` } as CSSProperties) : undefined;
  const button = (
    <span className="menu item-menu">
      <button
        type="button"
        className="ibtn more-btn"
        aria-label={api.A.more(name)}
        title={api.A.more(name)}
        aria-haspopup="menu"
        aria-expanded={Boolean(at)}
        onClick={(event) => {
          event.stopPropagation();
          setAt(at ? null : "button");
        }}
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {at && <div className="pop-scrim" onClick={close} aria-hidden="true" />}
      {at && (
        <div ref={pop} className={`pop item-pop${point ? " at-point" : ""}`} style={point} role="menu" aria-label={name}>
          <span className="grab" aria-hidden="true" />
          <h4 className="pop-title small-caps ellipsis">{name}</h4>
          <ActionList list={list} value={value} item={item} kinds={kinds} close={close} />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              api.compose(api.A.aboutPrefix(name));
            }}
          >
            <span className="act-icon" aria-hidden="true">
              💬
            </span>
            <span className="grow">{api.A.askAbout}</span>
          </button>
        </div>
      )}
    </span>
  );
  return { bind, button };
}

/** An item with its ⋯ menu, as a block (a card, a row of a list). */
export function Actionable({ kinds, value, name, item, className = "", children }: { kinds: string[]; value: string; name?: string; item?: ItemData; className?: string; children: ReactNode }) {
  const { bind, button } = useItemMenu(kinds, value, name, item);
  return (
    <div className={`actionable ${className}`} {...bind}>
      {children}
      {button}
    </div>
  );
}

/**
 * Selected text in the conversation or in a knowledge page (inside `[data-select-actions]`):
 * a small floating menu to research it, make questions about it or quote it in the chat.
 */
export function SelectionMenu() {
  const api = useActions();
  const [shown, setShown] = useState<{ text: string; x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const look = (event: Event) => {
      if (box.current?.contains(event.target as Node)) return;
      // After the click that ends the selection has settled.
      window.setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim() ?? "";
        const node = selection?.anchorNode;
        const inside = node && (node instanceof Element ? node : node.parentElement)?.closest("[data-select-actions]");
        if (!selection || selection.isCollapsed || text.length < 3 || !inside) return setShown(null);
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setShown({ text, x: Math.max(8, Math.min(rect.left, innerWidth - 260)), y: Math.min(rect.bottom + 8, innerHeight - 160) });
      }, 0);
    };
    document.addEventListener("mouseup", look);
    document.addEventListener("keyup", look);
    document.addEventListener("touchend", look);
    return () => {
      document.removeEventListener("mouseup", look);
      document.removeEventListener("keyup", look);
      document.removeEventListener("touchend", look);
    };
  }, []);
  if (!api || !shown) return null;
  const done = () => {
    setShown(null);
    window.getSelection()?.removeAllRanges();
  };
  const find = (command: string) => api.actions.find((action) => action.command === command && action.appliesTo?.includes("text"));
  const research = find("miyagi:research");
  const quiz = find("miyagi:quiz");
  return (
    <div ref={box} className="select-menu" role="menu" style={{ left: shown.x, top: shown.y }} onMouseDown={(event) => event.preventDefault()}>
      {research && (
        <button type="button" role="menuitem" {...whileBusy(api.busy)} onClick={() => (done(), api.run(research, oneLine(shown.text)))}>
          {research.icon} {api.A.researchThis}
        </button>
      )}
      {quiz && (
        <button type="button" role="menuitem" {...whileBusy(api.busy)} onClick={() => (done(), api.run(quiz, oneLine(shown.text)))}>
          {quiz.icon} {api.A.quizThis}
        </button>
      )}
      <button type="button" role="menuitem" onClick={() => (done(), api.compose(`${shown.text.split(/\r?\n/).map((line) => `> ${line}`).join("\n")}\n\n`))}>
        ❝ {api.A.quote}
      </button>
    </div>
  );
}

/** One group of the catalog as a row of buttons (Today's day to day, the classroom's), those that need no value. */
/**
 * The classroom page open beside the chat as an item (#107): an activity, the grading of an
 * assignment or a forum discussion, from its address. Never who a submission is from.
 */
export function classroomPageItem(url: string, title: string): ItemData | null {
  let address: URL;
  try {
    address = new URL(url);
  } catch {
    return null;
  }
  const name = title.split(/\s+[|·-]\s+/)[0]?.trim() || undefined;
  const id = Number(address.searchParams.get("id"));
  const discussion = Number(address.searchParams.get("d"));
  const module = /\/mod\/([a-z0-9_]+)\/(view|discuss)\.php$/i.exec(address.pathname);
  if (!module) return null;
  const clean = `${address.origin}${address.pathname}${address.search}`;
  if (module[2] === "discuss" && discussion) return { kind: "thread", data: { id: discussion, title: name, url: clean } };
  if (module[1] === "assign" && id && /grad|submission/.test(address.searchParams.get("action") ?? "")) return { kind: "submission", data: { assignment: id, url: clean } };
  return id ? { kind: "activity", data: { id, type: module[1]!.toLowerCase(), title: name, url: clean } } : null;
}

/** A view's own actions (#107): those whose `views` name it, as buttons above the view. */
export function ViewActions({ view }: { view: string }) {
  const api = useActions();
  if (!api) return null;
  const list = api.actions.filter((action) => action.views?.includes(view));
  if (!list.length) return null;
  return (
    <div className="wrap view-actions row wrap-row" role="group" aria-label={api.A.viewActions}>
      {list.map((action) => {
        const off = Boolean(action.needsClassroom && !api.connected);
        return (
          <button key={action.command} type="button" className="btn small" data-command={action.command} {...whileBusy(api.busy && !action.opens, off)} {...(off ? { title: api.A.needsClassroom } : {})} onClick={() => api.run(action, undefined, { kind: "view", item: { view } })}>
            <span aria-hidden="true">{action.icon}</span> {actionLabel(action, api.lang)}
          </button>
        );
      })}
    </div>
  );
}

export function GroupActions({ group }: { group: string }) {
  const api = useActions();
  if (!api) return null;
  const list = api.actions.filter((action) => action.group === group && !action.ask);
  if (!list.length) return null;
  return (
    <div className="row wrap-row" role="group" aria-label={api.A.groups[group] ?? group}>
      {list.map((action) => {
        const off = Boolean(action.needsClassroom && !api.connected);
        return (
          <button key={action.command} type="button" className="btn small" data-command={action.command} {...whileBusy(api.busy && !action.opens, off)} {...(off ? { title: api.A.needsClassroom } : {})} onClick={() => api.run(action)}>
            <span aria-hidden="true">{action.icon}</span> {actionLabel(action, api.lang)}
          </button>
        );
      })}
    </div>
  );
}
