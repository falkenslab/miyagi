// The course views' texts (gui-course-views #51): Hoy, the plan, topics, materials, the oven,
// sources and the knowledge base. Every language has every key: a missing one is a build error.
// The "prompts" are what a button sends to the chat, as the teacher would write it.

type Phase = "planning" | "building" | "hidden" | "served";

export interface CourseTexts {
  nav: { today: string; plan: string; topics: string; materials: string; oven: string; knowledge: string; sources: string };
  sec: { subject: string; memory: string };
  sub: { plan: string; materials: string; oven: string; knowledge: (n: number) => string; sources: string };
  loading: string;
  stillWorking: string;
  uploading: string;
  talk: string;
  hello: string;
  kpi: { pages: string; topics: string; activities: string; pending: string; oven: string; drafts: string };
  suggestions: string;
  recent: string;
  noRecent: string;
  tips: {
    start: [string, string, string];
    ingest: (n: number) => [string, string, string];
    plan: [string, string, string];
    classroom: [string, string, string];
    grade: [string, string, string];
    forum: [string, string, string];
    align: [string, string, string];
  };
  prompts: {
    ingest: string;
    plan: string;
    grade: string;
    forum: string;
    align: string;
    lint: string;
    reviewPlan: string;
    buildUnit: (title: string) => string;
    publish: (file: string) => string;
    show: (activity: string) => string;
    resume: (activity: string) => string;
  };
  noPlan: string;
  writePlan: string;
  reviewPlan: string;
  alignPlan: string;
  noTopics: string;
  viewPage: string;
  prepare: string;
  activities: (n: number) => string;
  noMaterials: string;
  preview: string;
  publish: string;
  material: string;
  size: string;
  changed: string;
  choose: string;
  phases: Record<Phase, string>;
  ovenNote: string;
  emptyOven: string;
  showToStudents: string;
  resume: string;
  searchKb: string;
  search: string;
  noProblems: string;
  problems: (n: number) => string;
  lint: string;
  linkedFrom: string;
  pickPage: string;
  emptyKb: string;
  noHits: string;
  sections: Record<string, string>;
  drop: string;
  or: string;
  chooseFiles: string;
  ingestAll: string;
  states: { new: string; changed: string; ingested: string };
  file: string;
  state: string;
  page: string;
  noSources: string;
  sentToChat: string;
  openFolder: string;
}

const es: CourseTexts = {
  nav: { today: "Hoy", plan: "Programación", topics: "Temas y actividades", materials: "Materiales", oven: "En el horno", knowledge: "Base de conocimiento", sources: "Fuentes" },
  sec: { subject: "Asignatura", memory: "Memoria" },
  sub: { plan: "course/teaching-plan", materials: "drafts/ · lo que miyagi prepara antes de publicar", oven: "course/drafts", knowledge: (n) => `knowledge/ · ${n} páginas`, sources: "sources/ · tus documentos" },
  loading: "Cargando…",
  stillWorking: "Sigue trabajando, un momento…",
  uploading: "Subiendo a tus fuentes…",
  talk: "Hablar con miyagi",
  hello: "Esto es lo que sé de tu asignatura ahora mismo.",
  kpi: { pages: "páginas en su memoria", topics: "temas", activities: "actividades", pending: "fuentes por incorporar", oven: "en el horno", drafts: "materiales en drafts/" },
  suggestions: "Sugerencias para hoy",
  recent: "Actividad reciente",
  noRecent: "Todavía no ha anotado nada en su memoria.",
  tips: {
    start: ["📥 Empezar con tus documentos", "Su memoria está vacía. Deja en Fuentes la programación, los temarios o las rúbricas y los incorpora.", "Ir a Fuentes"],
    ingest: (n) => ["📥 Documentos nuevos", n === 1 ? "Hay 1 documento en Fuentes que aún no ha incorporado a su memoria." : `Hay ${n} documentos en Fuentes que aún no ha incorporado a su memoria.`, "Incorporarlos"],
    plan: ["🗺️ Escribir la programación", "No tiene todavía la programación didáctica. La escribe contigo a partir de tu material, y lo que solo tú decides te lo pregunta.", "Escribirla"],
    classroom: ["🎓 Vincular tu aula", "Sin aula prepara el material aquí; con ella también corrige, responde en el foro y publica, siempre con tu aprobación.", "Vincular un aula"],
    grade: ["✅ Corregir lo pendiente", "Mira qué entregas esperan nota y te propone cada una antes de guardarla.", "Corregir"],
    forum: ["💬 Dudas en el foro", "Busca las preguntas sin responder y te propone respuestas.", "Revisar el foro"],
    align: ["🎯 Cotejar con la programación", "Comprueba que el aula evalúa lo que dice la programación y te propone cómo alinearlos.", "Comprobar"],
  },
  prompts: {
    ingest: "/knowledge:ingest",
    plan: "/miyagi:teaching-plan",
    grade: "/miyagi:grade",
    forum: "/miyagi:forum",
    align: "/miyagi:align",
    lint: "/knowledge:lint",
    reviewPlan: "Revisa conmigo la programación didáctica (course/teaching-plan): qué le falta y qué mejorarías.",
    buildUnit: (title) => `/miyagi:build-unit ${title}`,
    publish: (file) => `Quiero publicar en el aula el material drafts/${file}. Prepáralo como corresponda y pídeme aprobación.`,
    show: (activity) => `Muestra a los alumnos «${activity}», que está oculta y probada.`,
    resume: (activity) => `Sigamos con «${activity}».`,
  },
  noPlan: "Todavía no hay programación didáctica en su memoria.",
  writePlan: "Escribirla con miyagi",
  reviewPlan: "Revisar con miyagi",
  alignPlan: "Comprobar el aula",
  noTopics: "Todavía no hay temas en su memoria. Aparecen al incorporar tus documentos o al construir un tema.",
  viewPage: "Ver su página",
  prepare: "Prepararlo con miyagi",
  activities: (n) => (n === 1 ? "1 actividad" : `${n} actividades`),
  noMaterials: "drafts/ está vacía: aquí aparece lo que miyagi prepara antes de publicarlo.",
  preview: "Vista previa",
  publish: "Publicar…",
  material: "Material",
  size: "Tamaño",
  changed: "Cambiado",
  choose: "Elige un material para verlo.",
  phases: { planning: "📝 En plan", building: "🔥 Cocinándose", hidden: "🧪 Probándose oculto", served: "🍽️ Servido" },
  ovenNote: "Lo nuevo se sube oculto, se prueba como alumno y solo se muestra con tu aprobación.",
  emptyOven: "Nada en el horno. Pide algo nuevo «con el proceso completo» y aparecerá aquí, fase a fase.",
  showToStudents: "Mostrar a los alumnos",
  resume: "Seguir con ello",
  searchKb: "Buscar en las páginas…",
  search: "Buscar",
  noProblems: "✓ sin enlaces rotos",
  problems: (n) => (n === 1 ? "1 enlace roto" : `${n} enlaces rotos`),
  lint: "Revisar la base",
  linkedFrom: "Enlazada desde",
  pickPage: "Elige una página.",
  emptyKb: "Su memoria está vacía. Incorpora tus documentos desde Fuentes.",
  noHits: "Nada con eso.",
  sections: { course: "Curso", topic: "Temas", activity: "Actividades", curriculum: "Currículo", regulation: "Normativa", summary: "Resúmenes", concept: "Conceptos", entity: "Entidades", synthesis: "Síntesis", preference: "Preferencias" },
  drop: "⬇️ Arrastra aquí la programación, rúbricas, apuntes… (PDF, Word, PowerPoint, Excel, imágenes)",
  or: "o",
  chooseFiles: "Elegir archivos",
  ingestAll: "Pedir a miyagi que los incorpore",
  states: { new: "nuevo", changed: "cambiado", ingested: "incorporado" },
  file: "Archivo",
  state: "Estado",
  page: "Página",
  noSources: "Todavía no hay documentos en sources/.",
  sentToChat: "Enviado a la conversación.",
  openFolder: "Abrir la carpeta",
};

const en: CourseTexts = {
  nav: { today: "Today", plan: "Teaching plan", topics: "Topics and activities", materials: "Materials", oven: "In the oven", knowledge: "Knowledge base", sources: "Sources" },
  sec: { subject: "Subject", memory: "Memory" },
  sub: { plan: "course/teaching-plan", materials: "drafts/ · what miyagi prepares before publishing", oven: "course/drafts", knowledge: (n) => `knowledge/ · ${n} pages`, sources: "sources/ · your documents" },
  loading: "Loading…",
  stillWorking: "Still working, one moment…",
  uploading: "Uploading to your sources…",
  talk: "Talk to miyagi",
  hello: "This is what I know of your subject right now.",
  kpi: { pages: "pages in its memory", topics: "topics", activities: "activities", pending: "sources to take in", oven: "in the oven", drafts: "materials in drafts/" },
  suggestions: "Suggestions for today",
  recent: "Recent activity",
  noRecent: "Nothing noted in its memory yet.",
  tips: {
    start: ["📥 Start with your documents", "Its memory is empty. Leave your teaching plan, syllabi or rubrics in Sources and it takes them in.", "Go to Sources"],
    ingest: (n) => ["📥 New documents", n === 1 ? "There is 1 document in Sources not taken into its memory yet." : `There are ${n} documents in Sources not taken into its memory yet.`, "Take them in"],
    plan: ["🗺️ Write the teaching plan", "There's no teaching plan yet. It writes it with you from your material, and asks what only you decide.", "Write it"],
    classroom: ["🎓 Link your classroom", "Without a classroom it prepares material here; with one it also grades, answers in the forum and publishes, always with your approval.", "Link a classroom"],
    grade: ["✅ Grade what's pending", "It finds the submissions waiting for a grade and shows you each one before saving it.", "Grade"],
    forum: ["💬 Forum questions", "It finds the unanswered questions and drafts replies.", "Check the forum"],
    align: ["🎯 Check against the plan", "It checks that the classroom assesses what the plan says and proposes how to align them.", "Check"],
  },
  prompts: {
    ingest: "/knowledge:ingest",
    plan: "/miyagi:teaching-plan",
    grade: "/miyagi:grade",
    forum: "/miyagi:forum",
    align: "/miyagi:align",
    lint: "/knowledge:lint",
    reviewPlan: "Review the teaching plan (course/teaching-plan) with me: what it lacks and what you'd improve.",
    buildUnit: (title) => `/miyagi:build-unit ${title}`,
    publish: (file) => `I want to publish the material drafts/${file} in the classroom. Prepare it as it should be and ask for my approval.`,
    show: (activity) => `Show "${activity}" to the students: it's hidden and tested.`,
    resume: (activity) => `Let's go on with "${activity}".`,
  },
  noPlan: "There's no teaching plan in its memory yet.",
  writePlan: "Write it with miyagi",
  reviewPlan: "Review with miyagi",
  alignPlan: "Check the classroom",
  noTopics: "No topics in its memory yet. They appear when your documents are taken in or a topic is built.",
  viewPage: "See its page",
  prepare: "Prepare it with miyagi",
  activities: (n) => (n === 1 ? "1 activity" : `${n} activities`),
  noMaterials: "drafts/ is empty: what miyagi prepares before publishing shows up here.",
  preview: "Preview",
  publish: "Publish…",
  material: "Material",
  size: "Size",
  changed: "Changed",
  choose: "Choose a material to see it.",
  phases: { planning: "📝 Planned", building: "🔥 Cooking", hidden: "🧪 Tested hidden", served: "🍽️ Served" },
  ovenNote: "New things go up hidden, are tested as a student and are shown only with your approval.",
  emptyOven: "Nothing in the oven. Ask for something new \"with the full process\" and it shows up here, phase by phase.",
  showToStudents: "Show to students",
  resume: "Go on with it",
  searchKb: "Search the pages…",
  search: "Search",
  noProblems: "✓ no broken links",
  problems: (n) => (n === 1 ? "1 broken link" : `${n} broken links`),
  lint: "Check the base",
  linkedFrom: "Linked from",
  pickPage: "Choose a page.",
  emptyKb: "Its memory is empty. Take your documents in from Sources.",
  noHits: "Nothing matches.",
  sections: { course: "Course", topic: "Topics", activity: "Activities", curriculum: "Curriculum", regulation: "Regulations", summary: "Summaries", concept: "Concepts", entity: "Entities", synthesis: "Syntheses", preference: "Preferences" },
  drop: "⬇️ Drop your teaching plan, rubrics, notes… here (PDF, Word, PowerPoint, Excel, images)",
  or: "or",
  chooseFiles: "Choose files",
  ingestAll: "Ask miyagi to take them in",
  states: { new: "new", changed: "changed", ingested: "taken in" },
  file: "File",
  state: "State",
  page: "Page",
  noSources: "No documents in sources/ yet.",
  sentToChat: "Sent to the conversation.",
  openFolder: "Open the folder",
};

const fr: CourseTexts = {
  nav: { today: "Aujourd'hui", plan: "Progression", topics: "Thèmes et activités", materials: "Matériel", oven: "Au four", knowledge: "Base de connaissances", sources: "Sources" },
  sec: { subject: "Matière", memory: "Mémoire" },
  sub: { plan: "course/teaching-plan", materials: "drafts/ · ce que miyagi prépare avant de publier", oven: "course/drafts", knowledge: (n) => `knowledge/ · ${n} pages`, sources: "sources/ · tes documents" },
  loading: "Chargement…",
  stillWorking: "Toujours en cours, un instant…",
  uploading: "Envoi vers vos sources…",
  talk: "Parler à miyagi",
  hello: "Voici ce que je sais de ta matière en ce moment.",
  kpi: { pages: "pages dans sa mémoire", topics: "thèmes", activities: "activités", pending: "sources à intégrer", oven: "au four", drafts: "éléments dans drafts/" },
  suggestions: "Suggestions pour aujourd'hui",
  recent: "Activité récente",
  noRecent: "Rien de noté dans sa mémoire pour l'instant.",
  tips: {
    start: ["📥 Commencer par tes documents", "Sa mémoire est vide. Dépose dans Sources ta progression, tes programmes ou tes grilles et il les intègre.", "Aller aux Sources"],
    ingest: (n) => ["📥 Nouveaux documents", n === 1 ? "Il y a 1 document dans Sources pas encore intégré à sa mémoire." : `Il y a ${n} documents dans Sources pas encore intégrés à sa mémoire.`, "Les intégrer"],
    plan: ["🗺️ Écrire la progression", "Il n'y a pas encore de progression. Il l'écrit avec toi à partir de ton matériel et te demande ce que toi seul décides.", "L'écrire"],
    classroom: ["🎓 Lier ta classe", "Sans classe, il prépare le matériel ici ; avec elle, il corrige aussi, répond dans le forum et publie, toujours avec ton accord.", "Lier une classe"],
    grade: ["✅ Corriger ce qui attend", "Il trouve les devoirs en attente de note et te montre chacun avant de l'enregistrer.", "Corriger"],
    forum: ["💬 Questions du forum", "Il trouve les questions sans réponse et propose des réponses.", "Voir le forum"],
    align: ["🎯 Comparer avec la progression", "Il vérifie que la classe évalue ce que dit la progression et propose comment les aligner.", "Vérifier"],
  },
  prompts: {
    ingest: "/knowledge:ingest",
    plan: "/miyagi:teaching-plan",
    grade: "/miyagi:grade",
    forum: "/miyagi:forum",
    align: "/miyagi:align",
    lint: "/knowledge:lint",
    reviewPlan: "Revois avec moi la progression (course/teaching-plan) : ce qui lui manque et ce que tu améliorerais.",
    buildUnit: (title) => `/miyagi:build-unit ${title}`,
    publish: (file) => `Je veux publier dans la classe le matériel drafts/${file}. Prépare-le comme il faut et demande-moi mon accord.`,
    show: (activity) => `Montre aux élèves « ${activity} », qui est cachée et testée.`,
    resume: (activity) => `Continuons avec « ${activity} ».`,
  },
  noPlan: "Il n'y a pas encore de progression dans sa mémoire.",
  writePlan: "L'écrire avec miyagi",
  reviewPlan: "Revoir avec miyagi",
  alignPlan: "Vérifier la classe",
  noTopics: "Pas encore de thèmes dans sa mémoire. Ils apparaissent en intégrant tes documents ou en construisant un thème.",
  viewPage: "Voir sa page",
  prepare: "Le préparer avec miyagi",
  activities: (n) => (n === 1 ? "1 activité" : `${n} activités`),
  noMaterials: "drafts/ est vide : ce que miyagi prépare avant de publier apparaît ici.",
  preview: "Aperçu",
  publish: "Publier…",
  material: "Matériel",
  size: "Taille",
  changed: "Modifié",
  choose: "Choisis un élément pour le voir.",
  phases: { planning: "📝 En plan", building: "🔥 En cuisson", hidden: "🧪 Testé caché", served: "🍽️ Servi" },
  ovenNote: "Le nouveau est publié caché, testé comme élève et montré seulement avec ton accord.",
  emptyOven: "Rien au four. Demande quelque chose de nouveau « avec le processus complet » et il apparaîtra ici, phase par phase.",
  showToStudents: "Montrer aux élèves",
  resume: "Continuer",
  searchKb: "Chercher dans les pages…",
  search: "Chercher",
  noProblems: "✓ aucun lien cassé",
  problems: (n) => (n === 1 ? "1 lien cassé" : `${n} liens cassés`),
  lint: "Vérifier la base",
  linkedFrom: "Liée depuis",
  pickPage: "Choisis une page.",
  emptyKb: "Sa mémoire est vide. Intègre tes documents depuis Sources.",
  noHits: "Rien ne correspond.",
  sections: { course: "Cours", topic: "Thèmes", activity: "Activités", curriculum: "Programme", regulation: "Réglementation", summary: "Résumés", concept: "Concepts", entity: "Entités", synthesis: "Synthèses", preference: "Préférences" },
  drop: "⬇️ Dépose ici ta progression, tes grilles, tes notes… (PDF, Word, PowerPoint, Excel, images)",
  or: "ou",
  chooseFiles: "Choisir des fichiers",
  ingestAll: "Demander à miyagi de les intégrer",
  states: { new: "nouveau", changed: "modifié", ingested: "intégré" },
  file: "Fichier",
  state: "État",
  page: "Page",
  noSources: "Pas encore de documents dans sources/.",
  sentToChat: "Envoyé à la conversation.",
  openFolder: "Ouvrir le dossier",
};

const de: CourseTexts = {
  nav: { today: "Heute", plan: "Planung", topics: "Themen und Aktivitäten", materials: "Material", oven: "Im Ofen", knowledge: "Wissensbasis", sources: "Quellen" },
  sec: { subject: "Fach", memory: "Gedächtnis" },
  sub: { plan: "course/teaching-plan", materials: "drafts/ · was miyagi vor dem Veröffentlichen vorbereitet", oven: "course/drafts", knowledge: (n) => `knowledge/ · ${n} Seiten`, sources: "sources/ · deine Dokumente" },
  loading: "Wird geladen…",
  stillWorking: "Arbeitet noch, einen Moment…",
  uploading: "Wird zu Ihren Quellen hochgeladen…",
  talk: "Mit miyagi sprechen",
  hello: "Das weiß ich gerade über dein Fach.",
  kpi: { pages: "Seiten im Gedächtnis", topics: "Themen", activities: "Aktivitäten", pending: "Quellen aufzunehmen", oven: "im Ofen", drafts: "Materialien in drafts/" },
  suggestions: "Vorschläge für heute",
  recent: "Letzte Aktivität",
  noRecent: "Noch nichts im Gedächtnis notiert.",
  tips: {
    start: ["📥 Mit deinen Dokumenten beginnen", "Sein Gedächtnis ist leer. Lege Planung, Lehrpläne oder Bewertungsraster in Quellen ab, und es nimmt sie auf.", "Zu den Quellen"],
    ingest: (n) => ["📥 Neue Dokumente", n === 1 ? "In Quellen liegt 1 Dokument, das noch nicht aufgenommen ist." : `In Quellen liegen ${n} Dokumente, die noch nicht aufgenommen sind.`, "Aufnehmen"],
    plan: ["🗺️ Die Planung schreiben", "Es gibt noch keine Planung. Es schreibt sie mit dir aus deinem Material und fragt, was nur du entscheidest.", "Schreiben"],
    classroom: ["🎓 Kursraum verknüpfen", "Ohne Kursraum bereitet es hier Material vor; mit ihm bewertet es auch, antwortet im Forum und veröffentlicht, immer mit deiner Zustimmung.", "Kursraum verknüpfen"],
    grade: ["✅ Offenes bewerten", "Es findet die Abgaben ohne Note und zeigt dir jede, bevor es sie speichert.", "Bewerten"],
    forum: ["💬 Fragen im Forum", "Es findet unbeantwortete Fragen und entwirft Antworten.", "Forum ansehen"],
    align: ["🎯 Mit der Planung abgleichen", "Es prüft, ob der Kursraum bewertet, was die Planung vorsieht, und schlägt vor, wie man beides angleicht.", "Prüfen"],
  },
  prompts: {
    ingest: "/knowledge:ingest",
    plan: "/miyagi:teaching-plan",
    grade: "/miyagi:grade",
    forum: "/miyagi:forum",
    align: "/miyagi:align",
    lint: "/knowledge:lint",
    reviewPlan: "Geh mit mir die Planung (course/teaching-plan) durch: was ihr fehlt und was du verbessern würdest.",
    buildUnit: (title) => `/miyagi:build-unit ${title}`,
    publish: (file) => `Ich möchte das Material drafts/${file} im Kursraum veröffentlichen. Bereite es passend vor und bitte mich um Zustimmung.`,
    show: (activity) => `Zeig den Lernenden „${activity}“: sie ist verborgen und getestet.`,
    resume: (activity) => `Machen wir mit „${activity}“ weiter.`,
  },
  noPlan: "Noch keine Planung im Gedächtnis.",
  writePlan: "Mit miyagi schreiben",
  reviewPlan: "Mit miyagi durchgehen",
  alignPlan: "Kursraum prüfen",
  noTopics: "Noch keine Themen im Gedächtnis. Sie erscheinen, wenn deine Dokumente aufgenommen oder ein Thema gebaut wird.",
  viewPage: "Seite ansehen",
  prepare: "Mit miyagi vorbereiten",
  activities: (n) => (n === 1 ? "1 Aktivität" : `${n} Aktivitäten`),
  noMaterials: "drafts/ ist leer: Hier erscheint, was miyagi vor dem Veröffentlichen vorbereitet.",
  preview: "Vorschau",
  publish: "Veröffentlichen…",
  material: "Material",
  size: "Größe",
  changed: "Geändert",
  choose: "Wähle ein Material, um es anzusehen.",
  phases: { planning: "📝 Geplant", building: "🔥 Im Bau", hidden: "🧪 Verborgen getestet", served: "🍽️ Serviert" },
  ovenNote: "Neues wird verborgen hochgeladen, als Lernende getestet und nur mit deiner Zustimmung gezeigt.",
  emptyOven: "Nichts im Ofen. Bitte um etwas Neues „mit dem ganzen Ablauf“, und es erscheint hier, Phase für Phase.",
  showToStudents: "Den Lernenden zeigen",
  resume: "Weitermachen",
  searchKb: "In den Seiten suchen…",
  search: "Suchen",
  noProblems: "✓ keine defekten Links",
  problems: (n) => (n === 1 ? "1 defekter Link" : `${n} defekte Links`),
  lint: "Basis prüfen",
  linkedFrom: "Verlinkt von",
  pickPage: "Wähle eine Seite.",
  emptyKb: "Sein Gedächtnis ist leer. Nimm deine Dokumente über Quellen auf.",
  noHits: "Nichts gefunden.",
  sections: { course: "Kurs", topic: "Themen", activity: "Aktivitäten", curriculum: "Lehrplan", regulation: "Vorschriften", summary: "Zusammenfassungen", concept: "Begriffe", entity: "Einträge", synthesis: "Synthesen", preference: "Vorlieben" },
  drop: "⬇️ Zieh Planung, Bewertungsraster, Notizen… hierher (PDF, Word, PowerPoint, Excel, Bilder)",
  or: "oder",
  chooseFiles: "Dateien wählen",
  ingestAll: "miyagi bitten, sie aufzunehmen",
  states: { new: "neu", changed: "geändert", ingested: "aufgenommen" },
  file: "Datei",
  state: "Status",
  page: "Seite",
  noSources: "Noch keine Dokumente in sources/.",
  sentToChat: "An das Gespräch gesendet.",
  openFolder: "Ordner öffnen",
};

const ALL: Record<string, CourseTexts> = { es, en, fr, de };

/** The views' texts for a language code, as `texts()` picks the chat's. */
export function courseTexts(language: string | undefined): CourseTexts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
