---
title: 10. Your own skill
sidebar_position: 11
description: Teaching miyagi your class's SQL conventions with a skill of your own, and seeing it applied without asking.
---

# 10. Your own skill {#10-tu-propia-habilidad}

miyagi comes with its skills built in, but each subject has its quirks. In this course we want all the SQL the students see to follow the same conventions: reserved words in upper case, one clause per line, aliases with `AS`, always an explicit `JOIN`, `INSERT` always with the column list… Students learn by imitating.

For that there's no need to program: a text file with a **skill of your own** is enough.

## Writing it {#escribirla}

In the course's folder, `.claude/skills/estilo-sql/SKILL.md`:

```markdown
---
name: estilo-sql
description: This course's SQL style conventions (MariaDB) - use it whenever you write or review SQL the students will see (notes, assignment wordings, solutions, quiz questions, forum replies) and when grading submissions with SQL.
---

# The course's SQL style

All the SQL you publish in this course follows these conventions, without exception.

## Conventions

1. Reserved words in UPPER CASE.
2. Table and column names in snake_case and lower case: clientes, fecha_alta, id_cliente.
3. One clause per line, and the columns of a long SELECT one per line with four spaces.
4. INSERT always with the explicit column list.
...
```

The `description` line is the one that decides **when** it's used: it says what it does and in which situations. The complete file, with the reference example and what to do when grading, is in [Your own skills](/avanzado/habilidades-propias/).

## Checking that it sees it {#comprobar-que-la-ve}

<Terminal title="PowerShell" prompt="PS>">{`PS> miyagi skills`}</Terminal>

It appears at the end of the list, marked as your own (`[propia]` in this Spanish session):

<Shot src="/img/casos/49-skills-propia.webp" title="PowerShell — miyagi skills" alt="The output of miyagi skills: the built-in skills with their descriptions and, at the end, estilo-sql marked as the teacher's own, with its description.">miyagi's skills, and ours at the end.</Shot>

## Seeing it in action {#verla-en-acción}

There's no need to name it. We ask for something where it's going to write SQL for the students:

<Prompt>{`For Tuesday's class, write in drafts three examples of JOIN on the shop, from easier to harder, with their explanation, to project in class. Don't publish anything.`}</Prompt>

Before writing a line, it loads it on its own:

<Shot src="/img/casos/50-skill-carga.webp" alt="The chat: after reading the Unit 4 page, it applies the estilo-sql skill; it then reads the shop's data, the JOIN chapters of the notes and the final project's solution so as not to repeat them, writes ejemplos-join.sql and announces it will check it in Docker.">Applying the estilo-sql skill, without us asking.</Shot>

It reads the notes and the final project's solution so as not to repeat their examples, writes the queries following the conventions, runs them in Docker on the shop's data and prepares a page to project, with the real results:

<Shot src="/img/casos/52-ejemplos-join.webp" title="ejemplos-join.html" alt="The page to project: three examples of JOIN on the shop; the first, what order 6 contains, with the source tables, the query written in upper case with one clause per line and aliases with AS, the real result and what to look at.">What it prepared in `drafts/` for the class: queries in our style and real results.</Shot>

<Shot src="/img/casos/51-skill-resumen.webp" alt="The summary: the three examples from easier to harder (INNER JOIN of two tables, a LEFT JOIN's filter in the ON or in the WHERE, three tables with COUNT DISTINCT), all run in Docker without errors, following the course's SQL style, and the question of whether the class is the one on Tuesday 10 November, which is when JOIN comes up in the calendar.">And a sensible question: according to the calendar, JOIN comes up on Tuesday 10 November, not this Tuesday.</Shot>

:::tip What a skill can and can't do
A skill teaches it **how** to do something with what it already has. It doesn't give it new tools or get past approvals. What applies to the whole course, in every task ("grade out of 10"), goes better in `instructions.md`: it's explained in [Shortcuts and instructions](/avanzado/atajos-e-instrucciones/).
:::

## That's all {#y-hasta-aquí}

From an empty course to a complete Introduction to SQL classroom: teaching plan, four units with notes, practicals tested in Docker, deliverables with rubrics, quizzes, a graded final project, a forum looked after, a follow-up, an audit and a course guide. Everything the students saw first went through an approval panel.

To do it in your course, start with [Install](/guia/instalar/) and [Getting started](/guia/primeros-pasos/).
