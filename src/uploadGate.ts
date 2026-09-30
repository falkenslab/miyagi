import { readFileSync } from "node:fs";
import path from "node:path";
import type { Options } from "@falkenslab/agent-kit";
import { validateGift, type ValidationResult } from "./validators/gift.js";
import { validateHtml } from "./validators/html.js";

/**
 * The upload gate: before the browser uploads a `.gift` or `.html` file to Moodle
 * (`browser_file_upload`, `browser_drop`), check it with code. Errors deny the upload with
 * the list, so the agent fixes the file in drafts/ and tries again; warnings let it through
 * and reach the model as context. It runs in every mode, like a linter: a broken file is
 * never wanted, whoever approved publishing it. Other files pass untouched.
 */

type Hooks = NonNullable<Options["hooks"]>;
type HookCallback = NonNullable<Hooks[keyof Hooks]>[number]["hooks"][number];

const UPLOAD_TOOLS = new Set(["mcp__playwright__browser_file_upload", "mcp__playwright__browser_drop"]);

/** The findings for one file, or null when it isn't a kind this gate checks (or can't be read). */
export function validateUpload(file: string): ValidationResult | null {
  const ext = path.extname(file).toLowerCase();
  if (ext !== ".gift" && ext !== ".html" && ext !== ".htm") return null;
  let source: string;
  try {
    source = readFileSync(file, "utf-8");
  } catch {
    return null; // the upload itself will report a missing file
  }
  return ext === ".gift" ? validateGift(source) : validateHtml(source, file);
}

function report(kind: "errors" | "warnings", results: [string, ValidationResult][]): string {
  return results
    .filter(([, r]) => r[kind].length > 0)
    .map(([file, r]) => `${path.basename(file)}:\n${r[kind].map((f) => `  - line ${f.line}: ${f.message}`).join("\n")}`)
    .join("\n");
}

export function installUploadGate(options: Options): void {
  const preToolUse: HookCallback = async (raw) => {
    const input = raw as { tool_name?: string; tool_input?: { paths?: unknown } };
    if (!UPLOAD_TOOLS.has(input.tool_name ?? "")) return {};
    const paths = Array.isArray(input.tool_input?.paths) ? input.tool_input.paths.filter((p): p is string => typeof p === "string") : [];
    const results = paths.map((p) => [p, validateUpload(p)] as const).filter((r): r is [string, ValidationResult] => r[1] !== null);
    const errors = report("errors", results);
    const warnings = report("warnings", results);
    if (errors) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            `Upload refused: the file would reach Moodle broken.\n${errors}\n` +
            "Fix the file in drafts/ and upload it again." +
            (warnings ? `\nAlso worth fixing:\n${warnings}` : ""),
        },
      };
    }
    if (warnings) {
      return { hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: `Checked before uploading; worth fixing:\n${warnings}` } };
    }
    return {};
  };
  const hooks: Hooks = (options.hooks ??= {});
  (hooks.PreToolUse ??= []).push({ hooks: [preToolUse] });
}
