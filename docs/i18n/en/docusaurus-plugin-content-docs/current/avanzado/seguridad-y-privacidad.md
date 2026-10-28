---
title: Security and privacy
sidebar_position: 9
description: "Why your password never reaches the model, which files it can read and write, why it has no terminal and what it does with your students' data."
---

# Security and privacy {#seguridad-y-privacidad}

The assistant reads content you don't control: Moodle pages, student submissions, forum posts. Any of them could try to give it orders (“ignore your instructions and…”). That's why the important protections don't depend on the model behaving, but on the program itself ([ADR-004](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-004-secrets-never-reach-model.md)).

## Your password never reaches the model {#tu-contraseña-nunca-llega-al-modelo}

- miyagi neither asks for it nor stores it: `init` only asks you for the course's address.
- The Moodle session belongs to the [moodle-teacher](extensiones.md) extension: the first time it's needed, it opens a browser window for you to sign in yourself, and keeps the session in its own browser profile until it expires. miyagi and the model never see your password.
- An old-style classroom that still has `username` and `password` in `config.json` loses them when it's moved to moodle-teacher (see [Configuration](configuracion.md#aulas-de-antes)). Meanwhile, the assistant **can't read** that file: it's on its tools' list of forbidden paths.

Your access to Claude isn't within its reach either: its file tools can't read the course's `.env` (where an API key of its own may be), nor `~/.miyagi/config.json` (where miyagi keeps the API key you pasted), nor `~/.claude/.credentials.json` (where Claude Code keeps your session).

## Which files it can touch {#qué-archivos-puede-tocar}

An agent-kit filter checks every use of the file tools, by the assistant and by its helpers alike:

- **Reading and listing** (`Read`, `Glob`): only `sources/`, `drafts/`, `materials/` (and the docker-lab labs folder, if you have it enabled), miyagi's skills and the current conversation's folder. Nothing else on your computer: not the course folder outside those, not `Documentos`, not your other courses or projects.
- **Writing and editing** (`Write`, `Edit`): only inside `drafts/` and `materials/` (and the docker-lab labs folder, if you have it enabled: miyagi writes each lab's files there; see [Practicals in Docker](practicas-docker.md)).
- **`sources/`**: read only for `Read`, `Glob` and `Grep`. What goes in is added by agent-kit's source tools: `save_to_sources` (a file downloaded during the session), `download_to_sources` (a web address) and `request_file` (a file you give it); and what goes out, `retire_source`, which asks for your approval and moves it aside to `sources/.agent-kit/retired/` without deleting it ([The knowledge base](base-de-conocimiento.md#las-fuentes)).
- **`knowledge/`**: no file tool reaches it, not even to read. Only the `knowledge_*` tools, which don't delete or rename pages; retiring one (`knowledge_retire`) asks for your approval.
- **Searching the content** (`Grep`): only in `sources/`, `drafts/`, `materials/` and, with docker-lab enabled, its labs folder.
- **The course's `config.json` and `.env`, `~/.miyagi/config.json` and `~/.claude/.credentials.json`**: forbidden, neither read nor write. `verify` checks it on every change (`check-file-scope.mjs`).
- **Other credentials in well-known places**, forbidden as well, just in case: `~/.ssh`, `~/.aws`, `~/.azure`, `~/.gnupg`, `~/.kube`, `~/.npmrc`, `~/.git-credentials`, `~/.netrc`, `~/.pypirc`, `~/.config/gh`, `~/.docker/config.json`, the macOS keychain and the Chrome, Edge and Firefox profiles (cookies and saved passwords).

Your skills, shortcuts and `instructions.md` are outside the folders it can write to: the assistant uses them, but can't change them.

## No terminal {#sin-terminal}

In miyagi **there's no terminal** anywhere, not even for an `echo`: agent-kit denies `Bash` to the main assistant and no helper has it. To work with files in `drafts/` (download, compress, generate a PDF) it has its own tools written in code, which run nothing and don't leave that folder (see [Approvals and drafts](aprobaciones-y-borradores.md)).

It can only delegate to the helpers miyagi declares (`researcher` and `pedagogy-reviewer`), and each one has only the tools on its list.

To run practicals there's the docker-lab extension: miyagi can only use its labs, with the policy docker-mcp enforces when starting each one (no internet unless you allow it, nothing mounted outside the lab, never the Docker socket, CPU and memory limits). Its tools over the computer's whole Docker (containers, images, volumes, networks, Compose projects, `prune`) are blocked ([Practicals in Docker](practicas-docker.md)).

## What it does in Moodle {#lo-que-hace-en-moodle}

It works with your account, through moodle-teacher's fixed tools, so it can do whatever those tools allow with your account in the course. What holds it back:

- Its instructions forbid it to delete what it didn't create, change enrolments or groups, touch the platform's settings and leave your course.
- moodle-teacher only reaches the courses of your miyagi subjects: miyagi puts each one's course in its `courses` option when connecting it (or when opening it for the first time), and the server itself rejects any other course your account can see. Since the extension is the same for all your subjects, its instructions are still what keeps it working only in the course of the one you have open.
- Some moodle-teacher tools are blocked in every session, in any mode, because they're never the assistant's job: enrolling or unenrolling, changing roles, creating groups or changing who's in them, sending private messages, resetting the course and copying it to another course or site.
- In `guided`, no moodle-teacher tool that changes something runs without your approval: a [hook in the program](aprobaciones-y-borradores.md) enforces it. Deleting, removing or resetting is always asked by moodle-teacher, on every call, even if you've already approved it.
- What moodle-teacher can't do, it doesn't try by another route: it tells you, prepares it in `drafts/` and gives you the steps.
- Everything new is uploaded hidden and tested before it's shown.

`autonomous` mode removes the approvals (except deleting, which is never done in that mode): use it only in test courses.

## Your students' data {#los-datos-de-tus-alumnos}

- **It reads what you would see** in Moodle to do its job: submissions, grades, forum posts, progress reports. That content is processed by Claude, Anthropic's model, through your subscription.
- **With pseudonyms.** miyagi installs moodle-teacher with `student_data` set to `pseudonymize`: students reach the model as aliases (“A-7KQ2XM”), never by name. It's changed with `miyagi extension config moodle-teacher …` ([Extensions](extensiones.md)).
- **It keeps no student records.** There are no pages about specific students in the knowledge base: the progress and forum notes are about the class and patterns, never a record with names ([ADR-005](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-005-no-individual-students-in-knowledge.md)).
- **Interest surveys, only anonymous and in totals.** A survey to give activities a setting can't ask for anything that identifies a student or anything sensitive: miyagi rejects it. Of its results it only keeps, on the group's page, what three or more chose, and with fewer than three answers it keeps nothing ([ADR-018](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-018-personalised-activities.md)).
- **Submissions that are run, with an identifier.** When it takes a submission to a lab to run it, it goes to a folder with an identifier or an alias, never with the student's name.
- **Sessions do contain what it saw.** The `sessions/` folder keeps each session's conversation and transcript, with what the assistant read in Moodle. In addition, the Claude Agent SDK keeps its own copy of the conversations in `~/.claude/projects/`. Treat them as course data: `sessions/` is in the `.gitignore` that `init` creates, and you can delete old sessions when you no longer need them.

## If you version the course folder {#si-versionas-la-carpeta-del-curso}

`miyagi init` creates a `.gitignore` that leaves out `config.json`, `.env` (the API key), and `sessions/` (the transcripts). If you use git, don't push them.
