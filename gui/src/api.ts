import { useEffect, useState, useSyncExternalStore } from "react";
import type { BrowserTab, HostState, Info } from "./types";

// The host's API (src/host/server.ts): the token comes in the page's URL and goes with every
// request; the state arrives as server-sent events, the person's actions go back as POSTs.

const token = new URLSearchParams(location.search).get("token") ?? "";

/** The host's actions that change something and may take a while: shown in the status bar while they run (#80). */
const TRACKED = new Set(["install", "update", "remove", "reload", "add-marketplace", "inspect-marketplace", "remove-marketplace", "classroom", "create", "open", "add-existing", "locate", "new", "resume", "upload", "pick-folder"]);
let running: string[] = [];
const listeners = new Set<() => void>();
const changed = (next: string[]) => {
  running = next;
  for (const listener of listeners) listener();
};
/** Runs `work` as the host action `action`, listed while it lasts if it's one the status bar names. */
async function tracked<T>(action: string, work: () => Promise<T>): Promise<T> {
  if (!TRACKED.has(action)) return work();
  changed([...running, action]);
  try {
    return await work();
  } finally {
    const at = running.indexOf(action);
    changed(running.filter((_, index) => index !== at));
  }
}
/** The tracked host actions running now, oldest first. */
export function useRunning(): string[] {
  return useSyncExternalStore(
    (listener) => (listeners.add(listener), () => listeners.delete(listener)),
    () => running,
  );
}

/** One action of the person, by name, as the host maps it to the chat controller. */
export async function act<T = Record<string, unknown>>(action: string, data: Record<string, unknown> = {}): Promise<T & { error?: string }> {
  return tracked(action, () => post<T>(action, data));
}

async function post<T>(action: string, data: Record<string, unknown>): Promise<T & { error?: string }> {
  // The host gone (closed, crashed) is an error like any other, never a wait that doesn't end.
  try {
    const response = await fetch(`api/${action}?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await response.json()) as T & { error?: string };
  } catch {
    return { error: UNREACHABLE } as T & { error?: string };
  }
}

/** The `error` of an action the host never answered. */
export const UNREACHABLE = "unreachable";

/** A file the person adds: into the subject's sources/. */
export async function upload(file: File): Promise<{ path?: string; duplicateOf?: string; error?: string }> {
  return tracked("upload", () => send(file));
}

async function send(file: File): Promise<{ path?: string; duplicateOf?: string; error?: string }> {
  try {
    const response = await fetch(`api/upload?token=${encodeURIComponent(token)}&name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
    return (await response.json()) as { path?: string; duplicateOf?: string; error?: string };
  } catch {
    return { error: UNREACHABLE };
  }
}

export type Connection = "connecting" | "open" | "replaced" | "lost";

/** The host's events: what miyagi is (info) and the chat's state, kept up to date. */
export function useMiyagi(): { info: Info | null; state: HostState | null; connection: Connection; browser: BrowserTab[]; refused: number } {
  const [info, setInfo] = useState<Info | null>(null);
  const [state, setState] = useState<HostState | null>(null);
  const [connection, setConnection] = useState<Connection>("connecting");
  const [browser, setBrowser] = useState<BrowserTab[]>([]);
  const [refused, setRefused] = useState(0);
  useEffect(() => {
    const events = new EventSource(`api/events?token=${encodeURIComponent(token)}`);
    events.addEventListener("open", () => setConnection("open"));
    events.addEventListener("info", (event) => setInfo(JSON.parse((event as MessageEvent).data) as Info));
    events.addEventListener("state", (event) => setState(JSON.parse((event as MessageEvent).data) as HostState));
    events.addEventListener("browser", (event) => setBrowser(JSON.parse((event as MessageEvent).data) as BrowserTab[]));
    events.addEventListener("browser-refused", () => setRefused((now) => now + 1));
    // Another tab or window took over: this one stops, and says so.
    events.addEventListener("replaced", () => {
      setConnection("replaced");
      events.close();
    });
    events.addEventListener("error", () => setConnection((now) => (now === "replaced" ? now : "lost")));
    return () => events.close();
  }, []);
  return { info, state, connection, browser, refused };
}

/** A catalog entry's logo, served by the host from the repository's copy. */
export function logoUrl(spec: string): string {
  return `api/extension-image?spec=${encodeURIComponent(spec)}&token=${encodeURIComponent(token)}`;
}
