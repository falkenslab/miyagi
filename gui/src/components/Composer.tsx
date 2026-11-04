import { useEffect, useMemo, useRef, useState } from "react";
import { act, upload } from "../api";
import type { Texts } from "../i18n";
import type { ExtTexts } from "../i18n/extensions";
import type { ChatState, Mode } from "../types";
import { ActionList, useActions } from "./Actions";
import { Icon } from "./Icons";
import { Menu } from "./Shell";

/** The turn's tasks (the agent's TodoWrite), folded above the composer into the one in progress; opened, the list. */
export function Todos({ chat, T }: { chat: ChatState; T: Texts }) {
  const [open, setOpen] = useState(false);
  if (!chat.todos?.length || !chat.todos.some((todo) => todo.status !== "completed")) return null;
  const done = chat.todos.filter((todo) => todo.status === "completed").length;
  const now = chat.todos.find((todo) => todo.status === "in_progress") ?? chat.todos.find((todo) => todo.status === "pending");
  return (
    <div className="todos">
      {open && (
        <div className="box">
          {chat.todos.map((todo, index) => (
            <span key={index} className={todo.status === "completed" ? "done" : todo.status === "in_progress" ? "now" : ""}>
              {todo.status === "in_progress" ? todo.activeForm : todo.content}
            </span>
          ))}
        </div>
      )}
      <button type="button" className="todo-pill" aria-expanded={open} title={T.tasks(done, chat.todos.length)} onClick={() => setOpen(!open)}>
        <span className="sq" aria-hidden="true" />
        <b>
          {done}/{chat.todos.length}
        </b>
        <span className="ellipsis">{now ? (now.status === "in_progress" ? now.activeForm : now.content) : ""}</span>
        <Icon name={open ? "down" : "up"} size={16} />
      </button>
    </div>
  );
}

/** The mode now, as a pill in the composer, and the ones this session can switch to (Shift+Tab does the same). */
function ModeMenu({ chat, T }: { chat: ChatState; T: Texts }) {
  if (!chat.mode) return null;
  const now = chat.mode;
  return (
    <Menu
      title={T.modeTitle}
      className={`pill mode ${now}`}
      popClass="up left"
      label={
        <>
          <span className="sw" aria-hidden="true" />
          <span>{T.modes[now].name}</span>
          <Icon name="down" size={14} />
        </>
      }
    >
      {(close) => (
        <>
          <h4 className="pop-title">{T.modeTitle}</h4>
          <p className="pop-help">{T.modeHelp}</p>
          {chat.switchableModes.map((mode: Mode) => (
            <button
              key={mode}
              type="button"
              aria-current={mode === now}
              onClick={() => {
                void act("mode", { mode });
                close();
              }}
            >
              <span className={`sw ${mode}`} aria-hidden="true" />
              <span className="grow">
                {T.modes[mode].name}
                <small>{T.modes[mode].help}</small>
              </span>
              {mode === now && <Icon name="check" size={18} />}
            </button>
          ))}
        </>
      )}
    </Menu>
  );
}

/**
 * Where the person writes, as a card (#60): the text, and under it ＋ (a file to the sources,
 * capabilities, the catalog of miyagi's actions, #67), the mode and send (stop while a turn runs).
 * A `draft` (an item's "Ask miyagi about this", a quote) is left in the box to finish.
 * Enter sends, Shift+Enter is a new line, Esc stops a running turn, ↑/↓ walk the history when the
 * box is empty, / opens the shortcuts. While a turn runs nothing is sent: the host refuses it.
 */
export function Composer({ chat, T, X, onNotice, onCapabilities, draft }: { chat: ChatState; T: Texts; X: ExtTexts; onNotice: (text: string) => void; onCapabilities: () => void; draft: { text: string; at: number } | null }) {
  const [text, setText] = useState("");
  const actions = useActions();
  const [historyAt, setHistoryAt] = useState(-1);
  const [menuAt, setMenuAt] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);

  // Grows with what's written, up to a few lines.
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);
  useEffect(() => {
    if (!draft) return;
    setText(draft.text);
    requestAnimationFrame(() => {
      const el = area.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    });
  }, [draft]);
  // Back to the box when a turn ends or a panel closes.
  useEffect(() => {
    if (!chat.busy && !chat.panel) area.current?.focus();
  }, [chat.busy, chat.panel]);

  const commands = useMemo(() => {
    if (!text.startsWith("/") || text.includes(" ")) return [];
    const word = text.slice(1).toLowerCase();
    return chat.commandDetails.filter((command) => command.name.toLowerCase().includes(word)).slice(0, 12);
  }, [text, chat.commandDetails]);

  const send = (line = text) => {
    const value = line.trim();
    if (!value || chat.busy) return;
    setText("");
    setHistoryAt(-1);
    void act("send", { line: value });
  };

  const onKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (commands.length) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setMenuAt((at) => (at + (event.key === "ArrowDown" ? 1 : commands.length - 1)) % commands.length);
        return;
      }
      // A command typed in full goes out with Enter, as any line; otherwise Enter completes it.
      const typed = commands.some((command) => `/${command.name}`.toLowerCase() === text.trim().toLowerCase());
      if (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey && !typed)) {
        event.preventDefault();
        const command = commands[Math.min(menuAt, commands.length - 1)];
        setText(`/${command.name} `);
        setMenuAt(0);
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    } else if (event.key === "Escape" && chat.busy) {
      event.preventDefault();
      void act("interrupt");
    } else if (event.key === "Tab" && !text && chat.suggestion) {
      event.preventDefault();
      setText(chat.suggestion);
    } else if ((event.key === "ArrowUp" || event.key === "ArrowDown") && (!text || historyAt >= 0) && chat.history.length) {
      event.preventDefault();
      const next = event.key === "ArrowUp" ? Math.min(historyAt + 1, chat.history.length - 1) : historyAt - 1;
      setHistoryAt(next);
      setText(next >= 0 ? chat.history[chat.history.length - 1 - next] : "");
    }
  };

  const attach = async (files: FileList | null) => {
    for (const one of Array.from(files ?? [])) {
      const result = await upload(one);
      onNotice(result.error ? T.attachFailed(one.name, result.error) : result.duplicateOf ? T.duplicate(one.name) : T.attached(one.name));
    }
  };

  return (
    <div className="composer">
      {commands.length > 0 && (
        <div className="slash" role="listbox" aria-label={T.commands}>
          {commands.map((command, index) => (
            <div
              key={command.name}
              role="option"
              aria-selected={index === menuAt}
              className={index === menuAt ? "on" : ""}
              onMouseDown={(event) => {
                event.preventDefault();
                setText(`/${command.name} `);
                area.current?.focus();
              }}
            >
              <code>/{command.name}</code>
              <span>{command.description}</span>
            </div>
          ))}
        </div>
      )}
      {!text && !chat.busy && chat.suggestion && (
        <div className="chips">
          <button type="button" className="chip" title={T.suggestion} onClick={() => send(chat.suggestion ?? "")}>
            {chat.suggestion}
          </button>
        </div>
      )}
      <div
        className="box"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void attach(event.dataTransfer.files);
        }}
      >
        <input ref={file} type="file" multiple hidden onChange={(event) => void attach(event.target.files).then(() => (event.target.value = ""))} />
        <textarea
          ref={area}
          rows={1}
          value={text}
          placeholder={chat.busy ? T.placeholderBusy : T.placeholder}
          aria-label={T.placeholder}
          onChange={(event) => {
            setText(event.target.value);
            setMenuAt(0);
          }}
          onKeyDown={onKey}
        />
        <div className="tools-row">
          <Menu title={T.more} ariaLabel={T.more} className="round plus" popClass="up left more-pop" label={<Icon name="plus" />}>
            {(close) => (
              <>
                <div className="more-tiles">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      file.current?.click();
                    }}
                  >
                    <Icon name="clip" size={22} />
                    <span>
                      <b>{T.addFile}</b>
                      <small>{T.toSources}</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onCapabilities();
                    }}
                  >
                    <Icon name="grid" size={22} />
                    <span>
                      <b>{X.capsButton}</b>
                      <small>{X.capsTitle}</small>
                    </span>
                  </button>
                </div>
                {actions && <ActionList list={actions.actions} close={close} grouped />}
                <h4 className="pop-title small-caps">{T.commands}</h4>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    setText("/");
                    area.current?.focus();
                  }}
                >
                  <span className="slash-key" aria-hidden="true">
                    /
                  </span>
                  <span className="grow">{T.miyagiCommands}</span>
                  <Icon name="right" size={16} />
                </button>
              </>
            )}
          </Menu>
          <ModeMenu chat={chat} T={T} />
          <span className="sp" />
          {chat.busy ? (
            <button type="button" className="round send stop" aria-label={T.stop} title={T.stop} onClick={() => void act("interrupt")}>
              <span className="stop-sq" aria-hidden="true" />
            </button>
          ) : (
            <button type="button" className="round send" aria-label={T.send} title={T.send} disabled={!text.trim()} onClick={() => send()}>
              <Icon name="send" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
