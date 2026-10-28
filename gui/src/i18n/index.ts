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
  locate: string;
  locateHelp: string;
  locateSave: string;
  locateInvalid: string;
  forget: string;
  forgetHelp: string;
  opening: string;
  stillWorking: string;
  checkingKey: string;
  creatingSubject: string;
  starting: string;
  unreachable: string;
  chooseFolder: string;
  folderLabel: string;
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
  locate: "Localizar",
  locateHelp: "La nueva ruta de su carpeta (la que tiene su config.json)",
  locateSave: "Guardar",
  locateInvalid: "Ahí no hay ninguna asignatura de miyagi.",
  forget: "Olvidar",
  forgetHelp: "Se quita de la lista; su carpeta no se toca.",
  opening: "Abriendo la asignatura…",
  stillWorking: "Sigue trabajando, un momento…",
  checkingKey: "Comprobando tu clave…",
  creatingSubject: "Creando la asignatura…",
  starting: "Arrancando miyagi… La primera vez tarda un poco.",
  unreachable: "No se pudo hablar con miyagi. Comprueba que sigue abierto y vuelve a intentarlo.",
  chooseFolder: "Elegir carpeta",
  folderLabel: "Carpeta de la asignatura (opcional)",
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
  locate: "Locate",
  locateHelp: "Its folder's new path (the one with its config.json)",
  locateSave: "Save",
  locateInvalid: "There's no miyagi subject there.",
  forget: "Forget",
  forgetHelp: "It leaves the list; its folder isn't touched.",
  opening: "Opening the subject…",
  stillWorking: "Still working, one moment…",
  checkingKey: "Checking your key…",
  creatingSubject: "Creating the subject…",
  starting: "Starting miyagi… The first time takes a little longer.",
  unreachable: "Couldn't reach miyagi. Check it's still open and try again.",
  chooseFolder: "Choose a folder",
  folderLabel: "The subject's folder (optional)",
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
  locate: "Localiser",
  locateHelp: "Le nouveau chemin de son dossier (celui qui a son config.json)",
  locateSave: "Enregistrer",
  locateInvalid: "Il n'y a pas de matière miyagi ici.",
  forget: "Oublier",
  forgetHelp: "Elle quitte la liste ; son dossier n'est pas touché.",
  opening: "Ouverture de la matière…",
  stillWorking: "Toujours en cours, un instant…",
  checkingKey: "Vérification de votre clé…",
  creatingSubject: "Création de la matière…",
  starting: "Démarrage de miyagi… La première fois, c'est un peu plus long.",
  unreachable: "Impossible de joindre miyagi. Vérifiez qu'il est toujours ouvert et réessayez.",
  chooseFolder: "Choisir un dossier",
  folderLabel: "Dossier de la matière (facultatif)",
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
  locate: "Suchen",
  locateHelp: "Der neue Pfad seines Ordners (der mit seiner config.json)",
  locateSave: "Speichern",
  locateInvalid: "Dort ist kein miyagi-Fach.",
  forget: "Vergessen",
  forgetHelp: "Es verschwindet aus der Liste; sein Ordner bleibt unberührt.",
  opening: "Fach wird geöffnet…",
  stillWorking: "Arbeitet noch, einen Moment…",
  checkingKey: "Ihr Schlüssel wird geprüft…",
  creatingSubject: "Fach wird angelegt…",
  starting: "miyagi startet… Beim ersten Mal dauert es etwas länger.",
  unreachable: "miyagi ist nicht erreichbar. Prüfen Sie, ob es noch geöffnet ist, und versuchen Sie es erneut.",
  chooseFolder: "Ordner wählen",
  folderLabel: "Ordner des Fachs (optional)",
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
