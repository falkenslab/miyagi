---
title: 3. The teaching plan
sidebar_position: 4
description: Completing the teaching plan in the chat, with a pedagogical review and the decisions only the teacher makes.
---

# 3. The teaching plan {#3-la-programación-didáctica}

The ingest turned the syllabus into the course's teaching plan (`knowledge/teaching-plan.md`), but the syllabus was missing things: assessment criteria, a calendar and support for diverse learners. We open the chat:

<Terminal title="PowerShell" prompt="PS>">{`PS> miyagi chat`}</Terminal>

When it starts, it reads its memory and sums up what it knows about the course, including the contradiction about the late penalty it found in the previous step.

<Shot src="/img/casos/05-chat-apertura.webp" alt="miyagi's chat in full screen: the header with the logo, the Introducción a SQL course and a greeting summing up what it knows: a teaching plan with 5 objectives and 4 units, a final project worth 50%, a course still empty in Moodle and the contradiction about the late penalty.">The chat when it starts. At the bottom, the mode (guided) and how much context it has used.</Shot>

## Asking for it {#pedírselo}

We use the teaching plan shortcut, `/miyagi:teaching-plan`, and tell it what we want in our own words:

<Prompt>{`/miyagi:teaching-plan Review the teaching plan you drew from my syllabus and complete what's missing: assessment criteria, a calendar for the 6 weeks (we start on Monday 5 October) and support for diverse learners. I apply the late penalty by hand when grading.`}</Prompt>

It writes what's missing and, before calling it done, sends it to a helper: the **pedagogical reviewer**, an expert in instructional design who reads the whole plan and returns a report. It can't change anything itself.

<Shot src="/img/casos/06-revisor.webp" alt="The chat while it delegates to pedagogy-reviewer: the helper reads the teaching plan, the four unit pages and the final project's page; miyagi then edits the plan with what it pointed out.">The pedagogical reviewer reading the plan and the units. miyagi then applies its suggestions.</Shot>

## What only you decide {#lo-que-solo-decides-tú}

When it finishes, it sums up what it did and asks what isn't its call: which days there are classes (12 October is a public holiday), whether the split of weeks works, and how to assess an objective that had been left without an assessment tool.

<Shot src="/img/casos/07-programacion.webp" alt="miyagi's reply: criteria CE1.1 to CE5.3, a 6-week calendar from 5 October, support for diverse learners, and three questions for the teacher: class days, the split of weeks and how to assess objective 1's criteria.">What it has added, marked as a proposal, and three questions for the teacher.</Shot>

We answer in the same chat:

<Prompt>{`Sessions are on Tuesdays and Thursdays, 1.5 hours each. The split of weeks works for me. For O1, add a light deliverable to Unit 1: a screenshot of their container running with the tienda database created.`}</Prompt>

It takes that in and asks again the only thing it can't know: how much that new deliverable weighs.

<Shot src="/img/casos/08-programacion-pregunta.webp" alt="miyagi confirms the Tuesday and Thursday sessions and the Unit 1 deliverable, and asks whether it should be pass/fail or take weight from other deliverables; it also warns of two criteria still without a deliverable of their own.">A concrete question, with the two reasonable options.</Shot>

<Prompt>{`Make it pass/fail, outside the 100%. We'll cover CE1.3 and permissions in the Unit 1 quiz.`}</Prompt>

With that the plan is closed. This is how the assessment criteria end up, for example, in `knowledge/teaching-plan.md`:

```markdown
- **CE1.1** (O1). Starts a MariaDB 11 container with `docker run`, using a persistent volume and publishing the port correctly.
- **CE1.2** (O1). Connects to the server from the command-line client inside the container.
- **CE1.3** (O1). Stops, starts and removes the container without losing the data, relying on the volume.
- **CE2.1** (O2). Creates a database and a user with a password, and grants permissions only on that database (not on all of them).
...
- **CE5.3** (O5). Combines two or more tables with `INNER JOIN` and `LEFT JOIN`, using explicit `JOIN` and not commas in the `FROM`.
```

:::info The teaching plan isn't published
The teaching plan lives in the course's memory, on your computer. It isn't uploaded to Moodle unless you ask. What it does do is use it to build each unit and, later on, to check that the classroom still matches it (`/miyagi:align`).
:::

Next step: [Unit 1](tema-1-mariadb-docker.md).
