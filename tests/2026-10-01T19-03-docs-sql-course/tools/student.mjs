// Acts as a sandbox student in Moodle, for the docs tutorial.
//   node student.mjs <who> submit <assignCmid> <file> [<file>...]   -> uploads files and submits
//   node student.mjs <who> text <assignCmid> <textFile>                -> online text submission
//   node student.mjs <who> discuss <forumId> <subject> <messageFile>   -> new discussion (forum instance id)
//   node student.mjs <who> reply <discussionId> <messageFile>          -> reply to the first post
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.env.MIYAGI_DIR ?? process.cwd(), "package.json"));
const { chromium } = require("playwright-core");
const [who, action, ...args] = process.argv.slice(2);
const info = JSON.parse(execSync("npm run --silent info -- --json", { cwd: process.env.MOODLE_SANDBOX_DIR ?? "../moodle-sandbox" }).toString());
const users = { alumno: info.student };
for (const s of info.students ?? []) users[s.username] = s;
const cred = users[who];
if (!cred) throw new Error(`unknown student ${who}`);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "es-ES" })).newPage();
page.setDefaultTimeout(120000);
const go = (p) => page.goto(`${info.url}${p}`, { waitUntil: "networkidle" });

await go("/login/index.php");
await page.fill("#username", cred.username);
await page.fill("#password", cred.password);
await Promise.all([page.waitForNavigation(), page.click("#loginbtn")]);

async function setEditor(html) {
  // TinyMCE: write into the iframe body, then let Moodle sync the textarea on submit.
  await page.waitForSelector("iframe.tox-edit-area__iframe, iframe[id$='_ifr']");
  const frame = page.frameLocator("iframe.tox-edit-area__iframe, iframe[id$='_ifr']").first();
  await frame.locator("body").evaluate((b, h) => { b.innerHTML = h; }, html);
}
const toHtml = (text) => text.split(/\n{2,}/).map((p) => p.startsWith("```") ? `<pre>${p.replace(/^```\w*\n?|```$/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>` : `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`).join("");

if (action === "submit") {
  const [cmid, ...files] = args;
  await go(`/mod/assign/view.php?id=${cmid}&action=editsubmission`);
  for (const file of files) {
    await page.locator(".fp-btn-add a, a[title='Agregar...'], a[title='Añadir...']").first().click();
    await page.getByText(/Subir un archivo/i).first().click();
    await page.setInputFiles("input[type=file][name=repo_upload_file]", path.resolve(file));
    await page.getByRole("button", { name: /Subir este archivo/i }).click();
    await page.waitForSelector(".filepicker-filename, .fp-filename", { timeout: 60000 });
    await page.waitForTimeout(1500);
  }
  await Promise.all([page.waitForNavigation(), page.locator("#id_submitbutton").click()]);
  const confirm = page.getByRole("button", { name: /Enviar tarea|Submit assignment/i });
  if (await confirm.isVisible().catch(() => false)) {
    await Promise.all([page.waitForNavigation(), confirm.click()]);
    const accept = page.locator("#id_submitbutton");
    if (await accept.isVisible().catch(() => false)) await Promise.all([page.waitForNavigation(), accept.click()]);
  }
  console.log(`submitted as ${who}: ${page.url()}`);
} else if (action === "text") {
  const [cmid, textFile] = args;
  await go(`/mod/assign/view.php?id=${cmid}&action=editsubmission`);
  await setEditor(toHtml(fs.readFileSync(textFile, "utf8")));
  await Promise.all([page.waitForNavigation(), page.locator("#id_submitbutton").click()]);
  console.log(`text submitted as ${who}: ${page.url()}`);
} else if (action === "discuss") {
  const [forumId, subject, messageFile] = args;
  await go(`/mod/forum/post.php?forum=${forumId}`);
  await page.fill("#id_subject", subject);
  await setEditor(toHtml(fs.readFileSync(messageFile, "utf8")));
  await Promise.all([page.waitForNavigation(), page.locator("#id_submitbutton").click()]);
  console.log(`discussion posted as ${who}: ${page.url()}`);
} else if (action === "reply") {
  const [discussionId, messageFile] = args;
  await go(`/mod/forum/discuss.php?d=${discussionId}`);
  const post = await page.locator("[data-post-id]").first().getAttribute("data-post-id");
  await go(`/mod/forum/post.php?reply=${post}`);
  await setEditor(toHtml(fs.readFileSync(messageFile, "utf8")));
  await Promise.all([page.waitForNavigation(), page.locator("#id_submitbutton").click()]);
  console.log(`reply posted as ${who}: ${page.url()}`);
}
await browser.close();
