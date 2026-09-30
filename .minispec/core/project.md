# Project

## What

`miyagi` is a CLI agent that manages a Moodle course as its teacher, driving a real browser through Playwright MCP. It is built on `@falkenslab/agent-kit`, with the same structure as its sibling `student-agent`. It was called teacher-agent until v0.9.0: the old command, global config (`~/.teacher-agent`) and install URL still work through compatibility paths (`src/globalConfig.ts`, `.claude/skills/release/compat/`) until v1.0.0.

## What it does

- Builds a course from a description or a teaching plan: units, resources, assignments, activities, quizzes, rubrics.
- Writes and checks the teaching plan (programación didáctica) and keeps the course aligned with it.
- Grades submissions with rubrics and writes feedback.
- Answers and moderates the forum.
- Monitors class progress and audits the course.
- Keeps a knowledge base of the course (`knowledge/`) built from the teacher's documents (`sources/`) and its own work.
- Optionally tests hands-on practices in Docker (practice-runner).

## For whom

- Teachers (mainly Spanish vocational training, FP) who run a Moodle course and want an assistant that works in it for them.
- Every change students would see is approved by the teacher first.

## Goal

Take the repetitive course work off the teacher without taking away their control over what students see.

## Origin

The domain layer (skills, commands, prompts) comes from the teacher role of `moodle-agent`, where student and teacher used to live in one agent. Only the adaptation to agent-kit's knowledge base changed it (`context/` → `sources/`, `knowledge/README.md` → `index.md`/`log.md`, `save_to_knowledge` → `save_to_sources`). Session wiring, hooks, human-in-the-loop tools, the chat TUI and Claude auth come from agent-kit.
