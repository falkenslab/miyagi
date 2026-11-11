import { readFile } from "node:fs/promises";
import type { Options } from "@falkenslab/agent-kit";
import { listCommands } from "./catalog.js";
import { splitFrontmatter } from "./materials/frontmatter.js";
import { renderVariables, variablesIn } from "./uiSchema.js";

/**
 * An action launched on an item (ui-schema #106): the page sends the command's line as always
 * (`/command value`, what the chat shows) and, beside it, the item's data and the form's values.
 * They're kept here until that line's turn starts, and a `UserPromptSubmit` hook gives the agent
 * the item as JSON and the command's instructions with their `{{…}}` filled in. From the terminal,
 * with no page, a command's form values come in its line (`name: value; …`) and fill `{{form.*}}`.
 */

export interface ActionLaunch {
  /** The command without its slash: `miyagi:quiz`, `own:recordar`. */
  command: string;
  /** The item kind it was launched on, and its data as the page's schema describes it. */
  kind?: string;
  item?: Record<string, unknown>;
  form?: Record<string, string>;
}

type Hooks = NonNullable<Options["hooks"]>;
type HookCallback = NonNullable<Hooks[keyof Hooks]>[number]["hooks"][number];

/** How long a launch waits for its turn: a line sent later is someone else's. */
const FRESH_MS = 2 * 60_000;
let pending: (ActionLaunch & { at: number }) | null = null;

/** The page launched an action: its line comes next. */
export function launchAction(launch: ActionLaunch): void {
  pending = { ...launch, at: Date.now() };
}

/** The launch that goes with this line, once: only for the same command, sent soon after. */
function takeLaunch(prompt: string): ActionLaunch | null {
  const launch = pending;
  if (!launch) return null;
  pending = null;
  return Date.now() - launch.at < FRESH_MS && commandOf(prompt) === launch.command ? launch : null;
}

const commandOf = (prompt: string) => /^\/(\S+)/.exec(prompt.trim())?.[1] ?? null;

/** A form's values from a command's line (`name: value; name: value`), as the page writes them. */
export function formFromLine(args: string): Record<string, string> {
  const form: Record<string, string> = {};
  for (const part of args.split(/;\s*/)) {
    const match = /^([a-z][a-z0-9_]*):\s*([\s\S]*)$/.exec(part.trim());
    if (match) form[match[1]!] = match[2]!.trim();
  }
  return form;
}

/** The command's instructions (its file's body), when it has a file. */
async function instructionsOf(workspaceDir: string, command: string): Promise<string | null> {
  const entry = (await listCommands(workspaceDir)).find((one) => one.name === `/${command}`);
  if (!entry?.file) return null;
  return splitFrontmatter(await readFile(entry.file, "utf-8")).body;
}

const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/** What the agent gets with an action's line: the item, the form and the instructions filled in. */
export async function actionContextText(workspaceDir: string, subjectName: string, prompt: string, launch: ActionLaunch | null): Promise<string | null> {
  const command = commandOf(prompt);
  if (!command) return null;
  const body = await instructionsOf(workspaceDir, command).catch(() => null);
  const uses = body ? variablesIn(body) : [];
  const args = prompt.trim().slice(command.length + 1).trim();
  const form = launch?.form ?? (uses.some((name) => name.startsWith("form.")) ? formFromLine(args) : {});
  if (!launch?.item && !Object.keys(form).length && !uses.length) return null;
  const parts: string[] = [];
  if (launch?.item) parts.push(`The action /${command} was launched on this ${launch.kind ?? "item"} of the page; its data, as the page's schema describes it:\n${JSON.stringify(launch.item, null, 2)}`);
  if (Object.keys(form).length) parts.push(`Its form's values:\n${JSON.stringify(form, null, 2)}`);
  if (body && uses.length) parts.push(`The command's instructions with their {{…}} filled in from those values; follow these (a {{…}} still written as such had no value: ask for it):\n\n${renderVariables(body, { item: launch?.item, form, subject: { name: subjectName }, today: today() }).replace(/\$ARGUMENTS/g, args)}`);
  return parts.join("\n\n");
}

/** Gives the agent an action's context with its line (the turn the page launched). */
export function installActionContext(options: Options, workspaceDir: string, subjectName: string): void {
  const hook: HookCallback = async (raw) => {
    const input = raw as { hook_event_name?: string; prompt?: string };
    if (input.hook_event_name !== "UserPromptSubmit" || !input.prompt) return {};
    const text = await actionContextText(workspaceDir, subjectName, input.prompt, takeLaunch(input.prompt));
    return text ? { hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: text } } : {};
  };
  const hooks: Hooks = (options.hooks ??= {});
  (hooks.UserPromptSubmit ??= []).push({ hooks: [hook] });
}
