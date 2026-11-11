import { z } from "zod";

/**
 * The page's schema (ui-schema #106): what each item the page shows is made of, as an action
 * launched on it receives it, and what an action (a command's frontmatter) is. The zod types are
 * the source; `schema/ui.schema.json` is generated from them (`npm run schema`) for whoever writes
 * an action outside miyagi, and checked to be current by `verify`.
 *
 * An action's instructions name an item's fields and its form's values as `{{item.<field>}}` and
 * `{{form.<name>}}` (also `{{subject.name}}`, `{{today}}`): validated against this schema when the
 * command is saved, and filled in for the agent when it's launched (see actionContext.ts).
 */

export const SCHEMA_VERSION = 1;

const text = (description: string) => z.string().describe(description);
const when = (description: string) => z.string().describe(`${description} (ISO 8601)`);

/** Each item kind, with the fields an action gets. Optional where the page may not know it. */
export const ENTITIES = {
  topic: z
    .object({
      id: text("Its knowledge-base page (topic/<slug>), empty for a unit of the teaching plan that has none yet"),
      title: text("Its title"),
      unit: text("Its number in the teaching plan (UT3, SA5…)").optional(),
      description: text("What it's about, as its page says").optional(),
      status: text("Where it stands (planned, built, in class…)").optional(),
      details: text("The rest of its row in the teaching plan: dates, hours…").optional(),
      activities: z.array(z.object({ id: text("The activity's page"), title: text("Its title") })).describe("Its activities' pages").optional(),
    })
    .describe("A topic or unit of the course (Topics and activities)"),
  material: z
    .object({
      path: text("Its path, under materials/ or drafts/"),
      size: z.number().describe("Its size in bytes"),
      changed: when("When it last changed"),
    })
    .describe("A file miyagi prepared (Materials)"),
  quiz: z
    .object({
      path: text("Its bank or quiz file, under materials/"),
      size: z.number().describe("Its size in bytes"),
      changed: when("When it last changed"),
    })
    .describe("A question bank or quiz in Materials"),
  source: z
    .object({
      path: text("Its path, under sources/"),
      state: z.enum(["new", "changed", "ingested"]).describe("Whether the knowledge base has it"),
      page: text("Its summary page, once taken in").optional(),
      size: z.number().describe("Its size in bytes"),
      changed: when("When it last changed"),
    })
    .describe("A document of the teacher's sources (Sources)"),
  page: z
    .object({
      id: text("Its id (course/teaching-plan, topic/<slug>, concept/<slug>…)"),
      title: text("Its title"),
    })
    .describe("A page of the knowledge base"),
  plan: z.object({ id: text("Always course/teaching-plan") }).describe("The teaching plan"),
  draft: z
    .object({
      phase: z.enum(["planning", "building", "hidden", "served"]).describe("Its phase"),
      text: text("Its line in the register: what it is and where"),
    })
    .describe("An activity in progress (Drafts)"),
  text: z.object({ text: text("The selected text") }).describe("Text selected in the chat or in a page"),
} as const;

export type ItemKind = keyof typeof ENTITIES;
export const ITEM_KINDS = Object.keys(ENTITIES) as ItemKind[];

/** What every action gets besides its item and its form. */
export const CONTEXT = z
  .object({
    subject: z.object({ name: text("The subject's name") }),
    today: text("Today's date, YYYY-MM-DD, in the computer's time zone"),
  })
  .describe("The subject and the day");

const perLanguage = z.string().describe('Per language: "es=… | en=…", or one text for all');

/** One value an action asks for in its form. */
export const FORM_FIELD = z
  .object({
    name: z.string().regex(/^[a-z][a-z0-9_]{0,30}$/).describe("How the instructions name it: {{form.<name>}}"),
    label: perLanguage,
    type: z.enum(["text", "number", "choice", "words", "topic", "source", "page"]),
    required: z.boolean().optional(),
    default: z.union([z.string(), z.number()]).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    options: z.array(z.string()).optional().describe("For a choice"),
    help: perLanguage.optional(),
  })
  .describe("A value the action asks for before it runs");

/** An action: a command's frontmatter (its instructions are the file's body). */
export const ACTION = z
  .object({
    description: z.string().min(1).describe("What it does, one line"),
    label: perLanguage.optional(),
    icon: z.string().optional().describe("One emoji"),
    group: z.enum(["day", "create", "plan", "memory", "classroom"]).optional(),
    "applies-to": z.string().optional().describe(`The item kinds it shows on, comma separated: ${ITEM_KINDS.join(", ")}`),
    "needs-classroom": z.boolean().optional(),
    ask: perLanguage.optional().describe("One question asked before running, when it has no form"),
    "argument-hint": z.string().optional(),
    suggest: z.boolean().optional(),
    produces: z.enum(["html-activity", "quiz", "document", "page"]).optional(),
    parameters: z.array(FORM_FIELD).optional().describe("Its form"),
  })
  .describe("An action of the page: a command's frontmatter; the body holds its instructions, with {{item.*}}, {{form.*}}, {{subject.name}} and {{today}}");

/** The JSON Schema of the whole page model, for `schema/ui.schema.json`. */
export function uiJsonSchema(): Record<string, unknown> {
  // Each part without its own `$schema`: the file says it once.
  const json = (schema: z.ZodType) => {
    const rest = { ...(z.toJSONSchema(schema) as Record<string, unknown>) };
    delete rest.$schema;
    return rest;
  };
  const entities = Object.fromEntries(Object.entries(ENTITIES).map(([kind, schema]) => [kind, json(schema)]));
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://github.com/falkenslab/miyagi/schema/ui.schema.json",
    title: "miyagi's page",
    description: "What the page shows (its items and their fields), and what an action launched on them is.",
    version: SCHEMA_VERSION,
    $defs: { ...Object.fromEntries(Object.entries(entities).map(([kind, schema]) => [`item-${kind}`, schema])), context: json(CONTEXT), formField: json(FORM_FIELD), action: json(ACTION) },
  };
}

/** The field paths of an item kind, as `{{item.<path>}}` names them (`activities` and `activities.title`…). */
export function fieldsOf(kind: ItemKind): string[] {
  const walk = (schema: z.ZodType, prefix: string): string[] => {
    const inner = schema instanceof z.ZodOptional ? (schema.unwrap() as z.ZodType) : schema;
    if (inner instanceof z.ZodObject) return Object.entries(inner.shape as Record<string, z.ZodType>).flatMap(([key, child]) => [`${prefix}${key}`, ...walk(child, `${prefix}${key}.`)]);
    if (inner instanceof z.ZodArray) return walk(inner.element as z.ZodType, prefix);
    return [];
  };
  return walk(ENTITIES[kind], "");
}

const VARIABLE = /\{\{\s*([a-z]+)(?:\.([a-zA-Z0-9_.-]+))?\s*\}\}/g;

/** The `{{…}}` an action's instructions use, as `item.title`, `form.tone`, `today`. */
export function variablesIn(body: string): string[] {
  return [...new Set([...body.matchAll(VARIABLE)].map((match) => (match[2] ? `${match[1]}.${match[2]}` : match[1]!)))];
}

/**
 * The variables an action can't use, each with why: an item field none of its kinds has, a form
 * value it doesn't ask for, an unknown root. Empty when every one resolves.
 */
export function checkVariables(body: string, kinds: string[], formNames: string[]): string[] {
  const known = kinds.filter((kind): kind is ItemKind => (ITEM_KINDS as string[]).includes(kind));
  const errors: string[] = [];
  for (const variable of variablesIn(body)) {
    const [root, ...rest] = variable.split(".");
    const field = rest.join(".");
    if (root === "item") {
      if (!known.length) errors.push(`{{${variable}}}: the action shows on no item (applies-to), so there's no item`);
      else if (!known.some((kind) => fieldsOf(kind).includes(field))) errors.push(`{{${variable}}}: no field "${field}" in ${known.join(", ")} (they have: ${[...new Set(known.flatMap(fieldsOf))].join(", ")})`);
    } else if (root === "form") {
      if (!formNames.includes(field)) errors.push(`{{${variable}}}: the form asks for no "${field}"${formNames.length ? ` (it asks for: ${formNames.join(", ")})` : ""}`);
    } else if (variable !== "today" && variable !== "subject.name") errors.push(`{{${variable}}}: unknown; use item.*, form.*, subject.name or today`);
  }
  return errors;
}

/** The instructions with their variables filled in; what isn't known stays as written. */
export function renderVariables(body: string, values: { item?: Record<string, unknown>; form?: Record<string, unknown>; subject?: { name: string }; today?: string }): string {
  const get = (root: string, path: string | undefined): unknown => {
    const start = root === "item" ? values.item : root === "form" ? values.form : root === "subject" ? values.subject : root === "today" ? values.today : undefined;
    return (path ? path.split(".") : []).reduce<unknown>((at, key) => (Array.isArray(at) ? at.map((one) => (one as Record<string, unknown>)?.[key]) : (at as Record<string, unknown> | undefined)?.[key]), start);
  };
  return body.replace(VARIABLE, (whole, root: string, path?: string) => {
    const value = get(root, path);
    if (value === undefined || value === null || value === "") return whole;
    return Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : String(value);
  });
}
