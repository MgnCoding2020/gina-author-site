# Seasonal Decor Roadmap

Planning doc for the seasonal layer beyond Halloween v2. Nothing here is built yet
unless noted — this is the plan to walk the author through before fall work starts.

## Calendar (2026-2027, first year — compressed start)

| Season    | Start        | End               | Status |
|-----------|--------------|-------------------|--------|
| Halloween | 2026-10-06   | 2026-11-05        | **Live** |
| Fall      | 2026-11-06   | 2026-12-10        | Planned below |
| Winter    | 2026-12-10   | late Jan 2027 (TBD exact date) | To be road-mapped after fall ships |

Next year (2027) the plan is to restructure so fall runs from September, with
Halloween carved out as a short overlay in the middle of fall's range, then back
to fall, then winter — a normal seasonal flow instead of this year's compressed
mid-October start. Not needed for this year's build; revisit when planning 2027.

`seasonal/seasons.js` already has stub `fall` and `winter` entries (heading only,
no dates/decor) — the config structure is already set up for this; filling them
in is additive, not a redesign.

## Fall

**Decor removed from Halloween:** bats/ghosts flyers, twinkle-lights border.

**Decor kept, reworked:**
- Pumpkins — a bunched cluster of 3-4 instead of the single bouncing one.
  - Placement: not bottom-right (that's the decor toggle's spot). Leaning toward
    anchoring to page content (e.g. near the footer) rather than a fixed viewport
    corner, so it doesn't compete with UI chrome on small screens. Exact spot to
    be decided visually once it's actually built and running.
  - Motion: suggest static or a gentle sway rather than DVD-bounce — a bunched
    cluster reads more like a harvest still-life than a bouncing gag. Open to
    revisiting once we see it in place.

**New decor:**
- Falling/swaying leaves, spawning top of page and drifting down.
  - Colors: red, orange, yellow, green (deep fall palette) — all four present,
    not a rotating single color.
  - Shapes/sizes: multiple distinct leaf silhouettes and sizes, not one shape
    recolored — same lesson learned from the paw-print-matching rebuild, where
    "same shape repeated" read as low-effort/hard-to-tell-apart.
  - Architecturally this reuses the existing flyer-pool engine (concurrent
    pooled elements, spawn/recycle loop) retargeted from edge-to-edge motion to
    top-to-bottom with added rotation and horizontal sway.
- Trim: vine-and-acorn mixture replacing the lights border. Reuses the existing
  edge-strip structure (top/bottom/left/right fixed bars) built for the lights —
  re-skin the repeating "bulb" into a repeating acorn-along-a-vine motif.
- Card border decor: a **subtle** accent on shared card components — a single
  corner accent (leaf or acorn) or a thin top-edge garland, not a full border
  wrapping the card. Full coverage reads as clutter on text-heavy cards (reviews,
  descriptions) once repeated across a grid. Prototype on one card type (likely
  review cards, where the idea came from) before rolling out further.
- Leaf litter along the bottom edge — a static (non-falling) scatter of small
  leaves/acorns sitting along the bottom of the page, giving the falling leaves
  somewhere to visually "land" instead of just vanishing off-screen. Reuses the
  same edge-strip pattern as the vine/acorn trim, just denser along the bottom.
- Fall color palette for UI accents, not just decor — a `--fall-rust`/
  `--fall-gold`/deep-green token set applied the same places Halloween's
  `--seasonal-orange`/`--seasonal-purple` are used today (eyebrow text, card
  borders, etc.), so the whole site feels seasonally dressed, not just the decor
  layer on top of it. No new animation — a palette swap.

**Additional ideas, optional — decide after seeing the core build running
(better to add a character later if fall feels sparse than to overbuild and cut
something the author's already seen):**
- A scarecrow as a second static anchor, positioned opposite the pumpkin
  cluster, giving two "characters" instead of one so it reads more like a scene.
  Worth judging whether the pumpkin cluster alone already feels complete before
  adding this.
- A squirrel that peeks into a corner occasionally, pauses, then scurries off —
  reuses the flyer-pool timing logic but much simpler motion than the leaves. A
  playful bonus touch, not a core piece.

**Activities:**
- Carry the evergreen coloring/maze/connect-the-dots/matching pages forward
  (not Halloween-exclusive).
- Add 3 new fall-specific sets: a maze, a connect-the-dots, and a matching set.
- Matching set icon pool: leaf, pumpkin, scarecrow, acorn confirmed so far —
  remaining 2 of the 6-icon pool still open, to decide later (same
  derangement/no-repeat approach as the Halloween matching rebuild).

## Winter

Not road-mapped yet — pick this up once fall has shipped and had a chance to be
seen running. End date (late Jan, exact day TBD) to be nailed down then too.

## Process

Once this roadmap is fleshed out, it goes to the author for sign-off before any
fall build work starts. Same as Halloween: nothing merges to `main` until
there's an explicit go-ahead.

## Open items

- Exact pumpkin cluster placement and motion (static vs. sway) — decide visually
  once built.
- Card border decor treatment (corner accent vs. top-edge garland) — prototype
  first, decide from there.
- Final 2 of 6 fall matching-set icons.
- Winter decor concept and exact end date.
- 2027 calendar restructure (Sept-start fall with a Halloween overlay) — revisit
  well ahead of next October.
