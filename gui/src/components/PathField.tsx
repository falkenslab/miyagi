import { useState, type InputHTMLAttributes } from "react";
import { act } from "../api";

/** Whether the host can open the system's folder dialog (`info.pickFolder`), set by the page. */
let canPick = false;
export const setCanPick = (value: boolean) => {
  canPick = value;
};

/**
 * A field for a folder (#79): typed, or chosen in the system's own dialog with "Browse…", whose
 * path fills it (still editable). Cancelling the dialog leaves it as it was.
 */
export function PathField({ value, onChange, title, browse, ...input }: { value: string; onChange: (path: string) => void; title: string; browse: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "title">) {
  const [picking, setPicking] = useState(false);
  const pick = async () => {
    setPicking(true);
    const result = await act<{ path?: string }>("pick-folder", { title, start: value.trim() || undefined });
    setPicking(false);
    if (result.path) onChange(result.path);
  };
  return (
    <span className="path-field">
      <input className="field" spellCheck={false} {...input} value={value} onChange={(event) => onChange(event.target.value)} />
      {canPick && (
        <button type="button" className="btn small" disabled={picking || input.disabled} onClick={() => void pick()}>
          📁 {browse}
        </button>
      )}
    </span>
  );
}
