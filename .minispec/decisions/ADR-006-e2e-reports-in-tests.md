# ADR-006: End-to-end tests leave a report and their lessons

## Decision

Every end-to-end test of the agent against a Moodle leaves its report in `tests/<YYYY-MM-DDTHH-MM>-<slug>/`, and every lesson it teaches goes back into `plugin/skills/` or `prompts/`.

## Motivation

There are no unit tests, and typecheck can't catch a prompt the model stops following. Real runs are the only proof, and a lesson that stays in a report is lost for the agent.

## Consequences

Use `sandbox-e2e`, `simulate-course` and `test-report`; `tests/CLAUDE.md` defines the layout and what must never be committed.
