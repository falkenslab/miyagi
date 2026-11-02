# Links from the chat to the subject's items

Issue: [#66](https://github.com/falkenslab/miyagi/issues/66)

## Goal

When miyagi names something of the subject in the chat (a source, a knowledge base page, a material, the oven), it's a link that opens that item in its view.

## Context

- The agent's replies name `sources/programacion.pdf`, `knowledge/course/teaching-plan.md`, `drafts/tema-1/…` as plain text or code; the teacher has to find them in the views by hand.
- `gui/src/markdown.tsx` already turns `[label](kind/id)` into a link, but only where the view passes `onPage` (the plan and knowledge views); `Transcript.tsx` doesn't, so in the chat the label stays text.
- The views can already be reached with an item: `go("knowledge", id)`; Materials has a chosen file (`setChosen`); Sources lists files but can't point at one.

## Changes

- **Resolver** (`gui/`): a workspace path in a reply, as a markdown link or in inline code, maps to a view and an item:
  - `sources/<file>` → Sources, the file highlighted and scrolled to;
  - `knowledge/<id>.md` or a page id (`course/teaching-plan`, `topic/…`) → Knowledge, that page;
  - `drafts/<path>` and `materials/<path>` → Materials, that file chosen in the preview;
  - `course/drafts` and an activity of the register → the oven.
- **Only what exists**: the host says which of the paths named exist (a read-only action over the subject's folders, never outside them); the rest stays text. No link to `config.json`, `.env` or anything outside sources/, knowledge/, drafts/ and materials/.
- `Transcript.tsx` passes the resolver to `Markdown`; links look as the knowledge view's `page-link`, keyboard reachable, and keep the transcript readable when the item is gone later.
- **Prompt** (`prompts/system/teacher-chat.md` and the run one): name the subject's items as links (`[la programación](course/teaching-plan)`, `[el PDF](sources/programacion.pdf)`), not bare paths. Add it to `check-prompts.mjs`'s `SECTIONS` if it depends on the session kind.
- Sources view: point at a file (highlight, scroll) when opened with one.
- **Docs**: `avanzado/navegador.md` (both languages): items named in the chat open their view.
- `check-page.mjs`: a reply naming an existing source and page links to them and opens the right view; a made-up path stays text.

## Acceptance

- In a real session, a reply that names a source, a knowledge page and a material shows three links, each opening its view on that item.
- A path that doesn't exist, or one outside the four folders, isn't a link.
- The terminal chat is unchanged.
- `verify` and `check-page.mjs` pass.
