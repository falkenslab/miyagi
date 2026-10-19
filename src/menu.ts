import path from "node:path";
import { isExitPromptError, runWizard, ui, type Mode, type WizardAnswers, type WizardStep } from "@falkenslab/agent-kit";
import {
  createWorkspace,
  writeInstructionsTemplate,
  writeWorkspaceConfig,
  type AgentPersona,
  type WorkspaceConfig,
} from "./workspace.js";
import { t } from "./messages/index.js";
import { newWorkspaceDir, registerWorkspace, type ListedWorkspace } from "./workspaces.js";
import { connectMoodleTeacher } from "./classroom.js";

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

/**
 * The Moodle classroom's questions, asked only when `when` holds: the course's address (and its
 * id when the address doesn't carry it). No username or password: moodle-teacher signs in through
 * its own window (ADR-021).
 */
function classroomSteps(when: (a: WizardAnswers) => boolean): WizardStep[] {
  return [
    { type: "input", name: "url", message: t().moodleUrl, validate: required, when },
    { type: "input", name: "courseId", message: t().courseId, validate: required, when: (a) => when(a) && !parseCourseUrl(String(a.url)).courseId },
  ];
}

/** The classroom from the wizard's answers, reached through moodle-teacher. */
function classroomOf(answers: WizardAnswers, label: string, description: string): NonNullable<WorkspaceConfig["classroom"]> {
  return {
    label,
    ...(description ? { description } : {}),
    url: parseCourseUrl(String(answers.url)).url,
    courseId: courseOf(answers),
    connector: "moodle-teacher",
  };
}

/** Installs or extends moodle-teacher for the classroom; a failure leaves the workspace as it is and says how to retry. */
export async function connectClassroom(workspaceDir: string, url: string): Promise<void> {
  console.log(ui.dim(t().connectingMoodleTeacher));
  try {
    await connectMoodleTeacher(workspaceDir, url);
  } catch (error) {
    console.log(ui.warn(`${error instanceof Error ? error.message : String(error)} ${t().moodleTeacherRetry}`));
  }
}

/**
 * Asks for a new workspace's data and creates it (config.json, sources/, knowledge/, .gitignore
 * and, optionally, instructions.md): in `workspaceDir` when given (`--dir`), otherwise in
 * miyagi's own folder under a slug of its name (ADR-023). The Moodle classroom is optional
 * (ADR-013): the last question is whether to connect one now (no by default), through
 * moodle-teacher. Registers it, so it opens by name. Used by `miyagi init` and by run/chat when there's no workspace to open.
 */
export function promptInitWorkspace(workspaceDir?: string): Promise<{ dir: string; id: string; config: WorkspaceConfig }> {
  return exitOnCancel(async () => {
    const connected = (a: WizardAnswers) => a.connect === true;
    const answers = await runWizard(
      [
        {
          type: "input",
          name: "label",
          message: t().workspaceName,
          default: workspaceDir ? path.basename(path.resolve(workspaceDir)) : "",
          validate: required,
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
        { type: "confirm", name: "connect", message: t().connectMoodleNow, default: false },
        ...classroomSteps(connected),
      ],
      { title: (workspaceDir ? t().initHeading(workspaceDir) : t().initHeadingNew).trim() },
    );

    const label = String(answers.label);
    const description = String(answers.description ?? "");
    const language = String(answers.language ?? "");
    const persona = answers.persona as AgentPersona | undefined;
    const config: WorkspaceConfig = {
      kind: "subject",
      // Without a classroom the name and description live at the root.
      ...(connected(answers) ? { classroom: classroomOf(answers, label, description) } : { label, ...(description ? { description } : {}) }),
      agent: {
        role: "teacher",
        ...(persona ? { persona } : {}),
        ...(language ? { language } : {}),
        allowPracticeRunner: answers.allowPracticeRunner === true,
      },
    };
    const dir = workspaceDir ?? (await newWorkspaceDir(label));
    await createWorkspace(dir, config);
    if (answers.instructions === true) await writeInstructionsTemplate(dir);
    const { id } = await registerWorkspace(dir, label, "subject");

    console.log(ui.success(t().workspaceCreated(dir)));
    if (config.classroom) await connectClassroom(dir, config.classroom.url);
    return { dir, id, config };
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
    await connectClassroom(workspaceDir, updated.classroom!.url);
    return updated;
  });
}

/**
 * A classroom from before moodle-teacher (no `connector`): asked once whether to move it there.
 * Yes installs or extends moodle-teacher with its site and drops the saved username and password
 * (it signs in through its own window); no keeps the browser and isn't asked again. Without a
 * terminal, or if installing fails, nothing is saved and it's asked next time.
 */
export async function promptMigrateClassroom(workspaceDir: string, config: WorkspaceConfig): Promise<WorkspaceConfig> {
  const classroom = config.classroom;
  if (!classroom || classroom.connector) return config;
  console.log(ui.warn(t().migrateClassroomIntro));
  try {
    const yes = await ask<boolean>({ type: "confirm", name: "migrate", message: t().migrateClassroomQuestion, default: true });
    if (!yes) {
      const kept: WorkspaceConfig = { ...config, classroom: { ...classroom, connector: "browser" } };
      await writeWorkspaceConfig(workspaceDir, kept);
      console.log(ui.dim(t().keptBrowser));
      return kept;
    }
  } catch (error) {
    if (!isExitPromptError(error)) throw error;
    return config;
  }
  try {
    console.log(ui.dim(t().connectingMoodleTeacher));
    await connectMoodleTeacher(workspaceDir, classroom.url);
  } catch (error) {
    console.log(ui.warn(`${error instanceof Error ? error.message : String(error)} ${t().moodleTeacherRetry}`));
    return config;
  }
  const rest = { ...classroom, connector: "moodle-teacher" as const };
  delete rest.username;
  delete rest.password;
  const migrated: WorkspaceConfig = { ...config, classroom: rest };
  await writeWorkspaceConfig(workspaceDir, migrated);
  console.log(ui.success(t().migratedClassroom));
  return migrated;
}

/** Asked right after "init": probing the Moodle's activity/question types is what the
 * authoring skills check before creating anything. */
export function promptExploreNow(): Promise<boolean> {
  return exitOnCancel(() => ask<boolean>({ type: "confirm", name: "explore", message: t().exploreNow, default: true }));
}

/**
 * Which workspace to open when the command names none and the current directory isn't one: the
 * registered ones, last opened first, and "new". Undefined for a new one (also when there are none).
 */
export function promptPickWorkspace(workspaces: ListedWorkspace[]): Promise<string | undefined> {
  const present = workspaces.filter((ws) => !ws.missing);
  if (present.length === 0) return Promise.resolve(undefined);
  return exitOnCancel(async () => {
    const dir = await ask<string>({
      type: "select",
      name: "workspace",
      message: t().whichWorkspace,
      choices: [...present.map((ws) => ({ name: ws.name, value: ws.dir })), { name: t().newWorkspaceChoice, value: "" }],
    });
    return dir || undefined;
  });
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
