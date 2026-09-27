---
name: course-design
description: Plan a course or unit's pedagogical structure - progressive organization, objectives aligned with content/activities/evaluation, varied activity types, and a diagnostic/formative/summative balance - before creating individual pieces of content.
---

# Designing a course or unit, not just its individual pieces

This is about **planning**, one level above the skills that build each resource or activity. Use it before adding several new pieces of content, when
restructuring a section, or whenever a request is really "how should this unit look",
not "add this one page".

The methodology of each unit (project, flipped classroom, gamification, cooperative work…) comes
from `teaching-methodologies`; if the teacher has a teaching plan (`teaching-plan`), the design
follows it. A whole course is built with `course-building`, one unit with `unit-building`.

## Propose vs. execute

Planning and executing are different steps. When the request is exploratory ("how would
you organize unit 3?", "what's missing pedagogically?"), propose a structure and explain
the reasoning — don't start creating activities in Moodle until the plan itself is
confirmed. When the request is explicit ("create this"), you can go straight to execution
using this skill's principles, and the building skill of each piece.

## Progressive organization

Order sections/topics so each one builds on what came before, not an arbitrary sequence.
A student shouldn't need knowledge from a later topic to complete an earlier activity.
Check the course's current order with `moodle-navigation` before proposing changes — some
sequencing may already be intentional even if it isn't obvious at first glance.

## Learning objectives

A good objective is observable — it says what the student will be able to *do*, not just
what topic will be "covered" ("explain X", "solve a problem using Y", not "understand X").
Vague objectives ("know about X") are a sign the corresponding activity or evaluation
criterion probably needs tightening too.

For each objective, check it actually connects to something concrete:

- **Content**: is there material that actually teaches it?
- **Activity**: is there something that makes the student practice or demonstrate it?
- **Evaluation**: is it actually assessed somewhere, or does it exist only as a stated
  intention?

An objective with no matching activity or evaluation, or an activity with no objective
behind it, is a misalignment worth flagging.

## Choosing activity types

Don't default to the same activity type every time (usually a quiz) just because it's
familiar. Match the type to what's actually being practiced: a forum or workshop for
discussion/peer-review skills, an assignment for extended reasoning or production, a quiz
for quick recall or applied problems, a lesson for guided, branching content. Reviewing a
section that's five quizzes in a row is itself a signal to reconsider. This is only about
*which* type fits — once it's chosen, its building skill designs and sets it up
(`assignment-building`, `activity-building`, `quiz-design` + `quiz-building`).

## Evaluation balance

A course benefits from a mix, not just a single high-stakes exam at the end:

- **Diagnostic**: something early that reveals the starting point, if it matters for how
  the course proceeds.
- **Formative**: lower-stakes checks along the way, with feedback the student can act on
  before the stakes go up.
- **Summative**: the graded activities that count toward the final grade.

If a course is entirely summative with no formative checkpoints, or the reverse, that's
worth naming explicitly in a proposal.

## Using this alongside other skills

`course-design` decides *what* the course or unit contains and why, in what order, and which
activity type fits where; it's the source of the principles the teaching plan (`teaching-plan`)
and each unit's plan (`unit-building`) follow, and that `pedagogy-reviewer` and `course-auditor`
check against. The methodology comes from `teaching-methodologies`; each piece is then designed
and built with `resource-authoring`, `assignment-building`, `activity-building` or `quiz-design` +
`quiz-building`, its grading with `rubric-design`, and everything goes through `publish-check`.
