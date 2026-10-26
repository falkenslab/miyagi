import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSdkMcpServer, getLanguage, tool } from "@falkenslab/agent-kit";
import { z } from "zod";
import { t } from "../messages/index.js";
import { drawn, paperExam } from "./exam.js";
import { exportGift, importGift, type Loss } from "./gift.js";
import { resolveDate, type CourseCalendar } from "./course.js";
import { gradingSheet } from "./grading.js";
import { accessibleHtml, checkExported, escapeHtml, localImages, plainCode } from "./notes.js";
import { COURSE_APPEARANCE, fill, loadStyle, styleExtensions, type Style, type StyleKind } from "./style.js";
import { readWorkspaceConfig, writeWorkspaceConfig } from "../workspace.js";
import { rubricDefinition, rubricTable, type Rubric } from "./rubric.js";
import { materialHash } from "./hash.js";
import { QUESTION_LEVELS, type Material, type Question, type ValidationResult } from "./model.js";
import { readPublications, recordPublication, stateOf } from "./publications.js";
import { serializeBank } from "./serialize.js";
import { aggregateSurvey, MIN_ANSWERS } from "./survey.js";
import { compareAssignments, compareQuizzes } from "./variants.js";
import { inMaterials, listMaterials, loadMaterial, resolveQuiz, shownPath, unknownCriteria } from "./store.js";

/**
 * The materials toolbox (ADR-015), the in-process MCP server "materials": validate what the
 * teacher and the agent write in materials/, export it to the classroom's formats (into
 * drafts/materials/, for the classroom extension to upload), import a teacher's GIFT bank, print
 * paper exams, and keep the publication record. Code, not the model, writes every format.
 * What an export leaves out is kept here until the next approval, which shows it (the gate below).
 */

export const MATERIALS_SERVER = "materials";

type Result = { content: { type: "text"; text: string }[]; isError?: boolean };
const ok = (text: string): Result => ({ content: [{ type: "text", text }] });
const fail = (error: unknown): Result => ({ content: [{ type: "text", text: `Refused: ${error instanceof Error ? error.message : String(error)}` }], isError: true });
async function guarded(run: () => Promise<string>): Promise<Result> {
  try {
    return ok(await run());
  } catch (error) {
    return fail(error);
  }
}

/** The losses of the exports since the last approval: what the gate adds to it. */
export interface PendingLosses {
  losses: Loss[];
}

const report = (result: ValidationResult) =>
  [...result.errors.map((f) => `  - error, line ${f.line}: ${f.message}`), ...result.warnings.map((f) => `  - warning, line ${f.line}: ${f.message}`)].join("\n");

export interface MaterialsDirs {
  materialsDir: string;
  draftsDir: string;
  sourcesDir: string;
  knowledgeDir: string;
  /** The subject's folder: its config.json says the style, its extensions provide it. */
  workspaceDir: string;
}

export function createMaterialsServer(dirs: MaterialsDirs, pending: PendingLosses) {
  const { materialsDir, draftsDir, sourcesDir, knowledgeDir, workspaceDir } = dirs;
  const exportsDir = path.join(draftsDir, "materials");
  const pathArg = z.string().describe('The material, relative to materials/ (e.g. "tema-1/variables.questions.md")');

  /** A material checked as a whole: its own findings, its quiz's banks, criteria the plan doesn't have. */
  async function check(relative: string): Promise<{ material?: Material; file: string; findings: ValidationResult; questions: Question[] }> {
    const loaded = await loadMaterial(materialsDir, relative);
    const findings: ValidationResult = { errors: [...loaded.findings.errors], warnings: [...loaded.findings.warnings] };
    let questions: Question[] = [];
    if (loaded.material?.kind === "questions") questions = loaded.material.questions;
    if (loaded.material?.kind === "quiz") {
      const resolved = await resolveQuiz(materialsDir, loaded.file, loaded.material);
      findings.errors.push(...resolved.findings.errors);
      findings.warnings.push(...resolved.findings.warnings);
      questions = resolved.picks.flatMap((pick) => pick.questions);
    }
    // An assignment's rubric, read and compared with its grade.
    if (loaded.material?.kind === "assignment" && loaded.material.rubric) {
      const rubric = await rubricOf(loaded.file, loaded.material.rubric);
      if (!rubric) findings.errors.push({ line: 1, message: `the rubric ${loaded.material.rubric} doesn't exist or doesn't validate` });
      else if (rubric.total !== loaded.material.grade) findings.warnings.push({ line: 1, message: `the rubric adds up to ${rubric.total} and the grade is ${loaded.material.grade}: the classroom scales one to the other; say it in the statement if students see the rubric's points` });
    }
    // An activity's variants (#39): each next to it, valid, and changing nothing but the context.
    const base = loaded.material;
    if ((base?.kind === "assignment" || base?.kind === "quiz") && base.variants) {
      for (const variant of base.variants) {
        const other = await loadMaterial(materialsDir, shownPath(materialsDir, path.join(path.dirname(loaded.file), variant))).catch(() => undefined);
        if (!other?.material || other.material.kind !== base.kind) {
          findings.errors.push({ line: 1, message: `the variant ${variant} isn't next to it` });
          continue;
        }
        if (other.findings.errors.length) {
          findings.errors.push({ line: 1, message: `the variant ${variant} has errors: validate it` });
          continue;
        }
        let differences: string[] = [];
        if (base.kind === "assignment" && other.material.kind === "assignment") differences = compareAssignments(base, other.material);
        if (base.kind === "quiz" && other.material.kind === "quiz") {
          const resolved = await resolveQuiz(materialsDir, other.file, other.material);
          differences = compareQuizzes(base, questions, other.material, resolved.picks.flatMap((pick) => pick.questions));
        }
        if (differences.length) findings.errors.push({ line: 1, message: `the variant ${variant} changes more than the context: ${differences.join("; ")}` });
      }
    }
    // A unit's materials, each next to it and valid.
    if (loaded.material?.kind === "unit") {
      for (const step of loaded.material.steps) {
        const item = await loadMaterial(materialsDir, shownPath(materialsDir, path.join(path.dirname(loaded.file), step.material))).catch(() => undefined);
        if (!item?.material) findings.errors.push({ line: 1, message: `${step.material} isn't next to the unit` });
        else if (item.findings.errors.length) findings.errors.push({ line: 1, message: `${step.material} has errors: validate it` });
      }
    }
    // The gradebook's activities, each a material that exists.
    if (loaded.material?.kind === "grading") {
      for (const item of loaded.material.categories.flatMap((category) => category.items)) {
        if (!existsSync(path.join(materialsDir, item))) findings.errors.push({ line: 1, message: `${item} isn't in materials/` });
      }
    }
    const named = loaded.material?.kind === "assignment" ? loaded.material.criteria : loaded.material?.kind === "rubric" ? loaded.material.criteria.flatMap((criterion) => criterion.criteria) : [];
    const unknown = await unknownCriteria(knowledgeDir, [...questions.flatMap((question) => question.criteria), ...named]);
    if (unknown.length) findings.warnings.push({ line: 1, message: `criteria not found in the curriculum pages, the assessment matrix or the teaching plan: ${unknown.join(", ")}` });
    return { material: loaded.material, file: loaded.file, findings, questions };
  }

  const slugOf = (relative: string) => relative.replace(/\.(questions|quiz|notes|assignment|rubric)\.md$/, "");

  /** The course's calendar, materials/course.md, when it exists and validates. */
  async function calendar(): Promise<CourseCalendar | undefined> {
    const loaded = await loadMaterial(materialsDir, "course.md").catch(() => undefined);
    return loaded?.material?.kind === "course" && !loaded.findings.errors.length ? loaded.material : undefined;
  }

  /** A material's dates for every group (or one): due and cut-off of an assignment, each assignment of a unit. */
  async function datesOf(relative: string, onlyGroup?: string): Promise<string[]> {
    const course = await calendar();
    if (!course) throw new Error("materials/course.md is missing or invalid: its groups' starts and holidays turn relative dates into real ones (materials-format)");
    const groups = course.groups.filter((group) => !onlyGroup || group.id === onlyGroup);
    if (!groups.length) throw new Error(`no group "${onlyGroup}" in materials/course.md`);
    const loaded = await loadMaterial(materialsDir, relative);
    const assignments: { name: string; due?: string; cutoff?: string }[] = [];
    if (loaded.material?.kind === "assignment") assignments.push({ name: relative, due: loaded.material.due, cutoff: loaded.material.cutoff });
    if (loaded.material?.kind === "unit") {
      for (const step of loaded.material.steps.filter((one) => one.material.endsWith(".assignment.md"))) {
        const item = await loadMaterial(materialsDir, shownPath(materialsDir, path.join(path.dirname(loaded.file), step.material)));
        if (item.material?.kind === "assignment") assignments.push({ name: step.material, due: item.material.due, cutoff: item.material.cutoff });
      }
    }
    const lines: string[] = [];
    for (const group of groups) {
      for (const one of assignments) {
        for (const [what, spec] of [["due", one.due], ["cut-off", one.cutoff]] as const) {
          if (!spec) continue;
          const resolved = resolveDate(spec, group, course.holidays);
          lines.push(`group ${group.id}: ${one.name} ${what} ${resolved.date}${resolved.moved ? ` (${resolved.moved})` : ""}`);
        }
      }
    }
    return lines;
  }

  /** A rubric named by a material, next to it or from materials/; undefined when it can't be read. */
  async function rubricOf(file: string, name: string): Promise<Rubric | undefined> {
    for (const candidate of [shownPath(materialsDir, path.join(path.dirname(file), name)), name]) {
      const loaded = await loadMaterial(materialsDir, candidate).catch(() => undefined);
      if (loaded?.material?.kind === "rubric" && !loaded.findings.errors.length) return loaded.material;
    }
    return undefined;
  }

  /** The style chosen for the exports (config.json `agent.appearance`, #21), or none: the course's theme. */
  async function chosenStyle(): Promise<{ style?: Style; note?: string }> {
    const name = (await readWorkspaceConfig(workspaceDir).catch(() => undefined))?.agent.appearance;
    if (!name || name === COURSE_APPEARANCE) return {};
    const dir = (await styleExtensions(workspaceDir)).get(name);
    if (!dir) return { note: `The style "${name}" chosen for this subject isn't installed or is off: exported without a style. Tell the teacher (materials_style lists the styles there are).` };
    return { style: await loadStyle(name, dir) };
  }

  /** The style's templates as the exporters take them; plain where it has none. */
  function styling(style: Style | undefined) {
    const labels = Object.fromEntries(Object.entries(t().styleLabels).map(([key, value]) => [`label:${key}`, value]));
    const template = (kind: StyleKind) => style?.templates[kind];
    const code = template("code");
    const question = template("question");
    const feedback = template("feedback");
    return {
      labels,
      code: code ? (escaped: string, language: string) => fill(code, { ...labels, code: escaped, language }) : plainCode,
      gift: {
        ...(question ? { question: (html: string) => fill(question, { ...labels, body: html }) } : {}),
        ...(feedback ? { feedback: (html: string) => fill(feedback, { ...labels, body: html }) } : {}),
        ...(code ? { code: (escaped: string, language: string) => fill(code, { ...labels, code: escaped, language }) } : {}),
      },
    };
  }

  /** What to tell about the style an export used: its name, what was fixed in it, and the check after saving. */
  function styleLines(chosen: { style?: Style; note?: string }): string[] {
    if (chosen.note) return [chosen.note];
    if (!chosen.style) return [];
    return [
      `Style "${chosen.style.name}" applied (${Object.keys(chosen.style.templates).join(", ") || "no templates: plain"}).`,
      chosen.style.warnings.length ? `Its templates weren't accessible as they are; fixed in the export (tell the teacher, whose style it is):\n${chosen.style.warnings.map((warning) => `  - ${warning}`).join("\n")}` : "",
      "After saving it in the classroom, read it back: if the classroom removed the inline styles, tell the teacher (only its administrator allows them) and export again with materials_style set to course.",
    ].filter(Boolean);
  }

  /** A page's or chapter's HTML, written and checked, with the images it shows copied next to it; in its style's template when it has one. */
  async function writeHtml(file: string, markdown: string, top: number, sourceDir: string, wrap?: { kind?: "page" | "assignment"; title: string; style?: Style }): Promise<string[]> {
    await mkdir(path.dirname(file), { recursive: true });
    for (const image of localImages(markdown)) {
      const target = path.join(path.dirname(file), image);
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(path.join(sourceDir, image), target);
    }
    const { labels, code } = styling(wrap?.style);
    const template = wrap?.kind ? wrap.style?.templates[wrap.kind] : undefined;
    const html = template ? fill(template, { ...labels, title: escapeHtml(wrap!.title), body: accessibleHtml(markdown, template.bodyTop, code) }) : accessibleHtml(markdown, top, code);
    await writeFile(file, html);
    return checkExported(html, file).map((problem) => `${shownPath(draftsDir, file)}: ${problem.message}`);
  }

  return createSdkMcpServer({
    name: MATERIALS_SERVER,
    version: "1.0.0",
    tools: [
      tool("materials_list", "List the subject's materials in materials/: each one's kind, title, size, whether it validates, and whether it's published and unchanged since.", {}, () =>
        guarded(async () => {
          const files = await listMaterials(materialsDir);
          if (!files.length) return "materials/ has no materials yet (*.questions.md, *.quiz.md, *.notes.md).";
          const publications = await readPublications(materialsDir);
          const lines = [];
          for (const file of files) {
            const { material, findings } = await check(file);
            const size = material?.kind === "questions" ? `${material.questions.length} questions` : material?.kind === "quiz" ? `${material.questions.length} parts` : material?.kind === "notes" ? (material.as === "book" ? `book, ${material.chapters.length} chapters` : "page") : material?.kind === "rubric" ? `${material.criteria.length} criteria, ${material.total} points` : material?.kind === "assignment" ? `grade ${material.grade}` : material?.kind === "grading" ? `${material.categories.length} categories` : material?.kind === "unit" ? `${material.steps.length} materials` : material?.kind === "course" ? `${material.groups.length} groups` : material?.kind === "survey" ? `${material.questions.length} questions, anonymous` : "";
            const state = material ? stateOf(publications, file, materialHash(material)) : undefined;
            lines.push(`${file}  [${material?.kind ?? "?"}] ${material?.title ?? ""}  ${size}  ${findings.errors.length ? `${findings.errors.length} errors` : "valid"}  ${state?.state ?? ""}${state?.last ? ` (${state.last.where})` : ""}`);
          }
          return lines.join("\n");
        }),
      ),

      tool("materials_validate", "Check a material in materials/ before exporting it: errors (it can't be exported as it is) and warnings, with line numbers.", { path: pathArg }, (a) =>
        guarded(async () => {
          const { material, findings } = await check(a.path);
          const head = material ? `${a.path}: ${material.kind} "${material.title}"` : a.path;
          if (!findings.errors.length && !findings.warnings.length) return `${head}: valid.`;
          return `${head}: ${findings.errors.length} errors, ${findings.warnings.length} warnings.\n${report(findings)}`;
        }),
      ),

      tool(
        "materials_export",
        "Export a material to the classroom's import format, into drafts/materials/ (never by hand): a bank to GIFT; a quiz to the GIFT of the questions it takes plus its plan (settings, description, slots and marks) for the classroom's quiz skill; notes to accessible HTML, a page or a book's chapters, with their images. Refuses a material with errors. Says what the format leaves out; the next approval shows it to the teacher.",
        { path: pathArg },
        (a) =>
          guarded(async () => {
            const { material, findings } = await check(a.path);
            if (!material || findings.errors.length) throw new Error(`${a.path} doesn't validate:\n${report(findings)}`);
            const chosen = await chosenStyle();
            const out = path.join(exportsDir, slugOf(a.path));
            const hash = materialHash(material);
            if (material.kind === "questions") {
              const result = exportGift(material, undefined, styling(chosen.style).gift);
              if (result.errors.length) throw new Error(`can't be exported as it is (the teacher decides how to change it):\n${result.errors.map((f) => `  - line ${f.line}: ${f.message}`).join("\n")}`);
              await mkdir(path.dirname(out), { recursive: true });
              await writeFile(`${out}.gift`, result.gift);
              pending.losses.push(...result.losses);
              return [
                `Exported ${material.questions.length} questions to drafts/${shownPath(draftsDir, `${out}.gift`)}, category "${material.category}" (hash ${hash}).`,
                result.losses.length ? `Left out by the format (the approval will show it): ${result.losses.map((loss) => `${loss.code} (${loss.questions.join(", ")})`).join("; ")}.` : "Nothing left out.",
                `After it's imported, record it: record_publication with this path.`,
                ...styleLines(chosen),
              ].join("\n");
            }
            if (material.kind === "notes") {
              const sourceDir = path.dirname(inMaterials(materialsDir, a.path));
              const problems: string[] = [];
              const written: string[] = [];
              if (material.as === "page") {
                problems.push(...(await writeHtml(`${out}.html`, material.markdown, 2, sourceDir, { kind: "page", title: material.title, style: chosen.style })));
                written.push(`drafts/${shownPath(draftsDir, `${out}.html`)}`);
              } else {
                if (material.markdown) {
                  problems.push(...(await writeHtml(path.join(out, "00-intro.html"), material.markdown, 3, sourceDir, { title: material.title, style: chosen.style })));
                  written.push(`drafts/${shownPath(draftsDir, path.join(out, "00-intro.html"))} (the book's introduction)`);
                }
                for (const [index, chapter] of material.chapters.entries()) {
                  const file = path.join(out, `${String(index + 1).padStart(2, "0")}.html`);
                  problems.push(...(await writeHtml(file, chapter.markdown, 3, sourceDir, { title: chapter.title, style: chosen.style })));
                  written.push(`drafts/${shownPath(draftsDir, file)}: chapter "${chapter.title}"`);
                }
              }
              if (problems.length) throw new Error(`the exported HTML has problems:\n${problems.map((line) => `  - ${line}`).join("\n")}`);
              return [
                `Notes "${material.title}" as a ${material.as} (hash ${hash}), accessible HTML for the classroom's content (a fragment: it goes in the page's or chapter's content, not as a file):`,
                ...written.map((line) => `- ${line}`),
                localImages(material.markdown + material.chapters.map((chapter) => chapter.markdown).join("\n")).length ? "Its images are next to the HTML: upload them with it and keep their names." : "",
                "After it's published, record_publication with this path.",
                ...styleLines(chosen),
              ].filter(Boolean).join("\n");
            }
            if (material.kind === "rubric") {
              await mkdir(path.dirname(out), { recursive: true });
              await writeFile(`${out}.rubric.json`, `${JSON.stringify(rubricDefinition(material), null, 2)}\n`);
              await writeFile(`${out}.rubric.html`, rubricTable(material, { criterion: t().rubricCriterion, levels: t().rubricLevels }));
              return [
                `Rubric "${material.title}": ${material.criteria.length} criteria, adding up to ${material.total} (hash ${hash}).`,
                `- drafts/${shownPath(draftsDir, `${out}.rubric.json`)}: its definition for the classroom's grading editor (criteria and levels, as they are)`,
                `- drafts/${shownPath(draftsDir, `${out}.rubric.html`)}: the table, to show students or print`,
                "After it's set in the classroom, record_publication with this path: grading follows the version published.",
              ].join("\n");
            }
            if (material.kind === "assignment") {
              const problems = await writeHtml(`${out}.html`, material.statement, 2, path.dirname(inMaterials(materialsDir, a.path)), { kind: "assignment", title: material.title, style: chosen.style });
              if (problems.length) throw new Error(`the exported statement has problems:\n${problems.map((line) => `  - ${line}`).join("\n")}`);
              const rubric = material.rubric ? await rubricOf(inMaterials(materialsDir, a.path), material.rubric) : undefined;
              return [
                `Assignment "${material.title}" (hash ${hash}):`,
                `- drafts/${shownPath(draftsDir, `${out}.html`)}: its statement, accessible HTML for the assignment's description`,
                `Settings (the teacher's intent, for the classroom's assignment skill): grade ${material.grade}; submission ${material.submission}${material.submission !== "text" ? `, up to ${material.files} file(s)${material.formats.length ? ` (${material.formats.join(", ")})` : ""}` : ""}; ${material.group ? "group submission" : "individual"}; due ${material.due ?? "none"}; cut-off ${material.cutoff ?? "none"}.`,
                material.due && !/^\d{4}/.test(material.due) ? "Its dates are relative to a group's start: resolve them with materials_resolve before setting them." : "",
                rubric ? `Rubric: ${material.rubric} (${rubric.total}): export it and set it as its grading method.` : "No rubric.",
                "After it's published, record_publication with this path.",
                ...styleLines(chosen),
              ].filter(Boolean).join("\n");
            }
            if (material.kind === "grading") {
              await mkdir(path.dirname(out), { recursive: true });
              const sheet = path.join(exportsDir, "grading.csv");
              await writeFile(sheet, gradingSheet(material, t().sheetStudent, t().sheetFinal));
              return [
                `Grading "${material.title}" (hash ${hash}): the gradebook's plan, for the classroom's gradebook skill:`,
                ...material.categories.map((category) => `- category "${category.name}", weight ${category.weight} %: ${category.items.join(", ") || "no activities yet"}`),
                `A spreadsheet to grade outside the classroom, without students: drafts/${shownPath(draftsDir, sheet)}.`,
                "After the gradebook is set, record_publication with this path.",
              ].join("\n");
            }
            if (material.kind === "unit") {
              const dates = (await calendar()) ? await datesOf(a.path).catch(() => []) : [];
              return [
                `Unit "${material.title}" (hash ${hash}): a section, with its summary "${material.summary || "(none)"}" and, in this order:`,
                ...material.steps.map((step, index) => `${index + 1}. ${step.material}${step.after ? ` — opens after ${step.after.material} is ${step.after.condition} (an access restriction)` : ""}`),
                "Export each material, publish them hidden in this order with their restrictions, test the section as a student, then show it.",
                dates.length ? `Dates per group:\n${dates.map((line) => `- ${line}`).join("\n")}` : "",
                "After it's published, record_publication with this path and each material's.",
              ].filter(Boolean).join("\n");
            }
            if (material.kind === "survey") {
              return [
                `Survey "${material.title}" (hash ${hash}), anonymous: for the classroom's survey activity, set so that no names are recorded and students don't see the results.`,
                `Its description, the first thing students read: ${material.purpose}`,
                ...material.questions.map((question, index) => `${index + 1}. ${question.name}: ${question.type === "text" ? "a text answer" : `${question.type === "single" ? "one" : "any"} of ${question.options.map((option) => `"${option}"`).join(", ")}`}, not required${question.text ? `. Text: ${question.text.replace(/\s+/g, " ")}` : ""}`),
                "Every question optional. Publish it hidden, check as a student that it says it's anonymous, show it with its approval, and record_publication with this path.",
                "The first time a survey goes to this classroom, remind the teacher to check with the school whether families must be told (the guide has a model text).",
                "Its results are read only in aggregate, and go through survey_aggregate before anything is written down.",
              ].join("\n");
            }
            if (material.kind === "course") return `The course's calendar: ${material.groups.map((group) => `group ${group.id} from ${group.start}`).join(", ")}; ${material.holidays.length} holidays; nothing to export: materials_resolve uses it.`;
            if (material.kind !== "quiz") throw new Error(`${a.path} can't be exported`);
            const quizFile = inMaterials(materialsDir, a.path);
            const { picks } = await resolveQuiz(materialsDir, quizFile, material);
            await mkdir(out, { recursive: true });
            const lines = [`Quiz "${material.title}" (${material.purpose}), hash ${hash}.`];
            const slots: string[] = [];
            for (const pick of picks) {
              const result = exportGift(pick.bank, pick.random ? pick.bank.questions : pick.questions, styling(chosen.style).gift);
              if (result.errors.length) throw new Error(`${pick.bankFile} can't be exported as it is:\n${result.errors.map((f) => `  - line ${f.line}: ${f.message}`).join("\n")}`);
              const file = path.join(out, `${path.basename(pick.bankFile, ".questions.md")}.gift`);
              await writeFile(file, result.gift);
              pending.losses.push(...result.losses.filter(() => !pick.random));
              lines.push(`- drafts/${shownPath(draftsDir, file)}: ${pick.random ? `the whole bank, category "${pick.bank.category}"` : `${pick.questions.length} questions`}`);
              if (pick.random) slots.push(`${pick.random} random question(s) from category "${pick.bank.category}"`);
              else slots.push(...pick.questions.map((question) => `"${question.name}", ${question.points} point(s)`));
            }
            lines.push(`Settings (the teacher's intent, to map to the classroom's): ${Object.entries(material.settings).map(([key, value]) => `${key}: ${value}`).join("; ") || "none given: follow its purpose"}.`);
            lines.push(`Slots, in order: ${slots.join("; ")}.`);
            lines.push(`Description for students:\n${material.description || "(none)"}`);
            lines.push(`Import the GIFT files, build the quiz with these slots and marks, then record_publication with this path.`);
            lines.push(...styleLines(chosen));
            return lines.join("\n");
          }),
      ),

      tool(
        "materials_resolve",
        "The real dates of an assignment or of a unit's assignments, for every group or one, from their relative dates (\"semana 3 viernes 23:59\") and materials/course.md (each group's start, the holidays). A date on a holiday or a weekend moves to the school day before, and says so.",
        { path: pathArg, group: z.string().optional().describe("One group's id; default: every group") },
        (a) => guarded(async () => (await datesOf(a.path, a.group)).join("\n") || `${a.path} has no dates.`),
      ),

      tool(
        "materials_import",
        "Turn a GIFT question bank (the teacher's, in sources/ or drafts/) into a .questions.md in materials/, to edit and export from then on. Never overwrites a material.",
        {
          from: z.string().describe('The GIFT file, relative to the subject: "sources/banco.gift" or "drafts/tema-1/tema-1.gift"'),
          to: z.string().describe('The new bank, relative to materials/, ending in .questions.md (e.g. "tema-1/variables.questions.md")'),
          title: z.string().describe("The bank's title"),
        },
        (a) =>
          guarded(async () => {
            const base = a.from.replace(/\\/g, "/").startsWith("sources/") ? sourcesDir : draftsDir;
            const from = path.resolve(base, a.from.replace(/\\/g, "/").replace(/^(sources|drafts)\//, ""));
            if (!from.startsWith(path.resolve(base) + path.sep)) throw new Error(`${a.from} is outside sources/ and drafts/`);
            if (!a.to.endsWith(".questions.md")) throw new Error(`the new bank's name ends in .questions.md`);
            const to = inMaterials(materialsDir, a.to);
            if (existsSync(to)) throw new Error(`${a.to} already exists: choose another name`);
            const bank = importGift(await readFile(from, "utf8"), a.title);
            if (!bank.questions.length) throw new Error(`no questions found in ${a.from}`);
            await mkdir(path.dirname(to), { recursive: true });
            await writeFile(to, serializeBank(bank));
            const { findings } = await check(a.to);
            const types = [...new Set(bank.questions.map((question) => question.type))].join(", ");
            return `Imported ${bank.questions.length} questions (${types}) into materials/${a.to}.${findings.errors.length || findings.warnings.length ? `\nTo review:\n${report(findings)}` : ""}`;
          }),
      ),

      tool(
        "materials_exam",
        "Print a quiz as a paper exam: versions A, B… with questions and options in another order, each with its answer key, as HTML in drafts/exams/<quiz>/ (print it, or turn it into a PDF with drafts_pdf). The seed is kept there: the same seed gives the same versions.",
        {
          path: z.string().describe("The quiz, relative to materials/"),
          versions: z.number().int().min(1).max(6).optional().describe("How many versions (default 2)"),
          seed: z.number().int().optional().describe("Reuse a seed to print the same versions again; default: the one kept, or a new one"),
        },
        (a) =>
          guarded(async () => {
            const { material, findings } = await check(a.path);
            if (!material || material.kind !== "quiz" || findings.errors.length) throw new Error(`${a.path} isn't a valid quiz:\n${report(findings)}`);
            const out = path.join(draftsDir, "exams", slugOf(a.path));
            const kept = JSON.parse(await readFile(path.join(out, "exam.json"), "utf8").catch(() => "{}")) as { seed?: number };
            const seed = a.seed ?? kept.seed ?? Math.floor(Math.random() * 2 ** 31);
            const { picks } = await resolveQuiz(materialsDir, inMaterials(materialsDir, a.path), material);
            const questions = picks.flatMap((pick) => (pick.random ? drawn(pick.questions, pick.random, seed) : pick.questions));
            const m = t();
            const exam = paperExam(material.title, material.description, questions, a.versions ?? 2, seed, { name: m.examName, version: m.examVersion, key: m.examKey, points: m.examPoints, trueFalse: m.examTrueFalse }, getLanguage());
            await mkdir(out, { recursive: true });
            for (const version of exam.versions) await writeFile(path.join(out, `${version.letter}.html`), version.html);
            await writeFile(path.join(out, "key.html"), exam.key);
            await writeFile(path.join(out, "exam.json"), `${JSON.stringify({ quiz: a.path, seed, versions: exam.versions.length, questions: questions.length }, null, 2)}\n`);
            return `Printed ${exam.versions.length} versions of ${questions.length} questions in drafts/${shownPath(draftsDir, out)}/ (${exam.versions.map((version) => `${version.letter}.html`).join(", ")}, key.html), seed ${seed}.`;
          }),
      ),

      tool(
        "materials_coverage",
        "The exam bank at a glance: how many questions every bank in materials/ has per criterion and level (basic, intermediate, advanced, or not said), and which criteria the teacher's plan has with none. To see what's missing before writing more or building an exam.",
        { criteria: z.array(z.string()).optional().describe("Only these criteria; default: every one the banks or the plan name") },
        (a) =>
          guarded(async () => {
            const counts = new Map<string, Map<string, number>>();
            const banks: string[] = [];
            for (const file of (await listMaterials(materialsDir)).filter((one) => one.endsWith(".questions.md"))) {
              const loaded = await loadMaterial(materialsDir, file).catch(() => undefined);
              if (loaded?.material?.kind !== "questions") continue;
              banks.push(file);
              for (const question of loaded.material.questions) {
                for (const criterion of question.criteria.length ? question.criteria : ["(no criterion)"]) {
                  const levels = counts.get(criterion) ?? new Map<string, number>();
                  const level = question.level ?? "not said";
                  levels.set(level, (levels.get(level) ?? 0) + 1);
                  counts.set(criterion, levels);
                }
              }
            }
            if (!banks.length) return "No question banks in materials/ yet.";
            const wanted = a.criteria?.length ? a.criteria : [...counts.keys()].sort();
            const columns = [...QUESTION_LEVELS, "not said"];
            const rows = wanted.map((criterion) => {
              const levels = counts.get(criterion);
              const cells = columns.map((level) => levels?.get(level) ?? 0);
              return `| ${criterion} | ${cells.join(" | ")} | ${cells.reduce((sum, n) => sum + n, 0)} |`;
            });
            const missing = a.criteria?.length ? a.criteria.filter((criterion) => !counts.has(criterion)) : [];
            return [
              `${banks.length} banks: ${banks.join(", ")}.`,
              `| Criterion | ${columns.join(" | ")} | Total |`,
              `| --- | ${columns.map(() => "---").join(" | ")} | --- |`,
              ...rows,
              missing.length ? `No question yet for: ${missing.join(", ")}.` : "",
              "A question counts once per criterion it names. Compare with the plan's criteria (the curriculum pages, the assessment matrix) to see the gaps.",
            ].filter(Boolean).join("\n");
          }),
      ),

      tool(
        "survey_aggregate",
        `What may be kept of an interests survey's results (#39), for the group's interests/<group> page: each option with ${MIN_ANSWERS} answers or more, the rest together only when they add up to that, free text only as how many wrote something, and nothing at all under ${MIN_ANSWERS} responses. Pass the counts as the classroom reports them, never who answered.`,
        {
          responses: z.number().int().min(0).describe("How many answered the survey"),
          group: z.string().optional().describe("The group it was for, an id of materials/course.md"),
          results: z
            .array(
              z.object({
                text: z.string().describe("The question"),
                options: z.array(z.object({ text: z.string(), count: z.number().int().min(0) })).optional().describe("A choice question's options and how many chose each"),
                textAnswers: z.number().int().min(0).optional().describe("A text question: how many wrote something"),
              }),
            )
            .describe("Each question's counts"),
        },
        (a) =>
          guarded(async () => {
            const course = await calendar();
            if (a.group && course && !course.groups.some((group) => group.id === a.group)) throw new Error(`no group "${a.group}" in materials/course.md`);
            const { kept, left } = aggregateSurvey(a.responses, a.results);
            if (!kept.length) return `${a.responses} responses: under ${MIN_ANSWERS}, nothing of it can be kept (each answer would point at someone). Tell the teacher; write nothing down.`;
            return [
              `What may go in interests/${a.group ?? "<group>"} (knowledge_create, type interests), with the date from current_time and the school year:`,
              `- ${a.responses} responses`,
              ...kept,
              left ? `(${left} options left out: fewer than ${MIN_ANSWERS} answers each.)` : "",
              "Nothing else from the results: no individual answer, no quote, no small count.",
            ].filter(Boolean).join("\n");
          }),
      ),

      tool(
        "materials_style",
        `The visual style of what the exports write (pages, statements, questions, feedback, code), for this subject. Without "style": the style in use and the styles installed (extensions with a style). With it: "${COURSE_APPEARANCE}" (no style of miyagi's, the classroom's theme: the default) or an installed style's name; only when the teacher asks for it.`,
        { style: z.string().optional().describe(`"${COURSE_APPEARANCE}" or an installed style's name`) },
        (a) =>
          guarded(async () => {
            const config = await readWorkspaceConfig(workspaceDir);
            const styles = await styleExtensions(workspaceDir);
            const current = config.agent.appearance ?? COURSE_APPEARANCE;
            if (a.style === undefined) {
              return [`In use: ${current}${current !== COURSE_APPEARANCE && !styles.has(current) ? " (not installed or off: exports go without a style)" : ""}.`, `Installed styles: ${[...styles.keys()].join(", ") || "none (a style is an extension: see the appearance skill)"}.`].join("\n");
            }
            if (a.style !== COURSE_APPEARANCE && !styles.has(a.style)) throw new Error(`no style "${a.style}" installed and on; installed: ${[...styles.keys()].join(", ") || "none"}`);
            config.agent.appearance = a.style;
            await writeWorkspaceConfig(workspaceDir, config);
            const style = a.style === COURSE_APPEARANCE ? undefined : await loadStyle(a.style, styles.get(a.style)!);
            return [
              `The subject's style is now ${a.style}: the next exports use it; what's published already doesn't change until it's exported and published again.`,
              ...(style?.warnings.length ? [`Its templates aren't accessible as they are; the exports fix them (tell the teacher):\n${style.warnings.map((warning) => `  - ${warning}`).join("\n")}`] : []),
            ].join("\n");
          }),
      ),

      tool(
        "record_publication",
        "Record that a material was published (after its import or upload succeeded): where in the classroom, and its link. Keeps the hash of the version published, so a later edit shows as changed.",
        {
          path: pathArg,
          where: z.string().describe('Where it went, e.g. "question bank, category Tema 1" or "quiz Repaso del tema 1, section 2"'),
          url: z.string().optional().describe("Its link in the classroom, if it has one"),
        },
        (a) =>
          guarded(async () => {
            const { material } = await check(a.path);
            if (!material) throw new Error(`${a.path} can't be read`);
            const hash = materialHash(material);
            await recordPublication(materialsDir, { material: a.path, hash, where: a.where, ...(a.url ? { url: a.url } : {}), at: new Date().toISOString() });
            return `Recorded: ${a.path} (hash ${hash}) published to ${a.where}.`;
          }),
      ),

      tool(
        "publication_status",
        "Whether materials are published and unchanged since, published and edited after, or not published: one material, or all of them.",
        { path: pathArg.optional() },
        (a) =>
          guarded(async () => {
            const files = a.path ? [a.path] : await listMaterials(materialsDir);
            const publications = await readPublications(materialsDir);
            const lines = [];
            for (const file of files) {
              const { material } = await check(file);
              if (!material) continue;
              const { state, last } = stateOf(publications, file, materialHash(material));
              lines.push(`${file}: ${state}${last ? ` — ${last.where}${last.url ? ` ${last.url}` : ""}, ${last.at.slice(0, 10)}` : ""}`);
            }
            return lines.join("\n") || "No materials.";
          }),
      ),
    ],
  });
}
