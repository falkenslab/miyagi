// The texts of miyagi's actions in the page (contextual-actions #67): the catalog's groups, the
// item menus and the selection menu. The actions' own names come from each command's frontmatter.

export interface ActionTexts {
  groups: Record<string, string>;
  /** The ⋯ button of an item, for a screen reader. */
  more: (item: string) => string;
  askAbout: string;
  /** What "Ask miyagi about this" leaves written in the box. */
  aboutPrefix: (item: string) => string;
  researchThis: string;
  quizThis: string;
  quote: string;
  needsClassroom: string;
  linkClassroom: string;
  send: string;
  cancel: string;
  /** Under a launched action in the conversation, for a screen reader. */
  sent: string;
  /** An own command's form (#68). */
  required: string;
  between: (min?: number, max?: number) => string;
}

const es: ActionTexts = {
  groups: { day: "Día a día", create: "Crear", plan: "Planificar", memory: "Memoria", classroom: "Tu aula", other: "Más" },
  more: (item) => `Acciones de «${item}»`,
  askAbout: "Preguntar a miyagi sobre esto",
  aboutPrefix: (item) => `Sobre «${item}»: `,
  researchThis: "Investigar esto",
  quizThis: "Preguntas sobre esto",
  quote: "Citar en el chat",
  needsClassroom: "Necesita tu aula",
  linkClassroom: "Vincular un aula",
  send: "Enviar",
  cancel: "Cancelar",
  sent: "Acción enviada",
  required: "Obligatorio",
  between: (min, max) => (min !== undefined && max !== undefined ? `Un número entre ${min} y ${max}` : min !== undefined ? `Un número desde ${min}` : max !== undefined ? `Un número hasta ${max}` : "Un número"),
};

const en: ActionTexts = {
  groups: { day: "Day to day", create: "Create", plan: "Plan", memory: "Memory", classroom: "Your classroom", other: "More" },
  more: (item) => `Actions for “${item}”`,
  askAbout: "Ask miyagi about this",
  aboutPrefix: (item) => `About “${item}”: `,
  researchThis: "Research this",
  quizThis: "Questions about this",
  quote: "Quote in the chat",
  needsClassroom: "Needs your classroom",
  linkClassroom: "Link a classroom",
  send: "Send",
  cancel: "Cancel",
  sent: "Action sent",
  required: "Required",
  between: (min, max) => (min !== undefined && max !== undefined ? `A number between ${min} and ${max}` : min !== undefined ? `A number from ${min}` : max !== undefined ? `A number up to ${max}` : "A number"),
};

const fr: ActionTexts = {
  groups: { day: "Au quotidien", create: "Créer", plan: "Planifier", memory: "Mémoire", classroom: "Ta classe", other: "Plus" },
  more: (item) => `Actions de « ${item} »`,
  askAbout: "Demander à miyagi à ce sujet",
  aboutPrefix: (item) => `À propos de « ${item} » : `,
  researchThis: "Rechercher ceci",
  quizThis: "Questions sur ceci",
  quote: "Citer dans le chat",
  needsClassroom: "Nécessite ta classe",
  linkClassroom: "Lier une classe",
  send: "Envoyer",
  cancel: "Annuler",
  sent: "Action envoyée",
  required: "Obligatoire",
  between: (min, max) => (min !== undefined && max !== undefined ? `Un nombre entre ${min} et ${max}` : min !== undefined ? `Un nombre à partir de ${min}` : max !== undefined ? `Un nombre jusqu'à ${max}` : "Un nombre"),
};

const de: ActionTexts = {
  groups: { day: "Alltag", create: "Erstellen", plan: "Planen", memory: "Gedächtnis", classroom: "Dein Kursraum", other: "Mehr" },
  more: (item) => `Aktionen für „${item}“`,
  askAbout: "miyagi dazu fragen",
  aboutPrefix: (item) => `Zu „${item}“: `,
  researchThis: "Dazu recherchieren",
  quizThis: "Fragen dazu",
  quote: "Im Chat zitieren",
  needsClassroom: "Braucht deinen Kursraum",
  linkClassroom: "Kursraum verknüpfen",
  send: "Senden",
  cancel: "Abbrechen",
  sent: "Aktion gesendet",
  required: "Pflichtfeld",
  between: (min, max) => (min !== undefined && max !== undefined ? `Eine Zahl zwischen ${min} und ${max}` : min !== undefined ? `Eine Zahl ab ${min}` : max !== undefined ? `Eine Zahl bis ${max}` : "Eine Zahl"),
};

const ALL: Record<string, ActionTexts> = { es, en, fr, de };

export function actionTexts(language: string | undefined): ActionTexts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
