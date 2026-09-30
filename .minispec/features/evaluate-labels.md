# Say what a JavaScript call does, not its code

Issue: [#7](https://github.com/falkenslab/teacher-agent/issues/7)

## Goal

In the chat, label each `browser_evaluate` call with what it does ("Leyendo los mensajes del foro", "Escribiendo en el editor"), not with the start of its code.

## Context

- Today `describePlaywright()` (`src/toolLabels.ts`) labels it `t().tool.evaluate(code)`: "Ejecutando JavaScript: () => [...document.querySelectorAll('article')].map(a=>a.innerText).join('\n====…". To a teacher that is noise, and it's the most frequent line in a Moodle session (the agent reads and fills pages with it).
- `browser_evaluate` has no free-text description to show: its input is `function` (the code) plus, when it acts on an element, `element` and `ref`. Asking the model for a description would cost tokens on every call, so the label has to come from the input itself.
- The code is still kept, in full, in the run's `transcript.jsonl`.
- Asked by the teacher (2026-09-29).

## Changes

- In `describePlaywright()`, `browser_evaluate` gets a label from what the code does, checked in order, no model involved:
  - it acts on an `element` → the element ("En «Guardar cambios»"), as `browser_click` does;
  - it writes: `tinymce`/`setContent`/`.value =`/`dispatchEvent` → writing into the editor or the form; `.click()`/`.submit()` → acting on the page;
  - it reads: `innerText`/`textContent`/`querySelectorAll` → reading the page's content; `href`/`a[` → looking at its links; `form`/`input`/`select` → looking at the form's fields;
  - anything else → a neutral "Consultando la página".
- The labels go into `src/messages/` (en, es, fr, de); `evaluate(code)` goes away.

## Acceptance

- No chat line shows JavaScript code. The calls of a real forum reply and a quiz creation read as reading, writing or acting, in the chat's language.
- Classification is a pure function over the input, with a case per rule in a `verify` check (like `check-publish-gate.mjs`), using real inputs from a sandbox transcript.
- `verify` passes.
