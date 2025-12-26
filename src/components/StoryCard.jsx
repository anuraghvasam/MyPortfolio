export default function StoryCard({ chapter, isActive }) {
  const bg =
    chapter.media?.type === "gradient"
      ? `radial-gradient(1200px 800px at 10% 10%, ${chapter.media.c}22 0%, transparent 55%),
         linear-gradient(135deg, ${chapter.media.a}, ${chapter.media.b})`
      : "linear-gradient(135deg, #0b1220, #0b3d91)";

  return (
    <article
      className={`card ${isActive ? "cardActive" : ""}`}
      style={{ backgroundImage: bg }}
    >
      <header className="cardHeader">
        <div className="cardKicker">{chapter.kicker}</div>
        <h1 className="cardTitle">{chapter.title}</h1>
      </header>

      <p className="cardBody">{chapter.body}</p>

      <div className="cardMeta">
        {(chapter.stats ?? []).map((s) => (
          <span key={s} className="pill">
            {s}
          </span>
        ))}
      </div>

      <div className="cardActions">
        <a className="cta" href={chapter.ctaHref}>
          {chapter.ctaLabel}
        </a>
      </div>

      <div className="cardChrome" aria-hidden="true">
        <div className="dotRow">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="shine" />
      </div>
    </article>
  );
}
