import { useState } from "react";
import { act, UNREACHABLE } from "../api";
import type { Texts } from "../i18n";
import { Logo } from "./Logo";
import { Waiting } from "./Waiting";

/** No Claude key yet: the person pastes one (there's no terminal for "claude setup-token" here). */
export function SignIn({ T }: { T: Texts }) {
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
    <div className="signin">
      <div className="card">
        <Logo size={64} />
        <h2>{T.signInTitle}</h2>
        <p>{T.signInText}</p>
        <p className="muted">{T.signInHow}</p>
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
          onKeyDown={(event) => {
            if (event.key === "Enter" && key.trim()) void save();
          }}
          aria-label={T.signInTitle}
          autoFocus
          disabled={saving}
        />
        {saving && <Waiting text={T.checkingKey} still={T.stillWorking} />}
        {error && <p className="why">{error}</p>}
        <button type="button" className="btn primary" disabled={!key.trim() || saving} onClick={() => void save()}>
          {T.keySave}
        </button>
      </div>
    </div>
  );
}
