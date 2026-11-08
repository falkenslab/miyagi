---
title: "5. Units 2 and 3: DDL and DML"
sidebar_position: 6
description: The units on defining and manipulating data, with rubric-graded deliverables, quizzes, and what to do when miyagi skips a step.
---

# 5. Units 2 and 3: DDL and DML {#5-temas-2-y-3-ddl-y-dml}

With the first unit built and reviewed, we ask for the next two in a single request:

<Prompt>{`/miyagi:build-unit Units 2 and 3, one after the other, following the teaching plan: Unit 2 (DDL: CREATE TABLE with keys and constraints, ALTER, DROP on the tienda database) and Unit 3 (DML: INSERT, UPDATE, DELETE and the typical errors). Each with its notes, graded exercises, quiz and practicals tested in Docker.`}</Prompt>

It follows the same method as in Unit 1: miyagi checks the practical in a docker-lab lab, running in MariaDB every `CREATE TABLE`, every foreign key and every `ALTER TABLE` with data already in it, and every error the notes are going to explain (for example, `ERROR 1452` when inserting an order for a customer who doesn't exist). It then writes the notes, the guided practical, the exercises with their rubric and the quiz.

## What it learned from Unit 1 {#lo-que-aprendió-del-tema-1}

The notes for Unit 2 came out with the code already in blocks and the table and column names in code format, the first time. That was the lesson we left in its skills when fixing Unit 1's guided practical.

<Shot kind="moodle" src="/img/casos/22-t2-libro.webp" alt="The first chapter of the Unit 2 notes seen by a student: what DDL is, the three statements CREATE TABLE, ALTER TABLE and DROP TABLE in code format, and the command to enter the container in a code block; on the right, the table of contents with the six chapters.">The Unit 2 notes: six chapters, from what DDL is to `DROP TABLE` and `SHOW CREATE TABLE`.</Shot>

<Shot kind="moodle" src="/img/casos/24-t3-libro.webp" alt="The first chapter of the Unit 3 notes: what DML is and how it differs from DDL, with INSERT, UPDATE and DELETE and the shop's tables in code format.">And those for Unit 3, on the same `tienda` database.</Shot>

## Deliverables with a rubric {#entregables-con-rúbrica}

Each unit has a deliverable: a `.sql` file that must run whole on a clean MariaDB. miyagi designs the rubric from the teaching plan's assessment criteria, and shows it to you before saving it:

<Shot src="/img/casos/26-aprobacion-rubrica-dml.webp" alt="Approval panel: publishing the rubric of the DML exercises out of 10 points, with four criteria: correct INSERT, UPDATE and DELETE with WHERE, explanation of the foreign key error on delete, and runnable and readable, each with its levels.">The rubric of the DML exercises, criterion by criterion and level by level, before it exists in Moodle.</Shot>

The student sees it next to the assignment's wording, so they know from the start how it'll be graded:

<Shot kind="moodle" src="/img/casos/23-t2-ejercicios-rubrica.webp" alt="The DDL exercises assignment seen by a student: the wording with its four steps (the four tables, a categories table, two ALTER TABLE), the dates, the submission status and the rubric with three criteria: tables and constraints (5 points), extending with ALTER TABLE (3), and runnable and readable (2).">The DDL exercises' wording and their rubric, from a student's account.</Shot>

And a quiz of ten questions per unit, imported in GIFT and in order:

<Shot kind="moodle" src="/img/casos/25-t3-quiz.webp" alt="The ten questions of the Unit 3 quiz in Moodle, from T3-01 to T3-10, one point each, about INSERT, UPDATE, DELETE and foreign key, NOT NULL and CHECK errors.">The Unit 3 quiz.</Shot>

## When it skips a step {#cuando-se-salta-un-paso}

In these two units, miyagi didn't quite follow its own method. In Unit 1 it uploaded each piece hidden, reviewed it and asked your permission to show it. Here it saved the notes, the practicals and the assignments directly visible. The publishing watchdog stopped each of those saves to ask, but without the detailed summary of a normal approval. In addition, the Unit 3 quiz was left visible before it was complete.

We spotted it when reviewing the course and told it just that:

<Prompt>{`Let's carry on. First of all: in Units 2 and 3 everything was left visible to the students without you asking my permission to show it, and the Unit 3 quiz is visible half done. Hide that quiz, finish adding its questions in order, review it and ask my permission to show it. And one more thing: Unit 1 calls the container mariadb-tienda and Unit 2 mi-mariadb; make them all mariadb-tienda.`}</Prompt>

It hid the quiz, finished it, checked the questions and asked permission, this time in full detail:

<Shot src="/img/casos/28-aprobacion-mostrar-quiz.webp" alt="Approval panel: showing the students the Unit 3 quiz, now complete, with 10 multiple-choice questions on INSERT, UPDATE and DELETE and the typical errors, 2 attempts, immediate feedback, opening on 29 October and closing on 1 November.">Showing the quiz, now with its summary.</Shot>

And it replied with what it had done, acknowledging the process failure and offering to hide the rest to review it piece by piece:

<Shot src="/img/casos/27-correccion-proceso.webp" alt="miyagi's reply: the Unit 3 quiz hidden, completed, reviewed and shown with permission; the container renamed mariadb-tienda in the Unit 2 notes; and the acknowledgement that the book, the page and the assignment of Units 2 and 3 were published without being hidden, reviewed and approved, with the offer to hide them for review.">miyagi explains what it has fixed and what it did wrong.</Shot>

:::tip Review as a student
No automatic review replaces yours. Open the course with the student view every now and then, and tell it in your own words if something doesn't convince you: it fixes it, and what you teach it stays in its course memory.
:::

Next step: [Unit 4 and the final project](tema-4-consultas.md).
