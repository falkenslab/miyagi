---
title: Roadmap
description: "Where miyagi is heading: what's already available, what's coming, with its issue so you can follow it, and what miyagi won't do."
displayed_sidebar: null
---

# Roadmap {#hoja-de-ruta}

:::info It's a plan
This is the only page on the site that talks about what doesn't exist yet. Only what's marked as **available** is usable today. The rest is the intention: it may change or be delayed. Each item links to its issue on GitHub, where you can follow it and comment.
:::

## Available {#disponible}

Since version 0.11.0:

- **The classroom, whenever you want.** You can work on a subject without Moodle (teaching plan, units, materials) and connect the classroom later. See [Getting started](guia/primeros-pasos.md).
- **Your subjects by their name.** They're kept in `~/.miyagi` and you open them with `-w`, without dealing with folders.
- **Extensions.** From Falken's Lab's official repository or from others you add. See [Extensions](avanzado/extensiones.md).
- **Moodle without a free-roaming browser.** The classroom is handled with moodle-teacher's fixed tools. You log in yourself, in its window, and students reach the model under a pseudonym. moodle-teacher only reaches your subjects' courses.
- **Practicals tested in Docker labs.** With the docker-lab extension, and with no terminal anywhere. See [Docker practicals](avanzado/practicas-docker.md).
- **The life of an activity.** For something new and complex: an agreed plan, the build, the hidden test and serving it, with your approval at each step and a count of what's in progress.
- **Your regulations, when you ask for them.** You give it the regulations that apply to you, or ask it to look them up in the official sources, and the teaching plan and the assessment follow them, with the criteria quoted word for word.
- **Criteria-based assessment and attention to diversity.** The assessment matrix, each grade traced back to its criterion, Universal Design for Learning (UDL) and the access, reinforcement and extension variants.
- **Bringing a design of yours into the course**, for example from Canva: it exports it in the right format and publishes it in its unit, hidden and with your approval.

What each skill does is in [Skills](guia/habilidades.md).

## What's coming {#lo-que-viene}

### miyagi in a window {#miyagi-en-una-ventana}

A desktop app, to use miyagi without a terminal:

- **Installing miyagi on Windows with a double click** ([#48](https://github.com/falkenslab/miyagi/issues/48)).
- **The conversation in a window**, with its approval panels ([#47](https://github.com/falkenslab/miyagi/issues/47)), on top of a local server that can also be opened from the browser ([#46](https://github.com/falkenslab/miyagi/issues/46)). Done: coming in the next release.
- **Your subjects in the app**, by their name and without folders ([#49](https://github.com/falkenslab/miyagi/issues/49)). Done: coming in the next release.
- **Seeing what miyagi can do and installing extensions** from the app ([#50](https://github.com/falkenslab/miyagi/issues/50)). Done: coming in the next release.
- **Your subject at a glance**: today, the teaching plan, the units, the materials and the sources ([#51](https://github.com/falkenslab/miyagi/issues/51)). Done: coming in the next release.

### Materials and activities {#materiales-y-actividades}

- **Materials written once.** Quizzes, question banks, notes, assignments with their rubric and units in files of your own, with dates per group, published in the classroom with tested exporters ([#34](https://github.com/falkenslab/miyagi/issues/34); see [Materials](avanzado/materiales.md)). Done: coming in the next release.
- **Personalized activities.** Equivalent variants set in what the group is interested in, based on an anonymous survey ([#39](https://github.com/falkenslab/miyagi/issues/39); see [Skills](guia/habilidades.md)). Done: coming in the next release.
- **Visual styles.** What miyagi publishes (assignment briefs, questions, pages) in the style you choose, as extensions, always accessible ([#21](https://github.com/falkenslab/miyagi/issues/21); see [Your materials](avanzado/materiales.md#el-estilo-de-lo-que-publicas)). Done: coming in the next release.
- **Video tutorials in your voice**, published on YouTube and linked in the classroom ([#38](https://github.com/falkenslab/miyagi/issues/38)).

### Assessment {#evaluación}

- **Reports and exam bank.** Course reports (results per criterion, the module's end-of-year report), and a question bank by criterion and level that carries over from one course to the next ([#44](https://github.com/falkenslab/miyagi/issues/44)). Done: coming in the next release. The `.docx` with your school's template is waiting for a documents extension; meanwhile, the report comes out as a document and a PDF.

### The website {#la-web}

- **This website in English** ([#28](https://github.com/falkenslab/miyagi/issues/28)), under `/en/`: the guide, the advanced pages and the landing; the SQL classroom stays in Spanish. Done: it arrives with the site's next publication.

## What miyagi won't do {#lo-que-miyagi-no-hará}

- **Keep students' personal data.** miyagi only handles students' data inside the classroom, through its extension, with pseudonyms, and never keeps it. That's why tutoring, communication with families, individual curriculum adaptations, assessment meetings, grading outside the classroom and connecting to the school administration systems (Séneca, Pincel Ekade, Raíces, ITACA…) are left out.
- **A community catalog or a place to share extensions or activities.** Extensions come from the official repository or from the ones you knowingly add.
