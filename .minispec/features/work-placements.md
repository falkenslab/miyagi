# Work placements: finding, contacting and following companies

Issue: [#112](https://github.com/falkenslab/miyagi/issues/112)

## Goal

A miyagi skill on the craft of work placements (dual training, internships) that uses the `work-placements` extension's capabilities when they are there.

## Context

- Finding companies for placements, contacting them and following them is a large part of a vocational teacher's work, and miyagi doesn't help with it.
- agent-extensions has the `work-placements` extension (0.1.1, hidden from its site, installable by name). It brings the tools and how to use them, not the craft:
  - capabilities `placement-prospecting` (`search_companies`, `read_company_site`, `add_company`, `import_companies`…);
  - `placement-outreach` (`draft_emails`, `log_contact`);
  - `placement-tracking` (`pipeline_summary`, `update_company`, `export_companies`);
  - skills `find-companies`, `company-outreach`, `placement-tracker`, `linkedin-and-sites`, and a `company-researcher` subagent.
- It also brings two page buttons: `find-companies` and `placement-tracker`.
- By agent-extensions' rules the craft belongs to the agent: like moodle-teacher, the extension says how the tools work and miyagi says what a good teacher does (ADR-021).
- Undecided:
  - a new skill, or part of an existing one (`regulations`, `teaching-plan`);
  - where the teacher's templates live (letter, dossier, agreement): `sources/` or `drafts/`;
  - whether the extension's two buttons are enough or miyagi wants its own.

## Changes

- A neutral skill in `plugin/skills/` (no tool or extension names, `check-neutral-skills.mjs`) that names the capabilities and says, when they are missing, what the teacher can do by hand:
  - **where to start:** companies that hosted students before (the record), former students, intermediaries (chamber of commerce, business associations, clusters, the town's local development agent) and the administration's dual-training service where there is one;
  - **which company fits the programme:** activity, size, distance and transport, and whether it can name a tutor;
  - **the arguments:** recruiting and training talent to its needs, choosing future employees; and answers to what holds small firms back, paperwork and tutoring;
  - **the prospecting calendar:** when to search and contact so the agreement is signed before students join, a follow-up a few days later, a call or visit after the email;
  - **the messages:** the introduction email (school, programme, dates, each tutor's role, a meeting proposal), the call script and the school's dossier, always from the teacher's template and regulations, never inventing a region's rules (ADR-025);
  - **keeping the relationship:** thanks at the end of the year, asking how it went, counting on the company again next year.
- Every email stays a draft the teacher sends; no named contact person goes into the knowledge base.
- Docs: the skill on the site's skills pages, in Spanish and English.

## Acceptance

- With the extension installed, in a sandbox-free scratch workspace: "busca empresas de informática en La Laguna que no tenga ya" searches, marks the known ones and adds only what the teacher picks; a draft per company comes from the teacher's letter in `sources/`; "¿a quién llamo hoy?" answers from the record.
- Without the extension, the skill still advises and says which extension would do the searching.
- `verify` passes (including `check-neutral-skills.mjs` and `check-references.mjs`), and a report in `tests/`.
