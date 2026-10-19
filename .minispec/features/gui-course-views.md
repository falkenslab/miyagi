# GUI: the subject's views

Issue: [#51](https://github.com/falkenslab/miyagi/issues/51)

## Goal

Views that show the subject's work without asking the chat for it, as the mockup draws them: today, plan, topics, materials, sources and knowledge base (ADR-022).

## Context

- All of it is in the workspace: the knowledge base (`course/`, `topic/`, `activity/` pages, `src/knowledgeTypes.ts`), `sources/`, `drafts/` (`drafts_list`, `drafts_info`).
- The knowledge base is reached only through the kit's knowledge extension (`apis.knowledge.knowledgeStore`, `chat.api("knowledge")`), never by reading `knowledge/`.
- Classroom views (submissions, forum, progress) depend on the classroom extension's tools and stay as chat actions for now.
- The oven view waits for `activity-lifecycle` (the phases in `course/drafts`).
- Needs `gui-chat` (and `gui-workspaces` for the workspace's name).

## Changes

- Host: read-only `GET /api/kb/index`, `GET /api/kb/page?id=` (through the store), `GET /api/sources`, `GET /api/drafts`, `GET /api/drafts/file?path=` (inside `drafts/` only, same checks as the file scope).
- **Hoy**: the subject's summary, what's in progress, suggested next steps as buttons that send a message to the chat.
- **Plan**: the teaching plan page, rendered; "Revisar con miyagi" opens the chat with that context.
- **Temas**: units from the `topic/` pages, each with its activities.
- **Materiales**: `drafts/` as a tree, a preview of HTML and PDF in a sandboxed frame, "Publicar…" sends the request to the chat (the approval stays the agent's).
- **Fuentes**: list, drag and drop to add (`/api/upload`), "Ingerir" sends `ingest` to the chat.
- **Base de conocimiento**: index and pages, links between them; read-only.
- Every action that changes something goes through the chat, never a direct write.

- - -

## Acceptance

- On the SQL use case's workspace: every view shows its content; adding a source from the view and ingesting it updates the knowledge base view.
- No endpoint reads outside the workspace's `sources/` and `drafts/` or `knowledge/` through the store; a `..` path gets 403.

- - -
