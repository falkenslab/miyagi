# init and the menus with agent-kit's wizard

## Goal

Ask `init`'s questions and the start menus (run or chat, the run's mode, the practice-runner offer) with agent-kit's `runWizard()`, so they look like the chat, and drop the direct `@inquirer/prompts` dependency.

## Context

- `src/menu.ts` asks everything with `@inquirer/prompts` (`input`, `password`, `select`, `confirm`): a different look from the Ink chat that follows (inquirer's cyan, its own cursor), and one more dependency.
- agent-kit exports `runWizard(steps, options)`: select/input/password/confirm steps, defaults and messages computed from earlier answers, `when` to skip a step, `validate`, a masked password. Same theme as the chat (orange selection). Ctrl+C rejects with an `ExitPromptError` (so `isExitPromptError()` still works), and without a TTY it asks through @inquirer/prompts itself.
- `init` asks the course's URL and, only when that URL has no `?id=`, the course id; today it prints "→ URL: … · curso: …" between the two. Then user, password (only with a user), label (default from URL and id), description, tone, language, practice runner, instructions.md.

## Changes

- `promptInitWorkspace()` as one `runWizard()` with a title (`initHeading`):
  - the course id step with `when` (the URL has no id), the label's default from both;
  - password with `when` (a user was given);
  - the workspace is created after the wizard, then instructions.md if asked. The "→ URL" line goes (the label's default already shows host and id); `urlParsed` leaves the catalogs.
- `promptRunKind()`, `promptMode()`, `promptExploreNow()` and `offerPracticeRunner()` as one-step wizards.
- `@inquirer/prompts` out of `package.json` if nothing imports it any more.

## Acceptance

- `teacher-agent init` in a scratch directory asks the same questions, in the chosen language, with the kit's look; a full course URL skips the course id; no user skips the password; Ctrl+C at any step exits cleanly without creating anything.
- Bare `teacher-agent` and `run` without `--mode` ask with the same look. Piped (no TTY) still works.
- `verify` passes.
