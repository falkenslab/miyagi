# Criterial assessment, diversity, reports and an exam bank

Issue: [#44](https://github.com/falkenslab/miyagi/issues/44)

## Goal

Give miyagi skills to assess by criteria, attend to diversity, write reports and keep an exam bank, as part of its teaching practice and not as separate extensions.

## Context

- They were proposed as skill-only extensions in agent-kit-extensions (falkenslab/agent-kit-extensions#15), but they're the teaching craft: what miyagi knows. Extensions bring what miyagi lacks (platforms, official data, file formats, tools); the judgement to teach and assess is miyagi's.
- Today `rubric-design` and `grading-rubric` grade by activity; nothing traces a mark to its evaluation criterion, and there's no skill for diversity, reports or a question bank across courses.
- They lean on extensions that are being built elsewhere: `normativa-es` (official criteria, falkenslab/agent-kit-extensions#3), `documentos` (`.docx` with a template, falkenslab/agent-kit-extensions#5), and a classroom extension (`moodle-teacher`, see `moodle-teacher-extension`).

## Changes

- **Criterial assessment:** grade by evaluation criteria, not only by activity, tracing each mark to its criterion. Official criteria from `normativa-es`; the classroom through the installed classroom extension.
- **Diversity:** universal design for learning and adaptations (access and curricular), with no student personal data.
- **Reports:** for families, tutoring and evaluation boards, as `.docx` with the school's template through `documentos`.
- **Exam bank:** questions and tests by criterion and level, reusable across courses.
- Skills ask for capabilities, not specific extensions (`requires`, falkenslab/agent-kit#62): e.g. `curriculum-es`, `documents-write`, `lms-grading`.

- - -

## Acceptance

- Each skill works without its complementing extension and says what's missing (e.g. without `normativa-es` it uses the criteria the teacher gives).
- None stores student data.

- - -
