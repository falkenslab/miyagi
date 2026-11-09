import type { View } from "./components/Shell";

// The guided tour's steps (#81), as data, and where each one's bubble and spotlight go. Pure, so it
// can be tested without a browser.

/** Raise it when the tour gains steps worth showing again to whoever has seen it. */
export const TOUR_VERSION = 1;

export type TourStepId = "welcome" | "subject" | "newConversation" | "searchBell" | "conversations" | "progress" | "today" | "classroom" | "plan" | "materials" | "memory" | "extensions" | "composer" | "approvals" | "statusBar" | "sidePanel" | "browser" | "titleBar" | "theme";

export interface TourStep {
  id: TourStepId;
  /** The element it points at; without one, or if it isn't on screen, the bubble goes in the middle. */
  target?: string;
  /** The view it needs on screen; a step without one keeps the last step's. */
  view?: View;
  /** Its element is in the rail or the sidebar: in the drawer on a phone, and the sidebar unfolded. */
  frame?: boolean;
  /** Only where the host says this exists: the desktop app's browser or title bar. */
  only?: "browser" | "frame";
}

export const TOUR_STEPS: TourStep[] = [
  { id: "welcome", view: "today" },
  { id: "subject", target: ".ws", frame: true },
  { id: "newConversation", target: ".new-conv", frame: true },
  { id: "searchBell", target: ".side-tools", frame: true },
  { id: "conversations", target: ".recents", frame: true },
  { id: "progress", target: ".side-progress", frame: true },
  { id: "today", target: '.rail-item[data-rail="today"]', frame: true },
  { id: "classroom", target: '.rail-item[data-rail="classroom"]', frame: true },
  { id: "plan", target: ".view-tabs", view: "plan" },
  { id: "materials", target: ".view-tabs", view: "materials" },
  { id: "memory", target: ".view-tabs", view: "knowledge" },
  { id: "extensions", target: '.rail-item[data-rail="extensions"]', frame: true },
  { id: "composer", target: ".composer", view: "chat" },
  { id: "approvals", target: ".composer .mode" },
  { id: "statusBar", target: ".status-bar" },
  { id: "sidePanel", target: ".top .panel-btn" },
  { id: "browser", target: ".top .panel-btn", only: "browser" },
  { id: "titleBar", target: ".titlebar", only: "frame" },
  { id: "theme", target: ".rail-foot", frame: true },
];

/** The steps that exist where the page is running. */
export function stepsFor(where: { browser?: boolean; frame?: boolean }): TourStep[] {
  return TOUR_STEPS.filter((step) => !step.only || where[step.only]);
}

/** The view a step needs: its own, or the last one declared before it, whichever way the teacher came. */
export function viewAt(steps: TourStep[], at: number): View {
  for (let i = Math.min(at, steps.length - 1); i >= 0; i--) {
    const { view } = steps[i];
    if (view) return view;
  }
  return "today";
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

/** The space around what's highlighted, and between the window's edge and the bubble. */
const GAP = 12;
const MARGIN = 12;
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, Math.max(low, high)));

/**
 * The bubble's corner: beside its target if it fits (to the right, then left), else under or over
 * it; never out of the window. In the middle with no target; on the side with more room, even if
 * it covers part of a target too big to clear.
 */
export function placeBubble(target: Box | null, bubble: Size, view: Size): { left: number; top: number } {
  const maxLeft = view.width - bubble.width - MARGIN;
  const maxTop = view.height - bubble.height - MARGIN;
  if (!target) return { left: clamp((view.width - bubble.width) / 2, MARGIN, maxLeft), top: clamp((view.height - bubble.height) / 2, MARGIN, maxTop) };
  const right = view.width - target.left - target.width - GAP - MARGIN;
  const left = target.left - GAP - MARGIN;
  const below = view.height - target.top - target.height - GAP - MARGIN;
  const above = target.top - GAP - MARGIN;
  const midY = clamp(target.top + target.height / 2 - bubble.height / 2, MARGIN, maxTop);
  const midX = clamp(target.left + target.width / 2 - bubble.width / 2, MARGIN, maxLeft);
  if (right >= bubble.width) return { left: target.left + target.width + GAP, top: midY };
  if (left >= bubble.width) return { left: target.left - GAP - bubble.width, top: midY };
  if (below >= bubble.height) return { left: midX, top: target.top + target.height + GAP };
  if (above >= bubble.height) return { left: midX, top: target.top - GAP - bubble.height };
  return { left: midX, top: below >= above ? maxTop : MARGIN };
}

/** The dimmed layer's outline: the whole window, with a rounded hole around the target. */
export function spotlightPath(target: Box | null, view: Size): string {
  const outer = `M0 0H${view.width}V${view.height}H0Z`;
  if (!target) return `path(evenodd, "${outer}")`;
  const { left: x, top: y, width: w, height: h } = target;
  const r = Math.min(10, w / 2, h / 2);
  return `path(evenodd, "${outer}M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z")`;
}

/** The highlighted box: the element with some air, kept inside the window. */
export function highlight(element: Box, view: Size, pad = 4): Box {
  const left = Math.max(0, Math.round(element.left - pad));
  const top = Math.max(0, Math.round(element.top - pad));
  return { left, top, width: Math.min(view.width, Math.round(element.left + element.width + pad)) - left, height: Math.min(view.height, Math.round(element.top + element.height + pad)) - top };
}
