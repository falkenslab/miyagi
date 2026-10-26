---
title: Reference
sidebar_position: 11
description: "All of miyagi's commands, their options and the chat shortcuts, at a glance."
---

# Reference {#referencia}

## Commands {#órdenes}

| Command | What it does |
| --- | --- |
| `miyagi init` | Sets up a new subject (the questions in [Getting started](primeros-pasos.md)) in miyagi's folder, or in the one given with `--dir`, with or without a Moodle classroom, and offers to explore your Moodle if you connect it. With `-w` on a subject without a classroom, it offers to connect one; on one that already has it, it connects it again. |
| `miyagi chat` | Full-screen conversation with the assistant, always asking permission before publishing. |
| `miyagi run` | Goes through the whole course in one sitting: grades, looks after the forum, reviews the content and sums up how the class is doing. |
| `miyagi run --task "…"` | Does only the job you give it, with the same rules. |
| `miyagi explore` | Looks, without creating anything, at which activity and question types it sees in your course and how grades are calculated, and notes it down. With no classroom connected, it warns you and does nothing. |
| `miyagi ingest` | Adds the documents in `sources` it didn't have yet to its notes, without opening Moodle. |
| `miyagi ingest <archivos…>` | Adds only those documents. |
| `miyagi skills` | Lists its skills, including yours (marked `[own]`). |
| `miyagi commands` | Lists the chat shortcuts, including yours. |
| `miyagi web` | miyagi's chat in your browser, only on your computer. It shows an address with its key: open it and don't share it (see [miyagi in the browser](../avanzado/navegador.md)). |
| `miyagi workspaces` | Lists your subjects, with the name for `-w` and their folder. It marks the ones it can no longer find. |
| `miyagi workspaces forget <name>` | Removes a subject from the list. Its folder isn't touched. |
| `miyagi extension …` | Installs, configures, enables or removes [extensions](../avanzado/extensiones.md): `search`, `add`, `list`, `config`, `enable`, `disable`, `update`, `remove`. |
| `miyagi --help` | Shows the help with all commands and options. |
| `miyagi --version` | Shows the installed version. |

With no command at all (just `miyagi`), it asks whether you want `run` or `chat` and, if you're not inside a subject's folder, which one from your list. If you choose a new one, it asks you the `init` questions, saves it and finishes: launch it again to start.

## Options {#opciones}

| Option | What for | In which commands |
| --- | --- | --- |
| `-w <name>`, `--workspace <name>` | Work with that subject from your list, from any folder | All |
| `--dir <folder>` | Work with the subject in that folder, or create it there with `init` | All |
| `--language=<code>` | Language of menus and messages: `es`, `en`, `fr` or `de` | All |
| `--plain` | Simple text, without full screen, panels or animations | `chat`, `run`, `explore`, `ingest` |
| `--inline` | The chat in the terminal's normal history, without taking up the whole window | `chat` |
| `--continue` | Pick up the course's last conversation | `chat` |
| `--mode <mode>` | Choose the mode without being asked: `guided`, `interactive` or `autonomous` | `run` |
| `--task "<task>"` | Do only that job instead of going through the whole course | `run` |

## Chat shortcuts {#atajos-del-chat}

| Shortcut | What it does |
| --- | --- |
| `/miyagi:orient` | Gets its bearings in the course: assessment, deadlines and communication channels. |
| `/miyagi:grade` | Grades pending submissions with fair, consistent criteria. |
| `/miyagi:forum` | Reviews the forum and decides whether the teacher needs to step in. |
| `/miyagi:progress` | Reviews how the class is doing and who is falling behind. |
| `/miyagi:quiz <unit>` | Creates a quiz on that topic (or adds questions to it), with the questions imported all at once. |
| `/miyagi:exam <quiz>` | Prints a quiz as a paper exam: versions A, B… with their answer sheet. |
| `/miyagi:publish <material or unit>` | Publishes to the classroom what's in `materials/`: a bank, a quiz, some notes, an assignment with its rubric or a whole unit, hidden first and with your approvals. |
| `/miyagi:build-unit <description>` | Builds a unit inside the course, fitted to its teaching plan, its calendar and its style. |
| `/miyagi:build-course <description>` | Builds a complete course: plans it, creates each section and reviews it as a student would see it. |
| `/miyagi:teaching-plan` | Writes or reviews your teaching plan from your material and your decisions. |
| `/miyagi:align` | Checks whether the classroom matches your teaching plan and fixes what doesn't. |
| `/miyagi:audit` | Full audit of the course with prioritised recommendations. |
| `/miyagi:research <unit>` | Researches a topic online and saves what it finds with its sources. |
| `/miyagi:map` | Shows where each section and activity of the course is: its number and its link. |
| `/knowledge:ingest` | Adds whatever is in `sources` and not yet processed to its notes. |
| `/knowledge:query <question>` | Answers from its course notes. |
| `/knowledge:lint` | Checks that its notes are complete and well linked. |
| `/plan` | Enters plan mode (it suggests a plan without changing anything) or, if you're already in it, goes back to the previous mode. |
| `/resume` | Choose an earlier conversation to pick it up again. |
| `/extensions` | Shows which extensions the session works with, and enables or disables them. |
| `/copy` | Copies its last reply. |
| `/exit` | Closes the session. |

The chat keys (approve, reject, interrupt, change mode) are in [The chat](chat.md).
