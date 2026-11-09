/**
 * The desktop app's web browser (integrated-browser #86, ADR-027): the host only passes the page's
 * actions to the native side and its tabs back to the page, on an event of their own, so no
 * address or page content goes near the chat or the model. Which addresses may be opened is
 * decided here, for the address bar and for the links.
 */

/** A tab as the page draws it. Native, in the desktop app; nothing of it is kept anywhere. */
export interface BrowserTab {
  id: string;
  title: string;
  /** "" for a new tab that hasn't gone anywhere. */
  url: string;
  /** A `data:` image: the page's strict CSP loads no image from elsewhere. */
  favicon?: string;
  loading: boolean;
  canBack: boolean;
  canForward: boolean;
  /** The page didn't load: the panel says so instead of showing a blank view. */
  failed: boolean;
}

export interface BrowserRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** What the desktop app gives the host (`browser`, an option of `startHost` as `pickFolder`): its native tabs. */
export interface EmbeddedBrowser {
  list(): BrowserTab[];
  /** Calls back when the tabs change, or a link inside a page is refused. Returns how to stop listening. */
  subscribe(onChange: () => void, onRefused: () => void): () => void;
  open(url?: string): string;
  close(id: string): void;
  select(id: string | null): void;
  navigate(id: string, url: string): void;
  back(id: string): void;
  forward(id: string): void;
  reload(id: string): void;
  /** Where the panel's rectangle is; null hides the view. */
  bounds(rect: BrowserRect | null): void;
  /** A still of a tab, as a `data:` image, to show while something of the page covers its place. */
  capture(id: string): Promise<string | undefined>;
  /** The tab's address, taken out to the system's browser. */
  external(id: string): void;
  /** A step of zoom in that tab (+1, -1), or back to its normal size (0). */
  zoom(id: string, delta: number): void;
}

/** A name of this computer: `localhost` and every `*.localhost`, 127.x.x.x, ::1 and 0.0.0.0, however it was written (the URL parser normalises it). */
const isLoopback = (hostname: string) => /^(localhost|.+\.localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\]|\[::ffff:7f[0-9a-f]{2}:[0-9a-f]{1,4}\])$/i.test(hostname);

const parsed = (address: string) => {
  try {
    return new URL(address);
  } catch {
    return undefined;
  }
};

/** The host's own address (its URL carries the token), under any of this computer's names. */
function isOwn(url: URL, ownOrigin: string): boolean {
  return isLoopback(url.hostname) && url.port === new URL(ownOrigin).port;
}

/** Never reached by the browser, in a tab or from inside a page: the disk and the host itself. */
export function refusedUrl(address: string, ownOrigin: string): boolean {
  const url = parsed(address);
  return Boolean(url) && (url!.protocol === "file:" || isOwn(url!, ownOrigin));
}

export type WebAddress = { url: string } | { error: "invalid" | "refused" };

/**
 * An address typed or linked, as a page to open: without a scheme it is assumed (`http` for this
 * computer's names); `file:` and the host's own address are refused, and anything else that isn't
 * an http(s) page, a bare word among them, isn't an address.
 */
export function webAddress(text: string, ownOrigin: string): WebAddress {
  const typed = text.trim();
  if (!typed || /\s/.test(typed)) return { error: "invalid" };
  // Not a scheme, but a port: `localhost:8080`.
  const schemed = /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(typed);
  const url = parsed(schemed ? typed : `${isLoopback(typed.split(/[:/]/)[0] ?? "") ? "http" : "https"}://${typed}`);
  if (!url) return { error: "invalid" };
  if (url.protocol === "file:") return { error: "refused" };
  if (url.protocol !== "http:" && url.protocol !== "https:") return { error: "invalid" };
  if (!schemed && !url.hostname.includes(".") && !isLoopback(url.hostname)) return { error: "invalid" };
  return isOwn(url, ownOrigin) ? { error: "refused" } : { url: url.href };
}
