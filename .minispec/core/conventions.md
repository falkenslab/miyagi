# Conventions

- Code, prompts, skills, CLAUDE.md and `.minispec/` are in English; commit messages and test reports in Spanish.
- Commits follow Conventional Commits, one logical change each (see the `commit` skill). The repo is public.
- Documentation Markdown (`README.md`, `docs/`, `tests/`, `CLAUDE.md`, `.minispec/`): one line per paragraph and list item, no horizontal rules between sections. The agent's own Markdown — `plugin/` (skills, commands), `prompts/` and `.claude/skills/` — is not documentation: leave its formatting as it is and don't reflow it.
- Import only from the package root `@falkenslab/agent-kit`, never deep paths.
- Resolve `plugin/` and `prompts/` relative to the source file (`path.join(__dirname, "..", ...)`), so it also works from `dist/`.
- Run the CLI with `--dir` pointing at a workspace outside this repo.
- The knowledge base layout is named in `course-knowledge.md`, `explore.md` and every skill that writes there: change it in all of them at once.
- After renaming or merging skills, update `README.md` (skills table) and `.minispec/core/architecture.md`.
- Every end-to-end test leaves its report in `tests/` and its lessons in `plugin/skills/` or `prompts/` (see ADR-006).
- Run the `verify` skill before committing any change under `src/`, `prompts/` or `plugin/`.
