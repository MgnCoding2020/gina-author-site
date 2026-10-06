"""
Generates the Halloween "matching pairs" printable (PDF + webp preview)
used on the seasonal activities page.

Six distinct icon shapes (dog paw, cat paw, bird track, pumpkin, witch hat,
candy corn) are drawn as flat single-color silhouettes so the worksheet
prints fine on a plain home printer. Each of the 3 pages ("Set A/B/C")
picks 5 of the 6 shapes at random with no repeats, so every pair on a
given page is visually distinct — kids match by shape, not by elimination.

Usage:
    python generate-paw-print-matching.py

Requires: Pillow, fpdf2 (both already installed in this environment).
Outputs (overwrites):
    ../halloween/activities/paw-print-matching.pdf
    ../halloween/activities/paw-print-matching-preview.webp
"""

import random
from pathlib import Path

from PIL import Image, ImageDraw
from fpdf import FPDF

OUT_DIR = Path(__file__).resolve().parent.parent / "halloween" / "activities"
PDF_PATH = OUT_DIR / "paw-print-matching.pdf"
PREVIEW_PATH = OUT_DIR / "paw-print-matching-preview.webp"

INK = (58, 46, 38, 255)  # matches the dark brown used across the Halloween decor art
SS = 4  # supersample factor for anti-aliased icon art
ICON_PX = 240 * SS  # working canvas size per icon before downscale

PAGE_W, PAGE_H = 612, 792  # US Letter, points
MARGIN = 54
ICON_PT = 56  # icon footprint on the page, points
LEFT_X = 130
RIGHT_X = 460
ROW_TOP = 210
ROW_BOTTOM = 690
ROWS = 5

SHAPES = ["dog_paw", "cat_paw", "bird_track", "pumpkin", "witch_hat", "candy_corn"]


def _canvas():
    return Image.new("RGBA", (ICON_PX, ICON_PX), (0, 0, 0, 0))


def _down(img):
    return img.resize((ICON_PX // SS, ICON_PX // SS), Image.LANCZOS)


def draw_dog_paw():
    img = _canvas()
    d = ImageDraw.Draw(img)
    c = ICON_PX / 2
    s = ICON_PX / 240
    d.ellipse([c - 46 * s, c + 5 * s, c + 46 * s, c + 75 * s], fill=INK)
    toes = [(-46, -45, 36, 46), (-12, -62, 34, 44), (20, -60, 34, 46), (50, -40, 32, 44)]
    for dx, dy, w, h in toes:
        d.ellipse(
            [c + dx * s - w * s / 2, c + dy * s - h * s / 2, c + dx * s + w * s / 2, c + dy * s + h * s / 2],
            fill=INK,
        )
    return _down(img)


def draw_cat_paw():
    img = _canvas()
    d = ImageDraw.Draw(img)
    c = ICON_PX / 2
    s = ICON_PX / 240
    # Triangular pad (vs. the dog's oval) and four small round toes pressed
    # close together in a tight arc, rather than the dog's splayed, uneven set.
    d.polygon(
        [
            (c - 34 * s, c + 68 * s),
            (c + 34 * s, c + 68 * s),
            (c + 26 * s, c + 20 * s),
            (c, c + 6 * s),
            (c - 26 * s, c + 20 * s),
        ],
        fill=INK,
    )
    toes = [(-27, -16, 22, 24), (-10, -30, 22, 24), (10, -30, 22, 24), (27, -16, 22, 24)]
    for dx, dy, w, h in toes:
        d.ellipse(
            [c + dx * s - w * s / 2, c + dy * s - h * s / 2, c + dx * s + w * s / 2, c + dy * s + h * s / 2],
            fill=INK,
        )
    return _down(img)


def draw_bird_track():
    img = _canvas()
    d = ImageDraw.Draw(img)
    c = ICON_PX / 2
    s = ICON_PX / 240
    base = (c, c + 35 * s)
    toes = [(-55, -70), (0, -85), (55, -70)]
    for tx, ty in toes:
        tip = (c + tx * s, c + ty * s)
        mx, my = (base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2
        dx, dy = tip[0] - base[0], tip[1] - base[1]
        length = (dx**2 + dy**2) ** 0.5
        nx, ny = -dy / length, dx / length
        width = 11 * s
        d.polygon(
            [
                (base[0] + nx * width, base[1] + ny * width),
                tip,
                (base[0] - nx * width, base[1] - ny * width),
            ],
            fill=INK,
        )
    back_tip = (c - 10 * s, c + 78 * s)
    d.polygon(
        [(c - 8 * s, c + 28 * s), back_tip, (c + 8 * s, c + 30 * s)],
        fill=INK,
    )
    d.ellipse([base[0] - 10 * s, base[1] - 10 * s, base[0] + 10 * s, base[1] + 10 * s], fill=INK)
    return _down(img)


def draw_pumpkin():
    img = _canvas()
    d = ImageDraw.Draw(img)
    c = ICON_PX / 2
    s = ICON_PX / 240
    d.ellipse([c - 72 * s, c - 32 * s, c + 72 * s, c + 80 * s], fill=INK)
    for gx in (-33, 0, 33):
        d.line(
            [(c + gx * s, c - 26 * s), (c + gx * s * 0.8, c + 76 * s)],
            fill=(0, 0, 0, 0),
            width=int(6 * s),
        )
    d.line([(c, c - 30 * s), (c + 10 * s, c - 58 * s)], fill=INK, width=int(11 * s))
    return _down(img)


def draw_witch_hat():
    img = _canvas()
    d = ImageDraw.Draw(img)
    c = ICON_PX / 2
    s = ICON_PX / 240
    d.polygon(
        [(c - 14 * s, c + 30 * s), (c + 22 * s, c - 85 * s), (c + 34 * s, c + 30 * s)],
        fill=INK,
    )
    d.ellipse([c - 68 * s, c + 20 * s, c + 68 * s, c + 55 * s], fill=INK)
    d.rectangle([c - 10 * s, c + 8 * s, c + 26 * s, c + 20 * s], fill=(0, 0, 0, 0))
    return _down(img)


def draw_candy_corn():
    img = _canvas()
    d = ImageDraw.Draw(img)
    c = ICON_PX / 2
    s = ICON_PX / 240
    d.polygon(
        [(c - 55 * s, c + 70 * s), (c + 55 * s, c + 70 * s), (c, c - 80 * s)],
        fill=INK,
    )
    d.line([(c - 38 * s, c + 20 * s), (c + 38 * s, c + 20 * s)], fill=(0, 0, 0, 0), width=int(7 * s))
    d.line([(c - 20 * s, c - 25 * s), (c + 20 * s, c - 25 * s)], fill=(0, 0, 0, 0), width=int(7 * s))
    return _down(img)


ICON_BUILDERS = {
    "dog_paw": draw_dog_paw,
    "cat_paw": draw_cat_paw,
    "bird_track": draw_bird_track,
    "pumpkin": draw_pumpkin,
    "witch_hat": draw_witch_hat,
    "candy_corn": draw_candy_corn,
}


def build_icon_cache(tmp_dir):
    cache = {}
    for name, builder in ICON_BUILDERS.items():
        path = tmp_dir / f"{name}.png"
        builder().save(path)
        cache[name] = path
    return cache


def derangement(items):
    order = items[:]
    while True:
        random.shuffle(order)
        if all(a != b for a, b in zip(items, order)):
            return order


def draw_page(pdf, icon_cache, set_letter):
    pdf.add_page()
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(90, 80, 72)
    pdf.set_xy(0, 40)
    pdf.cell(PAGE_W, 14, "From The Selena Stories", align="C")

    pdf.set_font("Helvetica", "B", 26)
    pdf.set_text_color(58, 46, 38)
    pdf.set_xy(0, 60)
    pdf.cell(PAGE_W, 32, "Match the Halloween Pairs!", align="C")

    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(90, 80, 72)
    pdf.set_xy(0, 100)
    pdf.cell(
        PAGE_W, 18,
        f"Set {set_letter} - draw a line to the matching picture on the right.",
        align="C",
    )

    shapes = random.sample(SHAPES, ROWS)
    right_order = derangement(shapes)

    spacing = (ROW_BOTTOM - ROW_TOP) / ROWS
    labels_num = ["1", "2", "3", "4", "5"]
    labels_letter = ["A", "B", "C", "D", "E"]

    pdf.set_font("Helvetica", "B", 16)
    for i in range(ROWS):
        row_cy = ROW_TOP + spacing * i + spacing / 2

        pdf.set_text_color(58, 46, 38)
        pdf.set_xy(LEFT_X - ICON_PT / 2 - 34, row_cy - 9)
        pdf.cell(24, 18, labels_num[i], align="C")
        pdf.image(
            str(icon_cache[shapes[i]]),
            x=LEFT_X - ICON_PT / 2, y=row_cy - ICON_PT / 2,
            w=ICON_PT, h=ICON_PT,
        )

        pdf.image(
            str(icon_cache[right_order[i]]),
            x=RIGHT_X - ICON_PT / 2, y=row_cy - ICON_PT / 2,
            w=ICON_PT, h=ICON_PT,
        )
        pdf.set_xy(RIGHT_X + ICON_PT / 2 + 10, row_cy - 9)
        pdf.cell(24, 18, labels_letter[i], align="C")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(130, 120, 110)
    pdf.set_xy(0, PAGE_H - 46)
    pdf.cell(PAGE_W, 14, "From The Selena Stories  ·  littlesaporitopress.com", align="C")


def main():
    random.seed()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    tmp_dir = OUT_DIR / "_icon_tmp"
    tmp_dir.mkdir(exist_ok=True)

    icon_cache = build_icon_cache(tmp_dir)

    pdf = FPDF(unit="pt", format=(PAGE_W, PAGE_H))
    pdf.set_auto_page_break(False)
    for set_letter in ("A", "B", "C"):
        draw_page(pdf, icon_cache, set_letter)
    pdf.output(str(PDF_PATH))

    # Preview webp: render page 1 at a readable thumbnail size via Pillow,
    # reusing the same icon art and layout logic at a smaller pixel scale.
    scale = 431 / PAGE_W
    prev = Image.new("RGB", (round(PAGE_W * scale), round(PAGE_H * scale)), "white")
    from PIL import ImageFont

    draw = ImageDraw.Draw(prev)
    try:
        font_title = ImageFont.truetype("arialbd.ttf", round(20 * scale * 2))
        font_small = ImageFont.truetype("arial.ttf", round(13 * scale * 2))
    except Exception:
        font_title = ImageFont.load_default()
        font_small = ImageFont.load_default()

    random.seed(1)
    shapes = random.sample(SHAPES, ROWS)
    right_order = derangement(shapes)
    spacing = (ROW_BOTTOM - ROW_TOP) / ROWS * scale
    for i in range(ROWS):
        row_cy = (ROW_TOP * scale) + spacing * i + spacing / 2
        icon_size = round(ICON_PT * scale)
        left_icon = Image.open(icon_cache[shapes[i]]).convert("RGBA").resize((icon_size, icon_size), Image.LANCZOS)
        right_icon = Image.open(icon_cache[right_order[i]]).convert("RGBA").resize((icon_size, icon_size), Image.LANCZOS)
        lx = round(LEFT_X * scale - icon_size / 2)
        rx = round(RIGHT_X * scale - icon_size / 2)
        ly = round(row_cy - icon_size / 2)
        prev.paste(left_icon, (lx, ly), left_icon)
        prev.paste(right_icon, (rx, ly), right_icon)

    prev.save(PREVIEW_PATH, "WEBP", quality=90)

    for f in tmp_dir.glob("*.png"):
        f.unlink()
    tmp_dir.rmdir()

    print(f"Wrote {PDF_PATH}")
    print(f"Wrote {PREVIEW_PATH}")


if __name__ == "__main__":
    main()
