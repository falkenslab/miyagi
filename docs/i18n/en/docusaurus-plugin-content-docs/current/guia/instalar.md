---
title: Install
sidebar_position: 3
description: "What you need, how to install miyagi, how to check it, update it and uninstall it, and how to connect your Claude account."
---

# Install miyagi {#instalar-miyagi}

You install it once per computer. The [desktop app](escritorio.md) installs with a double click on Windows, Mac and Linux, and it's the version we recommend. If you prefer the web version or the terminal, a single line is enough. You don't need to know how to program. If you're not sure, see [Choose your version](elegir-version.md).

## What you need first {#lo-que-necesitas-antes}

1. **A browser** such as Google Chrome or Microsoft Edge. You log in to Moodle in it the first time miyagi needs it.
2. **Node.js 20 or later, only if you install from the terminal.** Download it from [nodejs.org](https://nodejs.org/), choose the **LTS** version and install it with the default options.
3. **A Claude Pro or Max subscription** ([claude.ai](https://claude.ai)). It's what powers the assistant.
4. **A Moodle course where you are a teacher**, if you want it to work in your classroom. To try it without worry, a test course or a copy of a real one is better.

## The desktop app {#aplicacion-windows}

For 64-bit Windows, Mac (with Apple Silicon or Intel) and 64-bit Linux. It doesn't need Node.js or a terminal.

1. Download miyagi. The button offers your system's, and the others are below it:

   <DownloadApp />

2. Install it. It isn't signed yet, so your system will warn you the first time:
   - **Windows**: open `miyagi-setup.exe`. Windows will say it doesn't recognise the app: click **More info** and then **Run anyway**. Follow the steps; you'll have a shortcut on the desktop and in the Start menu.
   - **Mac**: open the `.dmg` and drag miyagi to **Applications**. The first time, in Applications, right-click miyagi and choose **Open**, and **Open** again. If macOS says the app "is damaged", open Terminal and type this line, which removes the downloaded-from-the-internet mark and changes nothing else:

     <Terminal>{`$ xattr -dr com.apple.quarantine /Applications/miyagi.app`}</Terminal>

     If your Mac has an Intel processor (those before late 2020), download the **Mac (Intel)** version.
   - **Linux**: on Ubuntu or Debian, install the `.deb` and you'll have miyagi among your applications. On other distributions, use the `.AppImage`: allow it to run (in its properties, or with `chmod +x miyagi.AppImage`) and open it.

     <Terminal>{`$ sudo apt install ./miyagi.deb`}</Terminal>

3. Open miyagi. The first time, it asks you to connect your Claude account: you sign in on Anthropic's page or use a key.

Everything that comes next, part by part, is in [The desktop app](escritorio.md).

## Installing it from the terminal, for the web version and the terminal {#instalarlo}

For anyone who prefers the [web version](web.md) or the [terminal](terminal.md), on any system.

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

## All downloads {#descargas}

Every miyagi release publishes its files on GitHub. These links always take you to the latest one's:

- **[miyagi-setup.exe](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-setup.exe)**: the desktop app for 64-bit Windows.
- **[miyagi-arm64.dmg](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-arm64.dmg)** and **[miyagi-x64.dmg](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-x64.dmg)**: the app for Mac, with Apple Silicon (M1 and later) and with Intel.
- **[miyagi.deb](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.deb)** and **[miyagi.AppImage](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.AppImage)**: the app for 64-bit Linux; the first for Ubuntu and Debian, the second for any other distribution.
- **[miyagi.tgz](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz)**: the package of the web version and the terminal, for any system with Node.js. It's what the line above installs; if you download it, it installs the same way with `npm install -g` and the file's path.
- **[All releases](https://github.com/falkenslab/miyagi/releases)**: what each one brings and its files, in case you need to go back to an earlier one.

## Updating it {#actualizarlo}

If you use the desktop app, download it again and install it over the old one; on Mac, replace the one in Applications.

If you installed it from the terminal, run the installation line again: it always downloads the latest version.

<Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

Your courses and your settings stay as they were.

## Uninstalling it {#desinstalarlo}

The desktop app is uninstalled on Windows from **Settings > Apps**; on Mac, by dragging miyagi from Applications to the Trash; on Linux, with `sudo apt remove miyagi` if you installed the `.deb`, or by deleting the `.AppImage`. If you installed it from the terminal:

<Terminal>{`$ npm uninstall -g miyagi`}</Terminal>

Either way, your courses' folders aren't deleted: they're yours and stay where you left them.

## Next step {#siguiente-paso}

Prepare your first subject: [The desktop app](escritorio.md) or [Getting started](primeros-pasos.md).
