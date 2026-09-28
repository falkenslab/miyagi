import { askForDecision, type ModeControl, type Options } from "@falkenslab/agent-kit";
import { MOODLE_PASSWORD_SECRET_NAME } from "./playwrightConfig.js";

/**
 * The publish gate: in "guided" mode, a browser action that publishes something in Moodle only
 * runs if the teacher approved it just before (request_human_approval); otherwise the teacher is
 * asked right there. The approval used to be only a rule in the prompt, and a real session
 * forgot it: a File resource was visible to students for ~35 s before the agent noticed (see
 * .minispec/decisions/ADR-008-publish-gate.md).
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
const BROWSER = "mcp__playwright__browser_";

/** Lowercase, without diacritics, so "Página" and "pagina" match the same pattern. */
function norm(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Moodle's buttons and menu items that publish, change or remove what students see, as the
 * model names them in a click's `element` or `target` — English and Spanish UI strings (lang
 * packs en and es of Moodle 5.2: savechangesanddisplay, savechangesandreturntocourse,
 * savechanges, assign/savenext, forum/posttoforum, submit, import, duplicate, hide,
 * showoncoursepage, makeavailable, assign/grantextension, gradingform_rubric/saverubric...),
 * plus the ids/names of Moodle's submit buttons. A false positive costs one extra panel; a
 * false negative, an unapproved publication.
 */
const PUBLISH_PATTERNS = [
  /\bsave\b/, /\bguardar\b/, /savechanges|submitbutton|saveandshownext/,
  /\bpost\b/, /\bsubmit\b/, /\bsend\b/, /\benviar\b/, /\bpublish\b/, /\bpublicar\b/,
  /\bimport\b/, /\bimportar\b/, /\bduplicate\b/, /\bduplicar\b/,
  /\bgrant extension\b/, /\bampliar (el )?plazo\b/,
  /\bmake available\b/, /\bhacer disponible\b/,
  /\bhide\b/, /\bocultar\b/, /\bshow on course page\b/, /\bmostrar en la pagina del curso\b/,
  /\bdelete\b/, /\bremove\b/, /\beliminar\b/, /\bborrar\b/,
];
/** "Show" alone is also a link ("Show more", "Show parent"): only as a menu item or option. */
const SHOW_ITEM = /^(show|mostrar)\b.*\b(menu item|option|opcion|elemento)\b/;
const NEVER_PUBLISH = [/\bcancel(ar)?\b/, /\bsearch\b/, /\bbuscar\b/, /\bfilter\b/, /\bfiltrar\b/];

function namesPublishing(text: string): boolean {
  const t = norm(text);
  if (NEVER_PUBLISH.some((re) => re.test(t))) return false;
  return PUBLISH_PATTERNS.some((re) => re.test(t)) || SHOW_ITEM.test(t);
}

/** The login form (the password is typed as its secret name, often into an unnamed field) or a search box. */
function isLoginOrSearch(element: string, target: string, typed: string): boolean {
  if (typed === MOODLE_PASSWORD_SECRET_NAME) return true;
  const t = norm(`${element} ${target}`);
  return NEVER_PUBLISH.some((re) => re.test(t)) || /\b(password|username|user ?name|log ?in|email|contrasena|usuario|acceder)\b/.test(t);
}

/** Scripts that submit a form, click a submit button or POST to Moodle. */
function scriptPublishes(code: string): boolean {
  const c = norm(code);
  if (/\.(requestsubmit|submit)\(/.test(c)) return true;
  if (/dispatchevent\(\s*new\s+\w*event\(\s*['"]submit/.test(c)) return true;
  if (/method\s*:\s*['"]post['"]/.test(c) || /lib\/ajax\/service(-nologin)?\.php/.test(c)) return true;
  return /\.click\(\s*\)/.test(c) && /savechanges|submitbutton|\bsave\b|\bguardar\b|\bpost\b|\bsubmit\b|\benviar\b/.test(c);
}

/**
 * Whether a tool call publishes something in Moodle. Pressing Enter on its own
 * (browser_press_key) isn't counted: it carries no target to tell a search box from a form,
 * and the prompt rule still covers it.
 */
export function isPublishAction(toolName: string, toolInput: unknown): boolean {
  if (!toolName.startsWith(BROWSER)) return false;
  const tool = toolName.slice(BROWSER.length);
  const input = (toolInput ?? {}) as Record<string, unknown>;
  const text = (key: string): string => (typeof input[key] === "string" ? (input[key] as string) : "");

  switch (tool) {
    case "click":
      return namesPublishing(`${text("element")} ${text("target")}`);
    case "type":
    case "press_sequentially":
      // Typing then Enter submits the form around the field, except a login or a search.
      return input.submit === true && !isLoginOrSearch(text("element"), text("target"), text("text"));
    case "evaluate":
      return scriptPublishes(text("function"));
    case "navigate":
      // Moodle's action links carry the session key (course/mod.php?hide=…&sesskey=…).
      return /[?&]sesskey=/.test(text("url"));
    default:
      return false;
  }
}

function describe(toolName: string, toolInput: unknown): string {
  const input = (toolInput ?? {}) as Record<string, unknown>;
  const summary = input.element ?? input.url ?? (typeof input.function === "string" ? input.function.slice(0, 300) : undefined);
  return `${toolName.replace(BROWSER, "")}: ${String(summary ?? JSON.stringify(input).slice(0, 300))}`;
}

/**
 * Adds the gate to `options.hooks`. `approvedText` is the response request_human_approval
 * gives when the teacher approves (teacher-agent's own `humanApprovalTexts.approved`).
 *
 * An approval lasts until the next request_human_approval call or the teacher's next message,
 * so one approval covers a batch (six grades, one "Save changes" each). A publication the
 * gate itself lets through covers only that call.
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
    if (modeControl.mode !== "guided" || input.agent_id || approved || !isPublishAction(tool, input.tool_input)) return {};

    const answer = await askForDecision(runDir, {
      title: "Publicación sin aprobación previa",
      lines: [
        "El agente va a publicar o cambiar algo en Moodle que pueden ver los alumnos, sin haberte pedido aprobación antes.",
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
