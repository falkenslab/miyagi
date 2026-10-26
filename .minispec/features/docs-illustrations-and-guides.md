# Docs site: Falken's Lab illustrations, and guides for the terminal and the app

Issue: [#57](https://github.com/falkenslab/miyagi/issues/57)

## Goal

Every illustration on the docs site in Falken's Lab's style, complete guides with use cases for both ways of using miyagi (the terminal and the app, desktop or browser), and a landing page that presents both.

## Context

- The site now has the family's look (falkenslab-site-style: Inter, coral accent, panels), but its illustrations don't:
  - 51 screenshots in `static/img/casos/` (48 `<Shot>` in the SQL tutorial, 16 of them of Moodle) and `img/chat.png`: real captures framed by `Shot.js`, a terminal of its own and a browser bar.
  - 16 example requests as `<p className="pide">`, restyled only by CSS as a message box.
  - 22 commands as bare `bash`/`powershell` code blocks.
  - The landing's terminal animation and its window-framed screenshot.
- The family has `<Terminal>` and `<Prompt>` (moodle-mcp's components, the skill's templates) and `falkenslab-terminal-screenshots` for framing real terminal captures; there is no browser frame yet.
- The guide follows the terminal: `init`, `chat`, `run`. The app (`desktop/`, Electron) and `miyagi web` (the same page in the browser, `src/host/`, `gui/`) only appear in `avanzado/navegador.md` and the reference. A teacher who installs the app has no guide.
- The landing speaks of a terminal and an install command only.

## Changes

- **Illustrations**, in both languages:
  - Commands in `<Terminal>` (copy button, `$` prompt), example requests in `<Prompt>` (send button), from the skill's templates into `src/components/` and `src/theme/MDXComponents`.
  - Screenshots retaken and framed in the family's style: the terminal ones with `falkenslab-terminal-screenshots`; the app's and Moodle's in a browser window frame added to the skill (bar, traffic lights, address, both themes). The SQL tutorial re-photographed against moodle-sandbox, with the same steps.
  - The landing's terminal animation and its screenshot in the same frames.
- **Two tracks, terminal and app**, in Guía and Casos de uso, Spanish and English, each with its own screenshots:
  - **Choosing and starting.** A first page says what each is and that both work on the same subjects (`~/.miyagi`). The app track starts with both ways to open it: the desktop app (its installer, the icon, the window) and `miyagi web` (from a terminal, the local address with its token, a browser tab on this computer only). After that it's one guide: the page is the same (`desktop/main.mjs` loads `src/host/`'s page, `gui/`).
  - **The terminal's guide:** install, `miyagi init`, the chat (`miyagi chat`, its keys, `/` commands), approvals and modes, `run`, `explore`, `ingest`, extensions (`miyagi extension`).
  - **The app's guide:** creating or opening a subject, the chat and its panels, modes and actions, each view (Today, teaching plan, units and activities, materials, the oven, your classroom, knowledge base, sources), extensions and capabilities.
- **Every use case in both tracks, with screenshots of each.** The use cases are the SQL tutorial's steps (preparing the classroom, your material, the teaching plan, units 1–4, grading, the forum, following the class, an own skill) and the requests in `guia/ideas.md`. Each one shows what to ask (in `<Prompt>`), the approval panel, the result in Moodle, and how it looks in the terminal and in the app. Captured against moodle-sandbox with scripts kept with the test report, so they can be retaken.
- **Landing**: both versions in the hero and in the install section (a tab per version, as the family's install card), with a screenshot of each.
- `update-docs`: a change to what the app shows updates its guide and screenshots; `check-docs.mjs` checks the app's views are documented.
- The skills that apply: `falkenslab-site-style` (browser frame, when to use each frame), `falkenslab-terminal-screenshots` if its procedure changes.

- - -

## Acceptance

- No bare command or example request left on the site (`grep` for `bash` blocks and `pide`); every screenshot in a family frame, in both themes.
- Guía and Casos de uso have both tracks in Spanish and English; a teacher can install and use either following only its guide, the app's starting with the desktop app and with `miyagi web`.
- Every use case has its screenshots in the terminal and in the app (and in Moodle where it changes something there); a report in `tests/` with the capture scripts.
- The landing presents the terminal and the app, each with its install path and a screenshot.
- Lighthouse mobile 90+ and desktop unchanged, both languages build without broken links, no horizontal scroll at 360–1920 px.

- - -
