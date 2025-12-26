import { useEffect, useMemo, useRef, useState } from "react";
import { tiles as resumeTiles } from "../data/tiles";

function EdgeLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00d4ff" />
          <stop offset="0.55" stopColor="#163bff" />
          <stop offset="1" stopColor="#00ffa8" />
        </linearGradient>
      </defs>
      <path
        fill="url(#g1)"
        d="M24 6c8.6 0 15.8 6.3 17.2 14.5-2.6-4.2-7.3-7-12.7-7-8.3 0-15 6.7-15 15 0 4.2 1.7 8 4.5 10.7C11 37.7 6 31.4 6 24 6 14.1 14.1 6 24 6Z"
      />
      <path
        fill="url(#g1)"
        d="M42 24c0 9.9-8.1 18-18 18-8.6 0-15.8-6.3-17.2-14.5 2.6 4.2 7.3 7 12.7 7 8.3 0 15-6.7 15-15 0-4.2-1.7-8-4.5-10.7C37 10.3 42 16.6 42 24Z"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Place N tiles in a big field without overlaps (minimum center distance).
 * Uses dart-throwing in pixels -> no “two tiles very close”.
 */
function placeTiles({
  count,
  fieldW,
  fieldH,
  tileW,
  tileH,
  minGap = 26,
  maxAttempts = 10000,
}) {
  const pts = [];
  const minCenterDist = Math.max(tileW, tileH) * 0.92 + minGap; // spacing
  const minDist2 = minCenterDist * minCenterDist;

  const rand = (a, b) => a + Math.random() * (b - a);

  let attempts = 0;
  while (pts.length < count && attempts < maxAttempts) {
    attempts++;

    const x = rand(0, Math.max(1, fieldW - tileW));
    const y = rand(0, Math.max(1, fieldH - tileH));
    const cx = x + tileW / 2;
    const cy = y + tileH / 2;

    let ok = true;
    for (let i = 0; i < pts.length; i++) {
      const dx = cx - pts[i].cx;
      const dy = cy - pts[i].cy;
      if (dx * dx + dy * dy < minDist2) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    pts.push({ x, y, cx, cy });
  }

  // If strict spacing prevents full fill, lightly relax by allowing the remainder randomly
  while (pts.length < count) {
    const x = rand(0, Math.max(1, fieldW - tileW));
    const y = rand(0, Math.max(1, fieldH - tileH));
    pts.push({ x, y, cx: x + tileW / 2, cy: y + tileH / 2 });
  }

  return pts.map((p) => ({ left: p.x, top: p.y }));
}

/**
 * Critically-damped-ish spring (buttery).
 * Each tile gets its own k/damping, so motion is independent.
 */
function springStep(state, targetX, targetY, k, damping, dt) {
  const ax = (targetX - state.x) * k;
  const ay = (targetY - state.y) * k;

  state.vx = (state.vx + ax * dt) * damping;
  state.vy = (state.vy + ay * dt) * damping;

  state.x += state.vx * dt;
  state.y += state.vy * dt;
}

export default function StartScreen({ onNext }) {
  const rootRef = useRef(null);
  const fieldRef = useRef(null);

  const moverRefs = useRef([]);
  const tileStateRef = useRef([]); // {x,y,vx,vy}

  const rafRef = useRef(0);
  const lastRef = useRef(performance.now());

  // Pointer tracking: position + velocity -> “moves as much as mouse moves”
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    has: false,
  });

 const tiles = useMemo(() => {
  return resumeTiles.map((t, i) => {
    const depth = 0.25 + Math.random() * 0.75;
    return {
      ...t,
      depth,
      z: Math.round(depth * 100),
      rot: (Math.random() * 2 - 1) * 2.2,
      scale: 0.92 + depth * 0.18,
      blur: (1 - depth) * 1.0,
      k: 42 + depth * 26 + (i % 4) * 3,
      damping: 0.86 + depth * 0.08,
      driftAmp: 5 + Math.random() * 7,
      driftFreq: 0.45 + Math.random() * 0.55,
      driftPhase: Math.random() * Math.PI * 2,
    };
  });
}, []);


  // Layout state (positions in the oversized field)
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Big field so some cards are outside view
      const fieldW = vw * 1.55;
      const fieldH = vh * 1.45;

      // uniform tile size (tune if you want)
      const tileW = Math.min(520, Math.max(360, vw * 0.28));
      const tileH = tileW * 0.56;

      const pos = placeTiles({
        count: tiles.length,
        fieldW,
        fieldH,
        tileW,
        tileH,
        minGap: 28,
      });

      setLayout(
        pos.map((p) => ({
          ...p,
          fieldW,
          fieldH,
          tileW,
          tileH,
        }))
      );
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [tiles.length]);

  useEffect(() => {
    // init per-tile motion state
    tileStateRef.current = tiles.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
  }, [tiles]);

  const onPointerMove = (e) => {
    const pr = pointerRef.current;
    const now = performance.now();

    if (!pr.has) {
      pr.x = e.clientX;
      pr.y = e.clientY;
      pr.vx = 0;
      pr.vy = 0;
      pr.t = now;
      pr.has = true;
      return;
    }

    const dtMs = Math.max(8, now - pr.t);
    const dx = e.clientX - pr.x;
    const dy = e.clientY - pr.y;

    // velocity in px/s (smoothed)
    const vx = (dx / dtMs) * 1000;
    const vy = (dy / dtMs) * 1000;

    pr.vx = pr.vx * 0.75 + vx * 0.25;
    pr.vy = pr.vy * 0.75 + vy * 0.25;

    pr.x = e.clientX;
    pr.y = e.clientY;
    pr.t = now;
  };

  const onPointerLeave = () => {
    const pr = pointerRef.current;
    pr.has = false;
    pr.vx = 0;
    pr.vy = 0;
  };

  useEffect(() => {
    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.033, Math.max(0.010, (now - lastRef.current) / 1000)); // seconds
      lastRef.current = now;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const pr = pointerRef.current;

      // Normalize pointer to -1..1 for position-based parallax
      const mx = pr.has ? ((pr.x / vw) - 0.5) * 2 : 0;
      const my = pr.has ? ((pr.y / vh) - 0.5) * 2 : 0;

      // Velocity normalized (so “moves as much as mouse moves”)
      const vnx = Math.max(-1, Math.min(1, pr.vx / 1400)); // tune divisor for feel
      const vny = Math.max(-1, Math.min(1, pr.vy / 1200));

      // Large, buttery field motion (brings offscreen tiles in)
      // Opposite direction of mouse movement:
      const fieldTargetX = (-mx * vw * 0.08) + (-vnx * vw * 0.06);
      const fieldTargetY = (-my * vh * 0.06) + (-vny * vh * 0.05);

      if (fieldRef.current) {
        fieldRef.current.style.transform =
          `translate(-50%, -50%) translate3d(${fieldTargetX}px, ${fieldTargetY}px, 0)`;
      }

      // Per-tile independent spring motion
      for (let i = 0; i < tiles.length; i++) {
        const mover = moverRefs.current[i];
        if (!mover) continue;

        const t = tiles[i];
        const s = tileStateRef.current[i];

        // Each tile moves a different amount (depth) + responds to velocity too
        const tileTargetX = (-mx * vw * 0.05 * t.depth) + (-vnx * vw * 0.04 * t.depth);
        const tileTargetY = (-my * vh * 0.04 * t.depth) + (-vny * vh * 0.035 * t.depth);

        // subtle drifting (alive feeling)
        const time = now / 1000;
        const driftX = Math.cos(time * (t.driftFreq * 0.9) + t.driftPhase) * (t.driftAmp * 0.55);
        const driftY = Math.sin(time * t.driftFreq + t.driftPhase) * t.driftAmp;

        springStep(
          s,
          tileTargetX + driftX,
          tileTargetY + driftY,
          t.k,
          t.damping,
          dt
        );

        mover.style.transform =
          `translate3d(${s.x}px, ${s.y}px, 0) rotate(${t.rot}deg) scale(${t.scale})`;
        mover.style.filter = `blur(${t.blur}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tiles]);

  return (
    <div
      ref={rootRef}
      className="startRoot"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="startBg" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {/* Oversized field centered */}
      <div
        ref={fieldRef}
        className="tileField"
        aria-hidden="true"
        style={{
          width: layout?.[0]?.fieldW ? `${layout[0].fieldW}px` : "155vw",
          height: layout?.[0]?.fieldH ? `${layout[0].fieldH}px` : "145vh",
        }}
      >
        {tiles.map((t, i) => {
          const p = layout[i] || { left: 0, top: 0, tileW: 420, tileH: 240 };

          return (
            <div
              key={t.id}
              className="tile"
              style={{
                left: `${p.left}px`,
                top: `${p.top}px`,
                width: `${p.tileW}px`,
                height: `${p.tileH}px`,
                zIndex: t.z,
              }}
            >
             <div ref={(n) => (moverRefs.current[i] = n)} className="tileMover">
  <img src={t.img} alt={t.title} />
  <div className="tileLabel">{t.title}</div>
</div>

            </div>
          );
        })}
      </div>

      {/* Center glass */}
      <div className="glassPanel" role="region" aria-label="Start">
        <div className="brandRow">
          {/* <EdgeLogo /> */}
          <div className="brandText">Software Developer</div>
        </div>

        <h1 className="startTitle">
          Anuragh <br />
          Vasam
        </h1>

        <button className="startBtn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}
