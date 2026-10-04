import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PageType } from "@falkenslab/agent-kit";

/**
 * The course's page types, besides agent-kit's four (summary, concept, entity, synthesis):
 * reached only through the kit's `knowledge_*` tools (its ADR-024). The layout on disk is the
 * one miyagi always had, so existing knowledge bases keep working; the root pages only need
 * `type: course` in their frontmatter (tagCoursePages()).
 */

/** The course pages at the root of the knowledge base, by slug. Nothing else goes there. */
export const COURSE_PAGE_SLUGS = ["orientation", "course-map", "moodle-capabilities", "teaching-plan", "progress", "course-audit", "drafts"] as const;

export const COURSE_PAGE_TYPES: PageType[] = [
  {
    type: "course",
    dir: "",
    indexSection: "Course",
    description:
      "One of the course's own pages, only these slugs: orientation (grading, deadlines, your real capabilities), course-map (Moodle URLs of what you've visited), " +
      "moodle-capabilities (what this Moodle supports), teaching-plan (the course's only plan: objectives O1…, criteria CE…, units, methodology, grading), " +
      "progress and course-audit (dated histories: add an entry, never rewrite earlier ones), drafts (resources still hidden in Moodle, one list item each).",
    template: `<What this page holds for the course, in one or two sentences.>

## <First section>
- <Content, linking the pages it relies on: [Topic](topic/<slug>), [Source](summary/<slug>).>`,
  },
  {
    type: "topic",
    dir: "topics",
    indexSection: "Topics",
    description:
      "One hub per topic, unit or block of the course: its objectives and criteria, methodology and plan, the content you authored (its files in drafts/<slug>/), recurring forum doubts.",
    template: `<What the topic covers and where it sits in the course, in one or two sentences.>

## Objectives and criteria
- <O… / CE… from the teaching plan: [Teaching plan](course/teaching-plan).>

## Plan
- <Sequence of sessions and activities: [Activity](activity/<slug>).>

## Content
- <What you authored for it and where its editable source is (drafts/<slug>/).>

## Sources
- [<Summary>](summary/<slug>) - what it gives this topic

## Forum doubts
- <Recurring doubts of the class and the answer given, never who asked.>`,
  },
  {
    type: "activity",
    dir: "activities",
    indexSection: "Activities",
    description:
      "One per evaluable activity (assignment, quiz, workshop, forum graded…): the grading criteria applied, its rubric, the questions imported (their files in drafts/<slug>/), linked to its topic. Fields: moodle (its URL).",
    template: `<What students do and what it assesses, in one or two sentences. Topic: [Topic](topic/<slug>).>

## Criteria
- <CE… it assesses and how much it weighs.>

## Rubric
| Criterion | Levels |
| --- | --- |
| <criterion> | <level: points - descriptor> |

## Grading decisions
- <The teacher's criteria applied (a rubric, a model solution, a policy on late or missing work) and which source they come from: [Summary](summary/<slug>).>

## Files
- <Statement, GIFT, solution: drafts/<slug>/...>`,
  },
];

/**
 * Gives `type: course` to the root pages of a knowledge base written before the knowledge_*
 * tools: the kit's store only reads a root page whose frontmatter says its type, and those
 * pages had none or one of their own (`type: orientation`, `type: progress`, even `entity`).
 * The rest of the frontmatter is kept. Idempotent.
 */
export async function tagCoursePages(knowledgeDir: string): Promise<string[]> {
  const tagged: string[] = [];
  for (const slug of COURSE_PAGE_SLUGS) {
    const file = path.join(knowledgeDir, `${slug}.md`);
    const text = await readFile(file, "utf8").catch(() => null);
    if (text === null) continue;
    const front = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
    if (front && /^type:\s*course\s*$/m.test(front[1])) continue;
    const title = /^#\s+(.+)$/m.exec(text)?.[1]?.trim() ?? slug;
    const titleLine = `title: ${/[:#]/.test(title) ? JSON.stringify(title) : title}`;
    const others = front ? front[1].split(/\r?\n/).filter((line) => !/^type:/.test(line)) : [];
    const fields = ["type: course", ...(others.some((line) => /^title:/.test(line)) ? [] : [titleLine]), ...others];
    const body = front ? text.slice(front[0].length) : text;
    const updated = `---\n${fields.join("\n")}\n---\n\n${body.replace(/^\s+/, "")}`;
    await writeFile(file, updated);
    tagged.push(slug);
  }
  return tagged;
}
