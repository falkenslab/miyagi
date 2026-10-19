# Glossary

## Workspace (aula)

A folder with one course's `config.json`, `.env`, `sources/`, `knowledge/`, `sessions/`, optionally `practice/`, and `extensions/` when it has extensions of its own. Same shape as a moodle-agent teacher aula.

## Sources

`sources/`: the teacher's original documents. Read-only for the agent.

## Knowledge base

`knowledge/`: the agent's pages about the course (`course/`, `topic/`, `activity/` and the kit's summaries, concepts, entities and syntheses), reached only through agent-kit's `knowledge_*` tools; the kit keeps its `index.md` and `log.md`.

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

## Extension

A Claude Code plugin installed through agent-kit (ADR-021): skills, commands and MCP servers, from the official repository `falkenslab/agent-extensions` or one the teacher added, for every subject (`~/.miyagi/extensions/`) or one (`<workspace>/extensions/`, only its lock).

## Capability

What an extension lets miyagi do (`provides`), named neutrally (`sandbox`, `lms-grading`); a skill that `requires:` one is offered only when an enabled extension provides it.
