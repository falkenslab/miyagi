---
name: criterial-assessment
description: Assess by evaluation criteria, not only by activity - the assessment matrix of the course (each criterion or learning outcome, the instruments that give evidence of it, their weights and where they live in the classroom's gradebook), each mark traced to its criterion, and the grade per criterion or learning outcome the plan asks for. Use when the teacher asks to assess by criteria or by learning outcomes, to build or check the assessment matrix, to set up the gradebook by criteria, or to know how the class is doing on a criterion.
---

# Assessing by criteria

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

What this skill says about the classroom applies to the connected one, if any; without one, keep it in the knowledge base or build it in `drafts/`.

Assessing by criteria means a student's grade can be explained criterion by criterion: which
evidence showed each criterion, with which instrument, weighing how much. An activity's mark that
can't be traced to a criterion doesn't count towards that criterion, however good the activity.

## 1. The criteria

From the most official source there is, in this order:

1. `curriculum/` pages, kept from the norms the teacher brought (`teaching-plan`): the learning
   outcomes, competences and criteria verbatim, with their official numbers.
2. `course/teaching-plan`: the plan's own criteria, when there's no official curriculum.
3. What the teacher gives (in `sources/` or in the chat).

Without any of them, say so; never invent criteria to assess by.

## 2. The assessment matrix

Keep it in `course/assessment-matrix` (`knowledge_create`, type `course`): one row per criterion
(or learning outcome), with:

- its number and wording, quoted;
- the instruments that give evidence of it (each activity, rubric criterion, quiz question
  category, observation), linked to their `activity/<slug>` pages;
- the weight of each instrument within the criterion, and of the criterion within the learning
  outcome or the grade, as the plan says;
- where it lives in the classroom's gradebook (a category, a grade item, an outcome or
  competency, whatever the classroom uses).

Check it before saying it's done: every criterion has at least one instrument; no instrument
claims a criterion it can't evidence; the weights add up as the plan says; nothing contradicts
`course/teaching-plan` (if it does, the plan wins or the teacher decides). The matrix is about the
course, never about students: no names, no aliases, no individual marks in it.

## 3. Grading by criteria

- When grading (`grading-rubric`), each rubric criterion points to the evaluation criteria it
  evidences, and the feedback names them ("criterion 2.3: …"), so the student knows what each part of the
  mark means.
- The gradebook: setting it up by criteria or learning outcomes (categories with their weights,
  aggregation, outcomes) is a change students see; ask for approval, and do it with the classroom
  extension's gradebook skill. Without a classroom, write the setup in `drafts/` for the teacher.
- How the class is doing on a criterion: read the grades from the classroom, aggregate them by
  criterion with the matrix, and report class-level patterns (which criteria most students
  haven't reached, which instrument fails to discriminate). Nothing about named students goes in
  the knowledge base; what the teacher needs per student, say it in the conversation.

## 4. When the evidence is missing

A criterion with no evidence yet, or one that only a single quiz question evidences, is a gap in
the course, not a student's failure: tell the teacher, and propose the activity or instrument
that would cover it (`activity-building`, `rubric-design`, `quiz-design`).
