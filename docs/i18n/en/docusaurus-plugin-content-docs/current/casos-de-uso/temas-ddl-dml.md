---
title: "5. Units 2 and 3: DDL and DML"
sidebar_position: 6
description: The units on defining and manipulating data, with rubric-graded exercises, quizzes, and what was left pending.
---

# 5. Units 2 and 3: DDL and DML {#5-temas-2-y-3-ddl-y-dml}

With the first unit in place, we ask it for the next two in a single request:

<Prompt>{`/miyagi:build-unit Units 2 and 3, one after the other, following the teaching plan: Unit 2 (DDL: CREATE TABLE with keys and constraints, ALTER, DROP on the tienda database) and Unit 3 (DML: INSERT, UPDATE, DELETE and the typical errors). Each with its notes, an exercise to submit with a rubric, a quiz and the practicals tested in Docker. The container is always called mariadb-tienda. The dates in the teaching plan work for me. Publish it hidden and ask my permission to show it.`}</Prompt>

It follows the same method as in Unit 1: it tests in a lab every `CREATE TABLE`, every foreign key and every error the notes are going to explain (for example, `ERROR 1452` when inserting an order for a customer who doesn't exist). Then it writes the notes, the guided practical, the exercise with its rubric and the quiz, and uploads each piece hidden, with its permission.

<Shot width="1400" height="1141" kind="moodle" src="/img/v2/moodle-alumno-libro-t2.webp" alt="The Unit 2 notes seen by a student, with the DDL statements in code blocks.">The Unit 2 notes.</Shot>

<Shot width="1400" height="1045" kind="moodle" src="/img/v2/moodle-alumno-libro-t3.webp" alt="The Unit 3 notes seen by a student, on INSERT, UPDATE and DELETE.">And those of Unit 3, on the same `tienda` database.</Shot>

## Exercises with a rubric {#ejercicios-con-rúbrica}

Each unit has an exercise. miyagi designs the rubric from the teaching plan's assessment criteria, and shows it to you before saving it, criterion by criterion and level by level:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-05-aprobacion-rubrica.webp" alt="Approval panel with the rubric for the Unit 3 exercise: four criteria, each with its levels and its score.">The rubric for the Unit 3 exercise, before it exists in Moodle. This screenshot is of an example request that we then rejected.</Shot>

The student sees it next to the instructions, so they know from the start how they're going to be graded:

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumno-ejercicio-ddl.webp" alt="The Unit 2 exercise seen by a student: instructions, submission status and the rubric.">The DDL exercise with its rubric, from a student's account.</Shot>

<Shot width="1400" height="1527" kind="moodle" src="/img/v2/moodle-profesor-preguntas-t3.webp" alt="The Unit 3 quiz's questions in Moodle, seen by the teacher.">The Unit 3 quiz's questions.</Shot>

## What was left pending {#lo-que-quedó-pendiente}

When it finishes, it separates the tests it did, the decisions it took on its own and what's waiting on you:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-05-temas-2-3.webp" alt="The summary of Units 2 and 3: the tests in Docker, miyagi's decisions, and what's left pending: questions for the Unit 2 quiz, labs still running and Shrove Tuesday.">Summary of Units 2 and 3, with what's left pending.</Shot>

We'd highlight two things:

- **The Unit 2 quiz was left incomplete.** miyagi said that "Moodle rejects new imports into that bank", but the real cause was that the Moodle browser was closing. It was completed in the next step.
- **It can't see it as a student.** miyagi doesn't have a student view: it asks you to check it yourself. And Moodle doesn't allow restricting the submission to `.sql`, so the instructions ask for the file name.

:::tip Review it as a student
No automatic review replaces yours. Open the course with **Switch role to Student** from time to time and tell it in your own words if something doesn't convince you: it fixes it, and what you teach it stays in its memory of the course.
:::

Next step: [Unit 4 and the final project](tema-4-consultas.md).
