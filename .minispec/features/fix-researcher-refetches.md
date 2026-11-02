# The researcher reads the same page again and again

Issue: [#64](https://github.com/falkenslab/miyagi/issues/64)

## Problem

Asked for the official curriculum of a vocational module (Sistemas Informáticos, 1º DAM, Canarias), the researcher fetched the same BOE pages over and over: about 40 reads of boe.es across three researchers (`BOE-A-2023-13221` and `BOE-A-2010-8067` again and again with a different question each time, `BOE-A-2024-10685` six times). The first one ran for 8 minutes (42 calls) before the agent launched two more in parallel; the teacher's next question came 11 minutes after the research started.

## Cause

- `WebFetch` doesn't return the page: it returns a small model's answer to one prompt about it, from a truncated copy of a long page. To get the evaluation criteria of seven learning outcomes from a long BOE text, the researcher asks for them a few at a time, and each ask downloads the page again.
- `prompts/system/researcher.md` sets no budget and no stopping point: only `maxTurns: 40` (`src/agent.ts:157`). It says nothing about asking everything one page holds in one read, nor about returning a partial report.
- The researcher has no way to keep a page's full text and search it (`drafts_download` is the main agent's).

## Solution

To do:
- `researcher.md`:
  - one read per page with every question for it;
  - never the same URL twice unless the first read says the part it needs was cut;
  - a budget (about 15 reads), then a partial report with what's left open;
  - a first short report of the sources found before going into the details.
- Long official texts (a BOE, a regional bulletin): choose one, then name it in the skills that send the researcher for regulations (`regulations`, `teaching-plan`, `criterial-assessment`) and check it with a real run:
  - (a) the main agent downloads the text once (`drafts_download`) and the researcher reads and greps the file (it already has `Read`/`Grep`);
  - (b) a read-only fetch-to-text tool for the researcher.
- The main agent: when the researcher comes back short, ask the teacher before sending more researchers.

## Verification

To do: the same request (curriculum of Sistemas Informáticos, Canarias) in a real session: each BOE page read once or downloaded once, the research under about 5 minutes, the learning outcomes and criteria literal and complete; `verify` passes.
