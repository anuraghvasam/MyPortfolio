export default function ProgressHUD({
  brand,
  subtitle,
  activeIndex,
  total,
  progressPct,
  onNext,
}) {
  return (
    <div className="hud" role="region" aria-label="Progress and navigation">
      <div className="hudInner">
        <div className="hudBrand">
          <div className="hudBrandTop">{brand}</div>
          <div className="hudBrandSub">{subtitle}</div>
        </div>

        <div className="hudProgress" aria-label={`Progress ${progressPct}%`}>
          <div className="hudPct">{progressPct}%</div>
          <div className="hudBar" aria-hidden="true">
            <div className="hudBarFill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="hudStep">
            Chapter {activeIndex + 1} / {total}
          </div>
        </div>

        <button className="hudNext" type="button" onClick={onNext}>
          Next
        </button>
      </div>

      <div className="hudHint">Click next or scroll to advance</div>
    </div>
  );
}
