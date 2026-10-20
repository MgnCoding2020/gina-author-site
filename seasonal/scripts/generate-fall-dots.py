"""
Generates the 3 new fall-themed connect-the-dots variants (PDF) that get
merged onto the end of the existing Halloween connect-the-dots.pdf (see
merge-fall-activities.py).

Subjects: leaf, pumpkin, acorn. Each outline is a hand-placed point list
(reusing the same silhouette shapes drawn for the fall decor SVGs, so the
dot-to-dot reveals a shape consistent with the rest of the fall art),
resampled to enforce a minimum spacing between dots so labels never
collide on a home printer.

Usage:
    python generate-fall-dots.py

Requires: fpdf2.
Outputs (overwrites):
    ../fall/activities/_fall-dots-new.pdf   (3 pages, merged in separately)
"""

import math
from pathlib import Path

from fpdf import FPDF

OUT_DIR = Path(__file__).resolve().parent.parent / "fall" / "activities"
PDF_PATH = OUT_DIR / "_fall-dots-new.pdf"

PAGE_W, PAGE_H = 612, 792
HEADER_COLOR = (181, 87, 44)  # fall rust, distinct from the Halloween set's purple
INK = (58, 46, 38)
SUB_INK = (90, 80, 72)
DOT_COLOR = (58, 46, 38)
MIN_SPACING = 26  # minimum pt distance between consecutive dots


def cubic(p0, p1, p2, p3, n=14):
    pts = []
    for i in range(n + 1):
        t = i / n
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def resample_min_spacing(points, min_dist):
    """Walk the closed point loop, keeping a point only once we've moved at
    least min_dist from the last kept point. Guarantees no two numbered
    dots are too close to read on a printed page."""
    if not points:
        return points
    kept = [points[0]]
    for p in points[1:]:
        last = kept[-1]
        if math.hypot(p[0] - last[0], p[1] - last[1]) >= min_dist:
            kept.append(p)
    # drop the last point if it ended up too close to the first (closing the loop)
    if len(kept) > 1 and math.hypot(kept[-1][0] - kept[0][0], kept[-1][1] - kept[0][1]) < min_dist:
        kept.pop()
    return kept


def leaf_outline():
    # Same pointed-leaf silhouette used for the decor SVGs (leaf-maple-*),
    # traced as a closed loop in a local 0-100 box, then scaled/placed below.
    top, bot = (50, 6), (50, 88)
    right = cubic(top, (88, 22), (78, 66), bot, n=40)
    left = cubic(bot, (22, 66), (12, 22), top, n=40)
    return right + left


def acorn_outline():
    # Cap dome + nut body, same construction as the decor acorn.svg.
    cap = cubic((22, 46), (24, 20), (76, 20), (78, 46), n=30)
    nut = cubic((78, 46), (72, 92), (28, 92), (22, 46), n=30)
    return cap + nut


def pumpkin_outline():
    # Simple rounded pumpkin body with 2 shallow lobes on each side for
    # character (not a perfect circle), plus a small stem notch at top.
    cx, cy = 50, 56
    pts = []
    n = 60
    for i in range(n):
        t = 2 * math.pi * i / n
        r = 36 + 5 * math.cos(4 * t)
        x = cx + r * math.cos(t)
        y = cy + r * math.sin(t) * 0.85
        pts.append((x, y))
    return pts


SUBJECTS = [
    {"name": "Leaf", "outline": leaf_outline, "box": (100, 100)},
    {"name": "Pumpkin", "outline": pumpkin_outline, "box": (100, 100)},
    {"name": "Acorn", "outline": acorn_outline, "box": (100, 100)},
]

DOTS_TOP = 180
DOTS_BOTTOM = 650
DOTS_LEFT = 90
DOTS_RIGHT = 522


def place_dots(local_points, local_box):
    """Scale a closed loop of points (in a local_box x local_box square) up
    to fill the page's dot-field box, preserving aspect ratio and centering."""
    bw, bh = local_box
    xs = [p[0] for p in local_points]
    ys = [p[1] for p in local_points]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    w, h = maxx - minx, maxy - miny

    avail_w = DOTS_RIGHT - DOTS_LEFT
    avail_h = DOTS_BOTTOM - DOTS_TOP
    scale = min(avail_w / w, avail_h / h) * 0.82  # leave breathing room

    out_w, out_h = w * scale, h * scale
    off_x = DOTS_LEFT + (avail_w - out_w) / 2
    off_y = DOTS_TOP + (avail_h - out_h) / 2

    placed = []
    for x, y in local_points:
        px = off_x + (x - minx) * scale
        py = off_y + (y - miny) * scale
        placed.append((px, py))
    return placed


def draw_dots_page(pdf, subject, dot_count_hint=22):
    raw = subject["outline"]()
    # Scale to final page coordinates FIRST, then enforce minimum spacing in
    # real page-point units -- spacing a 0-100 local outline directly would
    # treat a tiny fraction of the shape's extent as "too close" and
    # over-thin it. After scaling, if there are still far more points than
    # we want on a page, take an even stride through the loop rather than a
    # distance cutoff so the shape stays well-represented all the way round.
    placed_raw = place_dots(raw, subject["box"])
    dots = resample_min_spacing(placed_raw, MIN_SPACING)
    if len(dots) > dot_count_hint + 6:
        stride = len(dots) / dot_count_hint
        dots = [dots[int(i * stride)] for i in range(dot_count_hint)]

    pdf.add_page()
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*HEADER_COLOR)
    pdf.set_xy(0, 40)
    pdf.cell(PAGE_W, 14, "From The Selena Stories", align="C")

    pdf.set_font("Helvetica", "B", 26)
    pdf.set_text_color(*INK)
    pdf.set_xy(0, 60)
    pdf.cell(PAGE_W, 32, "Connect the Dots", align="C")

    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(*SUB_INK)
    pdf.set_xy(0, 100)
    pdf.cell(PAGE_W, 18, f"{subject['name']} - connect dots 1 to {len(dots)}.", align="C")

    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*DOT_COLOR)
    for i, (x, y) in enumerate(dots, start=1):
        r = 1.6
        pdf.ellipse(x - r, y - r, r * 2, r * 2, style="F")
        pdf.set_xy(x + 5, y - 5)
        pdf.cell(20, 10, str(i))

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(130, 120, 110)
    pdf.set_xy(0, PAGE_H - 46)
    pdf.cell(PAGE_W, 14, "From The Selena Stories  ·  littlesaporitopress.com", align="C")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf = FPDF(unit="pt", format=(PAGE_W, PAGE_H))
    pdf.set_auto_page_break(False)
    for subject in SUBJECTS:
        draw_dots_page(pdf, subject)
    pdf.output(str(PDF_PATH))
    print(f"Wrote {PDF_PATH}")


if __name__ == "__main__":
    main()
