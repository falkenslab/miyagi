# Glossary

## Workspace (aula)

A folder with one course's `config.json`, `.env`, `sources/`, `knowledge/`, `sessions/` and optionally `practice/`. Same shape as a moodle-agent teacher aula.

## Sources

`sources/`: the teacher's original documents. Read-only for the agent.

## Knowledge base

`knowledge/`: the agent's pages about the course, with `index.md` and `log.md`. The only folder it writes to (besides `practice/`).

## Teaching plan (programación didáctica)

`knowledge/teaching-plan.md`: objectives `O…`, assessment criteria `CE…`, units, methodology and grading. The teacher's, or the agent's draft with proposals marked.

## Alignment

Checking that the Moodle course matches the teaching plan (`course-alignment`).

## Session kind

`run`, `chat`, `ingest` or `explore`.

## Mode

`interactive`, `guided` or `autonomous`: how much the agent asks before acting.

## Approval

The teacher's confirmation before each change students would see.

## Practice runner

Opt-in subagent that runs hands-on practices in Docker inside `practice/`.

## Sandbox

The local Moodle from the `moodle-sandbox` repo, used for end-to-end tests.
