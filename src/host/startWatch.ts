/**
 * A conversation that never gets past its start (#88): busy, with nothing in it and nothing asked
 * of the teacher, for too long. The first turn of a subject can take a minute or two, installing
 * its extensions; past the limit the page would wait for ever, with no way to start another one.
 */
export const START_LIMIT_MS = 5 * 60_000;

interface Watched {
  getState(): { busy: boolean; transcript: unknown[]; panel: unknown; choice: unknown };
  subscribe(listener: () => void): () => void;
}

/** Calls `stuck` once when the conversation stays that way for `limit` ms; returns how to stop watching. */
export function watchStart(chat: Watched, stuck: () => void, limit = START_LIMIT_MS): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const starting = () => {
    const state = chat.getState();
    return state.busy && !state.transcript.length && !state.panel && !state.choice;
  };
  const check = () => {
    if (!starting()) {
      clearTimeout(timer);
      timer = undefined;
    } else {
      timer ??= setTimeout(() => {
        timer = undefined;
        if (starting()) stuck();
      }, limit);
    }
  };
  const unsubscribe = chat.subscribe(check);
  check();
  return () => {
    clearTimeout(timer);
    unsubscribe();
  };
}
