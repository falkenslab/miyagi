# A promotional website, in Spanish and English

Issue: [#14](https://github.com/falkenslab/teacher-agent/issues/14)

## Goal

Publish a one-page promotional site for teacher-agent, in Spanish and English, on GitHub Pages (`https://falkenslab.github.io/teacher-agent/`), designed with popular design skills for Claude Code.

## Context

- Today teacher-agent's only public face is the README: install steps, badges, a screenshot. It's written for someone already decided to install it; there's nothing to show a teacher in a minute what it does and why it's safe, nor anything in English.
- The repo has no site and GitHub Pages is off. agent-kit already publishes its (technical) docs at `falkenslab.github.io/agent-kit/`, deployed from its own repo with GitHub Actions.
- The package publishes only `dist`, `plugin`, `prompts` and `README.md` (`files`), so a site folder doesn't reach npm.
- Material we already have: the owl logo (`docs/assets/owl.svg`), the chat screenshot (`docs/assets/chat.png`), the palette (owl orange `#d77757`, amber `#dfa23a`, `src/theme.ts`), the README's features and FAQ, and the CheatSheet.
- Popular design skills: Anthropic's public `anthropics/skills` repo (a Claude Code plugin marketplace, Apache-2.0, ~180k stars) ships `frontend-design` (distinctive aesthetic direction, typography, avoiding template-looking pages), `theme-factory` (color/font themes for HTML pages), `canvas-design` (static visual pieces, e.g. a social preview image) and `webapp-testing` (Playwright screenshots and checks of a local web app), in its `example-skills` plugin. Its `brand-guidelines` is Anthropic's own brand: not for this site.
- Asked by the teacher (2026-09-30).

## Changes

- **Design skills for whoever builds the site** (not the runtime agent's `plugin/`): enable `example-skills@anthropic-agent-skills` in the project's `.claude/settings.json` (`extraKnownMarketplaces` + `enabledPlugins`), and use `frontend-design` for the look, `theme-factory` only if its themes fit the owl's palette, `canvas-design` for the social preview image and `webapp-testing` to check the result. Say in `CLAUDE.md` that they're there for the site.
- **Site** in `site/`, static (HTML + CSS, no build step, no framework), light and fast, works at phone width, respects the dark/light preference:
  - `site/index.html` in Spanish and `site/en/index.html` in English, same structure, a language switch on each, `lang` and `hreflang` set;
  - sections: hero with the owl and one line of what it does; what it does in a teacher's week (grade, forum, build content, summarize the class); how it keeps you in control (approval before publishing, hidden drafts, stays inside the course); what it remembers (the knowledge base); languages and Moodle support; install in three steps (Chrome, Node, the one `npm install -g` line) with a link to the CheatSheet; FAQ highlights; footer with GitHub, license (MIT) and the latest release;
  - the chat screenshot, and an English one taken with `--language=en` against the sandbox;
  - Open Graph/Twitter meta and a social preview image (`site/og.png`, 1200×630).
- **Publishing**: a `pages.yml` workflow (GitHub Actions: `actions/upload-pages-artifact` + `actions/deploy-pages`) that deploys `site/` on every push to `main` touching it; Pages enabled with "GitHub Actions" as source.
- **Links**: the README (and its English badges) gets a "web" link to the site; the repo's "Website" field points to it.
- Texts written for teachers, not developers; the Spanish one first, the English one a faithful adaptation (not a word-for-word translation). No claims the product doesn't back (e.g. no grading without approval, no LMS other than Moodle).

## Acceptance

- `https://falkenslab.github.io/teacher-agent/` (es) and `/en/` (en) are live, linked to each other, and deployed by the workflow from `main`.
- `webapp-testing` checks of both pages at 1280 and 390 px wide: nothing overflows, images load, links work, the language switch works; screenshots kept in a test report.
- Lighthouse (or equivalent) accessibility and performance ≥ 90 on both pages.
- Sharing the URL shows the preview image and the right title/description.
- The site doesn't reach the npm package (`npm pack` contents unchanged).
