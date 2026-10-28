---
title: The knowledge base
sidebar_position: 4
description: "sources, knowledge and drafts; what miyagi ingest does step by step, which formats it reads, how its pages are organized and what it never keeps."
---

# The knowledge base {#la-base-de-conocimiento}

miyagi remembers your course between sessions because it keeps a **knowledge base**: a small wiki of linked Markdown pages, in the course's `knowledge` folder, that it writes and maintains itself. It doesn't touch it with the file tools but with agent-kit's `knowledge_*` tools, which work with pages instead of files (agent-kit's ADR-024). A future session only knows what is written there. The generic part (layers, index, log, templates) comes from agent-kit; the course part (units, activities, teaching plan, progress) is added by miyagi in [`prompts/system/course-knowledge.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/course-knowledge.md).

## Three folders, three roles {#tres-carpetas-tres-papeles}

- **`sources/`: the originals.** Your material (teaching plan, notes, rubrics, solutions, criteria) and the documents the assistant adds with agent-kit's source tools (see [The sources](#las-fuentes)). For its file tools it is **read-only**: it can't change or delete anything there.
- **`knowledge/`: its pages.** What it has learned from your documents and from its work. It only reaches it with the `knowledge_*` tools: the file tools (`Read`, `Write`, `Edit`, `Grep`, `Glob`) can't read it, write it or search it.
- **`materials/`: your materials.** The question banks and the quizzes, as text you can read and edit, from which what the classroom imports is generated ([Your materials](materiales.md)).
- **`drafts/`: what it builds for Moodle.** The editable source code of each resource (an activity's HTML, a page's text, its images) and what is exported from `materials/`, one folder per resource. They aren't notes, so they don't go in `knowledge/`; the activity's or unit's page links to them. See [Approvals and drafts](aprobaciones-y-borradores.md).

## What `miyagi ingest` does {#qué-hace-miyagi-ingest}

<Terminal>{`$ miyagi ingest                                  # todo lo de sources/ que aún no tiene resumen
$ miyagi ingest sources/rubrica-tarea-2.pdf      # solo esos archivos`}</Terminal>

It's a session without Moodle: it only works with files, and since it publishes nothing, it doesn't ask for approvals. Its instructions ([`teacher-ingest.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/teacher-ingest.md)) set these steps, in order:

1. Loads the `knowledge-ingest` skill before writing any page.
2. Looks at the catalog (`knowledge_index`), reads the overview (`knowledge_read` of `overview`) and asks `list_sources` which documents are new or have changed since it incorporated them.
3. Incorporates each document following `knowledge-ingest`: it reads it whole (not just the first page), creates its summary page (`summary/<slug>`) and those of the concepts it covers with `knowledge_create`, which without content gives it each type's template, or updates the existing ones with `knowledge_edit`; it links it from the page of the unit it belongs to (and, if it's a rubric or grading criteria, from the activity's) and records each operation in the log with `knowledge_log`.
4. Loads `knowledge-lint` and reviews what it touched, starting with `knowledge_check`, fixing what it finds.
5. Ends with a summary: documents incorporated, pages created and updated (counted from the ones it recorded with `knowledge_log`, not estimated) and what it couldn't read.

A document already incorporated and unchanged isn't processed again; if it changed, it updates its page instead of creating another. From the chat, `/knowledge:ingest` does the same.

### Formats it reads {#formatos-que-lee}

- **Yes, with `Read`**: Markdown and text, PDF and images (photos of handwritten notes, of slides), which it interprets directly.
- **Yes, with `extract_text`**: Word (`.docx`), PowerPoint (`.pptx`, slide by slide and with the speaker notes) and Excel (`.xlsx`), which it converts to Markdown.
- **No**: OpenDocument (`.odt`): it will say so in the final summary instead of making up its content; export it to PDF or DOCX. Nor does it transcribe videos: it notes them as resources pending review.
- **Links**: a file in `sources/` that lists web addresses (for example, an `enlaces.md`) is one more source. It can read the public pages it links to, marking them as a source external to the course.

## How it's organized {#cómo-se-organiza}

Each page has a `type/slug` identifier, and that's how the assistant names it and how pages link to each other. The `summary`, `concept`, `entity` and `synthesis` types are agent-kit's; `course`, `topic` and `activity` are declared by miyagi ([`src/knowledgeTypes.ts`](https://github.com/falkenslab/miyagi/blob/main/src/knowledgeTypes.ts)). On disk, each page is a Markdown file:

```text
knowledge/
  index.md                el catálogo, una línea por página; lo genera agent-kit tras cada cambio
  log.md                  el diario de operaciones (knowledge_log)
  overview.md             la visión general del curso (overview), que reescribe según la entiende mejor
  summaries/              summary/<slug>: una página por documento incorporado (de sources, de Moodle o de la web)
  concepts/               concept/<slug>: una página por idea
  entities/               entity/<slug>: una página por cosa concreta (un sistema, una herramienta, un documento)
  syntheses/              synthesis/<slug>: respuestas que merece la pena guardar (comparaciones, análisis, informes)
  orientation.md          course/orientation: evaluación, plazos, canales y lo que su cuenta puede hacer
  course-map.md           course/course-map: dónde está cada sección y actividad, con su id y su enlace
  moodle-capabilities.md  course/moodle-capabilities: tipos de actividad y de pregunta que admite este Moodle
  progress.md             course/progress: historial de revisiones del progreso de la clase
  course-audit.md         course/course-audit: historial de auditorías del curso
  teaching-plan.md        course/teaching-plan: la programación didáctica (objetivos O1…, criterios CE…, temas, metodología, calificación)
  drafts.md               course/drafts: las actividades en marcha, cada una con su fase (en plan, construyéndose, oculta, servida)
  topics/<unit>.md        topic/<unit>: una página por tema o sección (objetivos, plan, contenido creado, dudas del foro)
  activities/<act>.md     activity/<act>: una página por actividad evaluable (criterios aplicados, rúbrica, preguntas)
  curriculum/provisions.md curriculum/provisions: las normas del currículo oficial, con su fecha, enlace, vigencia y día de consulta
  curriculum/<module>.md  curriculum/<module>: sus resultados de aprendizaje y criterios, tal cual y con la numeración oficial
  regulations/<norm>.md  regulation/<norm>: cualquier otra norma que le diste (evaluación, calendario, diversidad…): lo que obliga, artículo por artículo
  assessment-matrix.md    course/assessment-matrix: cada criterio o RA con sus instrumentos, sus pesos y dónde está en el libro de calificaciones (nunca datos de alumnos)
```

The `curriculum/` and `regulation/` pages only exist if you give it your regulations in `sources/` or ask it to look them up (`regulations` skill). Each one carries `url`, `date` (the regulation's date) and `consulted` (when it consulted it) in its header, and always separates the literal text from its comments.

Only those eight `course/` pages go in the root of `knowledge/`, with `type: course` in their header. A base written with an earlier version of miyagi opens as is: at the start of each session, miyagi adds `type: course` to the ones that lack it, without touching the rest.

## Its tools {#sus-herramientas}

| Tool | What it does |
| --- | --- |
| `knowledge_index` | The catalog: each page on one line, by section. |
| `knowledge_search` | The pages that contain some words, best first. |
| `knowledge_read` | A page (or the `overview`), with the pages that link to it. |
| `knowledge_create` | Creates a page; without content, it returns its type's template. |
| `knowledge_edit` | Changes a fragment of a page. |
| `knowledge_rewrite` | Rewrites a whole page (or the `overview`) without changing its identifier. |
| `knowledge_supersede` | Marks a page as superseded by another, with a notice at the top. |
| `knowledge_retire` | Removes a page that was wrong from the index and from search; it asks for your approval first, and the page isn't deleted. |
| `knowledge_log` | Adds a dated entry to the log. |
| `knowledge_check` | The mechanical problems at once: broken links, orphan pages, links to retired pages, new, changed or missing documents in `sources/`. |

The `researcher` and `pedagogy-reviewer` helpers only have the three read tools: `knowledge_index`, `knowledge_search` and `knowledge_read`.

Some rules it follows:

- The index and the backlinks are maintained by agent-kit, not by the assistant: `knowledge_read` says which pages link to each one.
- A link can only point to a page that exists; otherwise the tool rejects it and the assistant creates the page first.
- It never renames, moves or deletes a page: if it's superseded, it marks it with `knowledge_supersede` and links to the new one; if it was wrong, it retires it with `knowledge_retire`, after asking you.
- Contradictions aren't overwritten: it notes both versions, each with its source.
- `course/progress`, `course/course-audit` and `synthesis/course-alignment` are histories: it adds a dated entry each time and never rewrites the earlier ones. It takes the date from the system clock (`current_time`), and computes deadlines with `date_math`, never from memory.
- `course/drafts` isn't a history: each activity changes phase on its own line, and leaves when you discard it or when a later session has told you it's already served ([The activities in progress](aprobaciones-y-borradores.md#las-actividades-en-marcha)).
- Each unit and activity page links to the summaries it is based on.
- The pages' content is in the language you speak to it in; the identifiers, lowercase and with hyphens.

## The sources {#las-fuentes}

`sources/` is managed with agent-kit's source tools; the file tools can only read it:

| Tool | What it does |
| --- | --- |
| `list_sources` | Lists the originals with their status: new, incorporated, changed since it was incorporated, or missing. |
| `extract_text` | Reads a Word, PowerPoint or Excel file as Markdown. |
| `save_to_sources` | Saves to `sources/` a file downloaded from Moodle during the session. |
| `download_to_sources` | Downloads an original from a web address; a web page is also saved as Markdown, to quote it word for word. |
| `request_file` | Asks you for a file in a panel: you type its path (or drag it into the terminal) or press Enter if you don't have it. |
| `retire_source` | Sets aside an original that was wrong or replaced by another, after asking you. It doesn't delete it: it moves it to `sources/.agent-kit/retired/` and marks its summary. |

`request_file` and `retire_source` don't exist in `autonomous`. You can drop your files into `sources/` by hand whenever you like: `list_sources` will see them as new.

## Querying and reviewing it {#consultarla-y-revisarla}

- **`/knowledge:query <question>`**: answers from the base, starting with `knowledge_search` or `knowledge_index` and linking each page it uses. It says what comes from the base, what from an original and what from outside. If the answer is an analysis that will be asked for again, it saves it in `syntheses/`.
- **`/knowledge:lint`**: reviews the whole base: first the mechanical part with `knowledge_check` (broken links, orphan pages, documents in `sources/` without a summary or changed), and then duplicate concepts, missing pages, contradictions and unsourced claims. It fixes the mechanical part and tells you what needs your decision.

## Reading and editing it yourself {#leerla-y-editarla-tú}

They're ordinary Markdown files. You can open them with any editor or open the `knowledge` folder as an [Obsidian](https://obsidian.md) vault to see the link graph. If you correct a page, the next session starts from your version.

## Your criteria rule {#tus-criterios-mandan}

When grading, your criteria in `sources/` (a rubric, a solution key, your policy on late or missing submissions) take precedence over the assistant's judgment, and it notes which one it applied on the activity's page.

## What it never keeps {#lo-que-nunca-guarda}

**There are no pages about specific students.** The progress and forum notes talk about the class and about patterns (how many fall behind and why), never about a named student. It's a design decision ([ADR-005](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-005-no-individual-students-in-knowledge.md)): the base persists between sessions, is reused in the instructions and can be shared. When a submission is downloaded to run it, it goes to `sources/<activity>/<student-id>/`, with an identifier and never with the student's name in the path.

## If you came from moodle-agent {#si-venías-de-moodle-agent}

A moodle-agent classroom opens as is. The first time, miyagi moves the old `context/` folder to `sources/`, and a `knowledge/` in the old format (with `README.md` and no `index.md`) to `knowledge-legacy/`, with its downloaded files also in `sources/`. After that, the assistant rebuilds the knowledge base from there.
