---
title: The web version
sidebar_position: 5
description: "miyagi web: the same page as the app, opened in a tab of your browser, on Windows, Mac or Linux and only on your computer."
---

# The web version {#la-versión-web}

`miyagi web` opens the same page as the desktop app in a tab of your browser. It works on Windows, Mac and Linux. Everything you see and do is explained in [The desktop app](escritorio.md): here you'll only see what changes and its main uses.

## Opening it {#abrirla}

You need to [install miyagi from the terminal](instalar.md#instalarlo). Then:

<Terminal>{`$ miyagi web`}</Terminal>

miyagi opens the subject you used last (or the one you give it with `-w <name>` or `--dir <folder>`) and shows you an address like `http://127.0.0.1:52341/?token=…`. Open it in your browser. To close it, press `Ctrl+C` in the terminal.

<Shot width="1400" height="875" kind="web" src="/img/v2/web-hoy.webp" alt="The web version in the Today view at desktop size, with the greeting, the summary cards and the suggestions.">The Today view in the browser.</Shot>

The page works only on your computer, and that address carries a random key that changes every time. Don't share it: [what protects it and what doesn't](/avanzado/navegador/#que-la-protege).

## What changes compared with the app {#qué-cambia-respecto-a-la-aplicación}

- There's no **title bar** with the File, Edit, View and Help menus: the window is your browser.
- There's no **built-in browser**: the side panel shows drafts and activity, and links (also **View in the classroom**, under each thing it does in Moodle) open in a new tab of your browser, where you're already signed in to Moodle.
- You have to keep it open from a **terminal**, and when you close the terminal it closes.
- **Only one tab at a time**: if you open it in another one, the previous one stops working.

The guided tour, the tips, the approvals and the modes are the same.

## Talking and approving {#conversar-y-aprobar}

The conversation, the approvals and the views work the same as in the app.

<Shot width="1400" height="875" kind="web" src="/img/v2/web-chat.webp" alt="A conversation in the web version with the summary of the forum replies.">A conversation in the browser tab.</Shot>

<Shot width="1400" height="875" kind="web" src="/img/v2/web-aprobacion.webp" alt="An approval panel in the web version for publishing in the forum, with the Approve, Reject and Stop all buttons.">The approval, with the same three options: Approve, Reject and Stop all.</Shot>

## On a small screen {#en-una-pantalla-pequeña}

On a narrow screen, the icon column and the conversations open with the ☰ menu button, and the conversation takes up the whole screen.

<Shot width="780" height="1688" kind="web" src="/img/v2/web-movil-hoy.webp" alt="The web version at phone width, in the Today view.">The web version at 390 pixels wide.</Shot>

<Shot width="780" height="1688" kind="web" src="/img/v2/web-movil-menu.webp" alt="The side menu open at 390 pixels, with the icon column, the subject, New conversation and the conversations.">The menu, open.</Shot>

The page listens only on your computer, so using it from another device would need a tunnel, and we don't recommend that without additional protection: [we explain it here](/avanzado/navegador/#desde-otro-equipo).

## Main uses {#usos-principales}

The same as in the app: [create a subject](escritorio.md#crear-asignatura), [link the classroom](escritorio.md#vincular), leave your documents in Sources and talk to it. And you can see it in specific tasks in [Use cases in the web version](/casos-de-uso/en-web/).

On Windows, the [desktop app](escritorio.md) is more comfortable: it has its own window and its built-in browser.
