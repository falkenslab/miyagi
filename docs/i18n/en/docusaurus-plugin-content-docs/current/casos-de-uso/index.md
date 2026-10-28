---
title: An Introduction to SQL classroom, from scratch
sidebar_label: The SQL classroom
sidebar_position: 1
description: A step-by-step tutorial, with real screenshots, in which miyagi sets up and runs an Introduction to SQL classroom with MariaDB in Docker.
slug: /casos-de-uso/
---

# An Introduction to SQL classroom, from scratch {#un-aula-de-introducción-a-sql-de-cero}

In this tutorial you'll see miyagi really at work, from start to finish, in a Moodle classroom that starts out empty. It's an **Introduction to SQL** unit for the first year of a vocational course in cross-platform application development (DAM): the students start their own **MariaDB server in a Docker container**, do just enough administration (a database and a user), create tables, insert data and run queries.

:::note The tutorial is in Spanish
The tutorial's pages and screenshots are in Spanish, because the course was built and photographed in Spanish. The English site links to them as they are.
:::

All the screenshots are real. They were taken against a test Moodle ([moodle-sandbox](https://github.com/falkenslab/moodle-sandbox)), with test students who submit work and ask questions in the forum, and with miyagi exactly as you would install it. What the teacher writes in the chat looks like this:

<Prompt>{`Grade the final project with the rubric I left you.`}</Prompt>

## What you'll see {#lo-que-vas-a-ver}

1. [Preparing the classroom](/casos-de-uso/preparar-el-aula/): `miyagi init` and exploring the Moodle.
2. [Giving it your material](/casos-de-uso/tu-material/): the syllabus and the rubric, with `miyagi ingest`.
3. [The teaching plan](/casos-de-uso/programacion/): completing it and having it reviewed by a teaching expert.
4. [Unit 1: MariaDB in Docker](/casos-de-uso/tema-1-mariadb-docker/): the first unit, with its practical tested in Docker before publishing it.
5. [Units 2 and 3: DDL and DML](/casos-de-uso/temas-ddl-dml/): creating tables and manipulating data.
6. [Unit 4 and final project](/casos-de-uso/tema-4-consultas/): queries, a quiz and the assignment with a rubric.
7. [Grading with the rubric](/casos-de-uso/corregir/): the students' submissions, grade by grade.
8. [Looking after the forum](/casos-de-uso/foro/): real questions about SQL.
9. [Follow-up and audit](/casos-de-uso/seguimiento/): how the class is doing and what to improve in the course.
10. [Your own skill](/casos-de-uso/habilidad-propia/): teaching it your class's SQL conventions.

## What you need to follow it {#qué-necesitas-para-seguirlo}

- miyagi installed ([Install](/guia/instalar/)).
- A Moodle course where you're a teacher. To practice, a test one is better.
- For Unit 1 and testing the practicals, [Docker Desktop](https://www.docker.com/products/docker-desktop/). It's optional: without Docker, miyagi builds the course just the same, but it can't run the practicals to check them.

:::tip Nothing is published without your permission
Throughout the tutorial, every grade, every forum reply and every resource the students see first goes through an approval panel. You'll see it in the screenshots.
:::
