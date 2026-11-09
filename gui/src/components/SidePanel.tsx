import { useCallback, useState } from "react";
import type { Texts } from "../i18n";
import type { CourseTexts } from "../i18n/course";
import { addTab, closeTab, fileTab, NO_TABS, selectTab, type SideTab, type SideTabs } from "../sideTabs";
import { Preview } from "./Course";
import { Icon } from "./Icons";
import { recalled, remember, SideHandle } from "./Shell";

// The panel on the right of the conversation (#85): tabs with what the teacher is looking at, a
// divider to resize it, expand and close. Under about 1100 px it takes the conversation's place,
// and at 760 px or less the whole screen, as the stylesheet draws it; an approval brings the
// conversation back (`.asking`), and the panel returns once it's answered.

const PANEL_WIDTH_KEY = "miyagi.panelWidth";
const PANEL_WIDTH = 480;
const PANEL_MIN = 320;
const PANEL_MAX = 960;
const clampPanel = (width: number) => Math.round(Math.min(PANEL_MAX, Math.max(PANEL_MIN, width)));

function storedPanelWidth(): number {
  const value = Number(recalled(PANEL_WIDTH_KEY));
  return value ? clampPanel(value) : PANEL_WIDTH;
}

/** The panel's state, in the page: its tabs, whether it's on screen and expanded, and its width. */
export function useSidePanel() {
  const [tabs, setTabs] = useState<SideTabs>(NO_TABS);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [width, setWidth] = useState(storedPanelWidth);
  const resize = (next: number) => {
    const clamped = clampPanel(next);
    setWidth(clamped);
    remember(PANEL_WIDTH_KEY, String(clamped));
  };
  const showTab = (tab: SideTab) => {
    setTabs((now) => addTab(now, tab));
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    setExpanded(false);
  };
  /** Nothing of a subject stays open in another: its files aren't there. */
  const reset = useCallback(() => {
    setTabs(NO_TABS);
    setOpen(false);
    setExpanded(false);
  }, []);
  return {
    tabs,
    /** On screen: open, and with something to show. */
    shown: open && tabs.list.length > 0,
    expanded,
    width,
    resize,
    openFile: (file: string) => showTab(fileTab(file)),
    select: (id: string) => setTabs((now) => selectTab(now, id)),
    close: (id: string) => {
      const next = closeTab(tabs, id);
      setTabs(next);
      if (!next.list.length) hide();
    },
    toggle: () => (open ? hide() : setOpen(true)),
    hide,
    setExpanded,
    reset,
  };
}

export type SidePanelState = ReturnType<typeof useSidePanel>;

/** What a tab shows. */
function TabBody({ tab, C }: { tab: SideTab; C: CourseTexts }) {
  return <Preview file={tab.file} C={C} />;
}

export function SidePanel({ panel, T, C }: { panel: SidePanelState; T: Texts; C: CourseTexts }) {
  const { list, active } = panel.tabs;
  return (
    <aside className="spanel" aria-label={T.sidePanel}>
      <SideHandle left width={panel.width} resize={panel.resize} label={T.resizePanel} min={PANEL_MIN} max={PANEL_MAX} initial={PANEL_WIDTH} />
      <div className="spanel-bar">
        <button type="button" className="ibtn plain spanel-back" title={T.backToChat} aria-label={T.backToChat} onClick={panel.hide}>
          <Icon name="left" />
        </button>
        <div className="spanel-tabs" role="tablist" aria-label={T.sidePanel}>
          {list.map((tab) => (
            <div key={tab.id} className={`spanel-tab${tab.id === active ? " on" : ""}`}>
              <button type="button" role="tab" aria-selected={tab.id === active} title={tab.file} className="ellipsis" onClick={() => panel.select(tab.id)}>
                {tab.title}
              </button>
              <button type="button" className="ibtn plain spanel-x" title={T.closeTab(tab.title)} aria-label={T.closeTab(tab.title)} onClick={() => panel.close(tab.id)}>
                <Icon name="x" size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="ibtn plain spanel-expand" title={panel.expanded ? T.shrinkPanel : T.expandPanel} aria-label={panel.expanded ? T.shrinkPanel : T.expandPanel} aria-pressed={panel.expanded} onClick={() => panel.setExpanded(!panel.expanded)}>
          <Icon name={panel.expanded ? "shrink" : "expand"} />
        </button>
        <button type="button" className="ibtn plain spanel-close" title={T.closePanel} aria-label={T.closePanel} onClick={panel.hide}>
          <Icon name="x" />
        </button>
      </div>
      <div className="spanel-body">
        {/* Every tab stays mounted, so changing tab doesn't reload a PDF or lose its place. */}
        {list.map((tab) => (
          <div key={tab.id} className="spanel-page" role="tabpanel" hidden={tab.id !== active}>
            <TabBody tab={tab} C={C} />
          </div>
        ))}
      </div>
    </aside>
  );
}
