import { readFileSync } from "node:fs";
import path from "node:path";
import type { Options } from "@falkenslab/agent-kit";
import { validateGift, type ValidationResult } from "./validators/gift.js";
import { validateHtml } from "./validators/html.js";

/**
 * The upload gate: before moodle-teacher imports GIFT into a question bank (`import_questions`
 * with `format: "gift"`, as `text` or as a local `file`), check it with code. Errors deny the
 * import with the list, so the agent fixes the GIFT in drafts/ and tries again; warnings let it
 * through and reach the model as context. It runs in every mode, like a linter: a broken bank is
 * never wanted, whoever approved publishing it. Moodle XML and other calls pass untouched.
 */

type Hooks = NonNullable<Options["hooks"]>;
type HookCallback = NonNullable<Hooks[keyof Hooks]>[number]["hooks"][number];

const IMPORT_TOOL = "mcp__moodle__import_questions";

/** The findings for one file, or null when it isn't a kind this gate checks (or can't be read). */
export function validateUpload(file: string): ValidationResult | null {
  const ext = path.extname(file).toLowerCase();
  if (ext !== ".gift" && ext !== ".html" && ext !== ".htm") return null;
  let source: string;
  try {
    source = readFileSync(file, "utf-8");
  } catch {
    return null; // the import itself will report a missing file
  }
  return ext === ".gift" ? validateGift(source) : validateHtml(source, file);
}

function report(kind: "errors" | "warnings", results: [string, ValidationResult][]): string {
  return results
    .filter(([, r]) => r[kind].length > 0)
    .map(([file, r]) => `${path.basename(file)}:\n${r[kind].map((f) => `  - line ${f.line}: ${f.message}`).join("\n")}`)
    .join("\n");
}

/** The GIFT an import_questions call carries, checked: given as text, or as a file. */
function checkedImport(input: { format?: unknown; text?: unknown; file?: unknown } | undefined): [string, ValidationResult][] {
  if (input?.format !== "gift") return [];
  if (typeof input.text === "string") return [["questions.gift", validateGift(input.text)]];
  if (typeof input.file === "string") {
    const source = readFileSafe(input.file);
    return source === undefined ? [] : [[input.file, validateGift(source)]]; // a missing file: the import reports it
  }
  return [];
}

function readFileSafe(file: string): string | undefined {
  try {
    return readFileSync(file, "utf-8");
  } catch {
    return undefined;
  }
}

export function installUploadGate(options: Options): void {
  const preToolUse: HookCallback = async (raw) => {
    const input = raw as { tool_name?: string; tool_input?: { format?: unknown; text?: unknown; file?: unknown } };
    if (input.tool_name !== IMPORT_TOOL) return {};
    const results = checkedImport(input.tool_input);
    const errors = report("errors", results);
    const warnings = report("warnings", results);
    if (errors) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            `Import refused: the questions would reach Moodle broken.\n${errors}\n` +
            "Fix the GIFT in drafts/ and import it again." +
            (warnings ? `\nAlso worth fixing:\n${warnings}` : ""),
        },
      };
    }
    if (warnings) {
      return { hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: `Checked before importing; worth fixing:\n${warnings}` } };
    }
    return {};
  };
  const hooks: Hooks = (options.hooks ??= {});
  (hooks.PreToolUse ??= []).push({ hooks: [preToolUse] });
}
