// The side panel's tabs (#85), the page's own state: what the teacher is looking at beside the
// conversation, kept until the page is closed. One kind for now; each kind adds its data here.

export type SideTab = { id: string; kind: "file"; title: string; file: string };

export interface SideTabs {
  list: SideTab[];
  active: string | null;
}

export const NO_TABS: SideTabs = { list: [], active: null };

/** The types the host serves from materials/ and drafts/ and `Preview` draws. */
const PREVIEWED = new Set([".html", ".htm", ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".md", ".txt", ".gift", ".csv", ".json", ".xml"]);

export const canPreview = (file: string) => PREVIEWED.has(file.slice(file.lastIndexOf(".")).toLowerCase());

export const fileTab = (file: string): SideTab => ({ id: `file:${file}`, kind: "file", title: file.slice(file.lastIndexOf("/") + 1), file });

/** A tab opened, or brought forward if it was already open. */
export function addTab(tabs: SideTabs, tab: SideTab): SideTabs {
  return { list: tabs.list.some((one) => one.id === tab.id) ? tabs.list : [...tabs.list, tab], active: tab.id };
}

export const selectTab = (tabs: SideTabs, id: string): SideTabs => ({ ...tabs, active: id });

/** A tab closed; the one after it takes its place if it was the one on screen, and none is left closing the last. */
export function closeTab(tabs: SideTabs, id: string): SideTabs {
  const at = tabs.list.findIndex((one) => one.id === id);
  if (at === -1) return tabs;
  const list = tabs.list.filter((one) => one.id !== id);
  return { list, active: tabs.active === id ? (list[at]?.id ?? list[at - 1]?.id ?? null) : tabs.active };
}

/** A prepared file a line of text names (`drafts/x/plan.md`, as the oven's register does), that the panel can show. */
export function namedFile(text: string): string | undefined {
  return text.match(/(?:drafts|materials)\/[^\s`)'"]+\.[a-z0-9]+/gi)?.find(canPreview);
}
