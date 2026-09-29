#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isExitPromptError, ui } from "@falkenslab/agent-kit";
import { resolveWorkspaceDir, runSession } from "./agent.js";
import { listCommands, listSkills, type CatalogEntry } from "./catalog.js";
import { globalConfigPath } from "./globalConfig.js";
import { promptExploreNow, promptInitWorkspace, promptRunKind } from "./menu.js";
import { workspaceExists } from "./workspace.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function printHelp(): void {
  console.log(`teacher-agent [<comando>] [opciones]

Comandos:
  init [--dir <ruta>]
      Crea un workspace nuevo en el directorio indicado (o en el actual) y ofrece
      explorar a continuación qué admite ese Moodle.
  run [--dir <ruta>] [--mode interactive|guided|autonomous] [--headless] [--task "<texto>"]
      Gestiona el curso de una sentada: corrige entregas pendientes, atiende el foro,
      revisa o añade contenido y resume el progreso de la clase. Sin --mode, pregunta
      el modo. Con --task hace solo esa tarea (p. ej. --task "construye un curso de
      introducción a Docker de 3 temas" o --task "corrige la Tarea 2").
  chat [--dir <ruta>] [--headless] [--inline] [--plain] [--continue]
      Sesión conversacional a pantalla completa. Empieza en modo guided y Shift+Tab lo
      alterna con interactive. --inline deja la conversación en el historial de la
      terminal y --plain usa el chat de texto simple. --continue retoma la última
      conversación de este curso, y /resume, dentro del chat, deja elegir otra.
  explore [--dir <ruta>] [--headless]
      Mira (sin crear nada) qué tipos de actividad y de pregunta admite este Moodle y lo
      apunta en knowledge/moodle-capabilities.md.
  ingest [--dir <ruta>] [ficheros...]
      Incorpora a la base de conocimiento (knowledge/) los ficheros indicados o, sin
      ninguno, todo lo de sources/ que aún no esté en ella. Sin navegador ni
      Moodle.
  skills [--dir <ruta>]
      Lista las habilidades disponibles: las incorporadas y las propias del workspace
      (<workspace>/.claude/skills/).
  commands [--dir <ruta>]
      Lista los comandos de barra que se pueden usar dentro de "chat".

Opciones:
  -h, --help           Muestra esta ayuda.
  -v, --version        Muestra la versión instalada.
  --language=<código>  Idioma de la barra de estado, los paneles y los atajos del chat:
                       es, en, fr o de (por defecto, el de "agent.language" del
                       workspace, o español).

Cada workspace es un directorio (el actual, o el indicado con --dir) con su propio
config.json, como un repositorio git. Sin argumentos, teacher-agent pregunta si quieres
"run" o "chat" y usa el directorio actual; si todavía no es un workspace, lo configura
y termina (vuelve a lanzarlo para empezar). --headless (necesita credenciales guardadas)
y el idioma preferido también se pueden fijar de forma persistente: en el config.json
del workspace ("agent.headless", "agent.language") o, para todos, en
${globalConfigPath()} ("defaultHeadless", "defaultLanguage"). Ver README.md para más
detalle.`);
}

async function installedVersion(): Promise<string> {
  const raw = await readFile(path.join(__dirname, "..", "package.json"), "utf-8");
  return (JSON.parse(raw) as { version: string }).version;
}

async function initCommand(args: string[]): Promise<void> {
  const workspaceDir = resolveWorkspaceDir(args);
  if (await workspaceExists(workspaceDir)) {
    throw new Error(`${workspaceDir} ya es un workspace de teacher-agent (config.json existe). Elige otro directorio.`);
  }
  await promptInitWorkspace(workspaceDir);
  if (!(await promptExploreNow())) return;

  // The workspace already exists at this point: a failed exploration (wrong URL or
  // credentials) shouldn't make "init" itself look failed.
  try {
    await runSession("explore", ["--dir", workspaceDir]);
  } catch (error) {
    if (isExitPromptError(error)) throw error;
    console.log(ui.warn(
      `No se pudo explorar el Moodle (${error instanceof Error ? error.message : String(error)}). ` +
        'El workspace está creado; puedes reintentarlo con "teacher-agent explore".',
    ));
  }
}

function printCatalog(title: string, entries: CatalogEntry[]): void {
  console.log(ui.heading(title));
  for (const entry of entries) {
    const origin = ui.dim(entry.origin === "builtin" ? "[incorporada]" : "[propia]");
    const description = entry.description ? ` — ${entry.description}` : "";
    console.log(`- ${entry.name} ${origin}${description}`);
  }
}

async function skillsCommand(args: string[]): Promise<void> {
  const workspaceDir = resolveWorkspaceDir(args);
  printCatalog(`Habilidades disponibles en ${workspaceDir}`, await listSkills(workspaceDir));
}

async function commandsCommand(args: string[]): Promise<void> {
  const workspaceDir = resolveWorkspaceDir(args);
  printCatalog(`Comandos disponibles en ${workspaceDir} (dentro de "chat")`, await listCommands(workspaceDir));
}

async function main(): Promise<void> {
  const [first, ...rest] = process.argv.slice(2);

  switch (first) {
    case "-h":
    case "--help":
      return printHelp();
    case "-v":
    case "--version":
      return console.log(await installedVersion());
    case "init":
      return initCommand(rest);
    case "run":
    case "chat":
    case "ingest":
    case "explore":
      return runSession(first, rest);
    case "skills":
      return skillsCommand(rest);
    case "commands":
      return commandsCommand(rest);
    case undefined:
      return runSession(await promptRunKind(), []);
    default:
      // Flags without a subcommand ("teacher-agent --mode guided") are taken as "run" flags.
      if (first.startsWith("-")) return runSession("run", process.argv.slice(2));
      console.error(ui.error(`Comando desconocido "${first}". Usa teacher-agent --help.`));
      process.exitCode = 1;
  }
}

main().catch((error) => {
  if (isExitPromptError(error)) process.exit(0);
  console.error(ui.error(`teacher-agent: ${error instanceof Error ? error.message : String(error)}`));
  process.exitCode = 1;
});
