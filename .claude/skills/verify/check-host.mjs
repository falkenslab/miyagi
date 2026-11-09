// Checks miyagi's local web host (src/host/server.ts, gui-host #46) without calling Claude: it
// runs in a child process whose home is a temporary folder, so there's no Claude key and no
// subject. Without the token, 403; with it, the events send `info` then `state`; a subject is
// created and opened from the page; a folder that isn't a registered subject can't be opened; a
// pasted key that isn't an API key is refused, a subscription token among them, and one miyagi
// had saved is removed on start and said (ADR-026); the page is served and nothing outside it is. The
// extensions view (#50): a repository is added only with its name typed, the official one can't
// be removed, and a classroom address that isn't one connects nothing. The sidebar (#84): the
// search over the kept conversations, and pinning one, only in its subject and after a restart. The
// desktop app's browser (#86), on a stub: its actions, the addresses it refuses, and no address in the chat's state.
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
const firstEvents = (count) => firstEventsOf(base, token, count);
async function firstEventsOf(base, token, count) {
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
check("no search without a subject open", (await post("search", { query: "x" })).error === "no subject");
check("no pin without a subject open", (await post("pin", { dir: "x", pinned: true })).error === "no subject");
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

// The sidebar (#84): the search over the kept conversations, and pinning one; neither needs a chat.
const keepConversation = (subject, name, lines) => {
  const dir = path.join(subject, "sessions", name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "session.json"), JSON.stringify({ sessionId: name, subagents: {} }));
  writeFileSync(path.join(dir, "conversation.jsonl"), lines.map(([type, text], index) => JSON.stringify({ type, uuid: `${name}-${index}`, timestamp: new Date(Date.now() - index * 1000).toISOString(), message: { role: type, content: text } })).join("\n"));
  return dir;
};
const oldConversation = keepConversation(subjectDir, "2026-09-09T10-00-00-000Z", [["user", "Prepara la rúbrica de la práctica"], ["assistant", "Hecho, con cuatro criterios."]]);
keepConversation(subjectDir, "2026-11-01T10-00-00-000Z", [["user", "Otra conversación distinta"], ["assistant", "De acuerdo."]]);
check("an empty search finds nothing", (await post("search", { query: "   " })).results?.length === 0);
const hit = (await post("search", { query: "RUBRICA" })).results ?? [];
check("a word said only in an old conversation finds it, whatever its case and accents", hit.length === 1 && hit[0].dir === oldConversation && hit[0].snippet.includes("rúbrica") && hit[0].title === "Prepara la rúbrica de la práctica" && hit[0].pinned === false);
check("…a word it says in a reply too", (await post("search", { query: "cuatro criterios" })).results?.[0]?.dir === oldConversation);
check("…and a word no conversation says, nothing", (await post("search", { query: "zanahoria" })).results?.length === 0);
const pinsFile = path.join(subjectDir, "sessions", "pinned.json");
for (const bad of [path.join(subjectDir, "sessions", "no-existe"), subjectDir, os.homedir(), ""]) {
  check(`only a kept conversation is pinned: ${bad}`, (await post("pin", { dir: bad, pinned: true })).error === "unknown conversation");
}
check("…and nothing was written for those", !existsSync(pinsFile));
check("a kept conversation is pinned", !(await post("pin", { dir: oldConversation, pinned: true })).error && readFileSync(pinsFile, "utf8").includes("2026-09-09T10-00-00-000Z"));
check("…outside the knowledge base, and shown as pinned", pinsFile.startsWith(path.join(subjectDir, "sessions")) && (await post("search", { query: "rubrica" })).results?.[0]?.pinned === true);
// Only in its subject: the other one neither finds it nor can pin it.
const pinnedSubjectId = ((await post("workspaces")).workspaces ?? []).find((ws) => ws.dir === subjectDir)?.id;
await post("open", { id: listed[0].id });
check("another subject doesn't find this subject's conversations", (await post("search", { query: "rubrica" })).results?.length === 0);
check("…nor pins one of them", (await post("pin", { dir: oldConversation, pinned: true })).error === "unknown conversation");
await post("open", { id: pinnedSubjectId });
check("back in its subject, it's still pinned", (await post("search", { query: "rubrica" })).results?.[0]?.pinned === true);
// After restarting the host, which reads the pins from the subject's folder.
const restarted = await startHost(subjectDir, {});
const restartedUrl = new URL(restarted.url);
const afterRestart = await (await fetch(`${restartedUrl.origin}/api/search?token=${restartedUrl.searchParams.get("token")}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: "rubrica" }) })).json();
await restarted.close();
check("a pinned conversation stays pinned after restarting", afterRestart.results?.[0]?.pinned === true);
check("…and is unpinned from it", !(await post("pin", { dir: oldConversation, pinned: false })).error && (await post("search", { query: "rubrica" })).results?.[0]?.pinned === false);

// A repository in a folder: added only with its name typed, and forgotten again.
const market = path.join(os.homedir(), "market");
mkdirSync(path.join(market, ".claude-plugin"), { recursive: true });
writeFileSync(path.join(market, ".claude-plugin", "marketplace.json"), JSON.stringify({ name: "dept", owner: { name: "Dept" }, plugins: [] }));
check("a repository is read before it's added", (await post("inspect-marketplace", { source: market })).name === "dept");
check("…not added without its name typed", (await post("add-marketplace", { source: market, typed: "dep" })).error === "name mismatch");
check("…so it isn't there", !((await post("marketplaces")).marketplaces ?? []).some((m) => m.name === "dept"));
check("…added with it", (await post("add-marketplace", { source: market, typed: "dept" })).name === "dept");
check("…and forgotten", !(await post("remove-marketplace", { name: "dept" })).error && !((await post("marketplaces")).marketplaces ?? []).length);

// The desktop app's browser (#86): only with the option, on a stub of the native side.
check("no browser without the desktop app", (await post("browser-open", { url: "https://moodle.org/" })).error === "no browser" && !events[0]?.data?.browser);
const browserCalls = [];
const browserTabs = [];
const browserListeners = [];
const fakeBrowser = {
  list: () => browserTabs,
  subscribe: (onChange, onRefused) => (browserListeners.push({ onChange, onRefused }), () => undefined),
  open: (address) => {
    const id = String(browserTabs.length + 1);
    browserTabs.push({ id, title: "Página", url: address ?? "", loading: false, canBack: false, canForward: false, failed: false });
    browserCalls.push(["open", address]);
    return id;
  },
  close: (id) => browserCalls.push(["close", id]),
  select: (id) => browserCalls.push(["select", id]),
  navigate: (id, address) => browserCalls.push(["navigate", id, address]),
  back: (id) => browserCalls.push(["back", id]),
  forward: (id) => browserCalls.push(["forward", id]),
  reload: (id) => browserCalls.push(["reload", id]),
  bounds: (rect) => browserCalls.push(["bounds", rect]),
  capture: async () => "data:image/png;base64,AAAA",
  external: (id) => browserCalls.push(["external", id]),
  zoom: (id, delta) => browserCalls.push(["zoom", id, delta]),
};
const withBrowser = await startHost(subjectDir, { browser: fakeBrowser });
const browserUrl = new URL(withBrowser.url);
const browserBase = browserUrl.origin;
const browserToken = browserUrl.searchParams.get("token");
const browserPost = async (action, data = {}) => (await fetch(`${browserBase}/api/${action}?token=${browserToken}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })).json();
const browserEvents = await new Promise((resolve) => {
  void (async () => {
    const response = await fetch(`${browserBase}/api/events?token=${browserToken}`);
    const reader = response.body.getReader();
    let text = "";
    while (!text.includes("event: browser\n")) text += new TextDecoder().decode((await reader.read()).value);
    await reader.cancel();
    resolve(text);
  })();
});
check("info says the desktop app has a browser", /"browser":true/.test(browserEvents));
const opened = await browserPost("browser-open", { url: "https://moodle.org/es" });
check("a page opens a tab", opened.id === "1" && browserCalls.at(-1)[1] === "https://moodle.org/es");
check("a new tab, with no address", (await browserPost("browser-open", {})).id === "2" && browserCalls.at(-1)[1] === undefined);
check("an address without a scheme is taken as https", (await browserPost("browser-navigate", { id: "1", url: "campus.example.org/moodle" })).url === "https://campus.example.org/moodle" && browserCalls.at(-1)[2] === "https://campus.example.org/moodle");
check("…and a local one as http, with its port", (await browserPost("browser-navigate", { id: "1", url: "localhost:8080/login" })).url === "http://localhost:8080/login");
for (const [bad, why] of [["file:///C:/Windows/win.ini", "refused"], ["FILE:/C:/x", "refused"], ["javascript:alert(1)", "invalid"], ["data:text/html,<b>", "invalid"], ["about:blank", "invalid"], ["hola mundo", "invalid"], ["palabra", "invalid"], ["", "invalid"], [`${browserBase}/?token=${browserToken}`, "refused"], [`http://localhost:${browserUrl.port}/`, "refused"], [`http://[::1]:${browserUrl.port}/`, "refused"], [`http://127.1:${browserUrl.port}/`, "refused"], [`http://0.0.0.0:${browserUrl.port}/`, "refused"], [`http://app.localhost:${browserUrl.port}/`, "refused"]]) {
  const before = browserCalls.length;
  check(`typed, refused: ${bad}`, (await browserPost("browser-navigate", { id: "1", url: bad })).error === why && browserCalls.length === before);
  check(`opened, refused: ${bad}`, (await browserPost("browser-open", { url: bad })).error === why && browserCalls.length === before);
}
for (const [action, data, call] of [["browser-select", { id: "1" }, ["select", "1"]], ["browser-select", { id: null }, ["select", null]], ["browser-back", { id: "1" }, ["back", "1"]], ["browser-forward", { id: "1" }, ["forward", "1"]], ["browser-reload", { id: "1" }, ["reload", "1"]], ["browser-bounds", { rect: { x: 1, y: 2, width: 3, height: 4 } }, ["bounds", { x: 1, y: 2, width: 3, height: 4 }]], ["browser-bounds", { rect: null }, ["bounds", null]], ["browser-external", { id: "1" }, ["external", "1"]], ["browser-zoom", { id: "1", delta: -1 }, ["zoom", "1", -1]], ["browser-close", { id: "2" }, ["close", "2"]]]) {
  await browserPost(action, data);
  check(`${action} reaches the native side`, JSON.stringify(browserCalls.at(-1)) === JSON.stringify(call));
}
check("a still comes as an image", (await browserPost("browser-capture", { id: "1" })).image.startsWith("data:image/"));
check("no other browser action exists", (await browserPost("browser-devtools", { id: "1" })).error?.startsWith("unknown action"));
const browserState = await firstEventsOf(browserBase, browserToken, 3);
check("the tabs reach the page on their own event, the chat's state knows no address", browserState[2]?.event === "browser" && browserState[2]?.data[0]?.url === "https://moodle.org/es" && !JSON.stringify(browserState[1]).includes("moodle.org"));
await withBrowser.close();

// Nothing secret reaches the page: not the URL's token, not a key.
const stream = JSON.stringify([...events, ...afterCreate, listed]);
check("no token nor key in what the page receives", !stream.includes(token) && !/sk-ant-/.test(stream));

await host.close();
if (failures.length) {
  for (const failure of failures) console.log(`FAIL ${failure}`);
  process.exit(1);
}
console.log("ok   host: token, events, subjects (moved, located, forgotten), sign-in refusal, page served, drafts/ only, repositories and classroom refusals, only an activity opened in the browser, the folder dialog, the conversations' search and pins, the desktop browser's actions and refusals");
