"""
Generates the 3 new fall-themed maze variants (PDF) that get merged onto the
end of the existing Halloween maze.pdf (see merge-fall-activities.py).

Same approach as the original Halloween maze set: a perfect maze (randomized
recursive-backtracker spanning tree over a grid) is generated per variant.
Because a spanning tree has exactly one path between any two nodes, every
maze is single-solution by construction -- no separate solver pass needed,
just a BFS reachability sanity check.

Reuses the already-approved character-art icons in
seasonal/halloween/decor/maze-icons/ for continuity with the Halloween set,
just with fall-colored wall art instead of black line art.

Usage:
    python generate-fall-maze.py

Requires: Pillow, fpdf2.
Outputs (overwrites):
    ../fall/activities/_fall-maze-new.pdf   (3 pages, merged in separately)
"""

import random
from pathlib import Path

from fpdf import FPDF

OUT_DIR = Path(__file__).resolve().parent.parent / "fall" / "activities"
PDF_PATH = OUT_DIR / "_fall-maze-new.pdf"
ICON_DIR = Path(__file__).resolve().parent.parent / "halloween" / "decor" / "maze-icons"

PAGE_W, PAGE_H = 612, 792
WALL_COLOR = (90, 60, 35)  # warm brown, distinct from the Halloween set's black lines
WALL_WIDTH = 2.2

MAZE_LEFT = 54
MAZE_RIGHT = 558
MAZE_TOP = 150
MAZE_BOTTOM = 700

VARIANTS = [
    {
        "label": "Easy",
        "cols": 8,
        "rows": 8,
        "title": "Help Selena Find Buttons & Sunny!",
        "sub": "Fall Maze - Easy. Start at Selena, end at Buttons & Sunny.",
        "start_icon": "selena.png",
        "end_icon": "buttons_sunny.png",
    },
    {
        "label": "Medium",
        "cols": 11,
        "rows": 11,
        "title": "Help Sunny Find Her Ball!",
        "sub": "Fall Maze - Medium. Start at Sunny, end at the ball.",
        "start_icon": "sunny.png",
        "end_icon": "ball.png",
    },
    {
        "label": "Tricky",
        "cols": 15,
        "rows": 15,
        "title": "Help Buttons Find His Bed!",
        "sub": "Fall Maze - Tricky. Start at Buttons, end at his bed.",
        "start_icon": "buttons.png",
        "end_icon": "bed.png",
    },
]


def generate_maze(cols, rows, seed=None):
    """Randomized recursive-backtracker. Returns a dict of (r,c) -> set of
    open directions ('N','S','E','W') -- a perfect maze (spanning tree)."""
    if seed is not None:
        random.seed(seed)
    open_dirs = {(r, c): set() for r in range(rows) for c in range(cols)}
    visited = [[False] * cols for _ in range(rows)]
    DELTAS = {"N": (-1, 0), "S": (1, 0), "E": (0, 1), "W": (0, -1)}
    OPPOSITE = {"N": "S", "S": "N", "E": "W", "W": "E"}

    stack = [(0, 0)]
    visited[0][0] = True
    while stack:
        r, c = stack[-1]
        neighbors = []
        for d, (dr, dc) in DELTAS.items():
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                neighbors.append((d, nr, nc))
        if not neighbors:
            stack.pop()
            continue
        d, nr, nc = random.choice(neighbors)
        open_dirs[(r, c)].add(d)
        open_dirs[(nr, nc)].add(OPPOSITE[d])
        visited[nr][nc] = True
        stack.append((nr, nc))
    return open_dirs


def verify_reachable(open_dirs, cols, rows, start, end):
    DELTAS = {"N": (-1, 0), "S": (1, 0), "E": (0, 1), "W": (0, -1)}
    seen = {start}
    queue = [start]
    while queue:
        r, c = queue.pop(0)
        if (r, c) == end:
            return True
        for d in open_dirs[(r, c)]:
            dr, dc = DELTAS[d]
            nxt = (r + dr, c + dc)
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)
    return end in seen


def draw_maze_page(pdf, variant, seed):
    cols, rows = variant["cols"], variant["rows"]
    open_dirs = generate_maze(cols, rows, seed=seed)
    start, end = (0, 0), (rows - 1, cols - 1)
    assert verify_reachable(open_dirs, cols, rows, start, end), "maze not solvable"

    cell_w = (MAZE_RIGHT - MAZE_LEFT) / cols
    cell_h = (MAZE_BOTTOM - MAZE_TOP) / rows

    pdf.add_page()
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(90, 80, 72)
    pdf.set_xy(0, 40)
    pdf.cell(PAGE_W, 14, "From The Selena Stories", align="C")

    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(58, 46, 38)
    pdf.set_xy(40, 60)
    pdf.multi_cell(PAGE_W - 80, 26, variant["title"], align="C")

    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(90, 80, 72)
    pdf.set_xy(0, 112)
    pdf.cell(PAGE_W, 18, variant["sub"], align="C")

    pdf.set_draw_color(*WALL_COLOR)
    pdf.set_line_width(WALL_WIDTH)

    # Outer border
    pdf.line(MAZE_LEFT, MAZE_TOP, MAZE_RIGHT, MAZE_TOP)
    pdf.line(MAZE_LEFT, MAZE_BOTTOM, MAZE_RIGHT, MAZE_BOTTOM)
    pdf.line(MAZE_LEFT, MAZE_TOP, MAZE_LEFT, MAZE_BOTTOM)
    pdf.line(MAZE_RIGHT, MAZE_TOP, MAZE_RIGHT, MAZE_BOTTOM)

    # Interior walls: for each cell, draw the S and E wall unless that
    # direction is an open passage (avoids double-drawing shared walls).
    for r in range(rows):
        for c in range(cols):
            x0 = MAZE_LEFT + c * cell_w
            y0 = MAZE_TOP + r * cell_h
            x1 = x0 + cell_w
            y1 = y0 + cell_h
            dirs = open_dirs[(r, c)]
            if "S" not in dirs and r < rows - 1:
                pdf.line(x0, y1, x1, y1)
            if "E" not in dirs and c < cols - 1:
                pdf.line(x1, y0, x1, y1)

    # Start / end icons, sized a bit larger than one cell (slight overflow
    # into the margin), matching the original Halloween set's look.
    icon_size = min(cell_w, cell_h) * 1.9
    sx0 = MAZE_LEFT + start[1] * cell_w + cell_w / 2
    sy0 = MAZE_TOP + start[0] * cell_h + cell_h / 2
    ex0 = MAZE_LEFT + end[1] * cell_w + cell_w / 2
    ey0 = MAZE_TOP + end[0] * cell_h + cell_h / 2

    pdf.image(
        str(ICON_DIR / variant["start_icon"]),
        x=sx0 - icon_size / 2, y=sy0 - icon_size / 2, w=icon_size, h=icon_size,
    )
    pdf.image(
        str(ICON_DIR / variant["end_icon"]),
        x=ex0 - icon_size / 2, y=ey0 - icon_size / 2, w=icon_size, h=icon_size,
    )

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(130, 120, 110)
    pdf.set_xy(0, PAGE_H - 46)
    pdf.cell(PAGE_W, 14, "From The Selena Stories  ·  littlesaporitopress.com", align="C")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf = FPDF(unit="pt", format=(PAGE_W, PAGE_H))
    pdf.set_auto_page_break(False)
    for i, variant in enumerate(VARIANTS):
        draw_maze_page(pdf, variant, seed=1000 + i)
    pdf.output(str(PDF_PATH))
    print(f"Wrote {PDF_PATH}")


if __name__ == "__main__":
    main()
