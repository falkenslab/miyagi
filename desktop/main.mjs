// miyagi as a desktop application (ADR-022, desktop-app #48): an Electron window around miyagi's
// own page. The main process starts miyagi's local host (src/host/server.ts) on a free port with a
// token that never leaves this process, and loads it in the window: the same page as `miyagi web`
// serves in a browser. Everything miyagi keeps goes in ~/.miyagi, the same as in the terminal: the
// subjects, the extensions, the Claude key, and this window's size and place (config.json). The
// app's own data folder keeps only Electron's caches.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, dialog, Menu, shell } from "electron";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = path.join(os.homedir(), ".miyagi", "config.json");

// For automated checks only: Electron's caches somewhere of their own, set first, so the
// single-instance lock below is theirs too.
if (process.env.MIYAGI_DESKTOP_DATA) app.setPath("userData", process.env.MIYAGI_DESKTOP_DATA);

// One window: a second launch brings the first to the front.
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// VS Code's terminal sets it, and with it every process Electron starts would be plain Node.
delete process.env.ELECTRON_RUN_AS_NODE;

let window = null;
let host = null;
let closedBounds = null;

function readConfig() {
  try {
    return JSON.parse(readFileSync(CONFIG, "utf8"));
  } catch {
    return {};
  }
}

/** The window's place, kept with miyagi's own settings (the Claude key's file, never shown to the model). */
function saveWindow(bounds) {
  const config = readConfig();
  mkdirSync(path.dirname(CONFIG), { recursive: true });
  writeFileSync(CONFIG, JSON.stringify({ ...config, desktop: { ...(config.desktop ?? {}), window: bounds } }, null, 2));
}

async function start() {
  // miyagi, compiled into miyagi/ by `npm run build`: the host and the page it serves.
  const { startHost } = await import("./miyagi/dist/host/server.js");
  // For automated checks only: a subject of their own, instead of the one opened last.
  host = await startHost(process.env.MIYAGI_DESKTOP_WORKSPACE || undefined);
  // For automated checks only: where the page is.
  if (process.env.MIYAGI_DESKTOP_URL_FILE) writeFileSync(process.env.MIYAGI_DESKTOP_URL_FILE, host.url);

  const saved = readConfig().desktop?.window;
  window = new BrowserWindow({
    ...(saved ?? { width: 1180, height: 820 }),
    minWidth: 380,
    minHeight: 520,
    // The page names the window (its <title>: the subject open).
    title: "miyagi",
    icon: path.join(here, "build", "icon.png"),
    backgroundColor: "#f7f7f4",
    autoHideMenuBar: true,
    show: false,
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true },
  });
  window.once("ready-to-show", () => window.show());
  // Links open in the person's browser; the window never leaves miyagi's page.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) void shell.openExternal(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(new URL(host.url).origin)) {
      event.preventDefault();
      if (/^https?:\/\//.test(url)) void shell.openExternal(url);
    }
  });
  window.on("close", () => (closedBounds = window.getNormalBounds()));
  await window.loadURL(host.url);
  if (process.env.MIYAGI_DESKTOP_SCRIPT) void runScript(process.env.MIYAGI_DESKTOP_SCRIPT);
}

/**
 * For automated checks only: steps run in this window (`{ js }`, `{ until }`, `{ wait }`,
 * `{ shot }`, `{ size }`), then the app quits. What a person sees, captured.
 */
async function runScript(file) {
  const { steps } = JSON.parse(readFileSync(file, "utf8"));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (const step of steps) {
    try {
      if (step.wait) await sleep(step.wait);
      if (step.size) {
        window.setContentSize(step.size[0], step.size[1]);
        await sleep(500);
      }
      if (step.js) console.log(`js: ${JSON.stringify(await window.webContents.executeJavaScript(step.js))}`);
      if (step.until) {
        const deadline = Date.now() + (step.timeout ?? 120000);
        while (Date.now() < deadline && !(await window.webContents.executeJavaScript(step.until))) await sleep(500);
        console.log(`until ${Date.now() < deadline ? "met" : "TIMED OUT"}`);
      }
      if (step.shot) {
        writeFileSync(step.shot, (await window.webContents.capturePage()).toPNG());
        console.log(`shot ${step.shot}`);
      }
    } catch (error) {
      console.log(`step failed: ${error.message}`);
    }
  }
  window.close();
}

app.on("second-instance", () => {
  if (window) {
    if (window.isMinimized()) window.restore();
    window.focus();
  }
});

app.whenReady().then(async () => {
  // A small menu: what the person may need, nothing of a browser's.
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: "fileMenu" },
      { role: "editMenu" },
      { role: "viewMenu", submenu: [{ role: "reload" }, { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" }, { type: "separator" }, { role: "togglefullscreen" }, ...(app.isPackaged ? [] : [{ role: "toggleDevTools" }])] },
    ]),
  );
  try {
    await start();
  } catch (error) {
    dialog.showErrorBox("miyagi", String(error?.stack ?? error));
    app.quit();
  }
});

app.on("window-all-closed", async () => {
  if (closedBounds) saveWindow(closedBounds);
  await host?.close();
  app.quit();
});
