// The page's texts, in the languages miyagi speaks. Every language has every key: the type
// makes a missing one a build error. The language is the host's (info.language).

export interface Texts {
  connecting: string;
  lost: string;
  replaced: string;
  signInTitle: string;
  signInText: string;
  signInAccount: string;
  signInWaiting: string;
  signInOpen: string;
  signInCode: string;
  signInCodeSend: string;
  signInFailed: string;
  signInPrivacy: string;
  apiKeyUse: string;
  apiKeyHelp: string;
  tokenForgotten: string;
  keyPlaceholder: string;
  keySave: string;
  keyInvalid: string;
  placeholder: string;
  placeholderBusy: string;
  send: string;
  stop: string;
  attach: string;
  attached: (name: string) => string;
  duplicate: (name: string) => string;
  attachFailed: (name: string, why: string) => string;
  modes: Record<"guided" | "interactive" | "autonomous" | "plan", { name: string; help: string }>;
  modeTitle: string;
  approve: string;
  reject: string;
  stopAll: string;
  done: string;
  answer: string;
  other: string;
  cancel: string;
  formSend: string;
  formDecline: string;
  formMissing: (field: string) => string;
  conversations: string;
  newConversation: string;
  collapseSidebar: string;
  expandSidebar: string;
  resizeSidebar: string;
  sidePanel: string;
  resizePanel: string;
  expandPanel: string;
  shrinkPanel: string;
  closePanel: string;
  showPanel: string;
  backToChat: string;
  closeTab: (title: string) => string;
  menuFile: string;
  menuEdit: string;
  menuView: string;
  menuHelp: string;
  menuClose: string;
  menuUndo: string;
  menuRedo: string;
  menuCut: string;
  menuCopy: string;
  menuPaste: string;
  menuDelete: string;
  menuSelectAll: string;
  menuReload: string;
  menuResetZoom: string;
  menuZoomIn: string;
  menuZoomOut: string;
  menuFullScreen: string;
  menuDevTools: string;
  menuDocs: string;
  menuAbout: string;
  tbBack: string;
  tbForward: string;
  tbSidebar: string;
  webNewTab: string;
  webNewPage: string;
  webBack: string;
  webForward: string;
  webReload: string;
  webOpenSystem: string;
  webCopyLink: string;
  webMore: string;
  webAddress: string;
  webPlaceholder: string;
  webZoomIn: string;
  webZoomOut: string;
  webZoomReset: string;
  webCloseOthers: string;
  webInvalid: string;
  webRefused: string;
  webFailed: string;
  webEmpty: string;
  webClassroom: string;
  activity: string;
  noActions: string;
  moreOptions: string;
  versions: string;
  current: string;
  noConversations: string;
  theme: string;
  themes: { system: string; light: string; dark: string };
  working: string;
  seconds: (n: number) => string;
  calls: (n: number) => string;
  /** A subagent just handed its task, before its first action. */
  subagentStarting: string;
  toolFailed: string;
  close: string;
  suggestion: string;
  commands: string;
  greeting: (part: "morning" | "afternoon" | "night") => string;
  recent: string;
  seeMore: string;
  pinned: string;
  pin: string;
  unpin: string;
  searchConversations: string;
  searchEmpty: string;
  notices: string;
  noNotices: string;
  noticesCount: (n: number) => string;
  noticeSources: (n: number) => string;
  noticeOven: (n: number) => string;
  taskOf: (n: number, total: number) => string;
  thisConversation: string;
  more: string;
  addFile: string;
  toSources: string;
  miyagiCommands: string;
  modeHelp: string;
  copy: string;
  copied: string;
  toEnd: string;
  tasks: (done: number, total: number) => string;
  subjects: string;
  startTitle: string;
  startText: string;
  noSubjects: string;
  newSubject: string;
  subjectName: string;
  subjectDescription: string;
  subjectLanguage: string;
  subjectLanguageHelp: string;
  create: string;
  missingSubject: string;
  locate: string;
  locateHelp: string;
  locateSave: string;
  locateInvalid: string;
  forget: string;
  forgetHelp: string;
  opening: string;
  stillWorking: string;
  /** The status bar (#80): what miyagi or the host is doing, and why a button waits. */
  status: {
    greeting: string;
    thinking: string;
    approval: string;
    question: string;
    goToChat: string;
    why: string;
    tasks: Record<string, string>;
  };
  checkingKey: string;
  creatingSubject: string;
  starting: string;
  unreachable: string;
  chooseFolder: string;
  folderLabel: string;
  /** The button that opens the system's folder dialog (#79). */
  browse: string;
  folderHelp: string;
  folderNotEmpty: string;
  folderIsSubject: string;
  openExisting: string;
  openExistingHelp: string;
  openButton: string;
  persona: string;
  personas: { none: string; formal: string; warm: string; motivating: string };
  linkAfter: string;
}

const es: Texts = {
  connecting: "Conectando con miyagi…",
  lost: "Se ha perdido la conexión con miyagi. Reintentando…",
  replaced: "miyagi se ha abierto en otra ventana. Cierra esta.",
  signInTitle: "Conecta miyagi con Claude",
  signInText: "miyagi trabaja con Claude. Inicia sesión con tu cuenta de Claude (Pro o Max) en la página de Anthropic, o usa una clave de API.",
  signInAccount: "Iniciar sesión con mi cuenta de Claude",
  signInWaiting: "Esperando a que inicies sesión en la página de Claude que se ha abierto en tu navegador…",
  signInOpen: "¿No se abrió? Abre la página de inicio de sesión",
  signInCode: "Si la página te da un código, pégalo aquí",
  signInCodeSend: "Enviar código",
  signInFailed: "No se completó el inicio de sesión. Vuelve a intentarlo.",
  signInPrivacy: "miyagi nunca ve tu contraseña ni guarda tu sesión: la guarda Claude Code en este equipo.",
  apiKeyUse: "Prefiero usar una clave de API",
  apiKeyHelp: "Se paga por uso en tu cuenta de Anthropic. Créala en console.anthropic.com.",
  tokenForgotten: "miyagi ya no guarda tu token de Claude: las condiciones de Anthropic no lo permiten. Inicia sesión una vez y Claude Code guardará tu sesión.",
  keyPlaceholder: "sk-ant-api…",
  keySave: "Guardar y empezar",
  keyInvalid: "Eso no parece una clave de API de Claude (empieza por sk-ant-api).",
  placeholder: "Escribe a miyagi… (/ para los atajos)",
  placeholderBusy: "miyagi está trabajando… (Esc para pararlo)",
  send: "Enviar",
  stop: "Parar",
  attach: "Añadir un archivo a las fuentes",
  attached: (name) => `«${name}» añadido a las fuentes.`,
  duplicate: (name) => `«${name}» ya estaba en las fuentes.`,
  attachFailed: (name, why) => `No se pudo añadir «${name}»: ${why}`,
  modes: {
    guided: { name: "Guiado", help: "Trabaja solo y te pide aprobación antes de publicar algo que vean los alumnos." },
    interactive: { name: "Interactivo", help: "Te pregunta antes de cada herramienta." },
    autonomous: { name: "Autónomo", help: "Publica sin preguntar. Solo para cursos de prueba." },
    plan: { name: "Plan", help: "Lee y prepara un plan sin cambiar nada; tú decides si lo ejecuta." },
  },
  modeTitle: "Modo",
  approve: "Aprobar",
  reject: "Rechazar",
  stopAll: "Parar todo",
  done: "Hecho",
  answer: "Responder",
  other: "Otra respuesta (opcional)",
  cancel: "Cancelar",
  formSend: "Enviar",
  formDecline: "No",
  formMissing: (field) => `Falta «${field}».`,
  conversations: "Conversaciones",
  newConversation: "Nueva conversación",
  collapseSidebar: "Ocultar la barra lateral",
  expandSidebar: "Mostrar la barra lateral",
  resizeSidebar: "Cambiar el ancho de la barra lateral",
  sidePanel: "Panel lateral",
  resizePanel: "Cambiar el ancho del panel",
  expandPanel: "Ampliar el panel",
  shrinkPanel: "Reducir el panel",
  closePanel: "Cerrar el panel",
  showPanel: "Mostrar el panel",
  backToChat: "Volver a la conversación",
  closeTab: (title) => `Cerrar ${title}`,
  menuFile: "Archivo",
  menuEdit: "Editar",
  menuView: "Ver",
  menuHelp: "Ayuda",
  menuClose: "Cerrar la ventana",
  menuUndo: "Deshacer",
  menuRedo: "Rehacer",
  menuCut: "Cortar",
  menuCopy: "Copiar",
  menuPaste: "Pegar",
  menuDelete: "Eliminar",
  menuSelectAll: "Seleccionar todo",
  menuReload: "Recargar",
  menuResetZoom: "Tamaño real",
  menuZoomIn: "Ampliar",
  menuZoomOut: "Reducir",
  menuFullScreen: "Pantalla completa",
  menuDevTools: "Herramientas de desarrollo",
  menuDocs: "Documentación",
  menuAbout: "Acerca de miyagi",
  tbBack: "Vista anterior",
  tbForward: "Vista siguiente",
  tbSidebar: "Barra lateral",
  webNewTab: "Nueva pestaña",
  webNewPage: "Pestaña nueva",
  webBack: "Atrás",
  webForward: "Adelante",
  webReload: "Recargar",
  webOpenSystem: "Abrir en el navegador del sistema",
  webCopyLink: "Copiar enlace",
  webMore: "Más opciones de la página",
  webAddress: "Dirección",
  webPlaceholder: "Escribe una dirección web",
  webZoomIn: "Ampliar",
  webZoomOut: "Reducir",
  webZoomReset: "Tamaño normal",
  webCloseOthers: "Cerrar las demás pestañas",
  webInvalid: "Eso no es una página web. Escribe una dirección http o https.",
  webRefused: "Esa dirección no se puede abrir aquí.",
  webFailed: "Esta página no se ha podido cargar.",
  webEmpty: "Escribe una dirección arriba para abrir una página: inicia sesión una vez y seguirá iniciada la próxima vez. Es tu sesión; miyagi no la ve.",
  webClassroom: "Abrir mi aula de Moodle",
  activity: "Actividad",
  noActions: "Aún no hay acciones en este turno.",
  moreOptions: "Más opciones",
  versions: "Versiones",
  current: "actual",
  noConversations: "Aún no hay conversaciones anteriores.",
  theme: "Tema",
  themes: { system: "Del sistema", light: "Claro", dark: "Oscuro" },
  working: "Trabajando",
  seconds: (n) => `Trabajó ${n} s`,
  calls: (n) => (n === 1 ? "1 acción" : `${n} acciones`),
  subagentStarting: "Empezando…",
  toolFailed: "falló",
  close: "Cerrar",
  suggestion: "Sugerencia",
  commands: "Atajos",
  greeting: (part) => `${part === "morning" ? "Buenos días" : part === "afternoon" ? "Buenas tardes" : "Buenas noches"}. ¿Qué preparamos hoy?`,
  recent: "Recientes",
  seeMore: "Ver más",
  pinned: "Fijadas",
  pin: "Fijar",
  unpin: "Quitar de fijadas",
  searchConversations: "Buscar conversaciones",
  searchEmpty: "Ninguna conversación lo dice.",
  notices: "Avisos",
  noNotices: "No hay nada pendiente.",
  noticesCount: (n) => (n === 1 ? "1 aviso" : `${n} avisos`),
  noticeSources: (n) => (n === 1 ? "1 fuente por incorporar" : `${n} fuentes por incorporar`),
  noticeOven: (n) => (n === 1 ? "1 actividad en el horno" : `${n} actividades en el horno`),
  taskOf: (n, total) => `${n} de ${total}`,
  thisConversation: "Esta conversación",
  more: "Más",
  addFile: "Añadir archivo",
  toSources: "a tus fuentes",
  miyagiCommands: "Comandos de miyagi",
  modeHelp: "Cuánto trabaja miyagi sin preguntarte. También con Mayús+Tab.",
  copy: "Copiar",
  copied: "Copiado",
  toEnd: "Ir al final",
  tasks: (done, total) => `Tareas: ${done} de ${total}`,
  subjects: "Asignaturas",
  startTitle: "Tus asignaturas",
  startText: "Elige una para seguir donde lo dejaste, o crea una nueva.",
  noSubjects: "Todavía no tienes ninguna asignatura.",
  newSubject: "Nueva asignatura",
  subjectName: "Nombre de la asignatura",
  subjectDescription: "Descripción (opcional)",
  subjectLanguage: "Idioma en el que prefieres que te hable (opcional)",
  subjectLanguageHelp: "Por ejemplo «español». Si lo dejas vacío, te responde en el idioma en que le escribas.",
  create: "Crear",
  missingSubject: "no se encuentra su carpeta",
  locate: "Localizar",
  locateHelp: "La nueva ruta de su carpeta (la que tiene su config.json)",
  locateSave: "Guardar",
  locateInvalid: "Ahí no hay ninguna asignatura de miyagi.",
  forget: "Olvidar",
  forgetHelp: "Se quita de la lista; su carpeta no se toca.",
  opening: "Abriendo la asignatura…",
  stillWorking: "Sigue trabajando, un momento…",
  status: {
    greeting: "Leyendo lo que sé de la asignatura para saludarte",
    thinking: "miyagi está trabajando",
    approval: "miyagi espera tu aprobación",
    question: "miyagi te ha hecho una pregunta",
    goToChat: "Ir a la conversación",
    why: "Espera a que miyagi termine lo que está haciendo (lo ves en la barra de abajo)",
    tasks: {
      "install": "Instalando la extensión",
      "update": "Actualizando la extensión",
      "remove": "Quitando la extensión",
      "reload": "Recargando las extensiones",
      "add-marketplace": "Leyendo el repositorio",
      "inspect-marketplace": "Leyendo el repositorio",
      "remove-marketplace": "Quitando el repositorio",
      "classroom": "Conectando el aula",
      "create": "Creando la asignatura",
      "open": "Abriendo la asignatura",
      "add-existing": "Abriendo la asignatura",
      "locate": "Abriendo la asignatura",
      "new": "Abriendo una conversación nueva",
      "resume": "Abriendo la conversación",
      "upload": "Añadiendo el archivo a las fuentes",
      "pick-folder": "Eligiendo una carpeta",
    },
  },
  checkingKey: "Comprobando tu clave…",
  creatingSubject: "Creando la asignatura…",
  starting: "Arrancando miyagi… La primera vez tarda un poco.",
  unreachable: "No se pudo hablar con miyagi. Comprueba que sigue abierto y vuelve a intentarlo.",
  chooseFolder: "Elegir carpeta",
  folderLabel: "Carpeta de la asignatura (opcional)",
  browse: "Examinar…",
  folderHelp: "Una carpeta vacía o nueva, por ejemplo en tu nube. Si la dejas vacía, va a la carpeta de miyagi.",
  folderNotEmpty: "Esa carpeta no está vacía: elige otra, o una nueva.",
  folderIsSubject: "Esa carpeta ya es una asignatura: ábrela con «Abrir una carpeta».",
  openExisting: "Abrir una carpeta",
  openExistingHelp: "La carpeta de una asignatura de miyagi que no está en tu lista (la que tiene su config.json), por ejemplo copiada de un compañero",
  openButton: "Abrir",
  persona: "Tono de voz de miyagi (foros, retroalimentación, avisos)",
  personas: { none: "Sin preferencia (tono neutro)", formal: "Formal", warm: "Cercano", motivating: "Cercano y motivador" },
  linkAfter: "Vincular ya un aula de Moodle",
};

const en: Texts = {
  connecting: "Connecting to miyagi…",
  lost: "Lost the connection to miyagi. Retrying…",
  replaced: "miyagi opened in another window. Close this one.",
  signInTitle: "Connect miyagi to Claude",
  signInText: "miyagi works with Claude. Sign in with your Claude account (Pro or Max) on Anthropic's page, or use an API key.",
  signInAccount: "Sign in with my Claude account",
  signInWaiting: "Waiting for you to sign in on the Claude page that opened in your browser…",
  signInOpen: "Didn't it open? Open the sign-in page",
  signInCode: "If the page gives you a code, paste it here",
  signInCodeSend: "Send code",
  signInFailed: "Signing in didn't finish. Try again.",
  signInPrivacy: "miyagi never sees your password nor keeps your session: Claude Code keeps it on this computer.",
  apiKeyUse: "I'd rather use an API key",
  apiKeyHelp: "Billed per use to your Anthropic account. Create it at console.anthropic.com.",
  tokenForgotten: "miyagi no longer keeps your Claude token: Anthropic's terms don't allow it. Sign in once and Claude Code will keep your session.",
  keyPlaceholder: "sk-ant-api…",
  keySave: "Save and start",
  keyInvalid: "That doesn't look like a Claude API key (it starts with sk-ant-api).",
  placeholder: "Write to miyagi… (/ for shortcuts)",
  placeholderBusy: "miyagi is working… (Esc to stop it)",
  send: "Send",
  stop: "Stop",
  attach: "Add a file to the sources",
  attached: (name) => `"${name}" added to the sources.`,
  duplicate: (name) => `"${name}" was already in the sources.`,
  attachFailed: (name, why) => `Couldn't add "${name}": ${why}`,
  modes: {
    guided: { name: "Guided", help: "Works on its own and asks before publishing anything students see." },
    interactive: { name: "Interactive", help: "Asks before every tool." },
    autonomous: { name: "Autonomous", help: "Publishes without asking. Only for test courses." },
    plan: { name: "Plan", help: "Reads and prepares a plan without changing anything; you decide whether to run it." },
  },
  modeTitle: "Mode",
  approve: "Approve",
  reject: "Reject",
  stopAll: "Stop all",
  done: "Done",
  answer: "Answer",
  other: "Another answer (optional)",
  cancel: "Cancel",
  formSend: "Send",
  formDecline: "No",
  formMissing: (field) => `"${field}" is missing.`,
  conversations: "Conversations",
  newConversation: "New conversation",
  collapseSidebar: "Hide the sidebar",
  expandSidebar: "Show the sidebar",
  resizeSidebar: "Resize the sidebar",
  sidePanel: "Side panel",
  resizePanel: "Resize the panel",
  expandPanel: "Expand the panel",
  shrinkPanel: "Shrink the panel",
  closePanel: "Close the panel",
  showPanel: "Show the panel",
  backToChat: "Back to the conversation",
  closeTab: (title) => `Close ${title}`,
  menuFile: "File",
  menuEdit: "Edit",
  menuView: "View",
  menuHelp: "Help",
  menuClose: "Close the window",
  menuUndo: "Undo",
  menuRedo: "Redo",
  menuCut: "Cut",
  menuCopy: "Copy",
  menuPaste: "Paste",
  menuDelete: "Delete",
  menuSelectAll: "Select all",
  menuReload: "Reload",
  menuResetZoom: "Actual size",
  menuZoomIn: "Zoom in",
  menuZoomOut: "Zoom out",
  menuFullScreen: "Full screen",
  menuDevTools: "Developer tools",
  menuDocs: "Documentation",
  menuAbout: "About miyagi",
  tbBack: "Previous view",
  tbForward: "Next view",
  tbSidebar: "Sidebar",
  webNewTab: "New tab",
  webNewPage: "New tab",
  webBack: "Back",
  webForward: "Forward",
  webReload: "Reload",
  webOpenSystem: "Open in the system browser",
  webCopyLink: "Copy link",
  webMore: "More page options",
  webAddress: "Address",
  webPlaceholder: "Type a web address",
  webZoomIn: "Zoom in",
  webZoomOut: "Zoom out",
  webZoomReset: "Normal size",
  webCloseOthers: "Close the other tabs",
  webInvalid: "That isn't a web page. Type an http or https address.",
  webRefused: "That address can't be opened here.",
  webFailed: "This page couldn't be loaded.",
  webEmpty: "Type an address above to open a page: sign in once and you'll stay signed in next time. It's your session; miyagi doesn't see it.",
  webClassroom: "Open my Moodle classroom",
  activity: "Activity",
  noActions: "No actions in this turn yet.",
  moreOptions: "More options",
  versions: "Versions",
  current: "current",
  noConversations: "No earlier conversations yet.",
  theme: "Theme",
  themes: { system: "System", light: "Light", dark: "Dark" },
  working: "Working",
  seconds: (n) => `Worked ${n} s`,
  calls: (n) => (n === 1 ? "1 action" : `${n} actions`),
  subagentStarting: "Starting…",
  toolFailed: "failed",
  close: "Close",
  suggestion: "Suggestion",
  commands: "Shortcuts",
  greeting: (part) => `${part === "morning" ? "Good morning" : part === "afternoon" ? "Good afternoon" : "Good evening"}. What shall we prepare today?`,
  recent: "Recent",
  seeMore: "See more",
  pinned: "Pinned",
  pin: "Pin",
  unpin: "Unpin",
  searchConversations: "Search conversations",
  searchEmpty: "No conversation says that.",
  notices: "Notices",
  noNotices: "Nothing is waiting.",
  noticesCount: (n) => (n === 1 ? "1 notice" : `${n} notices`),
  noticeSources: (n) => (n === 1 ? "1 source to take in" : `${n} sources to take in`),
  noticeOven: (n) => (n === 1 ? "1 activity in the oven" : `${n} activities in the oven`),
  taskOf: (n, total) => `${n} of ${total}`,
  thisConversation: "This conversation",
  more: "More",
  addFile: "Add a file",
  toSources: "to your sources",
  miyagiCommands: "miyagi's commands",
  modeHelp: "How much miyagi does without asking you. Also with Shift+Tab.",
  copy: "Copy",
  copied: "Copied",
  toEnd: "Go to the end",
  tasks: (done, total) => `Tasks: ${done} of ${total}`,
  subjects: "Subjects",
  startTitle: "Your subjects",
  startText: "Pick one to carry on where you left off, or create a new one.",
  noSubjects: "You have no subjects yet.",
  newSubject: "New subject",
  subjectName: "Name of the subject",
  subjectDescription: "Description (optional)",
  subjectLanguage: "Language it should talk to you in (optional)",
  subjectLanguageHelp: "For example \"English\". Left empty, it answers in the language you write in.",
  create: "Create",
  missingSubject: "its folder is missing",
  locate: "Locate",
  locateHelp: "Its folder's new path (the one with its config.json)",
  locateSave: "Save",
  locateInvalid: "There's no miyagi subject there.",
  forget: "Forget",
  forgetHelp: "It leaves the list; its folder isn't touched.",
  opening: "Opening the subject…",
  stillWorking: "Still working, one moment…",
  status: {
    greeting: "Reading what I know of the subject to greet you",
    thinking: "miyagi is working",
    approval: "miyagi is waiting for your approval",
    question: "miyagi has asked you a question",
    goToChat: "Go to the conversation",
    why: "Wait until miyagi finishes what it's doing (it's in the bar below)",
    tasks: {
      "install": "Installing the extension",
      "update": "Updating the extension",
      "remove": "Removing the extension",
      "reload": "Reloading the extensions",
      "add-marketplace": "Reading the repository",
      "inspect-marketplace": "Reading the repository",
      "remove-marketplace": "Removing the repository",
      "classroom": "Connecting the classroom",
      "create": "Creating the subject",
      "open": "Opening the subject",
      "add-existing": "Opening the subject",
      "locate": "Opening the subject",
      "new": "Opening a new conversation",
      "resume": "Opening the conversation",
      "upload": "Adding the file to the sources",
      "pick-folder": "Choosing a folder",
    },
  },
  checkingKey: "Checking your key…",
  creatingSubject: "Creating the subject…",
  starting: "Starting miyagi… The first time takes a little longer.",
  unreachable: "Couldn't reach miyagi. Check it's still open and try again.",
  chooseFolder: "Choose a folder",
  folderLabel: "The subject's folder (optional)",
  browse: "Browse…",
  folderHelp: "An empty or new folder, for example in your cloud. Left empty, it goes to miyagi's folder.",
  folderNotEmpty: "That folder isn't empty: choose another one, or a new one.",
  folderIsSubject: "That folder is a subject already: open it with \"Open a folder\".",
  openExisting: "Open a folder",
  openExistingHelp: "The folder of a miyagi subject that isn't in your list (the one with its config.json), for example copied from a colleague",
  openButton: "Open",
  persona: "miyagi's tone of voice (forums, feedback, announcements)",
  personas: { none: "No preference (neutral tone)", formal: "Formal", warm: "Warm", motivating: "Warm and motivating" },
  linkAfter: "Link a Moodle classroom now",
};

const fr: Texts = {
  connecting: "Connexion à miyagi…",
  lost: "Connexion à miyagi perdue. Nouvelle tentative…",
  replaced: "miyagi s'est ouvert dans une autre fenêtre. Fermez celle-ci.",
  signInTitle: "Connectez miyagi à Claude",
  signInText: "miyagi fonctionne avec Claude. Connectez-vous avec votre compte Claude (Pro ou Max) sur la page d'Anthropic, ou utilisez une clé d'API.",
  signInAccount: "Me connecter avec mon compte Claude",
  signInWaiting: "En attente de votre connexion sur la page Claude ouverte dans votre navigateur…",
  signInOpen: "Elle ne s'est pas ouverte ? Ouvrir la page de connexion",
  signInCode: "Si la page vous donne un code, collez-le ici",
  signInCodeSend: "Envoyer le code",
  signInFailed: "La connexion n'a pas abouti. Réessayez.",
  signInPrivacy: "miyagi ne voit jamais votre mot de passe et ne garde pas votre session : Claude Code la garde sur cet ordinateur.",
  apiKeyUse: "Je préfère utiliser une clé d'API",
  apiKeyHelp: "Facturée à l'usage sur votre compte Anthropic. Créez-la sur console.anthropic.com.",
  tokenForgotten: "miyagi ne garde plus votre jeton Claude : les conditions d'Anthropic ne le permettent pas. Connectez-vous une fois et Claude Code gardera votre session.",
  keyPlaceholder: "sk-ant-api…",
  keySave: "Enregistrer et commencer",
  keyInvalid: "Cela ne ressemble pas à une clé d'API Claude (elle commence par sk-ant-api).",
  placeholder: "Écrivez à miyagi… (/ pour les raccourcis)",
  placeholderBusy: "miyagi travaille… (Échap pour l'arrêter)",
  send: "Envoyer",
  stop: "Arrêter",
  attach: "Ajouter un fichier aux sources",
  attached: (name) => `« ${name} » ajouté aux sources.`,
  duplicate: (name) => `« ${name} » était déjà dans les sources.`,
  attachFailed: (name, why) => `Impossible d'ajouter « ${name} » : ${why}`,
  modes: {
    guided: { name: "Guidé", help: "Travaille seul et demande avant de publier ce que voient les élèves." },
    interactive: { name: "Interactif", help: "Demande avant chaque outil." },
    autonomous: { name: "Autonome", help: "Publie sans demander. Seulement pour des cours de test." },
    plan: { name: "Plan", help: "Lit et prépare un plan sans rien changer ; vous décidez s'il l'exécute." },
  },
  modeTitle: "Mode",
  approve: "Approuver",
  reject: "Refuser",
  stopAll: "Tout arrêter",
  done: "Fait",
  answer: "Répondre",
  other: "Une autre réponse (facultatif)",
  cancel: "Annuler",
  formSend: "Envoyer",
  formDecline: "Non",
  formMissing: (field) => `« ${field} » manque.`,
  conversations: "Conversations",
  newConversation: "Nouvelle conversation",
  collapseSidebar: "Masquer la barre latérale",
  expandSidebar: "Afficher la barre latérale",
  resizeSidebar: "Redimensionner la barre latérale",
  sidePanel: "Panneau latéral",
  resizePanel: "Redimensionner le panneau",
  expandPanel: "Agrandir le panneau",
  shrinkPanel: "Réduire le panneau",
  closePanel: "Fermer le panneau",
  showPanel: "Afficher le panneau",
  backToChat: "Revenir à la conversation",
  closeTab: (title) => `Fermer ${title}`,
  menuFile: "Fichier",
  menuEdit: "Édition",
  menuView: "Affichage",
  menuHelp: "Aide",
  menuClose: "Fermer la fenêtre",
  menuUndo: "Annuler",
  menuRedo: "Rétablir",
  menuCut: "Couper",
  menuCopy: "Copier",
  menuPaste: "Coller",
  menuDelete: "Supprimer",
  menuSelectAll: "Tout sélectionner",
  menuReload: "Actualiser",
  menuResetZoom: "Taille réelle",
  menuZoomIn: "Agrandir",
  menuZoomOut: "Réduire",
  menuFullScreen: "Plein écran",
  menuDevTools: "Outils de développement",
  menuDocs: "Documentation",
  menuAbout: "À propos de miyagi",
  tbBack: "Vue précédente",
  tbForward: "Vue suivante",
  tbSidebar: "Barre latérale",
  webNewTab: "Nouvel onglet",
  webNewPage: "Nouvel onglet",
  webBack: "Précédent",
  webForward: "Suivant",
  webReload: "Actualiser",
  webOpenSystem: "Ouvrir dans le navigateur du système",
  webCopyLink: "Copier le lien",
  webMore: "Plus d'options de la page",
  webAddress: "Adresse",
  webPlaceholder: "Saisissez une adresse web",
  webZoomIn: "Agrandir",
  webZoomOut: "Réduire",
  webZoomReset: "Taille normale",
  webCloseOthers: "Fermer les autres onglets",
  webInvalid: "Ce n'est pas une page web. Saisissez une adresse http ou https.",
  webRefused: "Cette adresse ne peut pas être ouverte ici.",
  webFailed: "Cette page n'a pas pu être chargée.",
  webEmpty: "Saisissez une adresse ci-dessus pour ouvrir une page : connectez-vous une fois et vous resterez connecté la prochaine fois. C'est votre session ; miyagi ne la voit pas.",
  webClassroom: "Ouvrir ma classe Moodle",
  activity: "Activité",
  noActions: "Aucune action pour l'instant dans ce tour.",
  moreOptions: "Plus d'options",
  versions: "Versions",
  current: "actuelle",
  noConversations: "Pas encore de conversations précédentes.",
  theme: "Thème",
  themes: { system: "Du système", light: "Clair", dark: "Sombre" },
  working: "Au travail",
  seconds: (n) => `A travaillé ${n} s`,
  calls: (n) => (n === 1 ? "1 action" : `${n} actions`),
  subagentStarting: "Démarrage…",
  toolFailed: "a échoué",
  close: "Fermer",
  suggestion: "Suggestion",
  commands: "Raccourcis",
  greeting: (part) => `${part === "night" ? "Bonsoir" : "Bonjour"}. Que préparons-nous aujourd'hui ?`,
  recent: "Récentes",
  seeMore: "Voir plus",
  pinned: "Épinglées",
  pin: "Épingler",
  unpin: "Désépingler",
  searchConversations: "Chercher une conversation",
  searchEmpty: "Aucune conversation ne le dit.",
  notices: "Avis",
  noNotices: "Rien en attente.",
  noticesCount: (n) => (n === 1 ? "1 avis" : `${n} avis`),
  noticeSources: (n) => (n === 1 ? "1 source à intégrer" : `${n} sources à intégrer`),
  noticeOven: (n) => (n === 1 ? "1 activité au four" : `${n} activités au four`),
  taskOf: (n, total) => `${n} sur ${total}`,
  thisConversation: "Cette conversation",
  more: "Plus",
  addFile: "Ajouter un fichier",
  toSources: "à vos sources",
  miyagiCommands: "Commandes de miyagi",
  modeHelp: "Ce que miyagi fait sans vous demander. Aussi avec Maj+Tab.",
  copy: "Copier",
  copied: "Copié",
  toEnd: "Aller à la fin",
  tasks: (done, total) => `Tâches : ${done} sur ${total}`,
  subjects: "Matières",
  startTitle: "Vos matières",
  startText: "Choisissez-en une pour reprendre là où vous en étiez, ou créez-en une.",
  noSubjects: "Vous n'avez encore aucune matière.",
  newSubject: "Nouvelle matière",
  subjectName: "Nom de la matière",
  subjectDescription: "Description (facultatif)",
  subjectLanguage: "Langue dans laquelle il vous parle (facultatif)",
  subjectLanguageHelp: "Par exemple « français ». Vide, il répond dans la langue où vous écrivez.",
  create: "Créer",
  missingSubject: "son dossier est introuvable",
  locate: "Localiser",
  locateHelp: "Le nouveau chemin de son dossier (celui qui a son config.json)",
  locateSave: "Enregistrer",
  locateInvalid: "Il n'y a pas de matière miyagi ici.",
  forget: "Oublier",
  forgetHelp: "Elle quitte la liste ; son dossier n'est pas touché.",
  opening: "Ouverture de la matière…",
  stillWorking: "Toujours en cours, un instant…",
  status: {
    greeting: "Je lis ce que je sais de la matière pour vous saluer",
    thinking: "miyagi travaille",
    approval: "miyagi attend votre approbation",
    question: "miyagi vous a posé une question",
    goToChat: "Aller à la conversation",
    why: "Attendez que miyagi termine ce qu'il fait (c'est dans la barre du bas)",
    tasks: {
      "install": "Installation de l'extension",
      "update": "Mise à jour de l'extension",
      "remove": "Retrait de l'extension",
      "reload": "Rechargement des extensions",
      "add-marketplace": "Lecture du dépôt",
      "inspect-marketplace": "Lecture du dépôt",
      "remove-marketplace": "Retrait du dépôt",
      "classroom": "Connexion de la classe",
      "create": "Création de la matière",
      "open": "Ouverture de la matière",
      "add-existing": "Ouverture de la matière",
      "locate": "Ouverture de la matière",
      "new": "Ouverture d'une nouvelle conversation",
      "resume": "Ouverture de la conversation",
      "upload": "Ajout du fichier aux sources",
      "pick-folder": "Choix d'un dossier",
    },
  },
  checkingKey: "Vérification de votre clé…",
  creatingSubject: "Création de la matière…",
  starting: "Démarrage de miyagi… La première fois, c'est un peu plus long.",
  unreachable: "Impossible de joindre miyagi. Vérifiez qu'il est toujours ouvert et réessayez.",
  chooseFolder: "Choisir un dossier",
  folderLabel: "Dossier de la matière (facultatif)",
  browse: "Parcourir…",
  folderHelp: "Un dossier vide ou nouveau, par exemple dans ton cloud. Laissé vide, il va dans le dossier de miyagi.",
  folderNotEmpty: "Ce dossier n'est pas vide : choisis-en un autre, ou un nouveau.",
  folderIsSubject: "Ce dossier est déjà une matière : ouvre-le avec « Ouvrir un dossier ».",
  openExisting: "Ouvrir un dossier",
  openExistingHelp: "Le dossier d'une matière miyagi absente de ta liste (celui qui a son config.json), par exemple copié d'un collègue",
  openButton: "Ouvrir",
  persona: "Ton de miyagi (forums, retours, annonces)",
  personas: { none: "Pas de préférence (ton neutre)", formal: "Formel", warm: "Chaleureux", motivating: "Chaleureux et motivant" },
  linkAfter: "Lier une classe Moodle maintenant",
};

const de: Texts = {
  connecting: "Verbindung zu miyagi…",
  lost: "Verbindung zu miyagi verloren. Neuer Versuch…",
  replaced: "miyagi wurde in einem anderen Fenster geöffnet. Schließen Sie dieses.",
  signInTitle: "miyagi mit Claude verbinden",
  signInText: "miyagi arbeitet mit Claude. Melden Sie sich auf der Seite von Anthropic mit Ihrem Claude-Konto (Pro oder Max) an, oder verwenden Sie einen API-Schlüssel.",
  signInAccount: "Mit meinem Claude-Konto anmelden",
  signInWaiting: "Warten auf Ihre Anmeldung auf der Claude-Seite, die sich in Ihrem Browser geöffnet hat…",
  signInOpen: "Nicht geöffnet? Anmeldeseite öffnen",
  signInCode: "Wenn die Seite Ihnen einen Code gibt, fügen Sie ihn hier ein",
  signInCodeSend: "Code senden",
  signInFailed: "Die Anmeldung wurde nicht abgeschlossen. Versuchen Sie es erneut.",
  signInPrivacy: "miyagi sieht nie Ihr Passwort und speichert Ihre Sitzung nicht: Claude Code bewahrt sie auf diesem Computer auf.",
  apiKeyUse: "Lieber einen API-Schlüssel verwenden",
  apiKeyHelp: "Wird nach Nutzung über Ihr Anthropic-Konto abgerechnet. Erstellen Sie ihn auf console.anthropic.com.",
  tokenForgotten: "miyagi speichert Ihr Claude-Token nicht mehr: Die Bedingungen von Anthropic erlauben es nicht. Melden Sie sich einmal an, und Claude Code behält Ihre Sitzung.",
  keyPlaceholder: "sk-ant-api…",
  keySave: "Speichern und beginnen",
  keyInvalid: "Das sieht nicht wie ein Claude-API-Schlüssel aus (er beginnt mit sk-ant-api).",
  placeholder: "Schreiben Sie miyagi… (/ für Kurzbefehle)",
  placeholderBusy: "miyagi arbeitet… (Esc zum Anhalten)",
  send: "Senden",
  stop: "Anhalten",
  attach: "Eine Datei zu den Quellen hinzufügen",
  attached: (name) => `„${name}“ zu den Quellen hinzugefügt.`,
  duplicate: (name) => `„${name}“ war schon in den Quellen.`,
  attachFailed: (name, why) => `„${name}“ konnte nicht hinzugefügt werden: ${why}`,
  modes: {
    guided: { name: "Geführt", help: "Arbeitet selbstständig und fragt, bevor es etwas für die Lernenden veröffentlicht." },
    interactive: { name: "Interaktiv", help: "Fragt vor jedem Werkzeug." },
    autonomous: { name: "Autonom", help: "Veröffentlicht ohne zu fragen. Nur für Testkurse." },
    plan: { name: "Plan", help: "Liest und erstellt einen Plan, ohne etwas zu ändern; Sie entscheiden, ob er ausgeführt wird." },
  },
  modeTitle: "Modus",
  approve: "Zustimmen",
  reject: "Ablehnen",
  stopAll: "Alles anhalten",
  done: "Erledigt",
  answer: "Antworten",
  other: "Eine andere Antwort (optional)",
  cancel: "Abbrechen",
  formSend: "Senden",
  formDecline: "Nein",
  formMissing: (field) => `„${field}“ fehlt.`,
  conversations: "Unterhaltungen",
  newConversation: "Neue Unterhaltung",
  collapseSidebar: "Seitenleiste ausblenden",
  expandSidebar: "Seitenleiste einblenden",
  resizeSidebar: "Breite der Seitenleiste ändern",
  sidePanel: "Seitenbereich",
  resizePanel: "Breite des Bereichs ändern",
  expandPanel: "Bereich vergrößern",
  shrinkPanel: "Bereich verkleinern",
  closePanel: "Bereich schließen",
  showPanel: "Bereich anzeigen",
  backToChat: "Zurück zum Gespräch",
  closeTab: (title) => `Schließen ${title}`,
  menuFile: "Datei",
  menuEdit: "Bearbeiten",
  menuView: "Ansicht",
  menuHelp: "Hilfe",
  menuClose: "Fenster schließen",
  menuUndo: "Rückgängig",
  menuRedo: "Wiederholen",
  menuCut: "Ausschneiden",
  menuCopy: "Kopieren",
  menuPaste: "Einfügen",
  menuDelete: "Löschen",
  menuSelectAll: "Alles auswählen",
  menuReload: "Neu laden",
  menuResetZoom: "Originalgröße",
  menuZoomIn: "Vergrößern",
  menuZoomOut: "Verkleinern",
  menuFullScreen: "Vollbild",
  menuDevTools: "Entwicklertools",
  menuDocs: "Dokumentation",
  menuAbout: "Über miyagi",
  tbBack: "Vorherige Ansicht",
  tbForward: "Nächste Ansicht",
  tbSidebar: "Seitenleiste",
  webNewTab: "Neuer Tab",
  webNewPage: "Neuer Tab",
  webBack: "Zurück",
  webForward: "Vorwärts",
  webReload: "Neu laden",
  webOpenSystem: "Im Systembrowser öffnen",
  webCopyLink: "Link kopieren",
  webMore: "Weitere Seitenoptionen",
  webAddress: "Adresse",
  webPlaceholder: "Webadresse eingeben",
  webZoomIn: "Vergrößern",
  webZoomOut: "Verkleinern",
  webZoomReset: "Normale Größe",
  webCloseOthers: "Andere Tabs schließen",
  webInvalid: "Das ist keine Webseite. Gib eine http- oder https-Adresse ein.",
  webRefused: "Diese Adresse kann hier nicht geöffnet werden.",
  webFailed: "Diese Seite konnte nicht geladen werden.",
  webEmpty: "Gib oben eine Adresse ein, um eine Seite zu öffnen: Einmal angemeldet, bleibst du es auch beim nächsten Mal. Es ist deine Sitzung; miyagi sieht sie nicht.",
  webClassroom: "Mein Moodle-Kursraum öffnen",
  activity: "Aktivität",
  noActions: "Noch keine Aktionen in diesem Schritt.",
  moreOptions: "Weitere Optionen",
  versions: "Versionen",
  current: "aktuell",
  noConversations: "Noch keine früheren Unterhaltungen.",
  theme: "Design",
  themes: { system: "System", light: "Hell", dark: "Dunkel" },
  working: "Arbeitet",
  seconds: (n) => `${n} s gearbeitet`,
  calls: (n) => (n === 1 ? "1 Aktion" : `${n} Aktionen`),
  subagentStarting: "Beginnt…",
  toolFailed: "fehlgeschlagen",
  close: "Schließen",
  suggestion: "Vorschlag",
  commands: "Kurzbefehle",
  greeting: (part) => `${part === "morning" ? "Guten Morgen" : part === "afternoon" ? "Guten Tag" : "Guten Abend"}. Was bereiten wir heute vor?`,
  recent: "Zuletzt",
  seeMore: "Mehr anzeigen",
  pinned: "Angeheftet",
  pin: "Anheften",
  unpin: "Lösen",
  searchConversations: "Gespräche suchen",
  searchEmpty: "Keine Unterhaltung sagt das.",
  notices: "Hinweise",
  noNotices: "Nichts wartet.",
  noticesCount: (n) => (n === 1 ? "1 Hinweis" : `${n} Hinweise`),
  noticeSources: (n) => (n === 1 ? "1 Quelle aufzunehmen" : `${n} Quellen aufzunehmen`),
  noticeOven: (n) => (n === 1 ? "1 Aktivität im Ofen" : `${n} Aktivitäten im Ofen`),
  taskOf: (n, total) => `${n} von ${total}`,
  thisConversation: "Dieses Gespräch",
  more: "Mehr",
  addFile: "Datei hinzufügen",
  toSources: "zu Ihren Quellen",
  miyagiCommands: "miyagi-Befehle",
  modeHelp: "Wie viel miyagi tut, ohne Sie zu fragen. Auch mit Umschalt+Tab.",
  copy: "Kopieren",
  copied: "Kopiert",
  toEnd: "Zum Ende",
  tasks: (done, total) => `Aufgaben: ${done} von ${total}`,
  subjects: "Fächer",
  startTitle: "Ihre Fächer",
  startText: "Wählen Sie eins, um weiterzumachen, oder legen Sie ein neues an.",
  noSubjects: "Sie haben noch keine Fächer.",
  newSubject: "Neues Fach",
  subjectName: "Name des Fachs",
  subjectDescription: "Beschreibung (optional)",
  subjectLanguage: "Sprache, in der es mit Ihnen spricht (optional)",
  subjectLanguageHelp: "Zum Beispiel „Deutsch“. Leer antwortet es in der Sprache, in der Sie schreiben.",
  create: "Anlegen",
  missingSubject: "sein Ordner fehlt",
  locate: "Suchen",
  locateHelp: "Der neue Pfad seines Ordners (der mit seiner config.json)",
  locateSave: "Speichern",
  locateInvalid: "Dort ist kein miyagi-Fach.",
  forget: "Vergessen",
  forgetHelp: "Es verschwindet aus der Liste; sein Ordner bleibt unberührt.",
  opening: "Fach wird geöffnet…",
  stillWorking: "Arbeitet noch, einen Moment…",
  status: {
    greeting: "Ich lese, was ich über das Fach weiß, um Sie zu begrüßen",
    thinking: "miyagi arbeitet",
    approval: "miyagi wartet auf Ihre Freigabe",
    question: "miyagi hat Ihnen eine Frage gestellt",
    goToChat: "Zum Gespräch",
    why: "Warten Sie, bis miyagi fertig ist (unten in der Leiste zu sehen)",
    tasks: {
      "install": "Erweiterung wird installiert",
      "update": "Erweiterung wird aktualisiert",
      "remove": "Erweiterung wird entfernt",
      "reload": "Erweiterungen werden neu geladen",
      "add-marketplace": "Repository wird gelesen",
      "inspect-marketplace": "Repository wird gelesen",
      "remove-marketplace": "Repository wird entfernt",
      "classroom": "Kursraum wird verbunden",
      "create": "Fach wird angelegt",
      "open": "Fach wird geöffnet",
      "add-existing": "Fach wird geöffnet",
      "locate": "Fach wird geöffnet",
      "new": "Neues Gespräch wird geöffnet",
      "resume": "Gespräch wird geöffnet",
      "upload": "Datei wird zu den Quellen hinzugefügt",
      "pick-folder": "Ordner wird gewählt",
    },
  },
  checkingKey: "Ihr Schlüssel wird geprüft…",
  creatingSubject: "Fach wird angelegt…",
  starting: "miyagi startet… Beim ersten Mal dauert es etwas länger.",
  unreachable: "miyagi ist nicht erreichbar. Prüfen Sie, ob es noch geöffnet ist, und versuchen Sie es erneut.",
  chooseFolder: "Ordner wählen",
  folderLabel: "Ordner des Fachs (optional)",
  browse: "Durchsuchen…",
  folderHelp: "Ein leerer oder neuer Ordner, zum Beispiel in deiner Cloud. Leer gelassen, kommt es in den Ordner von miyagi.",
  folderNotEmpty: "Dieser Ordner ist nicht leer: Wähle einen anderen oder einen neuen.",
  folderIsSubject: "Dieser Ordner ist schon ein Fach: Öffne ihn mit „Ordner öffnen“.",
  openExisting: "Ordner öffnen",
  openExistingHelp: "Der Ordner eines miyagi-Fachs, das nicht in deiner Liste ist (der mit seiner config.json), zum Beispiel von einer Kollegin kopiert",
  openButton: "Öffnen",
  persona: "Tonfall von miyagi (Foren, Rückmeldungen, Ankündigungen)",
  personas: { none: "Keine Vorliebe (neutraler Ton)", formal: "Förmlich", warm: "Herzlich", motivating: "Herzlich und motivierend" },
  linkAfter: "Gleich einen Moodle-Kursraum verknüpfen",
};

const ALL: Record<string, Texts> = { es, en, fr, de };

/** The texts for a language code ("es", "es-ES"); English for one miyagi doesn't speak. */
export function texts(language: string | undefined): Texts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
