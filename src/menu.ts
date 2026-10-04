import path from "node:path";
import { isExitPromptError, runWizard, ui, type Mode, type WizardAnswers, type WizardStep } from "@falkenslab/agent-kit";
import {
  createWorkspace,
  defaultWorkspaceLabel,
  writeInstructionsTemplate,
  writeWorkspaceConfig,
  type AgentPersona,
  type WorkspaceConfig,
} from "./workspace.js";
import { t } from "./messages/index.js";

/**
 * If `raw` is a full course URL (e.g. "http://localhost:8080/course/view.php?id=4"),
 * splits it into the Moodle's base URL (including any install subpath) and the course id.
 * Only `course/view.php` is recognized: other Moodle pages also use `?id=` with another
 * meaning (activity, category...).
 */
export function parseCourseUrl(raw: string): { url: string; courseId?: string } {
  const trimmed = raw.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { url: trimmed };
  }

  const suffix = "/course/view.php";
  if (!parsed.pathname.endsWith(suffix)) return { url: trimmed };

  const courseId = parsed.searchParams.get("id");
  if (!courseId) return { url: trimmed };

  return { url: `${parsed.origin}${parsed.pathname.slice(0, -suffix.length)}`, courseId };
}

/** One question with agent-kit's wizard (the chat's look); its answer. */
async function ask<T>(step: WizardStep): Promise<T> {
  return (await runWizard([step]))[step.name] as T;
}

/** Runs `fn`, exiting cleanly instead of throwing when the user hits Ctrl+C on a prompt. */
async function exitOnCancel<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isExitPromptError(error)) process.exit(0);
    throw error;
  }
}

const required = (v: string) => v.trim() !== "" || t().required;
/** The course id comes from a full course URL when there is one; otherwise it's asked. */
const courseOf = (a: WizardAnswers) => parseCourseUrl(String(a.url)).courseId ?? String(a.courseId ?? "");

/** The Moodle classroom's questions, asked only when `when` holds. */
function classroomSteps(when: (a: WizardAnswers) => boolean): WizardStep[] {
  return [
    { type: "input", name: "url", message: t().moodleUrl, validate: required, when },
    { type: "input", name: "courseId", message: t().courseId, validate: required, when: (a) => when(a) && !parseCourseUrl(String(a.url)).courseId },
    { type: "input", name: "username", message: t().username, when },
    { type: "password", name: "password", message: t().password, when: (a) => when(a) && String(a.username ?? "") !== "" },
  ];
}

/** The classroom from the wizard's answers. */
function classroomOf(answers: WizardAnswers, label: string, description: string): NonNullable<WorkspaceConfig["classroom"]> {
  const username = String(answers.username ?? "");
  return {
    label,
    ...(description ? { description } : {}),
    url: parseCourseUrl(String(answers.url)).url,
    courseId: courseOf(answers),
    ...(username ? { username, password: String(answers.password ?? "") } : {}),
  };
}

/**
 * Asks for a new workspace's data and creates it in `workspaceDir` (config.json, sources/,
 * knowledge/, .gitignore and, optionally, instructions.md). The Moodle classroom is optional
 * (ADR-013): the first question is whether to connect one now. Used by `miyagi init`
 * and by run/chat when the directory isn't a workspace yet.
 */
export function promptInitWorkspace(workspaceDir: string): Promise<WorkspaceConfig> {
  return exitOnCancel(async () => {
    const connected = (a: WizardAnswers) => a.connect === true;
    const answers = await runWizard(
      [
        { type: "confirm", name: "connect", message: t().connectMoodleNow, default: true },
        ...classroomSteps(connected),
        {
          type: "input",
          name: "label",
          message: (a) => (connected(a) ? t().label : t().workspaceName),
          default: (a) => (connected(a) ? defaultWorkspaceLabel(parseCourseUrl(String(a.url)).url, courseOf(a)) : path.basename(path.resolve(workspaceDir))),
        },
        { type: "input", name: "description", message: t().description },
        {
          type: "select",
          name: "persona",
          message: t().persona,
          choices: [
            { name: t().personaNone, value: undefined },
            { name: t().personaFormal, value: "formal" },
            { name: t().personaWarm, value: "warm" },
            { name: t().personaMotivating, value: "motivating" },
          ],
        },
        { type: "input", name: "language", message: t().conversationLanguage },
        // Saved as explicit true/false (never omitted): offerPracticeRunner() reads an absent key
        // as "never asked", and would otherwise keep asking after a deliberate "no". It's the only
        // opt-in capability: the one thing that grants a shell (Docker only).
        { type: "confirm", name: "allowPracticeRunner", message: t().practiceRunnerQuestion, default: false },
        { type: "confirm", name: "instructions", message: t().createInstructions, default: false },
      ],
      { title: t().initHeading(workspaceDir).trim() },
    );

    const label = String(answers.label);
    const description = String(answers.description ?? "");
    const language = String(answers.language ?? "");
    const persona = answers.persona as AgentPersona | undefined;
    const config: WorkspaceConfig = {
      // Without a classroom the name and description live at the root.
      ...(connected(answers) ? { classroom: classroomOf(answers, label, description) } : { label, ...(description ? { description } : {}) }),
      agent: {
        role: "teacher",
        ...(persona ? { persona } : {}),
        ...(language ? { language } : {}),
        allowPracticeRunner: answers.allowPracticeRunner === true,
      },
    };
    await createWorkspace(workspaceDir, config);
    if (answers.instructions === true) await writeInstructionsTemplate(workspaceDir);

    console.log(ui.success(t().workspaceCreated(workspaceDir)));
    return config;
  });
}

/**
 * A workspace created before the practice runner existed (or by moodle-agent) has no
 * `agent.allowPracticeRunner`: offer it once — the answer, yes or no, is persisted — instead of
 * it silently staying off forever. Ctrl+C skips without persisting, so it's offered again.
 */
export async function offerPracticeRunner(
  workspaceDir: string,
  config: WorkspaceConfig,
  canPrompt: boolean,
): Promise<WorkspaceConfig> {
  if (config.agent.allowPracticeRunner !== undefined) return config;
  console.log(ui.warn(t().practiceRunnerNote));
  if (!canPrompt) {
    console.log();
    return config;
  }
  try {
    const wants = await ask<boolean>({ type: "confirm", name: "practiceRunner", message: t().practiceRunnerQuestion, default: false });
    const updated = { ...config, agent: { ...config.agent, allowPracticeRunner: wants } };
    await writeWorkspaceConfig(workspaceDir, updated);
    console.log();
    return updated;
  } catch (error) {
    if (!isExitPromptError(error)) throw error;
    console.log();
    return config;
  }
}

/**
 * `miyagi init` on a workspace without a classroom: offers to connect one, and saves it
 * with the workspace's own name and description. Returns the config, updated or not.
 */
export function promptConnectClassroom(workspaceDir: string, config: WorkspaceConfig): Promise<WorkspaceConfig> {
  return exitOnCancel(async () => {
    const answers = await runWizard(
      [{ type: "confirm", name: "connect", message: t().connectMoodleNow, default: true }, ...classroomSteps((a) => a.connect === true)],
      { title: t().initHeading(workspaceDir).trim() },
    );
    if (answers.connect !== true) return config;
    const { label, description, ...rest } = config;
    const updated: WorkspaceConfig = { ...rest, classroom: classroomOf(answers, label ?? path.basename(path.resolve(workspaceDir)), description ?? "") };
    await writeWorkspaceConfig(workspaceDir, updated);
    console.log(ui.success(t().workspaceCreated(workspaceDir)));
    return updated;
  });
}

/** Asked right after "init": probing the Moodle's activity/question types is what the
 * authoring skills check before creating anything. */
export function promptExploreNow(): Promise<boolean> {
  return exitOnCancel(() => ask<boolean>({ type: "confirm", name: "explore", message: t().exploreNow, default: true }));
}

/** Only used by "miyagi" with no subcommand. */
export function promptRunKind(): Promise<"run" | "chat"> {
  return exitOnCancel(() => ask<"run" | "chat">({
    type: "select",
    name: "kind",
    message: t().whatToDo,
    choices: [
      { name: t().kindRun, value: "run" },
      { name: t().kindChat, value: "chat" },
    ],
  }));
}

/** Only used by "run" without --mode (chat is always guided). */
export function promptMode(): Promise<Mode> {
  return exitOnCancel(() => ask<Mode>({
    type: "select",
    name: "mode",
    message: t().whichMode,
    choices: [
      { name: t().modeInteractive, value: "interactive" },
      { name: t().modeGuided, value: "guided" },
      { name: t().modeAutonomous, value: "autonomous" },
    ],
    default: "guided",
  }));
}
