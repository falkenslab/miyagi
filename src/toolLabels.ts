import { createFriendlyToolLabel, truncate } from "@falkenslab/agent-kit";

/**
 * `describe()` for `createFriendlyToolLabel()`'s override callback — agent-kit's own
 * `describeCore()` already covers Read/Write/Glob/Bash/Agent/WebFetch/WebSearch/Skill/
 * request_human_approval/request_manual_login/save_to_sources; this only adds the
 * `browser_*` cases for `@playwright/mcp`.
 */
function describePlaywright(shortName: string, input: Record<string, unknown>): string | undefined {
  switch (shortName) {
    case "browser_navigate":
      return `Navigating to ${input.url ?? "a page"}`;
    case "browser_navigate_back":
      return "Going back to the previous page";
    case "browser_navigate_forward":
      return "Going forward to the next page";
    case "browser_snapshot":
      return "Reading the page structure";
    case "browser_click": {
      const element = typeof input.element === "string" ? input.element : "an element";
      return `Clicking "${truncate(element)}"`;
    }
    case "browser_hover": {
      const element = typeof input.element === "string" ? input.element : "an element";
      return `Hovering over "${truncate(element)}"`;
    }
    case "browser_drag": {
      const from = typeof input.startElement === "string" ? input.startElement : "an element";
      const to = typeof input.endElement === "string" ? input.endElement : "another element";
      return `Dragging "${truncate(from)}" to "${truncate(to)}"`;
    }
    case "browser_select_option": {
      const element = typeof input.element === "string" ? input.element : "a dropdown";
      const values = Array.isArray(input.values) ? input.values.join(", ") : "";
      return `Selecting "${truncate(values)}" in "${truncate(element)}"`;
    }
    case "browser_type": {
      const element = typeof input.element === "string" ? input.element : "a field";
      const text = typeof input.text === "string" ? input.text : "";
      return `Typing "${truncate(text)}" into "${truncate(element)}"`;
    }
    case "browser_press_key":
      return `Pressing the "${input.key ?? "?"}" key`;
    case "browser_wait_for":
      if (typeof input.text === "string") return `Waiting for "${truncate(input.text)}" to appear`;
      if (typeof input.textGone === "string") return `Waiting for "${truncate(input.textGone)}" to disappear`;
      if (typeof input.time === "number") return `Waiting ${input.time}s`;
      return "Waiting";
    case "browser_find":
      if (typeof input.text === "string") return `Looking for "${truncate(input.text)}" on the page`;
      if (typeof input.regex === "string") return `Looking for the pattern "${truncate(input.regex)}" on the page`;
      return "Searching the page";
    case "browser_fill_form": {
      const n = Array.isArray(input.fields) ? input.fields.length : 0;
      return `Filling in a form (${n} field${n === 1 ? "" : "s"})`;
    }
    case "browser_file_upload":
      return "Uploading file(s)";
    case "browser_evaluate": {
      const code = typeof input.function === "string" ? input.function.replace(/\s+/g, " ").trim() : "";
      return code ? `Running JavaScript: ${truncate(code, 80)}` : "Inspecting the page with JavaScript";
    }
    case "browser_take_screenshot":
      return "Taking a screenshot";
    case "browser_tabs":
      return "Managing browser tabs";
    case "browser_resize":
      return "Resizing the window";
    case "browser_close":
      return "Closing the browser";
    case "browser_console_messages":
      return "Checking the browser console";
    case "browser_network_requests":
      return "Checking network requests";
    case "browser_network_request": {
      const part = typeof input.part === "string" ? input.part : undefined;
      return part === "response-body" ? "Saving a network response's body to disk" : "Reading network request details";
    }
    case "browser_start_video":
      return "Starting video recording";
    case "browser_stop_video":
      return "Stopping video recording";
    case "browser_run_code_unsafe":
      return "⚠️ Trying to run unrestricted code (blocked)";
    case "browser_handle_dialog":
      return input.accept === false ? "Dismissing a browser dialog" : "Accepting a browser dialog";
    default:
      // The kit's generic fallback no longer strips Playwright's "browser_" prefix.
      return shortName.startsWith("browser_") ? shortName.replace(/^browser_/, "").replace(/_/g, " ") : undefined;
  }
}

/** `extraLocalServers: ["playwright"]` so `mcp__playwright__browser_click` unwraps to
 * `describePlaywright("browser_click", ...)` without a `"[playwright] "` prefix. */
export const friendlyToolLabel = createFriendlyToolLabel({
  describe: describePlaywright,
  extraLocalServers: ["playwright"],
});
