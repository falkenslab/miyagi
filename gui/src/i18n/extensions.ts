// The extensions view's texts (gui-extensions #50), apart from the chat's: every language has
// every key, and the type makes a missing one a build error.

export interface ExtTexts {
  title: string;
  open: string;
  tabs: { capabilities: string; installed: string; catalog: string; repositories: string };
  loading: string;
  busy: string;
  failed: (why: string) => string;
  // Capabilities
  canDo: string;
  canDoNone: string;
  notHere: string;
  missingTitle: string;
  missingNone: string;
  providedBy: (names: string) => string;
  notOffered: string;
  install: string;
  installing: string;
  stillWorking: string;
  updating: string;
  reviewing: string;
  adding: string;
  // Classroom
  classroomTitle: string;
  classroomConnected: (host: string, course: string) => string;
  classroomOff: (host: string, course: string) => string;
  classroomReconnect: string;
  classroomNone: string;
  classroomUrl: string;
  classroomUrlHelp: string;
  classroomCourse: string;
  classroomConnect: string;
  classroomConnecting: string;
  classroomInvalid: string;
  classroomDone: string;
  classroomSignIn: string;
  connectClassroom: string;
  // Installed
  noneInstalled: string;
  forAll: string;
  forThis: string;
  on: string;
  off: string;
  notRunning: (why: string) => string;
  options: string;
  update: string;
  updateAll: string;
  updated: (names: string) => string;
  upToDate: string;
  remove: string;
  removeTitle: (name: string) => string;
  removeText: string;
  removeData: string;
  removed: (name: string) => string;
  trustTitle: string;
  trustText: (names: string) => string;
  trust: string;
  // Options
  noOptions: string;
  secretSet: string;
  secretUnset: string;
  listHelp: string;
  save: string;
  saved: string;
  needsOptions: (name: string) => string;
  // Catalog
  search: string;
  installed: string;
  updateAvailable: string;
  needs: (what: string) => string;
  talksTo: (hosts: string) => string;
  foreignTitle: (market: string) => string;
  foreignText: string;
  installAnyway: string;
  installedNow: (name: string) => string;
  noResults: string;
  // Repositories
  official: string;
  extensionsCount: (n: number) => string;
  addRepo: string;
  repoSource: string;
  repoSourceHelp: string;
  review: string;
  repoBy: (name: string, owner: string) => string;
  repoWarning: string;
  typeName: (name: string) => string;
  add: string;
  added: (name: string) => string;
  nameMismatch: string;
  forget: string;
  forgotten: (name: string) => string;
  cancel: string;
  close: string;
  // The shell: sidebar, header, quick actions
  tagline: string;
  menu: string;
  navChat: string;
  secClassroom: string;
  navClassroom: string;
  secMiyagi: string;
  navExtensions: string;
  secConversations: string;
  withClassroom: string;
  withoutClassroom: string;
  actions: string;
  quick: { prepare: string; grade: string; forum: string; ingest: string };
  quickPrompts: { prepare: string; grade: string; forum: string; ingest: string };
  capsButton: string;
  capsTitle: string;
  extSubtitle: string;
  classroomSubtitle: string;
  // The capabilities table
  canI: string;
  thanksTo: string;
  yes: string;
  notOnThisComputer: string;
  core: string;
  coreRow: string;
  classroomRow: string;
  capsNote: string;
  // An extension's card and its details
  upToDateBadge: string;
  details: string;
  declares: string;
  network: string;
  onlyThisComputer: string;
  requires: string;
  nothing: string;
  gives: string;
  addTitle: (name: string) => string;
  addButton: string;
  installNote: string;
  foreignBadge: string;
  // Linking a classroom: three steps
  linkTitle: string;
  linkButton: string;
  linkKind: string;
  next: string;
  linkStep2: string;
  linkStep2Note: string;
  link: string;
  linked: (host: string, course: string) => string;
  linkedNote: string;
  done: string;
  moodleCourse: (course: string) => string;
  connectedBadge: string;
  offBadge: string;
}

const es: ExtTexts = {
  title: "Lo que miyagi puede hacer",
  open: "Extensiones",
  tabs: { capabilities: "Capacidades", installed: "Instaladas", catalog: "Catálogo", repositories: "Repositorios" },
  loading: "Cargando…",
  busy: "miyagi está trabajando: espera a que termine.",
  failed: (why) => `No se pudo: ${why}`,
  canDo: "Ya puede",
  canDoNone: "Solo lo de serie: preparar material, leer tus fuentes y llevar la base de conocimiento de la asignatura.",
  notHere: "En este ordenador no",
  missingTitle: "Le falta",
  missingNone: "Nada: todo lo que miyagi sabe hacer tiene con qué.",
  providedBy: (names) => `Lo da: ${names}`,
  notOffered: "Ninguna extensión del catálogo lo ofrece todavía.",
  install: "Instalar",
  installing: "Instalando…",
  stillWorking: "Sigue trabajando, un momento…",
  updating: "Buscando actualizaciones…",
  reviewing: "Leyendo el repositorio…",
  adding: "Añadiendo el repositorio…",
  classroomTitle: "Tu aula",
  classroomConnected: (host, course) => `Conectada a ${host}, curso ${course}. miyagi puede corregir entregas, responder en el foro y publicar contenido, siempre con tu aprobación.`,
  classroomOff: (host, course) => `Tu aula (${host}, curso ${course}) no está a su alcance: la extensión del aula falta o está apagada.`,
  classroomReconnect: "Volver a conectar",
  classroomNone: "Sin aula, miyagi prepara el material aquí. Conecta tu curso de Moodle para que también corrija entregas, responda en el foro y publique, siempre con tu aprobación.",
  classroomUrl: "Dirección del curso",
  classroomUrlHelp: "Copia la dirección de tu curso desde el navegador, como https://campus.miinstituto.es/course/view.php?id=12.",
  classroomCourse: "Número del curso (el id de su dirección)",
  classroomConnect: "Conectar el aula",
  classroomConnecting: "Conectando… (instala la extensión del aula la primera vez)",
  classroomInvalid: "Eso no parece la dirección de un curso de Moodle.",
  classroomDone: "Aula conectada. La conversación vuelve a empezar con ella.",
  classroomSignIn: "La primera vez que miyagi entre en el curso se abrirá una ventana de Moodle para que inicies sesión tú: tu contraseña no pasa por miyagi.",
  connectClassroom: "Conectar un aula",
  noneInstalled: "Ninguna extensión instalada. Mira el catálogo.",
  forAll: "todas las asignaturas",
  forThis: "solo esta asignatura",
  on: "Encendida",
  off: "Apagada",
  notRunning: (why) => `No funciona: ${why}`,
  options: "Opciones",
  update: "Actualizar",
  updateAll: "Buscar actualizaciones",
  updated: (names) => `Actualizado: ${names}.`,
  upToDate: "Todo está al día.",
  remove: "Quitar",
  removeTitle: (name) => `¿Quitar ${name}?`,
  removeText: "miyagi deja de poder usarla en todas las asignaturas donde estaba.",
  removeData: "Borrar también sus datos (su sesión iniciada, lo que guardó)",
  removed: (name) => `${name} quitada.`,
  trustTitle: "Extensiones de esta asignatura",
  trustText: (names) => `Esta asignatura trae extensiones que aún no has aceptado en este ordenador: ${names}. No funcionan hasta que confíes en ellas.`,
  trust: "Confiar en ellas",
  noOptions: "No tiene opciones.",
  secretSet: "Guardado. Escribe para cambiarlo.",
  secretUnset: "Sin guardar",
  listHelp: "Varios, separados por comas.",
  save: "Guardar",
  saved: "Opciones guardadas.",
  needsOptions: (name) => `${name} necesita sus opciones para funcionar.`,
  search: "Buscar en el catálogo",
  installed: "Instalada",
  updateAvailable: "Hay versión nueva",
  needs: (what) => `Necesita en tu ordenador: ${what}`,
  talksTo: (hosts) => `Envía datos a: ${hosts}`,
  foreignTitle: (market) => `Viene del repositorio «${market}»`,
  foreignText: "No es el repositorio oficial de miyagi. Sus extensiones funcionan en tu ordenador con tus permisos: instálala solo si confías en quien la publica.",
  installAnyway: "Instalar igualmente",
  installedNow: (name) => `${name} instalada y en marcha.`,
  noResults: "Nada en el catálogo con eso.",
  official: "oficial",
  extensionsCount: (n) => (n === 1 ? "1 extensión" : `${n} extensiones`),
  addRepo: "Añadir un repositorio",
  repoSource: "Dónde está",
  repoSourceHelp: "Una dirección git (https://….git), propietario/repositorio de GitHub o una carpeta.",
  review: "Revisar",
  repoBy: (name, owner) => `«${name}», de ${owner}`,
  repoWarning: "Sus extensiones funcionan en tu ordenador con tus permisos y no es el repositorio de miyagi: añádelo solo si confías en quien lo publica.",
  typeName: (name) => `Escribe su nombre (${name}) para añadirlo`,
  add: "Añadir",
  added: (name) => `Repositorio «${name}» añadido: sus extensiones están en el catálogo.`,
  nameMismatch: "El nombre no coincide: no se ha añadido.",
  forget: "Olvidar",
  forgotten: (name) => `Repositorio «${name}» olvidado. Lo instalado de él sigue instalado.`,
  cancel: "Cancelar",
  close: "Cerrar",
  tagline: "Asistente de IA para docentes",
  menu: "Menú",
  navChat: "Conversación",
  secClassroom: "Aula",
  navClassroom: "Tu aula",
  secMiyagi: "miyagi",
  navExtensions: "Extensiones",
  secConversations: "Conversaciones",
  withClassroom: "con aula",
  withoutClassroom: "sin aula",
  actions: "Acciones",
  quick: { prepare: "Preparar el próximo tema", grade: "Corregir lo pendiente", forum: "Responder dudas del foro", ingest: "Incorporar mis documentos" },
  quickPrompts: { prepare: "Prepara el próximo tema.", grade: "Corrige lo que hay pendiente de corregir.", forum: "¿Hay dudas sin responder en el foro?", ingest: "Incorpora los documentos nuevos de sources/ a la base de conocimiento." },
  capsButton: "Capacidades",
  capsTitle: "Lo que puedo hacer aquí",
  extSubtitle: "lo que miyagi puede hacer",
  classroomSubtitle: "el curso de Moodle de esta asignatura",
  canI: "Puedo…",
  thanksTo: "Gracias a",
  yes: "sí",
  notOnThisComputer: "aquí no",
  core: "núcleo",
  coreRow: "Preparar la programación, los temas y los materiales",
  classroomRow: "Corregir, responder en el foro y publicar en tu aula",
  capsNote: "Las habilidades dicen lo que sé hacer; las capacidades, lo que puedo hacer. Una habilidad que necesita una capacidad que no tengo no se ofrece.",
  upToDateBadge: "al día",
  details: "Qué declara",
  declares: "Lo que declara",
  network: "Servidores remotos",
  onlyThisComputer: "ninguno: sus programas funcionan en tu ordenador",
  requires: "Necesita en tu ordenador",
  nothing: "nada",
  gives: "Capacidades que aporta",
  addTitle: (name) => `Añadir ${name}`,
  addButton: "Añadir",
  installNote: "Se instala una vez en tu ordenador, para todas tus asignaturas, y queda fijada con su versión y su huella.",
  foreignBadge: "sin revisar",
  linkTitle: "Vincular un aula",
  linkButton: "＋ Vincular un aula",
  linkKind: "Tipo de aula",
  next: "Siguiente",
  linkStep2: "Instalo la extensión del aula (moodle-teacher) si no la tienes y le doy tu campus y este curso; solo podrá entrar en tus cursos vinculados.",
  linkStep2Note: "La primera vez que entre en el curso se abrirá una ventana de tu campus para que inicies sesión como siempre, con tu usuario, tu contraseña y el doble factor si lo tienes. Yo nunca veo tu contraseña.",
  link: "Vincular",
  linked: (host, course) => `Aula vinculada: ${host}, curso ${course}.`,
  linkedNote: "Vuelvo a abrir la conversación con el aula.",
  done: "Hecho",
  moodleCourse: (course) => `Curso con id ${course}`,
  connectedBadge: "vinculada",
  offBadge: "sin conexión",
};

const en: ExtTexts = {
  title: "What miyagi can do",
  open: "Extensions",
  tabs: { capabilities: "Capabilities", installed: "Installed", catalog: "Catalog", repositories: "Repositories" },
  loading: "Loading…",
  busy: "miyagi is working: wait for it to finish.",
  failed: (why) => `It couldn't be done: ${why}`,
  canDo: "It can",
  canDoNone: "Only what comes with it: prepare material, read your sources and keep the subject's knowledge base.",
  notHere: "Not on this computer",
  missingTitle: "It lacks",
  missingNone: "Nothing: everything miyagi knows how to do has what it needs.",
  providedBy: (names) => `Provided by: ${names}`,
  notOffered: "No extension in the catalog offers it yet.",
  install: "Install",
  installing: "Installing…",
  stillWorking: "Still working, one moment…",
  updating: "Checking for updates…",
  reviewing: "Reading the repository…",
  adding: "Adding the repository…",
  classroomTitle: "Your classroom",
  classroomConnected: (host, course) => `Connected to ${host}, course ${course}. miyagi can grade submissions, answer in the forum and publish content, always with your approval.`,
  classroomOff: (host, course) => `Your classroom (${host}, course ${course}) is out of reach: the classroom extension is missing or turned off.`,
  classroomReconnect: "Connect again",
  classroomNone: "Without a classroom, miyagi prepares material here. Connect your Moodle course so it can also grade submissions, answer in the forum and publish, always with your approval.",
  classroomUrl: "Course address",
  classroomUrlHelp: "Copy your course's address from the browser, like https://campus.myschool.org/course/view.php?id=12.",
  classroomCourse: "Course number (the id in its address)",
  classroomConnect: "Connect the classroom",
  classroomConnecting: "Connecting… (it installs the classroom extension the first time)",
  classroomInvalid: "That doesn't look like a Moodle course's address.",
  classroomDone: "Classroom connected. The conversation starts again with it.",
  classroomSignIn: "The first time miyagi enters the course, a Moodle window opens for you to sign in yourself: your password never goes through miyagi.",
  connectClassroom: "Connect a classroom",
  noneInstalled: "No extensions installed. Have a look at the catalog.",
  forAll: "every subject",
  forThis: "this subject only",
  on: "On",
  off: "Off",
  notRunning: (why) => `Not working: ${why}`,
  options: "Options",
  update: "Update",
  updateAll: "Check for updates",
  updated: (names) => `Updated: ${names}.`,
  upToDate: "Everything is up to date.",
  remove: "Remove",
  removeTitle: (name) => `Remove ${name}?`,
  removeText: "miyagi can no longer use it in any subject where it was.",
  removeData: "Also delete its data (its sign-in, what it kept)",
  removed: (name) => `${name} removed.`,
  trustTitle: "This subject's extensions",
  trustText: (names) => `This subject brings extensions you haven't accepted on this computer yet: ${names}. They don't run until you trust them.`,
  trust: "Trust them",
  noOptions: "It has no options.",
  secretSet: "Saved. Type to change it.",
  secretUnset: "Not saved",
  listHelp: "Several, separated by commas.",
  save: "Save",
  saved: "Options saved.",
  needsOptions: (name) => `${name} needs its options to work.`,
  search: "Search the catalog",
  installed: "Installed",
  updateAvailable: "New version",
  needs: (what) => `Needs on your computer: ${what}`,
  talksTo: (hosts) => `Sends data to: ${hosts}`,
  foreignTitle: (market) => `It comes from the repository "${market}"`,
  foreignText: "It isn't miyagi's official repository. Its extensions run on your computer with your permissions: install it only if you trust who publishes it.",
  installAnyway: "Install anyway",
  installedNow: (name) => `${name} installed and running.`,
  noResults: "Nothing in the catalog matches.",
  official: "official",
  extensionsCount: (n) => (n === 1 ? "1 extension" : `${n} extensions`),
  addRepo: "Add a repository",
  repoSource: "Where it is",
  repoSourceHelp: "A git address (https://….git), a GitHub owner/repository or a folder.",
  review: "Review",
  repoBy: (name, owner) => `"${name}", by ${owner}`,
  repoWarning: "Its extensions run on your computer with your permissions and it isn't miyagi's repository: add it only if you trust who publishes it.",
  typeName: (name) => `Type its name (${name}) to add it`,
  add: "Add",
  added: (name) => `Repository "${name}" added: its extensions are in the catalog.`,
  nameMismatch: "The name doesn't match: nothing was added.",
  forget: "Forget",
  forgotten: (name) => `Repository "${name}" forgotten. What you installed from it stays installed.`,
  cancel: "Cancel",
  close: "Close",
  tagline: "AI assistant for teachers",
  menu: "Menu",
  navChat: "Conversation",
  secClassroom: "Classroom",
  navClassroom: "Your classroom",
  secMiyagi: "miyagi",
  navExtensions: "Extensions",
  secConversations: "Conversations",
  withClassroom: "with a classroom",
  withoutClassroom: "no classroom",
  actions: "Actions",
  quick: { prepare: "Prepare the next topic", grade: "Grade what's pending", forum: "Answer forum questions", ingest: "Take in my documents" },
  quickPrompts: { prepare: "Prepare the next topic.", grade: "Grade what's pending.", forum: "Are there unanswered questions in the forum?", ingest: "Take the new documents in sources/ into the knowledge base." },
  capsButton: "Capabilities",
  capsTitle: "What I can do here",
  extSubtitle: "what miyagi can do",
  classroomSubtitle: "this subject's Moodle course",
  canI: "I can…",
  thanksTo: "Thanks to",
  yes: "yes",
  notOnThisComputer: "not here",
  core: "core",
  coreRow: "Prepare the teaching plan, the topics and the materials",
  classroomRow: "Grade, answer in the forum and publish in your classroom",
  capsNote: "Skills say what I know how to do; capabilities, what I can do. A skill that needs a capability I don't have isn't offered.",
  upToDateBadge: "up to date",
  details: "What it declares",
  declares: "What it declares",
  network: "Remote servers",
  onlyThisComputer: "none: its programs run on your computer",
  requires: "Needs on your computer",
  nothing: "nothing",
  gives: "Capabilities it gives",
  addTitle: (name) => `Add ${name}`,
  addButton: "Add",
  installNote: "It's installed once on your computer, for all your subjects, pinned with its version and fingerprint.",
  foreignBadge: "not reviewed",
  linkTitle: "Link a classroom",
  linkButton: "＋ Link a classroom",
  linkKind: "Kind of classroom",
  next: "Next",
  linkStep2: "I install the classroom extension (moodle-teacher) if you don't have it and give it your campus and this course; it can only enter your linked courses.",
  linkStep2Note: "The first time it enters the course, a window of your campus opens for you to sign in as usual, with your username, password and second factor if you have one. I never see your password.",
  link: "Link",
  linked: (host, course) => `Classroom linked: ${host}, course ${course}.`,
  linkedNote: "I'm opening the conversation again with the classroom.",
  done: "Done",
  moodleCourse: (course) => `Course id ${course}`,
  connectedBadge: "linked",
  offBadge: "not connected",
};

const fr: ExtTexts = {
  title: "Ce que miyagi peut faire",
  open: "Extensions",
  tabs: { capabilities: "Capacités", installed: "Installées", catalog: "Catalogue", repositories: "Dépôts" },
  loading: "Chargement…",
  busy: "miyagi travaille : attends qu'il ait fini.",
  failed: (why) => `Impossible : ${why}`,
  canDo: "Il peut déjà",
  canDoNone: "Seulement ce qui vient avec lui : préparer du matériel, lire tes sources et tenir la base de connaissances de la matière.",
  notHere: "Pas sur cet ordinateur",
  missingTitle: "Il lui manque",
  missingNone: "Rien : tout ce que miyagi sait faire a ce qu'il faut.",
  providedBy: (names) => `Fourni par : ${names}`,
  notOffered: "Aucune extension du catalogue ne le propose encore.",
  install: "Installer",
  installing: "Installation…",
  stillWorking: "Toujours en cours, un instant…",
  updating: "Recherche de mises à jour…",
  reviewing: "Lecture du dépôt…",
  adding: "Ajout du dépôt…",
  classroomTitle: "Ta classe",
  classroomConnected: (host, course) => `Connectée à ${host}, cours ${course}. miyagi peut corriger les devoirs, répondre dans le forum et publier du contenu, toujours avec ton accord.`,
  classroomOff: (host, course) => `Ta classe (${host}, cours ${course}) est hors de portée : l'extension de la classe manque ou est désactivée.`,
  classroomReconnect: "Reconnecter",
  classroomNone: "Sans classe, miyagi prépare le matériel ici. Connecte ton cours Moodle pour qu'il corrige aussi les devoirs, réponde dans le forum et publie, toujours avec ton accord.",
  classroomUrl: "Adresse du cours",
  classroomUrlHelp: "Copie l'adresse de ton cours depuis le navigateur, comme https://campus.monecole.fr/course/view.php?id=12.",
  classroomCourse: "Numéro du cours (l'id de son adresse)",
  classroomConnect: "Connecter la classe",
  classroomConnecting: "Connexion… (installe l'extension de la classe la première fois)",
  classroomInvalid: "Cela ne ressemble pas à l'adresse d'un cours Moodle.",
  classroomDone: "Classe connectée. La conversation recommence avec elle.",
  classroomSignIn: "La première fois que miyagi entre dans le cours, une fenêtre Moodle s'ouvre pour que tu te connectes toi-même : ton mot de passe ne passe jamais par miyagi.",
  connectClassroom: "Connecter une classe",
  noneInstalled: "Aucune extension installée. Regarde le catalogue.",
  forAll: "toutes les matières",
  forThis: "cette matière seulement",
  on: "Activée",
  off: "Désactivée",
  notRunning: (why) => `Ne fonctionne pas : ${why}`,
  options: "Options",
  update: "Mettre à jour",
  updateAll: "Chercher des mises à jour",
  updated: (names) => `Mis à jour : ${names}.`,
  upToDate: "Tout est à jour.",
  remove: "Retirer",
  removeTitle: (name) => `Retirer ${name} ?`,
  removeText: "miyagi ne pourra plus l'utiliser dans aucune des matières où elle était.",
  removeData: "Supprimer aussi ses données (sa connexion, ce qu'elle a gardé)",
  removed: (name) => `${name} retirée.`,
  trustTitle: "Les extensions de cette matière",
  trustText: (names) => `Cette matière apporte des extensions que tu n'as pas encore acceptées sur cet ordinateur : ${names}. Elles ne fonctionnent pas tant que tu ne leur fais pas confiance.`,
  trust: "Leur faire confiance",
  noOptions: "Elle n'a pas d'options.",
  secretSet: "Enregistré. Écris pour le changer.",
  secretUnset: "Non enregistré",
  listHelp: "Plusieurs, séparés par des virgules.",
  save: "Enregistrer",
  saved: "Options enregistrées.",
  needsOptions: (name) => `${name} a besoin de ses options pour fonctionner.`,
  search: "Chercher dans le catalogue",
  installed: "Installée",
  updateAvailable: "Nouvelle version",
  needs: (what) => `A besoin sur ton ordinateur : ${what}`,
  talksTo: (hosts) => `Envoie des données à : ${hosts}`,
  foreignTitle: (market) => `Elle vient du dépôt « ${market} »`,
  foreignText: "Ce n'est pas le dépôt officiel de miyagi. Ses extensions fonctionnent sur ton ordinateur avec tes droits : installe-la seulement si tu as confiance en qui la publie.",
  installAnyway: "Installer quand même",
  installedNow: (name) => `${name} installée et en marche.`,
  noResults: "Rien dans le catalogue ne correspond.",
  official: "officiel",
  extensionsCount: (n) => (n === 1 ? "1 extension" : `${n} extensions`),
  addRepo: "Ajouter un dépôt",
  repoSource: "Où il se trouve",
  repoSourceHelp: "Une adresse git (https://….git), propriétaire/dépôt GitHub ou un dossier.",
  review: "Examiner",
  repoBy: (name, owner) => `« ${name} », de ${owner}`,
  repoWarning: "Ses extensions fonctionnent sur ton ordinateur avec tes droits et ce n'est pas le dépôt de miyagi : ajoute-le seulement si tu as confiance en qui le publie.",
  typeName: (name) => `Écris son nom (${name}) pour l'ajouter`,
  add: "Ajouter",
  added: (name) => `Dépôt « ${name} » ajouté : ses extensions sont dans le catalogue.`,
  nameMismatch: "Le nom ne correspond pas : rien n'a été ajouté.",
  forget: "Oublier",
  forgotten: (name) => `Dépôt « ${name} » oublié. Ce que tu en as installé reste installé.`,
  cancel: "Annuler",
  close: "Fermer",
  tagline: "Assistant IA pour enseignants",
  menu: "Menu",
  navChat: "Conversation",
  secClassroom: "Classe",
  navClassroom: "Ta classe",
  secMiyagi: "miyagi",
  navExtensions: "Extensions",
  secConversations: "Conversations",
  withClassroom: "avec classe",
  withoutClassroom: "sans classe",
  actions: "Actions",
  quick: { prepare: "Préparer le prochain thème", grade: "Corriger ce qui attend", forum: "Répondre aux questions du forum", ingest: "Intégrer mes documents" },
  quickPrompts: { prepare: "Prépare le prochain thème.", grade: "Corrige ce qui attend d'être corrigé.", forum: "Y a-t-il des questions sans réponse dans le forum ?", ingest: "Intègre les nouveaux documents de sources/ à la base de connaissances." },
  capsButton: "Capacités",
  capsTitle: "Ce que je peux faire ici",
  extSubtitle: "ce que miyagi peut faire",
  classroomSubtitle: "le cours Moodle de cette matière",
  canI: "Je peux…",
  thanksTo: "Grâce à",
  yes: "oui",
  notOnThisComputer: "pas ici",
  core: "noyau",
  coreRow: "Préparer la progression, les thèmes et le matériel",
  classroomRow: "Corriger, répondre dans le forum et publier dans ta classe",
  capsNote: "Les compétences disent ce que je sais faire ; les capacités, ce que je peux faire. Une compétence qui a besoin d'une capacité que je n'ai pas n'est pas proposée.",
  upToDateBadge: "à jour",
  details: "Ce qu'elle déclare",
  declares: "Ce qu'elle déclare",
  network: "Serveurs distants",
  onlyThisComputer: "aucun : ses programmes tournent sur ton ordinateur",
  requires: "A besoin sur ton ordinateur",
  nothing: "rien",
  gives: "Capacités apportées",
  addTitle: (name) => `Ajouter ${name}`,
  addButton: "Ajouter",
  installNote: "Elle s'installe une fois sur ton ordinateur, pour toutes tes matières, figée avec sa version et son empreinte.",
  foreignBadge: "non vérifié",
  linkTitle: "Lier une classe",
  linkButton: "＋ Lier une classe",
  linkKind: "Type de classe",
  next: "Suivant",
  linkStep2: "J'installe l'extension de la classe (moodle-teacher) si tu ne l'as pas et je lui donne ton campus et ce cours ; elle ne pourra entrer que dans tes cours liés.",
  linkStep2Note: "La première fois qu'elle entre dans le cours, une fenêtre de ton campus s'ouvre pour que tu te connectes comme d'habitude, avec ton identifiant, ton mot de passe et le double facteur si tu l'as. Je ne vois jamais ton mot de passe.",
  link: "Lier",
  linked: (host, course) => `Classe liée : ${host}, cours ${course}.`,
  linkedNote: "Je rouvre la conversation avec la classe.",
  done: "Terminé",
  moodleCourse: (course) => `Cours id ${course}`,
  connectedBadge: "liée",
  offBadge: "non connectée",
};

const de: ExtTexts = {
  title: "Was miyagi kann",
  open: "Erweiterungen",
  tabs: { capabilities: "Fähigkeiten", installed: "Installiert", catalog: "Katalog", repositories: "Repositorys" },
  loading: "Wird geladen…",
  busy: "miyagi arbeitet: warte, bis es fertig ist.",
  failed: (why) => `Das ging nicht: ${why}`,
  canDo: "Es kann schon",
  canDoNone: "Nur das Mitgelieferte: Material vorbereiten, deine Quellen lesen und die Wissensbasis des Fachs führen.",
  notHere: "Nicht auf diesem Computer",
  missingTitle: "Es fehlt",
  missingNone: "Nichts: Alles, was miyagi kann, hat, was es braucht.",
  providedBy: (names) => `Bereitgestellt von: ${names}`,
  notOffered: "Noch keine Erweiterung im Katalog bietet das an.",
  install: "Installieren",
  installing: "Wird installiert…",
  stillWorking: "Arbeitet noch, einen Moment…",
  updating: "Suche nach Aktualisierungen…",
  reviewing: "Repository wird gelesen…",
  adding: "Repository wird hinzugefügt…",
  classroomTitle: "Dein Kursraum",
  classroomConnected: (host, course) => `Verbunden mit ${host}, Kurs ${course}. miyagi kann Abgaben bewerten, im Forum antworten und Inhalte veröffentlichen, immer mit deiner Zustimmung.`,
  classroomOff: (host, course) => `Dein Kursraum (${host}, Kurs ${course}) ist nicht erreichbar: Die Kursraum-Erweiterung fehlt oder ist ausgeschaltet.`,
  classroomReconnect: "Erneut verbinden",
  classroomNone: "Ohne Kursraum bereitet miyagi das Material hier vor. Verbinde deinen Moodle-Kurs, damit es auch Abgaben bewertet, im Forum antwortet und veröffentlicht, immer mit deiner Zustimmung.",
  classroomUrl: "Adresse des Kurses",
  classroomUrlHelp: "Kopiere die Adresse deines Kurses aus dem Browser, etwa https://campus.meineschule.de/course/view.php?id=12.",
  classroomCourse: "Kursnummer (die id in seiner Adresse)",
  classroomConnect: "Kursraum verbinden",
  classroomConnecting: "Verbinde… (beim ersten Mal wird die Kursraum-Erweiterung installiert)",
  classroomInvalid: "Das sieht nicht nach der Adresse eines Moodle-Kurses aus.",
  classroomDone: "Kursraum verbunden. Das Gespräch beginnt mit ihm neu.",
  classroomSignIn: "Wenn miyagi den Kurs zum ersten Mal betritt, öffnet sich ein Moodle-Fenster, in dem du dich selbst anmeldest: Dein Passwort geht nie durch miyagi.",
  connectClassroom: "Kursraum verbinden",
  noneInstalled: "Keine Erweiterungen installiert. Schau in den Katalog.",
  forAll: "alle Fächer",
  forThis: "nur dieses Fach",
  on: "An",
  off: "Aus",
  notRunning: (why) => `Funktioniert nicht: ${why}`,
  options: "Optionen",
  update: "Aktualisieren",
  updateAll: "Nach Updates suchen",
  updated: (names) => `Aktualisiert: ${names}.`,
  upToDate: "Alles ist aktuell.",
  remove: "Entfernen",
  removeTitle: (name) => `${name} entfernen?`,
  removeText: "miyagi kann sie in keinem Fach mehr nutzen, in dem sie war.",
  removeData: "Auch ihre Daten löschen (ihre Anmeldung, was sie gespeichert hat)",
  removed: (name) => `${name} entfernt.`,
  trustTitle: "Erweiterungen dieses Fachs",
  trustText: (names) => `Dieses Fach bringt Erweiterungen mit, die du auf diesem Computer noch nicht angenommen hast: ${names}. Sie laufen erst, wenn du ihnen vertraust.`,
  trust: "Ihnen vertrauen",
  noOptions: "Sie hat keine Optionen.",
  secretSet: "Gespeichert. Tippe, um es zu ändern.",
  secretUnset: "Nicht gespeichert",
  listHelp: "Mehrere, durch Kommas getrennt.",
  save: "Speichern",
  saved: "Optionen gespeichert.",
  needsOptions: (name) => `${name} braucht seine Optionen, um zu funktionieren.`,
  search: "Im Katalog suchen",
  installed: "Installiert",
  updateAvailable: "Neue Version",
  needs: (what) => `Braucht auf deinem Computer: ${what}`,
  talksTo: (hosts) => `Sendet Daten an: ${hosts}`,
  foreignTitle: (market) => `Sie kommt aus dem Repository „${market}“`,
  foreignText: "Es ist nicht das offizielle Repository von miyagi. Seine Erweiterungen laufen auf deinem Computer mit deinen Rechten: installiere sie nur, wenn du dem Herausgeber vertraust.",
  installAnyway: "Trotzdem installieren",
  installedNow: (name) => `${name} installiert und in Betrieb.`,
  noResults: "Nichts im Katalog passt dazu.",
  official: "offiziell",
  extensionsCount: (n) => (n === 1 ? "1 Erweiterung" : `${n} Erweiterungen`),
  addRepo: "Repository hinzufügen",
  repoSource: "Wo es liegt",
  repoSourceHelp: "Eine Git-Adresse (https://….git), GitHub-Besitzer/Repository oder ein Ordner.",
  review: "Prüfen",
  repoBy: (name, owner) => `„${name}“, von ${owner}`,
  repoWarning: "Seine Erweiterungen laufen auf deinem Computer mit deinen Rechten, und es ist nicht das Repository von miyagi: füge es nur hinzu, wenn du dem Herausgeber vertraust.",
  typeName: (name) => `Tippe seinen Namen (${name}), um es hinzuzufügen`,
  add: "Hinzufügen",
  added: (name) => `Repository „${name}“ hinzugefügt: Seine Erweiterungen sind im Katalog.`,
  nameMismatch: "Der Name stimmt nicht: Nichts wurde hinzugefügt.",
  forget: "Vergessen",
  forgotten: (name) => `Repository „${name}“ vergessen. Was du daraus installiert hast, bleibt installiert.`,
  cancel: "Abbrechen",
  close: "Schließen",
  tagline: "KI-Assistent für Lehrkräfte",
  menu: "Menü",
  navChat: "Gespräch",
  secClassroom: "Kursraum",
  navClassroom: "Dein Kursraum",
  secMiyagi: "miyagi",
  navExtensions: "Erweiterungen",
  secConversations: "Gespräche",
  withClassroom: "mit Kursraum",
  withoutClassroom: "ohne Kursraum",
  actions: "Aktionen",
  quick: { prepare: "Nächstes Thema vorbereiten", grade: "Offenes bewerten", forum: "Forumsfragen beantworten", ingest: "Meine Dokumente aufnehmen" },
  quickPrompts: { prepare: "Bereite das nächste Thema vor.", grade: "Bewerte, was noch offen ist.", forum: "Gibt es unbeantwortete Fragen im Forum?", ingest: "Nimm die neuen Dokumente aus sources/ in die Wissensbasis auf." },
  capsButton: "Fähigkeiten",
  capsTitle: "Was ich hier kann",
  extSubtitle: "was miyagi kann",
  classroomSubtitle: "der Moodle-Kurs dieses Fachs",
  canI: "Ich kann…",
  thanksTo: "Dank",
  yes: "ja",
  notOnThisComputer: "hier nicht",
  core: "Kern",
  coreRow: "Planung, Themen und Material vorbereiten",
  classroomRow: "Bewerten, im Forum antworten und im Kursraum veröffentlichen",
  capsNote: "Skills sagen, was ich zu tun weiß; Fähigkeiten, was ich tun kann. Ein Skill, der eine Fähigkeit braucht, die ich nicht habe, wird nicht angeboten.",
  upToDateBadge: "aktuell",
  details: "Was sie angibt",
  declares: "Was sie angibt",
  network: "Entfernte Server",
  onlyThisComputer: "keine: ihre Programme laufen auf deinem Computer",
  requires: "Braucht auf deinem Computer",
  nothing: "nichts",
  gives: "Fähigkeiten, die sie bringt",
  addTitle: (name) => `${name} hinzufügen`,
  addButton: "Hinzufügen",
  installNote: "Sie wird einmal auf deinem Computer installiert, für alle deine Fächer, festgelegt mit Version und Fingerabdruck.",
  foreignBadge: "nicht geprüft",
  linkTitle: "Kursraum verknüpfen",
  linkButton: "＋ Kursraum verknüpfen",
  linkKind: "Art des Kursraums",
  next: "Weiter",
  linkStep2: "Ich installiere die Kursraum-Erweiterung (moodle-teacher), falls du sie nicht hast, und gebe ihr deinen Campus und diesen Kurs; sie kann nur deine verknüpften Kurse betreten.",
  linkStep2Note: "Wenn sie den Kurs zum ersten Mal betritt, öffnet sich ein Fenster deines Campus, in dem du dich wie gewohnt anmeldest, mit Benutzername, Passwort und zweitem Faktor, falls vorhanden. Ich sehe dein Passwort nie.",
  link: "Verknüpfen",
  linked: (host, course) => `Kursraum verknüpft: ${host}, Kurs ${course}.`,
  linkedNote: "Ich öffne das Gespräch mit dem Kursraum neu.",
  done: "Fertig",
  moodleCourse: (course) => `Kurs-id ${course}`,
  connectedBadge: "verknüpft",
  offBadge: "nicht verbunden",
};

const ALL: Record<string, ExtTexts> = { es, en, fr, de };

/** The view's texts for a language code, as `texts()` picks the chat's. */
export function extTexts(language: string | undefined): ExtTexts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
