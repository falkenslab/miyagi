# teacher-agent becomes miyagi

Issue: [#19](https://github.com/falkenslab/teacher-agent/issues/19)

## Goal

Rename the project, the command and everything the teacher sees from "teacher-agent" to "miyagi", with a new logo (a sensei's face) and a new palette (hinomaru), without breaking existing installs, workspaces or links.

## Context

- The name appears in 70 files: the CLI's messages in four languages, the README, the CheatSheet, docs/skills.md, the site, prompts, skills, `.minispec/`, the project's own skills (release, verify...) and `package.json` (`name`, `bin`).
- Users install with `npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz` and run `teacher-agent`. Their global config is `~/.teacher-agent/config.json` (Claude token, defaults); their workspaces don't carry the name, except `agent.role: "teacher"` (unrelated) and custom commands that call built-in skills as `/teacher-agent:<skill>` (the plugin's name).
- The plugin is named `teacher-agent` (`plugin/.claude-plugin/plugin.json`): its skills and commands are namespaced `teacher-agent:*`, and prompts and skills reference them that way.
- The site is at `falkenslab.github.io/teacher-agent/`; the repo at `github.com/falkenslab/teacher-agent`. GitHub redirects a renamed repo's URLs (clone, web, releases), but a release asset keeps the file name it was uploaded with.
- Name checks (2026-09-30): `falkenslab/miyagi` is free; `miyagi` on npm was unpublished in 2020 and `@falkenslab/miyagi` is free (users don't install from npm anyway). Other projects with the name exist (Azure-Samples/miyagi, 751★), none an agent for teachers.
- Design decided with the teacher (2026-09-30, https://claude.ai/artifact/AfrsggGSiWEJEnXWFqeX6E): face 3, "squinting", 5 lines × 9 columns, with the hinomaru palette:
  ```
    .-----.     hair     #b9bcc2 (canas)
  ~=[==o==]     band     #f3f3f0 (washi), sun #bc002d (terminal: #e0303f)
    | = = |     face     #e2b48a (piel)
    |/~~~\|     beard    #cfd1d6
     \_Y_/
  ```
  Page/brand colours: sumi `#18181b`, washi `#f3f3f0`, sun `#bc002d`, skin `#e2b48a`, grey hair `#b9bcc2`. It evokes the character without being a portrait; the name is a word, and the logo stays a caricature in text.

## Changes

- **Name and command**: `package.json` `name: "miyagi"`, `bin` with `miyagi` and, for a transition, `teacher-agent` too (same entry, a one-line notice that the command is now `miyagi`). Every user-facing text in `src/messages/` (4 languages), the chat header title (`miyagi v…`), the help.
- **Global config**: `~/.miyagi/config.json`; if it's missing and `~/.teacher-agent/config.json` exists, use it and copy it over once (the token too), saying so.
- **Plugin**: named `miyagi`, so skills and commands are `miyagi:*`; update every reference in prompts, skills and `check-references.mjs`. Workspace custom commands still calling `/teacher-agent:*`: the skill that lists commands warns about them (or they keep working through an alias if the SDK allows two names).
- **Logo and colours**: `LOGO` in `src/agent.ts` (the face above), `src/theme.ts` with the hinomaru palette (tool bullets, spinner, selection, panel border, from sumi/washi/sun), `docs/assets/miyagi.svg` (the face, same technique as the owl), the README's header, the site (`site/`, its palette, og images), the favicon.
- **Docs**: README, CheatSheet, docs/skills.md, CLAUDE.md, `.minispec/` (project, architecture, stack, glossary, ADRs where the name is the subject), the project's skills (release: the asset becomes `miyagi.tgz`).
- **Repo, site and releases**: rename the GitHub repo to `falkenslab/miyagi` (asked to the teacher before doing it); the site moves to `falkenslab.github.io/miyagi/`; the release carries `miyagi.tgz` and, for a few releases, the same file as `teacher-agent.tgz`, so the old install command keeps working. The README says how to switch (`npm uninstall -g teacher-agent && npm install -g …/miyagi.tgz`).
- `check-prompts.mjs` flags "teacher-agent" left in a rendered prompt (like the moodle-agent leftovers).

## Acceptance

- A fresh install from the new URL runs `miyagi`, shows the face and the hinomaru colours; `miyagi --help` and the chat say "miyagi" in the four languages.
- An existing install upgraded with the old command (`…/teacher-agent.tgz`) works, `teacher-agent` still starts (with the notice), and a user's `~/.teacher-agent` token is picked up without logging in again.
- An existing workspace opens as before; its knowledge base and drafts are untouched.
- `git grep -i teacher-agent` finds only the compatibility paths, the changelog/release notes and the test reports (which aren't rewritten).
- The site answers at `falkenslab.github.io/miyagi/`, and the old repo URL redirects.
- `verify` passes, and a chat against the sandbox shows the new header.
