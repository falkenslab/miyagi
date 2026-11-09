// Signs the sandbox's teacher in over HTTP and leaves the session in moodle-teacher's Chrome profile
// (localhost test site only, app closed). Reads the sandbox's info JSON on stdin; prints no secret.
import { pathToFileURL } from "node:url";
const { chromium } = await import(pathToFileURL("<miyagi>/node_modules/playwright-core/index.mjs").href);
let raw = "";
for await (const d of process.stdin) raw += d;
const info = JSON.parse(raw);
const { username, password } = info.teacher;
const jar = new Map();
const keep = (res) => { for (const c of res.headers.getSetCookie()) { const [kv] = c.split(";"); const i = kv.indexOf("="); jar.set(kv.slice(0, i), kv.slice(i + 1)); } };
const header = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
const first = await fetch(`${info.url}/login/index.php`, { redirect: "manual" });
keep(first);
const logintoken = /name="logintoken" value="([^"]+)"/.exec(await first.text())[1];
let res = await fetch(`${info.url}/login/index.php`, { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded", cookie: header() }, body: new URLSearchParams({ username, password, logintoken, anchor: "" }) });
keep(res);
for (let i = 0; i < 4 && res.status >= 300 && res.status < 400; i++) { res = await fetch(new URL(res.headers.get("location"), info.url), { redirect: "manual", headers: { cookie: header() } }); keep(res); }
const my = await fetch(`${info.url}/my/`, { redirect: "manual", headers: { cookie: header() } });
console.log("http signed in:", my.status === 200);
if (my.status !== 200) process.exit(1);
const ctx = await chromium.launchPersistentContext(process.argv[2], { channel: process.env.CH || "chrome", headless: true });
await ctx.clearCookies();
const url = new URL(info.url);
await ctx.addCookies([...jar].filter(([k]) => k.startsWith("MoodleSession")).map(([name, value]) => ({ name, value, domain: url.hostname, path: "/", httpOnly: true, sameSite: "Lax", expires: Math.floor(Date.now() / 1000) + 12 * 3600 })));
const page = ctx.pages()[0] ?? (await ctx.newPage());
await page.goto(`${info.url}/course/view.php?id=353`);
console.log("chrome signed in:", !/login\/index\.php/.test(page.url()), await page.title());
await ctx.close();
