---
title: 2. Giving it your material
sidebar_position: 3
description: Leaving the syllabus and the rubric in sources/ and turning them into the course's memory with miyagi ingest.
---

# 2. Giving it your material {#2-darle-tu-material}

The more miyagi knows about your course, the better it works. What you've already written (the syllabus, rubrics, solutions, your criteria) goes in the course's `sources/` folder. It only reads it: it never changes your originals.

For the SQL classroom we leave two documents:

- **`temario-introduccion-sql.md`**: 6 weeks, 4 units (MariaDB in Docker, DDL, DML and queries), the objectives, the working database (`tienda`, a shop) and the assessment: quizzes 20%, exercises 30%, final project 50%, and 20% off for late submissions.
- **`rubrica-practica-consultas.md`**: the final project's rubric, out of 10: correct results (5), appropriate use of SQL (3) and readability (2), with what to do if there's no submission.

They can be PDF, Word, PowerPoint, Excel, Markdown or even photos of handwritten notes. Then:

<Terminal title="PowerShell" prompt="PS>">{`PS> miyagi ingest`}</Terminal>

`ingest` doesn't open Moodle: it reads each document and turns it into pages of its course memory, linked to each other.

<Shot src="/img/casos/03-ingest.webp" title="PowerShell — miyagi ingest" alt="The miyagi ingest summary: two sources read, nine pages created (summaries, the teaching plan, a page per unit, the final project's page and the overview) and a warning: the 20% late penalty can't be set up in this Moodle's assignment and will have to be applied by hand.">The ingest summary. It compares your syllabus with what it saw when exploring and warns of a contradiction: the late penalty doesn't exist in this Moodle's assignment.</Shot>

That warning is a good example of what the memory is for: it doesn't just copy your documents, it relates them to what it knows about the course.

## The course's memory {#la-memoria-del-curso}

Everything stays in the `knowledge/` folder, in text files you can open with any editor:

<Shot src="/img/casos/04-knowledge.webp" title="PowerShell — knowledge/" alt="The listing of the knowledge folder: index.md, log.md, moodle-capabilities.md, overview.md, teaching-plan.md, an activity page for the final project, two source summaries and a page for each of the four units.">The memory after the ingest: an index, a change log, the teaching plan, a page per unit and the final project's page.</Shot>

If you want to know what each file holds and how the ingest works inside, it's in [The knowledge base](/avanzado/base-de-conocimiento/).

Next step: [the teaching plan](programacion.md).
