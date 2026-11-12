import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Students' names for the page only (#109): moodle-mcp gives the agent each student as an alias of
 * @falkenslab/pseudonym, kept in its local directory. The host reads that directory through its
 * CLI (`pseudonym aliases`, for the person in charge: the library doesn't export the way back) and
 * turns aliases into names in what it sends the page, and the names the teacher writes into aliases
 * in what goes to the agent. The list lives in this process's memory; nothing of it is written.
 */

/** An alias as pseudonym makes them: `A-` and Crockford's base32. */
const ALIAS = /\bA-[0-9A-HJKMNP-TV-Z]{6,12}\b/g;
/** Never read the directory again sooner than this, however many unknown aliases show. */
const RELOAD_EVERY_MS = 10_000;

/** Where pseudonym keeps its directory, as it decides: `PSEUDONYM_HOME`, else the per-user default. */
function pseudonymHome(): string {
  if (process.env.PSEUDONYM_HOME) return path.resolve(process.env.PSEUDONYM_HOME);
  if (process.platform === "win32") return path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), "pseudonym");
  return path.join(os.homedir(), ".config", "pseudonym");
}

/** Whether there's a directory to read: without one the CLI would create the key, which isn't ours to do. */
function hasDirectory(): boolean {
  const home = pseudonymHome();
  return existsSync(path.join(home, "directory.enc")) || existsSync(path.join(home, "directory.json"));
}

/** The pseudonym CLI next to the library's entry point (its package exports only the library). */
function cliPath(): string {
  return path.join(path.dirname(fileURLToPath(import.meta.resolve("@falkenslab/pseudonym"))), "cli.js");
}

/** One CSV line of `pseudonym aliases`: `alias,name`, the name quoted when it has a comma or a quote. */
function parseLine(line: string): [string, string] | undefined {
  const comma = line.indexOf(",");
  if (comma < 0) return undefined;
  const alias = line.slice(0, comma);
  let name = line.slice(comma + 1);
  if (name.startsWith('"') && name.endsWith('"')) name = name.slice(1, -1).replace(/""/g, '"');
  return new RegExp(`^${ALIAS.source}$`).test(alias) && name.trim() ? [alias, name.trim()] : undefined;
}

/** The service's people, alias to name: empty when there's no directory or the CLI fails. */
async function readDirectory(service: string): Promise<Map<string, string>> {
  if (!hasDirectory()) return new Map();
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cliPath(), "aliases", "--service", service], {
      // The desktop app's Electron runs it as Node.
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", NO_COLOR: "1" },
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    });
    let out = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => (out += chunk));
    child.on("error", () => resolve(new Map()));
    child.on("close", (code) => {
      if (code !== 0) return resolve(new Map());
      const lines = out.split(/\r?\n/).slice(1);
      resolve(new Map(lines.map(parseLine).filter((entry): entry is [string, string] => Boolean(entry))));
    });
  });
}

/** The text as compared: each character without its accents, lower case, and where it was in the original. */
function folded(text: string): { text: string; at: number[] } {
  let out = "";
  const at: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const plain = text[i]!.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    for (const c of plain) {
      out += c;
      at.push(i);
    }
  }
  return { text: out, at };
}

const isWordChar = (c: string | undefined) => c !== undefined && /[\p{L}\p{N}]/u.test(c);

/** Plain JSON data with every string passed through `change`; the original is never touched. */
function mapStrings(value: unknown, change: (text: string) => string): unknown {
  if (typeof value === "string") return change(value);
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, change));
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, change)]));
  }
  return value;
}

export interface Names {
  /** Whether the list has anyone: the page's switch shows only then. */
  readonly available: boolean;
  /** Names shown (the default at every start) or aliases, as the teacher's switch says. */
  shown: boolean;
  /** The page's copy of `data`: each known alias as the name ("Name (A-…)" with `withAlias`). */
  reveal<T>(data: T, withAlias?: boolean): T;
  /** What goes to the agent: each full name of the list as its alias. */
  aliasify<T>(data: T): T;
}

/** No classroom, or students that don't reach the agent as aliases: nothing to turn either way. */
export const NO_NAMES: Names = { available: false, shown: true, reveal: (data) => data, aliasify: (data) => data };

/**
 * The names of one classroom (`moodle@<host>`, moodle-mcp's service). `changed` is called when a
 * reading brought someone new, so the page gets its state again with their name.
 */
export function classroomNames(classroomUrl: string, changed: () => void): Names {
  let service: string;
  try {
    service = `moodle@${new URL(classroomUrl).host}`;
  } catch {
    return NO_NAMES;
  }
  let byAlias = new Map<string, string>();
  let byName: { folded: string; alias: string }[] = [];
  let loadedAt = 0;
  let loading: Promise<void> | undefined;

  const load = () => {
    if (loading || Date.now() - loadedAt < RELOAD_EVERY_MS) return;
    loadedAt = Date.now();
    loading = readDirectory(service)
      .then((read) => {
        const grew = [...read.keys()].some((alias) => !byAlias.has(alias));
        byAlias = read;
        // Longest first, so "Ana María López" wins over an "Ana López" inside it.
        byName = [...read].map(([alias, name]) => ({ folded: folded(name).text, alias })).sort((a, b) => b.folded.length - a.folded.length);
        if (grew) changed();
      })
      .finally(() => (loading = undefined));
  };
  load();

  const names: Names = {
    get available() {
      return byAlias.size > 0;
    },
    shown: true,
    reveal(data, withAlias = false) {
      if (!names.shown) return data;
      let unknown = false;
      const out = mapStrings(data, (text) =>
        text.replace(ALIAS, (alias) => {
          const name = byAlias.get(alias);
          if (!name) {
            unknown = true;
            return alias;
          }
          return withAlias ? `${name} (${alias})` : name;
        }),
      ) as typeof data;
      if (unknown) load();
      return out;
    },
    aliasify(data) {
      if (!byName.length) return data;
      return mapStrings(data, (text) => {
        const { text: plain, at } = folded(text);
        const taken: { start: number; end: number; alias: string }[] = [];
        for (const { folded: name, alias } of byName) {
          for (let from = plain.indexOf(name); from >= 0; from = plain.indexOf(name, from + 1)) {
            const to = from + name.length;
            if (isWordChar(plain[from - 1]) || isWordChar(plain[to])) continue;
            const [start, end] = [at[from]!, at[to - 1]! + 1];
            if (taken.some((t) => start < t.end && end > t.start)) continue;
            taken.push({ start, end, alias });
          }
        }
        let result = text;
        for (const { start, end, alias } of taken.sort((a, b) => b.start - a.start)) result = result.slice(0, start) + alias + result.slice(end);
        return result;
      }) as typeof data;
    },
  };
  return names;
}
