---
title: 7. Grading with the rubric
sidebar_position: 8
description: miyagi grades the final project by running each submission in Docker and applying the teacher's rubric, and shows each grade before saving it.
---

# 7. Grading with the rubric {#7-corregir-con-la-rúbrica}

Three test students have submitted the final project, each at a different level:

- **Lucía**: all eight queries, well written.
- **Marcos**: only five, in lower case and with one join done with commas in the `FROM`.
- **Sara**: all eight, but with conceptual mistakes: an aggregate in the `WHERE`, an `INNER JOIN` where a `LEFT JOIN` was needed and a count without `GROUP BY`.
- **Alumno Demo** hasn't submitted, and the deadline has passed.

In a new chat, with the grading shortcut:

<Prompt>{`/miyagi:grade Grade the final project "Queries on the shop" with the rubric I left you in sources. Run the submissions in Docker against the shop's data to check the results.`}</Prompt>

## Run before judging {#ejecutar-antes-de-juzgar}

Instead of reading the SQL and assuming what it returns, miyagi checks each submission in a docker-lab lab: it loads the shop's common data into a clean MariaDB, runs each `consultas.sql` (in a folder with an identifier, never with the student's name) and compares each result with its reference solution. That way, neither a query that looks right but returns other rows nor one that fails gets through.

## Each grade, before saving it {#cada-nota-antes-de-guardarla}

With the results, it applies the rubric and shows you all the grades in a single approval: each student's breakdown by criterion, the summary of their feedback and how it interpreted your rubric where it wasn't explicit.

<Shot src="/img/casos/36-aprobacion-notas.webp" alt="Approval panel: grading the final project with the Moodle rubric; all submissions on time, run in Docker and compared with the solution; the interpretation of the rubric (a single mistake is worth half, two or more are worth 0); Lucía 9.375 with the mistakes in queries 5 and 8; Marcos 3.875 with three queries not submitted; Sara 4.875.">The class's grades, with their breakdown, before they exist in Moodle.</Shot>

The grades match what each submission is worth:

- **Lucía, 9.375.** It found two real details: query 5 returns the product's name instead of the id the wording asked for, and query 8 lacks the tie-break by name.
- **Marcos, 3.875.** Three queries are missing; the ones submitted have ordering and style mistakes, and the join with commas costs points in "appropriate use of SQL".
- **Sara, 4.875.** Query 5 fails (an aggregate in the `WHERE`), query 8 loses the products without orders by using `INNER JOIN`, and query 4 doesn't group.
- **Alumno Demo, 0**, with the comment that no submission was received, because the deadline has passed. Before that date it wouldn't have given a 0.

When it finishes, it warns you of what you should know: it hasn't notified the students (it left that unticked), which two interpretations of the rubric you should confirm, and that the assignment's dates in Moodle don't match those in its teaching plan. That last one was true: for the tutorial we had moved the deadline forward.

<Shot src="/img/casos/37-correccion-resumen.webp" alt="The grading summary: it hasn't notified the students, two interpretations of the rubric to review (half for a single mistake, and that a missing query doesn't take points off use of SQL), what fails most in the class (HAVING, LEFT JOIN and the requested order) and the warning that the assignment's dates don't match its notes.">What you should review, and what fails most in the class.</Shot>

## What the student sees {#lo-que-ve-el-alumno}

Each student sees their grade, the rubric with the levels marked, and feedback saying what fails in each query and how to fix it, with the corrected query:

<Shot kind="moodle" src="/img/casos/38-retro-sara.webp" alt="Sara's grade in Moodle: 4.88 out of 10 and a comment going through each failing query (reversed order in 1, missing GROUP BY in 4, the Invalid use of group function error in 5 with its explanation, missing filter on cancelled orders in 7, INNER JOIN instead of LEFT JOIN in 8), query 5 corrected and the rubric's breakdown with the levels marked.">Sara's feedback: each mistake, why, and query 5 corrected.</Shot>

And the teacher, the assignment's grading table:

<Shot kind="moodle" src="/img/casos/39-calificaciones.webp" alt="The final project's table of submissions and grades in Moodle, seen by the teacher, with the four students' grades.">The grades, now saved.</Shot>

:::info Your criteria rule
The rubric was the one in your `sources/` folder, and where it said nothing (what happens with two mistakes in a query) miyagi interpreted it and told you. If you don't agree, tell it: it regrades with your criterion and notes it in its memory for next time.
:::

Next step: [looking after the forum](foro.md).
