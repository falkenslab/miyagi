# The working spinner stands still when the system asks for less motion

Issue: [#61](https://github.com/falkenslab/miyagi/issues/61)

## Problem

With Windows' "Animation effects" turned off, the spinner that says miyagi is working (the waits of #59, the running tool, the conversation in Recents, the activity line) doesn't move, in the desktop app and in the browser. A teacher can't tell a turn in progress from a page that froze. Seen on the desktop app built from `d2f555a`.

## Cause

Windows' setting reaches Chromium (Electron too) as `prefers-reduced-motion: reduce`, and `gui/src/styles.css:192` answers it with `.spinner { animation: none; }`. Reduced motion asks to tone motion down, not to drop the only sign of activity: the spinner is essential motion, and with it removed nothing else on the page says miyagi is still working.

## Solution

To do:
- Under `prefers-reduced-motion: reduce`, keep the spinner moving in a calmer way instead of none: a slower rotation, or a soft pulse of opacity with no rotation. Choose one and keep it the same everywhere `.spinner` is used.
- Check the other motion rules under reduced motion (`.switch`, `.side`): they are transitions and can stay off.
- `check-page.mjs`: with reduced motion emulated (`page.emulateMedia({ reducedMotion: "reduce" })`), a visible spinner still has an animation (`getComputedStyle(...).animationName !== "none"`).

## Verification

To do: the check in `check-page.mjs` passes; the desktop app on this Windows (animation effects off) shows the spinner moving while miyagi works; with animations on, it looks as before.
