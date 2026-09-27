# Stack

## Runtime

- Node.js ≥ 20, ESM.
- TypeScript (`tsc` to `dist/`), `tsx` in development.
- `@falkenslab/agent-kit` 0.6.0, from the tarball `https://github.com/falkenslab/teacher-agent/releases/download/v0.1.0/falkenslab-agent-kit-0.6.0.tgz` (see ADR-001).
- Claude Agent SDK (through agent-kit).
- `@playwright/mcp` — browser control of Moodle.
- `@inquirer/prompts` — CLI wizards.

## Tooling

- ESLint with `typescript-eslint`.
- No unit tests: the gate is the `verify` skill (typecheck, lint, build, rendered prompts, references).

## Infrastructure

- GitHub releases: `teacher-agent.tgz` (what users install) and the agent-kit tarball.
- `moodle-sandbox` (sibling repo) for end-to-end tests.
- Docker, only for the opt-in practice-runner.
