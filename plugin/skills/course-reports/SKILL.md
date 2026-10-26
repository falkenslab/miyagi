---
name: course-reports
description: Write reports about the course, never about a student - the class's results by criterion or learning outcome for the department, and the module's annual report (what was taught against the plan, results by criterion, what worked and what to change) - from the assessment matrix and the class-level grades, as a .docx with the school's template when a documents extension is installed, or as a page and a PDF in drafts/ otherwise. Use when the teacher asks for a report, a summary of results by criterion, the end-of-term or end-of-year report of the module, or data for a department meeting.
---

# Reports about the course

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

Reports are about the course and the class as a whole: how the criteria went, what was taught
against the plan, what to change. Never about one student: reports to families, tutoring notes
and a student's case at an evaluation meeting are the teacher's, not miyagi's.

## 1. Which report

- **Results by criterion** (for the department, an evaluation meeting): per criterion or learning
  outcome, how many students reached it, the class's mean and distribution, from the gradebook by
  criteria (`criterial-assessment`). Compare with the previous evaluation when there is one.
- **The module's annual report**: the plan against what happened (units taught, hours, dates
  moved), results by criterion and by evaluation, what worked (activities, methods) and what
  didn't, and proposals for next year. The teacher's own assessment comes from the teacher: ask,
  don't invent it.
- A **format the school gives** (a template in `sources/`, a model report): follow its sections and
  their order exactly; leave a section empty with a note rather than filling it with guesses.

## 2. The data, without keeping it

- The criteria and their instruments: `course/assessment-matrix` and `course/teaching-plan`.
- The grades: read in the classroom, through the classroom extension's gradebook skill, when the
  report is written; with no classroom, from a file the teacher puts in `sources/`.
- Work with aggregates only: counts, percentages, means and distributions per criterion. No
  student's name, mark or comment goes in the report, the knowledge base or `drafts/`. A group
  under five students: give no distribution (each one could be recognised), only whether the
  criterion was reached overall.
- Say where every figure comes from and on which date it was read; don't store the grades.

## 3. Writing it

- Short and in the department's language: a table per evaluation (criterion, % reached, mean),
  then a few lines of reading for each criterion that went badly, with a cause the evidence
  supports and a proposal.
- **With a documents extension** (one that writes `.docx` from a template, the capability documents-write), fill
  the school's template from `sources/` and save the document where it says.
- **Without one**, write the report as Markdown in `drafts/<slug>/` and print it to PDF with the
  drafts toolbox (`drafts_pdf`); tell the teacher that a `.docx` with the school's template needs a
  documents extension, which isn't installed.
- The teacher reviews it before it goes anywhere: a report isn't published to students, and
  sending it is the teacher's.
