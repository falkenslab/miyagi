---
title: Install
sidebar_position: 3
description: "What you need, how to install miyagi, how to check it, update it and uninstall it, and how to connect your Claude account."
---

# Install miyagi {#instalar-miyagi}

You install it once per computer. On Windows, the [desktop app](escritorio.md) installs with a double click and it's the version we recommend. On Mac and Linux, or if you prefer the web version or the terminal, a single line is enough. You don't need to know how to program. If you're not sure, see [Choose your version](elegir-version.md).

## What you need first {#lo-que-necesitas-antes}

1. **A browser** such as Google Chrome or Microsoft Edge. You log in to Moodle in it the first time miyagi needs it.
2. **Node.js 20 or later, only if you install from the terminal.** Download it from [nodejs.org](https://nodejs.org/), choose the **LTS** version and install it with the default options.
3. **A Claude Pro or Max subscription** ([claude.ai](https://claude.ai)). It's what powers the assistant.
4. **A Moodle course where you are a teacher**, if you want it to work in your classroom. To try it without worry, a test course or a copy of a real one is better.

## The desktop app, for Windows {#aplicacion-windows}

64-bit Windows only. It doesn't need Node.js or a terminal.

1. Download the miyagi installer:

   <DownloadWindows />

2. Open it. Windows will warn you that it doesn't recognise the app, because the installer isn't signed yet: click **More info** and then **Run anyway**.
3. Follow the steps. When it finishes miyagi opens, and you'll have a shortcut on the desktop and in the Start menu.
4. The first time, it asks you to connect your Claude account: you sign in on Anthropic's page or use a key.

Everything that comes next, part by part, is in [The desktop app](escritorio.md).

## Installing it from the terminal, for the web version and the terminal {#instalarlo}

For Mac, Linux and anyone who prefers the [web version](web.md) or the [terminal](terminal.md) on Windows.

1. Open a terminal:
   - **Windows**: press the Windows key, type `PowerShell` and open it.
   - **Mac**: press `Cmd + Space`, type `Terminal` and open it.
2. Copy this line, paste it into the terminal and press Enter:

   <Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

   It takes a minute or two. It's normal to see a warning or two in yellow (`warn`). On a Mac, if you get a permissions error, put `sudo ` in front of it and type your computer password.

## Checking that it works {#comprobar-que-funciona}

With the desktop app there's no need: when you open it you see the version at the bottom of the icon column. With the terminal:

<Terminal>{`$ miyagi --version`}</Terminal>

If you see a version number, it's installed. If the terminal says it doesn't know `miyagi`, close it, open it again and try again. If it still doesn't work, check that Node.js is installed with `node --version` (it has to be 20 or higher).

## Connecting your Claude account {#conectar-tu-cuenta-de-claude}

The first time you start working with miyagi, it tells you you aren't signed in to Claude and offers to do it. In the app and the web version it appears in its window; in the terminal, when exploring your Moodle after `miyagi init` or in your first `miyagi chat`:

1. Accept. Claude's sign-in page opens in the browser.
2. Sign in with your Claude account (the one with your Pro or Max subscription) and click **Authorize**.
3. If the page gives you a code, copy it and paste it where miyagi asks for it.

You only do this once per computer. Claude Code, Anthropic's program that comes inside miyagi, keeps the session, and you don't have to install it separately. miyagi never sees your password nor keeps your session, because Anthropic's terms don't allow it. If you already use Claude Code with your account on this computer, miyagi uses that session and asks for nothing.

If you'd rather pay per use than use your subscription, create an API key at [console.anthropic.com](https://console.anthropic.com/settings/keys) and put it in the `ANTHROPIC_API_KEY` environment variable (or paste it in the app or the [web version](web.md), which offer you that on that same screen).

## Updating it {#actualizarlo}

If you use the desktop app, download the installer again and run it.

If you installed it from the terminal, run the installation line again: it always downloads the latest version.

<Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

Your courses and your settings stay as they were.

## Uninstalling it {#desinstalarlo}

The desktop app is uninstalled from **Settings > Apps**. If you installed it from the terminal:

<Terminal>{`$ npm uninstall -g miyagi`}</Terminal>

Either way, your courses' folders aren't deleted: they're yours and stay where you left them.

## Next step {#siguiente-paso}

Prepare your first subject: [The desktop app](escritorio.md) or [Getting started](primeros-pasos.md).
