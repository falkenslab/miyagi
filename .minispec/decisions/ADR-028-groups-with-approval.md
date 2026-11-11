# ADR-028: Groups and groupings, with the teacher's approval

## Decision

miyagi may create and rename groups and groupings, put the course's enrolled students in them and give a grouping to an activity, each change after the teacher's approval that lists every group with its members by alias. Deleting a group or a grouping, enrolling, unenrolling and roles stay out of its reach.

## Motivation

- ADR-021 put groups and their members with enrolments among moodle-mcp's tools miyagi never uses. In the university simulation (`tests/2026-11-11T15-30-simulacion-uni-so`) that left pair practices that couldn't be submitted, peer-assessment workshops per lab that couldn't run and a P1 hidden again until the teacher made the groups by hand. Making a course's groups is ordinary teaching work, not the site's.
- Group membership changes what a student sees and with whom they submit, so it's a change students would see: the principle "the teacher approves every change students would see" covers it, as it covers a grade.
- Enrolment is different: who is in the course is the institution's. So are roles. Deleting a group loses its submissions' grouping and can't be undone from miyagi.
- Rejected: only empty groups (the teacher still fills them by hand, the slow part); leaving it to the teacher (what the simulation showed doesn't work for a course built by miyagi).

## Consequences

- `create_group`, `update_group`, `set_group_members`, `auto_create_groups`, `import_groups`, `create_grouping` and `set_grouping_groups` leave `NEVER_MOODLE_TOOLS` (`src/agent.ts`); `delete_group`, `delete_grouping`, enrolments, roles, messages and course copies stay there.
- The prompts' rule says groups need the teacher's approval listing each group and its members by alias, and that group membership is never written to the knowledge base (no per-student record, ADR-005).
- Supersedes ADR-021 on groups; the rest of ADR-021 stands. `principles.md` keeps "never change enrolments": groups aren't enrolments.
