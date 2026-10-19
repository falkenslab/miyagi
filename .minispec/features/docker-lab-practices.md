# Test practices with docker-lab

Issue: [#45](https://github.com/falkenslab/miyagi/issues/45)

## Goal

Test a practice (a statement, its solution, a student's submission) with the `docker-lab@falkenslab` extension instead of the `practice-runner` subagent, so miyagi has no shell at all.

## Context

- Today `practice-testing` relies on `practice-runner` (`src/agent.ts`), off by default (`agent.allowPracticeRunner`), with Bash for Docker inside `practice/` and its limits only in a prompt (ADR-003).
- docker-lab 0.1.x is in agent-extensions with docker-mcp 0.1.0 and two neutral capabilities: `sandbox` (skills `try-in-a-lab`, `build-a-lab`: a folder with `compose.yaml` and optionally `lab.json` with its check) and `run-and-verify` (skill `verify-by-running`: a verdict with the commands, exit codes and literal output; never a mark).
- docker-mcp enforces the policy when a lab starts (no internet unless allowed, no mount outside the lab's folder, never the Docker socket, CPU, memory and process limits, no new privileges) and refuses a lab that breaks it.
- `run_container` can't limit or isolate a single container yet (falkenslab/docker-mcp#6): everything isolated goes through a lab.
- Needs `extensions` (the kit's extensions in miyagi).

## Changes

- `practice-testing` `requires:` `sandbox` and `run-and-verify`, and delegates to the extension's skills: write the lab in `practice/<slug>/`, `lab_up`, `lab_exec` or `lab_check`, `lab_down`.
- Recommend installing it in `lab` mode (only labs exposed); the docs say when `full` is needed.
- Remove `practice-runner`, its prompt and `agent.allowPracticeRunner`; ADR-003 superseded by an ADR: miyagi has no shell, running code is an extension's, with its policy enforced by its server.
- Docs: "Prácticas con Docker" rewritten around the extension; the SQL use case's MariaDB unit re-checked.

- - -

## Acceptance

- Without docker-lab, `practice-testing` isn't offered and miyagi says what's missing.
- With it, the MariaDB practice of the use case is checked in a lab: the verdict quotes the commands and their output; a lab asking for the Docker socket is refused.
- No `Bash` anywhere in a session's tools; `verify` passes; report in `tests/`.

- - -
