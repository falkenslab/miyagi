import { useEffect, useState } from "react";

/**
 * A wait the person can see (#59): a spinner and what it waits for, announced politely to screen
 * readers. Past `slowAfter` seconds it adds `still`, so a long wait never looks stuck.
 */
export function Waiting({ text, still, slowAfter = 15, block }: { text: string; still?: string; slowAfter?: number; block?: boolean }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), slowAfter * 1000);
    return () => clearTimeout(timer);
  }, [text, slowAfter]);
  return (
    <p className={`waiting${block ? " block" : ""}`} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>
        {text}
        {slow && still && <span className="muted"> {still}</span>}
      </span>
    </p>
  );
}
