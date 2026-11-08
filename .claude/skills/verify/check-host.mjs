// Checks miyagi's local web host (src/host/server.ts, gui-host #46) without calling Claude: it
// runs in a child process whose home is a temporary folder, so there's no Claude key and no
// subject. Without the token, 403; with it, the events send `info` then `state`; a subject is
// created and opened from the page; a folder that isn't a registered subject can't be opened; a
// pasted key that isn't an API key is refused, a subscription token among them, and one miyagi
// had saved is removed on start and said (ADR-026); the page is served and nothing outside it is. The
// extensions view (#50): a repository is added only with its name typed, the official one can't
// be removed, and a classroom address that isn't one connects nothing.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-host.mjs
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

if (process.env.CHECK_HOST_CHILD !== "1") {
  const home = mkdtempSync(path.join(os.tmpdir(), "check-host-"));
  const env = { ...process.env, CHECK_HOST_CHILD: "1", HOME: home, USERPROFILE: home };
  for (const key of ["CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY", "CLAUDE_CONFIG_DIR"]) delete env[key];
  // A token saved by a miyagi before ADR-026: the host must remove it.
  mkdirSync(path.join(home, ".miyagi"), { recursive: true });
  writeFileSync(path.join(home, ".miyagi", "config.json"), JSON.stringify({ claudeCodeOAuthToken: "sk-ant-oat01-not-a-real-one", defaultLanguage: "español" }));
  const child = spawnSync(process.execPath, [new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")], { env, encoding: "utf8" });
  process.stdout.write(child.stdout);
  process.stderr.write(child.stderr);
  rmSync(home, { recursive: true, force: true });
  process.exit(child.status ?? 1);
}

const { startHost } = await import(pathToFileURL(path.join(process.cwd(), "dist/host/server.js")).href);
// The folder dialog (#79), stubbed: what it was asked, and a pause so a second one finds it open.
const asked = [];
const pickFolder = async (title, start) => {
  asked.push({ title, start });
  await new Promise((resolve) => setTimeout(resolve, 300));
  return title === "cancel" ? undefined : path.join(os.homedir(), "elegida");
};
const host = await startHost(undefined, { pickFolder });
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
check("a token saved before is removed, and said", events[1]?.data?.tokenForgotten === true && !readFileSync(path.join(os.homedir(), ".miyagi", "config.json"), "utf8").includes("sk-ant-oat"));
check("…and the rest of the config kept", readFileSync(path.join(os.homedir(), ".miyagi", "config.json"), "utf8").includes("español"));
check("a subscription token pasted is refused", (await post("login", { token: "sk-ant-oat01-abcdef" })).error === "invalid");
check("no code without a sign-in under way", (await post("signin-code", { code: "abc" })).error === "invalid");

check("a key that isn't one is refused", (await post("login", { token: "not-a-key" })).error === "invalid");
check("no subjects yet", (await post("workspaces")).workspaces?.length === 0);
check("info says the host has a folder dialog", events[0]?.data?.pickFolder === true);
const [picked, again] = await Promise.all([post("pick-folder", { title: "Carpeta", start: "C:/inicio" }), post("pick-folder", { title: "otra" })]);
check("the folder chosen in the dialog comes back, with the dialog's title and start", picked.path === path.join(os.homedir(), "elegida") && asked[0]?.title === "Carpeta" && asked[0]?.start === "C:/inicio");
check("a second dialog while one is open is refused", again.error === "busy" && asked.length === 1);
check("a cancelled dialog gives no folder", !("path" in (await post("pick-folder", { title: "cancel" }))));
check("a subject that isn't registered can't be opened", (await post("open", { id: "../somewhere" })).error === "unknown subject");
check("a subject without a name can't be created", Boolean((await post("create", { label: "  " })).error));
const created = await post("create", { label: "Comprobación del host" });
check("a subject created from the page", !created.error);
const listed = (await post("workspaces")).workspaces ?? [];
check("…registered and open", listed.length === 1 && listed[0].name === "Comprobación del host");
const afterCreate = await firstEvents(1);
check("…and named in info", afterCreate[0]?.data?.workspace === "Comprobación del host");
check("no chat without a key", (await post("send", { line: "hola" })).error === "no chat");
// A subject whose folder was moved (gui-workspaces #49): missing, located again, forgotten.
const second = await post("create", { label: "Asignatura movida" });
const movedFrom = ((await post("workspaces")).workspaces ?? []).find((ws) => ws.name === "Asignatura movida")?.dir;
await post("open", { id: listed[0].id });
const movedTo = `${movedFrom}-nueva`;
renameSync(movedFrom, movedTo);
const missing = ((await post("workspaces")).workspaces ?? []).find((ws) => ws.name === "Asignatura movida");
check("a moved subject shows as missing", !second.error && missing?.missing === true);
check("…can't be located in a folder that isn't a subject", (await post("locate", { id: missing?.id, dir: os.homedir() })).error === "not a subject");
check("…is located again in its new folder", !(await post("locate", { id: missing?.id, dir: movedTo })).error && ((await post("workspaces")).workspaces ?? []).find((ws) => ws.id === missing?.id)?.missing === false);
check("…and forgotten, its folder kept", !(await post("forget", { id: missing?.id })).error && !((await post("workspaces")).workspaces ?? []).some((ws) => ws.id === missing?.id) && existsSync(movedTo));
check("the open subject can't be forgotten", (await post("forget", { id: listed[0].id })).error === "open");
check("a folder that isn't a subject can't be opened", (await post("add-existing", { dir: os.homedir() })).error === "not a subject");
check("a subject on the disk, not in the list, is opened and listed", !(await post("add-existing", { dir: movedTo })).error && ((await post("workspaces")).workspaces ?? []).some((ws) => ws.dir === movedTo && !ws.missing));
// A new subject in a folder of the teacher's: empty or new only.
const chosenDir = path.join(os.homedir(), "nube", "Bases de datos");
check("a subject created in a chosen folder", !(await post("create", { label: "En mi carpeta", dir: chosenDir })).error && existsSync(path.join(chosenDir, "config.json")));
check("…not in a folder with things in it", (await post("create", { label: "Otra", dir: path.dirname(chosenDir) })).error === "folder not empty");
check("…nor over a subject", (await post("create", { label: "Otra", dir: chosenDir })).error === "already a subject");
// The terminal finds the subjects the page created: one registry for both.
const terminal = spawnSync(process.execPath, [path.join(process.cwd(), "dist", "cli.js"), "workspaces", "--language=en"], { encoding: "utf8", env: process.env }).stdout;
check("`miyagi workspaces` lists the subjects made in the page", terminal.includes("Comprobación del host") && terminal.includes("En mi carpeta") && terminal.includes("-w en-mi-carpeta"));

// A material to preview only from drafts/ (gui-course-views #51): never a path out of it.
for (const bad of ["../config.json", "..%2Fconfig.json", "x/../../config.json", "/etc/passwd", "C:/Windows/win.ini"]) {
  check(`drafts/ only: ${bad}`, (await fetch(`${base}/api/drafts/file?path=${bad}&token=${token}`)).status === 403);
}
check("a material without the token", (await fetch(`${base}/api/drafts/file?path=x.html`)).status === 403);
// …and from materials/ (the banks, quizzes and rubrics, BD suite): its files, never a hidden one nor a way out.
const subjectDir = ((await post("workspaces")).workspaces ?? []).find((ws) => ws.name === "En mi carpeta")?.dir; // the one created last is open
mkdirSync(path.join(subjectDir, "materials"), { recursive: true });
writeFileSync(path.join(subjectDir, "materials", "practicas.rubric.md"), "# Rúbrica");
writeFileSync(path.join(subjectDir, "materials", ".publications.json"), "{}");
check("a material in materials/ is previewed", (await fetch(`${base}/api/drafts/file?path=materials/practicas.rubric.md&token=${token}`)).status === 200);
for (const bad of ["materials/.publications.json", "materials/../config.json", "drafts/../config.json", "config.json", "sources/x.pdf"]) {
  check(`materials/ and drafts/ only: ${bad}`, (await fetch(`${base}/api/drafts/file?path=${bad}&token=${token}`)).status === 403);
}
// An activity opened in the computer's browser (#69): only an HTML file in materials/ or drafts/ (the way it succeeds opens a browser: not tried here).
for (const bad of ["materials/practicas.rubric.md", "drafts/../config.json", "../x.html", "sources/x.html", "materials/.hidden.html", "C:/Windows/x.html", "drafts/none/index.html"]) {
  check(`only an activity is opened: ${bad}`, (await post("open-file", { path: bad })).error === "not an activity");
}
check("a classroom that isn't a course's address connects nothing", (await post("classroom", { url: "not a url" })).error === "invalid");

// The own commands' editor (#78): the same checks as miyagi's commands_save; what the editor doesn't show is kept, a forbidden key isn't.
const ownFile = path.join(subjectDir, ".claude", "commands", "sopa.md");
mkdirSync(path.dirname(ownFile), { recursive: true });
writeFileSync(ownFile, "---\ndescription: Una sopa\nlabel: es=Sopa | en=Word search\nproduces: html-activity\nallowed-tools: Bash\nparameters:\n  - name: count\n    type: number\n    default: 10\n---\n\nHazla: $ARGUMENTS\n");
const ownListed = (await post("own-commands")).commands ?? [];
check("the editor lists an own command, with its parameters", ownListed.length === 1 && ownListed[0].command === "sopa" && ownListed[0].draft.parameters[0]?.default === 10 && ownListed[0].draft.label.es === "Sopa");
const ownDraft = ownListed[0]?.draft;
const ownSave = (changes, name = "sopa", previous = "sopa", scope = "subject") => post("own-command-save", { scope, name, previous, draft: { ...ownDraft, ...changes } });
check("no parameters' place in the instructions, refused", (await ownSave({ instructions: "Sin valores" })).errors?.some((error) => error.includes("$ARGUMENTS")));
check("no label, refused", (await ownSave({ label: { es: " " } })).errors?.some((error) => error.includes("label")));
check("a shell line, refused", (await ownSave({ instructions: "!`dir` $ARGUMENTS" })).errors?.some((error) => error.includes("shell")));
check("a name that isn't one, refused", (await ownSave({}, "../fuera")).errors?.length > 0 && !existsSync(path.join(subjectDir, ".claude", "fuera.md")));
check("a command out of the folder can't be read", (await ownSave({}, "sopa", "../sopa")).errors?.length > 0);
check("an unknown scope, refused", (await ownSave({}, "sopa", "sopa", "../x")).error === "unknown scope");
check("…and none of those touched the file", readFileSync(ownFile, "utf8").includes("allowed-tools"));
check("a good change saved", (await ownSave({ label: { es: "Sopa nueva", en: "Word search" }, parameters: [{ ...ownDraft.parameters[0], default: 12 }] })).errors?.length === 0);
const ownSaved = readFileSync(ownFile, "utf8");
check("…with what the editor doesn't show kept, a forbidden key gone", ownSaved.includes("Sopa nueva") && ownSaved.includes("default: 12") && ownSaved.includes("produces: html-activity") && !ownSaved.includes("allowed-tools"));
check("renamed, the old file goes", (await ownSave({}, "sopa-dos")).errors?.length === 0 && !existsSync(ownFile) && existsSync(path.join(subjectDir, ".claude", "commands", "sopa-dos.md")));
check("deleted", (await post("own-command-delete", { scope: "subject", name: "sopa-dos" })).errors?.length === 0 && ((await post("own-commands")).commands ?? []).length === 0);
check("deleting one out of the folder is refused", (await post("own-command-delete", { scope: "subject", name: "../config" })).errors?.length > 0);

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
console.log("ok   host: token, events, subjects (moved, located, forgotten), sign-in refusal, page served, drafts/ only, repositories and classroom refusals, only an activity opened in the browser, the folder dialog");
