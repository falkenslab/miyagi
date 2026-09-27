# ADR-002: Teacher role only

## Decision

teacher-agent only ever acts as a teacher. There is no student role: `agent.role: "student"` is rejected and a missing role is written as `"teacher"`.

## Motivation

moodle-agent mixed both roles in one agent. Splitting them keeps each prompt, skill set and set of permissions small; `student-agent` is the student.

## Consequences

Don't add student-side features or a role switch here; they belong in `student-agent`.
