---
name: resource-authoring
description: Write or edit the learning content of a course - notes as a page or a book, and the resources around them (files, folders, links, text and media areas, section summaries) - with real explanations and examples at the students' level, a clear structure, sources cited, and consistent with the rest of the course. Use whenever a unit needs its content written or an existing resource needs editing; activities have their own skills.
---

# Writing learning content

Activities make students practise; resources are where they learn what they'll practise. Notes
that list what "will be covered" instead of explaining it leave the activity with nothing behind
it. Activities are `assignment-building`, `quiz-building` and `activity-building`.

## Before writing

- **The course's style**: look at two or three existing resources — names, tone, level of detail,
  how code or formulas are shown — and match it.
- **The source of truth**: the teacher's material in `sources/` and the knowledge base's concept
  pages come first; anything that may have changed (a tool's version, a command's syntax, a
  statistic) is checked with `topic-research` before it's written.
- **What it's for**: the unit's objectives (in its topic page or the teaching plan) and the
  activities that follow — the notes cover what those activities need, in that order.

## Choosing the resource

| Content | Resource |
| --- | --- |
| A unit's notes of reasonable length | Page |
| Long notes, several sub-topics | Book, one chapter per sub-topic ("Add new chapter") |
| A document the student downloads (the syllabus, a dataset, a template) | File, or folder for several; notes as PDF with `drafts_pdf` from their HTML or Markdown |
| An external reference (official documentation, a video) | URL, with what to look at and why |
| A short note between activities on the course page | Text and media area |
| What a section is about and in what order to go | The section's summary |

## Writing it

- **Explain, don't list**: each concept with what it is, why it matters and how it's used, in the
  course's level; a heading per idea.
- **Examples**: at least one worked example per important concept, close to the students' world
  or profession; code in code blocks, commands that can be copied and actually run.
- **Connect**: refer back to what they already saw and forward to the activity that practises it.
- **Cite**: what comes from outside the course's material links to its source ("según la
  documentación oficial de…").
- **Genuine content**: no placeholders or filler; if you don't have enough to write something
  well, say so in your summary instead of padding it.
- **Descriptive names**: "Apuntes del Tema 2: Dockerfile y construcción de imágenes", not
  "Tema 2" or "Página 1".

## Into Moodle's editor

Write the content as HTML (headings, lists, `<pre><code>` for code and commands) in
`drafts/<slug>/`, and put it into Moodle's rich-text editor through its source-code view (the
`<>` / "Source code" button; `Ctrl+A` there, then type the HTML). Typing into the editor itself
turns everything into plain paragraphs: code blocks, lists and headings are lost, and commands
can no longer be copied. Before saving the form, check the editor shows the structure you wrote.

## Editing existing content

Keep what works; fix what's wrong or outdated, and say what you changed and why. Don't rewrite a
teacher's text into your own style when a correction would do.

## Publishing

Run `publish-check` (writing, accessibility, how it looks as a student) and save it with its
approval — one resource per approval. Record in the topic's page (`knowledge/topics/<slug>.md`)
what you wrote and where (its URL), so a later session doesn't duplicate or contradict it.
