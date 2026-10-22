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

## RA, CE, módulo profesional

In FP: a *módulo profesional* is a vocational module of a title; its *resultados de aprendizaje* (RA1, RA2…) are the learning outcomes, each assessed by *criterios de evaluación* (CE1a, CE1b…). Not the same as the plan's own criteria `CE…` when there's no official curriculum.

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
