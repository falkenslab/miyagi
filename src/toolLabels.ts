import { createFriendlyToolLabel, truncate, type ToolPhrase } from "@falkenslab/agent-kit";
import { t } from "./messages/index.js";
import type { EvaluateKind, ToolPhraseKey } from "./messages/en.js";

/**
 * What a `browser_evaluate` call does, read from its code with a few ordered rules, so the
 * chat says it in words instead of showing the code (asking the model for a description
 * would cost tokens on every call). Writing and acting win over reading: a function that
 * reads the form and then fills it is filling it. Pure: `check-tool-labels.mjs` runs it on
 * real calls from sandbox sessions.
 */
export function classifyEvaluate(code: string): EvaluateKind {
  const c = code.replace(/\s+/g, " ");
  if (/setContent\(|insertContent\(|execCommand\(|\.innerHTML\s*=(?!=)/.test(c)) return "editor";
  if (/\.(value|checked|selected)\s*=(?!=)|dispatchEvent\(/.test(c)) return "form";
  if (/\.click\(\)|\.submit\(\)|requestSubmit\(/.test(c)) return "act";
  if (/\bfetch\(/.test(c)) return "otherPages";
  if (/\.modal|\[role=\\?"?dialog|modal-dialog/.test(c)) return "dialog";
  if (/\b(table|thead|tbody)\b|\btr\b|li\.slot/.test(c)) return "table";
  if (/\b(input|select|textarea|form|fieldset|options)\b|getElementById\(\s*['"]id_/.test(c)) return "formFields";
  if (/^\(\)\s*=>\s*location\.href/.test(c.trim())) return "location";
  if (/\.href\b|a\[href|querySelectorAll\(\s*['"]a['"]/.test(c)) return "links";
  if (/innerText|textContent|querySelector|getElementById|body/.test(c)) return "content";
  return "generic";
}

/**
 * `describe()` for `createFriendlyToolLabel()`'s override callback — agent-kit's own
 * `describeCore()` already covers Read/Write/Glob/Bash/Agent/WebFetch/WebSearch/Skill/
 * request_human_approval/request_manual_login/save_to_sources; this only adds the
 * `browser_*` cases for `@playwright/mcp`.
 */
function describePlaywright(shortName: string, input: Record<string, unknown>): string | undefined {
  const m = t().tool;
  const text = (value: unknown, fallback: string): string => truncate(typeof value === "string" ? value : fallback);
  switch (shortName) {
    case "browser_navigate":
      return m.navigate(typeof input.url === "string" ? input.url : m.aPage);
    case "browser_navigate_back":
      return m.back;
    case "browser_navigate_forward":
      return m.forward;
    case "browser_snapshot":
      return m.snapshot;
    case "browser_click":
      return m.click(text(input.element, m.anElement));
    case "browser_hover":
      return m.hover(text(input.element, m.anElement));
    case "browser_drag":
      return m.drag(text(input.startElement, m.anElement), text(input.endElement, m.anotherElement));
    case "browser_select_option":
      return m.select(truncate(Array.isArray(input.values) ? input.values.join(", ") : ""), text(input.element, m.aDropdown));
    case "browser_type":
      return m.type(text(input.text, ""), text(input.element, m.aField));
    case "browser_press_key":
      return m.pressKey(typeof input.key === "string" ? input.key : "?");
    case "browser_wait_for":
      if (typeof input.text === "string") return m.waitFor(truncate(input.text));
      if (typeof input.textGone === "string") return m.waitGone(truncate(input.textGone));
      if (typeof input.time === "number") return m.waitSeconds(input.time);
      return m.wait;
    case "browser_find":
      if (typeof input.text === "string") return m.findText(truncate(input.text));
      if (typeof input.regex === "string") return m.findPattern(truncate(input.regex));
      return m.find;
    case "browser_fill_form":
      return m.fillForm(Array.isArray(input.fields) ? input.fields.length : 0);
    case "browser_file_upload":
      return m.upload;
    case "browser_evaluate":
      return m.evaluate[classifyEvaluate(typeof input.function === "string" ? input.function : "")];
    case "browser_take_screenshot":
      return m.screenshot;
    case "browser_tabs":
      return m.tabs;
    case "browser_resize":
      return m.resize;
    case "browser_close":
      return m.close;
    case "browser_console_messages":
      return m.console;
    case "browser_network_requests":
      return m.networkRequests;
    case "browser_network_request":
      return input.part === "response-body" ? m.saveResponse : m.requestDetails;
    case "browser_run_code_unsafe":
      return m.runCodeUnsafe;
    case "browser_handle_dialog":
      return input.accept === false ? m.dismissDialog : m.acceptDialog;
    case "drafts_list":
      return m.drafts.list(text(input.path, "."));
    case "drafts_mkdir":
      return m.drafts.mkdir(text(input.path, ""));
    case "drafts_copy":
      return m.drafts.copy(text(input.from, ""), text(input.to, ""));
    case "drafts_move":
      return m.drafts.move(text(input.from, ""), text(input.to, ""));
    case "drafts_delete":
      return m.drafts.del(text(input.path, ""));
    case "drafts_download":
      return m.drafts.download(text(input.url, ""));
    case "drafts_fetch_site":
      return m.drafts.fetchSite(text(input.url, ""));
    case "drafts_unzip":
      return m.drafts.unzip(text(input.archive, ""));
    case "drafts_zip":
      return m.drafts.zip(text(input.to, ""));
    case "drafts_pdf":
      return m.drafts.pdf(text(input.to, ""));
    case "drafts_info":
      return m.drafts.info(text(input.path, ""));
    default:
      // The kit's generic fallback no longer strips Playwright's "browser_" prefix.
      return shortName.startsWith("browser_") ? shortName.replace(/^browser_/, "").replace(/_/g, " ") : undefined;
  }
}

/** `extraLocalServers: ["playwright"]` so `mcp__playwright__browser_click` unwraps to
 * `describePlaywright("browser_click", ...)` without a `"[playwright] "` prefix. */
export const friendlyToolLabel = createFriendlyToolLabel({
  describe: describePlaywright,
  extraLocalServers: ["playwright", "drafts"],
});


/** Which phrase each browser tool (and the approval tool) counts with in a folded group. */
const PHRASE_KEYS: Record<string, ToolPhraseKey> = {
  browser_navigate: "navigate",
  browser_navigate_back: "back",
  browser_navigate_forward: "navigate",
  browser_click: "click",
  browser_hover: "click",
  browser_drag: "click",
  browser_type: "type",
  browser_fill_form: "fillForm",
  browser_select_option: "select",
  browser_press_key: "pressKey",
  browser_snapshot: "snapshot",
  browser_evaluate: "evaluate",
  browser_find: "find",
  browser_wait_for: "wait",
  browser_file_upload: "upload",
  browser_take_screenshot: "screenshot",
  request_human_approval: "approval",
  drafts_download: "download",
  drafts_fetch_site: "download",
  drafts_pdf: "pdf",
  drafts_list: "files",
  drafts_mkdir: "files",
  drafts_copy: "files",
  drafts_move: "files",
  drafts_delete: "files",
  drafts_unzip: "files",
  drafts_zip: "files",
  drafts_info: "files",
};

/** `toolPhrase` for agent-kit's folded tool groups ("abrió 3 páginas, pulsó 5 veces"); other tools keep the kit's. */
export function toolPhrase(toolName: string): ToolPhrase | undefined {
  const key = PHRASE_KEYS[toolName.slice(toolName.lastIndexOf("__") + 2)];
  return key ? t().toolPhrases[key] : undefined;
}
