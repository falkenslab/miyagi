// Converts screenshots for the docs site to WebP, at most 1400 px wide, with the system Chrome
// (the playwright-core that comes with @playwright/mcp; no image library to install).
// Usage (from the repo root): node .claude/skills/update-docs/shot-to-webp.mjs <file.png>... [--quality=0.85]
// Writes <file>.webp next to each one and prints the sizes; the PNG is left for you to delete.
/* global Image, document -- used inside page.evaluate(), in the browser */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const { chromium } = require("playwright-core");

const args = process.argv.slice(2);
const quality = Number(args.find((a) => a.startsWith("--quality="))?.split("=")[1] ?? 0.85);
const files = args.filter((a) => !a.startsWith("--"));
if (!files.length) throw new Error("usage: shot-to-webp.mjs <file.png>... [--quality=0.85]");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
for (const file of files) {
  const src = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
  const webp = await page.evaluate(async ({ src, quality }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const scale = Math.min(1, 1400 / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL("image/webp", quality), width: canvas.width, height: canvas.height };
  }, { src, quality });
  const out = file.replace(/\.png$/i, ".webp");
  fs.writeFileSync(out, Buffer.from(webp.data.split(",")[1], "base64"));
  console.log(`${path.basename(out)} ${webp.width}x${webp.height} ${Math.round(fs.statSync(file).size / 1024)} KB -> ${Math.round(fs.statSync(out).size / 1024)} KB`);
}
await browser.close();
