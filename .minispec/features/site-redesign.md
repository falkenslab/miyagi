# Site redesign: one page that sells everything miyagi does

Issue: [#20](https://github.com/falkenslab/miyagi/issues/20)

## Goal

Rebuild `site/` (Spanish and English) as a simple single page with many benefit sections that shows everything miyagi does for a teacher, keeping miyagi's identity (hinomaru palette, Atkinson fonts, logo) and changing only structure and copy.

## Context

- Today's page (`site/index.html`, `site/en/index.html`) has 7 sections: hero with a static chat, "a week" (4 days: grade, forum, build an activity, class summary), "you decide" (3 cards), memory and language, a real screenshot, 3-step install, 5-question FAQ.
- It undersells the product. Missing: building a whole course or unit from a description, the teaching plan and course alignment, quizzes with GIFT import, SCORM games with a grade in the gradebook, rubrics, the 16 teaching methodologies, auditing (accessibility, pedagogy, broken content), web research with citations, Docker practice testing, `ingest` of the teacher's documents, tone, own skills and commands, resumable chats, run vs chat modes.
- Both pages still say "Una semana con teacher‑agent" / "A week with teacher‑agent" (line 81).
- Reference studied (2026-09-30, asked by the teacher): logicoal.ai — dark page, an animated terminal in the hero that types a prompt and shows the agent working, feature-card grid, comparison table, changelog, FAQ, final CTA band.
- Also studied: 15 AI-agent landings (education: MagicSchool, Khanmigo, Brisk, SchoolAI, Diffit; agents: Claude Code, Cursor, Devin, Lindy, goose, OpenCode, Cline, Warp). Patterns shared by most: verb-led hero with one CTA and a live demo, capability grid or tabs by task, a trust section as big as the features (all 5 education sites), "how it works" in 3 steps, FAQ that answers objections, final CTA.
- Palette and fonts do not change: `:root` tokens in `site/styles.css` (sumi, washi, the sun's red) stay as they are.

## Changes

Section order of the new page (same in both languages; the English one an adaptation):

1. **Hero** — promise plus "nothing reaches your students without your OK"; install CTA and GitHub link; free, MIT, runs with your Claude subscription. An animated terminal (like logicoal's) plays a real-looking session: the teacher asks, miyagi works (steps), and it stops at the approval prompt. Static fallback with `prefers-reduced-motion` and without JS.
2. **The problem** — the repetitive work of a Moodle course (grading backlog, forum doubts, building units, keeping up with the plan), short.
3. **What it does** — capability tabs named after teacher verbs, each with a short benefit, what it builds in Moodle and an example request:
   - Build a course or a unit (from a description or the teaching plan: units, notes, assignments, activities, rubrics).
   - Create quizzes (good distractors, feedback, bulk GIFT import) and games (SCORM with a score in the gradebook).
   - Grade with your rubric (same criterion for everyone, useful feedback, your criteria first).
   - Look after the forum (when to step in, recurring doubts, announcements).
   - Write and follow the teaching plan (align dates, weights and criteria with the course).
   - Follow the class and audit the course (who falls behind, accessibility, broken or stale content).
4. **How it works** — 3 steps: install, `miyagi init` pointing at your course, talk to it and approve.
5. **You are in control** — the approval shown as it looks; hidden first, tested as teacher, shown only on a second OK; reminder of what stays hidden.
6. **What it never does** — Diffit-style plain list: never deletes, never touches enrolments or site settings, never enters other courses, your password never reaches the model, no pages about individual students.
7. **Teaching methodologies** — the methodologies it builds with real Moodle pieces (project-, challenge- and problem-based learning, flipped classroom, gamification, cooperative learning, UDL…), as a compact grid.
8. **It remembers your course** — knowledge base as plain Markdown you can open and edit; `ingest` of your syllabus and rubrics; `instructions.md`.
9. **Helpers** — web research with cited sources, pedagogy reviewer, Docker practice testing (opt-in); none of them can publish.
10. **Your way** — tone, 4 languages (talks yours, publishes in the course's), chat or one-pass `run`, your own skills and commands.
11. **Seen for real** — the existing screenshot, plus one from a built course if a real one from `tests/` fits.
12. **Free and open source** — MIT, public repo, latest release and what's new (from GitHub releases, no invented stats).
13. **Install** — the current 3 steps, unchanged in substance.
14. **FAQ** — current 5 plus: which Moodle, how it differs from ChatGPT, does it need to know programming, what if it gets something wrong.
15. **Final CTA** band and footer.

Also:

- Fix the teacher-agent leftovers.
- Sticky header with anchors to the main sections; still one HTML per language, one stylesheet, one script, no framework, no build.
- Update `og-es.png` / `og-en.png` only if the headline changes.
- Nothing claimed that the product doesn't back: every capability traceable to `plugin/skills/`, `prompts/` or a report in `tests/`; no testimonials, logos, multipliers or usage numbers until they are real.

## Review corrections

First version published 2026-09-30 (`888d1d1`). The teacher's corrections, by block number of the page (0 header … 16 footer), both languages:

- **0.2 Menu links:** an icon each instead of the text, with a tooltip saying what it is. The link keeps its text as its accessible name (`aria-label`), since a tooltip doesn't show on touch or to screen readers.
- **0.3 Language switch:** an icon instead of "English" / "Español", with a tooltip and the same accessible name.
- **0.4 Theme switch (new):** light, dark or system, in the header next to the language switch, as an icon with a tooltip like 0.2 and 0.3. Default: system. The choice is remembered (`localStorage`, wrapped in try/catch) and applied before the first paint so the page doesn't flash. Today dark mode only follows `prefers-color-scheme`; the dark palette needs a contrast check too (not covered by the first report).
- **Social preview (og):** `og-es.png` / `og-en.png` redone with the page's own headline (1.2, as it ends up after this review) instead of the old tagline, and a subtitle that matches the lead (1.3); `og:title` and `og:description` of both pages say the same. Same layout (logo on sumi, 1200×630), with `canvas-design`; check the preview WhatsApp actually shows (it caches: test with a fresh URL, e.g. `?v=2`).
- **1.0 Brand at the top (new):** the miyagi logo, larger than in the header, with the word "miyagi" to its right, the pair centred on the page, opening the hero above the kicker.
- **1.1 Kicker:** «Asistente de IA de gestión de aulas Moodle para profesores» (English: "AI assistant for teachers to manage Moodle courses").
- **1.3 Lead:** add that you can teach it new skills to adapt it to your subject (own skills in text files, no programming; README "Habilidades propias").

## Acceptance

- Both pages follow the order above, in the current palette and fonts, and link to each other.
- Every capability listed in Context as missing is on the page, and each claim maps to a skill, command or test report.
- The hero terminal animates, stops at the approval prompt, and shows a static final frame with reduced motion or no JS.
- No "teacher-agent" left in `site/`.
- Checked at 360, 390, 768, 1024, 1440 and 1920 px: no horizontal scroll, 44 px targets, menu, tabs and language switch working by touch and keyboard.
- Lighthouse mobile and desktop, both pages: all four scores ≥ 90.
- Report in `tests/` (`test-report` skill) with screenshots at each width.
