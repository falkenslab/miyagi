import { useEffect, useState } from "react";
import type { HostState, Info } from "./types";

// The host's API (src/host/server.ts): the token comes in the page's URL and goes with every
// request; the state arrives as server-sent events, the person's actions go back as POSTs.

const token = new URLSearchParams(location.search).get("token") ?? "";

/** One action of the person, by name, as the host maps it to the chat controller. */
export async function act<T = Record<string, unknown>>(action: string, data: Record<string, unknown> = {}): Promise<T & { error?: string }> {
  const response = await fetch(`api/${action}?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return (await response.json()) as T & { error?: string };
}

/** A file the person adds: into the subject's sources/. */
export async function upload(file: File): Promise<{ path?: string; duplicateOf?: string; error?: string }> {
  const response = await fetch(`api/upload?token=${encodeURIComponent(token)}&name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
  return (await response.json()) as { path?: string; duplicateOf?: string; error?: string };
}

export type Connection = "connecting" | "open" | "replaced" | "lost";

/** The host's events: what miyagi is (info) and the chat's state, kept up to date. */
export function useMiyagi(): { info: Info | null; state: HostState | null; connection: Connection } {
  const [info, setInfo] = useState<Info | null>(null);
  const [state, setState] = useState<HostState | null>(null);
  const [connection, setConnection] = useState<Connection>("connecting");
  useEffect(() => {
    const events = new EventSource(`api/events?token=${encodeURIComponent(token)}`);
    events.addEventListener("open", () => setConnection("open"));
    events.addEventListener("info", (event) => setInfo(JSON.parse((event as MessageEvent).data) as Info));
    events.addEventListener("state", (event) => setState(JSON.parse((event as MessageEvent).data) as HostState));
    // Another tab or window took over: this one stops, and says so.
    events.addEventListener("replaced", () => {
      setConnection("replaced");
      events.close();
    });
    events.addEventListener("error", () => setConnection((now) => (now === "replaced" ? now : "lost")));
    return () => events.close();
  }, []);
  return { info, state, connection };
}
