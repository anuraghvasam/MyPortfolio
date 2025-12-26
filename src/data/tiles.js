// export const tiles = [
//   { id: "summary",      title: "Summary",      img: "/tiles/summary.jpg" },
//   { id: "education",    title: "Education",    img: "/tiles/education.jpg" },
//   { id: "q2als",        title: "Q2 ALS",       img: "/tiles/q2als.jpg" },
//   { id: "hexagon1",     title: "Hexagon AB",   img: "/tiles/hexagon1.jpg" },
//   { id: "hexagon2",     title: "Hexagon AB",   img: "/tiles/hexagon2.jpg" },
//   { id: "skills",       title: "Skills",       img: "/tiles/skills.jpg" },
//   { id: "projects",     title: "Projects",     img: "/tiles/projects.jpg" },
//   { id: "achievements", title: "Achievements", img: "/tiles/achievements.jpg" },
// ];

const BASE = import.meta.env.BASE_URL;

export const tiles = [
  { id: "summary",      title: "Summary",      img: `${BASE}tiles/summary.jpg` },
  { id: "education",    title: "Education",    img: `${BASE}tiles/education.jpg` },
  { id: "q2als",        title: "Q2 ALS",       img: `${BASE}tiles/q2als.jpg` },
  { id: "hexagon1",     title: "Hexagon AB",   img: `${BASE}tiles/hexagon1.jpg` },
  { id: "hexagon2",     title: "Hexagon AB",   img: `${BASE}tiles/hexagon2.jpg` },
  { id: "skills",       title: "Skills",       img: `${BASE}tiles/skills.jpg` },
  { id: "projects",     title: "Projects",     img: `${BASE}tiles/projects.jpg` },
  { id: "achievements", title: "Achievements", img: `${BASE}tiles/achievements.jpg` },
];
