# Reports and an exam bank

Issue: [#44](https://github.com/falkenslab/miyagi/issues/44)

## Goal

Give miyagi skills to write reports and keep an exam bank, as part of its teaching practice and not as separate extensions.

## Context

- They were proposed as skill-only extensions in agent-extensions (falkenslab/agent-kit-extensions#15), but they're the teaching craft: what miyagi knows. Extensions bring what miyagi lacks (platforms, official data, file formats, tools); the judgement to teach and assess is miyagi's.
- Done: `criterial-assessment` (the assessment matrix, `course/assessment-matrix`, each mark traced to its criterion, the official criteria from the `curriculum/` pages kept from the teacher's norms) and `diversity` (UDL, access variants and reinforcement or extension named by what they change, no individual adaptations nor student data, ADR-017).
- What's left leans on what isn't there yet: `documentos` (`.docx` with a template, falkenslab/agent-kit-extensions#5) isn't in agent-extensions, and an exam bank across courses needs the neutral question files of `neutral-materials`.

## Changes

- **Reports:** about the course, not about students (ADR-017 leaves families, tutoring and evaluation sessions out): results by criterion for the department, the module's annual report, as `.docx` with the school's template through `documentos`, from the assessment matrix and class-level grades, without storing them.
- **Exam bank:** questions and tests by criterion and level, reusable across courses, on `neutral-materials`' `.questions.md`.
- Skills ask for capabilities, not specific extensions (`requires`): e.g. `documents-write`.

- - -

## Acceptance

- Each skill works without its complementing extension and says what's missing.
- None stores student data.

- - -
