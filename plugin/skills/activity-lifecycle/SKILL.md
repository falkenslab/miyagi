---
name: activity-lifecycle
description: Take a new or complex activity (a unit's project, a gamified activity, a SCORM package, a workshop, a simulation) through four phases - a plan agreed with the teacher, the build, a hidden test in the classroom, and serving it to students - with one approval to move from each phase to the next, recorded in course/drafts. Use when the teacher asks for the full process ("con el proceso completo") or when a request for something new and complex fits it; not for a quick question or a small edit.
---

# The life of an activity: plan, build, hidden test, served

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

A complex activity built straight from a request reaches the teacher when it's already in the
classroom, and every disagreement then costs a rebuild. Agree on it first, on paper, and move on
one phase at a time, each with the teacher's yes.

**When to suggest it:** something new that takes more than one sitting or several pieces (a
unit's project, a gamified activity, an escape room, a SCORM package, a workshop with peer
assessment, a simulation). Say in one line that you'd go through the process and why; the
teacher can decline it, and then you build as usual (`activity-building`). Never for a typo, a
date, a single question or a small edit. When the teacher asks for it ("con el proceso
completo"), follow it whatever the size.

## The register: `course/drafts`

Every activity in the process has one list item in `course/drafts` (`knowledge_edit`), its phase
first, in backticks, exactly one of these words, so code can count them:

```
- `planning` Escape room de SQL — plan: drafts/escape-room-sql/plan.md — next: the teacher's yes to the plan
- `building` Proyecto web del tema 3 — plan: drafts/proyecto-web/plan.md — source: drafts/proyecto-web/ — next: compare with the plan
- `hidden` Cuestionario del tema 2 — <its link in the classroom> — next: the teacher tries it on a phone
- `served` Taller de normalización — <its link> — shown on 2026-10-22
```

Then its name, and links to what exists: its `plan.md`, its source in `drafts/<slug>/`, its
link in the classroom once it's there, and what it needs for the next phase. Update the item when
the phase changes; never two items for one activity. A `served` item stays until a later session
has told the teacher it's out, then it's taken off. Hidden drafts that didn't go through the
process are `hidden` items too (`publish-check`). Without a classroom, activities stop at
`building`: say what's ready to upload once one is connected.

## 1. Plan (`planning`)

In plan mode if you're in it (the teacher turns it on with `/plan` or Shift+Tab; suggest it, in
one line, when you start): there you can only read and write the plan file. Out of it, write
only the plan anyway until the teacher approves it.

Write `drafts/<slug>/plan.md` with `Write` **before** presenting it, in plan mode too: it's the
one file plan mode lets you write, so the plan survives the session and the register can link
it. `present_plan` shows that file's content; it doesn't replace it (a real session kept the
plan only in `present_plan` and wrote it after the approval, `tests/2026-10-22T22-14-ciclo-actividad/`).
It holds:

- **Objectives** and the criteria it serves (from `course/teaching-plan`, by their codes).
- **What students do and produce**, step by step, with the time each step takes.
- **How it's assessed**: the evidence, the rubric or the checks (`rubric-design`), the weight.
- **The classroom pieces** and their settings (activity types, groups, dates, restrictions,
  completion), checked against what this classroom supports (`course/moodle-capabilities`).
- **Materials** to write or reuse, with their sources.
- **Risks**: what can go wrong (time, access, devices, a student who's absent, diversity) and
  what the plan does about it.

Ask `pedagogy-reviewer` to review it, and address or answer each point of its critique in the
plan itself. Iterate with the teacher. Then ask for the yes to build: `present_plan` in plan
mode, otherwise `request_human_approval`, saying the plan phase ends and what building means.
Add the item as `planning` as soon as you can edit the knowledge base: plan mode doesn't let you,
and until then a `plan.md` the page doesn't mention already counts as `planning` at the end of
the session.

## 2. Build (`building`)

Build it in `drafts/<slug>/` with the skills of each piece (`activity-building`,
`resource-authoring`, `quiz-design`, `rubric-design`, `assignment-building`;
`practice-testing` if it runs). Then compare what you built with `plan.md`, point by point, and
tell the teacher what differs and why: a change the teacher hasn't seen is a decision you took
for them. Ask for the yes to upload it, hidden.

## 3. Hidden test (`hidden`)

Upload it hidden and test it as the teacher, with `publish-check` (its link goes in the item).
Report what you tested, what you couldn't (ask the teacher to try it, with its link), and ask for
the yes to serve it.

## 4. Served (`served`)

Show it to students, check it as a student would see it (`publish-check`, pass 3), and mark the
item `served` with the date. The activity's page (`activity/<slug>`) links its `plan.md` as its
reference.

## Each approval

Says which phase ends and what the next one does: "the plan is ready; next, building it in
drafts/, nothing in the classroom yet", "built as planned except the timer (why); next, uploading
it hidden to test it", "tested hidden; next, showing it to students". One approval per phase:
don't fold two phases into one yes.
