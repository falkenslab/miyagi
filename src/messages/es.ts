import type { Messages } from "./en.js";

export const es: Messages = {
  help: (globalConfigPath) => `teacher-agent [<comando>] [opciones]

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
  --language=<código>  Idioma de los textos de teacher-agent y del chat: es, en, fr o de
                       (por defecto, el de "agent.language" del workspace, o el del
                       sistema).

Cada workspace es un directorio (el actual, o el indicado con --dir) con su propio
config.json, como un repositorio git. Sin argumentos, teacher-agent pregunta si quieres
"run" o "chat" y usa el directorio actual; si todavía no es un workspace, lo configura
y termina (vuelve a lanzarlo para empezar). --headless (necesita credenciales guardadas)
y el idioma preferido también se pueden fijar de forma persistente: en el config.json
del workspace ("agent.headless", "agent.language") o, para todos, en
${globalConfigPath} ("defaultHeadless", "defaultLanguage"). Ver README.md para más
detalle.`,
  alreadyWorkspace: (dir) => `${dir} ya es un workspace de teacher-agent (config.json existe). Elige otro directorio.`,
  exploreFailed: (reason) => `No se pudo explorar el Moodle (${reason}). El workspace está creado; puedes reintentarlo con "teacher-agent explore".`,
  catalogBuiltin: "[incorporada]",
  catalogCustom: "[propia]",
  skillsTitle: (dir) => `Habilidades disponibles en ${dir}`,
  commandsTitle: (dir) => `Comandos disponibles en ${dir} (dentro de "chat")`,
  unknownCommand: (command) => `Comando desconocido "${command}". Usa teacher-agent --help.`,

  initHeading: (dir) => `\n=== Inicializando workspace en ${dir} ===`,
  required: "Obligatorio",
  moodleUrl: "URL de Moodle (o pega la URL completa del curso, p. ej. https://moodle.miuniversidad.es/course/view.php?id=4):",
  urlParsed: (url, courseId) => `  → URL: ${url} · curso: ${courseId}`,
  courseId: "ID del curso:",
  username: "Usuario con rol de profesor (déjalo en blanco para iniciar sesión a mano):",
  password: "Contraseña:",
  label: "Etiqueta:",
  description: "Descripción (opcional):",
  persona: "Tono de voz del agente (foros, retroalimentación, avisos):",
  personaNone: "Sin preferencia (tono neutro)",
  personaFormal: "Formal",
  personaWarm: "Cercano",
  personaMotivating: "Cercano y motivador",
  conversationLanguage: "Idioma en el que prefieres hablar con el agente (en blanco, sin preferencia: te responderá en el idioma que uses):",
  practiceRunnerQuestion:
    "¿Permitir que el agente pruebe actividades prácticas en contenedores Docker (por ejemplo, comprobar que un " +
    "enunciado funciona antes de publicarlo, o ejecutar una entrega al corregirla)? Trabaja solo en la carpeta " +
    "practice/ del workspace y solo con Docker; nunca instala nada: si Docker no está instalado, te lo dice.",
  practiceRunnerNote:
    "Nota: este workspace todavía no ha configurado una capacidad opcional — probar las actividades prácticas (un " +
    "Dockerfile, un script, el código de una entrega) en contenedores Docker, antes de publicarlas o al corregirlas. " +
    'Desactivada por defecto; cámbiala a mano en config.json ("agent.allowPracticeRunner": true/false) o responde a la pregunta de abajo.',
  createInstructions: "¿Crear instructions.md para añadir tus propias instrucciones al agente? (opcional, puedes hacerlo después a mano)",
  workspaceCreated: (dir) => `Workspace creado en ${dir}\n`,
  exploreNow:
    "¿Explorar ahora qué tipos de actividad y de pregunta admite este Moodle? (inicia sesión y solo mira, sin crear " +
    'nada; también puedes hacerlo luego con "teacher-agent explore")',
  whatToDo: "¿Qué quieres hacer?",
  kindRun: "Gestionar el curso de una sentada (run)",
  kindChat: "Conversar con el agente (chat)",
  whichMode: "¿En qué modo quieres ejecutarlo?",
  modeInteractive: "interactive — pausa antes de cada acción",
  modeGuided: "guided — solo pausa antes de publicar algo visible para los estudiantes",
  modeAutonomous: "autonomous — sin pausas",

  studentRole: (dir) => `${dir} es un aula con rol "student": teacher-agent solo actúa como profesor.`,
  defaultLabel: (host, courseId) => `${host} · curso ${courseId}`,

  unknownMode: (value, valid) => `Modo desconocido "${value}". Usa uno de: ${valid}.`,
  notAWorkspace: (dir) => `${dir} no es un workspace de teacher-agent (falta config.json). Ejecuta "teacher-agent init" ahí, o pasa --dir con un workspace existente.`,
  contextMoved: (count, sourcesDir) => `context/ ya no se usa: sus ${count} ficheros se han movido a ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ tenía la estructura antigua: se ha movido a ${legacyDir} (sus ficheros descargados, a ${sourcesDir}) y el agente reconstruirá la base de conocimiento a partir de ahí.\n`,
  setupSaved: (kind, dir) => `Configuración guardada. Cuando quieras empezar: teacher-agent ${kind} --dir "${dir}"`,
  autonomousNeedsCredentials:
    "El modo autonomous no admite login manual (no hay forma de pedir ayuda a un humano): guarda usuario y contraseña en config.json, o usa --mode guided/interactive.",
  headlessNeedsCredentials:
    "--headless necesita credenciales guardadas (no hay ventana visible para iniciar sesión a mano): guarda usuario y contraseña en config.json, o quita --headless.",
  headingIngest: "Ingesta en la base de conocimiento (sin navegador)",
  headingExplore: "Explorando las capacidades de este Moodle",
  headingMode: (mode, chat) => `Modo: ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Workspace: ${label} (${dir})`,
  headingSession: (dir) => `Sesión: ${dir}`,
  headingCourse: (url, courseId) => `Curso: ${url} (id ${courseId})\n`,
  headerWorkspace: "workspace",
  headerCourse: "curso",
  welcomePlain: "teacher-agent conectando con Moodle. Esc interrumpe la respuesta en curso; /resume retoma una conversación anterior; /exit o Ctrl+C (sin respuesta en curso) cierran la sesión.",
  welcomeInk: "teacher-agent conectando con Moodle. Shift+Tab alterna entre guided e interactive, /resume retoma una conversación anterior, ? muestra los atajos y /exit cierra la sesión.",
  promptLabel: "tú>",
  exitingNow: "Saliendo sin esperar. Lo registrado hasta ahora ya está guardado en disco.",
  interrupting: "Interrumpiendo y cerrando la sesión… (Ctrl+C otra vez para salir sin esperar)",
  sessionInterrupted: "Sesión interrumpida.",
  sessionClosed: "Sesión cerrada.",
  nothingPending: "No hay nada pendiente de guardar: todo se escribe en disco sobre la marcha.",
  endTranscript: (path) => `  - Acciones del agente y sus resultados: ${path}`,
  endConversation: (path) => `  - La conversación, en texto plano: ${path}`,
  endKnowledge: (path) => `  - Lo que el agente ha aprendido: ${path}`,
  endDrafts: (path) => `Hay recursos subidos ocultos a Moodle, aún sin mostrar a los alumnos: ${path}`,
  endInterruptedNote:
    "Lo que estaba haciendo al interrumpir puede haber quedado a medias (una nota sin guardar, una respuesta sin publicar); en la próxima sesión puedes pedirle que lo retome.",

  gateTitle: "Publicación sin aprobación previa",
  gateLine: "El agente va a publicar o cambiar algo en Moodle que pueden ver los alumnos, sin haberte pedido aprobación antes.",

  manualLoginTitle: "Hace falta iniciar sesión a mano",
  manualLoginLines: ["Este workspace no tiene credenciales guardadas.", "Inicia sesión a mano en la ventana del navegador que ya está abierta."],
  manualLoginQuestion: "Pulsa Intro cuando hayas iniciado sesión (o 'q' para cancelar): ",

  tool: {
    navigate: (url) => `Abriendo ${url}`,
    aPage: "una página",
    back: "Volviendo a la página anterior",
    forward: "Avanzando a la página siguiente",
    snapshot: "Leyendo la estructura de la página",
    click: (element) => `Pulsando «${element}»`,
    hover: (element) => `Pasando el ratón por «${element}»`,
    drag: (from, to) => `Arrastrando «${from}» a «${to}»`,
    select: (values, element) => `Eligiendo «${values}» en «${element}»`,
    type: (text, element) => `Escribiendo «${text}» en «${element}»`,
    anElement: "un elemento",
    anotherElement: "otro elemento",
    aDropdown: "un desplegable",
    aField: "un campo",
    pressKey: (key) => `Pulsando la tecla «${key}»`,
    waitFor: (text) => `Esperando a que aparezca «${text}»`,
    waitGone: (text) => `Esperando a que desaparezca «${text}»`,
    waitSeconds: (seconds) => `Esperando ${seconds} s`,
    wait: "Esperando",
    findText: (text) => `Buscando «${text}» en la página`,
    findPattern: (pattern) => `Buscando el patrón «${pattern}» en la página`,
    find: "Buscando en la página",
    fillForm: (fields) => `Rellenando un formulario (${fields} campo${fields === 1 ? "" : "s"})`,
    upload: "Subiendo ficheros",
    evaluate: (code) => `Ejecutando JavaScript: ${code}`,
    inspect: "Inspeccionando la página con JavaScript",
    screenshot: "Haciendo una captura",
    tabs: "Gestionando las pestañas",
    resize: "Cambiando el tamaño de la ventana",
    close: "Cerrando el navegador",
    console: "Revisando la consola del navegador",
    networkRequests: "Revisando las peticiones de red",
    saveResponse: "Guardando en disco la respuesta de una petición",
    requestDetails: "Leyendo los detalles de una petición",
    startVideo: "Empezando a grabar vídeo",
    stopVideo: "Dejando de grabar vídeo",
    runCodeUnsafe: "Intentando ejecutar código sin restricciones (bloqueado)",
    acceptDialog: "Aceptando un diálogo del navegador",
    dismissDialog: "Descartando un diálogo del navegador",
  },
};
