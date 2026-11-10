---
title: miyagi's page
sidebar_position: 11
description: "Reference for miyagi's page, shared by the desktop app and miyagi web: the window, the side panel, the built-in browser, the views, Your classroom and the extensions; what protects it and what doesn't if you open it from outside."
---

# miyagi's page {#la-página-de-miyagi}

The [desktop app](/guia/escritorio/) and the [web version](/guia/web/) show the same page: the conversation, with its approval panels, the earlier conversations, the mode and your subjects. The app adds its title bar and a built-in browser; both are marked below. This is the detailed reference for what's in it.

The web version opens like this:

<Terminal>{`$ miyagi web`}</Terminal>

miyagi opens the subject you used last (or the one you give it with `-w <name>` or `--dir <path>`) and shows you an address like this:

```
http://127.0.0.1:52341/?token=…
```

Open it in your browser. `Ctrl+C` in the terminal closes it. With `--port <n>` you choose the port. With no subject yet, the page lets you create one.

## What you see {#que-ves}

The guide to the window, with its screenshots, is in [The desktop app](/guia/escritorio/). Here are the details.

On the left, a **column of icons**: **Today**, **Subject** (with the tabs Teaching plan, Topics and activities, Materials and In the oven), **Memory** (Knowledge base and Sources), **Your classroom** and **Extensions** (Installed, My commands, Catalog, Repositories and Capabilities). At the bottom, the help button (with the guided tour), the light, dark or system theme, and the version. On a narrow screen, like a phone's, the column opens with the ☰ button.

Next to it, the **conversations column**, which you can widen by dragging its edge or fold with its button: the subject picker (to switch to another or create a new one, and whether it has a classroom), **New conversation**, the search for a word across all of the subject's conversations, the **bell** (what's waiting for you: an approval, a question, sources not taken in yet or activities in the oven), your **pinned** conversations and the **recent** ones, each with the date of its last activity and your first words in it (the ones with only miyagi's greeting aren't kept in the list). The open one is highlighted, and ⋯ pins it. At the foot, if a job is under way, the task in progress and which of how many it is; clicking it takes you to the conversation.

The first time you open a subject, a **guided tour** shows you these parts (it's saved in `tourSeen`, in the [global configuration](configuracion.md)). When you open a subject a **tip** appears too; you turn them off with the checkbox in its window, which is saved in `showTips`, and how far you've got in `tipsNext`.

From the subject picker (or the start screen, if you have none):

- **New subject** asks you the questions of `miyagi init`: name, description, language, tone, and whether you want to link a classroom right away. It goes into miyagi's folder, unless you click **Choose a folder** and give it an empty or new one (for example, in your cloud).
- **Open a folder** adds to your list a subject you already have on disk, for example copied from a colleague.
- A subject whose folder was moved shows up as not found: **Locate** points it to its new folder and **Forget** removes it from the list without touching its folder.

Where it asks for a folder (a new subject's, **Open a folder**, **Locate** or a repository of extensions on your disk), **📁 Browse…** opens your system's folder dialog: the one you choose fills the field, which you can still change.

They're the same subjects you see in the terminal with `miyagi workspaces`.

At the top of each view, its title; in the conversation, the conversation's title and the button to start a new one.

At the bottom, while miyagi or the page itself is doing something, the **status bar** says so in any view: on opening the subject, that it's reading what it knows of it to greet you; during a turn, what it's doing and for how long, with **Go to the conversation**; an approval or a question waiting for you, highlighted; and what the page does, like installing an extension or connecting the classroom. What has to wait until miyagi finishes stays disabled and, when you hover over it, tells you why; you can keep looking at the views meanwhile. If a conversation doesn't get going within five minutes, with nothing to show or ask, it's closed, another one opens and it lets you know.

In the conversation:

- **A new conversation** greets you and offers what you ask for often: building a unit, taking in your documents (with how many are left) and, with the classroom, grading what's pending and checking the forum; without one, linking it. miyagi receives what you click as if you'd typed it.
- **The chat**: what you write, on the right; what miyagi answers, full width, with **Copy** and how long it took under it; and its actions folded into one dim line (open it to see each one). When it hands something to one of its helpers, like the researcher, under it you see what the helper is doing at each moment, for how long and how many actions it has taken. If you scroll up to read something earlier, the ↓ button takes you back to the end. What miyagi names of your subject (a document in your sources, a material, a page of its memory, the teaching plan or what's in the oven) is a link that opens its view at that item; what doesn't exist stays text. If you select part of a reply, a small menu offers **Research this**, **Questions about this** and **Quote in the chat**.
- **The box to type in**: `Enter` sends, `Shift+Enter` starts a new line, `Esc` stops miyagi while it works (so does the ■ button), `/` opens the shortcuts and `↑`/`↓` go through what you already typed. Under the text, **＋** (add a file to the sources, the **Capabilities** and the catalog of everything miyagi can do, grouped into Day to day, Create, Plan, Memory and Your classroom; what needs the classroom is off without one, and what needs a value, like "On which topic?", asks for it in the same menu) and the **mode** (also with `Shift+Tab`). While miyagi is working you can keep writing: the message joins the turn in progress (shown as "queued" until it answers) and doesn't stop it; commands wait for it to finish. The turn's tasks fold above it into one line with the one in progress; click it to see the list.
- **miyagi's approvals and questions** take the place of the box to type in until you answer, just like in the terminal, and the conversation stays in view above them in case you want to reread something. On a phone, as a sheet that slides up from the bottom. If you were in another view, the page goes back to the conversation.
- **Files for the sources**: from **＋**, or by dragging them onto the box to type in, they go to the subject's `sources/`.

### The side panel {#panel-lateral}

The panel on the right shows, in tabs and without leaving the conversation, the **drafts** you open from the conversation and the turn's **activity**. You can widen it, expand it and close it. In the desktop app, it can also open **web pages** with its built-in browser.

### The built-in browser {#navegador-integrado}

Only in the desktop app. The button in the panel's bar opens a tab with a web page, and links in the conversation go there. Those tabs keep their own session (cookies and sign-ins) and **miyagi doesn't see them**: the model receives nothing of what's in them. It's a separate session from that of the browser moodle-teacher works with, so signing in to one doesn't sign you in to the other. The built-in browser's session stays when you close and reopen the app.

### The title bar {#barra-titulo}

Only in the desktop app. It replaces the Windows bar and is part of the page: arrows to move through the views you've visited, the side column's button and the File, Edit, View and Help menus, with their keyboard shortcuts.

The first time, if you aren't signed in to Claude, the page offers two ways:

- **Sign in with your Claude account.** Anthropic's page opens in your browser. You sign in, authorize and, if it gives you a code, paste it in miyagi's box. Claude Code, which comes inside miyagi, keeps the session; miyagi never sees it.
- **Use an API key** (`sk-ant-api…`, from [console.anthropic.com](https://console.anthropic.com/settings/keys)), billed per use. It's saved in `~/.miyagi/config.json`.

A subscription token (`sk-ant-oat…`) can no longer be pasted: Anthropic's terms don't let miyagi keep one. If an earlier version had saved it, miyagi removes it and asks you to sign in once.

## Your subject at a glance {#tu-asignatura-de-un-vistazo}

These views only show what miyagi knows and has prepared: they don't change anything on their own. Their buttons send miyagi's matching command to the conversation, as if you typed it, and miyagi works there with the same approvals as always. In the conversation you see it by its name (for example, ❓ Make a quiz · Unit 2) and, small underneath, the command that was sent.

Every topic, material, document in your sources, page of its memory, activity in the oven and the teaching plan has its **⋯** button with what miyagi can do with it: on a topic, build the unit, make a quiz, research and align the classroom; on a quiz, the paper exam; on a material, publish it; on a source, take it in or make questions from it. They all end with **Ask miyagi about this**, which leaves the start of the question written in the box. The same menu opens with a right click, `Shift+F10` or the menu key, and on a phone by holding it down, as a sheet that rises from the bottom.

- **Today**, the first thing you see: what miyagi told you when it greeted you, how many pages its memory has, the sources still to take in, what's in the oven, how many materials it has prepared, suggestions based on how the subject stands (taking in your documents, writing the teaching plan, linking the classroom, grading…) and the last thing it noted.
- **Teaching plan**: your teaching plan as it stands in its memory, with **Review with miyagi** (and **Check the classroom** if you have one linked). With no teaching plan yet, a button to write it with miyagi.
- **Topics and activities**: the teaching plan's units, in order with their dates and hours, and the other topics in its memory, each with its activities; one click takes you to its page. A unit with no page yet is shown too, with **Prepare it with miyagi**.
- **Materials**: what miyagi prepares before publishing it, in `materials/` (question banks, quizzes, notes, assignments and rubrics) and in `drafts/` (exports, pages, sites), with a preview (Markdown shown formatted, HTML files without running any of their code; an HTML activity, such as a word search, is played with **▶ Play in the browser**, which opens it in the computer's browser) and, with the classroom linked, **Publish…**.
- **In the oven**: the activities that go through phases (planned, cooking, tested hidden, served), with their next step: **Show to students** what is tested and hidden, and **Go on with it** leaves written in the box how to pick it up. Those already in Moodle (hidden or served) have **View in the classroom**, with the address miyagi noted when it uploaded them, and only if it's in your classroom.
- **Knowledge base**: its pages by section, with a search box and the links between them; **Check the base** asks it to check it.
- **Sources**: your documents, with whether they've already been taken in, have changed or are new. Drag new ones here and click **Ask miyagi to take them in**.

## Your classroom {#tu-aula}

**Your classroom** shows the subject's Moodle course and whether miyagi can reach it, with **View in the classroom** to open the course (in the app, in its built-in browser). Without a classroom, **Link a classroom** does it in three steps:

1. You paste your course's address (the one you see in the browser, with `course/view.php?id=…`).
2. miyagi tells you what it's going to do: install the classroom extension (moodle-teacher) the first time and give it your campus and this course, so that it can only enter your linked courses.
3. It's linked, and the conversation starts again, now with the classroom.

Your password doesn't go through miyagi: the first time it enters the course, a window of your campus opens for you to sign in yourself, as usual.

With the classroom linked, the view offers what miyagi does with your course: getting oriented in it, how the class is doing, auditing it and opening the course map (the last one only opens its page in the memory, without asking miyagi anything).

## Extensions {#extensiones}

**Extensions** has four tabs:

- **Installed**: one card per extension, with its switch to turn it on or off, whether it's up to date (and the button to update it if not) and **What it declares**: its remote servers, if it has any, what it needs on your computer, what capabilities it gives, its options and the button to remove it (it asks whether to delete its data too). Secret options, like a token, are never shown: only whether they're saved.
- **Catalog**: the extensions meant for miyagi, with their logo, what they do and what they need. **Add** first shows you what it declares; one from a repository that isn't the official one carries the “not reviewed” mark and warns you before installing. What you install starts working in the open conversation.
- **Repositories**: the official one, which can't be removed, and the ones you add. To add one, miyagi reviews it, warns you that its code runs on your computer and asks you to type its name.
- **Capabilities** (also from **＋**, in the box to type in): a table with what miyagi can do and thanks to what, what your computer doesn't allow it (for example, no Docker) and what it lacks, with a button to add the extension that would give it.

## What protects the web version {#que-la-protege}

- **Only on your computer.** The page listens on `127.0.0.1`, your own machine's address: nobody on your network can reach it.
- **With a key.** The `?token=…` part of the address is random and changes every time you open it. Without it, the page doesn't respond. Whoever has the full address can use miyagi with your account: don't share it.
- **One window at a time.** If you open it in another tab, the previous one notices and stops working.
- **The same rules as in the terminal.** The modes, the approvals before publishing, what miyagi can read and write: miyagi decides all of it, not the page. From the page you can only open a subject on your list, never an arbitrary folder.

## From another computer {#desde-otro-equipo}

The page isn't meant to be opened from outside. If you do it anyway with a tunnel (cloudflared, ngrok, Tailscale), the key in the address is the only thing protecting it: whoever has it uses miyagi with your Claude account and, if you have the classroom connected, with your Moodle session. Do it only with a tunnel that requires signing in, and close it when you're done.
