# Stack

## Runtime

- Node.js ≥ 20, ESM.
- TypeScript (`tsc` to `dist/`), `tsx` in development.
- `@falkenslab/agent-kit` 0.13.1, from npm at that exact version (see ADR-010).
- Claude Agent SDK (through agent-kit).
- `@playwright/mcp` — browser control of Moodle.
- agent-kit's `runWizard()` — the `init` wizard and the start menus (Ink, the chat's look; @inquirer/prompts only through the kit, without a TTY).

## Tooling

- ESLint with `typescript-eslint`.
- No unit tests: the gate is the `verify` skill (typecheck, lint, build, rendered prompts, references, publish gate), also run by GitHub Actions on every push and pull request (`.github/workflows/verify.yml`, Node 20 and 22).

## Infrastructure

- GitHub Pages: the promotional site, `site/` as is (HTML, CSS, a small script, Atkinson Hyperlegible fonts served from the site).
- GitHub releases: `miyagi.tgz` (what users install). Releases up to v0.4.0 also carry the agent-kit tarball their versions depend on.
- `moodle-sandbox` (sibling repo) for end-to-end tests.
- Docker, only for the opt-in practice-runner.
