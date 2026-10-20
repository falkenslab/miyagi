import type { Messages } from "./en.js";

export const fr: Messages = {
  help: (globalConfigPath) => `miyagi [<commande>] [options]

Commandes :
  init [--dir <chemin>]
      Crée une nouvelle matière dans le dossier de miyagi (~/.miyagi/workspaces/<nom>/)
      ou, avec --dir, dans ce dossier, et propose d'explorer son Moodle s'il en connecte un.
  run [--dir <chemin>] [--mode interactive|guided|autonomous] [--plain] [--task "<texte>"]
      Gère le cours d'une traite : corrige les devoirs en attente, répond sur le forum,
      revoit ou ajoute du contenu et résume la progression de la classe. Sans --mode,
      demande le mode. Avec --task, ne fait que cette tâche (p. ex. --task "construis un
      cours d'introduction à Docker en 3 thèmes" ou --task "corrige le Devoir 2").
  chat [--dir <chemin>] [--inline] [--plain] [--continue]
      Conversation en plein écran. Commence en mode guided ; Maj+Tab bascule vers
      interactive. --inline garde la conversation dans l'historique du terminal et
      --plain utilise le chat en texte simple. --continue reprend la dernière
      conversation de ce cours, et /resume, dans le chat, permet d'en choisir une autre.
  explore [--dir <chemin>] [--plain]
      Regarde (sans rien créer) quels types d'activité et de question admet ce Moodle et
      les note dans la page course/moodle-capabilities.
  ingest [--dir <chemin>] [--plain] [fichiers...]
      Ajoute à la base de connaissances (knowledge/) les fichiers indiqués ou, sans
      fichier, tout ce qui est dans sources/ et n'y est pas encore. Sans navigateur ni
      Moodle.
  skills [--dir <chemin>]
      Liste les compétences disponibles : celles intégrées et celles de l'espace de
      travail (<workspace>/.claude/skills/).
  commands [--dir <chemin>]
      Liste les commandes slash utilisables dans "chat".
  extension <list|info|add|remove|enable|disable|config|update|search|marketplace> [--dir <chemin>] [--project]
      Installe et gère des extensions, du dépôt officiel de Falken's Lab ou d'un dépôt que
      vous ajoutez : pour toutes les matières (~/.miyagi/extensions) ou, avec --project, pour celle-ci.
      "miyagi extension" seul explique chaque sous-commande.
  workspaces [forget <nom>]
      Liste vos matières avec leur dossier ; forget en retire une de la liste (son
      dossier reste).

Options :
  -h, --help         Affiche cette aide.
  -v, --version      Affiche la version installée.
  -w, --workspace <nom>  Ouvre cette matière par son nom, depuis n'importe quel dossier.
  --language=<code>  Langue des textes de miyagi et du chat : es, en, fr ou de
                     (par défaut, celle de "agent.language" de l'espace de travail, ou
                     celle du système).

Chaque matière (un espace de travail) est un dossier avec son propre config.json. Les
nouvelles vont dans ~/.miyagi/workspaces/<nom>/ et toutes sont listées dans
~/.miyagi/workspaces.json : -w <nom> l'ouvre depuis n'importe où ; --dir <chemin> marche
toujours, et dans le dossier d'une matière miyagi utilise celle-ci. Sans arguments, miyagi
demande si vous voulez "run" ou "chat" et quelle matière (ou une nouvelle). La langue préférée peut aussi être fixée durablement : dans le config.json de la
matière ("agent.language") ou, pour toutes, dans ${globalConfigPath}
("defaultLanguage"). Voir README.md pour plus de détails.`,
  alreadyWorkspace: (dir) => `${dir} est déjà une matière miyagi (config.json existe). Choisissez un autre dossier.`,
  exploreFailed: (reason) => `Impossible d'explorer le Moodle (${reason}). La matière est créée ; vous pouvez réessayer avec "miyagi explore".`,
  catalogBuiltin: "[intégrée]",
  catalogCustom: "[propre]",
  catalogExtension: (name) => `[${name}]`,
  skillsTitle: (dir) => `Compétences disponibles dans ${dir}`,
  commandsTitle: (dir) => `Commandes disponibles dans ${dir} (dans "chat")`,
  unknownCommand: (command) => `Commande inconnue "${command}". Utilisez miyagi --help.`,
  renamedCommand: "teacher-agent s'appelle désormais miyagi : utilisez la commande miyagi (teacher-agent fonctionnera encore quelque temps).",
  globalConfigMigrated: (file) => `Vos réglages de ~/.teacher-agent ont été copiés dans ${file}.`,

  initHeading: (dir) => `\n=== Préparation de la matière dans ${dir} ===`,
  initHeadingNew: "\n=== Nouvelle matière ===",
  whichWorkspace: "Quelle matière ?",
  newWorkspaceChoice: "Nouvelle matière…",
  workspacesTitle: "Vos matières",
  workspacesEmpty: "Aucune matière pour l'instant. \"miyagi init\" en crée une.",
  missingTag: "[dossier introuvable]",
  kindName: () => "matière",
  workspaceForgotten: (name, dir) => `« ${name} » n'est plus dans la liste. Son dossier est intact : ${dir}`,
  workspaceNotFound: (query, ids) => `Aucune matière « ${query} ». ${ids ? `Les vôtres : ${ids}` : "Vous n’en avez aucune"} ("miyagi workspaces" les liste).`,
  workspaceFolderMissing: (name, dir, id) => `Le dossier de « ${name} » a disparu (${dir}). Remettez-le en place, ou retirez-le de la liste avec "miyagi workspaces forget ${id}".`,
  noWorkspaceHere: (ids) => (ids ? `Aucune matière ici. Ouvrez-en une avec -w <nom> (${ids}), ou créez-en une avec "miyagi init".` : 'Aucune matière pour l’instant : créez-en une avec "miyagi init".'),
  forgetUsage: "Laquelle ? miyagi workspaces forget <nom>",
  required: "Obligatoire",
  moodleUrl: "URL de Moodle (ou collez l'URL complète du cours, p. ex. https://moodle.monuniversite.fr/course/view.php?id=4) :",
  courseId: "ID du cours :",
  description: "Description (facultative) :",
  persona: "Ton de l'agent (forums, retours, annonces) :",
  personaNone: "Pas de préférence (ton neutre)",
  personaFormal: "Formel",
  personaWarm: "Chaleureux",
  personaMotivating: "Chaleureux et motivant",
  conversationLanguage: "Langue dans laquelle vous préférez parler à l'agent (vide, pas de préférence : il répondra dans la langue que vous utilisez) :",
  createInstructions: "Créer instructions.md pour ajouter vos propres instructions à l'agent ? (facultatif, vous pouvez le faire à la main plus tard)",
  workspaceCreated: (dir) => `Matière créée dans ${dir}\n`,
  exploreNow:
    "Explorer maintenant quels types d'activité et de question admet ce Moodle ? (il se connecte et ne fait que " +
    'regarder, sans rien créer ; vous pouvez aussi le faire plus tard avec "miyagi explore")',
  whatToDo: "Que voulez-vous faire ?",
  kindRun: "Gérer le cours d'une traite (run)",
  kindChat: "Discuter avec l'agent (chat)",
  whichMode: "Dans quel mode voulez-vous l'exécuter ?",
  modeInteractive: "interactive — s'arrête avant chaque action",
  modeGuided: "guided — ne s'arrête qu'avant de publier quelque chose de visible par les élèves",
  modeAutonomous: "autonomous — sans pauses",

  studentRole: (dir) => `${dir} est une classe avec le rôle "student" : miyagi n'agit qu'en tant qu'enseignant.`,
  draftsLimitsInvalid: (dir, key, valid) => `${dir}/config.json : agent.draftsLimits.${key} doit être un nombre positif, parmi : ${valid}.`,

  unknownMode: (value, valid) => `Mode inconnu "${value}". Utilisez l'un de : ${valid}.`,
  notAWorkspace: (dir) => `${dir} n'est pas une matière miyagi (pas de config.json). Lancez "miyagi init", ou ouvrez-en une avec -w <nom>.`,
  contextMoved: (count, sourcesDir) => `context/ n'est plus utilisé : ses ${count} fichiers ont été déplacés vers ${sourcesDir}.\n`,
  knowledgeMoved: (legacyDir, sourcesDir) =>
    `knowledge/ avait l'ancienne structure : il a été déplacé vers ${legacyDir} (ses fichiers téléchargés, vers ${sourcesDir}) et l'agent reconstruira la base de connaissances à partir de là.\n`,
  setupSaved: (command) => `Configuration enregistrée. Quand vous voudrez commencer : ${command}`,
  headingIngest: "Ingestion dans la base de connaissances (sans navigateur)",
  headingExplore: "Exploration des capacités de ce Moodle",
  headingMode: (mode, chat) => `Mode : ${mode}${chat ? " (chat)" : ""}`,
  headingWorkspace: (label, dir) => `Matière : ${label} (${dir})`,
  headingSession: (dir) => `Session : ${dir}`,
  headingCourse: (url, courseId) => `Cours : ${url} (id ${courseId})\n`,
  headerWorkspace: "matière",
  headerCourse: "cours",
  headerClassroom: "classe",
  noClassroom: "sans classe",
  connectMoodleNow: "Connecter une classe Moodle maintenant ? miyagi installe l'extension moodle-teacher et vous vous connectez à Moodle dans sa fenêtre ; sans classe, il vous aide pour la progression et les supports, et vous pourrez la connecter plus tard avec \"miyagi init -w <nom>\"",
  connectingMoodleTeacher: "Connexion de la classe avec moodle-teacher…",
  moodleTeacherConnected: "Classe connectée : moodle-teacher est installée avec votre site. La première fois qu'il aura besoin de Moodle, une fenêtre s'ouvrira pour vous connecter.",
  moodleTeacherRetry: "La matière est enregistrée : réessayez avec \"miyagi init -w <nom>\" ou \"miyagi extension add moodle-teacher\".",
  moodleTeacherInstallFailed: "Impossible d'installer ou de configurer moodle-teacher.",
  migrateClassroomIntro: "miyagi travaille maintenant dans Moodle uniquement avec l'extension moodle-teacher : des outils fixes au lieu de cliquer partout, et vous vous connectez dans sa propre fenêtre au lieu d'un mot de passe enregistré. La classe de cette matière utilise encore l'ancien système, qui n'existe plus.",
  migrateClassroomQuestion: "Passer maintenant cette classe à moodle-teacher ? (l'identifiant et le mot de passe enregistrés sont retirés du config.json ; sinon, cette session travaille sans la classe)",
  migratedClassroom: "Classe passée à moodle-teacher.",
  moodleTeacherMissing: "La classe de cette matière passe par moodle-teacher, qui n'est pas installée ou est désactivée : cette session travaille sans la classe. \"miyagi extension add moodle-teacher\" (ou \"enable\") le corrige.",
  classroomNeedsMoving: "La classe de cette matière date d'avant moodle-teacher, et miyagi n'a plus de navigateur à lui : cette session travaille sans la classe. Ouvrez-la dans un chat pour la passer, ou lancez \"miyagi init -w <nom>\".",
  exploreNeedsClassroom: (dir) => `${dir} n'a aucune classe connectée : il n'y a pas de Moodle à explorer. Connectez-en une avec "miyagi init --dir ${dir}".`,
  classroomIncomplete: (dir) => `La classe de ${dir}/config.json a besoin de "url" et de "courseId".`,
  workspaceName: "Nom de la matière :",
  welcomePlain: "miyagi est prêt. Échap interrompt la réponse en cours ; /resume reprend une conversation précédente ; /exit ou Ctrl+C (sans réponse en cours) ferment la session.",
  welcomeInk: "miyagi est prêt. Maj+Tab bascule entre guided et interactive, /resume reprend une conversation précédente, ? affiche les raccourcis et /exit ferme la session.",
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


  toolPhrases: {
    approval: ["a demandé une approbation", "a demandé une approbation {n} fois"],
    download: ["a téléchargé {n} fichier", "a téléchargé {n} fichiers"],
    files: ["a travaillé sur des fichiers", "a travaillé sur des fichiers {n} fois"],
    pdf: ["a créé {n} PDF", "a créé {n} PDF"],
  },

  tool: {
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
  },
};
