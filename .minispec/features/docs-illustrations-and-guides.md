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
- **Guides**, Guía and Casos de uso, each in two tracks, terminal and app:
  - Installing (the npm package, the app's installer), first steps (`miyagi init` / creating a subject in the app), the chat, approvals, `run` / the app's views (Today, teaching plan, units, materials, the oven, extensions).
  - Use cases with both: one session of the SQL classroom told from the app, with its screenshots.
  - The guide says which to choose and that both share the same subject folder.
- **Landing**: both versions in the hero and in the install section (a tab per version, as the family's install card), with a screenshot of each.
- `update-docs`: a change to what the app shows updates its guide and screenshots; `check-docs.mjs` checks the app's views are documented.
- The skills that apply: `falkenslab-site-style` (browser frame, when to use each frame), `falkenslab-terminal-screenshots` if its procedure changes.

- - -

## Acceptance

- No bare command or example request left on the site (`grep` for `bash` blocks and `pide`); every screenshot in a family frame, in both themes.
- Guía and Casos de uso have both tracks in Spanish and English; a teacher can install and use the app following only the guide.
- The landing presents the terminal and the app, each with its install path and a screenshot.
- Lighthouse mobile 90+ and desktop unchanged, both languages build without broken links, no horizontal scroll at 360–1920 px.

- - -
