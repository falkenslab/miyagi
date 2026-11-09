import type { TipsTexts } from "../i18n/tips";
import { Markdown } from "../markdown";
import { tipImage, tipsFor } from "../tipsContent";
import { tipUrl } from "../tips";
import { Dialog } from "./Panel";

// The window of tips (#82): one tip with its image, the way to the next and the previous, the docs
// page that tells more, and the box that turns them off. Next tip each time, not at random: the
// host keeps where it goes. Over a turn's approval, nothing: it opens once it's answered.

export function TipsWindow({ at, language, showTips, H, onMove, onShowTips, onClose }: { at: number; language: string | undefined; showTips: boolean; H: TipsTexts; onMove: (delta: number) => void; onShowTips: (show: boolean) => void; onClose: () => void }) {
  const { tips, language: lang } = tipsFor(language);
  const tip = tips[at];
  const image = tip.image && tipImage(tip.image.src);
  return (
    <Dialog title={tip.title} className="tips" onEscape={onClose}>
      <div className="tip-body" data-tip={tip.id}>
        {image && <img src={image} alt={tip.image?.alt ?? ""} />}
        <div className="tip-text">
          <Markdown text={tip.body} />
          {tip.link && (
            <button type="button" className="btn small tip-more" onClick={() => window.open(tipUrl(tip.link?.page ?? "", lang), "_blank")}>
              {H.learnMore}
            </button>
          )}
        </div>
      </div>
      <label className="tip-off">
        <input type="checkbox" checked={!showTips} onChange={(event) => onShowTips(!event.target.checked)} />
        <span>{H.dontShow}</span>
      </label>
      <div className="tip-acts">
        <small className="muted">{H.count(at + 1, tips.length)}</small>
        <span className="sp" />
        <button type="button" className="btn small tip-close" onClick={onClose}>
          {H.close}
        </button>
        <button type="button" className="btn small tip-prev" onClick={() => onMove(-1)}>
          {H.previous}
        </button>
        <button type="button" className="btn small primary tip-next" data-autofocus onClick={() => onMove(1)}>
          {H.next}
        </button>
      </div>
    </Dialog>
  );
}
