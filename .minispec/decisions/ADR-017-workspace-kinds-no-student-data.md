# ADR-017: Workspace kinds; personal student data out of scope

## Decision

A workspace has a kind: `materia` (a subject, the only one at first), later `departamento` (annual report, minutes, projects) and `oposicion` (plan and units for the exam board). There is no `tutoria`. miyagi handles student data only where it already does: inside a classroom, through its connector (grading, the forum, progress), and never keeps it.

## Motivation

Beyond the classroom, the tasks that fit what the core already does are planning ones: learning situations, the intermodular project, grading schemes, paper exams, reports, projects, competitive exams. Tutoring, families, individual adaptations, evaluation sessions or marking scanned exams would need personal and sometimes sensitive data (minors, health, special needs) kept across sessions; that's a different product and a different responsibility (GDPR). Rejected: an ephemeral student-data area, an encrypted `students/` folder.

## Consequences

- Out: tutoring, communications to families, individual curricular adaptations, evaluation sessions, marking outside the classroom, academic-management connectors (Séneca, Pincel Ekade, Raíces, ITACA…).
- In: universal design for learning and general diversity measures, as activity design.
- The grading "calculator" is the scheme (weights CE → RA → module, checked and set up in the classroom's gradebook or a spreadsheet template), never per-student grades.
- Paper exams are material (versions, answer key); they aren't marked outside the classroom.
- The public roadmap lists this under "what miyagi won't do".
