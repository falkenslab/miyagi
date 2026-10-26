---
title: miyagi in the browser
sidebar_position: 11
description: "miyagi web: miyagi's chat in your browser, only on your computer, with a key in the address; what it protects and what it doesn't if you open it from outside."
---

# miyagi in the browser {#miyagi-en-el-navegador}

Besides the chat in the terminal, miyagi has a page: the same conversation, with its approval panels, the earlier conversations, the mode and your subjects, in a browser window. It's the same page the desktop app opens.

## Opening it {#abrirla}

```bash
miyagi web
```

miyagi opens the subject you used last (or the one you give it with `-w <name>` or `--dir <path>`) and shows you an address like this:

```
http://127.0.0.1:52341/?token=…
```

Open it in your browser. `Ctrl+C` in the terminal closes it. With `--port <n>` you choose the port. With no subject yet, the page lets you create one.

## What you see {#qué-ves}

On the left, the **sidebar**: your subject (to switch to another or create a new one, and whether it has a classroom), **Today**, the **Conversation**, the views of the subject and of its memory, **Your classroom**, the **Extensions**, your earlier conversations (to resume one or start another) and, at the bottom, the versions and the light, dark or system theme. On a narrow screen it opens with the ☰ button.

From the subject picker (or the start screen, if you have none):

- **New subject** asks you the questions of `miyagi init`: name, description, language, tone, and whether you want to link a classroom right away. It goes into miyagi's folder, unless you click **Choose a folder** and give it an empty or new one (for example, in your cloud).
- **Open a folder** adds to your list a subject you already have on disk, for example copied from a colleague.
- A subject whose folder was moved shows up as not found: **Locate** points it to its new folder and **Forget** removes it from the list without touching its folder.

They're the same subjects you see in the terminal with `miyagi workspaces`.

At the top of each view: its title, the **mode** (also with `Shift+Tab`), the **Actions** (what you ask for often, like preparing the next unit or, with the classroom, grading what's pending; miyagi receives it as if you'd typed it) and the **Capabilities**.

In the conversation:

- **The chat**: what miyagi writes, with its actions folded into one line (open it to see each one), the turn's tasks floating above and the bar to type in. `Enter` sends, `Shift+Enter` starts a new line, `Esc` stops miyagi while it works, `/` opens the shortcuts and `↑`/`↓` go through what you already typed.
- **miyagi's approvals and questions**, in a window that doesn't close until you answer, just like in the terminal. If you were in another view, the page goes back to the conversation.
- **Files for the sources**: with the paper clip, or by dragging them onto the bar, they go to the subject's `sources/`.

The first time, if miyagi doesn't have your Claude key, the page asks you for it: paste your token (it starts with `sk-ant-oat`, you get it with `claude setup-token` in a terminal) or an API key (`sk-ant-api`). It's saved in `~/.miyagi/config.json`, as in the terminal.

## Your subject at a glance {#tu-asignatura-de-un-vistazo}

These views only show what miyagi knows and has prepared: they don't change anything on their own. Their buttons send a request to the conversation, as if you typed it, and miyagi works there with the same approvals as always.

- **Today**, the first thing you see: what miyagi told you when it greeted you, how many pages its memory has, the sources still to take in, what's in the oven and in `drafts/`, suggestions based on how the subject stands (taking in your documents, writing the teaching plan, linking the classroom, grading…) and the last thing it noted.
- **Teaching plan**: your teaching plan as it stands in its memory, with **Review with miyagi** (and **Check the classroom** if you have one linked). With no teaching plan yet, a button to write it with miyagi.
- **Topics and activities**: each unit with its activities; one click takes you to its page.
- **Materials**: what miyagi prepares in `drafts/` before publishing it, with a preview (HTML files are shown without running any of their code) and, with the classroom linked, **Publish…**.
- **In the oven**: the activities that go through phases (planned, cooking, tested hidden, served), with their next step.
- **Knowledge base**: its pages by section, with a search box and the links between them; **Check the base** asks it to check it.
- **Sources**: your documents, with whether they've already been taken in, have changed or are new. Drag new ones here and click **Ask miyagi to take them in**.

## Your classroom {#tu-aula}

**Your classroom** shows the subject's Moodle course and whether miyagi can reach it. Without a classroom, **Link a classroom** does it in three steps:

1. You paste your course's address (the one you see in the browser, with `course/view.php?id=…`).
2. miyagi tells you what it's going to do: install the classroom extension (moodle-teacher) the first time and give it your campus and this course, so that it can only enter your linked courses.
3. It's linked, and the conversation starts again, now with the classroom.

Your password doesn't go through miyagi: the first time it enters the course, a window of your campus opens for you to sign in yourself, as usual.

## Extensions {#extensiones}

**Extensions** has four tabs:

- **Installed**: one card per extension, with its switch to turn it on or off, whether it's up to date (and the button to update it if not) and **What it declares**: its remote servers, if it has any, what it needs on your computer, what capabilities it gives, its options and the button to remove it (it asks whether to delete its data too). Secret options, like a token, are never shown: only whether they're saved.
- **Catalog**: the extensions meant for miyagi, with their logo, what they do and what they need. **Add** first shows you what it declares; one from a repository that isn't the official one carries the “not reviewed” mark and warns you before installing. What you install starts working in the open conversation.
- **Repositories**: the official one, which can't be removed, and the ones you add. To add one, miyagi reviews it, warns you that its code runs on your computer and asks you to type its name.
- **Capabilities** (also with the button at the top): a table with what miyagi can do and thanks to what, what your computer doesn't allow it (for example, no Docker) and what it lacks, with a button to add the extension that would give it.

## What protects it {#qué-la-protege}

- **Only on your computer.** The page listens on `127.0.0.1`, your own machine's address: nobody on your network can reach it.
- **With a key.** The `?token=…` part of the address is random and changes every time you open it. Without it, the page doesn't respond. Whoever has the full address can use miyagi with your account: don't share it.
- **One window at a time.** If you open it in another tab, the previous one notices and stops working.
- **The same rules as in the terminal.** The modes, the approvals before publishing, what miyagi can read and write: miyagi decides all of it, not the page. From the page you can only open a subject on your list, never an arbitrary folder.

## From another computer {#desde-otro-equipo}

The page isn't meant to be opened from outside. If you do it anyway with a tunnel (cloudflared, ngrok, Tailscale), the key in the address is the only thing protecting it: whoever has it uses miyagi with your Claude account and, if you have the classroom connected, with your Moodle session. Do it only with a tunnel that requires signing in, and close it when you're done.
