import { confirm, input, password, select } from "@inquirer/prompts";
import { isExitPromptError, ui, type Mode } from "@falkenslab/agent-kit";
import {
  createWorkspace,
  defaultWorkspaceLabel,
  writeInstructionsTemplate,
  type AgentPersona,
  type WorkspaceConfig,
} from "./workspace.js";

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

/** Runs `fn`, exiting cleanly instead of throwing when the user hits Ctrl+C on a prompt. */
async function exitOnCancel<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isExitPromptError(error)) process.exit(0);
    throw error;
  }
}

/**
 * Asks for a new workspace's data and creates it in `workspaceDir` (config.json, sources/,
 * knowledge/, .gitignore and, optionally, instructions.md). Used by `teacher-agent init`
 * and by run/chat when the directory isn't a workspace yet.
 */
export function promptInitWorkspace(workspaceDir: string): Promise<WorkspaceConfig> {
  return exitOnCancel(async () => {
    console.log(ui.heading(`\n=== Inicializando workspace en ${workspaceDir} ===`));
    const required = (v: string) => v.trim() !== "" || "Obligatorio";

    const parsedUrl = parseCourseUrl(await input({
      message: "URL de Moodle (o pega la URL completa del curso, " +
        "p. ej. https://moodle.miuniversidad.es/course/view.php?id=4):",
      validate: required,
    }));
    const url = parsedUrl.url;
    let courseId = parsedUrl.courseId;
    if (courseId) {
      console.log(ui.dim(`  → URL: ${url} · curso: ${courseId}`));
    } else {
      courseId = await input({ message: "ID del curso:", validate: required });
    }

    const username = await input({ message: "Usuario con rol de profesor (déjalo en blanco para iniciar sesión a mano):" });
    const pass = username ? await password({ message: "Contraseña:", mask: "*" }) : "";
    const label = await input({ message: "Etiqueta:", default: defaultWorkspaceLabel(url, courseId) });
    const description = await input({ message: "Descripción (opcional):" });
    const persona = await select<AgentPersona | undefined>({
      message: "Tono de voz del agente (foros, retroalimentación, avisos):",
      default: undefined,
      choices: [
        { name: "Sin preferencia (tono neutro)", value: undefined },
        { name: "Formal", value: "formal" },
        { name: "Cercano", value: "warm" },
        { name: "Cercano y motivador", value: "motivating" },
      ],
    });
    const language = await input({
      message: "Idioma en el que prefieres hablar con el agente (en blanco, sin preferencia: " +
        "te responderá en el idioma que uses):",
    });

    const config: WorkspaceConfig = {
      classroom: {
        label,
        ...(description ? { description } : {}),
        url,
        courseId,
        ...(username ? { username, password: pass } : {}),
      },
      agent: {
        role: "teacher",
        ...(persona ? { persona } : {}),
        ...(language ? { language } : {}),
      },
    };
    await createWorkspace(workspaceDir, config);

    const wantsInstructions = await confirm({
      message: "¿Crear instructions.md para añadir tus propias instrucciones al agente? " +
        "(opcional, puedes hacerlo después a mano)",
      default: false,
    });
    if (wantsInstructions) await writeInstructionsTemplate(workspaceDir);

    console.log(ui.success(`Workspace creado en ${workspaceDir}\n`));
    return config;
  });
}

/** Asked right after "init": probing the Moodle's activity/question types is what the
 * authoring skills check before creating anything. */
export function promptExploreNow(): Promise<boolean> {
  return exitOnCancel(() => confirm({
    message: "¿Explorar ahora qué tipos de actividad y de pregunta admite este Moodle? " +
      "(inicia sesión y solo mira, sin crear nada; también puedes hacerlo luego con " +
      '"teacher-agent explore")',
    default: true,
  }));
}

/** Only used by "teacher-agent" with no subcommand. */
export function promptRunKind(): Promise<"run" | "chat"> {
  return exitOnCancel(() => select<"run" | "chat">({
    message: "¿Qué quieres hacer?",
    choices: [
      { name: "Gestionar el curso de una sentada (run)", value: "run" },
      { name: "Conversar con el agente (chat)", value: "chat" },
    ],
  }));
}

/** Only used by "run" without --mode (chat is always guided). */
export function promptMode(): Promise<Mode> {
  return exitOnCancel(() => select<Mode>({
    message: "¿En qué modo quieres ejecutarlo?",
    choices: [
      { name: "interactive — pausa antes de cada acción", value: "interactive" },
      { name: "guided — solo pausa antes de publicar algo visible para los estudiantes", value: "guided" },
      { name: "autonomous — sin pausas", value: "autonomous" },
    ],
    default: "guided",
  }));
}
