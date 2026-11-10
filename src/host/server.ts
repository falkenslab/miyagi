import { spawn } from "node:child_process";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agentKitVersion, createChatController, getLanguage, readConversation, startClaudeSignIn, type ChatController, type ClaudeSignIn, type Mode } from "@falkenslab/agent-kit";
import { prepareSession, VERSION } from "../agent.js";
import { watchStart } from "./startWatch.js";
import { conversationTitle, isOnlyGreeting, isOpening, latestRuns, readPinned, searchConversations, setPinned } from "./conversations.js";
import { t } from "../messages/index.js";
import { withClassroomPages } from "./classroomLinks.js";
import { chooseLanguageFor, claudeAuthAvailable, forgetSavedClaudeToken, loadWorkspaceEnv, readPageSettings, saveClaudeKey, savePageSettings } from "../globalConfig.js";
import { friendlyToolLabel, toolPhrase } from "../toolLabels.js";
import { listCommands, type ActionMeta, type CatalogEntry } from "../catalog.js";
import { draftsDirFor, materialsDirFor, readWorkspaceConfig, type AgentPersona, sessionsDirFor, sourcesDirFor, workspaceExists, workspaceLabel } from "../workspace.js";
import { createSubject, forgetWorkspace, listWorkspaces, registerWorkspace } from "../workspaces.js";
import { deleteOwn, ownCommands, saveDraft, type CommandDraft } from "../ownCommands.js";
import { topicWords, draftsList, knowledgeIndex, preparedFile, knowledgePage, knowledgeSearch, oven, PREVIEW_TYPES, resolveItems, sourcesList, today, topics } from "./course.js";
import { webAddress, type BrowserRect, type EmbeddedBrowser } from "./browser.js";
import { systemFolderPicker, type FolderPicker } from "./folderPicker.js";
import { addRepository, capabilities, catalog, connectClassroom, inspect, marketplaces, pageExtensions, removeRepository } from "./extensions.js";

/**
 * miyagi's local web host (ADR-022, gui-host #46): the chat of one subject at a time, run by
 * agent-kit's chat controller, offered to a page (the browser's, or the desktop app's window) as
 * state and actions. On 127.0.0.1 only, with a random token in the URL without which nothing
 * answers; the chat's state reaches the page as server-sent events, and what the person does
 * comes back as POSTs. The page can switch to another registered subject or create one
 * (gui-workspaces, #49), see what miyagi can do, manage its extensions and connect a classroom
 * (gui-extensions, #50), and read the course: its plan, topics, materials, sources and knowledge
 * base (gui-course-views, #51). No dependencies: node:http and the built page in dist/gui/. Every rule
 * stays in the agent (modes, approvals, file scope, gates): the page draws the state and sends actions.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** The built page (gui/, built by Vite into dist/gui/). */
const PAGE_DIR = path.join(__dirname, "..", "gui");
/** The most a file the person adds can weigh. */
const MAX_UPLOAD = 50 * 1024 * 1024;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

/** The kit's own chat commands the page offers besides miyagi's catalog. */
const KIT_COMMANDS = ["resume", "plan", "extensions"];

/** A command as an action of the page (#67): its name without the slash, and how to offer it. */
export interface PageAction extends Partial<ActionMeta> {
  command: string;
  description?: string;
  extension?: string;
}

/**
 * The catalog's commands as the page's actions: the ones with metadata as the frontmatter says;
 * an extension's or the subject's own without it, in the catalog only (contextual-actions #67).
 */
export function pageActions(entries: CatalogEntry[]): PageAction[] {
  return entries
    .filter((entry) => entry.action || entry.origin !== "builtin")
    .map((entry) => ({ command: entry.name.replace(/^\//, ""), description: entry.description, extension: entry.extension, ...entry.action }));
}

/** Opens a folder in this computer's file explorer, or a file in its default app (the host runs where the person is: 127.0.0.1). */
function openInSystem(target: string): void {
  const [command, args] = process.platform === "win32" ? ["explorer.exe", [target]] : process.platform === "darwin" ? ["open", [target]] : ["xdg-open", [target]];
  spawn(command, args, { detached: true, stdio: "ignore" }).on("error", () => undefined).unref();
}

/** A logo's types: an image, nothing a browser would run. */
const IMAGE_TYPES: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

export interface HostOptions {
  /**
   * Choose the interface language for the subject it opens (the app: nothing chose it before).
   * `miyagi web` has chosen it already, from its arguments, and leaves it as it is.
   */
  chooseLanguage?: boolean;
  /** The port; a free one if not given. */
  port?: number;
  /** The token of the URL; a random one if not given. */
  token?: string;
  /** The folder dialog (#79): the desktop app's own; without it, the system's, opened by the host. */
  pickFolder?: FolderPicker;
  /** The desktop app's web browser (#86): without it, the panel offers none. */
  browser?: EmbeddedBrowser;
  /** The desktop app's window (#87): its title bar is the page's. In the browser, there's none. */
  frame?: WindowFrame;
}

/** What the title bar of the desktop app does through the host: the window's menu roles, and the system buttons' colours. */
export interface WindowFrame {
  /** Whether the app's developer tools can be opened (unpacked only). */
  devTools: boolean;
  role(name: string): void;
  colors(color: string, symbolColor: string): void;
}

/** The menu's roles the title bar may ask for, today's menu and no others. */
const WINDOW_ROLES = new Set(["close", "undo", "redo", "cut", "copy", "paste", "delete", "selectAll", "reload", "resetZoom", "zoomIn", "zoomOut", "togglefullscreen", "toggleDevTools"]);

export interface Host {
  /** The page's URL, token included: for this process and the window it opens, never printed in a log. */
  url: string;
  close(): Promise<void>;
}

/** The subject open now: its chat, once there's a Claude key to open it with. */
interface OpenSubject {
  dir: string;
  label: string;
  prepared: Awaited<ReturnType<typeof prepareSession>>;
  chat: ChatController | null;
  opening: Promise<void> | null;
  /** What preparing it would have printed in a terminal: told in the chat once it opens. */
  notices: string[];
  /** The commands the page offers: miyagi's catalog (as `miyagi commands` lists it) and the kit's, for the extensions running now. */
  commands: { active: string; names: Set<string>; actions: PageAction[] } | null;
}

/**
 * Starts the host: on `workspaceDir` if given, else on the subject opened last, else on none
 * (the page then shows the subjects to open or create).
 */
export async function startHost(workspaceDir?: string, options: HostOptions = {}): Promise<Host> {
  const token = options.token ?? randomBytes(18).toString("base64url");
  // A token saved before ADR-026 goes; the page then says why it asks to sign in.
  const tokenForgotten = await forgetSavedClaudeToken();
  let signedIn = await claudeAuthAvailable();
  let current: OpenSubject | null = null;
  const pickFolder = options.pickFolder ?? systemFolderPicker();
  let picking = false;
  /** The messages sent during a turn (#62), by conversation and entry: the kit keeps no mark of them. */
  const steered = new Set<string>();
  /**
   * A conversation being opened, new or resumed: the kit ends the old one's input first, so a line
   * sent meanwhile would be lost there and leave the new one busy and empty (#88). It waits instead.
   */
  let switching: Promise<void> | null = null;
  const switchConversation = async (open: () => Promise<void>) => {
    const opening = open();
    switching = opening;
    try {
      await opening;
    } finally {
      if (switching === opening) switching = null;
    }
  };
  /** The address the browser must never reach (#86): set once the server listens, before any page can ask. */
  let ownOrigin = "";
  /**
   * Signing in with a Claude account: Claude Code's own sign-in (`claude auth login`), run by
   * the kit. The page shows its address (the binary opens the browser itself) and a box for the
   * code Anthropic's page may give; Claude Code keeps the session, miyagi never sees it.
   */
  let signIn: { flow: ClaudeSignIn; url: string | null; failed: boolean } | null = null;
  async function startSignIn(): Promise<{ url: string | null }> {
    signIn?.flow.cancel();
    const flow = startClaudeSignIn();
    const attempt = { flow, url: null as string | null, failed: false };
    signIn = attempt;
    schedule();
    attempt.url = (await flow.url) ?? null;
    schedule();
    void flow.done.then(async (ok) => {
      if (signIn !== attempt) return;
      signedIn = ok;
      signIn = ok ? null : { ...attempt, failed: true };
      if (ok && current) await openChat(current);
      schedule();
    });
    return { url: attempt.url };
  }

  async function openSubject(dir: string): Promise<void> {
    current?.chat?.close();
    current = null;
    send("info", info());
    schedule();
    await loadWorkspaceEnv(dir);
    const notices: string[] = [];
    const prepared = await prepareSession("chat", dir, { canPrompt: false, say: (line) => notices.push(line) });
    if (!prepared.openSession || !prepared.label) throw new Error(`${dir} is not a miyagi subject`);
    const subject: OpenSubject = { dir, label: prepared.label, prepared, chat: null, opening: null, notices, commands: null };
    current = subject;
    send("info", info());
    if (signedIn) await openChat(subject);
    schedule();
  }

  function openChat(subject: OpenSubject): Promise<void> {
    subject.opening ??= (async () => {
      const { openSession, chatOpening } = subject.prepared;
      if (!openSession || !chatOpening) return;
      const sessions = sessionsDirFor(subject.dir);
      const controller = await createChatController((run) => openSession(run.dir, run), {
        runsDir: sessions,
        historyPath: path.join(sessions, "history.jsonl"),
        initialPrompt: chatOpening(),
        // Approvals, choices and forms are part of the state: the page answers them.
        panels: "state",
        // Nobody leaves by typing here: the window or the tab closes.
        exitCommands: [],
        formatAction: friendlyToolLabel,
        toolPhrase,
      });
      // Switched to another subject while this one was opening: close it.
      if (current !== subject) return controller.close();
      subject.chat = controller;
      controller.subscribe(() => schedule());
      const stopWatching = watchStart(controller, () => {
        stopWatching();
        if (current !== subject || subject.chat !== controller) return;
        subject.notices.push(t().startStuck);
        subject.chat = null;
        subject.opening = null;
        controller.close();
        void openChat(subject).catch(() => undefined);
      });
      schedule();
      // The greeting is a turn of tens of seconds: the page shows the conversation waiting for it
      // (#59) instead of the request that opened the subject hanging until it ends.
      void controller
        .start()
        .catch((error: unknown) => controller.notice(String((error as Error)?.message ?? error), "error"))
        .then(() => {
          for (const line of subject.notices.splice(0)) controller.notice(line, "warn");
          schedule();
        });
    })();
    return subject.opening;
  }

  // One person at a time: the last connection wins, and the one before is told.
  let client: ServerResponse | null = null;
  let pending: ReturnType<typeof setTimeout> | null = null;
  /** The state to the page, at most every 50 ms (the text arrives in small pieces). */
  function schedule(): void {
    if (pending) return;
    pending = setTimeout(() => {
      pending = null;
      send("state", snapshot());
    }, 50);
  }
    /** The chat's state for the page: its extensions without paths or option values. */
  /**
   * The chat's state for the page: its extensions without paths or option values, and only
   * miyagi's commands. The SDK also lists Claude Code's own (/agents, /batch, its bundled skills),
   * which are for whoever develops with it, not for a teacher.
   */
  function chatState() {
    const subject = current;
    const state = subject?.chat?.getState();
    if (!subject || !state) return null;
    // A new conversation may know new commands (an own one saved in the last, #68): read them again.
    const active = `${(state.extensions?.active ?? []).join(",")}|${state.commandDetails.length}`;
    if (subject.commands?.active !== active) {
      subject.commands = { active, names: subject.commands?.names ?? new Set(KIT_COMMANDS), actions: subject.commands?.actions ?? [] };
      void listCommands(subject.dir).then((entries) => {
        if (subject.commands?.active !== active) return;
        subject.commands = { active, names: new Set([...KIT_COMMANDS, ...entries.map((entry) => entry.name.replace(/^\//, ""))]), actions: pageActions(entries) };
        schedule();
      });
    }
    const { names } = subject.commands;
    // Only what this conversation can run: an own command saved now, from the next one.
    const known = new Set(state.commandDetails.map((command) => command.name));
    const actions = known.size ? subject.commands.actions.filter((action) => known.has(action.command)) : subject.commands.actions;
    const commandDetails = state.commandDetails.filter((command) => names.has(command.name));
    // A resumed conversation brings back what the teacher never wrote: the greeting miyagi sends
    // itself to open it, and the SDK's mark for an interrupted turn.
    const opening = subject.prepared.chatOpening?.();
    const kept = state.transcript.filter((entry) => entry.kind !== "user" || (!isOpening(entry.text, opening) && !/^\[Request interrupted/.test(entry.text)));
    // A message sent during a turn (#62) is marked: the page shows it queued and keeps the turn whole.
    const run = state.run?.dir;
    const transcript = withClassroomPages(kept, subject.prepared.workspace?.classroom?.url).map((entry) => (entry.kind === "user" && steered.has(`${run}#${entry.id}`) ? { ...entry, steered: true } : entry));
    return { ...state, transcript, commandDetails, commands: commandDetails.map((command) => command.name), actions, extensions: pageExtensions(state.extensions) };
  }
  const snapshot = () => ({
    signedIn,
    signIn: signIn ? { url: signIn.url, failed: signIn.failed } : null,
    tokenForgotten,
    chat: chatState(),
    opening: Boolean(current && !current.chat),
  });
  /** The subject's classroom: where, and whether moodle-teacher reaches it now. */
  const classroom = () => {
    const room = current?.prepared.workspace?.classroom;
    return room ? { url: room.url, courseId: room.courseId, connected: Boolean(current?.prepared.classroom) } : null;
  };
  const info = () => ({ name: "miyagi", version: VERSION, kit: agentKitVersion(), language: getLanguage(), workspace: current?.label ?? null, classroom: classroom(), pickFolder: Boolean(pickFolder), browser: Boolean(options.browser), frame: Boolean(options.frame), frameDevTools: Boolean(options.frame?.devTools) });
  function send(event: string, data: unknown): void {
    client?.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
  // A heartbeat every 20 s, so no proxy closes the connection for being idle.
  const heartbeat = setInterval(() => client?.write(": ping\n\n"), 20_000);

  const authorized = (request: IncomingMessage, url: URL): boolean => {
    const given = url.searchParams.get("token") ?? request.headers["x-token"];
    if (typeof given !== "string" || given.length !== token.length) return false;
    return timingSafeEqual(Buffer.from(given), Buffer.from(token));
  };

  async function body(request: IncomingMessage, limit: number): Promise<Buffer> {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of request) {
      size += (chunk as Buffer).length;
      if (size > limit) throw new Error("too large");
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
  }

  /** The desktop app's browser (#86): the page's actions on its tabs, each address checked here; none of it near the chat. */
  async function browserAction(action: string, data: Record<string, unknown>): Promise<unknown> {
    const browser = options.browser;
    if (!browser) return { error: "no browser" };
    const id = String(data.id ?? "");
    switch (action) {
      case "browser-open": {
        if (data.url === undefined || data.url === null) return { id: browser.open() };
        const address = webAddress(String(data.url), ownOrigin);
        return "url" in address ? { id: browser.open(address.url) } : address;
      }
      case "browser-navigate": {
        const address = webAddress(String(data.url ?? ""), ownOrigin);
        if ("url" in address) browser.navigate(id, address.url);
        return address;
      }
      case "browser-close":
        browser.close(id);
        return {};
      case "browser-select":
        browser.select(data.id === null ? null : id);
        return {};
      case "browser-back":
        browser.back(id);
        return {};
      case "browser-forward":
        browser.forward(id);
        return {};
      case "browser-reload":
        browser.reload(id);
        return {};
      case "browser-bounds":
        browser.bounds((data.rect ?? null) as BrowserRect | null);
        return {};
      case "browser-capture":
        return { image: await browser.capture(id) };
      case "browser-external":
        browser.external(id);
        return {};
      case "browser-zoom":
        browser.zoom(id, Number(data.delta) || 0);
        return {};
      default:
        return { error: `unknown action ${action}` };
    }
  }

  /** What the person does, by path: the subjects, signing in, then one to one to the chat controller. */
  async function act(action: string, data: Record<string, unknown>): Promise<unknown> {
    if (action.startsWith("browser-")) return browserAction(action, data);
    // The desktop app's title bar (#87): the menu's roles and the window buttons' colours, nothing else.
    if (action === "window-role") {
      if (!options.frame) return { error: "no frame" };
      const role = String(data.role);
      if (!WINDOW_ROLES.has(role) || (role === "toggleDevTools" && !options.frame.devTools)) return { error: "unknown role" };
      options.frame.role(role);
      return {};
    }
    if (action === "window-colors") {
      if (!options.frame) return { error: "no frame" };
      const [color, symbolColor] = [String(data.color), String(data.symbolColor)];
      if (![color, symbolColor].every((value) => /^#[0-9a-f]{6}$/i.test(value))) return { error: "invalid colour" };
      options.frame.colors(color, symbolColor);
      return {};
    }
    switch (action) {
      // A folder chosen in the system's dialog, for a field that asks for one: one dialog at a time.
      case "pick-folder": {
        if (!pickFolder) return { error: "no dialog" };
        if (picking) return { error: "busy" };
        picking = true;
        try {
          const chosen = await pickFolder(String(data.title ?? ""), data.start ? String(data.start) : undefined);
          return chosen ? { path: chosen } : {};
        } finally {
          picking = false;
        }
      }
      // An API key pasted: the only key the page takes (a subscription is signed in with).
      case "login":
        if (!(await saveClaudeKey(String(data.token ?? "")))) return { error: "invalid" };
        signIn?.flow.cancel();
        signIn = null;
        signedIn = true;
        if (current) await openChat(current);
        schedule();
        return {};
      case "signin-start":
        return startSignIn();
      case "signin-code": {
        const code = String(data.code ?? "").trim();
        if (!signIn || !code || /\s/.test(code)) return { error: "invalid" };
        signIn.flow.sendCode(code);
        return {};
      }
      case "signin-cancel":
        signIn?.flow.cancel();
        signIn = null;
        schedule();
        return {};
      // What the page remembers of the teacher (#81, #82), in ~/.miyagi/config.json so the app and the browser agree.
      case "page-settings":
        return readPageSettings();
      case "page-settings-save":
        return (await savePageSettings(data)) ? {} : { error: "invalid" };
      case "workspaces":
        return { workspaces: await listWorkspaces(), current: current?.dir ?? null };
      case "open": {
        if (current?.chat?.getState().busy) return { error: "busy" };
        // Only a registered subject: the page never names a folder of its own.
        const listed = (await listWorkspaces()).find((ws) => ws.id === String(data.id));
        if (!listed || listed.missing) return { error: "unknown subject" };
        await openSubject(listed.dir);
        return {};
      }
      case "create": {
        if (current?.chat?.getState().busy) return { error: "busy" };
        const label = String(data.label ?? "").trim();
        if (!label) return { error: "name required" };
        // A folder of the teacher's, if they chose one: empty or new (createSubject checks it).
        const folder = String(data.dir ?? "").trim().replace(/^"|"$/g, "");
        const persona = ["formal", "warm", "motivating"].find((value) => value === data.persona) as AgentPersona | undefined;
        const created = await createSubject({ label, description: String(data.description ?? ""), language: String(data.language ?? ""), persona, dir: folder || undefined }).catch((error: unknown) => ({ error: String((error as Error)?.message ?? error) }));
        if ("error" in created) return created;
        await openSubject(created.dir);
        return {};
      }
      // A subject already on the disk that the list doesn't know (copied from a colleague, another
      // computer): only a folder with a miyagi subject in it, registered and opened.
      case "add-existing": {
        if (current?.chat?.getState().busy) return { error: "busy" };
        const dir = path.resolve(String(data.dir ?? "").trim().replace(/^"|"$/g, ""));
        if (!String(data.dir ?? "").trim() || !(await workspaceExists(dir))) return { error: "not a subject" };
        const config = await readWorkspaceConfig(dir);
        await registerWorkspace(dir, workspaceLabel(dir, config), config.kind ?? "subject");
        await openSubject(dir);
        return {};
      }
      // A subject whose folder was moved: forgotten (its folder stays), or pointed at its new folder.
      case "forget": {
        const listed = (await listWorkspaces()).find((ws) => ws.id === String(data.id));
        if (!listed) return { error: "unknown subject" };
        if (current && listed.dir === current.dir) return { error: "open" };
        await forgetWorkspace(listed.id);
        return {};
      }
      case "locate": {
        const listed = (await listWorkspaces()).find((ws) => ws.id === String(data.id));
        if (!listed) return { error: "unknown subject" };
        const dir = path.resolve(String(data.dir ?? "").trim().replace(/^"|"$/g, ""));
        if (!String(data.dir ?? "").trim() || !(await workspaceExists(dir))) return { error: "not a subject" };
        await registerWorkspace(dir, listed.name, listed.kind);
        return {};
      }
      // The subject's own folders, in the computer's file explorer: only these four.
      case "open-folder": {
        if (!current) return { error: "no subject" };
        const which = String(data.which);
        const dir = which === "sources" ? sourcesDirFor(current.dir) : which === "drafts" ? draftsDirFor(current.dir) : which === "materials" ? materialsDirFor(current.dir) : which === "subject" ? current.dir : undefined;
        if (!dir) return { error: "unknown folder" };
        await mkdir(dir, { recursive: true });
        openInSystem(dir);
        return {};
      }
      // An HTML activity, played in the computer's browser as a local file: outside the page, with no token (#69).
      case "open-file": {
        if (!current) return { error: "no subject" };
        const file = await preparedFile(current.dir, String(data.path ?? ""));
        if (!file || !/\.html?$/i.test(file) || !(await stat(file)).isFile()) return { error: "not an activity" };
        openInSystem(file);
        return {};
      }
      // The teacher's own commands in the page's editor (#78): saved only from their confirmation there.
      case "own-commands":
        if (!current) return { error: "no subject" };
        return { commands: await ownCommands(current.dir) };
      case "own-command-save":
      case "own-command-delete": {
        const subject = current;
        if (!subject) return { error: "no subject" };
        if (subject.chat?.getState().busy) return { error: "busy" };
        if (data.scope !== "subject" && data.scope !== "all") return { error: "unknown scope" };
        const name = String(data.name ?? "");
        const result = action === "own-command-save" ? await saveDraft(subject.dir, data.scope, name, data.draft as CommandDraft, String(data.previous ?? name)) : await deleteOwn(subject.dir, data.scope, name);
        if (result.errors.length) return result;
        // The catalog and this conversation get the change; the conversation goes on.
        if (subject.commands) subject.commands.active = "";
        await subject.chat?.reopen();
        schedule();
        return result;
      }
      case "classroom": {
        // Connecting a classroom changes the session's prompts and gates: it opens again with it.
        const subject = current;
        if (!subject) return { error: "no subject" };
        if (subject.chat?.getState().busy) return { error: "busy" };
        const result = await connectClassroom(subject.dir, String(data.url ?? ""), String(data.courseId ?? ""));
        if (!result.error) await openSubject(subject.dir);
        return result;
      }
      // The sidebar (#84): the host reads the kept conversations; nothing touches the chat, so a turn under way goes on.
      case "search":
        if (!current) return { error: "no subject" };
        return { results: await searchConversations(current.dir, String(data.query ?? "").slice(0, 200), current.prepared.chatOpening?.().slice(0, 40), current.chat?.getState().run?.dir) };
      case "pin":
        if (!current) return { error: "no subject" };
        return await setPinned(current.dir, String(data.dir ?? ""), Boolean(data.pinned));
      case "marketplaces":
        return { marketplaces: await marketplaces() };
      case "inspect-marketplace":
        return await inspect(String(data.source ?? ""));
      case "add-marketplace":
        return await addRepository(String(data.source ?? ""), String(data.typed ?? ""));
      case "remove-marketplace":
        return await removeRepository(String(data.name ?? ""));
    }
    const chat = current?.chat;
    if (!chat || !current) return { error: "no chat" };
    const subjectDir = current.dir;
    const busy = () => chat.getState().busy;
    switch (action) {
      case "send":
        if (switching) await switching.catch(() => undefined);
        // While a turn runs, a message joins it (#62); a command or "exit" waits for it to end.
        if (busy()) {
          const line = String(data.line ?? "");
          const before = chat.getState().transcript.length;
          if (await chat.steer(line)) {
            const now = chat.getState();
            for (const entry of now.transcript.slice(before)) if (entry.kind === "user") steered.add(`${now.run?.dir}#${entry.id}`);
            send("state", snapshot());
            return {};
          }
          if (busy()) return { error: "busy" };
        }
        void chat.send(String(data.line ?? "")).catch((error: unknown) => chat.notice(String((error as Error)?.message ?? error), "error"));
        return {};
      case "interrupt":
        chat.interrupt();
        return {};
      case "mode":
        chat.setMode(String(data.mode) as Mode);
        return {};
      case "answer":
        chat.answer(Number(data.panelId), String(data.answer ?? ""));
        return {};
      case "choose":
        chat.choose(data.value === null || data.value === undefined ? null : String(data.value));
        return {};
      case "runs": {
        // The sidebar's list: the kit's date (of the last activity) without its number and mark,
        // and as the title the teacher's first words in it, which don't change with every
        // message as the kit's last one does; never the greeting miyagi sends itself to open a
        // conversation, which isn't the teacher's words.
        const opening = current?.prepared.chatOpening?.().slice(0, 40);
        // A conversation with nothing but that greeting (one is kept each time the subject opens)
        // isn't listed, unless it's the open one.
        const currentDir = chat.getState().run?.dir ?? null;
        const pinned = await readPinned(subjectDir);
        const runs = (
          await Promise.all(
            (await chat.listRuns()).map(async (run) => {
              const date = run.label.replace(/^\d+\.\s*/, "").split(" · ")[0].replace(/\s+\([^)]*\)$/, "");
              const messages = await readConversation(run.dir).catch(() => []);
              const first = conversationTitle(messages, opening);
              const isPinned = pinned.includes(path.basename(run.dir));
              if (isOnlyGreeting(messages, first) && run.dir !== currentDir && !isPinned) return null;
              return { ...run, pinned: isPinned, label: first ? `${date} · ${first.length > 80 ? `${first.slice(0, 79)}…` : first}` : date };
            }),
          )
        ).filter((run) => run !== null);
        return { ...latestRuns(runs, Math.max(1, Number(data.limit) || 12), currentDir), current: currentDir };
      }
      case "resume":
        if (busy() || switching) return { error: "busy" };
        await switchConversation(() => chat.resume(data.dir ? String(data.dir) : undefined));
        return {};
      case "new":
        if (busy() || switching) return { error: "busy" };
        await switchConversation(() => chat.newConversation());
        return {};
      case "extension":
        if (busy()) return { error: "busy" };
        await chat.setExtension(String(data.name), Boolean(data.enabled));
        return {};
      case "capabilities":
        return await capabilities(chat);
      // The course views: read only; what changes something goes through the chat.
      case "today":
        return await today(chat, subjectDir);
      case "kb-index":
        return await knowledgeIndex(chat);
      case "kb-page":
        return await knowledgePage(chat, String(data.id ?? ""));
      case "topic-words":
        return await topicWords(chat, String(data.topic ?? ""));
      case "kb-search":
        return await knowledgeSearch(chat, String(data.query ?? ""));
      case "sources":
        return await sourcesList(chat, subjectDir);
      case "drafts":
        return await draftsList(subjectDir);
      case "oven":
        return oven(subjectDir);
      case "topics":
        return await topics(chat);
      case "resolve":
        return { items: await resolveItems(chat, subjectDir, Array.isArray(data.targets) ? data.targets.map(String) : []) };
      case "catalog":
        return { entries: await catalog(chat, String(data.words ?? "")) };
      case "install":
        return await chat.installExtension(String(data.spec), { confirmed: Boolean(data.confirmed) });
      case "update":
        return { updated: await chat.updateExtension(data.name ? String(data.name) : undefined) };
      case "remove":
        if (busy()) return { error: "busy" };
        await chat.removeExtension(String(data.name), { deleteData: Boolean(data.deleteData) });
        return {};
      case "options":
        // The kit never gives a sensitive option's value: only whether it's set.
        return { options: await chat.extensionOptions(String(data.name)) };
      case "set-options":
        if (busy()) return { error: "busy" };
        // null clears a value (JSON has no undefined); a sensitive one left empty isn't sent at all.
        await chat.setExtensionOptions(
          String(data.name),
          Object.fromEntries(Object.entries((data.values ?? {}) as Record<string, unknown>).map(([key, value]) => [key, value === null ? undefined : String(value)])),
        );
        return {};
      case "reload":
        // What was just installed or updated, now, keeping the conversation.
        if (busy()) return { error: "busy" };
        await chat.reopen();
        return {};
      case "trust":
        if (busy()) return { error: "busy" };
        await chat.trustWorkspace();
        return {};
      default:
        return { error: `unknown action ${action}` };
    }
  }

  /** A file the person adds: into the subject's sources/ through the sources extension, never overwriting. */
  async function addSource(request: IncomingMessage, url: URL): Promise<unknown> {
    const subject = current;
    const chat = subject?.chat;
    const sources = chat?.api<{ addSource: (file: string, name: string) => Promise<{ path: string; duplicateOf?: string }> }>("sources");
    if (!subject || !chat || !sources) return { error: "no sources" };
    if (chat.getState().busy) return { error: "busy" };
    const name = path.basename(url.searchParams.get("name") ?? "file").replace(/[^\w.\- ()áéíóúüñÁÉÍÓÚÜÑ]/g, "_") || "file";
    const temp = path.join(sessionsDirFor(subject.dir), ".uploads", `${Date.now()}-${name}`);
    await mkdir(path.dirname(temp), { recursive: true });
    await writeFile(temp, await body(request, MAX_UPLOAD));
    try {
      return await sources.addSource(temp, name);
    } finally {
      await rm(temp, { force: true });
    }
  }

  /** A file of the built page, never outside its folder. */
  async function page(response: ServerResponse, pathname: string): Promise<void> {
    const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
    const file = path.resolve(PAGE_DIR, relative);
    if (!file.startsWith(PAGE_DIR + path.sep) || !(await stat(file).catch(() => null))?.isFile()) {
      response.writeHead(404).end();
      return;
    }
    response
      .writeHead(200, {
        "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
        "cache-control": "no-store",
        // Nothing from elsewhere: the page is self-contained.
        "content-security-policy": "default-src 'self'; img-src 'self' data:; connect-src 'self'; style-src 'self' 'unsafe-inline'",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
      })
      .end(await readFile(file));
  }

  const json = (response: ServerResponse, status: number, data: unknown) =>
    response.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(data));

  const server = createServer((request, response) => {
    void (async () => {
      const url = new URL(request.url ?? "/", "http://localhost");
      // The page's own files (its scripts and styles) carry no token: only "/" and the API need it.
      const isAsset = request.method === "GET" && url.pathname.startsWith("/assets/");
      if (!isAsset && !authorized(request, url)) {
        response.writeHead(403, { "content-type": "text/plain; charset=utf-8" }).end("403");
        return;
      }
      try {
        if (request.method === "GET" && url.pathname === "/api/events") {
          if (client) {
            client.write("event: replaced\ndata: {}\n\n");
            client.end();
          }
          client = response;
          response.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
          send("info", info());
          send("state", snapshot());
          if (options.browser) send("browser", options.browser.list());
          request.on("close", () => client === response && (client = null));
          return;
        }
        // A catalog entry's logo, from the repository's copy: the page's <img>, nothing else.
        if (request.method === "GET" && url.pathname === "/api/extension-image") {
          const file = await current?.chat?.extensionImage(url.searchParams.get("spec") ?? "", "logo").catch(() => undefined);
          const type = file ? IMAGE_TYPES[path.extname(file).toLowerCase()] : undefined;
          if (!file || !type) return void response.writeHead(404).end();
          response.writeHead(200, { "content-type": type, "cache-control": "max-age=300", "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'", "x-content-type-options": "nosniff" });
          return void response.end(await readFile(file));
        }
        // A material in materials/ or drafts/, to preview: only inside them, shown, never run (a sandbox with no scripts).
        if (request.method === "GET" && url.pathname === "/api/drafts/file") {
          const file = current ? await preparedFile(current.dir, url.searchParams.get("path") ?? "") : undefined;
          const type = file ? PREVIEW_TYPES[path.extname(file).toLowerCase()] : undefined;
          if (!file || !type || !(await stat(file)).isFile()) return void response.writeHead(file ? 415 : 403).end();
          response.writeHead(200, {
            "content-type": type,
            "cache-control": "no-store",
            "x-content-type-options": "nosniff",
            "content-disposition": "inline",
            ...(type.startsWith("application/pdf") ? {} : { "content-security-policy": "sandbox; default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; media-src 'self'" }),
          });
          return void response.end(await readFile(file));
        }
        if (request.method === "POST" && url.pathname === "/api/upload") return json(response, 200, await addSource(request, url));
        if (request.method === "POST" && url.pathname.startsWith("/api/")) {
          const raw = (await body(request, 1_000_000)).toString("utf8");
          return json(response, 200, await act(url.pathname.slice("/api/".length), raw ? (JSON.parse(raw) as Record<string, unknown>) : {}));
        }
        if (request.method === "GET") return await page(response, url.pathname);
        response.writeHead(404).end();
      } catch (error) {
        json(response, 400, { error: String((error as Error)?.message ?? error) });
      }
    })();
  });

  // Only on this machine: a tunnel to it is the person's own choice.
  await new Promise<void>((resolve) => server.listen(options.port ?? 0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : options.port;
  ownOrigin = `http://127.0.0.1:${port}`;
  // The browser's tabs reach the page on their own event, apart from the chat's state (#86).
  const stopBrowser = options.browser?.subscribe(
    () => send("browser", options.browser?.list()),
    () => send("browser-refused", {}),
  );

  // The subject named, or the one opened last; none if there's none to open.
  const first = workspaceDir ?? (await listWorkspaces()).find((ws) => !ws.missing)?.dir;
  if (options.chooseLanguage) await chooseLanguageFor(first);
  if (first) await openSubject(first);

  return {
    url: `http://127.0.0.1:${port}/?token=${token}`,
    async close() {
      clearInterval(heartbeat);
      stopBrowser?.();
      client?.end();
      current?.chat?.close();
      signIn?.flow.cancel();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}
