import { askForDecision, type ModeControl, type Options } from "@falkenslab/agent-kit";
import { t } from "./messages/index.js";

/**
 * The publish gate: in "guided" mode, a moodle-teacher tool that publishes or changes something in
 * Moodle only runs if the teacher approved it just before (request_human_approval); otherwise the
 * teacher is asked right there. The approval used to be only a rule in the prompt, and a real
 * session forgot it: a File resource was visible to students for ~35 s before the agent noticed
 * (see .minispec/decisions/ADR-008-publish-gate.md). agent-kit doesn't ask for an extension's
 * tools in guided mode: its read-only list is only for plan mode.
 *
 * "interactive" already asks before every call (agent-kit's step gate) and "autonomous"
 * publishes without asking by design, so the gate only acts while the mode is "guided" —
 * read on every call, so Shift+Tab in the chat is followed.
 */

type Hooks = NonNullable<Options["hooks"]>;
type HookMatcher = NonNullable<Hooks[keyof Hooks]>[number];
type HookCallback = HookMatcher["hooks"][number];
type HookOutput = Awaited<ReturnType<HookCallback>>;

/** The fields of the SDK's hook inputs this gate reads. */
interface GateHookInput {
  hook_event_name: string;
  tool_name?: string;
  tool_input?: unknown;
  tool_response?: unknown;
  agent_id?: string;
}

const APPROVAL_TOOL = "mcp__approvals__request_human_approval";
/** moodle-teacher's tools (its local server is `moodle`), ADR-021. */
const MOODLE = "mcp__moodle__";

/** moodle-teacher's tools that only read, by their verb as moodle-mcp names them, and its session tools (signing in is the teacher's, in its window); anything else publishes. */
const MOODLE_READS = /^(get|list)_|^browser_(snapshot|screenshot|wait)$|^(login|logout|show_browser|server_info|use_site)$/;
/**
 * Its tools that remove or roll back something: never part of an approved batch. An approval to
 * publish a rubric doesn't cover deleting quiz questions ten minutes later (docs tutorial,
 * 2026-10-01). They always ask.
 */
const MOODLE_DESTRUCTIVE = /^(delete|remove|reset|restore)_/;

export function isDestructiveAction(toolName: string): boolean {
  return toolName.startsWith(MOODLE) && MOODLE_DESTRUCTIVE.test(toolName.slice(MOODLE.length));
}

/** Whether a tool call publishes or changes something in Moodle: any moodle-teacher tool that doesn't only read. A false positive costs one extra panel; a false negative, an unapproved publication. */
export function isPublishAction(toolName: string): boolean {
  return toolName.startsWith(MOODLE) && !MOODLE_READS.test(toolName.slice(MOODLE.length));
}

function describe(toolName: string, toolInput: unknown): string {
  return `${toolName.slice(MOODLE.length)}: ${JSON.stringify(toolInput ?? {}).slice(0, 400)}`;
}

/**
 * Adds the gate to `options.hooks`. `approvedText` is the response request_human_approval
 * gives when the teacher approves (miyagi's own `humanApprovalTexts.approved`).
 *
 * An approval lasts until the next request_human_approval call or the teacher's next message,
 * so one approval covers a batch (six grades, one "Save changes" each), but never a deletion,
 * which always asks. A publication the gate itself lets through covers only that call.
 */
export function installPublishGate(options: Options, runDir: string, modeControl: ModeControl, approvedText: string): void {
  let approved = false;
  const approvedMarker = approvedText.trim();

  const preToolUse: HookCallback = async (raw) => {
    const input = raw as GateHookInput;
    const tool = input.tool_name ?? "";
    if (tool === APPROVAL_TOOL) {
      approved = false;
      return {};
    }
    if (modeControl.mode !== "guided" || input.agent_id || !isPublishAction(tool)) return {};
    if (approved && !isDestructiveAction(tool)) return {};

    const answer = await askForDecision(runDir, {
      title: t().gateTitle,
      lines: [
        t().gateLine,
        describe(tool, input.tool_input),
      ],
    });
    const deny = (reason: string, stop = false): HookOutput => ({
      ...(stop ? { continue: false } : {}),
      hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
    });
    if (answer === "q") return deny("Execution stopped manually by the teacher.", true);
    if (answer === "" || answer === "y" || answer === "yes") {
      return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow" } };
    }
    return deny(
      "Blocked: this action publishes or changes something students can see, and the teacher rejected it " +
        "when asked. Don't retry it; ask with request_human_approval, with a summary of what you're about to " +
        "publish, before doing anything like it again.",
    );
  };

  const postToolUse: HookCallback = async (raw) => {
    const input = raw as GateHookInput;
    if (input.tool_name === APPROVAL_TOOL && JSON.stringify(input.tool_response ?? "").includes(approvedMarker)) {
      approved = true;
    }
    return {};
  };

  const userPromptSubmit: HookCallback = async () => {
    approved = false;
    return {};
  };

  const hooks: Hooks = (options.hooks ??= {});
  (hooks.PreToolUse ??= []).push({ hooks: [preToolUse] });
  (hooks.PostToolUse ??= []).push({ hooks: [postToolUse] });
  (hooks.UserPromptSubmit ??= []).push({ hooks: [userPromptSubmit] });
}
