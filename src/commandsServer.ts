import type { Options } from "@falkenslab/agent-kit";
import { createSdkMcpServer, tool } from "@falkenslab/agent-kit";
import { z } from "zod";
import { listOwn, readOwn, saveOwn, validateCommand } from "./ownCommands.js";

/**
 * The teacher's own commands as tools (teacher-commands #68): list them and the templates, read
 * one, check one and save it. The agent can't write `.claude/commands/` nor `~/.miyagi/own/`
 * with the file tools; only `commands_save` does, after the teacher's yes (the gate below).
 */

type Result = { content: { type: "text"; text: string }[]; isError?: boolean };
type Hooks = NonNullable<Options["hooks"]>;
type HookCallback = NonNullable<Hooks[keyof Hooks]>[number]["hooks"][number];

export const COMMANDS_SERVER = "commands";
const SAVE_TOOL = `mcp__${COMMANDS_SERVER}__commands_save`;
const APPROVAL_TOOL = "mcp__approvals__request_human_approval";

async function guarded(run: () => Promise<string>): Promise<Result> {
  try {
    return { content: [{ type: "text", text: await run() }] };
  } catch (error) {
    return { content: [{ type: "text", text: `Refused: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
  }
}

const nameArg = z.string().describe('The command\'s name, kebab-case (e.g. "word-search")');
const scopeArg = z.enum(["subject", "all"]).describe('"subject": only this subject; "all": all the teacher\'s subjects');

export function createCommandsServer(workspaceDir: string) {
  return createSdkMcpServer({
    name: COMMANDS_SERVER,
    version: "1.0.0",
    tools: [
      tool("commands_list", "List the teacher's own commands (this subject's and all subjects') and the templates to start one from (word search, crossword, matching, ordering, flashcards).", {}, () =>
        guarded(async () => {
          const own = await listOwn(workspaceDir);
          const lines = (title: string, list: { name: string; description: string }[]) => [`${title}:`, ...(list.length ? list.map((one) => `- ${one.name}: ${one.description}`) : ["- (none)"])];
          return [...lines("This subject", own.subject), ...lines("All subjects", own.all), ...lines("Templates", own.templates)].join("\n");
        }),
      ),
      tool(
        "commands_read",
        "Read an own command or a template, whole (frontmatter and instructions), to adapt or edit it.",
        { name: nameArg, from: z.enum(["subject", "all", "template"]).describe("Where it is") },
        (a) => guarded(() => readOwn(workspaceDir, a.name, a.from)),
      ),
      tool(
        "commands_check",
        "Check an own command before showing it to the teacher: the problems that would stop it being saved. Nothing is written.",
        { name: nameArg, markdown: z.string().describe("The whole command file: frontmatter and instructions") },
        (a) =>
          guarded(async () => {
            const errors = validateCommand(a.name, a.markdown);
            return errors.length ? `Problems:\n- ${errors.join("\n- ")}` : "Valid: it can be saved.";
          }),
      ),
      tool(
        "commands_save",
        "Save an own command (new, or replacing one of the same name) once the teacher approved it with request_human_approval, whose summary names the command. Refused if it doesn't validate. It shows in the page's catalog from the next conversation.",
        { name: nameArg, scope: scopeArg, markdown: z.string().describe("The whole command file: frontmatter and instructions") },
        (a) => guarded(async () => `Saved as ${await saveOwn(workspaceDir, a.scope, a.name, a.markdown)}. It shows in the catalog (＋) and on its items from the next conversation (✎ New conversation).`),
      ),
    ],
  });
}

/**
 * `commands_save` only right after the teacher approved it: the last request_human_approval of
 * the session must have been approved and its summary must name the command. One approval, one
 * save. `approvedText` is the approval tool's answer to a yes. In autonomous mode there's no one
 * to ask, so it's never saved.
 */
export function installCommandsGate(options: Options, approvedText: string): void {
  const yes = approvedText.trim();
  let approved: string | null = null;
  let asked = "";
  const preToolUse: HookCallback = async (raw) => {
    const input = raw as { tool_name?: string; tool_input?: { summary?: unknown; name?: unknown } };
    if (input.tool_name === APPROVAL_TOOL) {
      approved = null;
      asked = typeof input.tool_input?.summary === "string" ? input.tool_input.summary : "";
      return {};
    }
    if (input.tool_name !== SAVE_TOOL) return {};
    const name = typeof input.tool_input?.name === "string" ? input.tool_input.name : "";
    if (approved !== null && name && approved.includes(name)) {
      approved = null;
      return {};
    }
    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Not saved: ask the teacher first with request_human_approval — its summary names the command ("${name}"), says where it's saved, shows its form (each parameter) and what it does — and save it right after their yes.`,
      },
    };
  };
  const postToolUse: HookCallback = async (raw) => {
    const input = raw as { tool_name?: string; tool_response?: unknown };
    if (input.tool_name === APPROVAL_TOOL) approved = JSON.stringify(input.tool_response ?? "").includes(yes) ? asked : null;
    return {};
  };
  const hooks: Hooks = (options.hooks ??= {});
  (hooks.PreToolUse ??= []).push({ hooks: [preToolUse] });
  (hooks.PostToolUse ??= []).push({ hooks: [postToolUse] });
}
