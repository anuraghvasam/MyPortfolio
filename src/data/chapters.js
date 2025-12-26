export const chapters = [
  {
    id: "summary",
    month: "SUMMARY",
    title: "Summary",
    body: "4+ years .NET + SQL + reporting + production support.",
    image: "/tiles/summary.jpg",
    modal: {
      heading: "Summary",
      summary:
        "Software Engineer with 4+ years of experience building and supporting .NET desktop and web applications. Strong in C#, VB.NET, WinForms/ASP.NET, SQL Server, and automation. Experienced in production debugging, query optimization, SSRS reporting, legacy modernization, and ERP support (Macola), delivering reliable and maintainable solutions.",
      tiles: [
        { icon: "💻", text: ".NET (C#, VB.NET)" },
        { icon: "🗄️", text: "SQL Server (T-SQL)" },
        { icon: "📊", text: "SSRS Reporting" },
        { icon: "🧩", text: "Legacy modernization" },
        { icon: "🔎", text: "Production debugging" },
        { icon: "⚙️", text: "Automation & tooling" },
      ],
    },
  },

  {
    id: "education",
    month: "EDUCATION",
    title: "Education",
    body: "M.S. Data Science & Engineering • B.Tech Engineering (Gold Medalist).",
    image: "${import.meta.env.BASE_URL}tiles/education.jpg",
    modal: {
      heading: "Education",
      summary:
        "Master’s in Data Science & Engineering (University at Buffalo, SUNY) and Bachelor’s in Engineering (VNR VJIET). Strong academic performance with focus on analytical thinking and applied engineering problem solving.",
      tiles: [
        { icon: "🎓", text: "M.S. Data Science & Engg" },
        { icon: "🏫", text: "University at Buffalo" },
        { icon: "🏅", text: "Gold Medalist (B.Tech)" },
        { icon: "📈", text: "Applied analytics mindset" },
      ],
    },
  },

  {
    id: "q2_als",
    month: "Q2 ALS",
    title: "Q2 Artificial Lift Services",
    body: "Macola ERP support • SQL forecasting • SSRS reporting.",
    image: "${import.meta.env.BASE_URL}tiles/q2als.jpg",
    modal: {
      heading: "Q2 Artificial Lift Services",
      summary:
        "Supported Macola ERP modules and resolved posting, transaction, and data consistency issues. Built and optimized SQL queries for forecasting and operational analytics, and delivered SSRS reports (Aging, Forecast vs Actual, Vendor History, Sales/Order detail). Developed utilities and improvements to streamline workflows and increase reliability.",
      tiles: [
        { icon: "📦", text: "Macola ERP support" },
        { icon: "📊", text: "SSRS report suite" },
        { icon: "🧮", text: "Forecast vs Actual" },
        { icon: "🗄️", text: "SQL query optimization" },
        { icon: "🧯", text: "Production issue fixes" },
        { icon: "🔁", text: "Deployments via Git/Azure DevOps" },
      ],
    },
  },

  {
    id: "hexagon_2021_2023",
    month: "HEXAGON AB",
    title: "Hexagon AB (2021–2023)",
    body: "Smart3D workflow tooling • SQL automation • reliability improvements.",
    image: "${import.meta.env.BASE_URL}tiles/hexagon1.jpg",
    modal: {
      heading: "Hexagon AB (2021–2023)",
      summary:
        "Built .NET utilities integrated with SQL Server to automate Smart3D engineering workflows. Developed validation and reporting routines, improved reliability through rule enforcement and error handling, and debugged production issues involving data mapping and reference mismatches. Supported release cycles with regression testing and impact analysis.",
      tiles: [
        { icon: "🧰", text: ".NET utilities for Smart3D" },
        { icon: "🗄️", text: "SQL automation routines" },
        { icon: "✅", text: "Validation & rule checks" },
        { icon: "🔎", text: "Debugging & RCA" },
        { icon: "🧪", text: "Regression testing" },
        { icon: "🌍", text: "Global engineering support" },
      ],
    },
  },

  {
    id: "hexagon_2019_2021",
    month: "HEXAGON AB",
    title: "Hexagon AB (2019–2021)",
    body: "WinForms/VB.NET tools • stored procedures/views • file parsing pipelines.",
    image: "${import.meta.env.BASE_URL}tiles/hexagon2.jpg",
    modal: {
      heading: "Hexagon AB (2019–2021)",
      summary:
        "Developed WinForms/VB.NET internal applications for dataset processing and engineering workflows. Built stored procedures and views, optimized queries, modernized legacy scripts into structured modules, and implemented parsing for TXT/XML/CSV data into SQL datasets. Supported rollouts with validation and troubleshooting.",
      tiles: [
        { icon: "🖥️", text: "WinForms/VB.NET apps" },
        { icon: "🧾", text: "Stored procedures & views" },
        { icon: "⚡", text: "Query optimization" },
        { icon: "📄", text: "TXT/XML/CSV parsing" },
        { icon: "🧩", text: "Legacy refactors" },
        { icon: "🛠️", text: "User support & rollout checks" },
      ],
    },
  },

  {
  id: "skills",
  month: "SKILLS",
  title: "Skills",
  body: "Languages • Databases • Tools • Cloud • Testing • DevOps",
  image: "${import.meta.env.BASE_URL}tiles/skills.jpg", // <-- keep your image path

  modal: {
    heading: "Skills",
    summary:
      "Full-stack .NET and web development skill set spanning backend, frontend, databases, cloud, testing, and DevOps. Comfortable building, modernizing, and supporting production systems end-to-end—coding, debugging, performance tuning, and deploying through CI/CD pipelines.",

    tiles: [
      { icon: "💻", text: "Languages/Frameworks: C#, Python, Java, JavaScript, HTML, CSS, VB6, VB.NET, ASP.NET" },
      { icon: "🎨", text: "Frontend: Bootstrap, jQuery, ReactJS, Angular" },
      { icon: "🧩", text: "Backend: Entity Framework, Spring Boot, Blazor" },
      { icon: "🗄️", text: "Databases: MSSQL, Oracle, PostgreSQL, MongoDB" },
      { icon: "🧰", text: "Tools: TFS, GitHub, Visual Studio, Azure DevOps" },
      { icon: "☁️", text: "Cloud: Azure, AWS" },
      { icon: "🧪", text: "Testing: xUnit, NUnit, Moq" },
      { icon: "🚀", text: "DevOps: CI/CD (Azure DevOps), Docker, Kubernetes" },
    ],
  },
}
,

  {
    id: "projects",
    month: "PROJECTS",
    title: "Projects",
    body: "AI chatbot + automation workflows.",
    image: "${import.meta.env.BASE_URL}tiles/projects.jpg",
    modal: {
      heading: "Projects",
      summary:
        "Built an AI chatbot web application using HTML/CSS/JavaScript integrated with Google Gemini API for text and image queries. Also designed automation workflows using AI agents and orchestration concepts to reduce repetitive work and accelerate execution.",
      tiles: [
        { icon: "🤖", text: "Gemini API chatbot" },
        { icon: "🖼️", text: "Text + image queries" },
        { icon: "🧱", text: "Modular front-end code" },
        { icon: "⚙️", text: "Automation pipelines" },
        { icon: "⏱️", text: "Time-saving workflows" },
        { icon: "🧪", text: "Error handling & reliability" },
      ],
    },
  },

  {
    id: "achievements",
    month: "ACHIEVEMENTS",
    title: "Achievements",
    body: "Gold Medal • STAR Award",
    image: "${import.meta.env.BASE_URL}tiles/achievements.jpg",
    modal: {
      heading: "Achievements",
      summary:
        "Recognized for academic excellence and contributions to reliability improvements in engineering data systems and database migration enhancement work.",
      tiles: [
        { icon: "🏅", text: "Gold Medal — Best Outgoing Student" },
        { icon: "⭐", text: "STAR Award — DB Migration Enhancement" },
        { icon: "📈", text: "High ownership & delivery" },
        { icon: "🧩", text: "Quality & reliability focus" },
      ],
    },
  },
  {
  id: "final",
  month: "NEXT",
  title: "Let’s build something solid",
  body: "Resume • GitHub • LinkedIn • Contact",
  image: "${import.meta.env.BASE_URL}tiles/final.jpg", // pick a nice background image (or reuse achievements image)

  // mark as full page
  layout: "final",

  final: {
    headline: "Thanks for visiting my portfolio",
    subhead:
      "If you’re hiring for Software Engineer / Full-Stack / .NET roles, I’d love to connect. Here are my links and contact details.",

    ctas: [
      {
        label: "Download Resume (PDF)",
        href: "${import.meta.env.BASE_URL}tiles/Resume_Anuragh_Vasam.pdf", 
        icon: "⬇️",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/anuraghvasam", // replace
        icon: "in",
      },
      {
        label: "GitHub",
        href: "https://github.com/anuraghvasam", // replace
        icon: "</>",
      },
    ],

    contact: [
      { label: "Email", value: "anuraghvasam@gmail.com", href: "mailto:anuraghvasam@gmail.com" },
      { label: "Phone", value: "+1-716-253-5297", href: "tel:+17162535297" },
      { label: "Location", value: "USA (Open to Remote/Hybrid)" },
    ],

    // optional quick highlights like the tiles in the screenshot
    quickTiles: [
      { icon: "💻", text: ".NET • SQL Server • SSRS" },
      { icon: "⚙️", text: "ERP support • Production debugging" },
      { icon: "☁️", text: "Azure • AWS • CI/CD" },
      { icon: "🧪", text: "xUnit • NUnit • Moq" },
      { icon: "🚀", text: "Docker • Kubernetes" },
      { icon: "📈", text: "Reliability & performance focus" },
    ],
  },
}

];
