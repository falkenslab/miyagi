import { useCallback, useEffect, useState } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { Subject } from "../types";
import { Logo } from "./Logo";

/** The subjects in miyagi's registry, newest opened first, and which one is open. */
export function useSubjects(): { subjects: Subject[] | null; reload: () => Promise<void> } {
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const reload = useCallback(async () => {
    const result = await act<{ workspaces: Subject[] }>("workspaces");
    setSubjects(result.workspaces ?? []);
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { subjects, reload };
}

/** A new subject: its name, and what `init` would ask besides (no classroom yet: that comes later). */
export function NewSubjectForm({ T, onCancel }: { T: Texts; onCancel?: () => void }) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const create = async () => {
    setSaving(true);
    const result = await act("create", { label, description, language });
    setSaving(false);
    if (result.error) setError(result.error);
    else onCancel?.();
  };
  return (
    <form
      className="new-subject"
      onSubmit={(event) => {
        event.preventDefault();
        if (label.trim()) void create();
      }}
    >
      <h3>{T.newSubject}</h3>
      <label className="lb">
        {T.subjectName}
        <input className="field" value={label} onChange={(event) => setLabel(event.target.value)} autoFocus required />
      </label>
      <label className="lb">
        {T.subjectDescription}
        <input className="field" value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="lb">
        {T.subjectLanguage}
        <input className="field" value={language} onChange={(event) => setLanguage(event.target.value)} />
      </label>
      <small className="muted">{T.subjectLanguageHelp}</small>
      {error && <p className="why">{error}</p>}
      <div className="acts">
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            {T.cancel}
          </button>
        )}
        <button type="submit" className="btn primary" disabled={!label.trim() || saving}>
          {T.create}
        </button>
      </div>
    </form>
  );
}

/** The list of subjects: open one with a click (a missing folder can't be opened). */
export function SubjectList({ subjects, current, T, onOpen }: { subjects: Subject[]; current?: string | null; T: Texts; onOpen?: () => void }) {
  return (
    <ul className="subjects">
      {subjects.map((subject) => (
        <li key={subject.id}>
          <button
            type="button"
            disabled={subject.missing}
            aria-current={subject.dir === current}
            onClick={() => {
              void act("open", { id: subject.id });
              onOpen?.();
            }}
          >
            <span className="subject-icon" aria-hidden="true">
              📘
            </span>
            <span>
              <b>{subject.name}</b>
              <small>{subject.missing ? T.missingSubject : new Date(subject.openedAt).toLocaleDateString()}</small>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** No subject open: the ones there are, and a new one. */
export function StartScreen({ T }: { T: Texts }) {
  const { subjects } = useSubjects();
  const [creating, setCreating] = useState(false);
  if (!subjects) return null;
  const none = subjects.length === 0;
  return (
    <div className="start">
      <div className="card">
        <Logo size={64} />
        {none && <p className="muted">{T.noSubjects}</p>}
        {none || creating ? (
          <NewSubjectForm T={T} onCancel={none ? undefined : () => setCreating(false)} />
        ) : (
          <>
            <h2>{T.startTitle}</h2>
            <p className="muted">{T.startText}</p>
            <SubjectList subjects={subjects} T={T} />
            <button type="button" className="btn" onClick={() => setCreating(true)}>
              ＋ {T.newSubject}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
