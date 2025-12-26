import StoryCard from "./StoryCard";

export default function ChapterSection({ chapter, index, activeIndex }) {
  const isActive = index === activeIndex;

  return (
    <div className="chapterWrap">
      <div className="stack" aria-hidden="true">
        <div className="stackCard stackCard3" />
        <div className="stackCard stackCard2" />
        <div className="stackCard stackCard1" />
      </div>

      <StoryCard chapter={chapter} isActive={isActive} />
    </div>
  );
}
