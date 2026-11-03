# A teaching plan of eight units shows one topic

Issue: [#74](https://github.com/falkenslab/miyagi/issues/74)

## Problem

After writing the teaching plan of BD 1º DAM (8 units), Temas y actividades shows only UT2: the plan lists eight units, and seven of them have no topic page. Seen in the BD 1º DAM web suite (2026-11-03).

## Cause

`plugin/skills/teaching-plan` says each unit links to its topic page and that each topic page gets a "Teaching plan" section, but not that the pages that don't exist must be created; the model updated the only topic page the ingest had made (UT2) and linked none of the others.

## Solution

Tried, not enough:
- The skill says every unit has a topic page and the missing ones are created (`knowledge_create`, type `topic`, several with `also`); "writing or reviewing the plan, a unit without its page isn't done"; the coherence check starts with "every unit links to a topic page that exists"; the delivery names the pages created.
- Three runs in the suite after it, each in a new conversation: "Revisar con miyagi" (skill loaded, reported what's missing, no page created), the teacher's decisions in a message (plan edited without loading the skill), `/miyagi:teaching-plan` (skill loaded, four questions answered, plan and rubric updated, no page created). Still one topic page.

Next: don't depend on the model for it. Either the Temas view lists the plan's units (the units table of `course/teaching-plan`, each with its topic page when there is one and "Prepararlo con miyagi" when not), or the plan's `course` page type asks for the units as links that `knowledge_check` reports when they point nowhere.

## Verification

Open.
