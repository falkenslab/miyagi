# ADR-005: No pages about individual students

## Decision

The knowledge base holds no pages about individual students: progress and forum notes are class-level patterns.

## Motivation

Student data is personal data. The knowledge base persists across sessions, is reused in prompts and may be shared with the course; it must not become a record of individual students.

## Consequences

Skills that write progress, forum or grading notes aggregate them. `smoke-ingest` (`check-knowledge.mjs --names`) and `student-impact-review` check it.
