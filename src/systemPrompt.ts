import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPromptLoader } from "@falkenslab/agent-kit";
import type { WorkspaceSessionConfig } from "./workspace.js";
import { MOODLE_PASSWORD_SECRET_NAME } from "./playwrightConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadPrompt = createPromptLoader(path.join(__dirname, "..", "prompts"));

/**
 * Domain knowledge about Moodle and the teacher mission. All differentiation by activity
 * type (quiz/assignment/forum/resource) lives in the prompt text itself
 * (`prompts/system/*.md`), not in code — this function only decides which template to load
 * and with what variables.
 */
export function buildSystemPrompt(config: WorkspaceSessionConfig): string {
  // "explore" is a short, bounded probe with its own prompt: nothing else applies to it
  // except the file-safety rule (it drives the browser like any other session).
  if (config.kind === "explore") return `${buildExploreSystemPrompt(config)}${playwrightFileSafetySection()}`;

  const base = !config.hasMoodle
    ? buildStandaloneSystemPrompt(config)
    : config.kind === "chat" ? buildChatSystemPrompt(config) : config.kind === "ingest" ? buildIngestSystemPrompt(config) : buildRunSystemPrompt(config);
  const browserOnly = config.kind === "ingest" || !config.hasMoodle ? "" : playwrightFileSafetySection();
  return `${base}${migrationSection(config)}${subagentsSection(config)}${practiceSection(config)}${languageSection(config)}${personaSection(config)}${customInstructionsSection(config)}${webResearchSection(config)}${browserOnly}`;
}

/** A legacy knowledge/ was moved to knowledge-legacy/: rebuilding the knowledge base comes before anything else. */
function migrationSection(config: WorkspaceSessionConfig): string {
  if (!config.migrationPending) return "";
  return `\n\n${loadPrompt("system/knowledge-migration.md")}`;
}

/** The researcher and pedagogy-reviewer subagents, registered in agent.ts for run/chat. */
function subagentsSection(config: WorkspaceSessionConfig): string {
  if (config.kind !== "run" && config.kind !== "chat") return "";
  return `

${loadPrompt("system/subagents.md")}`;
}

/**
 * The practice-runner subagent (registered in agent.ts's buildSubagents()) only exists in run/chat
 * when the workspace opted into `allowPracticeRunner` — off by default, since it's the only thing
 * that grants a shell. Without it, mentioning the subagent would send the model toward Agent
 * calls that are denied.
 */
function practiceSection(config: WorkspaceSessionConfig): string {
  if (!config.allowPracticeRunner || (config.kind !== "run" && config.kind !== "chat")) return "";
  return `

${loadPrompt("system/practice-access.md")}`;
}

function playwrightFileSafetySection(): string {
  return `\n\n${loadPrompt("system/playwright-file-safety.md")}`;
}

function languageSection(config: WorkspaceSessionConfig): string {
  const defaultLanguageLine = config.knownLanguage
    ? `Absent any other signal (e.g. the very start of a run with no human input), ` +
      `${config.knownLanguage} is this human's usual language for this workspace — start ` +
      `there, but always follow their lead if they address you in a different language.`
    : "If there's no signal yet (e.g. the very start of a run with no human input), " +
      "default to English.";
  return `\n\n${loadPrompt("system/language.md", { defaultLanguageLine })}`;
}

function webResearchSection(config: WorkspaceSessionConfig): string {
  const toolDoubts = config.hasMoodle
    ? "how to use Moodle (an uncommon configuration option, an activity type you don't know where to start with)"
    : "how to do something in a format or a tool (a GIFT detail, a spreadsheet formula, an accessibility rule)";
  // Without a browser (ingest, or no classroom) there are no course forums or Moodle UI to try first.
  const firstSourcesLine = config.kind === "ingest" || !config.hasMoodle
    ? "Before reaching out, always try what you already have first: the workspace's " +
      "`sources/` and the knowledge base. Only go out to the internet to " +
      "clarify something the material itself leaves unclear, and label it as outside the " +
      "course in the pages you write."
    : "Before reaching out, always try what you already have first: the workspace's " +
      "`sources/` and the knowledge base (the answer might already be there, or in material " +
      "the teacher has uploaded), the course's own forums (an existing thread may have " +
      "already asked and answered the same doubt), and the Moodle UI itself for usage " +
      "doubts. Only go out to the internet once you're truly out of leads there.";
  return `\n\n${loadPrompt("system/web-research.md", { firstSourcesLine, toolDoubts })}`;
}

function personaSection(config: WorkspaceSessionConfig): string {
  if (!config.agentPersona) return "";
  return `\n\n${loadPrompt(`system/persona-${config.agentPersona}.md`)}`;
}

function customInstructionsSection(config: WorkspaceSessionConfig): string {
  if (!config.customInstructions) return "";
  return `\n\n${loadPrompt("system/custom-instructions.md", { label: "teacher", customInstructions: config.customInstructions })}`;
}

/** A workspace without a classroom (ADR-013): the teacher's assistant for the plan and the
 * materials, no browser, nothing to publish, no Moodle in the prompt. */
function buildStandaloneSystemPrompt(config: WorkspaceSessionConfig): string {
  const kind = config.kind === "chat" ? "chat" : config.kind === "ingest" ? "ingest" : "run";
  return loadPrompt(`system/teacher-${kind}-standalone.md`, { contextAndKnowledgeSection: contextAndKnowledgeSection(config) });
}

function buildRunSystemPrompt(config: WorkspaceSessionConfig): string {
  return loadPrompt("system/teacher-run.md", {
    moodleUrl: config.moodleUrl ?? "",
    moodleCourseId: config.moodleCourseId ?? "",
    credentialsSection: credentialsSection(config),
    contextAndKnowledgeSection: contextAndKnowledgeSection(config),
    evaluableSubmissionRule: evaluableSubmissionRule(config.mode),
  });
}

function buildIngestSystemPrompt(config: WorkspaceSessionConfig): string {
  return loadPrompt("system/teacher-ingest.md", {
    moodleUrl: config.moodleUrl ?? "",
    moodleCourseId: config.moodleCourseId ?? "",
    contextAndKnowledgeSection: contextAndKnowledgeSection(config),
  });
}

function buildChatSystemPrompt(config: WorkspaceSessionConfig): string {
  return loadPrompt("system/teacher-chat.md", {
    moodleUrl: config.moodleUrl ?? "",
    moodleCourseId: config.moodleCourseId ?? "",
    credentialsSection: credentialsSection(config),
    contextAndKnowledgeSection: contextAndKnowledgeSection(config),
  });
}

function buildExploreSystemPrompt(config: WorkspaceSessionConfig): string {
  return loadPrompt("system/explore.md", {
    moodleUrl: config.moodleUrl ?? "",
    moodleCourseId: config.moodleCourseId ?? "",
    credentialsSection: credentialsSection(config),
  });
}

/** No saved username/password → the agent has to ask a human to log in by hand. */
function credentialsSection(config: WorkspaceSessionConfig): string {
  if (!config.hasMoodle) return "";
  if (config.moodleUsername && config.moodlePassword) {
    // In autonomous, or with --headless, there's no human-intervention channel at all
    // (see includeManualLoginTool in agent-kit's session.ts), so the fallback isn't
    // mentioned there — there'd be no request_manual_login tool registered to use it with.
    const manualLoginFallback = config.mode !== "autonomous" && !config.headless
      ? `\n\n${loadPrompt("system/credentials-fallback.md")}`
      : "";
    return loadPrompt("system/credentials-configured.md", {
      username: config.moodleUsername,
      passwordSecretName: MOODLE_PASSWORD_SECRET_NAME,
      manualLoginFallback,
    });
  }
  return loadPrompt("system/credentials-manual-login.md", { moodleUrl: config.moodleUrl ?? "" });
}

/**
 * The workspace's own material and the course-specific layer on top of agent-kit's built-in
 * knowledge base: agent-kit appends its generic "Knowledge base" rules (layers, layout, working
 * rules) to the end of the whole prompt; `course-knowledge.md` here only adds what is specific
 * to managing a course (topics, activities, progress and audit histories, course pages).
 */
function contextAndKnowledgeSection(config: WorkspaceSessionConfig): string {
  if (!config.knowledgeDir || !config.sourcesDir) return "";

  const hasBrowser = config.hasMoodle && config.kind !== "ingest";
  const contextBlock = `\n${loadPrompt("system/sources.md", {
    sourcesDir: config.sourcesDir,
    authorityLine: config.hasMoodle ? ", alongside (or even above) whatever you find on Moodle itself" : "",
    linksLine: hasBrowser
      ? "you can navigate to those specific URLs with the browser tools to consult them — it's the only situation where it's fine to leave Moodle itself."
      : "you may use WebFetch for a public web page it links to, clearly labelled as outside the course's material.",
  })}`;
  // The classroom's pages (orientation, map, capabilities, progress, audit, hidden drafts)
  // only exist with a classroom.
  const classroomBlock = config.hasMoodle ? `\n\n${loadPrompt("system/classroom-knowledge.md")}` : "";
  const knowledgeBlock = `${loadPrompt("system/course-knowledge.md")}${classroomBlock}`;
  // Without a browser there's no Moodle to navigate or download from.
  if (config.kind === "ingest" || !config.hasMoodle) return `${contextBlock}\n\n${knowledgeBlock}`;

  const navigationMapBlock = loadPrompt("system/navigation-map.md");
  const moodleFileAccessBlock = loadPrompt("system/moodle-file-access.md");
  return `${contextBlock}\n\n${knowledgeBlock}\n\n${navigationMapBlock}\n\n${moodleFileAccessBlock}`;
}

function evaluableSubmissionRule(mode: WorkspaceSessionConfig["mode"]): string {
  if (mode === "guided") return loadPrompt("system/evaluable-submission-guided.md");
  if (mode === "interactive") return loadPrompt("system/evaluable-submission-interactive.md");
  return loadPrompt("system/evaluable-submission-autonomous.md");
}
