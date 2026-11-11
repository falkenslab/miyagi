---
title: Tips and troubleshooting
sidebar_position: 14
description: "Tips to get the most out of miyagi and what to do when something doesn't work."
---

# Tips and troubleshooting {#consejos-y-problemas}

## Tips {#consejos}

- **Start in a test course**, and with questions that don't publish anything (level 1 of [What to ask it](ideas.md)). Once you see how it works, move on to a real one.
- **Give it your material.** A rubric in Sources is worth more than ten explanations in the conversation.
- **Be specific.** *“Grade Assignment 2 for group 1A”* is better than *“grade last week's stuff”*.
- **Rejecting also teaches it.** If you say no to something, explain why.
- **Read each permission request carefully** the first few times: the summary tells you exactly what it's going to change in Moodle.
- **One folder per course**, and don't mix courses in the same one.

## If something goes wrong {#si-algo-falla}

| Problem | Solution |
| --- | --- |
| Windows warns that it doesn't recognise the app when installing | The installer isn't signed yet. Click **More info** and **Run anyway**. |
| The terminal doesn't recognize `miyagi` | Close and reopen the terminal. Check `node --version` (it has to be 20 or higher) and repeat the installation. |
| It says there's no subject here (terminal) | You're outside a subject's folder. Add `-w <name>` to the command (`miyagi workspaces` gives you the names), or use plain `miyagi` to choose it. |
| It's waiting for you to log in to Moodle | Log in yourself in the browser window the moodle-teacher extension has opened. It only happens the first time or when the session expires. That window is different from the built-in browser in the side panel. |
| It says the Moodle browser closed halfway or that a tool isn't responding | It can happen: the browser moodle-teacher uses to work in Moodle sometimes crashes during a long job. Before repeating a step, miyagi checks whether the change was actually saved, so as not to apply it twice. If it doesn't recover, tell it to carry on whenever you want (“carry on where you left off”), and check what it has published: a quiz may end up with fewer questions than you asked for (and miyagi may blame Moodle when the cause is the browser). Check that Edge or Chrome is up to date. |
| A conversation takes a long time to start and reopens | If it doesn't start within five minutes, another one opens and lets you know. Ask it again; if it keeps happening, check your connection. |
| It can't read a submission that is a file | With the default data protection, miyagi needs your permission to save the files on your computer under the alias: if you said no, ask it to try again. You'll see it in [the tutorial](/casos-de-uso/corregir/#archivos). |
| Moodle's browser closes halfway through a task | miyagi tells you so and checks what arrived before repeating it. If it happens often, in **Extensions**, in moodle-teacher's settings, choose another browser in `browser` (`chrome`, for instance), or set in `switch_after_crashes` how many crashes to take before it changes on its own. |
| Exploring the Moodle failed when connecting the classroom | The subject is already set up. Check that you logged in in the window and repeat with `miyagi explore`. |
| It asks you “Move this classroom to moodle-teacher now?” | The classroom was connected with the previous system, which no longer exists. Say yes: it installs moodle-teacher and removes the saved username and password from `config.json`. If you say no, that session works without the classroom (only plans and drafts). |
| It warns that it's working without the classroom | The moodle-teacher extension isn't installed or is turned off. In the app, connect the classroom again in **Your classroom**, or in the terminal with `miyagi init -w <name>`, or turn it on (see [Extensions](/avanzado/extensiones/)). |
| The menus appear in another language | In the terminal add `--language=en` (or `es`, `fr`, `de`), or set the language in `config.json` (see [Configuration](/avanzado/configuracion/)). |
| It's doing something you didn't want | Press `Esc` or the ■ button (in `run`, `Ctrl+C`) and tell it what to do instead. |
| It remembers something wrong | Tell it in the conversation or edit the page in `knowledge`. |
| It doesn't read a document in `sources` | Check the format. It doesn't read OpenDocument files (`.odt`) well: export them to PDF or DOCX. It can't transcribe videos either. |
| It says it can't test a practical | The docker-lab extension is missing (or turned off), or Docker is missing. See [Docker practicals](/avanzado/practicas-docker/). |
| When closing it says “Drafts: …” | Those are the activities it has half done: planned, being built or uploaded hidden to test them, which your students can't see yet. You can see them in the **Drafts** view and in `knowledge/drafts.md`: ask it to carry on with them, show them or discard them. |
| You were using moodle-agent | Open that subject with `miyagi chat` in its folder: it reorganizes its notes by itself. |

If the problem persists, you can report it on [GitHub](https://github.com/falkenslab/miyagi/issues).
