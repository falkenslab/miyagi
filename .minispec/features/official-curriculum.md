# Official curriculum

Issue: [#31](https://github.com/falkenslab/miyagi/issues/31)

## Goal

Find the official curriculum of a subject (state and regional) and keep it, quoted and dated, so the teaching plan can follow it.

## Context

- `teaching-plan` keeps the plan generic and doesn't look for regulations unless the teacher gives or asks for one (`plugin/skills/teaching-plan/SKILL.md:10-11`, from the HTML5/CSS3 simulation, bad5087). That rule stays: miyagi offers the curriculum once, in `chat`, and searches only if the teacher says yes.
- The `researcher` subagent has WebSearch/WebFetch; the drafts toolbox downloads files; `save_to_sources` keeps originals.
- Stored per workspace, no shared cache (decided).

## Changes

- Skill `official-curriculum` and command `/curriculum`:
  - asks stage (FP básica/media/superior, specialisation courses, ESO, Bachillerato), title or subject and module, region, school year; what `sources/` says isn't asked;
  - searches state law (BOE: the title's Real Decreto or minimum teachings, LO 3/2022 for FP) and the regional order or decree (BOC, BOJA, DOGC, BOCM, DOGV…), consolidated version first, checking it's in force and not replaced; the BOE open-data API to be confirmed at implementation;
  - downloads PDFs to `drafts/`, keeps originals in `sources/curriculum/`.
- A `curriculum` page type (`src/knowledgeTypes.ts`, folder `curriculum/`), written with `knowledge_create`/`knowledge_edit`: `curriculum/provisions` (each provision: type, number, date, gazette, URL, in force, date consulted; state vs regional) and `curriculum/<module>` (learning outcomes and criteria verbatim with official numbering RA1, CE1a…; ESO/Bachillerato: specific competences, criteria, basic knowledge; hours; basic contents). Verbatim and summary always distinguished.
- Never invents or completes a criterion, mixes regions, or assumes a provision is in force; if not found, says so and logs the search.
- `teaching-plan`: "don't go looking" becomes "offer it once; use `official-curriculum` if the teacher agrees"; with `curriculum/` pages, objectives and criteria use official RA/CE numbering and grading is weighted by RA.
- `check-knowledge.mjs`: curriculum pages have URL, provision date and date consulted (the `url`, `date` and `consulted` fields); the date consulted comes from `current_time`.
- Glossary: RA, CE (FP sense), módulo profesional.

## Acceptance

- In a workspace without a classroom, the plan of a real FP module of a given region cites its provisions; RA and CE match the gazette (checked by hand), URLs resolve; report in `tests/`.
- Without the teacher's yes, no regulation is searched.
- `verify`, `smoke-ingest` and `check-docs.mjs` pass.
