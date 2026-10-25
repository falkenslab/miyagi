import { useEffect, useMemo, useRef, useState } from "react";
import { act, upload } from "../api";
import type { Texts } from "../i18n";
import type { ChatState } from "../types";

/** The floating tasks of the turn (the agent's TodoWrite), above the composer. */
export function Todos({ chat }: { chat: ChatState }) {
  if (!chat.todos?.length || !chat.todos.some((todo) => todo.status !== "completed")) return null;
  return (
    <div className="todos">
      <div className="box">
        {chat.todos.map((todo, index) => (
          <span key={index} className={todo.status === "completed" ? "done" : todo.status === "in_progress" ? "now" : ""}>
            {todo.status === "in_progress" ? todo.activeForm : todo.content}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Where the person writes: Enter sends, Shift+Enter is a new line, Esc stops a running turn,
 * ↑/↓ walk the history when the box is empty, / opens the shortcuts, the clip adds a file to
 * the sources. While a turn runs nothing is sent: the host refuses it.
 */
export function Composer({ chat, T, onNotice }: { chat: ChatState; T: Texts; onNotice: (text: string) => void }) {
  const [text, setText] = useState("");
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
      if (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey)) {
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
        <button type="button" className="clip" aria-label={T.attach} title={T.attach} onClick={() => file.current?.click()}>
          📎
        </button>
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
        {chat.busy ? (
          <button type="button" className="send stop" aria-label={T.stop} title={T.stop} onClick={() => void act("interrupt")}>
            ■
          </button>
        ) : (
          <button type="button" className="send" aria-label={T.send} title={T.send} disabled={!text.trim()} onClick={() => send()}>
            ↑
          </button>
        )}
      </div>
    </div>
  );
}
