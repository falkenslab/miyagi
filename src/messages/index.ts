import { detectLanguage, getLanguage, setLanguage } from "@falkenslab/agent-kit";
import { de } from "./de.js";
import { en, type Messages } from "./en.js";
import { es } from "./es.js";
import { fr } from "./fr.js";

export type { Messages } from "./en.js";

const CATALOGS: Record<string, Messages> = { en, es, fr, de };

/**
 * teacher-agent's texts for a person in agent-kit's current language (`getLanguage()`), so
 * teacher-agent and the kit always show the same one. English when there's no catalog.
 */
export function t(): Messages {
  return CATALOGS[getLanguage()] ?? en;
}

/**
 * Resolves the process's language once, at the CLI's start, before anything is printed:
 * `--language=<code>`, then `preferred` (an interface code from the workspace's or the
 * global config), then the system's (agent-kit's `detectLanguage()`), and makes it the kit's
 * too. Returns the warnings for an unsupported code, in English (the kit's).
 */
export function chooseInterfaceLanguage(preferred: string | undefined): string[] {
  const resolved = detectLanguage(preferred);
  setLanguage(resolved.language);
  return resolved.warnings;
}
