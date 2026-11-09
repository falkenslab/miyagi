---
title: An Introduction to SQL classroom, from scratch
sidebar_label: The SQL classroom
sidebar_position: 1
description: A step-by-step tutorial, in the desktop app and with real screenshots, in which miyagi sets up and runs an Introduction to SQL classroom with MariaDB in Docker.
slug: /casos-de-uso/
---

# An Introduction to SQL classroom, from scratch {#un-aula-de-introducción-a-sql-de-cero}

In this tutorial you'll see miyagi really at work, from start to finish, in a Moodle classroom that starts out empty. It's an **Introduction to SQL** unit for the first year of DAM (a vocational course in cross-platform application development): 6 weeks, 4 units (MariaDB in Docker, DDL, DML and queries) and a **final project with 10 queries** on the `tienda` database. The gradebook's weights: 5% each quiz, 15% each exercise and 50% the final project.

It's done in the **desktop app**, which is the main version. What the teacher writes looks like this:

<Prompt>{`Grade the Práctica final "Consultas sobre la tienda" with the rubric I left you in sources.`}</Prompt>

:::note What you should know before reading
All the screenshots are real, from version 0.13.0, taken against a test Moodle ([moodle-sandbox](https://github.com/falkenslab/moodle-sandbox)) with fictional students. The screenshots are in Spanish: the course's content and miyagi's messages are in Spanish, and the Moodle interface is in English, because the sandbox doesn't have the Spanish language pack, so in the screenshots you'll see "Course", "Grades" or "Submissions" next to what miyagi writes in Spanish.

Some approval panels were photographed with an example request and then rejected; we say so on each one. The tutorial doesn't hide what failed: you'll see where the browser dropped and what was left half-way.
:::

## The steps {#los-pasos}

1. [Prepare the classroom](preparar-el-aula.md): create the subject and link the course.
2. [Give it your material](tu-material.md): the syllabus and the rubric in Sources.
3. [The teaching plan](programacion.md): complete it and decide what only you decide.
4. [Unit 1: MariaDB in Docker](tema-1-mariadb-docker.md): the first unit, tested in a lab before publishing it.
5. [Units 2 and 3: DDL and DML](temas-ddl-dml.md): creating tables and manipulating data.
6. [Unit 4 and the final project](tema-4-consultas.md): queries, a quiz, the assignment with its rubric and showing it all.
7. [Grading with the rubric](corregir.md): the students' submissions, grade by grade, with what data protection implies.
8. [Looking after the forum](foro.md): real questions about SQL.
9. [Follow-up and audit](seguimiento.md): how the class is doing and what to improve in the course.
10. [Your own skill](habilidad-propia.md): teaching it your class's SQL conventions.

Using another version? See the same thing in the [web version](en-web.md) or in the [terminal](en-terminal.md).

## What you need to follow it {#qué-necesitas-para-seguirlo}

- The [desktop app](/guia/escritorio/) installed, or another [version](/guia/elegir-version/).
- A Moodle course in which you're a teacher. To practise, a test one is better.
- For Unit 1 and testing the practicals, [Docker Desktop](https://www.docker.com/products/docker-desktop/) and the docker-lab extension. They're optional: without Docker, miyagi still builds the course, but it can't run the practicals to check them.

:::tip Nothing is published without your permission
Throughout the tutorial, every grade, every forum reply and every resource the students see first goes through an approval panel. You'll see it in the screenshots.
:::
