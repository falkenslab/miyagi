import { useEffect, useRef, useState, type ReactNode } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import { Markdown } from "../markdown";
import type { ApprovalPrompt, ChatPanel, ChatState, FormField } from "../types";

/** A modal dialog: focus moved in and kept there, Escape for `onEscape`. */
function Dialog({ title, onEscape, children }: { title: string; onEscape?: () => void; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>("button, input, textarea, select, [tabindex]:not([tabindex='-1'])")).filter((f) => !f.hasAttribute("disabled"));
    (el.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        onEscape();
      } else if (event.key === "Tab") {
        const all = focusables();
        if (!all.length) return;
        const first = all[0];
        const last = all[all.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [onEscape]);
  return (
    <div className="scrim">
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title} ref={box}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** What a checkpoint shows: the agent's own summary, as it wrote it. */
function PromptBody({ prompt }: { prompt: ApprovalPrompt }) {
  return (
    <div className="prompt md">
      {prompt.markdown ? <Markdown text={prompt.lines.join("\n")} /> : prompt.lines.map((line, index) => <p key={index}>{line}</p>)}
      {prompt.question && <p className="question">{prompt.question}</p>}
    </div>
  );
}

function FormBody({ fields, T, done }: { fields: FormField[]; T: Texts; done: (result: unknown) => void }) {
  const [values, setValues] = useState<Record<string, unknown>>(() => Object.fromEntries(fields.map((field) => [field.key, field.default ?? (field.type === "boolean" ? false : field.multiple ? [] : "")])));
  const [missing, setMissing] = useState("");
  const set = (key: string, value: unknown) => setValues((now) => ({ ...now, [key]: value }));
  const send = () => {
    const content: Record<string, unknown> = {};
    for (const field of fields) {
      let value = values[field.key];
      if (field.type === "number" || field.type === "integer") value = value === "" ? undefined : Number(value);
      const empty = value === undefined || value === "" || (Array.isArray(value) && !value.length);
      if (empty) {
        if (field.required) return setMissing(T.formMissing(field.title));
        continue;
      }
      if (typeof value === "number" && (Number.isNaN(value) || (field.type === "integer" && !Number.isInteger(value)))) return setMissing(T.formMissing(field.title));
      content[field.key] = value;
    }
    done({ action: "accept", content });
  };
  return (
    <>
      {fields.map((field, index) => (
        <div key={field.key} className="form-field">
          {field.type === "boolean" ? (
            <label className="check">
              <input type="checkbox" data-autofocus={index === 0 || undefined} checked={Boolean(values[field.key])} onChange={(event) => set(field.key, event.target.checked)} />
              <span>
                {field.title}
                {field.required && " *"}
              </span>
            </label>
          ) : field.options && field.multiple ? (
            <fieldset>
              <legend>{field.title}</legend>
              {field.options.map((option) => (
                <label key={option.value} className="check">
                  <input
                    type="checkbox"
                    checked={(values[field.key] as string[]).includes(option.value)}
                    onChange={(event) => set(field.key, event.target.checked ? [...(values[field.key] as string[]), option.value] : (values[field.key] as string[]).filter((v) => v !== option.value))}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ) : (
            <label className="lb">
              {field.title}
              {field.required && " *"}
              {field.options ? (
                <select className="field" value={String(values[field.key])} onChange={(event) => set(field.key, event.target.value)}>
                  <option value="" />
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="field"
                  data-autofocus={index === 0 || undefined}
                  type={field.type === "string" ? "text" : "number"}
                  min={field.minimum}
                  max={field.maximum}
                  value={String(values[field.key] ?? "")}
                  onChange={(event) => set(field.key, event.target.value)}
                />
              )}
            </label>
          )}
          {field.description && <small className="muted">{field.description}</small>}
        </div>
      ))}
      {missing && <p className="why">{missing}</p>}
      <div className="acts">
        <button type="button" className="btn" onClick={() => done({ action: "cancel" })}>
          {T.cancel}
        </button>
        <button type="button" className="btn" onClick={() => done({ action: "decline" })}>
          {T.formDecline}
        </button>
        <button type="button" className="btn primary" onClick={send}>
          {T.formSend}
        </button>
      </div>
    </>
  );
}

function ChoiceBody({ panel, T, answer }: { panel: Extract<ChatPanel, { kind: "choice" }>; T: Texts; answer: (value: string) => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  const [other, setOther] = useState("");
  const multiple = panel.choice.multiple;
  const submit = () => {
    const value = [picked.map((n) => String(n + 1)).join(","), other.trim()].filter(Boolean).join("\n");
    if (value) answer(value);
  };
  return (
    <>
      <div className="options" role={multiple ? "group" : "radiogroup"}>
        {panel.choice.options.map((option, index) => (
          <label key={index} className={`option${picked.includes(index) ? " checked" : ""}`}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name="choice"
              data-autofocus={index === 0 || undefined}
              checked={picked.includes(index)}
              onChange={(event) => {
                if (!multiple) return answer(String(index + 1));
                setPicked((now) => (event.target.checked ? [...now, index] : now.filter((n) => n !== index)));
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <textarea
        className="field"
        rows={2}
        placeholder={T.other}
        value={other}
        onChange={(event) => setOther(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && other.trim()) {
            event.preventDefault();
            answer(other.trim());
          }
        }}
      />
      <div className="acts">
        <button type="button" className="btn primary" onClick={submit}>
          {T.answer}
        </button>
      </div>
    </>
  );
}

/** The checkpoint waiting for the person (the state's panel), or a choice in place of the prompt (the state's choice). */
export function Panel({ chat, T }: { chat: ChatState; T: Texts }) {
  const [text, setText] = useState("");
  const panel = chat.panel;
  useEffect(() => setText(""), [panel?.id]);
  if (chat.choice) {
    const choose = (value: string | null) => void act("choose", { value });
    return (
      <Dialog title={chat.choice.title} onEscape={() => choose(null)}>
        <div className="options">
          {chat.choice.options.map((option, index) => (
            <button key={option.value} type="button" className="option" data-autofocus={index === 0 || undefined} onClick={() => choose(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="acts">
          <button type="button" className="btn ghost" onClick={() => choose(null)}>
            {T.cancel}
          </button>
        </div>
      </Dialog>
    );
  }
  if (!panel) return null;
  const answer = (value: string) => void act("answer", { panelId: panel.id, answer: value });
  if (panel.kind === "form")
    return (
      <Dialog title={panel.prompt.title} onEscape={() => answer(JSON.stringify({ action: "cancel" }))}>
        <PromptBody prompt={{ ...panel.prompt, lines: panel.form.message ? [panel.form.message] : panel.prompt.lines }} />
        <FormBody fields={panel.form.fields} T={T} done={(result) => answer(JSON.stringify(result))} />
      </Dialog>
    );
  if (panel.kind === "choice")
    return (
      <Dialog title={panel.prompt.title}>
        <PromptBody prompt={panel.prompt} />
        <ChoiceBody panel={panel} T={T} answer={answer} />
      </Dialog>
    );
  if (panel.kind === "decision")
    return (
      <Dialog title={panel.prompt.title} onEscape={() => answer("n")}>
        <PromptBody prompt={panel.prompt} />
        <div className="acts">
          <button type="button" className="btn danger" onClick={() => answer("q")}>
            {T.stopAll}
          </button>
          <button type="button" className="btn" onClick={() => answer("n")}>
            {T.reject}
          </button>
          <button type="button" className="btn primary" data-autofocus onClick={() => answer("y")}>
            {T.approve}
          </button>
        </div>
      </Dialog>
    );
  if (panel.kind === "manual")
    return (
      <Dialog title={panel.prompt.title}>
        <PromptBody prompt={panel.prompt} />
        <div className="acts">
          <button type="button" className="btn primary" data-autofocus onClick={() => answer("")}>
            {T.done}
          </button>
        </div>
      </Dialog>
    );
  return (
    <Dialog title={panel.prompt.title}>
      <PromptBody prompt={panel.prompt} />
      <textarea
        className="field"
        rows={3}
        data-autofocus
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            answer(text);
          }
        }}
      />
      <div className="acts">
        <button type="button" className="btn primary" onClick={() => answer(text)}>
          {T.answer}
        </button>
      </div>
    </Dialog>
  );
}
