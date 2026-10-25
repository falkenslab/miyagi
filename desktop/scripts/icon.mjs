// Draws the app's icon (`npm run icon`) from miyagi's logo (docs/static/img/miyagi.svg), so there's
// one drawing: Electron renders it on a rounded light tile and saves build/icon.png, which
// electron-builder turns into the Windows .ico. 512 px.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow } from "electron";

const desktop = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// The light colours only: an icon doesn't follow the system's theme.
const logo = readFileSync(path.join(desktop, "..", "docs", "static", "img", "miyagi.svg"), "utf8").replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?\}\s*\}/, "");
const size = 512;

app.whenReady().then(async () => {
  try {
    // Offscreen rendering: painted without being shown, and with a transparent background.
    const window = new BrowserWindow({ width: size, height: size, show: false, transparent: true, frame: false, useContentSize: true, webPreferences: { offscreen: true } });
    const svg = logo.replace(/<svg ([^>]*?)width="\d+" height="\d+"/, `<svg $1width="${size * 0.7}" height="${size * 0.75}"`);
    const html = `<html><body style="margin:0;background:transparent;overflow:hidden"><div style="width:${size}px;height:${size}px;border-radius:${size * 0.22}px;background:#f7f7f4;display:grid;place-items:center">${svg}</div></body></html>`;
    await window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const image = await window.webContents.capturePage();
    mkdirSync(path.join(desktop, "build"), { recursive: true });
    writeFileSync(path.join(desktop, "build", "icon.png"), image.toPNG());
    console.log(`build/icon.png (${image.getSize().width}x${image.getSize().height})`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
  app.quit();
});
