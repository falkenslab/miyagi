import { inOven } from "../activityRegister.js";
import type { Messages } from "./en.js";

export const es: Messages = {
  help: (globalConfigPath) => `miyagi [<comando>] [opciones]

Comandos:
  init [--dir <ruta>]
      Crea una asignatura nueva en la carpeta de miyagi (~/.miyagi/workspaces/<nombre>/)
      o, con --dir, en ese directorio, y ofrece explorar su Moodle si conecta uno.
  run [--dir <ruta>] [--mode interactive|guided|autonomous] [--plain] [--task "<texto>"]
      Gestiona el curso de una sentada: corrige entregas pendientes, atiende el foro,
      revisa o añade contenido y resume el progreso de la clase. Sin --mode, pregunta
      el modo. Con --task hace solo esa tarea (p. ej. --task "construye un curso de
      introducción a Docker de 3 temas" o --task "corrige la Tarea 2").
  chat [--dir <ruta>] [--inline] [--plain] [--continue]
      Sesión conversacional a pantalla completa. Empieza en modo guided y Shift+Tab lo
      alterna con interactive. --inline deja la conversación en el historial de la
      terminal y --plain usa el chat de texto simple. --continue retoma la última
      conversación de este curso, y /resume, dentro del chat, deja elegir otra.
  explore [--dir <ruta>] [--plain]
      Mira (sin crear nada) qué tipos de actividad y de pregunta admite este Moodle y lo
      apunta en la página course/moodle-capabilities.
  ingest [--dir <ruta>] [--plain] [ficheros...]
      Incorpora a la base de conocimiento (knowledge/) los ficheros indicados o, sin
      ninguno, todo lo de sources/ que aún no esté en ella. Sin navegador ni
      Moodle.
  skills [--dir <ruta>]
      Lista las habilidades disponibles: las incorporadas y las propias del workspace
      (<workspace>/.claude/skills/).
  commands [--dir <ruta>]
      Lista los comandos de barra que se pueden usar dentro de "chat".
  extension <list|info|add|remove|enable|disable|config|update|search|marketplace> [--dir <ruta>] [--project]
      Instala y gestiona extensiones, del repositorio oficial de Falken's Lab o de uno que
      añadas: para todas las asignaturas (~/.miyagi/extensions) o, con --project, solo para esta.
      "miyagi extension" a secas explica cada subcomando.
  web [--dir <ruta>] [--port <n>]
      El chat de una asignatura en tu navegador, solo en este ordenador. Muestra la
      dirección, con su llave: ábrela en tu navegador y no la compartas. Ctrl+C lo cierra.
  workspaces [forget <nombre>]
      Lista tus asignaturas con su carpeta; forget quita una de la lista (su carpeta
      se queda).

Opciones:
  -h, --help           Muestra esta ayuda.
  -v, --version        Muestra la versión instalada.
  -w, --workspace <nombre>  Abre esa asignatura por su nombre, desde cualquier carpeta.
  --language=<código>  Idioma de los textos de miyagi y del chat: es, en, fr o de
                       (por defecto, el de "agent.language" del workspace, o el del
                       sistema).

Cada asignatura (un workspace) es una carpeta con su propio config.json. Las nuevas se
guardan en ~/.miyagi/workspaces/<nombre>/ y todas quedan apuntadas en
~/.miyagi/workspaces.json, así que -w <nombre> la abre desde cualquier sitio; --dir <ruta>
sigue funcionando, y dentro de la carpeta de una asignatura miyagi usa esa. Sin
argumentos, miyagi pregunta si quieres "run" o "chat" y con qué asignatura (o una nueva).
El idioma preferido también se puede fijar de forma persistente: en el config.json de
la asignatura ("agent.language") o, para todas, en ${globalConfigPath}
("defaultLanguage"). Ver README.md para más detalle.`,
  alreadyWorkspace: (dir) => `${dir} ya es una asignatura de miyagi (config.json existe). Elige otro directorio.`,
  exploreFailed: (reason) => `No se pudo explorar el Moodle (${reason}). La asignatura está creada; puedes reintentarlo con "miyagi explore".`,
  catalogBuiltin: "[incorporada]",
  catalogCustom: "[propia]",
  catalogExtension: (name) => `[${name}]`,
  skillsTitle: (dir) => `Habilidades disponibles en ${dir}`,
  commandsTitle: (dir) => `Comandos disponibles en ${dir} (dentro de "chat")`,
  unknownCommand: (command) => `Comando desconocido "${command}". Usa miyagi --help.`,

  initHeading: (dir) => `\n=== Preparando la asignatura en ${dir} ===`,
  initHeadingNew: "\n=== Nueva asignatura ===",
  whichWorkspace: "¿Con qué asignatura?",
  newWorkspaceChoice: "Nueva asignatura…",
  workspacesTitle: "Tus asignaturas",
  workspacesEmpty: "Aún no tienes asignaturas. \"miyagi init\" crea una.",
  missingTag: "[carpeta no encontrada]",
  kindName: () => "asignatura",
  workspaceForgotten: (name, dir) => `"${name}" ya no está en la lista. Su carpeta sigue intacta: ${dir}`,
  workspaceNotFound: (query, ids) => `No hay ninguna asignatura "${query}". ${ids ? `Las tuyas: ${ids}` : "Aún no tienes ninguna"} ("miyagi workspaces" las lista).`,
  workspaceFolderMissing: (name, dir, id) => `La carpeta de "${name}" ya no está (${dir}). Vuelve a ponerla en su sitio, o quítala de la lista con "miyagi workspaces forget ${id}".`,
  noWorkspaceHere: (ids) => (ids ? `Aquí no hay ninguna asignatura. Abre una con -w <nombre> (${ids}) o crea una con "miyagi init".` : 'Aún no tienes ninguna asignatura: crea una con "miyagi init".'),
  forgetUsage: "¿Cuál? miyagi workspaces forget <nombre>",
  required: "Obligatorio",
  moodleUrl: "URL de Moodle (o pega la URL completa del curso, p. ej. https://moodle.miuniversidad.es/course/view.php?id=4):",
  courseId: "ID del curso:",
  description: "Descripción (opcional):",
  persona: "Tono de voz del agente (foros, retroalimentación, avisos):",
  personaNone: "Sin preferencia (tono neutro)",
  personaFormal: "Formal",
  personaWarm: "Cercano",
  personaMotivating: "Cercano y motivador",
  conversationLanguage: "Idioma en el que prefieres hablar con el agente (en blanco, sin preferencia: te responderá en el idioma que uses):",
  createInstructions: "¿Crear instructions.md para añadir tus propias instrucciones al agente? (opcional, puedes hacerlo después a mano)",
  workspaceCreated: (dir) => `Asignatura creada en ${dir}\n`,
  exploreNow:
    "¿Explorar ahora qué tipos de actividad y de pregunta admite este Moodle? (inicia sesión y solo mira, sin crear " +
    'nada; también puedes hacerlo luego con "miyagi explore")',
  whatToDo: "¿Qué quieres hacer?",
  kindRun: "Gestionar el curso de una sentada (run)",
  kindChat: "Conversar con el agente (chat)",
  whichMode: "¿En qué modo quieres ejecutarlo?",
  modeInteractive: "interactive — pausa antes de cada acción",
  modeGuided: "guided — solo pausa antes de publicar algo visible para los estudiantes",
  modeAutonomous: "autonomous — sin pausas",

  studentRole: (dir) => `${dir} es un aula con rol "student": miyagi solo actúa como profesor.`,
  draftsLimitsInvalid: (dir, key, valid) => `${dir}/config.json: agent.draftsLimits.${key} tiene que ser un número positivo, y uno de: ${valid}.`,

  unknownMode: (value, valid) => `Modo desconocido "${value}". Usa uno de: ${valid}.`,
  notAWorkspace: (dir) => `${dir} no es una asignatura de miyagi (falta config.json). Ejecuta "miyagi init", o abre una con -w <nombre>.`,
  contextMoved: (count, sourcesDir) => `context/ ya no se usa: sus ${count} ficheros se han movido a ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ tenía la estructura antigua: se ha movido a ${legacyDir} (sus ficheros descargados, a ${sourcesDir}) y el agente reconstruirá la base de conocimiento a partir de ahí.\n`,
  setupSaved: (command) => `Configuración guardada. Cuando quieras empezar: ${command}`,
  headingIngest: "Ingesta en la base de conocimiento (sin navegador)",
  headingExplore: "Explorando las capacidades de este Moodle",
  headingMode: (mode, chat) => `Modo: ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Asignatura: ${label} (${dir})`,
  headingSession: (dir) => `Sesión: ${dir}`,
  headingCourse: (url, courseId) => `Curso: ${url} (id ${courseId})\n`,
  headerWorkspace: "asignatura",
  headerCourse: "curso",
  headerClassroom: "aula",
  noClassroom: "sin aula",
  connectMoodleNow: "¿Conectar un aula Moodle ahora? miyagi instala la extensión moodle-teacher e inicias sesión en Moodle en su ventana; sin aula te ayuda con la programación y los materiales, y puedes conectarla después con \"miyagi init -w <nombre>\"",
  connectingMoodleTeacher: "Conectando el aula con moodle-teacher…",
  moodleTeacherConnected: "Aula conectada: moodle-teacher está instalada con tu sitio. La primera vez que necesite entrar en Moodle se abrirá una ventana para que inicies sesión.",
  moodleTeacherRetry: "La asignatura está guardada: vuelve a intentarlo con \"miyagi init -w <nombre>\" o \"miyagi extension add moodle-teacher\".",
  webListening: (label) => `miyagi está abierto en el navegador para ${label}. Abre esta dirección:`,
  webKeepPrivate: "Quien tenga esta dirección puede usar miyagi con tu cuenta: no la compartas. Ctrl+C lo cierra.",
  moodleCourseNotAdded: (reason) => `No se ha podido limitar moodle-teacher al curso de esta asignatura (${reason}); la sesión sigue, y miyagi no sale de él igualmente.`,
  moodleTeacherInstallFailed: "No se pudo instalar o configurar moodle-teacher.",
  claudeTokenForgotten: "miyagi ya no guarda tu token de Claude: las condiciones de Anthropic no lo permiten. Inicia sesión una vez con tu cuenta de Claude (o usa una clave de API) y Claude Code guardará tu sesión.",
  migrateClassroomIntro: "miyagi trabaja ahora en Moodle solo con la extensión moodle-teacher: herramientas fijas en lugar de ir haciendo clic, y entras con tu sesión en su propia ventana en lugar de con una contraseña guardada. El aula de esta asignatura usa todavía el sistema anterior, que ya no existe.",
  migrateClassroomQuestion: "¿Pasar ahora esta aula a moodle-teacher? (se borran del config.json el usuario y la contraseña guardados; si no, esta sesión trabaja sin el aula)",
  migratedClassroom: "Aula pasada a moodle-teacher.",
  examName: "Nombre",
  examVersion: "Versión",
  examKey: "Hoja de respuestas",
  examPoints: (n) => (n === 1 ? "1 punto" : `${n} puntos`),
  examTrueFalse: ["Verdadero", "Falso"],
  exportLosses: "Lo que el formato del aula deja fuera (decide antes de aprobar):",
  lossPoints: (questions) => `la importación da 1 punto a cada pregunta: el cuestionario tiene que poner la nota de ${questions}`,
  rubricCriterion: "Criterio",
  rubricLevels: "Niveles",
  sheetStudent: "Alumno",
  sheetFinal: "Nota final",
  styleLabels: { copy: "Selecciona y copia", statement: "Enunciado", question: "Pregunta", feedback: "Retroalimentación", code: "Código" },
  moodleTeacherMissing: "El aula de esta asignatura funciona con moodle-teacher, que no está instalada o está desactivada: esta sesión trabaja sin el aula. Lo arregla \"miyagi extension add moodle-teacher\" (o \"enable\").",
  classroomNeedsMoving: "El aula de esta asignatura es de antes de moodle-teacher, y miyagi ya no tiene navegador propio: esta sesión trabaja sin el aula. Ábrela en un chat para pasarla, o ejecuta \"miyagi init -w <nombre>\".",
  exploreNeedsClassroom: (dir) => `${dir} no tiene ningún aula conectada: no hay Moodle que explorar. Conéctala con "miyagi init --dir ${dir}".`,
  classroomIncomplete: (dir) => `El aula de ${dir}/config.json necesita "url" y "courseId".`,
  workspaceName: "Nombre de la asignatura:",
  welcomePlain: "miyagi está listo. Esc interrumpe la respuesta en curso; /resume retoma una conversación anterior; /exit o Ctrl+C (sin respuesta en curso) cierran la sesión.",
  welcomeInk: "miyagi está listo. Shift+Tab alterna entre guided e interactive, /resume retoma una conversación anterior, ? muestra los atajos y /exit cierra la sesión.",
  promptLabel: "tú>",
  exitingNow: "Saliendo sin esperar. Lo registrado hasta ahora ya está guardado en disco.",
  interrupting: "Interrumpiendo y cerrando la sesión… (Ctrl+C otra vez para salir sin esperar)",
  sessionInterrupted: "Sesión interrumpida.",
  sessionClosed: "Sesión cerrada.",
  nothingPending: "No hay nada pendiente de guardar: todo se escribe en disco sobre la marcha.",
  endTranscript: (path) => `  - Acciones del agente y sus resultados: ${path}`,
  endConversation: (path) => `  - La conversación, en texto plano: ${path}`,
  endKnowledge: (path) => `  - Lo que el agente ha aprendido: ${path}`,
  endInProgress: (counts, path) => `En el horno: ${inOven(counts, { planning: "en plan", building: "cocinándose", hidden: "probándose oculto", served: "recién servido" })} (${path})`,
  endInterruptedNote:
    "Lo que estaba haciendo al interrumpir puede haber quedado a medias (una nota sin guardar, una respuesta sin publicar); en la próxima sesión puedes pedirle que lo retome.",



  toolPhrases: {
    approval: ["pidió aprobación", "pidió aprobación {n} veces"],
    download: ["descargó {n} fichero", "descargó {n} ficheros"],
    files: ["trabajó con ficheros", "trabajó con ficheros {n} veces"],
    pdf: ["generó {n} PDF", "generó {n} PDF"],
  },

  tool: {
    drafts: {
      list: (p) => `Mirando ${p} en drafts/`,
      mkdir: (p) => `Creando la carpeta ${p}`,
      copy: (from, to) => `Copiando ${from} a ${to}`,
      move: (from, to) => `Moviendo ${from} a ${to}`,
      del: (p) => `Borrando ${p}`,
      download: (url) => `Descargando ${url}`,
      fetchSite: (url) => `Guardando el sitio ${url}`,
      unzip: (archive) => `Descomprimiendo ${archive}`,
      zip: (to) => `Empaquetando ${to}`,
      pdf: (to) => `Generando el PDF ${to}`,
      info: (p) => `Revisando el fichero ${p}`,
    },
    materials: {
      list: "Mirando los materiales",
      validate: (p) => `Comprobando ${p}`,
      export: (p) => `Exportando ${p} al formato del aula`,
      import: (from, to) => `Importando ${from} como ${to}`,
      exam: (p) => `Imprimiendo el examen de ${p}`,
      record: (p) => `Anotando que ${p} está publicado`,
      status: "Mirando qué está publicado",
      resolve: (p) => `Calculando las fechas de ${p}`,
      style: "Mirando el estilo de los materiales",
      coverage: "Contando las preguntas del banco por criterio y nivel",
      aggregate: "Quedándose solo con los totales de la encuesta",
    },
  },
};
