import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";


const DURATION_MS = 720; // card-to-card transition duration
const FINAL_EXPAND_MS = 720; // card -> full-page expand duration

function clampIndex(i, n) {
  if (n <= 0) return 0;
  return Math.max(0, Math.min(n - 1, i));
}

export default function AltStage({ chapters = [], onDone, onExitToLanding  }) {
  const N = chapters.length;

  const [index, setIndex] = useState(0);

  // transition: { dir, from, to, play, key }
  const [tx, setTx] = useState(null);

  // modal (for normal chapters)
  const [open, setOpen] = useState(false);

  // final expand overlay state
  const [finalOverlay, setFinalOverlay] = useState({
    on: false,
    expanded: false,
    rect: null,
  });

  const lockRef = useRef(false);
  const wheelGateRef = useRef(0);
  const rootRef = useRef(null);

  // ref to measure the final FRONT card when it becomes active
  const finalFrontCardRef = useRef(null);

  const frontSide = (i) => (i % 2 === 0 ? "L" : "R");
  const opp = (s) => (s === "L" ? "R" : "L");

  const active = chapters[index];
  const isLast = index === N - 1;

  // “final mode” = last chapter is fully active and no card-to-card transition is running
  const finalMode = !tx && active?.layout === "final";

  const begin = (dir) => {
    if (N < 2) return;
    if (lockRef.current) return;
    if (open) return;
    if (finalOverlay.on) return; // lock nav during full-page expand/shrink

      // ✅ If user is on the first card and hits back, return to landing page
if (dir === -1 && index === 0) {
  if (typeof onExitToLanding === "function") onExitToLanding();
  return;
}
    const to = clampIndex(index + dir, N);
    if (to === index) return;

    lockRef.current = true;

    const key = `${Date.now()}_${Math.random()}`;
    const from = index;

    // Phase 1: mount cards in "start" poses
    setTx({ dir, from, to, play: false, key });

    // Phase 2: next frame -> toggle to "end" poses (CSS transitions run)
    requestAnimationFrame(() => {
      setTx((t) => (t ? { ...t, play: true } : t));
    });

    // Finalize
    window.setTimeout(() => {
      setIndex(to);
      setTx(null);
      lockRef.current = false;
    }, DURATION_MS);
  };

  const onWheel = (e) => {
    if (open) return;
    if (finalOverlay.on) return;

    const now = performance.now();
    if (now - wheelGateRef.current < 420) return;
    if (Math.abs(e.deltaY) < 14) return;

    wheelGateRef.current = now;
    if (e.deltaY > 0) begin(+1);
    else begin(-1);
  };

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    el.addEventListener("wheel", onWheel, { passive: true });

    const onKey = (ev) => {
      if (open) {
        if (ev.key === "Escape") setOpen(false);
        return;
      }
      if (finalOverlay.on) return;

      if (ev.key === "ArrowRight" || ev.key === "PageDown") begin(+1);
      if (ev.key === "ArrowLeft" || ev.key === "PageUp") begin(-1);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [index, N, open, finalOverlay.on]);

  /**
   * IMPORTANT FIX:
   * Use useLayoutEffect so the overlay is mounted BEFORE the browser paints the final card.
   * This prevents the last card from briefly appearing as a card before expanding.
   */
  useLayoutEffect(() => {
    if (!finalMode) {
      // Leaving final mode: collapse overlay then remove
      if (finalOverlay.on) {
        setFinalOverlay((s) => ({ ...s, expanded: false }));
        window.setTimeout(() => {
          setFinalOverlay({ on: false, expanded: false, rect: null });
        }, FINAL_EXPAND_MS);
      }
      return;
    }

    // Entering final mode: measure the card rect and mount overlay at that exact rect
    const el = finalFrontCardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    // Mount overlay at card position BEFORE paint
    setFinalOverlay({ on: true, expanded: false, rect });

    // Next frame -> expand to full page
    requestAnimationFrame(() => {
      setFinalOverlay((s) => ({ ...s, expanded: true }));
    });
  }, [finalMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const scene = useMemo(() => {
    if (N === 0) return null;

    // If not transitioning: show index (front) and index+1 (back) if exists
    if (!tx) {
      const f = chapters[index];
      const nextIdx = index + 1;
      const b = nextIdx < N ? chapters[nextIdx] : null;

      const fSide = frontSide(index);
      const bSide = opp(fSide);

      return {
        bgA: f?.image,
        bgB: null,
        bgPlay: false,
        cards: [
          { key: `front_${f?.id ?? "x"}`, data: f, cls: `front${fSide}` },
          ...(b ? [{ key: `back_${b?.id ?? "y"}`, data: b, cls: `back${bSide}` }] : []),
        ],
      };
    }

    // Transitioning: show 3 cards (exit + morph + incoming)
    const { dir, from, to, play, key } = tx;

    const fromFront = chapters[from];
    const fromBack = from + 1 < N ? chapters[from + 1] : null;

    const toFront = chapters[to];
    const toBack = to + 1 < N ? chapters[to + 1] : null;

    const bgA = fromFront?.image;
    const bgB = toFront?.image;

    if (dir === +1) {
      const fromSide = frontSide(from);
      const toSide = frontSide(to);
      const toBackSide = opp(toSide);

      const exitCls = play ? `exitFront${fromSide}` : `front${fromSide}`;
      const morphCls = play ? `front${toSide}` : `back${opp(fromSide)}`;
      const incomingCls = play ? `back${toBackSide}` : `preBack${toBackSide}`;

      return {
        bgA,
        bgB,
        bgPlay: play,
        cards: [
          { key: `exit_${fromFront?.id ?? "a"}_${key}`, data: fromFront, cls: exitCls },
          ...(fromBack ? [{ key: `morph_${fromBack?.id ?? "b"}_${key}`, data: fromBack, cls: morphCls }] : []),
          ...(toBack ? [{ key: `in_${toBack?.id ?? "c"}_${key}`, data: toBack, cls: incomingCls }] : []),
        ],
      };
    }

    // PREV
    const toSide = frontSide(to);
    const toBackSide = opp(toSide);
    const fromBackSide = opp(frontSide(from));

    const backExitCls = play ? `exitBack${fromBackSide}` : `back${fromBackSide}`;
    const frontToBackCls = play ? `back${toBackSide}` : `front${frontSide(from)}`;
    const incomingFrontCls = play ? `front${toSide}` : `preFront${toSide}`;

    return {
      bgA,
      bgB,
      bgPlay: play,
      cards: [
        ...(fromBack ? [{ key: `backExit_${fromBack?.id ?? "d"}_${key}`, data: fromBack, cls: backExitCls }] : []),
        { key: `frontToBack_${fromFront?.id ?? "e"}_${key}`, data: fromFront, cls: frontToBackCls },
        { key: `incoming_${toFront?.id ?? "f"}_${key}`, data: toFront, cls: incomingFrontCls },
      ],
    };
  }, [chapters, index, N, tx]);

  if (!scene) return null;

  const progressPct = N ? Math.round(((index + 1) / N) * 100) : 0;

  const bgA = scene.bgA ? `url(${scene.bgA})` : "none";
  const bgB = scene.bgB ? `url(${scene.bgB})` : "none";

  const openModal = () => {
    if (tx) return;
    if (finalMode) return; // final screen uses full-page overlay, not modal
    if (!active?.modal) return;
    setOpen(true);
  };

  const renderFinalFullPage = (data) => {
    const f = data?.final;
    if (!f) return null;

    return (
      <div className="altFinalWrap">
        <div className="altFinalHero">
          <h1 className="altFinalH1">{f.headline}</h1>
          <p className="altFinalSub">{f.subhead}</p>

          <div className="altFinalCtas">
            {(f.ctas || []).map((c, i) => (
              <a
                key={i}
                className="altFinalBtn"
                href={c.href}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel={c.href?.startsWith("http") ? "noreferrer" : undefined}
              >
                <span className="altFinalBtnIcon" aria-hidden="true">
                  {c.icon}
                </span>
                <span>{c.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="altFinalLower">
          <div className="altFinalGrid">
            {(f.quickTiles || []).map((t, i) => (
              <div key={i} className="altFinalTile">
                <div className="altFinalTileIcon">{t.icon}</div>
                <div className="altFinalTileText">{t.text}</div>
              </div>
            ))}
          </div>

          <div className="altFinalContact">
            <div className="altFinalContactTitle">Contact</div>
            {(f.contact || []).map((c, i) => (
              <div key={i} className="altFinalRow">
                <div className="altFinalLabel">{c.label}</div>
                <div className="altFinalValue">
                  {c.href ? (
                    <a href={c.href} className="altFinalLink">
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={rootRef} className="altStageRoot">
      {/* Blurred background image of current front card */}
      <div className="altBgLayer altBgA" style={{ backgroundImage: bgA }} />
      {scene.bgB && (
        <div className={`altBgLayer altBgB ${scene.bgPlay ? "show" : ""}`} style={{ backgroundImage: bgB }} />
      )}
      <div className="altBgGlass" />

      {/* Stage (cards) */}
      <div className="altStage">
        {scene.cards.map(({ key, data, cls }) => {
          const isFront = cls.startsWith("front");
          const isFinalFront = isFront && data?.layout === "final";

          // IMPORTANT FIX:
          // Hide the final front card immediately (finalMode OR overlay on),
          // so user never sees it as a “card” before expansion.
          const hideFinalCard = isFinalFront && (finalMode || finalOverlay.on || tx);

          return (
            <div
              key={key}
              ref={isFinalFront ? finalFrontCardRef : null}
              className={`altCard ${cls} ${hideFinalCard ? "altHideForOverlay" : ""}`}

              role={isFront && !isFinalFront ? "button" : undefined}
              tabIndex={isFront && !isFinalFront ? 0 : -1}
              onClick={isFront && !isFinalFront ? openModal : undefined}
              onKeyDown={
                isFront && !isFinalFront
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") openModal();
                    }
                  : undefined
              }
            >
              <div className="altCardMedia">
                {data?.image ? <img src={data.image} alt="" /> : <div className="altCardFallback" />}
                <div className="altCardShade" />
              </div>

              <div className="altCardContent">
                {data?.month && <div className="altMonthPill">{data.month}</div>}

                <div className="altTitleRow">
                  <div className="altLogo" aria-hidden="true" />
                  <div className="altTitle">{data?.title}</div>
                </div>

                {data?.body && <div className="altBody">{data.body}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* FINAL full-page overlay: starts at card rect, expands to viewport */}
      {finalOverlay.on && finalOverlay.rect && finalMode && (
        <div
          className={`altFinalOverlay ${finalOverlay.expanded ? "expanded" : ""}`}
          style={{
            top: `${finalOverlay.rect.top}px`,
            left: `${finalOverlay.rect.left}px`,
            width: `${finalOverlay.rect.width}px`,
            height: `${finalOverlay.rect.height}px`,
          }}
        >
          {renderFinalFullPage(active)}
        </div>
      )}

      {/* Bottom controls */}
      <div className="altNav">
        <div className="altNavLeft">
          <div className="altBrand">
            <span className="altBrandDot" aria-hidden="true" />
            <span>Anuragh Vasam</span>
            <span className="altSep">|</span>
            <span>Software Developer</span>
          </div>
        </div>

        <div className="altNavCenter">
          {/* Back button ALWAYS */}
          <button
            className="altIconBtn"
            onClick={() => begin(-1)}
            aria-label="Back"
            disabled={finalOverlay.on}
          >
            ←
          </button>

          {/* Next button only when NOT final mode */}
          {!finalMode && (
            <button
              className="altNextBtn"
              onClick={() => begin(+1)}
              disabled={finalOverlay.on}
            >
              Next <span className="altArrow">→</span>
            </button>
          )}
        </div>

        <div className="altNavRight">Progress {progressPct}%</div>
      </div>

      {/* Modal for normal chapters only */}
      {open && active?.modal && (
        <div className="altModalOverlay" onMouseDown={() => setOpen(false)}>
          <div className="altModal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="altModalClose" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>

            <div className="altModalInner">
              <div className="altModalLeft">
                <h2 className="altModalTitle">{active.modal.heading || active.title}</h2>
                <p className="altModalDesc">{active.modal.summary || active.body}</p>

                <button className="altModalBack" onClick={() => setOpen(false)}>
                  Back
                </button>
              </div>

              <div className="altModalRight">
                <div className="altModalGrid">
                  {(active.modal.tiles || []).map((t, i) => (
                    <div key={i} className="altModalTile">
                      <div className="altModalIcon">{t.icon}</div>
                      <div className="altModalText">{t.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
