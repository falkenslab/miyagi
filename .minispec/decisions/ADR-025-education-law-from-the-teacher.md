# ADR-025: No country's education law is built in; the teacher brings it

## Decision

- miyagi's skills and prompts never name a country's education framework: its official curriculum and gazettes, the documents its law asks for, its codes. Nor is there an extension for it.
- The norms that apply to a teacher (their country's, their region's, their title's, their school's template) come as sources of their own: they leave them in `sources/`, or ask miyagi to find them in official sources, and miyagi keeps them there. Interpreting them is miyagi's craft, like planning or assessing: `teaching-plan` keeps what they set verbatim in `curriculum/` pages, checked in force and dated, and follows the documents they ask for; `criterial-assessment` and the rest build on those pages.
- `check-neutral-skills.mjs` fails on a country's framework in `plugin/`, as it does on a platform.

## Motivation

- A teacher in another country, or one whose region doesn't follow the usual model, shouldn't see a single line about another country's law, and nobody can keep one extension per country, stage and region up to date. What changes from one teacher to another is the norm, which is a document; reading a document well is what miyagi already does with the teacher's sources.
- agent-extensions decided the same (its `CLAUDE.md`, b94efa0): no extension for education law, curricula or school calendars; its `normativa-es` plan (falkenslab/agent-extensions#3) closed for it.
- Rejected: Spain's frameworks as miyagi skills (#31, #32 had done so: the official-curriculum search, LOMLOE learning situations, the FP intermodular project), a country built into a generic tool; a `normativa-es` extension, tried and dropped before it was published.

## Consequences

- Supersedes the `official-curriculum` skill and `/miyagi:curriculum` of #31 and the skills of #32. What they did well stays in `teaching-plan` without a country: only on the teacher's request, official sources, the version in force, verbatim with the official numbering, the original kept in `sources/`.
- The `curriculum` page type stays, for any country's norms.
- A document a norm asks for (a learning situation, a project shared by several modules) is designed with the generic skills (`unit-building`, `teaching-methodologies`, `rubric-design`) and the structure the norm sets.
