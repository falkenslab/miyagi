// The desktop app's web browser (integrated-browser #86, ADR-027): one WebContentsView per tab,
// placed over the side panel's rectangle (Moodle refuses being framed, so the page can't show it).
// Sandboxed with no preload, in a session of its own (`persist:browser`) that keeps the cookies and
// nothing else: no cache, no tabs or addresses (Moodle's can identify a student), and whatever else
// the sites stored is cleared on quitting. The disk and the host's own address are refused here for
// everything a page loads, not only for what the address bar asks. Nothing of it reaches the model.
import path from "node:path";
import { app, dialog, session, WebContentsView } from "electron";
import { refusedUrl, webAddress } from "./miyagi/dist/host/browser.js";

const ZOOM = { min: 0.5, max: 3, step: 0.1 };
const FAVICON_MAX = 64 * 1024;
const SIGN_IN_SECONDS = 30 * 24 * 3600;

const LEAVE = {
  es: { message: "¿Salir de esta página? Lo que no se haya guardado se perderá.", leave: "Salir", stay: "Quedarse" },
  en: { message: "Leave this page? Anything not saved will be lost.", leave: "Leave", stay: "Stay" },
  fr: { message: "Quitter cette page ? Ce qui n'est pas enregistré sera perdu.", leave: "Quitter", stay: "Rester" },
  de: { message: "Diese Seite verlassen? Nicht Gespeichertes geht verloren.", leave: "Verlassen", stay: "Bleiben" },
};

/** `getWindow` is the app's window, `ownOrigin` the host's, `openExternal` the system's browser. */
export function createBrowser({ getWindow, ownOrigin, openExternal }) {
  const web = session.fromPartition("persist:browser", { cache: false });
  web.webRequest.onBeforeRequest((details, done) => done({ cancel: refusedUrl(details.url, ownOrigin()) }));
  // A sign-in is usually a cookie that lasts as long as the browser (Moodle's is): given an end, so
  // it's still there on the next start; the site ends it whenever it says.
  web.webRequest.onHeadersReceived((details, done) => {
    const responseHeaders = { ...details.responseHeaders };
    for (const name of Object.keys(responseHeaders)) {
      if (name.toLowerCase() === "set-cookie") responseHeaders[name] = responseHeaders[name].map((line) => (/;\s*(expires|max-age)\s*=/i.test(line) ? line : `${line}; Max-Age=${SIGN_IN_SECONDS}`));
    }
    done({ responseHeaders });
  });
  web.setPermissionRequestHandler((_contents, _permission, done) => done(false));
  web.setPermissionCheckHandler(() => false);
  web.setDevicePermissionHandler(() => false);
  // The system's save dialog: nothing is written anywhere without the teacher's say.
  web.on("will-download", (_event, item) => item.setSaveDialogOptions({ defaultPath: path.join(app.getPath("downloads"), item.getFilename()) }));

  const tabs = new Map();
  const listeners = new Set();
  let nextId = 1;
  let selected = null;
  let rect = null;

  const changed = () => {
    for (const { onChange } of listeners) onChange();
  };
  const refused = () => {
    for (const { onRefused } of listeners) onRefused();
  };
  /** A page may be opened: an http(s) address, neither the disk nor the host. */
  const opens = (url) => "url" in webAddress(url, ownOrigin());

  /** The selected tab over the panel's rectangle, every other hidden. */
  function place() {
    const zoom = getWindow()?.webContents.getZoomFactor() ?? 1;
    for (const [id, tab] of tabs) {
      const shown = id === selected && rect !== null;
      tab.view.setVisible(shown);
      if (shown) tab.view.setBounds({ x: Math.round(rect.x * zoom), y: Math.round(rect.y * zoom), width: Math.round(rect.width * zoom), height: Math.round(rect.height * zoom) });
    }
  }

  async function loadFavicon(tab, urls) {
    const stamp = ++tab.faviconStamp;
    const url = urls.find((one) => /^https?:|^data:image\//.test(one));
    if (!url) return;
    try {
      let favicon = url;
      if (!url.startsWith("data:")) {
        const response = await web.fetch(url);
        const type = response.headers.get("content-type") ?? "";
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!response.ok || !type.startsWith("image/") || bytes.length > FAVICON_MAX) return;
        favicon = `data:${type.split(";")[0]};base64,${bytes.toString("base64")}`;
      }
      if (stamp === tab.faviconStamp && tabs.has(tab.state.id)) {
        tab.state.favicon = favicon;
        changed();
      }
    } catch {
      // A tab without its icon is still a tab.
    }
  }

  function wire(tab) {
    const contents = tab.view.webContents;
    const refresh = () => {
      Object.assign(tab.state, { title: contents.getTitle(), url: contents.getURL(), canBack: contents.navigationHistory.canGoBack(), canForward: contents.navigationHistory.canGoForward() });
      changed();
    };
    const load = (loading) => () => {
      tab.state.loading = loading;
      if (loading) tab.state.failed = false;
      refresh();
    };
    contents.on("did-start-loading", load(true));
    contents.on("did-stop-loading", load(false));
    contents.on("did-navigate", refresh);
    contents.on("did-navigate-in-page", refresh);
    contents.on("page-title-updated", refresh);
    contents.on("page-favicon-updated", (_event, urls) => void loadFavicon(tab, urls));
    contents.on("did-fail-load", (_event, code, _description, url, isMain) => {
      // -3 is a load abandoned for another, not an error.
      if (!isMain || code === -3) return;
      Object.assign(tab.state, { failed: true, url: tab.state.url || url });
      changed();
    });
    // A pop-up is a tab, and never a window of its own.
    contents.setWindowOpenHandler(({ url }) => {
      if (opens(url)) open(url);
      else refused();
      return { action: "deny" };
    });
    const guard = (event, url) => {
      if (opens(url)) return;
      event.preventDefault();
      refused();
    };
    contents.on("will-navigate", guard);
    contents.on("will-redirect", guard);
    contents.on("will-prevent-unload", (event) => {
      const text = LEAVE[app.getLocale().slice(0, 2)] ?? LEAVE.en;
      const options = { type: "question", buttons: [text.leave, text.stay], defaultId: 1, cancelId: 1, message: text.message };
      const parent = getWindow();
      if ((parent ? dialog.showMessageBoxSync(parent, options) : dialog.showMessageBoxSync(options)) === 0) event.preventDefault();
    });
  }

  function open(url) {
    const id = String(nextId++);
    const view = new WebContentsView({ webPreferences: { session: web, sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false, devTools: !app.isPackaged } });
    view.setBackgroundColor("#ffffff");
    view.setVisible(false);
    getWindow()?.contentView.addChildView(view);
    const tab = { view, faviconStamp: 0, state: { id, title: "", url: url ?? "", loading: Boolean(url), canBack: false, canForward: false, failed: false } };
    tabs.set(id, tab);
    wire(tab);
    changed();
    if (url) void view.webContents.loadURL(url).catch(() => undefined);
    return id;
  }

  return {
    list: () => [...tabs.values()].map((tab) => ({ ...tab.state })),
    subscribe(onChange, onRefused) {
      const listener = { onChange, onRefused };
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    open,
    close(id) {
      const tab = tabs.get(id);
      if (!tab) return;
      tabs.delete(id);
      if (selected === id) selected = null;
      getWindow()?.contentView.removeChildView(tab.view);
      tab.view.webContents.close();
      changed();
    },
    select(id) {
      selected = id;
      place();
    },
    navigate(id, url) {
      const tab = tabs.get(id);
      if (tab) void tab.view.webContents.loadURL(url).catch(() => undefined);
    },
    back(id) {
      tabs.get(id)?.view.webContents.navigationHistory.goBack();
    },
    forward(id) {
      tabs.get(id)?.view.webContents.navigationHistory.goForward();
    },
    reload(id) {
      tabs.get(id)?.view.webContents.reload();
    },
    bounds(next) {
      rect = next;
      place();
    },
    async capture(id) {
      const image = await tabs.get(id)?.view.webContents.capturePage();
      return image && !image.isEmpty() ? `data:image/jpeg;base64,${image.toJPEG(78).toString("base64")}` : undefined;
    },
    external(id) {
      const url = tabs.get(id)?.state.url;
      if (url && opens(url)) void openExternal(url);
    },
    zoom(id, delta) {
      const contents = tabs.get(id)?.view.webContents;
      if (contents) contents.setZoomFactor(delta === 0 ? 1 : Math.min(ZOOM.max, Math.max(ZOOM.min, contents.getZoomFactor() + delta * ZOOM.step)));
    },
    /** The cookies written down for the next start; what else the sites stored, gone. For the app's quitting. */
    async closeUp() {
      await web.cookies.flushStore().catch(() => undefined);
      await web.clearStorageData({ storages: ["filesystem", "indexdb", "localstorage", "shadercache", "websql", "serviceworkers", "cachestorage"] }).catch(() => undefined);
    },
    /** For automated checks only: the selected tab's contents. */
    selectedContents: () => tabs.get(selected)?.view.webContents,
  };
}
