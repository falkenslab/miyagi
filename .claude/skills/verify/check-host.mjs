// Checks miyagi's local web host (src/host/server.ts, gui-host #46) without calling Claude: it
// runs in a child process whose home is a temporary folder, so there's no Claude key and no
// subject. Without the token, 403; with it, the events send `info` then `state`; a subject is
// created and opened from the page; a folder that isn't a registered subject can't be opened; a
// pasted key that isn't one is refused; the page is served and nothing outside it is. The
// extensions view (#50): a repository is added only with its name typed, the official one can't
// be removed, and a classroom address that isn't one connects nothing.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-host.mjs
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

if (process.env.CHECK_HOST_CHILD !== "1") {
  const home = mkdtempSync(path.join(os.tmpdir(), "check-host-"));
  const env = { ...process.env, CHECK_HOST_CHILD: "1", HOME: home, USERPROFILE: home };
  for (const key of ["CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY"]) delete env[key];
  const child = spawnSync(process.execPath, [new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")], { env, encoding: "utf8" });
  process.stdout.write(child.stdout);
  process.stderr.write(child.stderr);
  rmSync(home, { recursive: true, force: true });
  process.exit(child.status ?? 1);
}

const { startHost } = await import(pathToFileURL(path.join(process.cwd(), "dist/host/server.js")).href);
const host = await startHost(undefined, {});
const url = new URL(host.url);
const token = url.searchParams.get("token");
const base = url.origin;
const failures = [];
const check = (what, ok) => ok || failures.push(what);

/** The first events of the stream: `info` and `state`, parsed. */
async function firstEvents(count) {
  const response = await fetch(`${base}/api/events?token=${token}`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const events = [];
  let text = "";
  while (events.length < count) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value);
    for (;;) {
      const end = text.indexOf("\n\n");
      if (end === -1) break;
      const block = text.slice(0, end);
      text = text.slice(end + 2);
      const event = /^event: (.+)$/m.exec(block)?.[1];
      const data = /^data: (.+)$/m.exec(block)?.[1];
      if (event) events.push({ event, data: data ? JSON.parse(data) : null });
    }
  }
  await reader.cancel();
  return events;
}
const post = async (action, data = {}) =>
  (await fetch(`${base}/api/${action}?token=${token}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })).json();

check("403 without the token", (await fetch(`${base}/`)).status === 403);
check("403 with a wrong token", (await fetch(`${base}/?token=${"x".repeat(token.length)}`)).status === 403);
check("the page with the token", (await fetch(`${base}/?token=${token}`)).status === 200);
check("nothing outside the page's folder", (await fetch(`${base}/..%2F..%2Fpackage.json?token=${token}`)).status === 404);

const events = await firstEvents(2);
check("events: info then state", events[0]?.event === "info" && events[1]?.event === "state");
check("info: no subject open", events[0]?.data?.workspace === null);
check("state: signed out without a key", events[1]?.data?.signedIn === false);

check("a key that isn't one is refused", (await post("login", { token: "not-a-key" })).error === "invalid");
check("no subjects yet", (await post("workspaces")).workspaces?.length === 0);
check("a subject that isn't registered can't be opened", (await post("open", { id: "../somewhere" })).error === "unknown subject");
check("a subject without a name can't be created", Boolean((await post("create", { label: "  " })).error));
const created = await post("create", { label: "Comprobación del host" });
check("a subject created from the page", !created.error);
const listed = (await post("workspaces")).workspaces ?? [];
check("…registered and open", listed.length === 1 && listed[0].name === "Comprobación del host");
const afterCreate = await firstEvents(1);
check("…and named in info", afterCreate[0]?.data?.workspace === "Comprobación del host");
check("no chat without a key", (await post("send", { line: "hola" })).error === "no chat");
check("a classroom that isn't a course's address connects nothing", (await post("classroom", { url: "not a url" })).error === "invalid");

// A repository in a folder: added only with its name typed, and forgotten again.
const market = path.join(os.homedir(), "market");
mkdirSync(path.join(market, ".claude-plugin"), { recursive: true });
writeFileSync(path.join(market, ".claude-plugin", "marketplace.json"), JSON.stringify({ name: "dept", owner: { name: "Dept" }, plugins: [] }));
check("a repository is read before it's added", (await post("inspect-marketplace", { source: market })).name === "dept");
check("…not added without its name typed", (await post("add-marketplace", { source: market, typed: "dep" })).error === "name mismatch");
check("…so it isn't there", !((await post("marketplaces")).marketplaces ?? []).some((m) => m.name === "dept"));
check("…added with it", (await post("add-marketplace", { source: market, typed: "dept" })).name === "dept");
check("…and forgotten", !(await post("remove-marketplace", { name: "dept" })).error && !((await post("marketplaces")).marketplaces ?? []).length);

// Nothing secret reaches the page: not the URL's token, not a key.
const stream = JSON.stringify([...events, ...afterCreate, listed]);
check("no token nor key in what the page receives", !stream.includes(token) && !/sk-ant-/.test(stream));

await host.close();
if (failures.length) {
  for (const failure of failures) console.log(`FAIL ${failure}`);
  process.exit(1);
}
console.log("ok   host: token, events, subjects, sign-in refusal, page served, repositories and classroom refusals");
