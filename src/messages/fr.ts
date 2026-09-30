import type { Messages } from "./en.js";

export const fr: Messages = {
  help: (globalConfigPath) => `teacher-agent [<commande>] [options]

Commandes :
  init [--dir <chemin>]
      Crée un nouvel espace de travail dans le dossier indiqué (ou l'actuel) et propose
      ensuite d'explorer ce que permet ce Moodle.
  run [--dir <chemin>] [--mode interactive|guided|autonomous] [--headless] [--plain] [--task "<texte>"]
      Gère le cours d'une traite : corrige les devoirs en attente, répond sur le forum,
      revoit ou ajoute du contenu et résume la progression de la classe. Sans --mode,
      demande le mode. Avec --task, ne fait que cette tâche (p. ex. --task "construis un
      cours d'introduction à Docker en 3 thèmes" ou --task "corrige le Devoir 2").
  chat [--dir <chemin>] [--headless] [--inline] [--plain] [--continue]
      Conversation en plein écran. Commence en mode guided ; Maj+Tab bascule vers
      interactive. --inline garde la conversation dans l'historique du terminal et
      --plain utilise le chat en texte simple. --continue reprend la dernière
      conversation de ce cours, et /resume, dans le chat, permet d'en choisir une autre.
  explore [--dir <chemin>] [--headless] [--plain]
      Regarde (sans rien créer) quels types d'activité et de question admet ce Moodle et
      les note dans knowledge/moodle-capabilities.md.
  ingest [--dir <chemin>] [--plain] [fichiers...]
      Ajoute à la base de connaissances (knowledge/) les fichiers indiqués ou, sans
      fichier, tout ce qui est dans sources/ et n'y est pas encore. Sans navigateur ni
      Moodle.
  skills [--dir <chemin>]
      Liste les compétences disponibles : celles intégrées et celles de l'espace de
      travail (<workspace>/.claude/skills/).
  commands [--dir <chemin>]
      Liste les commandes slash utilisables dans "chat".

Options :
  -h, --help         Affiche cette aide.
  -v, --version      Affiche la version installée.
  --language=<code>  Langue des textes de teacher-agent et du chat : es, en, fr ou de
                     (par défaut, celle de "agent.language" de l'espace de travail, ou
                     celle du système).

Chaque espace de travail est un dossier (l'actuel, ou celui donné avec --dir) avec son
propre config.json, comme un dépôt git. Sans arguments, teacher-agent demande si vous
voulez "run" ou "chat" et utilise le dossier actuel ; si ce n'est pas encore un espace de
travail, il le configure et s'arrête (relancez-le pour commencer). --headless (demande des
identifiants enregistrés) et la langue préférée peuvent aussi être fixés durablement :
dans le config.json de l'espace de travail ("agent.headless", "agent.language") ou, pour
tous, dans ${globalConfigPath} ("defaultHeadless", "defaultLanguage"). Voir
README.md pour plus de détails.`,
  alreadyWorkspace: (dir) => `${dir} est déjà un espace de travail teacher-agent (config.json existe). Choisissez un autre dossier.`,
  exploreFailed: (reason) => `Impossible d'explorer le Moodle (${reason}). L'espace de travail est créé ; vous pouvez réessayer avec "teacher-agent explore".`,
  catalogBuiltin: "[intégrée]",
  catalogCustom: "[propre]",
  skillsTitle: (dir) => `Compétences disponibles dans ${dir}`,
  commandsTitle: (dir) => `Commandes disponibles dans ${dir} (dans "chat")`,
  unknownCommand: (command) => `Commande inconnue "${command}". Utilisez teacher-agent --help.`,

  initHeading: (dir) => `\n=== Configuration d'un espace de travail dans ${dir} ===`,
  required: "Obligatoire",
  moodleUrl: "URL de Moodle (ou collez l'URL complète du cours, p. ex. https://moodle.monuniversite.fr/course/view.php?id=4) :",
  courseId: "ID du cours :",
  username: "Utilisateur avec le rôle d'enseignant (laissez vide pour vous connecter à la main) :",
  password: "Mot de passe :",
  label: "Libellé :",
  description: "Description (facultative) :",
  persona: "Ton de l'agent (forums, retours, annonces) :",
  personaNone: "Pas de préférence (ton neutre)",
  personaFormal: "Formel",
  personaWarm: "Chaleureux",
  personaMotivating: "Chaleureux et motivant",
  conversationLanguage: "Langue dans laquelle vous préférez parler à l'agent (vide, pas de préférence : il répondra dans la langue que vous utilisez) :",
  practiceRunnerQuestion:
    "Autoriser l'agent à tester des activités pratiques dans des conteneurs Docker (p. ex. vérifier qu'un énoncé " +
    "fonctionne avant de le publier, ou exécuter un rendu en le corrigeant) ? Il ne travaille que dans le dossier " +
    "practice/ de l'espace de travail et seulement avec Docker ; il n'installe jamais rien : si Docker n'est pas installé, il vous le dit.",
  practiceRunnerNote:
    "Note : cet espace de travail n'a pas encore configuré une capacité facultative — tester des activités pratiques " +
    "(un Dockerfile, un script, le code d'un rendu) dans des conteneurs Docker, avant de les publier ou en les " +
    'corrigeant. Désactivée par défaut ; changez-la à la main dans config.json ("agent.allowPracticeRunner": true/false) ou répondez à la question ci-dessous.',
  createInstructions: "Créer instructions.md pour ajouter vos propres instructions à l'agent ? (facultatif, vous pouvez le faire à la main plus tard)",
  workspaceCreated: (dir) => `Espace de travail créé dans ${dir}\n`,
  exploreNow:
    "Explorer maintenant quels types d'activité et de question admet ce Moodle ? (il se connecte et ne fait que " +
    'regarder, sans rien créer ; vous pouvez aussi le faire plus tard avec "teacher-agent explore")',
  whatToDo: "Que voulez-vous faire ?",
  kindRun: "Gérer le cours d'une traite (run)",
  kindChat: "Discuter avec l'agent (chat)",
  whichMode: "Dans quel mode voulez-vous l'exécuter ?",
  modeInteractive: "interactive — s'arrête avant chaque action",
  modeGuided: "guided — ne s'arrête qu'avant de publier quelque chose de visible par les élèves",
  modeAutonomous: "autonomous — sans pauses",

  studentRole: (dir) => `${dir} est une classe avec le rôle "student" : teacher-agent n'agit qu'en tant qu'enseignant.`,
  draftsLimitsInvalid: (dir, key, valid) => `${dir}/config.json : agent.draftsLimits.${key} doit être un nombre positif, parmi : ${valid}.`,
  defaultLabel: (host, courseId) => `${host} · cours ${courseId}`,

  unknownMode: (value, valid) => `Mode inconnu "${value}". Utilisez l'un de : ${valid}.`,
  notAWorkspace: (dir) => `${dir} n'est pas un espace de travail teacher-agent (pas de config.json). Lancez "teacher-agent init" là-bas, ou passez --dir avec un espace de travail existant.`,
  contextMoved: (count, sourcesDir) => `context/ n'est plus utilisé : ses ${count} fichiers ont été déplacés vers ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ avait l'ancienne structure : il a été déplacé vers ${legacyDir} (ses fichiers téléchargés, vers ${sourcesDir}) et l'agent reconstruira la base de connaissances à partir de là.\n`,
  setupSaved: (kind, dir) => `Configuration enregistrée. Quand vous voudrez commencer : teacher-agent ${kind} --dir "${dir}"`,
  autonomousNeedsCredentials:
    "Le mode autonomous ne permet pas de se connecter à la main (aucun moyen de demander de l'aide à un humain) : enregistrez l'utilisateur et le mot de passe dans config.json, ou utilisez --mode guided/interactive.",
  headlessNeedsCredentials:
    "--headless demande des identifiants enregistrés (aucune fenêtre visible pour se connecter à la main) : enregistrez l'utilisateur et le mot de passe dans config.json, ou retirez --headless.",
  headingIngest: "Ingestion dans la base de connaissances (sans navigateur)",
  headingExplore: "Exploration des capacités de ce Moodle",
  headingMode: (mode, chat) => `Mode : ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Espace de travail : ${label} (${dir})`,
  headingSession: (dir) => `Session : ${dir}`,
  headingCourse: (url, courseId) => `Cours : ${url} (id ${courseId})\n`,
  headerWorkspace: "espace",
  headerCourse: "cours",
  welcomePlain: "teacher-agent se connecte à Moodle. Échap interrompt la réponse en cours ; /resume reprend une conversation précédente ; /exit ou Ctrl+C (sans réponse en cours) ferment la session.",
  welcomeInk: "teacher-agent se connecte à Moodle. Maj+Tab bascule entre guided et interactive, /resume reprend une conversation précédente, ? affiche les raccourcis et /exit ferme la session.",
  promptLabel: "vous>",
  exitingNow: "Sortie sans attendre. Ce qui a été enregistré jusqu'ici est déjà sur le disque.",
  interrupting: "Interruption et fermeture de la session… (Ctrl+C à nouveau pour sortir sans attendre)",
  sessionInterrupted: "Session interrompue.",
  sessionClosed: "Session fermée.",
  nothingPending: "Rien à enregistrer : tout est écrit sur le disque au fur et à mesure.",
  endTranscript: (path) => `  - Les actions de l'agent et leurs résultats : ${path}`,
  endConversation: (path) => `  - La conversation, en texte brut : ${path}`,
  endKnowledge: (path) => `  - Ce que l'agent a appris : ${path}`,
  endDrafts: (path) => `Des ressources ont été déposées masquées sur Moodle, pas encore montrées aux élèves : ${path}`,
  endInterruptedNote:
    "Ce qu'il faisait au moment de l'interruption peut être à moitié fait (une note non enregistrée, une réponse non publiée) ; à la prochaine session, vous pouvez lui demander de reprendre.",

  gateTitle: "Publication sans approbation préalable",
  gateLine: "L'agent va publier ou modifier dans Moodle quelque chose que les élèves peuvent voir, sans vous l'avoir demandé avant.",

  manualLoginTitle: "Connexion manuelle nécessaire",
  manualLoginLines: ["Aucun identifiant enregistré pour cet espace de travail.", "Connectez-vous à la main dans la fenêtre du navigateur déjà ouverte."],
  manualLoginQuestion: "Appuyez sur Entrée une fois connecté (ou 'q' pour annuler) : ",

  toolPhrases: {
    navigate: ["a ouvert {n} page", "a ouvert {n} pages"],
    back: ["est revenu en arrière", "est revenu en arrière {n} fois"],
    click: ["a cliqué {n} fois", "a cliqué {n} fois"],
    type: ["a écrit dans {n} champ", "a écrit dans {n} champs"],
    fillForm: ["a rempli {n} formulaire", "a rempli {n} formulaires"],
    select: ["a choisi {n} option", "a choisi {n} options"],
    pressKey: ["a appuyé sur {n} touche", "a appuyé sur {n} touches"],
    snapshot: ["a lu la page", "a lu la page {n} fois"],
    evaluate: ["a examiné la page", "a examiné la page {n} fois"],
    find: ["a cherché dans la page", "a cherché dans la page {n} fois"],
    wait: ["a attendu", "a attendu {n} fois"],
    upload: ["a téléversé des fichiers", "a téléversé des fichiers {n} fois"],
    screenshot: ["a pris {n} capture", "a pris {n} captures"],
    approval: ["a demandé une approbation", "a demandé une approbation {n} fois"],
    download: ["a téléchargé {n} fichier", "a téléchargé {n} fichiers"],
    files: ["a travaillé sur des fichiers", "a travaillé sur des fichiers {n} fois"],
    pdf: ["a créé {n} PDF", "a créé {n} PDF"],
  },

  tool: {
    navigate: (url) => `Ouverture de ${url}`,
    aPage: "une page",
    back: "Retour à la page précédente",
    forward: "Passage à la page suivante",
    snapshot: "Lecture de la structure de la page",
    click: (element) => `Clic sur « ${element} »`,
    hover: (element) => `Survol de « ${element} »`,
    drag: (from, to) => `Glissement de « ${from} » vers « ${to} »`,
    select: (values, element) => `Choix de « ${values} » dans « ${element} »`,
    type: (text, element) => `Saisie de « ${text} » dans « ${element} »`,
    anElement: "un élément",
    anotherElement: "un autre élément",
    aDropdown: "une liste déroulante",
    aField: "un champ",
    pressKey: (key) => `Appui sur la touche « ${key} »`,
    waitFor: (text) => `Attente de l'apparition de « ${text} »`,
    waitGone: (text) => `Attente de la disparition de « ${text} »`,
    waitSeconds: (seconds) => `Attente de ${seconds} s`,
    wait: "Attente",
    findText: (text) => `Recherche de « ${text} » dans la page`,
    findPattern: (pattern) => `Recherche du motif « ${pattern} » dans la page`,
    find: "Recherche dans la page",
    fillForm: (fields) => `Remplissage d'un formulaire (${fields} champ${fields === 1 ? "" : "s"})`,
    upload: "Envoi de fichiers",
    evaluate: {
      editor: "Écriture dans l'éditeur de texte",
      form: "Remplissage du formulaire",
      act: "Clic dans la page",
      otherPages: "Consultation d'autres pages du cours",
      formFields: "Vérification des champs du formulaire",
      table: "Lecture d'un tableau de la page",
      dialog: "Lecture d'une boîte de dialogue",
      links: "Examen des liens de la page",
      location: "Vérification de la page actuelle",
      content: "Lecture du contenu de la page",
      generic: "Examen de la page",
    },
    screenshot: "Capture d'écran",
    tabs: "Gestion des onglets",
    resize: "Redimensionnement de la fenêtre",
    close: "Fermeture du navigateur",
    console: "Vérification de la console du navigateur",
    networkRequests: "Vérification des requêtes réseau",
    saveResponse: "Enregistrement sur le disque de la réponse d'une requête",
    requestDetails: "Lecture des détails d'une requête",
    runCodeUnsafe: "Tentative d'exécuter du code sans restriction (bloquée)",
    drafts: {
      list: (p) => `Consultation de ${p} dans drafts/`,
      mkdir: (p) => `Création du dossier ${p}`,
      copy: (from, to) => `Copie de ${from} vers ${to}`,
      move: (from, to) => `Déplacement de ${from} vers ${to}`,
      del: (p) => `Suppression de ${p}`,
      download: (url) => `Téléchargement de ${url}`,
      fetchSite: (url) => `Enregistrement du site ${url}`,
      unzip: (archive) => `Décompression de ${archive}`,
      zip: (to) => `Création de l'archive ${to}`,
      pdf: (to) => `Impression de ${to}`,
      info: (p) => `Vérification du fichier ${p}`,
    },
    acceptDialog: "Acceptation d'une boîte de dialogue du navigateur",
    dismissDialog: "Fermeture d'une boîte de dialogue du navigateur",
  },
};
