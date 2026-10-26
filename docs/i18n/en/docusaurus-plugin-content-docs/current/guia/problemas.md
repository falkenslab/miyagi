---
title: Tips and troubleshooting
sidebar_position: 10
description: "Tips to get the most out of miyagi and what to do when something doesn't work."
---

# Tips and troubleshooting {#consejos-y-problemas}

## Tips {#consejos}

- **Start in a test course**, and with questions that don't publish anything (level 1 of [What to ask it](ideas.md)). Once you see how it works, move on to a real one.
- **Give it your material.** A rubric in `sources` is worth more than ten explanations in the chat.
- **Be specific.** *“Grade Assignment 2 for group 1A”* is better than *“grade last week's stuff”*.
- **Rejecting also teaches it.** If you say no to something, explain why.
- **Read each permission request carefully** the first few times: the summary tells you exactly what it's going to change in Moodle.
- **One folder per course**, and don't mix courses in the same one.

## If something goes wrong {#si-algo-falla}

| Problem | Solution |
| --- | --- |
| The terminal doesn't recognize `miyagi` | Close and reopen the terminal. Check `node --version` (it has to be 20 or higher) and repeat the installation. |
| It says there's no subject here | You're outside a subject's folder. Add `-w <name>` to the command (`miyagi workspaces` gives you the names), or use plain `miyagi` to choose it. |
| It's waiting for you to log in to Moodle | Log in yourself in the browser window the moodle-teacher extension has opened. It only happens the first time or when the session expires. |
| Exploring the Moodle failed when connecting the classroom | The subject is already set up. Check that you logged in in the window and repeat with `miyagi explore`. |
| It asks you “Move this classroom to moodle-teacher now?” | The classroom was connected with the previous system, which no longer exists. Say yes: it installs moodle-teacher and removes the saved username and password from `config.json`. If you say no, that session works without the classroom (only plans and drafts). |
| It warns that it's working without the classroom | The moodle-teacher extension isn't installed or is turned off. Connect the classroom again with `miyagi init -w <name>` (or in the app, in Your classroom), or turn it on (see [Extensions](../avanzado/extensiones.md)). |
| The menus appear in another language | Add `--language=en` (or `es`, `fr`, `de`), or set the language in `config.json` (see [Configuration](../avanzado/configuracion.md)). |
| It's doing something you didn't want | Press `Esc` (in `run`, `Ctrl+C`) and tell it what to do instead. |
| It remembers something wrong | Tell it in the chat or edit the page in `knowledge`. |
| It doesn't read a document in `sources` | Check the format. It doesn't read OpenDocument files (`.odt`) well: export them to PDF or DOCX. It can't transcribe videos either. |
| It says it can't test a practical | The docker-lab extension is missing (or turned off), or Docker is missing. See [Docker practicals](../avanzado/practicas-docker.md). |
| When closing it says “In the oven: …” | Those are the activities it has half done: planned, being built or uploaded hidden to test them, which your students can't see yet. They're in `knowledge/drafts.md`: ask it in the chat to carry on with them, show them or discard them. |
| You were using moodle-agent | Open `miyagi chat` in the classroom's folder: it reorganizes its notes by itself. |

If the problem persists, you can report it on [GitHub](https://github.com/falkenslab/miyagi/issues).
