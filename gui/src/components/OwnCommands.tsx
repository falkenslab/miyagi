import { useCallback, useEffect, useState } from "react";
import type { ExtTexts } from "../i18n/extensions";
import type { ActionParameter, ChatState, CommandDraft, OwnCommand, PageAction } from "../types";
import { inLanguage, ParameterForm, useActions } from "./Actions";
import { run } from "./Extensions";
import { Dialog } from "./Panel";
import { whileBusy } from "./StatusBar";
import { Waiting } from "./Waiting";

// The teacher's own commands in the page (own-commands-editor #78): see, change, try and delete
// them without talking to miyagi. Creating one is still done by talking (`command-authoring`).
// The host saves a change under the same checks as miyagi's own `commands_save`.

type Notice = (text: string) => void;

const GROUPS = ["day", "create", "plan", "memory", "classroom"];
const KINDS = ["topic", "material", "quiz", "source", "page", "plan", "draft", "text"];
const TYPES: ActionParameter["type"][] = ["text", "number", "choice", "words", "topic", "source", "page"];
const MAX_PARAMETERS = 8;

/** A text in the language shown, keeping the others; one for every language stays one. */
const setInLanguage = (text: Record<string, string>, lang: string, value: string) => ("*" in text ? { "*": value } : { ...text, [lang]: value });

/** What's typed as what the file keeps: a number's values as numbers, only what its type uses. */
function cleaned(draft: CommandDraft): CommandDraft {
  return {
    ...draft,
    parameters: draft.parameters.map((one) => {
      const text = one.default === undefined ? "" : String(one.default).trim();
      const number = one.type === "number" && text !== "" && Number.isFinite(Number(text));
      return {
        ...one,
        default: text === "" ? undefined : number ? Number(text) : text,
        min: one.type === "number" ? one.min : undefined,
        max: one.type === "number" ? one.max : undefined,
        options: one.type === "choice" ? (one.options ?? []).map((option) => option.trim()).filter(Boolean) : undefined,
      };
    }),
  };
}

export function OwnCommandsTab({ chat, X, onNotice }: { chat: ChatState; X: ExtTexts; onNotice: Notice }) {
  const api = useActions();
  const [commands, setCommands] = useState<OwnCommand[] | null>(null);
  const [editing, setEditing] = useState<OwnCommand | null>(null);
  const load = useCallback(async () => {
    const result = await run<{ commands: OwnCommand[] }>("own-commands", {}, X, onNotice);
    setCommands(result?.commands ?? []);
  }, [X, onNotice]);
  // Also when a turn ends: it may have saved one.
  useEffect(() => {
    void load();
  }, [load, chat.busy]);
  if (!commands) return <Waiting text={X.loading} still={X.stillWorking} />;
  const O = X.own;
  return (
    <>
      <p className="muted">{O.intro}</p>
      {commands.length === 0 && <p className="muted">{O.none}</p>}
      <div className="own-list">
        {commands.map((one) => (
          <div key={one.command} className="own-row">
            <span className="act-icon" aria-hidden="true">
              {one.draft.icon ?? "•"}
            </span>
            <span className="grow">
              <b>{inLanguage(one.draft.label, api?.lang ?? "en") || one.name}</b> <span className="badge">{one.scope === "all" ? O.scopeAll : O.scopeSubject}</span>
              <small className="muted">{one.draft.description}</small>
            </span>
            <button type="button" className="btn small" onClick={() => setEditing(one)}>
              {O.edit}
            </button>
          </div>
        ))}
      </div>
      {editing && (
        <CommandEditor
          key={editing.command}
          own={editing}
          chat={chat}
          X={X}
          onNotice={onNotice}
          onClose={() => setEditing(null)}
          onChanged={() => {
            setEditing(null);
            void load();
          }}
        />
      )}
    </>
  );
}

function CommandEditor({ own, chat, X, onNotice, onClose, onChanged }: { own: OwnCommand; chat: ChatState; X: ExtTexts; onNotice: Notice; onClose: () => void; onChanged: () => void }) {
  const api = useActions()!;
  const { A, lang } = api;
  const O = X.own;
  const [name, setName] = useState(own.name);
  const [draft, setDraft] = useState<CommandDraft>(own.draft);
  const [confirming, setConfirming] = useState<"save" | "delete" | null>(null);
  const [trying, setTrying] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const change = (part: Partial<CommandDraft>) => {
    setDraft((now) => ({ ...now, ...part }));
    setConfirming(null);
    setErrors([]);
  };
  const setParameter = (index: number, part: Partial<ActionParameter>) => change({ parameters: draft.parameters.map((one, at) => (at === index ? { ...one, ...part } : one)) });
  const move = (index: number, by: number) => {
    const parameters = [...draft.parameters];
    parameters.splice(index + by, 0, ...parameters.splice(index, 1));
    change({ parameters });
  };
  const toggleKind = (kind: string) => change({ appliesTo: draft.appliesTo.includes(kind) ? draft.appliesTo.filter((one) => one !== kind) : [...draft.appliesTo, kind] });
  const unsaved = name !== own.name || JSON.stringify(cleaned(draft)) !== JSON.stringify(cleaned(own.draft));
  const save = async () => {
    const result = await run<{ errors: string[] }>("own-command-save", { scope: own.scope, name, previous: own.name, draft: cleaned(draft) }, X, onNotice);
    setConfirming(null);
    if (!result) return;
    if (result.errors.length) return setErrors(result.errors);
    onNotice(O.saved(name));
    onChanged();
  };
  const remove = async () => {
    const result = await run<{ errors: string[] }>("own-command-delete", { scope: own.scope, name: own.name }, X, onNotice);
    setConfirming(null);
    if (!result) return;
    if (result.errors.length) return setErrors(result.errors);
    onNotice(O.deleted(own.name));
    onChanged();
  };
  const title = inLanguage(draft.label, lang) || name;
  if (trying) {
    const action: PageAction = { command: own.command, label: draft.label, icon: draft.icon, parameters: cleaned(draft).parameters };
    return (
      <Dialog title={O.tryTitle(title)} onEscape={() => setTrying(false)}>
        <ParameterForm action={action} kinds={[]} unsaved={unsaved} close={onClose} back={() => setTrying(false)} />
      </Dialog>
    );
  }
  return (
    <Dialog title={title} onEscape={onClose}>
      <form className="own-form" onSubmit={(event) => event.preventDefault()}>
        <div className="own-grid">
          <label>
            <span>{O.label}</span>
            <input className="field" value={inLanguage(draft.label, lang)} onChange={(event) => change({ label: setInLanguage(draft.label, lang, event.target.value) })} />
          </label>
          <label>
            <span>{O.icon}</span>
            <input className="field" value={draft.icon ?? ""} onChange={(event) => change({ icon: event.target.value })} />
          </label>
          <label>
            <span>{O.group}</span>
            <select className="field" value={draft.group ?? ""} onChange={(event) => change({ group: event.target.value || undefined })}>
              <option value="">{A.groups.other}</option>
              {GROUPS.map((group) => (
                <option key={group} value={group}>
                  {A.groups[group]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          <span>{O.name}</span>
          <input
            className="field"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setConfirming(null);
              setErrors([]);
            }}
          />
          <small className="muted">{O.nameHelp}</small>
        </label>
        <label>
          <span>{O.description}</span>
          <input className="field" value={draft.description} onChange={(event) => change({ description: event.target.value })} />
        </label>
        <fieldset className="own-kinds">
          <legend>{O.appliesTo}</legend>
          {KINDS.map((kind) => (
            <label key={kind} className="check">
              <input type="checkbox" checked={draft.appliesTo.includes(kind)} onChange={() => toggleKind(kind)} />
              <span>{O.kinds[kind]}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="own-params">
          <legend>{O.parameters}</legend>
          {draft.parameters.map((one, index) => (
            <div key={index} className="own-param">
              <div className="own-grid">
                <label>
                  <span>{O.paramName}</span>
                  <input className="field" value={one.name} onChange={(event) => setParameter(index, { name: event.target.value })} />
                </label>
                <label>
                  <span>{O.paramLabel}</span>
                  <input className="field" value={inLanguage(one.label, lang)} onChange={(event) => setParameter(index, { label: setInLanguage(one.label, lang, event.target.value) })} />
                </label>
                <label>
                  <span>{O.type}</span>
                  <select className="field" value={one.type} onChange={(event) => setParameter(index, { type: event.target.value as ActionParameter["type"] })}>
                    {TYPES.map((type) => (
                      <option key={type} value={type}>
                        {O.types[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>{O.defaultValue}</span>
                  <input className="field" value={one.default ?? ""} onChange={(event) => setParameter(index, { default: event.target.value })} />
                </label>
                {one.type === "number" && (
                  <>
                    <label>
                      <span>{O.min}</span>
                      <input className="field" type="number" value={one.min ?? ""} onChange={(event) => setParameter(index, { min: event.target.value === "" ? undefined : Number(event.target.value) })} />
                    </label>
                    <label>
                      <span>{O.max}</span>
                      <input className="field" type="number" value={one.max ?? ""} onChange={(event) => setParameter(index, { max: event.target.value === "" ? undefined : Number(event.target.value) })} />
                    </label>
                  </>
                )}
              </div>
              {one.type === "choice" && (
                <label>
                  <span>{O.options}</span>
                  <input className="field" value={(one.options ?? []).join(",")} onChange={(event) => setParameter(index, { options: event.target.value.split(",") })} />
                </label>
              )}
              <div className="row">
                <label className="check">
                  <input type="checkbox" checked={one.required} onChange={(event) => setParameter(index, { required: event.target.checked })} />
                  <span>{O.required}</span>
                </label>
                <span className="sp" />
                <button type="button" className="ibtn" aria-label={O.up(one.name)} title={O.up(one.name)} disabled={index === 0} onClick={() => move(index, -1)}>
                  <span aria-hidden="true">↑</span>
                </button>
                <button type="button" className="ibtn" aria-label={O.down(one.name)} title={O.down(one.name)} disabled={index === draft.parameters.length - 1} onClick={() => move(index, 1)}>
                  <span aria-hidden="true">↓</span>
                </button>
                <button type="button" className="btn small" onClick={() => change({ parameters: draft.parameters.filter((_, at) => at !== index) })}>
                  {O.removeParameter}
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn small"
            disabled={draft.parameters.length >= MAX_PARAMETERS}
            onClick={() => change({ parameters: [...draft.parameters, { name: `value${draft.parameters.length + 1}`, label: { "*": "" }, type: "text", required: false }] })}
          >
            {O.addParameter}
          </button>
        </fieldset>
        <label>
          <span>{O.instructions}</span>
          <textarea className="field own-instructions" rows={8} value={draft.instructions} onChange={(event) => change({ instructions: event.target.value })} />
          <small className="muted">{O.instructionsHelp}</small>
        </label>
        {errors.length > 0 && (
          <div className="dangerbox" role="alert">
            <b>{O.refused}</b>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {confirming ? (
          <div className={confirming === "delete" ? "dangerbox" : "warnbox"}>
            <b>{confirming === "delete" ? O.confirmDelete(title) : O.confirmSave(title)}</b>
            <div className="acts">
              <button type="button" className="btn ghost" onClick={() => setConfirming(null)}>
                {A.cancel}
              </button>
              <button type="button" className={`btn ${confirming === "delete" ? "danger" : "primary"}`} {...whileBusy(chat.busy)} onClick={() => void (confirming === "delete" ? remove() : save())}>
                {confirming === "delete" ? O.delete : O.save}
              </button>
            </div>
          </div>
        ) : (
          <div className="acts">
            <button type="button" className="btn danger" {...whileBusy(chat.busy)} onClick={() => setConfirming("delete")}>
              {O.delete}
            </button>
            <span className="sp" />
            <button type="button" className="btn ghost" onClick={onClose}>
              {A.cancel}
            </button>
            <button type="button" className="btn" onClick={() => setTrying(true)}>
              {O.try}
            </button>
            <button type="button" className="btn primary" {...whileBusy(chat.busy, !unsaved)} onClick={() => setConfirming("save")}>
              {O.save}
            </button>
          </div>
        )}
      </form>
    </Dialog>
  );
}
