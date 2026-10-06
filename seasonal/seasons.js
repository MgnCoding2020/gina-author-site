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
        desc: "3 maze puzzles &mdash; help Selena find Buttons &amp; Sunny, Sunny reach her ball, and Buttons find his bed.",
        pdf: "seasonal/halloween/activities/maze.pdf",
        preview: "seasonal/halloween/activities/maze-preview.webp",
        previewAlt: "Preview of a maze puzzle leading from Selena to Buttons and Sunny.",
        width: 420,
        height: 420,
      },
      {
        id: "seasonal-dots",
        title: "Connect the Dots",
        desc: "3 connect-the-dot puzzles, numbered up to 40, revealing a jack-o'-lantern, a bat, and a little ghost.",
        pdf: "seasonal/halloween/activities/connect-the-dots.pdf",
        preview: "seasonal/halloween/activities/connect-the-dots-preview.webp",
        previewAlt: "Preview of a connect-the-dots puzzle with numbered dots.",
        width: 420,
        height: 420,
      },
      {
        id: "seasonal-paws",
        title: "Match the Spooky Tracks!",
        desc: "3 matching puzzles &mdash; a mix of Buttons' paw prints, bird tracks, and cat tracks. Find each matching pair and draw a line between them.",
        pdf: "seasonal/halloween/activities/paw-print-matching.pdf",
        preview: "seasonal/halloween/activities/paw-print-matching-preview.webp",
        previewAlt: "Preview of a track-matching worksheet with paw, bird, and cat tracks.",
        width: 420,
        height: 420,
      },
    ],
    pack: {
      label: "Download the full Halloween activity pack",
      pdf: "seasonal/halloween/activities/halloween-activity-pack.pdf",
    },
    decor: {
      lights: true,
      overlay: true,
      flyers: ["bat", "ghost"],
      bouncer: "jackolantern",
    },
  },
  fall: {
    heading: "Cozy Fall Fun with Selena &amp; Friends",
  },
  winter: {
    heading: "Winter Fun with Selena &amp; Friends",
  },
};
