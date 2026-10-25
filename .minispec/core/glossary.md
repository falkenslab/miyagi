# Glossary

## Workspace (aula)

A folder with one course's `config.json`, `.env`, `sources/`, `knowledge/`, `sessions/`, and `extensions/` when it has extensions of its own. Same shape as a moodle-agent teacher aula.

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

## Official curriculum (currículo oficial)

The state provision (BOE) and the region's that set what a module or subject teaches and assesses, kept verbatim and dated in `curriculum/` pages (`official-curriculum`), only with the teacher's yes.

## Assessment matrix

`course/assessment-matrix`: each evaluation criterion or learning outcome, the instruments that give evidence of it, their weights and where they live in the gradebook (`criterial-assessment`). About the course, never about students.

## Activity in progress

An activity going through `activity-lifecycle`: planned (`planning`), being built (`building`), tested hidden in the classroom (`hidden`) or just served (`served`), one item each in `course/drafts`. Each phase ends with the teacher's approval.

## Approval

The teacher's confirmation before each change students would see.

## Lab

A docker-lab lab (ADR-024): a folder with its `compose.yaml` and `lab.json` check that docker-mcp runs under its policy. It replaces the practice-runner subagent.

## Sandbox

The local Moodle from the `moodle-sandbox` repo, used for end-to-end tests.

## Extension

A Claude Code plugin installed through agent-kit (ADR-021): skills, commands and MCP servers, from the official repository `falkenslab/agent-extensions` or one the teacher added, for every subject (`~/.miyagi/extensions/`) or one (`<workspace>/extensions/`, only its lock).

## Capability

What an extension lets miyagi do (`provides`), named neutrally (`sandbox`, `lms-grading`); a skill that `requires:` one is offered only when an enabled extension provides it.
