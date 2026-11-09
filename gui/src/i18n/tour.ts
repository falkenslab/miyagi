// The guided tour's texts (#81), step by step. Every language has every key: a missing one is a build error.

import type { TourStepId } from "../tour";

export interface TourTexts {
  /** The tour's name: in the rail's menu and the sidebar's foot. */
  name: string;
  /** The tooltip of the rail's button that holds it. */
  help: string;
  next: string;
  back: string;
  skip: string;
  finish: string;
  /** What the status bar says while its step points at it. */
  statusLine: string;
  steps: Record<TourStepId, { title: string; text: string }>;
}

const es: TourTexts = {
  name: "Visita guiada",
  help: "Ayuda",
  next: "Siguiente",
  back: "Atrás",
  skip: "Saltar la visita",
  finish: "Terminar",
  statusLine: "Aquí verás lo que miyagi está haciendo.",
  steps: {
    welcome: { title: "Te presento miyagi", text: "Un repaso rápido por la ventana para que sepas para qué sirve cada parte. Puedes saltarlo y volver a verlo cuando quieras." },
    subject: { title: "Tu asignatura", text: "Es la asignatura abierta, y debajo dice si tiene aula. Desde aquí cambias a otra, creas una nueva o abres la carpeta de una que no está en tu lista." },
    newConversation: { title: "Una conversación nueva", text: "Empieza de cero con miyagi. Las conversaciones anteriores no se pierden: quedan guardadas en la lista de abajo." },
    searchBell: { title: "La búsqueda y la campana", text: "Busca una palabra en todas las conversaciones de la asignatura. La campana cuenta lo que te espera: una aprobación, una pregunta, fuentes sin incorporar o actividades en el horno." },
    conversations: { title: "Tus conversaciones", text: "Primero las fijadas y luego las recientes; con el ⋯ de una la fijas. En el ordenador, arrastra el borde de esta columna para ensancharla o pliégala con su botón." },
    progress: { title: "Lo que está en marcha", text: "Al pie de la columna ves la tarea en curso y cuál de cuántas es, y al pulsarla vas a la conversación. Ahora mismo te dice por qué paso de esta visita vas." },
    today: { title: "Hoy", text: "Lo que miyagi sabe de tu asignatura de un vistazo y sugerencias de por dónde seguir. Es lo primero que ves al abrirla." },
    classroom: { title: "Tu aula", text: "El curso de Moodle de esta asignatura. Es opcional: sin aula, miyagi prepara el material contigo; si la vinculas, también corrige, responde en el foro y publica." },
    plan: { title: "Programación y temas", text: "En estas pestañas está la programación didáctica de la asignatura y sus temas, cada uno con lo que se puede hacer con él." },
    materials: { title: "Materiales y horno", text: "En Materiales está lo que miyagi prepara antes de publicar, para que lo revises. En el Horno, las actividades que está cocinando y en qué fase va cada una." },
    memory: { title: "Su memoria", text: "Conocimiento son las páginas que miyagi escribe y consulta sobre tu curso. En Fuentes dejas tus documentos (temarios, rúbricas…) para que los incorpore." },
    extensions: { title: "Extensiones", text: "Lo que miyagi puede hacer: sus capacidades, las extensiones instaladas y el catálogo para añadir otras." },
    composer: { title: "Aquí hablas con miyagi", text: "Escribe lo que necesitas. Con ＋ añades un archivo a tus fuentes o eliges una acción, / muestra sus comandos y Mayús+Tab cambia el modo." },
    approvals: { title: "Tú decides lo que se publica", text: "El modo dice cuánto trabaja sin preguntarte. En Guiado, nada de lo que ven tus alumnos se publica sin tu sí: la aprobación aparece aquí, en lugar del cuadro de texto." },
    statusBar: { title: "La barra de estado", text: "Aparece cuando hay algo en marcha, para que sepas qué está haciendo miyagi desde cualquier vista y puedas volver a la conversación." },
    sidePanel: { title: "El panel lateral", text: "Los archivos y la actividad de cada turno se abren a la derecha, en pestañas, sin dejar la conversación. Puedes ensancharlo, ampliarlo o cerrarlo." },
    browser: { title: "El navegador integrado", text: "Con este botón abres páginas web en una pestaña del panel. Los enlaces de la conversación se abren ahí, y tu sesión se queda en esta aplicación: miyagi no la ve." },
    titleBar: { title: "La barra de la ventana", text: "Con ← y → te mueves por las vistas que has visitado, este botón muestra u oculta la columna lateral y aquí tienes los menús de la aplicación." },
    theme: { title: "Tema y esta visita", text: "Aquí eliges claro u oscuro y ves las versiones. En el botón de ayuda vuelves a abrir esta visita cuando quieras." },
  },
};

const en: TourTexts = {
  name: "Guided tour",
  help: "Help",
  next: "Next",
  back: "Back",
  skip: "Skip tour",
  finish: "Finish",
  statusLine: "This is where you'll see what miyagi is doing.",
  steps: {
    welcome: { title: "Meet miyagi", text: "A quick look around the window, so you know what each part is for. You can skip it and watch it again whenever you like." },
    subject: { title: "Your subject", text: "The subject that's open, and under it whether it has a classroom. From here you switch to another, create a new one or open the folder of one that isn't on your list." },
    newConversation: { title: "A new conversation", text: "Start from scratch with miyagi. Earlier conversations aren't lost: they stay in the list below." },
    searchBell: { title: "Search and the bell", text: "Look for a word in all of the subject's conversations. The bell counts what's waiting for you: an approval, a question, sources not taken in yet or activities in the oven." },
    conversations: { title: "Your conversations", text: "Pinned ones first, then the recent ones; a conversation's ⋯ pins it. On a computer, drag this column's edge to widen it or fold it with its button." },
    progress: { title: "What's under way", text: "At the foot of the column you see the task under way and which of how many it is; clicking it takes you to the conversation. Right now it tells you where you are in this tour." },
    today: { title: "Today", text: "What miyagi knows of your subject at a glance, and suggestions for what to do next. It's the first thing you see when you open a subject." },
    classroom: { title: "Your classroom", text: "This subject's Moodle course. It's optional: without a classroom miyagi prepares the material with you; link one and it also grades, answers in the forum and publishes." },
    plan: { title: "Plan and topics", text: "These tabs hold the subject's teaching plan and its topics, each with what can be done with it." },
    materials: { title: "Materials and the oven", text: "Materials holds what miyagi prepares before publishing, for you to review. The oven shows the activities it's cooking and the phase each one is in." },
    memory: { title: "Its memory", text: "Knowledge is the pages miyagi writes and consults about your course. In Sources you leave your documents (syllabuses, rubrics…) for it to take in." },
    extensions: { title: "Extensions", text: "What miyagi can do: its capabilities, the extensions installed and the catalog to add others." },
    composer: { title: "Talk to miyagi here", text: "Write what you need. ＋ adds a file to your sources or picks an action, / shows its commands and Shift+Tab changes the mode." },
    approvals: { title: "You decide what's published", text: "The mode says how much it works without asking. In Guided, nothing students see is published without your yes: the approval appears here, in place of the text box." },
    statusBar: { title: "The status bar", text: "It appears when something is under way, so you know what miyagi is doing from any view and can go back to the conversation." },
    sidePanel: { title: "The side panel", text: "Files and each turn's activity open on the right, in tabs, without leaving the conversation. You can widen it, expand it or close it." },
    browser: { title: "The built-in browser", text: "This button opens web pages in a tab of the panel. Links in the conversation open there, and your session stays in this app: miyagi doesn't see it." },
    titleBar: { title: "The window's bar", text: "← and → move through the views you've visited, this button shows or hides the side column, and here are the app's menus." },
    theme: { title: "Theme and this tour", text: "Here you choose light or dark and see the versions. The help button opens this tour again whenever you like." },
  },
};

const fr: TourTexts = {
  name: "Visite guidée",
  help: "Aide",
  next: "Suivant",
  back: "Retour",
  skip: "Passer la visite",
  finish: "Terminer",
  statusLine: "C'est ici que vous verrez ce que fait miyagi.",
  steps: {
    welcome: { title: "Voici miyagi", text: "Un tour rapide de la fenêtre, pour savoir à quoi sert chaque partie. Vous pouvez le passer et le revoir quand vous voulez." },
    subject: { title: "Votre matière", text: "La matière ouverte et, en dessous, si elle a une salle de cours. D'ici, vous passez à une autre, en créez une ou ouvrez le dossier d'une matière absente de votre liste." },
    newConversation: { title: "Une nouvelle conversation", text: "Repartez de zéro avec miyagi. Les conversations précédentes ne sont pas perdues : elles restent dans la liste ci-dessous." },
    searchBell: { title: "La recherche et la cloche", text: "Cherchez un mot dans toutes les conversations de la matière. La cloche compte ce qui vous attend : une approbation, une question, des sources non intégrées ou des activités au four." },
    conversations: { title: "Vos conversations", text: "D'abord les épinglées, puis les récentes ; le ⋯ d'une conversation l'épingle. Sur ordinateur, faites glisser le bord de cette colonne pour l'élargir ou repliez-la avec son bouton." },
    progress: { title: "Ce qui est en cours", text: "Au pied de la colonne, la tâche en cours et laquelle sur combien ; un clic mène à la conversation. Pour l'instant, elle indique où vous en êtes dans cette visite." },
    today: { title: "Aujourd'hui", text: "Ce que miyagi sait de votre matière en un coup d'œil, et des suggestions pour la suite. C'est la première chose que vous voyez en l'ouvrant." },
    classroom: { title: "Votre salle de cours", text: "Le cours Moodle de cette matière. Elle est facultative : sans salle, miyagi prépare le matériel avec vous ; une fois liée, il corrige aussi, répond sur le forum et publie." },
    plan: { title: "Programmation et thèmes", text: "Ces onglets contiennent la programmation de la matière et ses thèmes, chacun avec ce qu'on peut en faire." },
    materials: { title: "Matériels et four", text: "Matériels contient ce que miyagi prépare avant de publier, pour que vous le relisiez. Le four montre les activités en préparation et la phase de chacune." },
    memory: { title: "Sa mémoire", text: "Connaissances, ce sont les pages que miyagi écrit et consulte sur votre cours. Dans Sources, vous déposez vos documents (programmes, grilles…) pour qu'il les intègre." },
    extensions: { title: "Extensions", text: "Ce que miyagi sait faire : ses capacités, les extensions installées et le catalogue pour en ajouter d'autres." },
    composer: { title: "C'est ici que vous parlez à miyagi", text: "Écrivez ce dont vous avez besoin. ＋ ajoute un fichier à vos sources ou choisit une action, / montre ses commandes et Maj+Tab change le mode." },
    approvals: { title: "Vous décidez de ce qui est publié", text: "Le mode indique combien il travaille sans demander. En Guidé, rien de ce que voient les élèves n'est publié sans votre accord : l'approbation apparaît ici, à la place de la zone de texte." },
    statusBar: { title: "La barre d'état", text: "Elle apparaît quand quelque chose est en cours, pour savoir ce que fait miyagi depuis n'importe quelle vue et revenir à la conversation." },
    sidePanel: { title: "Le panneau latéral", text: "Les fichiers et l'activité de chaque tour s'ouvrent à droite, dans des onglets, sans quitter la conversation. Vous pouvez l'élargir, l'agrandir ou le fermer." },
    browser: { title: "Le navigateur intégré", text: "Ce bouton ouvre des pages web dans un onglet du panneau. Les liens de la conversation s'y ouvrent, et votre session reste dans cette application : miyagi ne la voit pas." },
    titleBar: { title: "La barre de la fenêtre", text: "← et → parcourent les vues visitées, ce bouton affiche ou masque la colonne latérale, et voici les menus de l'application." },
    theme: { title: "Thème et cette visite", text: "Ici, vous choisissez clair ou sombre et voyez les versions. Le bouton d'aide rouvre cette visite quand vous voulez." },
  },
};

const de: TourTexts = {
  name: "Geführte Tour",
  help: "Hilfe",
  next: "Weiter",
  back: "Zurück",
  skip: "Tour überspringen",
  finish: "Fertig",
  statusLine: "Hier siehst du, was miyagi gerade tut.",
  steps: {
    welcome: { title: "Das ist miyagi", text: "Ein kurzer Rundgang durch das Fenster, damit du weißt, wofür jeder Teil da ist. Du kannst ihn überspringen und jederzeit erneut ansehen." },
    subject: { title: "Dein Fach", text: "Das geöffnete Fach und darunter, ob es einen Kursraum hat. Von hier wechselst du zu einem anderen, legst ein neues an oder öffnest den Ordner eines Fachs, das nicht in deiner Liste steht." },
    newConversation: { title: "Ein neues Gespräch", text: "Fang mit miyagi von vorn an. Frühere Gespräche gehen nicht verloren: Sie bleiben in der Liste unten." },
    searchBell: { title: "Suche und Glocke", text: "Suche ein Wort in allen Gesprächen des Fachs. Die Glocke zählt, was auf dich wartet: eine Freigabe, eine Frage, noch nicht aufgenommene Quellen oder Aktivitäten im Ofen." },
    conversations: { title: "Deine Gespräche", text: "Zuerst die angehefteten, dann die letzten; mit dem ⋯ eines Gesprächs heftest du es an. Am Computer ziehst du den Rand dieser Spalte, um sie zu verbreitern, oder klappst sie mit ihrer Taste ein." },
    progress: { title: "Was gerade läuft", text: "Am Fuß der Spalte siehst du die laufende Aufgabe und die wievielte von wie vielen sie ist; ein Klick führt zum Gespräch. Gerade zeigt sie, wo du in dieser Tour bist." },
    today: { title: "Heute", text: "Was miyagi über dein Fach weiß, auf einen Blick, und Vorschläge, wie es weitergeht. Das siehst du als Erstes, wenn du ein Fach öffnest." },
    classroom: { title: "Dein Kursraum", text: "Der Moodle-Kurs dieses Fachs. Er ist optional: Ohne Kursraum bereitet miyagi das Material mit dir vor; ist einer verknüpft, korrigiert es auch, antwortet im Forum und veröffentlicht." },
    plan: { title: "Lehrplan und Themen", text: "Diese Tabs enthalten den Lehrplan des Fachs und seine Themen, jedes mit dem, was sich damit tun lässt." },
    materials: { title: "Materialien und Ofen", text: "Unter Materialien liegt, was miyagi vor dem Veröffentlichen vorbereitet, damit du es prüfst. Der Ofen zeigt die Aktivitäten in Arbeit und die Phase jeder einzelnen." },
    memory: { title: "Sein Gedächtnis", text: "Wissen sind die Seiten, die miyagi über deinen Kurs schreibt und nachschlägt. Unter Quellen legst du deine Dokumente ab (Stoffpläne, Rubriken…), damit es sie aufnimmt." },
    extensions: { title: "Erweiterungen", text: "Was miyagi kann: seine Fähigkeiten, die installierten Erweiterungen und der Katalog, um weitere hinzuzufügen." },
    composer: { title: "Hier sprichst du mit miyagi", text: "Schreib, was du brauchst. ＋ fügt deinen Quellen eine Datei hinzu oder wählt eine Aktion, / zeigt die Befehle, und Umschalt+Tab wechselt den Modus." },
    approvals: { title: "Du entscheidest, was veröffentlicht wird", text: "Der Modus sagt, wie viel es arbeitet, ohne zu fragen. Im geführten Modus wird nichts veröffentlicht, was Lernende sehen, ohne dein Ja: Die Freigabe erscheint hier anstelle des Textfelds." },
    statusBar: { title: "Die Statusleiste", text: "Sie erscheint, wenn etwas läuft, damit du aus jeder Ansicht siehst, was miyagi gerade tut, und zum Gespräch zurückkehren kannst." },
    sidePanel: { title: "Das Seitenpanel", text: "Dateien und die Aktivität jedes Durchgangs öffnen sich rechts in Tabs, ohne das Gespräch zu verlassen. Du kannst es verbreitern, vergrößern oder schließen." },
    browser: { title: "Der eingebaute Browser", text: "Diese Schaltfläche öffnet Webseiten in einem Tab des Panels. Links aus dem Gespräch öffnen sich dort, und deine Sitzung bleibt in dieser App: miyagi sieht sie nicht." },
    titleBar: { title: "Die Fensterleiste", text: "← und → gehen durch die besuchten Ansichten, diese Taste zeigt oder verbirgt die Seitenspalte, und hier sind die Menüs der App." },
    theme: { title: "Design und diese Tour", text: "Hier wählst du hell oder dunkel und siehst die Versionen. Über die Hilfe-Taste öffnest du diese Tour jederzeit wieder." },
  },
};

const ALL: Record<string, TourTexts> = { es, en, fr, de };

/** The tour's texts for a language code, as `texts()` picks the chat's. */
export function tourTexts(language: string | undefined): TourTexts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
