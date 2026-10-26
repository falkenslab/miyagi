---
name: personalised-activities
description: Personalise an activity for a group, never for a student - an anonymous interests survey in materials/surveys/, its results kept only in aggregate in the group's interests page, and two to four equivalent variants of an assignment or a quiz set in those interests (only the context changes) besides the neutral one, offered as "choose your context". Use when the teacher wants activities set in what the class cares about, an interests survey, or variants of an activity in other contexts.
---

# Activities in what the group cares about

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

A context students care about (their sport, their music, their games) helps them start, and it
changes nothing of what's learnt or how it's assessed. So: per group, never per student. What a
group likes comes from an anonymous, voluntary survey read only in aggregate; the activity gets
variants that tell the same task in those contexts; each student chooses one.

## 1. The survey

- Write it in `materials/surveys/<slug>.survey.md` (`materials-format`): its `purpose` (what it's
  for and what will be done with it, which students read first), `anonymous: true`, the group of
  `materials/course.md` it's for, and three to five questions about interests: themes to choose
  from (`multiple`), one preference (`single`), at most one free text.
- Never who they are or anything sensitive: no name, contact or date of birth; nothing about
  health, beliefs, origin, family, money, politics or sexuality. The validation refuses them; don't
  rephrase one to get it through.
- The first time a survey goes to a classroom, tell the teacher to check with the school whether
  families must be told first (the guide has a model text). That's the school's call, not advice of
  yours.
- Export it, then publish it with the classroom extension's survey skill: anonymous, so no names
  are recorded, results not shown to students, hidden first and checked as a student (it must say
  it's anonymous), then shown with its approval; `record_publication`.

## 2. The results, only in aggregate

When it closes (or the teacher says), read the results as the classroom reports them, and pass
the counts to `survey_aggregate`: it says what may be kept (each option with three answers or
more, nothing under three responses, free text only as themes three or more mention, never
quoted). Write that, and only that, in `interests/<group>` (`knowledge_create`, type
`interests`) with the date (`current_time`) and the school year. Nothing about a student, ever,
anywhere. When a new school year starts, the old page is replaced by the new survey's, or deleted.

## 3. The variants

- The neutral activity (an `.assignment.md` or a `.quiz.md`) lists its variants:
  `variants: [tarea-2.musica.assignment.md, tarea-2.deporte.assignment.md]`, two to four, each its
  own file next to it, in the group's top themes.
- **Only the context changes**: the names, the story, the data's subject. Same task, steps, data
  size, criteria, rubric, points, question types and levels, same dates and what's handed in. The
  validation compares them and refuses any other difference; then `pedagogy-reviewer` checks
  that none is harder or longer to read than the neutral one, and you fix what it finds.
- Contexts every student can take part in, without stereotypes (a theme isn't for "the boys" or
  "the girls"), and that a student who likes none can still follow: the neutral one is always
  offered.

## 4. Delivering them

- **Choose your context** (the default): an assignment is one activity whose statement offers the
  contexts (the neutral one first, each variant as its own section) and is graded once with the
  same rubric; a quiz is one per context in the same section, and the teacher decides how the
  gradebook counts them. Students pick; nobody is assigned a context.
- **One variant per group**, only when the teacher decides it: each variant restricted to an
  existing group of the classroom. Never per named student, and never creating or changing groups
  for it (that's enrolment).
- Publish them like any activity (`publish-check`): hidden, tested, shown with their approval;
  `record_publication` for each file. Name the interests page in the activity's page.
