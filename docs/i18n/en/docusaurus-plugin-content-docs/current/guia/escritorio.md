---
title: The desktop app
sidebar_position: 4
description: "miyagi in a Windows window, from scratch: installing it, first launch, the guided tour, creating a subject, linking the classroom and what's in each part of the window."
---

# The desktop app {#la-aplicación-de-escritorio}

This is the main version of miyagi. On this page you'll see all of it, from the first launch to the last part of the window. It only installs on 64-bit Windows; if you have another system, see the [web version](web.md).

:::tip[The complete walkthrough, with a real course]
If you'd rather see it in action, follow the tutorial [An Introduction to SQL course](/casos-de-uso/): it's done in this same app, from start to finish.
:::

## Installing it {#instalar}

1. Download the installer:

   <DownloadWindows />

2. Open it. Windows will warn you that it doesn't recognise the app, because the installer isn't signed yet: click **More info** and then **Run anyway**.
3. Follow the steps. When it finishes miyagi opens, and you'll have a shortcut on the desktop and in the Start menu.

The app doesn't need Node.js or a terminal. To update it, download the installer again and run it; to uninstall it, go to **Settings > Apps**. Your subjects aren't deleted when you uninstall.

## The first time {#primera-vez}

The first thing is to connect your Claude account. You can sign in with your Pro or Max subscription on Anthropic's page, or use an API key. miyagi never sees your password.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-iniciar-sesion-claude.webp" alt="The Connect miyagi to Claude screen: a button to sign in with your Claude account, the note that miyagi never sees your password and the option of using an API key.">Connecting your Claude account: you do it once per computer.</Shot>

Then, with no subject yet, you go straight to the form for creating the first one.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-primer-arranque.webp" alt="The app's first launch with no subjects: the empty New subject form, with name, description, language and tone.">The first launch: there are no subjects yet.</Shot>

## The guided tour and the tips {#visita}

The first time you open a subject, a 19-step guided tour shows you the window part by part. You can skip it and open it again whenever you want with the **?** icon in the icon column, under **Guided tour**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-bienvenida.webp" alt="The first step of the guided tour: a welcome bubble over the Today view, with the Skip tour and Next buttons.">Step 1 of the guided tour.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-chat.webp" alt="A step of the guided tour that highlights the box where you write to miyagi and explains the plus button, the slash for shortcuts and changing the mode.">The tour highlights each part of the window: here, the box where you talk to miyagi.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-buscador.webp" alt="A step of the guided tour that highlights the conversation search and the bell.">Here, the search and the bell.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-aprobaciones.webp" alt="A step of the guided tour about the mode and the approvals, explaining that in Guided nothing is published without your yes.">Another step: the mode and the approvals.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-barra.webp" alt="A step of the guided tour that highlights the title bar with its menus.">And the window bar, only in the app.</Shot>

When you open a subject you also get a **tip**, one each time, with its picture. The buttons move you between them, and if you tick **Don't show tips on startup** they don't appear again.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-truco.webp" alt="The tips window: the title The / menu has all its commands, a screenshot of the menu and the Don't show tips on startup checkbox.">A tip when opening the subject.</Shot>

## Creating a subject {#crear-asignatura}

Fill in the **New subject** form: the name, an optional description, the language you'd like it to talk to you in, and the **tone** it will use when writing to your students in the forum, in feedback and in announcements. Tick **Link a Moodle classroom now** if you want to connect your course at that moment. It's saved in `~/.miyagi/workspaces/`, unless you choose another folder with **Choose a folder**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-nueva-asignatura.webp" alt="The New subject form filled in, with the Link a Moodle classroom now checkbox ticked.">New subject, with the option of linking the classroom right away.</Shot>

You switch subject or create another one from the selector at the top of the conversations column.

Without a classroom, miyagi still helps you with the teaching plan, the units and the materials. You can link it later from **Your classroom**.

## Linking your Moodle classroom {#vincular}

In the **Your classroom** view, click **Link a classroom**. There are three steps:

1. You paste your course's address, the one you see in the browser with `course/view.php?id=…`.
2. miyagi tells you what it's going to do: install the classroom extension (moodle-teacher) if you don't have it and give it your campus and this course, so that it can only go into your linked courses.
3. It's linked.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-vincular-1-direccion.webp" alt="Link a classroom, step 1: the course address field filled in.">Step 1: your course's address.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-vincular-2-confirmar.webp" alt="Link a classroom, step 2: it confirms the campus and the course, and explains that it installs moodle-teacher and that the first time a campus window will open for you to log in.">Step 2: what it's going to do, and the note that you log in yourself in a campus window.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-vincular-3-hecho.webp" alt="Link a classroom, step 3: classroom linked.">Step 3: linked.</Shot>

Your password doesn't go through miyagi: the first time it goes into the course, a window of your campus opens for you to log in yourself, with your username, your password and two-factor authentication if you have it.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tu-aula-recien-vinculada.webp" alt="The Your classroom view just linked: the Moodle address, the course number and the shortcuts to get its bearings, see the class, review the course and open its map.">Your classroom, now with its course and its shortcuts.</Shot>

## The window, part by part {#ventana}

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-hoy.webp" alt="The whole window in the Today view: title bar at the top, icon column on the left, conversations column and, on the right, the greeting, four cards and the suggestions.">The window: title bar, icons, conversations and the open view.</Shot>

### The title bar {#barra-titulo}

It's part of the window. It has the arrows to go back to the views you've visited, the button that shows or hides the conversations column and the **File**, **Edit**, **View** and **Help** menus. **View** has reload, zoom and full screen; **Help**, this documentation.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-barra-titulo-menu.webp" alt="The title bar with the View menu open: Reload, Actual size, Zoom in, Zoom out and Full screen.">The title bar's View menu.</Shot>

### The icon column {#iconos}

On the far left, five icons:

- **Today.** The first thing you see: what miyagi told you when it greeted you, the summary cards and the suggestions.
- **Subject.** With tabs: **Teaching plan**, **Topics and activities**, **Materials** and **In the oven**.
- **Memory.** With tabs: **Knowledge base** and **Sources**.
- **Your classroom.** This subject's Moodle course. A green dot means it's linked.
- **Extensions.** With tabs: **Installed**, **My commands**, **Catalog**, **Repositories** and **Capabilities**.

At the bottom, the **?** (help and guided tour), the light or dark theme, and the version.

### The conversations column {#conversaciones}

At the top, the subject selector and, below it, **New conversation**. The search finds a word in all of the subject's conversations.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-buscar.webp" alt="The search in the conversations column with results for JOIN.">Searching all the conversations.</Shot>

The **bell** counts what's waiting for you: an approval, a question, sources not taken in yet or activities in the oven.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-campana.webp" alt="The bell open: 3 sources to take in and 1 activity in the oven.">The bell, with what you have pending.</Shot>

Your conversations appear by date and, above them, the ones you've **pinned**. You pin one with its **⋯**. You can widen the column by dragging its edge or fold it with its button. At the foot, if there's work under way, you see the task in progress and which of how many it is.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-fijadas.webp" alt="The conversations column with two pinned conversations above the recent ones.">Pinned conversations above the recent ones.</Shot>

### The chat {#chat}

What you write goes on the right; what miyagi replies, at full width, with its actions folded into a line you can open. Whatever it names from your subject (a source, a material, a page of its memory) is a link that opens that view.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-chat.webp" alt="A conversation: the teacher's request and miyagi working on the course guide, with its actions folded.">A real conversation.</Shot>

In the writing box, `Enter` sends and `Shift+Enter` starts a new line. The **+** adds a file to your sources, or chooses an action from the catalog. The **/** shows the shortcuts:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-comandos.webp" alt="The shortcuts menu open above the writing box, after pressing the slash key.">The shortcuts, when you type /.</Shot>

The **mode** says how much it works without asking you (you can also change it with `Shift+Tab`):

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-modo.webp" alt="The mode selector open: Guided, Interactive and Plan, with the explanation of each one.">Guided, Interactive or Plan.</Shot>

When miyagi is about to publish something, the approval takes the place of the writing box until you answer: **Approve**, **Reject** or **Stop all**. If you reject, explain why in your next message.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-aprobacion-publicar.webp" alt="An approval panel for creating a hidden page in the General section, with the Activity tab open next to it.">An approval to publish a page, with the turn's activity next to it.</Shot>

It also asks you when it needs a decision from you:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-pregunta.webp" alt="miyagi asking a question with several options in place of the writing box.">miyagi asks you, with options.</Shot>

While it works you can keep writing to it: your message shows as **queued** and it reads it as soon as the action in progress ends. To stop it altogether, `Esc` or the ■ button.

### The side panel {#panel-lateral}

It opens on the right, in tabs, without leaving the conversation. The button to open it is at the top right. It shows three things:

- **Drafts.** A material or a file miyagi has prepared, for you to review while you talk.
- **The turn's activity.** What it's doing, step by step.
- **Web pages**, with the built-in browser (only in the desktop app).

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-borrador-al-lado.webp" alt="A draft, ejemplos-join.html, open in the side panel next to the conversation.">A draft next to the conversation.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-actividad-trabajando.webp" alt="The Activity tab of the side panel during a working turn, with the actions one by one.">The turn's activity, one action after another.</Shot>

### The built-in browser {#navegador-integrado}

With the button on the panel's bar you open a web tab. Links in the conversation open there, and so does **View in the classroom**, under each thing miyagi does in Moodle, which opens that same page. It's useful for having your Moodle course next to you: you log in once in a tab and you stay logged in even if you close the app.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-navegador-moodle.webp" alt="The built-in browser in the side panel, with the Moodle course open with the teacher's session, next to the conversation.">Moodle next to the conversation.</Shot>

That session is yours alone: **miyagi doesn't see it**, nor what's in those tabs. miyagi goes into Moodle on its own with the moodle-teacher extension, with the login you did in its own window. They're two separate sessions, which is why you may have to log in to both.

### Your subject's views {#vistas}

These views show what miyagi knows and has prepared. Their buttons send to the conversation what that action asks for, with the usual approvals. Each item has its **⋯**, with what miyagi can do with it.

**Today** is described above. **Teaching plan** is your teaching plan as it stands in its memory:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-programacion.webp" alt="The Teaching plan view with the text of the teaching plan and its button to review it with miyagi.">The teaching plan.</Shot>

**Topics and activities** shows each unit with its activities:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-temas.webp" alt="The Topics and activities view: four unit cards, each with its activities.">Four units with their activities.</Shot>

**Materials** is what miyagi prepares before publishing, with a preview:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-materiales.webp" alt="The Materials view: the list of materials and the preview of the selected one.">Materials, with their preview.</Shot>

**In the oven** holds the activities that go through phases: planned, cooking, tested hidden and served.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-horno.webp" alt="The In the oven view, with four columns and the Unit 1 quiz in Tested hidden.">In the oven, with a quiz being tested hidden.</Shot>

**Knowledge base** is the pages miyagi writes and consults about your course:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-base-conocimiento.webp" alt="The Knowledge base view: the list of pages and the course map open.">Its notes, with the course map open.</Shot>

**Sources** is your documents. Drag new ones here and click **Ask miyagi to take them in**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-fuentes.webp" alt="The Sources view: the area for dragging files and the list of documents with their state.">Your documents, with their state.</Shot>

### Your classroom {#tu-aula}

It shows the subject's Moodle course and whether miyagi can reach it, with shortcuts to what miyagi does with your course: getting its bearings, seeing how the class is going, reviewing it in depth and opening the course map.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tu-aula.webp" alt="The Your classroom view of the SQL subject: the linked classroom and its shortcuts.">Your classroom, in the SQL subject.</Shot>

### Extensions {#extensiones}

Extensions give miyagi new capabilities. Here you see the installed ones, add others from the catalog and create your own commands.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extensiones-instaladas.webp" alt="The Installed tab with the moodle-teacher and docker-lab cards.">The installed extensions.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extensiones-catalogo.webp" alt="The Catalog tab with extensions and their Add buttons.">The catalog.</Shot>

When you add one, it shows you what it declares before installing it:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extension-anadir.webp" alt="The Add docker-lab dialog: what it declares, remote servers, what it needs on your computer and its capabilities.">Before installing, what it declares.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extensiones-capacidades.webp" alt="The Capabilities tab: a table of what miyagi can do and thanks to what.">Capabilities: what it can do and thanks to what.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-mis-comandos.webp" alt="The My commands tab, with no commands of your own yet.">My commands, for creating your own.</Shot>

The details are in [Extensions](/avanzado/extensiones/).

### Light or dark theme {#tema}

The sun icon, at the bottom of the icon column, switches between light, dark and the system's.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-chat-oscuro.webp" alt="A conversation in the dark theme, with a table of forum replies.">The dark theme.</Shot>

## Closing and coming back {#volver}

There's nothing to save: everything saves itself as it goes. The app remembers the size of its window and when you open it, it goes back to the last subject you used. There can only be one window open at a time.

If a conversation doesn't start within five minutes, it reopens by itself and lets you know.

If something isn't going as you expect, see [Tips and troubleshooting](problemas.md).
