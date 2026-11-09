// The views visited, for the desktop app's ← and → (#87): only the views (the Today page, the
// conversation, the course...), so going back doesn't undo a conversation resumed or a subject opened.

const MAX_VISITS = 50;

export interface ViewHistory<V extends string = string> {
  list: V[];
  at: number;
}

export const NO_HISTORY: ViewHistory<never> = { list: [], at: -1 };

/** Where the teacher went: anything ahead of it is forgotten, as in a browser; the view it's already on changes nothing. */
export function visit<V extends string>(history: ViewHistory<V>, view: V): ViewHistory<V> {
  if (history.list[history.at] === view) return history;
  const list = [...history.list.slice(0, history.at + 1), view].slice(-MAX_VISITS);
  return { list, at: list.length - 1 };
}

export const canBack = (history: ViewHistory) => history.at > 0;
export const canForward = (history: ViewHistory) => history.at < history.list.length - 1;

/** One step back or forward (delta -1 or +1); at either end, it stays where it is. */
export function step<V extends string>(history: ViewHistory<V>, delta: -1 | 1): ViewHistory<V> {
  const at = history.at + delta;
  return at < 0 || at >= history.list.length ? history : { ...history, at };
}
