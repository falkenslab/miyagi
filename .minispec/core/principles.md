# Engineering principles

Consult **before** writing code.

- Solve first, optimize later; readable code over clever code.
- Avoid premature abstractions; propose a simpler alternative before adding complexity.
- Preserve existing behavior; don't refactor outside the task's scope.
- Document decisions, not implementation.
- The teacher approves every change students would see; never delete or change enrolments.
- In guided, that approval is enforced by a hook, not only asked for in the prompt (ADR-008).
- Only the teacher role exists (ADR-002).
- Secrets never reach the model; no RCE-equivalent browser tools (ADR-004).
- Bash only for the opt-in, Docker-only practice-runner, never for the main agent (ADR-003).
- No pages about individual students in the knowledge base (ADR-005).
- agent-kit comes from a release tarball, not npm or git (ADR-001).
- Prompt and skill changes are proven against a real Moodle, and the report stays in `tests/` (ADR-006).
