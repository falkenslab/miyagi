# ADR-009: New resources are tested in Moodle, uploaded hidden

## Decision

Every new resource the agent builds is kept editable in the workspace's `drafts/<slug>/`, uploaded to the course hidden from students, tested there as the teacher, and shown only with a separate approval. Hidden drafts are listed in `knowledge/drafts.md` until they're shown or dropped.

## Motivation

The teacher asked for an interactive HTML activity "opened in the browser", and the agent had no allowed way to do it: `file://` is blocked, the main agent has no shell (ADR-003), and it ended up running a web server through `practice-runner`'s Docker. A local preview would only cover what a browser opens, while most resources are quizzes, H5P, pages or files whose behavior depends on Moodle itself.

Testing in Moodle covers every type, needs nothing installed, and shows what students will get. In its first run it found two real problems a local preview wouldn't have: GIFT import dropping code indentation, and an embedded HTML file boxed at 500×400 px on a phone.

Rejected: a local preview server (partial coverage), Docker (too much for teachers outside IT), a separate test course (needs one, and lets the agent leave its course).

## Consequences

- `drafts/` is writable by the main agent and is the teacher's material, outside the knowledge base (GIFT files included).
- The hidden upload is a publication with its own approval that says "hidden"; showing is another one, and the publish gate (ADR-008) enforces both.
- A draft left hidden is recorded in `drafts.md`, named at the end of `run`, greeted in the next chat, and pointed at by the CLI when the session closes.
- The course keeps hidden items until the teacher shows or removes them; the agent never deletes (principles).
- Amended by ADR-014: this is the `staged-publishing` capability of a connector; on a platform without it, the approval says the material goes straight to students.
