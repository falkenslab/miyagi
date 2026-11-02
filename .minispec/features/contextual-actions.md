# miyagi's commands as actions in the interface

Issue: [#67](https://github.com/falkenslab/miyagi/issues/67)

## Goal

Every command of miyagi (and of its extensions) can be launched from the page without knowing it exists: from a catalog of actions, and from the item it applies to (a topic, a material, a source, a page, selected text), through its ⋯ menu or a right click.

## Context

- 14 commands in `plugin/commands/` (align, audit, build-course, build-unit, exam, forum, grade, map, orient, progress, publish, quiz, research, teaching-plan), 8 of them taking `$ARGUMENTS`; the knowledge plugin's (`ingest`, `lint`); extensions' (moodle-teacher's `week`, `to-grade`…). `src/catalog.ts` lists them.
- The page offers them poorly:
  - five quick actions hard-coded in `gui/src/components/Composer.tsx:46`;
  - "miyagi's commands" in ＋ only types `/`;
  - a few buttons in the course views, some sending a command (`/miyagi:build-unit <tema>`), others free text (publish, review the plan, show, resume: `gui/src/i18n/course.ts:115-119`);
  - "Prepare" on a topic only shows when it has no activities.
- Commands carry only `description`: the page can't tell their name in the teacher's language, an icon, whether they need a classroom, nor what item they take.
- Materials lists `drafts/`, but `/publish` publishes from `materials/`, and the Publish button sends a `drafts/` file: decide what Materials shows before hanging actions on it.
- Seen as a teacher in the desktop app (2026-11-02).

## Changes

- **Prototype first**: an artifact with Topics, Materials, Sources and the plan with their ⋯ menus, the right-click menu, the phone's long press as a sheet, the selection menu and the catalog. Approved before code.
- **Command metadata** (frontmatter, read by `catalog.ts` and served by the host):
  - `label` per language (es, en, fr, de) and `icon`, `group` (day to day, create, plan);
  - `needs-classroom`;
  - `applies-to` (topic, activity, material, source, page, quiz, text) and `argument-hint`, the question it asks when it needs a value.
  - Extensions' commands without it: in the catalog only, with their description.
- **Catalog of actions**: in ＋, instead of typing `/`; grouped, the teacher's language, disabled with "link your classroom" when it needs one. Replaces the hard-coded quick actions; the empty conversation's suggestions come from it.
- **Actions on items** (`Course.tsx`, the knowledge and classroom views):
  - a ⋯ button on each item opens its menu; right click and the menu key (`Shift+F10`) open the same; long press on a phone, as a bottom sheet;
  - selected text in the chat or in a knowledge page: a small floating menu (research this, questions about this);
  - placement: build-unit, quiz, research, align on a topic; exam on a quiz; publish on a material and an oven item; quiz from a source; teaching-plan and align on the plan (and per section); build-course on an empty subject (a short form); grade, forum, week, to-grade in Today; orient, progress, audit, map in Your classroom (map opens its page, no agent turn).
- **What is sent**: the command with its value (`/miyagi:quiz Tema 2: Hardware`), through the host's `send`: transcript, approvals and the register unchanged; no new power for the host. The free-text buttons become their commands.
- **Materials**: `drafts/` and `materials/` decided (likely both, each named), with publish on each.
- **Docs**: `avanzado/navegador.md` (both languages): the catalog and the item menus; `check-docs.mjs` still sees every command.
- `check-page.mjs`: a topic's ⋯ menu lists its actions and sends the right command; right click opens it; without a classroom the classroom's actions are disabled; no horizontal scroll and 44 px targets in the menus.

## Acceptance

- Every command of miyagi is reachable from the page without typing `/`, in the teacher's language, from the catalog and from the items it applies to.
- From a topic, "Make a quiz" sends `/miyagi:quiz <the topic>` and the turn goes as if typed, approvals included.
- Right click, the ⋯ button, the menu key and a long press on a phone open the same menu.
- No free-text prompt left behind the views' buttons; the quick actions come from the catalog.
- `verify` and `check-page.mjs` pass at 360–1440 px in both themes.
