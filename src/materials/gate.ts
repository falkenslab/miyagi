import type { Options } from "@falkenslab/agent-kit";
import { t } from "../messages/index.js";
import type { PendingLosses } from "./server.js";

/**
 * What an export leaves out reaches the teacher in the approval itself (ADR-015): the next
 * request_human_approval after an export gets its losses appended to its summary by code, in
 * the teacher's language, so they're never lost in the model's wording. The losses are then
 * cleared: one approval says them.
 */

type Hooks = NonNullable<Options["hooks"]>;
type HookCallback = NonNullable<Hooks[keyof Hooks]>[number]["hooks"][number];

const APPROVAL_TOOL = "mcp__approvals__request_human_approval";

export function lossLines(pending: PendingLosses): string[] {
  const names = [...new Set(pending.losses.filter((loss) => loss.code === "points").flatMap((loss) => loss.questions))];
  return names.length ? [t().lossPoints(names.map((name) => `«${name}»`).join(", "))] : [];
}

export function installMaterialsGate(options: Options, pending: PendingLosses): void {
  const preToolUse: HookCallback = async (raw) => {
    const input = raw as { tool_name?: string; tool_input?: { summary?: unknown } };
    if (input.tool_name !== APPROVAL_TOOL) return {};
    const lines = lossLines(pending);
    if (!lines.length) return {};
    pending.losses = [];
    const summary = typeof input.tool_input?.summary === "string" ? input.tool_input.summary : "";
    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        // The approval tool asks the teacher itself: allowing it only lets the changed summary through.
        permissionDecision: "allow",
        updatedInput: { ...input.tool_input, summary: `${summary}\n\n${t().exportLosses}\n${lines.map((line) => `- ${line}`).join("\n")}` },
      },
    };
  };
  const hooks: Hooks = (options.hooks ??= {});
  (hooks.PreToolUse ??= []).push({ hooks: [preToolUse] });
}
