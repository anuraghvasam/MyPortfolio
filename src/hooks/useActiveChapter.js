import { useEffect, useMemo, useState } from "react";

export function useActiveChapter({ count, getSectionEl }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const observerOptions = useMemo(
    () => ({
      root: null,
      threshold: [0.5],
      // Treat the “center band” of the viewport as active
      rootMargin: "-45% 0px -45% 0px",
    }),
    []
  );

  useEffect(() => {
    const els = Array.from({ length: count }, (_, i) => getSectionEl(i)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      // Pick the most visible intersecting section
      const candidates = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!candidates.length) return;

      const el = candidates[0].target;
      const idx = Number(el.getAttribute("data-index"));
      if (!Number.isNaN(idx)) setActiveIndex(idx);
    }, observerOptions);

    els.forEach((el, i) => {
      el.setAttribute("data-index", String(i));
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, [count, getSectionEl, observerOptions]);

  const progressPct =
    count <= 1 ? 100 : Math.round((activeIndex / (count - 1)) * 100);

  return { activeIndex, progressPct };
}
