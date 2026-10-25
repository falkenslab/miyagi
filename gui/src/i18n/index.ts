// The page's texts, in the languages miyagi speaks. Every language has every key: the type
// makes a missing one a build error. The language is the host's (info.language).

export interface Texts {
  connecting: string;
  lost: string;
  replaced: string;
  signInTitle: string;
  signInText: string;
  signInHow: string;
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
  current: string;
  noConversations: string;
  theme: string;
  themes: { system: string; light: string; dark: string };
  working: string;
  seconds: (n: number) => string;
  calls: (n: number) => string;
  toolFailed: string;
  close: string;
  suggestion: string;
  commands: string;
  welcome: (workspace: string) => string;
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
  opening: string;
}

const es: Texts = {
  connecting: "Conectando con miyagi…",
  lost: "Se ha perdido la conexión con miyagi. Reintentando…",
  replaced: "miyagi se ha abierto en otra ventana. Cierra esta.",
  signInTitle: "Falta tu clave de Claude",
  signInText: "miyagi usa tu suscripción de Claude. Pega aquí tu token (empieza por sk-ant-oat) o una clave de API (sk-ant-api); se guarda en tu ordenador.",
  signInHow: "Para sacar el token: en una terminal, «claude setup-token».",
  keyPlaceholder: "sk-ant-…",
  keySave: "Guardar y empezar",
  keyInvalid: "Eso no parece un token ni una clave de Claude.",
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
  current: "actual",
  noConversations: "Aún no hay conversaciones anteriores.",
  theme: "Tema",
  themes: { system: "Del sistema", light: "Claro", dark: "Oscuro" },
  working: "Trabajando",
  seconds: (n) => `Trabajó ${n} s`,
  calls: (n) => (n === 1 ? "1 acción" : `${n} acciones`),
  toolFailed: "falló",
  close: "Cerrar",
  suggestion: "Sugerencia",
  commands: "Atajos",
  welcome: (workspace) => `Hola. Esta es tu asignatura «${workspace}».`,
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
  opening: "Abriendo la asignatura…",
};

const en: Texts = {
  connecting: "Connecting to miyagi…",
  lost: "Lost the connection to miyagi. Retrying…",
  replaced: "miyagi opened in another window. Close this one.",
  signInTitle: "Your Claude key is missing",
  signInText: "miyagi uses your Claude subscription. Paste your token here (it starts with sk-ant-oat) or an API key (sk-ant-api); it's kept on your computer.",
  signInHow: "To get the token: in a terminal, \"claude setup-token\".",
  keyPlaceholder: "sk-ant-…",
  keySave: "Save and start",
  keyInvalid: "That doesn't look like a Claude token or key.",
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
  current: "current",
  noConversations: "No earlier conversations yet.",
  theme: "Theme",
  themes: { system: "System", light: "Light", dark: "Dark" },
  working: "Working",
  seconds: (n) => `Worked ${n} s`,
  calls: (n) => (n === 1 ? "1 action" : `${n} actions`),
  toolFailed: "failed",
  close: "Close",
  suggestion: "Suggestion",
  commands: "Shortcuts",
  welcome: (workspace) => `Hi. This is your subject "${workspace}".`,
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
  opening: "Opening the subject…",
};

const fr: Texts = {
  connecting: "Connexion à miyagi…",
  lost: "Connexion à miyagi perdue. Nouvelle tentative…",
  replaced: "miyagi s'est ouvert dans une autre fenêtre. Fermez celle-ci.",
  signInTitle: "Votre clé Claude manque",
  signInText: "miyagi utilise votre abonnement Claude. Collez ici votre jeton (il commence par sk-ant-oat) ou une clé d'API (sk-ant-api) ; il est gardé sur votre ordinateur.",
  signInHow: "Pour obtenir le jeton : dans un terminal, « claude setup-token ».",
  keyPlaceholder: "sk-ant-…",
  keySave: "Enregistrer et commencer",
  keyInvalid: "Cela ne ressemble pas à un jeton ni à une clé Claude.",
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
  current: "actuelle",
  noConversations: "Pas encore de conversations précédentes.",
  theme: "Thème",
  themes: { system: "Du système", light: "Clair", dark: "Sombre" },
  working: "Au travail",
  seconds: (n) => `A travaillé ${n} s`,
  calls: (n) => (n === 1 ? "1 action" : `${n} actions`),
  toolFailed: "a échoué",
  close: "Fermer",
  suggestion: "Suggestion",
  commands: "Raccourcis",
  welcome: (workspace) => `Bonjour. Voici votre matière « ${workspace} ».`,
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
  opening: "Ouverture de la matière…",
};

const de: Texts = {
  connecting: "Verbindung zu miyagi…",
  lost: "Verbindung zu miyagi verloren. Neuer Versuch…",
  replaced: "miyagi wurde in einem anderen Fenster geöffnet. Schließen Sie dieses.",
  signInTitle: "Ihr Claude-Schlüssel fehlt",
  signInText: "miyagi nutzt Ihr Claude-Abonnement. Fügen Sie hier Ihr Token (beginnt mit sk-ant-oat) oder einen API-Schlüssel (sk-ant-api) ein; er bleibt auf Ihrem Computer.",
  signInHow: "Token erhalten: in einem Terminal „claude setup-token“.",
  keyPlaceholder: "sk-ant-…",
  keySave: "Speichern und beginnen",
  keyInvalid: "Das sieht nicht wie ein Claude-Token oder -Schlüssel aus.",
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
  current: "aktuell",
  noConversations: "Noch keine früheren Unterhaltungen.",
  theme: "Design",
  themes: { system: "System", light: "Hell", dark: "Dunkel" },
  working: "Arbeitet",
  seconds: (n) => `${n} s gearbeitet`,
  calls: (n) => (n === 1 ? "1 Aktion" : `${n} Aktionen`),
  toolFailed: "fehlgeschlagen",
  close: "Schließen",
  suggestion: "Vorschlag",
  commands: "Kurzbefehle",
  welcome: (workspace) => `Hallo. Das ist Ihr Fach „${workspace}“.`,
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
  opening: "Fach wird geöffnet…",
};

const ALL: Record<string, Texts> = { es, en, fr, de };

/** The texts for a language code ("es", "es-ES"); English for one miyagi doesn't speak. */
export function texts(language: string | undefined): Texts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
