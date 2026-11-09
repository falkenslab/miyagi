import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { act } from "../api";
import type { Texts } from "../i18n";
import type { TourTexts } from "../i18n/tour";
import { highlight, placeBubble, spotlightPath, stepsFor, TOUR_VERSION, viewAt, type Box, type TourStep } from "../tour";
import type { ChatState, Info } from "../types";
import type { View } from "./Shell";

// The guided tour (#81): the first time a subject is open, and again from the rail's foot. Each step
// spotlights a part of the window and says what it's for; what it needs on screen (a view, the
// drawer on a phone, the sidebar unfolded) is put there for the step, and left as it was at the end.
// An approval or a question waits for nothing: the tour steps aside and comes back once answered.

/** How long a step's element may take to appear (a view loading, the drawer opening) before the bubble goes in the middle. */
const GRACE_MS = 600;
const phone = () => matchMedia("(max-width: 760px)");

/** Whether the tour is on, at which step, and how it's moved. `seen` is the version saved, once known. */
export function useTour({ info, chat, asking, seen, onSeen, view, setView, setDrawer, collapsed, setCollapsed }: { info: Info | null; chat: ChatState | null; asking: boolean; seen: number | null; onSeen: () => void; view: View; setView: (view: View) => void; setDrawer: (open: boolean) => void; collapsed: boolean; setCollapsed: (collapsed: boolean) => void }) {
  const [at, setAt] = useState<number | null>(null);
  const steps = useMemo(() => stepsFor({ browser: info?.browser, frame: info?.frame }), [info?.browser, info?.frame]);
  /** What the teacher had before the tour moved anything. */
  const before = useRef<{ view: View; collapsed: boolean } | null>(null);
  const opened = Boolean(chat);

  const start = useCallback(() => {
    before.current = { view, collapsed };
    setAt(0);
  }, [view, collapsed]);

  const close = () => {
    setAt(null);
    setDrawer(false);
    if (before.current) {
      setView(before.current.view);
      if (before.current.collapsed) setCollapsed(true);
    }
    before.current = null;
    onSeen();
    void act("page-settings-save", { tourSeen: TOUR_VERSION });
  };

  // Once, with a subject open, when this version hasn't been seen; never over an approval.
  const due = seen !== null && seen < TOUR_VERSION;
  useEffect(() => {
    if (due && opened && !asking && at === null) start();
  }, [due, opened, asking, at, start]);
  // The subject closed under it: nothing to point at, and not seen yet.
  useEffect(() => {
    if (!opened) setAt(null);
  }, [opened]);

  // Each step's stage; again on crossing to or from a phone's width, and on coming back from an approval.
  const [narrow, setNarrow] = useState(() => phone().matches);
  useEffect(() => {
    const media = phone();
    const change = () => setNarrow(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (at === null || asking) return;
    setView(viewAt(steps, at));
    const step = steps[at];
    if (narrow) setDrawer(Boolean(step.frame));
    else {
      setDrawer(false);
      if (step.frame) setCollapsed(false);
    }
  }, [at, asking, narrow, steps]);

  return {
    /** The step on screen and how many there are, or null with no tour. */
    step: at === null ? null : { at, total: steps.length, current: steps[Math.min(at, steps.length - 1)] },
    start,
    close,
    move: (delta: number) => setAt((now) => (now === null ? now : Math.max(0, Math.min(now + delta, steps.length - 1)))),
  };
}

/** What the spotlight needs, as measured on the last frame. */
interface Measured {
  box: Box | null;
  bubble: { width: number; height: number };
  view: { width: number; height: number };
}

export function Tour({ step, at, total, G, T, onMove, onClose }: { step: TourStep; at: number; total: number; G: TourTexts; T: Texts; onMove: (delta: number) => void; onClose: () => void }) {
  const bubble = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const [measured, setMeasured] = useState<Measured>({ box: null, bubble: { width: 360, height: 220 }, view: { width: innerWidth, height: innerHeight } });
  // The latest handlers: the listeners below stay put, or a field focused as its view mounts would slip between two of them.
  const latest = useRef({ onMove, onClose, at, total });
  latest.current = { onMove, onClose, at, total };

  // Every frame while it's on: a view loading, the drawer sliding, the window resized.
  useEffect(() => {
    const since = Date.now();
    let frame = 0;
    let last = "";
    let scrolled = false;
    let box: Box | null = null;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const view = { width: innerWidth, height: innerHeight };
      const element = step.target ? document.querySelector<HTMLElement>(step.target) : null;
      const rect = element?.getBoundingClientRect();
      const onScreen = element && rect && rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left < view.width && rect.top < view.height && rect.bottom > 0 && getComputedStyle(element).visibility !== "hidden";
      if (onScreen) {
        if (!scrolled) {
          scrolled = true;
          element.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
        box = highlight({ left: rect.left, top: rect.top, width: rect.width, height: rect.height }, view);
      } else if (!step.target || Date.now() - since > GRACE_MS) box = null;
      const size = { width: bubble.current?.offsetWidth ?? 360, height: bubble.current?.offsetHeight ?? 220 };
      const key = JSON.stringify([box, size, view]);
      if (key !== last) {
        last = key;
        setMeasured({ box, bubble: size, view });
      }
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [step]);

  // The keys, before anything else on the page hears them; the focus stays in the bubble.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const { onMove, onClose, at, total } = latest.current;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        if (event.key === "ArrowLeft") onMove(-1);
        else if (at === total - 1) onClose();
        else onMove(1);
      } else if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        const all = Array.from(bubble.current?.querySelectorAll<HTMLElement>("button") ?? []);
        const now = all.indexOf(document.activeElement as HTMLElement);
        all[(now + (event.shiftKey ? all.length - 1 : 1)) % all.length]?.focus();
      }
    };
    const keep = (event: FocusEvent) => {
      // After whatever moved it there has finished: a view that focuses its own field as it mounts.
      if (!bubble.current?.contains(event.target as Node)) requestAnimationFrame(() => next.current?.focus());
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("focusin", keep);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("focusin", keep);
    };
  }, []);

  useEffect(() => next.current?.focus(), [at]);

  const { box, bubble: size, view } = measured;
  const corner = placeBubble(box, size, view);
  const texts = G.steps[step.id];
  const last = at === total - 1;
  return (
    <div className="tour">
      <div className="tour-block" aria-hidden="true" />
      <div className="tour-dim" aria-hidden="true" style={{ clipPath: spotlightPath(box, view) }} />
      {box && <div className="tour-ring" aria-hidden="true" style={{ left: box.left, top: box.top, width: box.width, height: box.height } as CSSProperties} />}
      <div className="tour-bubble" ref={bubble} role="dialog" aria-modal="true" aria-labelledby="tour-title" data-step={step.id} style={corner}>
        <div aria-live="polite">
          <small className="tour-count">{T.taskOf(at + 1, total)}</small>
          <h3 id="tour-title">{texts.title}</h3>
          <p>{texts.text}</p>
        </div>
        <div className="tour-acts">
          <button type="button" className="btn ghost small tour-skip" onClick={onClose}>
            {G.skip}
          </button>
          <span className="sp" />
          {at > 0 && (
            <button type="button" className="btn small tour-back" onClick={() => onMove(-1)}>
              {G.back}
            </button>
          )}
          <button type="button" ref={next} className="btn small primary tour-next" onClick={() => (last ? onClose() : onMove(1))}>
            {last ? G.finish : G.next}
          </button>
        </div>
      </div>
    </div>
  );
}
