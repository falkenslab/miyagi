---
title: What to ask it
sidebar_position: 5
description: "Ideas for using it, from the simplest to the most ambitious, and an example of how miyagi fits into a week of class."
---

# What to ask it {#qué-pedirle}

Each idea has the situation, what **you write** in the chat and what it **does**. Start with level 1: it doesn't publish anything and lets you see how it works. The examples come from a Databases course, but they work for any subject.

## Level 1 · Asking without touching anything {#nivel-1--preguntar-sin-tocar-nada}

Everything at this level is read-only: ideal for building confidence.

**Catching up after a few days away**

> What has happened in the course since Monday? New submissions, forum messages and what's due this week.

It goes through the course and gives you a summary. It doesn't change anything.

**Finding out what you have pending**

> Which submissions do I have left to grade, from which assignments and since when?

**Finding something in a large course**

> Where is the unit 4 quiz and what are its settings (attempts, time, when the grade is shown)?

**Looking up its notes, without opening Moodle**

> /knowledge:query What criterion did we agree on for late submissions?

It answers from its notes, with links to the pages it got the answer from.

**Seeing what your Moodle supports**

> Can I run a peer-assessment workshop here? And drag-and-drop questions?

It checks what it noted down when exploring your Moodle.

## Level 2 · The teacher's day-to-day {#nivel-2--el-día-a-día-del-profesor}

Here it starts acting, and it shows you every publication beforehand.

**Grading an assignment with your rubric**

> Grade the submissions for Assignment 2 with the rubric I left you in sources.

It reads each submission, applies the rubric the same way to everyone and shows you the grade and the feedback before saving it. If you're not happy with one, say `n` and explain why.

**Grading when there's no rubric**

> Grade Assignment 3. I don't have a rubric: propose one before you start.

It proposes criteria, waits for your go-ahead, saves them in its notes and applies them. The next time you grade that assignment it will remember them.

**Looking after the forum**

> /miyagi:forum

It reviews the recent threads and decides whether it needs to step in: answer an unanswered question, encourage participation or let the students carry on among themselves. Each reply, with your approval. It notes the questions that keep coming up, in the unit they belong to.

**Sending an announcement to the class**

> Post an announcement in Announcements: the Assignment 3 deadline is extended until Friday at 23:59. Warm tone.

**Seeing who's falling behind**

> /miyagi:progress

It looks at the progress report and the grades, separates those who are doing well from those who are falling behind and proposes what to do. It notes the class's trend (never personal records), so next time it will tell you whether it has improved.

**Adjusting an activity**

> Extend the unit 2 quiz deadline by a week and allow two attempts instead of one.

## Level 3 · Creating content {#nivel-3--crear-contenido}

It prepares everything new on your computer, uploads it hidden, tests it in Moodle and only shows it to the students when you say yes.

**A quiz**

> /miyagi:quiz unit 3, SQL queries with JOIN, 12 questions, for review (not graded)

It writes the questions (believable distractors, varied levels, feedback for each option), shows them all to you and imports them in one go.

**Notes for a unit**

> Create some notes on normalization (1NF, 2NF, 3NF) for unit 2, with examples of tables from an online shop.

It writes them, reviews them as a student would see them (writing and accessibility) and asks your permission before publishing them.

**An assignment with its rubric**

> Create an assignment for unit 3: design the entity-relationship model of a library. With a 4-criterion rubric, PDF submission, two-week deadline.

**A glossary, a Q&A forum or a poll**

> Add to unit 1 a collaborative glossary where the students define the key terms, and a quick poll to find out which database management systems they know.

**Reusing what you already have**

> In sources you have my notes for unit 5 from last year as a PDF. Turn them into an updated Moodle page and add three exercises at the end.

**A game that counts towards the grade**

> Package the game at this address as SCORM and upload it to Unit 2 so it counts towards the grade.

It downloads the web activity, packages it so Moodle records the grade and whether it was completed, and uploads it hidden so you can test it before showing it.

## Level 4 · Designing and reviewing the course {#nivel-4--diseñar-y-revisar-el-curso}

**Auditing the course**

> /miyagi:audit

It reviews organization, accessibility, pedagogical coherence, assessment, dates and outdated resources, and gives you recommendations ordered by priority. It keeps each audit with its date, so the next one will tell you what has improved.

**Writing the teaching plan**

> /miyagi:teaching-plan I have the department's draft in sources. 6 hours a week, from September to June.

It writes it from your material, asks you what only you can decide (weights, calendar) and has the pedagogical reviewer check it. It stays in its notes; it isn't published in Moodle unless you ask it to.

**Checking that the classroom follows the teaching plan**

> /miyagi:align

It looks for criteria that no activity assesses, missing rubrics, weights or dates that don't add up and units not yet built. It proposes each change to you and makes it with your approval.

**Asking for a second pedagogical opinion**

> What do you think of Assignment 4? Ask the pedagogical reviewer to look at it: workload, whether it assesses what the teaching plan says, whether it's accessible.

**Changing methodology**

> I want unit 5 to be challenge-based learning. Propose how to reorganize it with what's already there.

**Researching before teaching**

> /miyagi:research what's new in PostgreSQL 17 that's worth covering in class

It hands it to its research assistant, cross-checks sources (official ones first) and saves what it found with its links.

## Level 5 · Building whole units and courses {#nivel-5--construir-temas-y-cursos-enteros}

**A new unit, fitted into what's already there**

> /miyagi:build-unit Unit 7: NoSQL databases with MongoDB, 3 weeks, with a pair project at the end

It reads the course and its teaching plan, plans the unit, has it reviewed, builds it (notes, activities, quiz, rubrics), looks at it as a student would and tells you what you should review.

**A complete course from scratch** (on an empty course)

> /miyagi:build-course Introduction to HTML5 and CSS3 for first-year web development, 5 units, with a final project of a personal web page

It plans first in its notes, then builds section by section with real content and finishes with a review of the whole course. It's the longest task: leave it running and approve as you go.

**Practicals that really work** (computing, with Docker)

> Create a Docker Compose practical with a website and a database, and test it before publishing it.

With the docker-lab extension installed, it follows it step by step in a Docker lab as a student would and fixes whatever fails before publishing it. When grading, it can run the submissions. How to install it: [Docker practicals](../avanzado/practicas-docker.md).

## Level 6 · Adapting it to the way you work {#nivel-6--adaptarlo-a-tu-forma-de-trabajar}

- **Standing instructions for the course.** Write in `instructions.md` what it should always keep in mind: “grade out of 10 with one decimal”, “in the forum, short replies”.
- **Your own shortcuts.** A text file with an instruction you use often, to launch it with `/name`.
- **Your own skills.** Teach it to always do something in a particular way, for example how to grade your practicals.

All of that is explained, with examples, in [Shortcuts and instructions](../avanzado/atajos-e-instrucciones.md) and [Your own skills](../avanzado/habilidades-propias.md).

## A week with miyagi {#una-semana-con-miyagi}

An example of how it fits into the routine, always with `miyagi chat`:

| Day | You ask it | Your part |
| --- | --- | --- |
| Monday | *“What happened this weekend and what's due this week?”* and `/miyagi:forum` | Read the summary and approve the forum replies |
| Tuesday | `/miyagi:quiz` for the unit that's starting, for review | Review the questions |
| Wednesday | *“Grade Assignment 3 with its rubric”* | Approve the grades and adjust one or two |
| Thursday | `/miyagi:progress` and *“write an announcement encouraging those who are behind, without singling anyone out”* | Approve the announcement |
| Friday | *“Prepare next week's unit: notes and a practical”* | Review and approve |
| Every month | `/miyagi:audit` and `/miyagi:align` | Decide which improvements to apply |
