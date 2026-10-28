import { useState } from "react";
import { act, UNREACHABLE } from "../api";
import type { Texts } from "../i18n";
import type { HostState } from "../types";
import { Logo } from "./Logo";
import { Waiting } from "./Waiting";

/**
 * Not connected to Claude yet (#58, ADR-026): sign in with a Claude account through Anthropic's
 * own page, run by Claude Code (miyagi never sees the session), or paste an API key. A
 * subscription token is never pasted: Anthropic's terms don't let miyagi collect one.
 */
export function SignIn({ T, state }: { T: Texts; state: HostState }) {
  const flow = state.signIn;
  const [starting, setStarting] = useState(false);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [useKey, setUseKey] = useState(false);
  const [error, setError] = useState("");
  const start = async () => {
    setError("");
    setSent(false);
    setCode("");
    setStarting(true);
    const result = await act("signin-start");
    setStarting(false);
    if (result.error) setError(result.error === UNREACHABLE ? T.unreachable : T.signInFailed);
  };
  const send = async () => {
    setSent(true);
    const result = await act("signin-code", { code });
    if (result.error) {
      setSent(false);
      setError(result.error === UNREACHABLE ? T.unreachable : T.signInFailed);
    }
  };
  const waiting = Boolean(flow && !flow.failed);
  return (
    <div className="signin">
      <div className="card">
        <Logo size={64} />
        <h2>{T.signInTitle}</h2>
        {state.tokenForgotten && <p className="warnbox">{T.tokenForgotten}</p>}
        <p>{T.signInText}</p>
        {!waiting ? (
          <button type="button" className="btn primary" disabled={starting} onClick={() => void start()} autoFocus>
            {T.signInAccount}
          </button>
        ) : (
          <div className="signin-flow">
            <Waiting text={sent ? T.checkingKey : T.signInWaiting} still={T.stillWorking} slowAfter={sent ? 15 : 120} />
            {flow?.url && (
              <p>
                <a href={flow.url} target="_blank" rel="noreferrer">
                  {T.signInOpen}
                </a>
              </p>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (code.trim()) void send();
              }}
            >
              <label className="lb" htmlFor="signin-code">
                {T.signInCode}
              </label>
              <input id="signin-code" className="field" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="off" spellCheck={false} disabled={sent} />
              <div className="acts">
                <button type="button" className="btn ghost" onClick={() => void act("signin-cancel")}>
                  {T.cancel}
                </button>
                <button type="submit" className="btn primary" disabled={!code.trim() || sent}>
                  {T.signInCodeSend}
                </button>
              </div>
            </form>
          </div>
        )}
        {starting && <Waiting text={T.signInWaiting} still={T.stillWorking} />}
        {(error || flow?.failed) && <p className="why">{error || T.signInFailed}</p>}
        <p className="muted small">{T.signInPrivacy}</p>
        {!waiting && (useKey ? <ApiKey T={T} /> : (
          <button type="button" className="linkish small" onClick={() => setUseKey(true)}>
            {T.apiKeyUse}
          </button>
        ))}
      </div>
    </div>
  );
}

/** An API key pasted (`sk-ant-api…`): billed per use, and allowed to keep. */
function ApiKey({ T }: { T: Texts }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const result = await act("login", { token: key });
    setSaving(false);
    if (result.error) setError(result.error === UNREACHABLE ? T.unreachable : T.keyInvalid);
  };
  return (
    <form
      className="signin-key"
      onSubmit={(event) => {
        event.preventDefault();
        if (key.trim()) void save();
      }}
    >
      <p className="muted">
        {T.apiKeyHelp.split("console.anthropic.com")[0]}
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
          console.anthropic.com
        </a>
        {T.apiKeyHelp.split("console.anthropic.com")[1]}
      </p>
      <input
        className="field"
        type="password"
        autoComplete="off"
        spellCheck={false}
        placeholder={T.keyPlaceholder}
        value={key}
        onChange={(event) => {
          setKey(event.target.value);
          setError("");
        }}
        aria-label={T.apiKeyUse}
        autoFocus
        disabled={saving}
      />
      {saving && <Waiting text={T.checkingKey} still={T.stillWorking} />}
      {error && <p className="why">{error}</p>}
      <button type="submit" className="btn" disabled={!key.trim() || saving}>
        {T.keySave}
      </button>
    </form>
  );
}
