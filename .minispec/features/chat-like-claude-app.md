# The chat organised like the Claude app

Issue: [#60](https://github.com/falkenslab/miyagi/issues/60)

## Goal

miyagi's chat (`gui/`) shows and organises its information as the Claude mobile app does, at every width, keeping miyagi's own look (logo, the sun red, its type).

## Context

- At 360 px the chat is the desktop one squeezed: a header with three bordered buttons (mode, ⚡ actions, 🧩 capabilities) and a cut title, a black user bubble, an avatar per reply, tool calls as a bordered card, approvals in a centred modal that hides the conversation, a one-row composer.
- The approved prototype: [miyagi chat móvil](https://claude.ai/artifact/SAcdE4q5fojhVnPVgZdN7Y) (7 artboards: new conversation, conversation running, approval, side menu, ＋ sheet, mode sheet, desktop).
- Layout only: the host and its actions (`send`, `mode`, `answer`, `interrupt`, `new`, `resume`) already do everything; the course views (Today, plan, materials…) keep their content.
- Not here: reaching the host from a phone (it listens on 127.0.0.1 only), "Regenerate" and editing a sent message (they'd need new host actions).

## Changes

- **Header** (`Shell.tsx`): ☰ · the conversation's title (the subject and "con aula"/"sin aula" when it has none yet) · ✎ new conversation. Mode, quick actions and capabilities leave it. Other views keep their title in the same header.
- **Side menu** (`Shell.tsx`), top to bottom:
  - ✎ New conversation (primary button) and the subject switcher;
  - Today and Your classroom as two tiles;
  - on ≤760 px the rest of the views (Subject, Memory, miyagi) folded into one line that opens them; unfolded on desktop;
  - **Recent conversations**, the current one marked, a spinner while it works;
  - the foot: versions and theme.
- **Empty conversation** (`Transcript.tsx`): the logo, a greeting, and the quick actions as suggestion rows (prepare the next topic, grade what's pending, answer forum doubts, ingest my documents; link the classroom without one), with a count where the course view already knows it (to grade, unanswered threads).
- **Messages:**
  - the user's bubble in `--bg-2` with `--text`, on the right;
  - miyagi's replies full width with no avatar or bubble, at every width;
  - under a finished reply, **Copy** (the reply's markdown, to the clipboard) and the turn's "✻ n s".
- **Tool calls:** one dim, borderless line ("Leyó el foro del tema 1 · 3 acciones ›"); the running call's label with a spinner while it works; opened, the ✓/✕ list as today.
- **Composer** (`Composer.tsx`): a card with the text on top and a row under it: **＋** (round), the **mode** as a pill (dot and name), and the round send button (stop while it works). The suggestion chip and the `/` menu stay.
- **＋ sheet:** add a file (to sources), capabilities, the quick actions, and "miyagi commands" (opens the `/` menu).
- **Mode sheet:** the four modes with their help, the current one checked; Shift+Tab still switches.
- **Turn tasks** (`Todos`): a folded pill above the composer ("◼ 1/2 · the task in progress ˄"), opened as today's list.
- **↓ button** floating over the end of the conversation when the person isn't at the end.
- **Checkpoints** (`Panel.tsx`, `App.tsx`): approval, choice, form, manual step and text answer render in the dock **in place of the composer**, the conversation visible and scrollable above: a bottom sheet with a grab bar and a maximum height on mobile, a card the composer's width on desktop. Approve is the large primary button; Reject and Stop everything beside or under it. Focus trap and Escape as now. The choice in place of the prompt (`chat.choice`) too.
- **Menus on mobile:** popovers become bottom sheets with a scrim at ≤760 px (`Menu` gets a sheet variant); popovers stay on desktop. The other dialogs (new subject, link the classroom, open existing) are sheets on mobile too.
- **Mobile frame:** `100dvh`, `env(safe-area-inset-*)`, the composer above the on-screen keyboard; 44 px touch targets; inline SVG icons for the new buttons.
- **i18n** (es, en, fr, de): copy, copied, new conversation, more, go to the end, tasks n/m, miyagi commands, the greeting.
- **`check-page.mjs`:**
  - new selectors (mode in `.composer`, checkpoints in `.dock`, the tools line);
  - new checks: the conversation stays visible during an approval, ↓ shows after scrolling up, a suggestion row sends its action, Copy copies;
  - screenshots and no horizontal scroll at 360, 390, 768, 1024, 1440, light and dark.
- **Docs** (`update-docs`): `avanzado/navegador.md` and the guide pages that say where the mode, the actions or the approvals are, in Spanish and English; the chat screenshots flagged to retake (with #57).

- - -

## Acceptance

- At 390 px each prototype screen is reproduced by the real page: header, empty conversation, a running turn, an approval, the side menu, the ＋ and mode sheets.
- At 1440 px the same organisation, sidebar always open, conversation and composer centred.
- An approval doesn't hide the conversation: it can be scrolled and read while the checkpoint waits.
- Every action of today's header (mode, quick actions, capabilities) and composer (attach, `/`, history, Esc) is still reachable.
- `verify` passes, `check-page.mjs` passes with its new checks, no horizontal scroll and 44 px targets at every width, both themes.
- The docs describe the new places, in both languages.

- - -
