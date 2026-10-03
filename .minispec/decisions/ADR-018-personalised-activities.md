# ADR-018: Personalised activities without per-student data

## Decision

Activities are personalised per group, never per student. Interests come from an anonymous, voluntary survey in the classroom, read only in aggregate, with no category reported under 3 answers. The same activity gets 2-4 equivalent variants (same criteria, rubric, points and question types; only the context changes) plus a neutral one. Students reach a variant by choosing it ("choose your context", the default) or through their group's restriction, decided by the teacher.

## Motivation

Contexts students care about help motivation, but profiling students would break ADR-005 and ADR-017. Group-level interests are enough to choose contexts, and letting students choose respects their autonomy without miyagi deciding for anyone. Rejected: per-student profiles, assigning variants to named students, creating platform groups for it (changing group membership is enrolment).

## Consequences

- The survey validator requires the purpose/anonymity header and refuses sensitive or identifying questions; `student-impact-review` checks it too.
- Only `knowledge/groups/<group>/interests.md` is kept: date, number of answers, themes with counts of 3 or more; it expires with the school year.
- Variant equivalence is checked by code (structure) and by `pedagogy-reviewer` (difficulty).
- Special educational needs only when the teacher states them, as material, without names.
- The guide recommends checking with the school whether families must be told before a survey, with a model text; miyagi gives no legal advice.
- Extends ADR-005. Delivered by the feature `personalised-activities`.
