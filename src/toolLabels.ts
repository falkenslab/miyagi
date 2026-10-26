import { createFriendlyToolLabel, truncate, type ToolPhrase } from "@falkenslab/agent-kit";
import { t } from "./messages/index.js";
import type { ToolPhraseKey } from "./messages/en.js";

/**
 * The chat's lines for miyagi's own tools: the drafts and materials toolboxes. moodle-teacher's tools bring
 * their own labels in its manifest (agent-kit's `toolLabels`), and the rest are the kit's.
 */
function describeDrafts(shortName: string, input: Record<string, unknown>): string | undefined {
  const m = t().tool.drafts;
  const text = (value: unknown): string => truncate(typeof value === "string" ? value : "");
  switch (shortName) {
    case "drafts_download":
      return m.download(text(input.url));
    case "drafts_fetch_site":
      return m.fetchSite(text(input.url));
    case "drafts_unzip":
      return m.unzip(text(input.archive));
    case "drafts_zip":
      return m.zip(text(input.to));
    case "drafts_pdf":
      return m.pdf(text(input.to));
    case "drafts_info":
      return m.info(text(input.path));
    default:
      return describeMaterials(shortName, input);
  }
}

function describeMaterials(shortName: string, input: Record<string, unknown>): string | undefined {
  const m = t().tool.materials;
  const text = (value: unknown): string => truncate(typeof value === "string" ? value : "");
  switch (shortName) {
    case "materials_list":
      return m.list;
    case "materials_validate":
      return m.validate(text(input.path));
    case "materials_export":
      return m.export(text(input.path));
    case "materials_import":
      return m.import(text(input.from), text(input.to));
    case "materials_exam":
      return m.exam(text(input.path));
    case "record_publication":
      return m.record(text(input.path));
    case "publication_status":
      return m.status;
    case "materials_resolve":
      return m.resolve(text(input.path));
    case "materials_style":
      return m.style;
    default:
      return undefined;
  }
}

/** `extraLocalServers: ["drafts"]` so `mcp__drafts__drafts_zip` unwraps without a `"[drafts] "` prefix. */
export const friendlyToolLabel = createFriendlyToolLabel({
  describe: describeDrafts,
  extraLocalServers: ["drafts", "materials"],
});

/** Which phrase each of miyagi's tools (and the approval tool) counts with in a folded group. */
const PHRASE_KEYS: Record<string, ToolPhraseKey> = {
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
  materials_list: "files",
  materials_validate: "files",
  materials_export: "files",
  materials_import: "files",
  materials_exam: "files",
  record_publication: "files",
  publication_status: "files",
  materials_resolve: "files",
  materials_style: "files",
};

/** `toolPhrase` for agent-kit's folded tool groups ("revisó 3 archivos"); other tools keep the kit's. */
export function toolPhrase(toolName: string): ToolPhrase | undefined {
  const key = PHRASE_KEYS[toolName.slice(toolName.lastIndexOf("__") + 2)];
  return key ? t().toolPhrases[key] : undefined;
}
