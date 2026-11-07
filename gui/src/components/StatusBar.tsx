import { useEffect, useState } from "react";
import { useRunning } from "../api";
import type { Texts } from "../i18n";
import type { ChatState } from "../types";

/** Why a control waits, set by the page in its language: what a disabled button says while miyagi works (#80). */
let busyReason = "";
export const setBusyReason = (text: string) => {
  busyReason = text;
};

/**
 * A control that waits while miyagi works: disabled, and saying why (its tooltip, and the status
 * bar's line for screen readers). `other` disables it for reasons of its own, which say nothing.
 */
export function whileBusy(busy: boolean, other = false) {
  return busy ? { disabled: true, title: busyReason, "aria-describedby": "status-line" } : { disabled: other };
}

/** Minutes and seconds since `since`, ticking while it's shown. */
function useElapsed(since: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!since) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [since]);
  if (!since) return "";
  const seconds = Math.max(0, Math.round((now - since) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * The status bar (#80): what miyagi or the host is doing, in every view, so the page never looks
 * stuck. In the conversation the transcript says what miyagi does, so there only the host's work.
 */
export function StatusBar({ chat, T, inChat, onOpenChat }: { chat: ChatState | null; T: Texts; inChat: boolean; onOpenChat: () => void }) {
  const running = useRunning();
  const S = T.status;
  const elapsed = useElapsed(chat?.busy ? chat.turnStartedAt : null);
  const waiting = chat?.panel ? S.approval : chat?.choice ? S.question : null;
  // Before the teacher's first message, the turn is miyagi's greeting from its memory.
  const greeting = chat?.busy && !chat.transcript.some((entry) => entry.kind === "user");
  const line = !inChat && waiting ? waiting : !inChat && chat?.busy ? (greeting ? S.greeting : chat.activity || S.thinking) : running.length ? (S.tasks[running.at(-1)!] ?? S.thinking) : null;
  return (
    <div className={`status-bar${line ? " on" : ""}${waiting && !inChat ? " ask" : ""}`}>
      <span id="status-line" role="status" aria-live="polite" className="status-text">
        {line && !waiting && <span className="spinner" aria-hidden="true" />}
        {line && <span className="grow">{line}</span>}
      </span>
      {line && !inChat && chat?.busy && elapsed && <span className="muted status-time">{elapsed}</span>}
      {line && !inChat && (waiting || chat?.busy) && (
        <button type="button" className={`btn small${waiting ? " primary" : ""}`} onClick={onOpenChat}>
          {S.goToChat}
        </button>
      )}
    </div>
  );
}
