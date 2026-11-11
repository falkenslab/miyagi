# Drafts, not "the oven"

Issue: [#105](https://github.com/falkenslab/miyagi/issues/105)

## Goal

The page, the chat and the docs call the work in progress "Borradores" (Drafts) instead of "En el horno", with phases named for what they are.

## Context

- The activity register (`course/drafts`, #17) is shown as "En el horno" in the page (`gui/src/i18n/course.ts`, `Course.tsx`), the bell (`noticeOven`), the tour, the end-of-session line (`src/messages/*.ts`: "En el horno: 1 en plan, 2 cocinándose") and the docs site. The phases follow the metaphor: en plan, cocinándose, probándose oculto, recién servido.
- The teacher asked for "Borradores": a plain word every teacher knows, and what the register already is inside (`course/drafts`, `drafts/`).
- Own commands may already say `applies-to: oven`.

## Changes

- Every text of the page, the tour, the bell, the end-of-session line and the prompts that say "horno"/"oven", in the four languages: "Borradores" / "Drafts" / "Brouillons" / "Entwürfe"; phases "en plan", "en construcción", "probándose oculto", "recién publicado" (and their translations).
- The item kind `oven` becomes `draft`; `applies-to: oven` keeps working (read as `draft`).
- Docs site: the pages and anchors that name it, and the screenshots that show it, in Spanish and English.

- - -

## Acceptance

- No "horno", "oven", "cocinándose" or "servido" left in `gui/`, `src/messages/`, `prompts/`, `plugin/` or the docs (grep), except the `oven` alias.
- An own command with `applies-to: oven` shows on the Drafts items.
- `verify`, `check-docs.mjs` and the docs build pass.

- - -
