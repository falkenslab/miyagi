---
title: 1. Preparing the classroom
sidebar_position: 2
description: Connecting miyagi to an empty Moodle course with miyagi init and letting it explore what that Moodle supports.
---

# 1. Preparing the classroom {#1-preparar-el-aula}

We start from an empty Moodle course, "Introducción a SQL" (Introduction to SQL), where we have the teacher role. It only has the General section and a new section with nothing in it.

<Shot kind="moodle" src="/img/casos/00-curso-vacio.webp" alt="The Introducción a SQL course in Moodle, seen by the teacher: only the General and New section sections, both empty.">The starting point: an empty course.</Shot>

## A folder for the subject {#una-carpeta-para-la-asignatura}

Each subject has its folder on your computer. That's where miyagi keeps the configuration, your documents and its notes. On its own, `miyagi init` creates it in miyagi's folder (`~/.miyagi/workspaces/`), and you then open it by name with `-w`. Here we'd rather keep it close at hand, so we open a terminal, create the folder and point to it with `--dir`:

<Terminal title="PowerShell" prompt="PS>">{`PS> mkdir cursos\\intro-sql
PS> cd cursos\\intro-sql
PS> miyagi init --dir .`}</Terminal>

Inside that folder, the other commands (`miyagi ingest`, `miyagi chat`) use that subject without having to name it.

## The questions `miyagi init` asks {#las-preguntas-de-miyagi-init}

It first asks about the subject and, at the end, about the Moodle classroom. These are the answers for the SQL classroom:

- **Subject name and description**: "Introducción a SQL", "Módulo de bases de datos de 1.º de DAM: SQL con MariaDB" (the databases module of the first year of DAM).
- **Tone**: friendly. It's how it will speak to the students in the forum and in feedback.
- **Language**: Spanish.
- **Create `instructions.md`?** Not for now. We'll see it in the [last step](habilidad-propia.md).
- **Connect a Moodle classroom now?** Yes (the default is no: without a classroom it still helps you with the teaching plan and the materials, and you can connect one later by running `miyagi init` again in its folder).
- **Moodle URL**: the course's full address, copied from the browser. That way it works out the course number by itself. It doesn't ask for a username or a password.

With that it installs the **moodle-teacher** extension, which is the one that works in Moodle with your teacher session, and notes your Moodle's address in it.

<Shot src="/img/casos/01-init.webp" title="PowerShell — miyagi init" alt="The terminal with miyagi init: name Introducción a SQL, description first year of DAM, friendly tone, Spanish, no instructions.md, classroom connected with the course URL, the subject created in miyagi's folder, moodle-teacher installed with the site, and the question of whether to explore now" />

## Exploring the Moodle {#explorar-el-moodle}

It then offers to explore the Moodle, and we say yes. As it's the first time, moodle-teacher opens a browser window for you to log in to Moodle yourself, with your username and password: neither miyagi nor the assistant sees them. The extension keeps the session, so next time it won't ask again until it expires.

Once inside, miyagi looks at which activity and question types this Moodle supports, without creating or changing anything. It notes them in its memory (the `course/moodle-capabilities` page) so it doesn't later propose something your school doesn't have.

:::note
The exploration only uses moodle-teacher's reading tools. These don't list every question type enabled in the Moodle, only the ones already in the course's banks; in an empty course, that part is left to check.
:::

## Practicals, in Docker labs {#las-prácticas-en-laboratorios-de-docker}

The course is about MariaDB in Docker and we want miyagi to check the practicals before publishing them. For that we install the **docker-lab** extension, with which miyagi checks each practical in a Docker lab, isolated and without touching anything else on the computer. It needs Docker Desktop installed:

<Terminal title="PowerShell" prompt="PS>">{`PS> miyagi extension add docker-lab --set mode=lab`}</Terminal>

It's explained in [Practicals in Docker](/avanzado/practicas-docker/).

Next step: [giving it your material](tu-material.md).
