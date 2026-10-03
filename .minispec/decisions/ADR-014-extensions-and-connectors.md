# ADR-014: Extensions, connectors and capabilities

## Decision

Everything platform-specific lives in **extensions**: an Agent SDK plugin folder (skills, commands, agents) plus a `miyagi.json` manifest. A **connector** is an extension that brings a classroom type and implements named **capabilities** (`structure`, `publish-quiz`, `submissions`, `staged-publishing`, `restrictions`…). The core never names a platform: it asks the classroom's capability. Moodle and Google Classroom are built-in connectors; the rest (TriAcademy, YouTube, voice, community templates) are installed extensions, loaded without reinstalling miyagi.

## Motivation

The core knows how to teach (plan, units, questions, rubrics); only publishing and reading a classroom differ per platform. Almost every Moodle skill mixes both halves. Fixed capability names let the core say "use `submissions`" and let a connector declare `full`, `partial` (with what's missing) or absent, so the agent explains a gap instead of improvising. Rejected: one agent per platform (duplicates the pedagogy), plugins with only skills (no place for a connector's code, secrets, gates or groups).

## Consequences

- Built-in connectors may run in-process TypeScript (MCP servers, publish predicates, upload validators); third-party extensions never do (ADR-016).
- A capability's contract is what goes in, what it must achieve and what it returns, through the core's tools (`record_publication`, `record_structure`…), so the publication record is the same whatever the platform.
- Never a capability: enrolling, creating groups or changing who is in one, private messages to a student, attendance, deleting.
- `miyagi ext test` runs a fixed conformance scenario per capability against a sandbox classroom.
- Delivered by the features `extensions` (Moodle extracted) and `classroom-connector`.
