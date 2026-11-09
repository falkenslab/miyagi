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

Since version 0.13.0:

- **A new window, in the app and in the browser.** A column of icons for the views, a resizable column of conversations with search, a bell and pinned conversations, and the side panel with tabs. See [The desktop app](guia/escritorio.md).
- **Built-in browser and its own title bar**, only in the desktop app.
- **Guided tour and tips** when opening a subject.
- **This documentation, by version:** guides and use cases for the app, the web version and the terminal, with screenshots of all three.

Since version 0.12.0:

- **miyagi in a window.** The Windows app, installed with a double click, with the conversation and its approval panels, your subjects by their name, extensions and your subject at a glance. See [Install](guia/instalar.md).
- **miyagi in the browser.** The same page, with `miyagi web`. See [The web version](guia/web.md).
- **Materials written once.** Quizzes, question banks, notes, assignments with their rubric and units in files of your own, with dates per group, published in the classroom with tested exporters. See [Materials](avanzado/materiales.md).
- **Personalized activities.** Equivalent variants set in what the group is interested in, based on an anonymous survey. See [Skills](guia/habilidades.md).
- **Visual styles.** What miyagi publishes in the style you choose, as extensions, always accessible. See [Your materials](avanzado/materiales.md#el-estilo-de-lo-que-publicas).
- **Reports and exam bank.** Course reports and a question bank by criterion and level that carries over from one course to the next. The `.docx` with your school's template is waiting for a documents extension; meanwhile, the report comes out as a document and a PDF.
- **This website in English**, under `/en/`.

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

### Materials and activities {#materiales-y-actividades}

- **Video tutorials in your voice**, published on YouTube and linked in the classroom ([#38](https://github.com/falkenslab/miyagi/issues/38)).

## What miyagi won't do {#lo-que-miyagi-no-hará}

- **Keep students' personal data.** miyagi only handles students' data inside the classroom, through its extension, with pseudonyms, and never keeps it. That's why tutoring, communication with families, individual curriculum adaptations, assessment meetings, grading outside the classroom and connecting to the school administration systems (Séneca, Pincel Ekade, Raíces, ITACA…) are left out.
- **A community catalog or a place to share extensions or activities.** Extensions come from the official repository or from the ones you knowingly add.
