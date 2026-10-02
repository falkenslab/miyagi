# Docs site in English

Issue: [#28](https://github.com/falkenslab/miyagi/issues/28)

## Goal

Serve the docs site in English too, as the old promotional site was, with Docusaurus i18n.

## Context

- The old `site/` had a Spanish and an English page; the Docusaurus site (ADR-012) is Spanish only, its default locale.
- The tutorial's screenshots are of a Spanish Moodle and a Spanish chat: translating them means a second run of the course.
- `update-docs` and `check-docs.mjs` only know the Spanish pages.

## Changes

- `i18n.locales: ["es", "en"]`, a language switch in the navbar, translated landing (`src/pages/`), Guía and Avanzado (`i18n/en/docusaurus-plugin-content-docs/current/`), navbar and footer labels.
- The SQL tutorial stays in Spanish, with an English page that introduces it and says so.
- `update-docs`: a change updates both languages; `check-docs.mjs` checks the English pages too.
- Social preview image in English (`og-en.png`, with `canvas-design`).

## Acceptance

- `/miyagi/en/` serves the English site; the switch keeps the page; the build fails on broken links in either language.
- `check-docs.mjs` passes for both locales.
- Lighthouse and the width checks as for the Spanish site.
