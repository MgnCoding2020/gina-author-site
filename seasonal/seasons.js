/* Seasonal layer configuration.
   Dates are inclusive, local time, "YYYY-MM-DD". A season with no "start"/"end"
   is not active yet (headings-only placeholder for a future fast-follow). */
window.SEASONS_CONFIG = {
  halloween: {
    start: "2026-10-06",
    end: "2026-11-05",
    eyebrow: "Limited time",
    heading: "Happy Haunting with Selena &amp; Buttons!",
    intro:
      "A few free Halloween treats from <em>A Puppy for Selena</em> &mdash; coloring pages, a maze, and more. Print as many as you like, on us.",
    cards: [
      {
        id: "seasonal-coloring",
        title: "Coloring Pages &mdash; Selena, Buttons &amp; Sunny",
        desc: "8 hand-illustrated coloring pages following Selena, Buttons, and Sunny through pumpkin patches, hayrides, and cozy fall days.",
        pdf: "seasonal/activities/coloring/coloring-pages.pdf",
        preview: "seasonal/activities/coloring/coloring-pages-preview.webp",
        previewAlt:
          "Preview of a coloring page: Selena carving a jack-o'-lantern with her puppy Buttons beside her.",
        width: 420,
        height: 543,
      },
      {
        id: "seasonal-maze",
        title: "Maze Time with Selena &amp; Friends!",
        desc: "6 maze puzzles &mdash; help Selena find Buttons &amp; Sunny, Sunny reach her ball, and Buttons find his bed.",
        pdf: "seasonal/activities/maze.pdf",
        preview: "seasonal/activities/maze-preview.webp",
        previewAlt: "Preview of a maze puzzle leading from Selena to Buttons and Sunny.",
        width: 420,
        height: 420,
      },
      {
        id: "seasonal-dots",
        title: "Connect the Dots",
        desc: "6 connect-the-dot puzzles, numbered up to 40, revealing a jack-o'-lantern, a bat, a little ghost, a falling leaf, a pumpkin, and an acorn.",
        pdf: "seasonal/activities/connect-the-dots.pdf",
        preview: "seasonal/activities/connect-the-dots-preview.webp",
        previewAlt: "Preview of a connect-the-dots puzzle with numbered dots.",
        width: 420,
        height: 420,
      },
      {
        id: "seasonal-paws",
        title: "Match the Pairs!",
        desc: "6 matching puzzles &mdash; paw prints and bird tracks alongside fall favorites like leaves, acorns, and apples. Find each matching pair and draw a line between them.",
        pdf: "seasonal/activities/paw-print-matching.pdf",
        preview: "seasonal/activities/paw-print-matching-preview.webp",
        previewAlt: "Preview of a matching worksheet with paw prints, tracks, and fall icons.",
        width: 420,
        height: 420,
      },
    ],
    pack: {
      label: "Download the full activity pack",
      pdf: "seasonal/activities/activity-pack.pdf",
    },
    decor: {
      lights: true,
      overlay: true,
      flyers: ["bat", "ghost"],
      bouncer: "jackolantern",
    },
  },
  fall: {
    start: "2026-11-06",
    end: "2026-12-10",
    eyebrow: "Falling into fun",
    heading: "Cozy Fall Fun with Selena &amp; Friends",
    intro:
      "Free fall treats from <em>A Puppy for Selena</em> &mdash; coloring pages, mazes, and more. Print as many as you like, on us.",
    cards: [
      {
        id: "seasonal-coloring",
        title: "Coloring Pages &mdash; Selena, Buttons &amp; Sunny",
        desc: "8 hand-illustrated coloring pages following Selena, Buttons, and Sunny through pumpkin patches, hayrides, and cozy fall days.",
        pdf: "seasonal/activities/coloring/coloring-pages.pdf",
        preview: "seasonal/activities/coloring/coloring-pages-preview.webp",
        previewAlt:
          "Preview of a coloring page: Selena carving a jack-o'-lantern with her puppy Buttons beside her.",
        width: 420,
        height: 543,
      },
      {
        id: "seasonal-maze",
        title: "Maze Time with Selena &amp; Friends!",
        desc: "6 maze puzzles &mdash; help Selena find Buttons &amp; Sunny, Sunny reach her ball, and Buttons find his bed.",
        pdf: "seasonal/activities/maze.pdf",
        preview: "seasonal/activities/maze-preview.webp",
        previewAlt: "Preview of a maze puzzle leading from Selena to Buttons and Sunny.",
        width: 420,
        height: 420,
      },
      {
        id: "seasonal-dots",
        title: "Connect the Dots",
        desc: "6 connect-the-dot puzzles, numbered up to 40, revealing a jack-o'-lantern, a bat, a little ghost, a falling leaf, a pumpkin, and an acorn.",
        pdf: "seasonal/activities/connect-the-dots.pdf",
        preview: "seasonal/activities/connect-the-dots-preview.webp",
        previewAlt: "Preview of a connect-the-dots puzzle with numbered dots.",
        width: 420,
        height: 420,
      },
      {
        id: "seasonal-paws",
        title: "Match the Pairs!",
        desc: "6 matching puzzles &mdash; paw prints and bird tracks alongside fall favorites like leaves, acorns, and apples. Find each matching pair and draw a line between them.",
        pdf: "seasonal/activities/paw-print-matching.pdf",
        preview: "seasonal/activities/paw-print-matching-preview.webp",
        previewAlt: "Preview of a matching worksheet with paw prints, tracks, and fall icons.",
        width: 420,
        height: 420,
      },
    ],
    pack: {
      label: "Download the full activity pack",
      pdf: "seasonal/activities/activity-pack.pdf",
    },
    decor: {
      leaves: [
        "leaf-maple-red", "leaf-maple-orange", "leaf-maple-yellow", "leaf-maple-green",
        "leaf-oak-red", "leaf-oak-orange", "leaf-oak-yellow", "leaf-oak-green"
      ],
      pumpkinCluster: true,
      trim: true,
      leafPile: true,
      cardAccent: true,
      scarecrowAnchor: true,
      squirrel: true,
    },
  },
  winter: {
    heading: "Winter Fun with Selena &amp; Friends",
  },
};
