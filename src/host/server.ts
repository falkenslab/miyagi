import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agentKitVersion, createChatController, getLanguage, type ChatController, type Mode } from "@falkenslab/agent-kit";
import { prepareSession, VERSION } from "../agent.js";
import { claudeAuthAvailable, loadWorkspaceEnv, saveClaudeKey } from "../globalConfig.js";
import { friendlyToolLabel, toolPhrase } from "../toolLabels.js";
import { listCommands } from "../catalog.js";
import { sessionsDirFor } from "../workspace.js";
import { createSubject, listWorkspaces } from "../workspaces.js";
import { addRepository, capabilities, catalog, connectClassroom, inspect, marketplaces, pageExtensions, removeRepository } from "./extensions.js";

/**
 * miyagi's local web host (ADR-022, gui-host #46): the chat of one subject at a time, run by
 * agent-kit's chat controller, offered to a page (the browser's, or the desktop app's window) as
 * state and actions. On 127.0.0.1 only, with a random token in the URL without which nothing
 * answers; the chat's state reaches the page as server-sent events, and what the person does
 * comes back as POSTs. The page can switch to another registered subject or create one
 * (gui-workspaces, #49), see what miyagi can do, manage its extensions and connect a classroom
 * (gui-extensions, #50). No dependencies: node:http and the built page in dist/gui/. Every rule
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
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

/** The kit's own chat commands the page offers besides miyagi's catalog. */
const KIT_COMMANDS = ["resume", "plan", "extensions"];

/** A logo's types: an image, nothing a browser would run. */
const IMAGE_TYPES: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

export interface HostOptions {
  /** The port; a free one if not given. */
  port?: number;
  /** The token of the URL; a random one if not given. */
  token?: string;
}

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
  commands: { active: string; names: Set<string> } | null;
}

/**
 * Starts the host: on `workspaceDir` if given, else on the subject opened last, else on none
 * (the page then shows the subjects to open or create).
 */
export async function startHost(workspaceDir?: string, options: HostOptions = {}): Promise<Host> {
  const token = options.token ?? randomBytes(18).toString("base64url");
  let signedIn = await claudeAuthAvailable();
  let current: OpenSubject | null = null;

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
      await controller.start();
      for (const line of subject.notices.splice(0)) controller.notice(line, "warn");
      schedule();
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
    const active = (state.extensions?.active ?? []).join(",");
    if (subject.commands?.active !== active) {
      subject.commands = { active, names: subject.commands?.names ?? new Set(KIT_COMMANDS) };
      void listCommands(subject.dir).then((entries) => {
        if (subject.commands?.active !== active) return;
        subject.commands = { active, names: new Set([...KIT_COMMANDS, ...entries.map((entry) => entry.name.replace(/^\//, ""))]) };
        schedule();
      });
    }
    const names = subject.commands.names;
    const commandDetails = state.commandDetails.filter((command) => names.has(command.name));
    // A resumed conversation brings back what the teacher never wrote: the greeting miyagi sends
    // itself to open it, and the SDK's mark for an interrupted turn.
    const opening = subject.prepared.chatOpening?.().trim();
    const transcript = state.transcript.filter((entry) => entry.kind !== "user" || (entry.text.trim() !== opening && !/^\[Request interrupted/.test(entry.text)));
    return { ...state, transcript, commandDetails, commands: commandDetails.map((command) => command.name), extensions: pageExtensions(state.extensions) };
  }
  const snapshot = () => ({ signedIn, chat: chatState(), opening: Boolean(current && !current.chat) });
  /** The subject's classroom: where, and whether moodle-teacher reaches it now. */
  const classroom = () => {
    const room = current?.prepared.workspace?.classroom;
    return room ? { url: room.url, courseId: room.courseId, connected: Boolean(current?.prepared.classroom) } : null;
  };
  const info = () => ({ name: "miyagi", version: VERSION, kit: agentKitVersion(), language: getLanguage(), workspace: current?.label ?? null, classroom: classroom() });
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

  /** What the person does, by path: the subjects, signing in, then one to one to the chat controller. */
  async function act(action: string, data: Record<string, unknown>): Promise<unknown> {
    switch (action) {
      case "login":
        if (!(await saveClaudeKey(String(data.token ?? "")))) return { error: "invalid" };
        signedIn = true;
        if (current) await openChat(current);
        schedule();
        return {};
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
        const { dir } = await createSubject({ label, description: String(data.description ?? ""), language: String(data.language ?? "") });
        await openSubject(dir);
        return {};
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
    if (!chat) return { error: "no chat" };
    const busy = () => chat.getState().busy;
    switch (action) {
      case "send":
        // One turn at a time: the page waits for the one running.
        if (busy()) return { error: "busy" };
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
        // The sidebar's list: the kit's labels without their number and mark, and without the
        // greeting miyagi sends itself to open a conversation, which isn't the teacher's words.
        const opening = current?.prepared.chatOpening?.().slice(0, 40);
        const runs = (await chat.listRuns()).map((run) => {
          let label = run.label
            .replace(/^\d+\.\s*/, "")
            .replace(/\s+\([^)]*\)(?=\s·|$)/, "")
            .replace(/ · \[Request interrupted.*$/, "");
          const cut = label.indexOf(" · ");
          if (opening && cut !== -1 && opening.startsWith(label.slice(cut + 3).replace(/…$/, "").slice(0, 20))) label = label.slice(0, cut);
          return { ...run, label };
        });
        return { runs, current: chat.getState().run?.dir ?? null };
      }
      case "resume":
        if (busy()) return { error: "busy" };
        await chat.resume(data.dir ? String(data.dir) : undefined);
        return {};
      case "new":
        if (busy()) return { error: "busy" };
        await chat.newConversation();
        return {};
      case "extension":
        if (busy()) return { error: "busy" };
        await chat.setExtension(String(data.name), Boolean(data.enabled));
        return {};
      case "capabilities":
        return await capabilities(chat);
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

  // The subject named, or the one opened last; none if there's none to open.
  const first = workspaceDir ?? (await listWorkspaces()).find((ws) => !ws.missing)?.dir;
  if (first) await openSubject(first);

  return {
    url: `http://127.0.0.1:${port}/?token=${token}`,
    async close() {
      clearInterval(heartbeat);
      client?.end();
      current?.chat?.close();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}
