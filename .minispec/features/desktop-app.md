# Desktop app for Windows

Issue: [#48](https://github.com/falkenslab/miyagi/issues/48)

## Goal

An Electron app (`desktop/`) with an installer, so a teacher installs miyagi with a double click and uses it in a window, with no Node, npm or terminal (ADR-022).

## Context

- Captain Whiskers' `desktop/` is the model: `main.mjs` (134 lines) imports the agent and its host, `startWebChat()`, `BrowserWindow.loadURL(url)`; `scripts/build.mjs`; electron-builder with NSIS; released by hand (no CI), unsigned.
- The kit already rewrites its paths out of `app.asar` and finds the SDK's native CLI unpacked; the app must still `asarUnpack` the SDK's platform package, the kit's `assets/` and `extensions/`, and its own `plugin/` and `prompts/`.
- `ELECTRON_RUN_AS_NODE` (set by VS Code's terminal) turns Electron into Node: the main process deletes it.
- Needs `gui-host` and `gui-chat`; `gui-subjects` gives it more than one subject.

## Changes

- `desktop/package.json` (Electron 44, electron-builder), `main.mjs`:
  - single instance (a second launch focuses the window);
  - `startHost()` of `gui-host` on the open subject; window `loadURL` with the token, never shown to the person;
  - `contextIsolation`, `sandbox`, spellcheck; `setWindowOpenHandler` sends http(s) links to the system browser; `will-navigate` stays in the host's origin;
  - window size and position kept in `~/.miyagi/config.json`; a short menu (DevTools only unpacked); start errors in a dialog.
- `desktop/scripts/build.mjs`: builds miyagi and `gui/`, copies `dist/`, `plugin/`, `prompts/` into the app, installs the published `@falkenslab/agent-kit` at miyagi's exact version.
- Icon from the logo (512 px); the window title is the subject's label.
- electron-builder: `appId dev.falkenslab.miyagi`, NSIS per user, Spanish, English, French and German installers, desktop and Start menu shortcuts, `artifactName: miyagi-setup.exe`; data in `~/.miyagi/`, kept on uninstall.
- A screenshot hook as the captain's (`MIYAGI_DESKTOP_SCRIPT`: steps run in the real window, `capturePage`), used by a check.
- `release` skill: build the installer, check `app.asar.unpacked/.../claude.exe` exists and the versions inside, `gh release upload vX.Y.Z miyagi-setup.exe`; the docs' install page links `releases/latest/download/miyagi-setup.exe`.
- Docs: "Instalar miyagi" in the guide leads with the installer, with SmartScreen's warning explained.

- - -

## Acceptance

- On a clean Windows user without Node: install, first start asks for the Claude key, opens a subject, a conversation with an approval works, closing and opening keeps the window and the conversation.
- The installed app's processes get no `ELECTRON_RUN_AS_NODE`, and nothing is read from inside `app.asar` by another process.
- The screenshot check passes on the packaged app; report in `tests/`.

- - -
