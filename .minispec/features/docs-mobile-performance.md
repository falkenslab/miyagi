# Docs site: Lighthouse mobile performance at 90

Issue: [#27](https://github.com/falkenslab/miyagi/issues/27)

## Goal

Bring the docs site's Lighthouse mobile performance to 90 or more, as CLAUDE.md requires, without losing what the site gives today.

## Context

- Measured on 2026-10-02 (local server with gzip, like GitHub Pages): desktop 98-100 in every category; mobile accessibility, best practices and SEO 100, but performance 89 (landing), 84-86 (Guía, Avanzado) and 79 (tutorial pages). The old static `site/` scored 99 in the same conditions.
- The cost is Docusaurus' React bundle (`main.js`, ~480 kB, ~1.1 s of simulated CPU): TBT 300-400 ms and a simulated LCP of 2.7-4.3 s, while the observed LCP is 0.5 s.
- Already done: fonts with their `@font-face` inline and `font-display: optional`, screenshots as WebP, lazy images with low fetch priority. Tried and dropped: `future.faster` (SWC fails on this Windows machine and saved 3 %).

## Changes

- Landing as static HTML (`docs/static/index.html` or a plugin that emits it), with the old site's light script for the terminal, tabs and theme; shares the theme key with Docusaurus so the choice carries over.
- Docs pages: measure what the bundle carries (search, prism languages, unused plugins) and trim; consider `docusaurus-plugin-no-js`-style pages only if the gain is real.
- Re-measure with Lighthouse on an idle machine, three runs per page, median.

## Acceptance

- Landing, a Guía page, a tutorial page and an Avanzado page at 90+ in mobile performance (median of three runs), the other categories and desktop unchanged.
- Theme, menu and links work the same; no horizontal scroll at 360-1920 px.
