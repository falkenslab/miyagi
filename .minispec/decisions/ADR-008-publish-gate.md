# ADR-008: The approval before publishing is enforced by a hook

## Decision

In `guided` mode, a PreToolUse hook in miyagi (`src/publishGate.ts`) stops any browser action that publishes, changes or removes what students see in Moodle unless `request_human_approval` was approved just before, and asks the teacher right there. An approval lasts until the next `request_human_approval` call or the teacher's next message, so one approval covers a batch. A publication the gate itself lets through covers only that call.

## Motivation

The approval was only a rule in the prompt, and a real session forgot it: a File resource was visible to students for ~35 s before the agent noticed and hid it. A guardrail can't depend on the model remembering it.

The hook lives here, not in agent-kit: only this agent has hit the problem, and what counts as publishing is Moodle knowledge. The kit already exports what it needs (`askForDecision()`, `ModeControl`), and miyagi writes the approval tool's "approved" text itself. It moves to the kit if student-agent needs the same for its final "Submit".

Rejected alternatives:

- Asking before every browser action is what `interactive` already does.
- A single-use approval would ask again for every grade of an approved batch.

## Consequences

- `isPublishAction()` recognizes Moodle's publishing buttons by the element's name and target, in English and Spanish (from the Moodle 5.2 language packs), plus scripts that submit a form or POST, and navigations with a `sesskey`. Pressing Enter on its own isn't caught: the prompt rule still covers it.
- A missed publishing action found in a test is added to `.claude/skills/verify/check-publish-gate.mjs` together with its fix. A false positive only costs an extra panel.
- `interactive` (the kit's step gate) and `autonomous` are unchanged.
- Batch approvals leave a gap: an unrelated publication in the same turn after an approval goes through. Accepted, since the prompt rule still asks the model to request each approval.
