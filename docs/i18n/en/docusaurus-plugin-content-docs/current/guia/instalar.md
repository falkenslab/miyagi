---
title: Install
sidebar_position: 2
description: "What you need, how to install miyagi, how to check it, update it and uninstall it, and how to connect your Claude account."
---

# Install miyagi {#instalar-miyagi}

You install it once per computer, on Windows, Mac or Linux. You don't need to know how to program: just copy and paste one line.

## What you need first {#lo-que-necesitas-antes}

1. **A browser** such as Google Chrome or Microsoft Edge. You log in to Moodle in it the first time miyagi needs it.
2. **Node.js 20 or later.** Download it from [nodejs.org](https://nodejs.org/), choose the **LTS** version and install it with the default options.
3. **A Claude Pro or Max subscription** ([claude.ai](https://claude.ai)). It's what powers the assistant.
4. **A Moodle course where you are a teacher**, if you want it to work in your classroom. To try it without worry, a test course or a copy of a real one is better.

## Installing it {#instalarlo}

1. Open a terminal:
   - **Windows**: press the Windows key, type `PowerShell` and open it.
   - **Mac**: press `Cmd + Space`, type `Terminal` and open it.
2. Copy this line, paste it into the terminal and press Enter:

   <Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

   It takes a minute or two. It's normal to see a warning or two in yellow (`warn`). On a Mac, if you get a permissions error, put `sudo ` in front of it and type your computer password.

## Checking that it works {#comprobar-que-funciona}

<Terminal>{`$ miyagi --version`}</Terminal>

If you see a version number, it's installed. If the terminal says it doesn't know `miyagi`, close it, open it again and try again. If it still doesn't work, check that Node.js is installed with `node --version` (it has to be 20 or higher).

## Connecting your Claude account {#conectar-tu-cuenta-de-claude}

The first time you start working with miyagi (when exploring your Moodle after `miyagi init`, or in your first `miyagi chat`), it tells you you aren't signed in to Claude and offers to do it:

1. Accept. Claude's sign-in page opens in the browser.
2. Sign in with your Claude account (the one with your Pro or Max subscription) and click **Authorize**.
3. If the page gives you a code, copy it and paste it in the terminal.

You only do this once per computer. Claude Code, Anthropic's program that comes inside miyagi, keeps the session, and you don't have to install it separately. miyagi never sees your password nor keeps your session: Anthropic's terms don't allow it. If you already use Claude Code with your account on this computer, miyagi uses that session and asks for nothing.

If you'd rather pay per use than use your subscription, create an API key at [console.anthropic.com](https://console.anthropic.com/settings/keys) and put it in the `ANTHROPIC_API_KEY` environment variable (or paste it on [miyagi's page](../avanzado/navegador.md)).

## Updating it {#actualizarlo}

Run the installation line again: it always downloads the latest version.

<Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

Your courses and your settings stay as they were.

## Uninstalling it {#desinstalarlo}

<Terminal>{`$ npm uninstall -g miyagi`}</Terminal>

Your courses' folders aren't deleted: they're yours and stay where you left them.

## Next step {#siguiente-paso}

Prepare your first subject: [Getting started](primeros-pasos.md).
