import { setTheme } from "@falkenslab/agent-kit";

/** The owl's colors (the chat header's logo and docs/assets/owl.svg). */
export const OWL_ORANGE = "#d77757";
export const OWL_AMBER = "#dfa23a";

/**
 * teacher-agent's look on top of agent-kit's default theme, set once at the CLI's start so
 * the chat, the one-shot view and the wizard share it: amber tool bullets and an orange
 * spinner. Replies, the human's lines and the dimmed tool lines keep the kit's colors.
 */
export function applyTeacherTheme(): void {
  setTheme({ toolBullet: OWL_AMBER, working: OWL_ORANGE });
}
