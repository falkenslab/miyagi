---
title: 6. Unit 4 and final project
sidebar_position: 7
description: The unit on queries with SELECT, a quiz, the final project with the teacher's rubric, the Q&A forum and the gradebook's weights.
---

# 6. Unit 4 and final project {#6-tema-4-y-práctica-final}

The last unit is the one that weighs most: queries with `SELECT` and the final project, worth 50% of the grade. We ask for it all at once, hidden until reviewed:

<Prompt>{`/miyagi:build-unit Unit 4: Querying with SELECT, following the teaching plan (filters, ordering, aggregates with GROUP BY and HAVING, INNER and LEFT JOIN), with week 5's formative exercise, the quiz and the final project "Queries on the shop": an assignment with a single file consultas.sql and the rubric I left you in sources, with a script of the shop's data so that everyone queries the same thing. Test it all in Docker. And create a "Foro de dudas" (Q&A forum) in the General section for the whole course. All hidden until you've reviewed it and asked my permission to show it.`}</Prompt>

## Hidden, tested and with permission {#oculto-probado-y-con-permiso}

This time each piece is created hidden, with its approval, starting with the section itself:

<Shot src="/img/casos/29-t4-seccion-oculta.webp" alt="Approval panel: creating the Unit 4 section hidden, to test it, with its name and its summary of weeks 5 and 6.">First the section, hidden.</Shot>

Before writing anything, miyagi checks the practical in a docker-lab lab: it loads some common shop data into MariaDB (8 customers, 10 products, 12 orders and 21 order lines) and runs every query of the notes, the formative exercise and the final project. That data script is published too, so the whole class queries the same thing and can compare results.

The final project uses your rubric from `sources/`. miyagi translates it into a Moodle rubric (one line per query, worth 0.625 points, and the criteria for use of SQL and readability) and tells you what it wrote itself:

<Shot src="/img/casos/30-t4-rubrica.webp" alt="Approval panel: saving the final project's rubric, based on the teacher's: eight result criteria of 0, 0.3125 or 0.625 points, appropriate use of SQL from 0 to 3 and readability from 0 to 2, with the note that it wrote the intermediate levels of the last two itself.">The teacher's rubric, turned into a Moodle rubric.</Shot>

The pedagogical reviewer came through here too: it changed query 8 of the project, which was almost the same as an example in the notes, and query 5, which could be solved without `HAVING`.

When everything is built and checked, it asks permission just once to show it, listing each piece and its dates:

<Shot src="/img/casos/31-t4-mostrar-todo.webp" alt="Approval panel: showing the students the Unit 4 section with its six items (common data, notes, guided practical, formative exercise, quiz and final project with its rubric) and the Q&amp;A forum of the General section, reminding that the opening dates still apply.">One approval listing everything the class is going to see.</Shot>

## What you decide {#lo-que-decides-tú}

When it finishes, it separates what changed from the pedagogical review, the decisions it made on its own and what's left for you:

<Shot src="/img/casos/32-t4-resumen.webp" alt="The Unit 4 summary: changes from the pedagogical review, its own decisions to review (how it built the rubric, a commitment in the teacher's name in the formative exercise's wording, the quiz's opening time) and two pending items: the gradebook's weights and whether to give the expected number of rows.">Its own decisions worth reviewing, and two questions.</Shot>

Notice the second point: the formative exercise's wording says you'll go over the most common mistakes in class. That's a commitment in your name, and it warns you. We answer the two pending items:

<Prompt>{`Yes, adjust the gradebook's weights: 20% the four quizzes, 15% each block of exercises (Unit 2 and Unit 3) and 50% the final project; the formative exercise and the Unit 1 deliverable don't count. Don't give the expected number of rows: let them check it themselves.`}</Prompt>

<Shot src="/img/casos/33-pesos.webp" alt="The gradebook's final table of weights: quizzes, DDL exercises 15%, DML exercises 15%, final project 50% and the pass/fail deliverable 0%; the formative exercise isn't listed because it has no grade.">The gradebook's weights, as the teaching plan says.</Shot>

## The course, finished {#el-curso-terminado}

This is how a student sees the whole course: the Q&A forum in the General section and the four units with their notes, practicals, deliverables and quizzes.

<Shot kind="moodle" src="/img/casos/35-curso-completo-alumno.webp" alt="The whole course seen by a student: the Q&amp;A forum with its description in General and Units 1 to 4, each with its summary, the order to follow and its activities with dates; Unit 4 with the common data, notes, guided practical, formative exercise, quiz and final project.">Introducción a SQL, from start to finish.</Shot>

And the final project, with its wording, how it's graded and the rubric in view:

<Shot kind="moodle" src="/img/casos/34-practica-final-alumno.webp" alt="The final project seen by a student who has already submitted: the wording with the 8 queries, how it's graded, the deadline, the submission status with their consultas.sql file and the rubric with its ten criteria.">The final project, from the account of a student who has already submitted.</Shot>

:::note For the tutorial we moved the calendar forward
The final project opened on 5 November. To be able to go on with the grading, we moved its dates in the test Moodle: three test students submitted on time and we then let the deadline pass.
:::

Next step: [grading with the rubric](corregir.md).
