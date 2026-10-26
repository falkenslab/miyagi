---
name: exam-bank
description: Keep an exam bank by criterion and level that serves from one course to the next - questions in materials/ tagged with the criteria they give evidence of and their level (basic, intermediate, advanced), the bank's coverage checked against the plan's criteria, and quizzes and paper exams built by criterion and level from it. Use when the teacher wants a bank of questions to reuse, to know which criteria have too few questions, or an exam that covers given criteria at given levels.
---

# An exam bank by criterion and level

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

An exam bank is the subject's question banks (`materials/*.questions.md`, `materials-format`)
kept so that next year's exam starts from them: each question says which criteria it gives
evidence of and how hard it is, and the bank covers every criterion the plan assesses.

## 1. Its shape

- **One bank per unit or per block of criteria** (`materials/banco/<slug>.questions.md`), not one
  per exam: exams pick from banks.
- **Every question with its criteria and its level**: `criteria: 1.1, 1.2 · level: basic` in its
  metadata line (or as the bank's default in the frontmatter). The criteria are the plan's, as its
  curriculum pages or assessment matrix number them (`criterial-assessment`), never invented.
- **Levels**: `basic` (recall a fact, apply a rule as taught), `intermediate` (apply it to a new
  case, explain why), `advanced` (combine, decide, find an error, justify a choice). Say which
  one by what the student has to do, not by how long the question is.
- Questions with their feedback (why each wrong option is wrong), as `quiz-design` says: a bank
  is for learning too.

## 2. Its coverage

`materials_coverage` counts the questions per criterion and level. Compare it with the plan's
criteria (`course/assessment-matrix`, the `curriculum/` pages) and tell the teacher the gaps: a
criterion assessed by exam with no questions, or only basic ones; levels not said. Offer to write
what's missing, a few questions at a time, for the teacher to review.

## 3. Exams from it

A quiz (`.quiz.md`) picks from the banks by criterion and level:

```yaml
questions:
  - bank: banco/tema-1.questions.md
    pick: 3
    criteria: [1.1]
    level: basic
  - bank: banco/tema-1.questions.md
    pick: 1
    criteria: [1.2]
    level: advanced
```

A number with a filter is drawn when it's exported, the same questions for everyone (the
classroom draws at random only from a whole bank); the validation says so. For a different draw
per student, the teacher keeps those questions in a bank of their own and picks a number from it
without a filter. A paper exam is printed from the quiz (`/miyagi:exam`), in versions.

## 4. From one course to the next

The banks stay in the subject's `materials/` when the course ends, and their publication record
says where each one went. Next year: review them with the teacher (what didn't work, what the
plan changed), update the criteria if the plan's numbering changed, and publish them again. To
reuse a bank in another subject, the teacher copies its `.questions.md` into that subject's
`materials/`; their criteria must then be that subject's.

Nothing about students goes in a bank: results by question are read in the classroom when the
teacher asks, never written down.
