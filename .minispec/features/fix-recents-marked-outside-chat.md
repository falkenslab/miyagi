# The open conversation looks selected in every view

Issue: [#65](https://github.com/falkenslab/miyagi/issues/65)

## Problem

In the side menu, the open conversation in Recents stays highlighted while the teacher is in another view (Today, Sources…): two items look selected at once, and it reads as if the chat were still the view on screen.

## Cause

`gui/src/components/Shell.tsx:143` marks a conversation `on-conv` whenever it is the open one (`run.dir === current`), whatever the view, and `gui/src/styles.css:80` styles `.nav a.on-conv` exactly as the active view (`.nav a.on`: panel background, the sun bar, bold). #60 asked for the open conversation to be marked, not to look like the view the teacher is in.

## Solution

To do:
- `Conversations` gets the view: the full highlight (and `aria-current="page"`) only when the view is the chat.
- In any other view, the open conversation keeps a quiet mark (a small dot, no background, no bar, `aria-current` off) that says it's the one open, and its spinner while it works.
- `check-page.mjs`: in Today, `.recents .on-conv` isn't styled as the active item and only one item has `aria-current="page"`.

## Verification

To do: in the desktop app and at 390 px, going from the chat to Today leaves only Today highlighted, with the open conversation's quiet mark; back to the chat, the conversation is highlighted again; `check-page.mjs` passes.
