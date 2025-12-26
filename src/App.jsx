import { useEffect, useMemo, useRef, useState } from "react";
import { chapters as chapterData } from "./data/chapters";
import { useActiveChapter } from "./hooks/useActiveChapter";
import ProgressHUD from "./components/ProgressHUD";
import ChapterSection from "./components/ChapterSection";
import StartScreen from "./components/StartScreen";
import AltStage from "./components/AltStage";

export default function App() {
  const chapters = useMemo(() => chapterData, []);
  const sectionRefs = useRef([]);

  // existing state
  const [started, setStarted] = useState(false);

  // NEW: Edge-like alternating stage before the scroll story
  const [stageDone, setStageDone] = useState(false);

  const { activeIndex, progressPct } = useActiveChapter({
    count: chapters.length,
    getSectionEl: (i) => sectionRefs.current[i] ?? null,
  });

  useEffect(() => {
    // lock scroll during StartScreen and during AltStage
    const lock = !started || (started && !stageDone);
    document.body.classList.toggle("noScroll", lock);
    return () => document.body.classList.remove("noScroll");
  }, [started, stageDone]);

  const scrollToIndex = (idx) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onNext = () => {
    const next = Math.min(activeIndex + 1, chapters.length - 1);
    scrollToIndex(next);
  };

  const onStartNext = () => {
    setStarted(true);
    // DO NOT scroll yet; we show AltStage first
  };

  const onStageDone = () => {
    setStageDone(true);
    // after AltStage, jump to the first scroll chapter
    setTimeout(() => scrollToIndex(0), 0);
  };




  return (
    <div className="appRoot">
      {/* Landing (glass + background tiles) */}
      {!started && <StartScreen onNext={onStartNext} />}

      {/* NEW: Edge-like alternating left/right cards (Next/Prev + wheel + arrows) */}
      {started && !stageDone && (
  <AltStage
    chapters={chapters}
    onDone={onStageDone}
    onExitToLanding={() => {
      setStarted(false);
      setStageDone(false);
    }}
  />
)}


      {/* Existing HUD + scroll-snap story (unchanged) */}
      {started && stageDone && (
        <ProgressHUD
          brand="Your Name"
          subtitle="Year in Review Portfolio"
          activeIndex={activeIndex}
          total={chapters.length}
          progressPct={progressPct}
          onNext={onNext}
        />
      )}

      {started && stageDone && (
        <main className="story">
          {chapters.map((ch, i) => (
            <section
              key={ch.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="chapterViewport"
              aria-label={`Chapter ${i + 1}: ${ch.kicker}`}
            >
              <ChapterSection
                chapter={ch}
                index={i}
                activeIndex={activeIndex}
              />
            </section>
          ))}
        </main>
      )}
    </div>
  );
}
