---
title: Its skills
sidebar_position: 6
description: "Everything miyagi knows how to do, grouped by task, with an example of how to ask for it in the chat."
---

# Its skills {#sus-habilidades}

A **skill** is know-how the assistant applies on its own when the task calls for it: how to grade fairly, how to write a good multiple-choice question, how to set up a peer-assessment workshop in Moodle… You don't need to call them or know their names. Just ask for the job in your own words, and it picks the ones it needs (often several at once).

Here they all are, grouped by what they do, with an example of how to ask for it in the chat. Some also have a **shortcut** (`/miyagi:...`) that starts it directly.

To see them from the terminal: `miyagi skills`.

miyagi's skills bring the teaching judgement: what to do and how to do it well. The work inside Moodle is done by the **moodle-teacher** extension, which brings its own skills for each thing: `assignments`, `class-progress`, `copy-and-restore`, `course-check`, `course-content`, `forums`, `gradebook`, `grading`, `other-activities`, `publishing`, `quizzes`, `read-a-course`, `scorm`, `several-sites`, `to-grade` and `week` (their full name starts with `moodle-teacher:`, as in `moodle-teacher:grading`). If something can't be done with it, miyagi tells you, prepares it in `drafts` and gives you the steps to do it yourself.

## Running the course day to day {#llevar-el-curso-día-a-día}

### 🧭 `course-orientation` · Getting to know the course {#-course-orientation--conocer-el-curso}

Before doing anything complex, it gets its bearings: how the course is organised, how it's assessed, what deadlines there are, where the class communicates and what it can really do with your account. It looks for just what the task needs, without gathering more, and notes it down so it doesn't have to look again.

- **Ask it like this:** *“Before anything else, get to know the course: how it's assessed and which submissions are coming up.”*
- **Shortcut:** `/miyagi:orient`

### ✅ `grading-rubric` · Grading fairly {#-grading-rubric--corregir-con-justicia}

It grades assignments, open questions in quizzes and participation in graded forums with fair criteria that are **the same for everyone**. If you've given it your rubric or your answer key, they take precedence over its own criteria. It writes useful feedback for each student, shows you every grade before saving it and notes which criteria it applied so it keeps them in the next round of grading.

- **Ask it like this:** *“Grade the submissions for Assignment 2 with the rubric I left you in sources.”*
- **Shortcut:** `/miyagi:grade`

### 💬 `forum` · Running the forum {#-forum--llevar-el-foro}

It decides when the teacher should step in and when it's better to let students answer each other. It writes useful replies and corrections, posts announcements for the whole class, makes sure each message is posted only once and notes the questions that keep coming up, under the unit they belong to.

- **Ask it like this:** *“Are there unanswered questions in the forum? Answer them in a friendly tone.”*
- **Shortcut:** `/miyagi:forum`

### 📈 `progress-monitoring` · Seeing how the class is doing {#-progress-monitoring--ver-cómo-va-la-clase}

It reviews progress and grades and, instead of giving you a list of grades, separates those doing well from those falling behind, sets priorities and suggests what to do. It compares with previous reviews, so it tells you whether the class is improving or getting worse. It only keeps class trends, never records about individual students.

- **Ask it like this:** *“Who is falling behind, and what is the class struggling with most?”*
- **Shortcut:** `/miyagi:progress`

### 🔍 `course-auditor` · Auditing the course {#-course-auditor--auditar-el-curso}

It does a full review of the course (organisation, accessibility, teaching coherence, assessment, broken links, outdated content) or a light maintenance pass, and gives you recommendations ordered by priority rather than a bare list. It also helps prepare a new edition of the course. It saves each audit with its date so it knows what has improved since the last one.

- **Ask it like this:** *“Review the course and tell me what you'd improve before the term starts.”*
- **Shortcut:** `/miyagi:audit`

## Creating content and activities {#crear-contenido-y-actividades}

### 📝 `resource-authoring` · Writing notes and resources {#-resource-authoring--escribir-apuntes-y-recursos}

It writes or edits the course content: notes as a page or a book, and the resources that go with them (files, folders, links, text and media areas, section summaries). With real explanations and examples at your students' level, well structured, with sources cited and consistent with the rest of the course.

- **Ask it like this:** *“Write some notes on normalisation for unit 2, with examples from an online shop.”*

### 📤 `assignment-building` · Creating assignments {#-assignment-building--crear-tareas}

It designs and sets up assignments of any kind: written response, file submission, group work, project milestones, lab report, case analysis, portfolio, oral or video presentation, submissions in drafts. It writes a brief that asks students to really reason or produce something, matches the submission to what's being asked, sets a due date and a cut-off date, and prepares its rubric.

- **Ask it like this:** *“Create an assignment for unit 3: the entity-relationship model of a library, as a PDF, due in two weeks.”*

### 📏 `rubric-design` · Designing rubrics {#-rubric-design--diseñar-rúbricas}

It builds a rubric or grading guide from scratch when an activity doesn't have one: observable criteria and clear performance levels. It sets it up in Moodle and in its notes. It also spots problems in an existing rubric (ambiguous criteria, overlapping levels).

- **Ask it like this:** *“Assignment 4 has no rubric. Suggest one with four criteria before grading.”*

### ❓ `quiz-design` · Writing and setting up quizzes {#-quiz-design--escribir-y-montar-cuestionarios}

It writes well-made quiz questions: believable distractors, varied levels (remember, apply, analyse), unambiguous wording and useful feedback on each option. It also reviews an existing quiz for trivial, repeated or badly worded questions. And it decides how to set it up depending on what it's for (a review quiz isn't set up like an exam), writes the questions in a bank in `materials/` that you can read and edit, exports them with code to import them all at once, asks you to approve the import with the list of every question, and changes quizzes that already have attempts carefully so no one is harmed.

- **Ask it like this:** *“Create a 12-question review quiz on JOIN, with unlimited attempts.”*
- **Shortcut:** `/miyagi:quiz <unit>`: writes the questions, creates the quiz if it doesn't exist yet, imports them (with your approval) and checks their order and the total mark.

### 🗂️ `materials-format` · Your materials, written once {#️-materials-format--tus-materiales-escritos-una-vez}

It writes in `materials/` the questions and quizzes, the notes, the assignments with their rubrics, the units, the course calendar and how it's graded, as text you can read and edit, and publishes them to the classroom with code: it checks them (one correct answer, enough options, criteria that are in your teaching plan), exports them to the classroom's format without escaping problems or broken code, tells you in the approval what the format leaves out and notes what is published and what you've changed since. It turns “week 3 Friday” into real dates for each group (skipping holidays), converts your GIFT banks and prints quizzes as paper exams in several versions. The format is in [Your materials](../avanzado/materiales.md).

- **Ask it like this:** *“Convert the GIFT bank I left you in sources into questions I can edit.”* or *“Print the unit 2 exam in two versions.”*
- **Shortcuts:** `/miyagi:exam <quiz>`, `/miyagi:publish <material or unit>`

### 🎨 `appearance` · The look of what it publishes {#-appearance--el-aspecto-de-lo-que-publica}

It dresses what it exports from `materials/` (pages, assignment briefs, questions, feedback and code) in a style installed as an extension, such as `moodle-ui-kit`, or leaves it with your classroom's theme, which is the usual. Whatever the template, the result is accessible: headings in order, emojis the screen reader doesn't read, no font or background of its own, and colours that contrast; if it had to fix something in the template, it tells you. It also helps you make your own style.

- **Ask it like this:** *“Use the moodle-ui-kit style for what you publish.”* or *“Go back to my classroom's style.”*

### 🎲 `activity-building` · Other Moodle activities {#-activity-building--otras-actividades-de-moodle}

It designs and sets up the rest of the activities so they work as they should: peer-assessment workshops, lessons with branching paths, glossaries, wikis, databases, choices, surveys, graded forums and H5P. And also the pieces that connect activities: completion conditions, access restrictions, badges and groups.

- **Ask it like this:** *“Add a peer-assessment workshop for the final project, with the assignment's rubric.”*

### 🍳 `activity-lifecycle` · The life of an activity {#-activity-lifecycle--la-vida-de-una-actividad}

For something new and complex (a unit project, a gamified activity, an escape room, a SCORM package, a workshop), it suggests going in phases instead of building it all at once: first **a plan** you agree on together (objectives and criteria, what students do and submit, how it's assessed, the classroom pieces, materials, timing and risks), reviewed by its teaching assistant; then it **builds it** and tells you where it departs from the plan and why; next it **tests it hidden** in the classroom; and finally it **serves it** to students. Each step from one phase to the next needs your approval. If you don't want this, it builds it as usual; for a typo or a single question it doesn't suggest it.

Each activity in progress is noted with its phase in the `course/drafts` page. When you close the session you see how many there are in each (“In the oven: 1 planning, 2 being built, 1 being tested hidden”), and the next chat reminds you when it greets you.

- **Ask it like this:** *“Prepare an SQL escape room for unit 3, with the full process.”* If you type `/plan` first, it writes the plan in plan mode, unable to touch anything else.

### 🖼️ `designed-material` · Bringing your own design into the course {#️-designed-material--llevar-al-curso-un-diseño-tuyo}

It brings into the course a material you designed yourself (a worksheet, a poster, an infographic, some slides):

- it exports it in the format that suits its use: PDF for printing or filling in, an image for viewing on a page, PDF for reading slides;
- it saves the file in `drafts/`, because the export link expires;
- it publishes it in the unit you tell it and in the right place, as the appropriate resource and with a line telling students what it's for;
- beforehand, it checks that it reads well on a phone and that it carries no student data.

It uploads it hidden and with your approval, like everything new. It only appears if you have installed a design extension (such as canva) and the classroom one (moodle-teacher). If the design extension asks you to sign in, miyagi will tell you how (`/extensions sign-in canva`).

- **Ask it like this:** *“Upload to unit 3 the loops worksheet I made in Canva.”*

### 🐳 `practice-testing` · Testing practicals in Docker {#-practice-testing--probar-las-prácticas-en-docker}

It checks a practical **by actually running it** in a Docker lab: it follows the brief as a student would before publishing it, or runs a student's submission when grading it and uses the result as evidence. It's for computing courses (Docker, Linux, programming, databases) and only appears if you have the docker-lab extension installed (see [Practicals in Docker](../avanzado/practicas-docker.md)).

- **Ask it like this:** *“Create a Docker Compose practical with a website and a database, and test it before publishing it.”*

### 👀 `publish-check` · Checking before publishing {#-publish-check--revisar-antes-de-publicar}

The last check before something reaches your students, and the checklist it uses to review what is already published. It looks at the writing (no padding, no repetition, no unchecked claims, using the course's terms), accessibility (headings, alternative text on images, links with clear text, tables, colour) and how a real student sees and uses it. This is also where the rules on when to ask for your approval live. It applies on its own every time it publishes.

- **Ask it like this:** *“Check the accessibility of the unit 1 notes.”*

## Designing and planning {#diseñar-y-planificar}

### 📐 `course-design` · Designing with good sense {#-course-design--diseñar-con-cabeza}

The principles it uses to plan a course or a unit before creating the pieces: a progressive structure, objectives aligned with the content, activities and assessment, varied types of activity and a balance between initial, formative and final assessment.

- **Ask it like this:** *“How would you organise a 3-week unit on web security? Just the proposal, don't create it yet.”*

### 💡 `teaching-methodologies` · Choosing the methodology {#-teaching-methodologies--elegir-la-metodología}

It chooses and applies a methodology that fits what is to be learned, and sets it up with the Moodle pieces that make it possible: project-based, challenge-based or problem-based learning, flipped classroom, gamification, cooperative learning, case studies, service learning, design thinking, inquiry, thinking routines, debate and role play, formative assessment and Universal Design for Learning (UDL). If you have one in mind, ask for it.

- **Ask it like this:** *“I want unit 5 to be challenge-based learning. Suggest how to reorganise it.”*

### 📋 `teaching-plan` · Writing the teaching plan {#-teaching-plan--escribir-la-programación-didáctica}

It helps you write or review the course's teaching plan (context, objectives, content and units, methodology, assessment and grading, timing, attention to diversity, resources) from your material and your decisions. It asks you what only you can decide, such as hours, calendar or weightings, and marks as a proposal whatever you haven't decided. It stays in its notes, linked to each unit. It isn't published in Moodle unless you ask.

It doesn't look up regulations on its own. If you want the plan to follow yours (your region's curriculum, the assessment regulations, the school calendar, your school's template), leave them in `sources/` or ask it to look them up: it reads them with the `regulations` skill, cites them and applies them.

- **Ask it like this:** *“Write the teaching plan from the department's draft I left you in sources.”*
- **Shortcut:** `/miyagi:teaching-plan`

### ⚖️ `regulations` · Your regulations {#️-regulations--tu-normativa}

It reads the regulations that apply to you, which you give it in `sources/` or ask it to look up in official sources:

- the curriculum for your subject or module;
- the assessment regulations;
- the start-of-year instructions;
- the one on attention to diversity;
- the school calendar;
- the one on work placements.

For each one it notes what it is, who issues it, its date and whether it's still in force, and whether it clashes with a higher-ranking one. It keeps what is mandatory article by article, and copies deadlines, percentages and conditions word for word. The curriculum goes in its `curriculum/` pages, with the criteria and their official numbering.

Then it applies them, citing the article: the teaching plan has what the regulation requires, assessment follows its sittings and its way of grading, and dates fall on teaching days in the calendar. It never looks them up on its own. If something depends on a regulation it doesn't have, it asks you for it. If what you ask clashes with one of your regulations, it tells you, and you decide.

- **Ask it like this:** *“I've left you the vocational training assessment regulations in sources: apply them to the module's assessment.”* or *“Look up this year's school calendar resolution and put dates on the units.”*

### 📐 `criterial-assessment` · Assessing by criteria {#-criterial-assessment--evaluar-por-criterios}

It assesses by assessment criteria or learning outcomes, not just by activities. It keeps the course's assessment matrix:

- each criterion, quoted from the official curriculum or from your teaching plan;
- which instruments provide evidence for it;
- with what weight;
- where it is in the gradebook.

When grading, each rubric criterion points to the assessment criteria and the feedback names them. It tells you which criteria don't have any evidence yet, and how the class is doing on each, without keeping student data. Setting up the gradebook by criteria needs your approval first.

- **Ask it like this:** *“Build the assessment matrix by learning outcome and tell me which criteria no activity assesses.”*

### 🏦 `exam-bank` · An exam bank by criterion and level {#-exam-bank--un-banco-de-exámenes-por-criterio-y-nivel}

It organises your questions in `materials/` as a bank you can reuse from one year to the next: each question with the criteria it provides evidence for and its level (basic, intermediate or advanced). It tells you how many questions there are for each criterion and level, and which criteria in your teaching plan have none, so you can write what's missing. A quiz or an exam can draw from the bank by criterion and level, for example “three basic ones from criterion 1.1 and one advanced from 1.2”. [Your materials](../avanzado/materiales.md) explains how it's written.

- **Ask it like this:** *“Which criteria have few questions in the bank?”* or *“Make me an exam with three basic questions from 1.1 and one advanced from 1.2.”*

### 📊 `course-reports` · Course reports {#-course-reports--informes-del-curso}

It writes reports about the course, never about a student: results by criterion for the department and the module's annual report (what was planned versus what was taught, results by criterion, what worked and what you'd change). It draws them from the assessment matrix and from the classroom's grades read at that moment, only as totals (how many reach each criterion, the average); it doesn't keep grades or names. If your school has a template, it follows its sections. It leaves it as a document and a PDF in `drafts/`; a `.docx` with the school's template needs a documents extension, and it tells you if you don't have one. You review it before sending it.

- **Ask it like this:** *“Prepare the results by criterion for the first term for the department meeting.”*

### 🎯 `personalised-activities` · Activities set in what the group is into {#-personalised-activities--actividades-en-lo-que-le-interesa-al-grupo}

It sets an activity in what your group likes (their sport, their music, their games) without changing what is learned or how it's assessed. First, an anonymous and voluntary interests survey: it doesn't ask who anyone is or anything sensitive (health, beliefs, background, family…), and from its results it only keeps what three or more chose, never individual answers. Then, two to four variants of an assignment or a quiz in those contexts, as well as the neutral one: only the context changes, and miyagi checks that the grade, the rubric, the criteria and the questions are the same. Each student chooses their context; no one gets one assigned by name. Before the first survey, check with your school whether families need to be informed: below there's a sample text.

- **Ask it like this:** *“Make an interests survey for group A and, with what comes out, prepare assignment 2 in three contexts.”*

<details>
<summary>Sample text to inform families</summary>

> In [subject], the teacher will give the class a short anonymous and voluntary survey about topics they're interested in (sports, music, video games…), to set some exercises in them. No personal data is requested, it's not possible to know who answered what, and only the group's totals are used. The exercises are the same for all students; only the example changes, and each student chooses the one they prefer. If you have any questions, you can contact [teacher] at [contact].

</details>

### 🌈 `diversity` · Attending to diversity {#-diversity--atender-a-la-diversidad}

It applies Universal Design for Learning (UDL) to each unit and activity: more than one way to motivate, to present the content and to show what has been learned. It also prepares variants of an activity:

- **access variants:** more time, another format, oral response;
- **support and extension variants.**

Each variant is named after what it changes, never after who needs it. Who needs what isn't stored anywhere, and you decide who gets each variant. Individual curricular adaptations are outside miyagi: they need the student's personal data and follow the school's procedure.

- **Ask it like this:** *“Prepare a variant of the unit 2 quiz with more time and an accessible format.”*

### 🎯 `course-alignment` · Checking that the course follows the teaching plan {#-course-alignment--comprobar-que-el-curso-sigue-la-programación}

It compares the Moodle course with the teaching plan: objectives or criteria that no activity assesses, missing rubrics, units, dates or weightings different from those planned, and things in the course the teaching plan doesn't cover. It suggests the changes to align them and makes them with your approval.

- **Ask it like this:** *“Does my classroom assess every criterion in the teaching plan?”*
- **Shortcut:** `/miyagi:align`

### 🔎 `topic-research` · Researching a topic {#-topic-research--investigar-un-tema}

It researches online when the course material isn't enough: the current state of a technology or a version, official documentation, good practices, teaching resources, examples, data. It relies on its research assistant, cross-checks sources (official ones first) and saves what it finds in its notes with the sources cited. It also uses it on its own before writing about something that may have changed.

- **Ask it like this:** *“Research which new features in PostgreSQL 17 are worth covering in class.”*
- **Shortcut:** `/miyagi:research <unit>`

## Building units and courses {#construir-temas-y-cursos}

### 🧱 `unit-building` · Building a unit {#-unit-building--construir-un-tema}

It builds a complete unit inside a course that already exists, fitted to its teaching plan, its calendar, its weightings and its style: it chooses the methodology, plans it, has the teaching reviewer review it, creates the notes, the activities and the rubrics, checks it as a student would see it and tells you what you should review.

- **Ask it like this:** *“Add a unit 7 on MongoDB, 3 weeks long, with a pair project at the end.”*
- **Shortcut:** `/miyagi:build-unit <description>`

### 🏗️ `course-building` · Building a complete course {#️-course-building--construir-un-curso-completo}

It builds a whole course from a description (subject, level, length): first the teaching plan, then the welcome section and each unit with real content, activities and rubrics, and finally the checks on the whole course (gradebook, calendar, student view). For each unit it uses `unit-building`. It's meant for an empty course.

- **Ask it like this:** *“Set up an introduction to HTML5 and CSS3 course for first-year web development, with 5 units.”*
- **Shortcut:** `/miyagi:build-course <description>`

## Its course notes {#sus-apuntes-del-curso}

These three look after the `knowledge` folder, where the assistant keeps what it learns about the course so it remembers it in the next conversation. It's explained in [The course's memory](memoria.md).

### 📥 `knowledge-ingest` · Adding documents {#-knowledge-ingest--incorporar-documentos}

It reads a document (a file in `sources`, a Moodle page) and adds it to its notes: it writes a summary, creates or updates the pages for the concepts it covers and links it from the page of the unit it belongs to.

- **Ask it like this:** *“I've left you the final project's rubric in sources. Add it.”*
- **Shortcut:** `/knowledge:ingest` (or `miyagi ingest` from the terminal)

### 🧠 `knowledge-query` · Looking things up in its notes {#-knowledge-query--consultar-sus-apuntes}

It answers a question from what it has noted down, with links to the pages it takes it from, without opening Moodle. If the answer is worth keeping, it adds it to its notes.

- **Ask it like this:** *“What did we agree on for late submissions?”*
- **Shortcut:** `/knowledge:query <question>`

### 🧹 `knowledge-lint` · Checking its notes {#-knowledge-lint--revisar-sus-apuntes}

It checks that its notes are in good shape: broken links, pages nothing links to, documents in `sources` not yet added or that have changed, duplicated concepts, contradictions and gaps. It fixes the mechanical issues and tells you about the rest.

- **Ask it like this:** *“Check your course notes and tell me if anything contradicts itself.”*
- **Shortcut:** `/knowledge:lint`

## Its assistants {#sus-ayudantes}

For some tasks, the assistant relies on specialised helpers that work on their own and send it back a report. None of them can publish anything in Moodle.

| Helper | What it does | When it's available |
| --- | --- | --- |
| Researcher | Searches online, reads the sources (official ones first) and returns what it found with links and dates. | Always, in `chat` and `run` |
| Teaching reviewer | Reviews a plan or an activity: coherence between objectives, activities and assessment, methodology, workload and attention to diversity. | Always, in `chat` and `run` |

## Your own skills {#tus-propias-habilidades}

You can teach it new skills for your subject without programming: a text file with the instructions, written as you'd explain them to a student teacher. They appear in `miyagi skills` marked as `[own]`. How to write them, with a complete example: [Your own skills](../avanzado/habilidades-propias.md).
