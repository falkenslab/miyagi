---
name: unit-building
description: Build one unit (a topic, a section) inside an existing Moodle course from a description - fitted to the course's plan or teaching plan, calendar, weights and style - with its methodology, notes, activities of whatever kind it needs, rubrics and checks, reviewed before publishing. Use when asked to create or redo a single unit or topic; course-building uses it for each section of a new course.
---

# Building one unit

A unit has to fit the course it lands in: same style and level as the other units, dates that continue the calendar, weights that the gradebook and the teaching plan can absorb, and objectives that the teaching plan says this unit covers. A good unit that contradicts the course around it is a bad unit.

## 1. Read the course first

- The knowledge base: `teaching-plan.md` if there is one (the objectives and criteria this unit must cover, its dates and weight), `overview.md`, the other topics' pages.
- The course in Moodle (`moodle-navigation`): the sections before and after, two or three existing activities (names, tone, level of detail, how statements are written), the gradebook (categories, weights), what the students already did.
- `sources/`: the teacher's notes or syllabus for this unit win over your own idea of it.

If something the unit needs is undecided (its weight, its dates, whether it's graded), take it from the teaching plan; if the plan doesn't say, ask in `chat`, or propose it in `run` — adding it to `teaching-plan.md` marked as a proposal — and say so.

## 2. Plan it

Write the unit's plan into its topic page (`knowledge/topics/<slug>.md`) before touching Moodle:

- **Objectives** (observable) and, if there's a teaching plan, the criteria of evaluation this unit assesses — each linked to the teaching plan.
- **Methodology** (`teaching-methodologies`): the main one and why it fits; its phases with dates.
- **Sequence**: resources and activities in order, each with its type, what it asks, how long it takes, whether and how it's graded (weight within the course).
- **Assessment**: which activity assesses which objective or criterion, with what instrument (rubric, quiz, checklist), and the formative checkpoints before the graded ones.
- **Diversity**: alternatives or support for students who need them (UDL).

Ask `pedagogy-reviewer` to review the plan (point it at the topic page and the teaching plan) and revise it with its critique before building.

## 3. Build it

In edit mode, in the unit's section (or a new one, placed where the calendar says):

1. Section name and summary: what the student will learn and do, the dates, the order to follow.
2. Resources (`resource-authoring`): the unit's actual content, at the course's level.
3. Activities, each with the skill for its kind: `assignment-building` (any assignment), `quiz-design` + `quiz-building` (quizzes), `activity-building` (workshop, lesson, glossary, wiki, database, choice, feedback, forum activities, H5P, completion, restrictions, badges, groups). Hands-on work is checked with `practice-testing` when the workspace allows it.
4. Every activity graded by hand gets its rubric in Moodle (`rubric-design`).
5. Grade items in the right category and weight; dates in the calendar's order.

Every item goes through `publish-check` (writing and accessibility) and gets its approval, one item per approval when it's new content.

## 4. Check it

The unit as a student, with the third pass of `publish-check` over the whole section: it reads in order, nothing is empty or locked without explanation, every statement is complete, quizzes in order with a non-zero total, rubrics visible where intended. Then the gradebook: the unit's items with the planned weights.

Update the topic page with what was actually created (URLs), the activity pages, `course-map.md`, `index.md` and `log.md`, and — if there's a teaching plan — mark in it that the unit is built.

## 5. Report

What was built, the decisions you took on your own, what `pedagogy-reviewer` pointed out and what you changed, and what the teacher should review before students arrive.
