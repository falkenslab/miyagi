# ADR-014: Extensions, connectors and capabilities

## Decision

Everything platform-specific lives in **extensions**: an Agent SDK plugin folder (skills, commands, agents) plus a `miyagi.json` manifest. A **connector** is an extension that brings a classroom type and implements named **capabilities** (`structure`, `publish-quiz`, `submissions`, `staged-publishing`, `restrictions`…). The core never names a platform: it asks the classroom's capability. Moodle and Google Classroom are built-in connectors; the rest (TriAcademy, YouTube, voice, community templates) are installed extensions, loaded without reinstalling miyagi.

## Motivation

The core knows how to teach (plan, units, questions, rubrics); only publishing and reading a classroom differ per platform. Almost every Moodle skill mixes both halves. Fixed capability names let the core say "use `submissions`" and let a connector declare `full`, `partial` (with what's missing) or absent, so the agent explains a gap instead of improvising. Rejected: one agent per platform (duplicates the pedagogy), plugins with only skills (no place for a connector's code, secrets, gates or groups).

## Consequences

- The core never imports an extension's code (`src/extensions/<name>/`) nor names a platform in `plugin/` or `prompts/system/`; built-in extensions are loaded by the same loader, by the entry in their manifest, like installed ones, and only add what they register (gate predicates, upload validators, prompt sections, capabilities). `check-prompts.mjs` enforces it.
- Built-in connectors may run in-process TypeScript (MCP servers, publish predicates, upload validators); third-party extensions never do (ADR-016).
- A capability's contract is what goes in, what it must achieve and what it returns, through the core's tools (`record_publication`, `record_structure`…), so the publication record is the same whatever the platform.
- Never a capability: enrolling, creating groups or changing who is in one, private messages to a student, attendance, deleting.
- `miyagi.json` has a published JSON Schema and a `miyagiApi` version; the contract is that schema plus the capability contracts, not shared code. No runtime library for authors until third-party connectors repeat the same code; then only types and helpers (`@falkenslab/miyagi-extension-sdk`).
- One repo per extension, falkenslab's official ones included; the catalog repo is an index that pins each version's commit and tree hash, with no code.
- `miyagi ext test` runs a fixed conformance scenario per capability against a sandbox classroom.
- Amends ADR-008 (the publish gate is the core's, fed by each connector's predicates) and ADR-009 (testing hidden before showing is the `staged-publishing` capability; without it the teacher is told before publishing).
- Delivered by the features `extensions` (Moodle extracted) and `classroom-connector`.
- Partly superseded by ADR-020: the package is an extension with an `extension.json` manifest that declares the capabilities it provides (these classroom operations among them); the official extensions share one repository.
