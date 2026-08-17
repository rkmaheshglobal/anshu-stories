#!/usr/bin/env python3
"""Build KDP 6x9 interior + wraparound cover for From Streets to Snuggles.

Source text is copied from this folder’s HTML without rewriting Anshika's story.
Run from anywhere:

    python3 kdp/from-streets-to-snuggles/build.py
"""
from __future__ import annotations

import html as html_lib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.platypus import Frame, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
STORY = HERE / "from-streets-to-snuggles.html"
IMG_DIR = ROOT / "anshika-mahesh-site/stories/images/streets"
COVER_SRC = IMG_DIR / "cover.png"
CAST_DIR = HERE / "cast"
PLATE_DIR = HERE / "plates"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

PAGE_W, PAGE_H = 6 * inch, 9 * inch
INK = HexColor("#1c2430")
SOFT = HexColor("#4a5563")
MOSS = HexColor("#5d7f62")
SKY = HexColor("#3d7f99")
PAPER = HexColor("#fffdf9")
LINE = HexColor("#d9d0c4")

# Color paperback spine (KDP help): page count × 0.002347 in
SPINE_PER_PAGE = 0.002347
BLEED = 0.125
BARCODE_W, BARCODE_H = 2.0, 1.2


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Georgia", str(FONT_DIR / "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", str(FONT_DIR / "Georgia Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Italic", str(FONT_DIR / "Georgia Italic.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-BoldItalic", str(FONT_DIR / "Georgia Bold Italic.ttf")))


def parse_story() -> dict:
    raw = STORY.read_text(encoding="utf-8")
    toc = []
    for title, summary in re.findall(
        r"<li><a href=\"#ch\d+\"><span>\s*([^<]+)</span><span class=\"sum\">([^<]+)</span></a></li>",
        raw,
    ):
        toc.append({"title": html_lib.unescape(title.strip()), "summary": html_lib.unescape(summary.strip())})

    chapters = []
    blocks = re.findall(
        r'<section class="page chapter" id="ch(\d+)">(.*?)</section>',
        raw,
        re.S,
    )
    for num, body in blocks:
        title_m = re.search(r"<h2>([^<]+)</h2>", body)
        paras = [html_lib.unescape(p.strip()) for p in re.findall(r"<p[^>]*>(.*?)</p>", body, re.S)]
        paras = [re.sub(r"<[^>]+>", "", p) for p in paras]
        paras = [re.sub(r"\s+", " ", p).strip() for p in paras if p.strip()]
        chapters.append(
            {
                "num": int(num),
                "title": html_lib.unescape(title_m.group(1)) if title_m else f"Chapter {num}",
                "paragraphs": paras,
            }
        )
    return {"toc": toc, "chapters": chapters}


def styles() -> dict:
    return {
        "body": ParagraphStyle(
            "body",
            fontName="Georgia",
            fontSize=11,
            leading=16,
            textColor=INK,
            alignment=TA_JUSTIFY,
            firstLineIndent=14,
            spaceAfter=8,
        ),
        "body_first": ParagraphStyle(
            "body_first",
            fontName="Georgia",
            fontSize=11,
            leading=16,
            textColor=INK,
            alignment=TA_JUSTIFY,
            firstLineIndent=0,
            spaceAfter=8,
        ),
        "end": ParagraphStyle(
            "end",
            fontName="Georgia-Italic",
            fontSize=12,
            leading=18,
            textColor=SOFT,
            alignment=TA_CENTER,
            spaceBefore=18,
        ),
        "copy": ParagraphStyle(
            "copy",
            fontName="Georgia",
            fontSize=9.5,
            leading=14,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "toc_line": ParagraphStyle(
            "toc_line",
            fontName="Georgia",
            fontSize=10,
            leading=14,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=1,
        ),
        "toc_sum": ParagraphStyle(
            "toc_sum",
            fontName="Georgia-Italic",
            fontSize=8.5,
            leading=11,
            textColor=SOFT,
            alignment=TA_LEFT,
            spaceAfter=5,
        ),
        "blurb": ParagraphStyle(
            "blurb",
            fontName="Georgia-Italic",
            fontSize=13,
            leading=20,
            textColor=SOFT,
            alignment=TA_CENTER,
        ),
    }


def margins_for(page_num: int) -> tuple[float, float, float, float]:
    """left, right, top, bottom. Odd pages are recto (gutter on the left)."""
    top, bottom = 0.7 * inch, 0.7 * inch
    inner, outer = 0.85 * inch, 0.6 * inch
    if page_num % 2 == 1:
        return inner, outer, top, bottom
    return outer, inner, top, bottom


class Book:
    def __init__(self, path: Path):
        self.path = path
        self.c = pdfcanvas.Canvas(str(path), pagesize=(PAGE_W, PAGE_H))
        self.c.setTitle("From Streets to Snuggles")
        self.c.setAuthor("Anshika Mahesh")
        self.c.setCreator("anshikamahesh.com")
        self.page = 0
        self.styles = styles()

    def show(self) -> None:
        if self.page:
            self.c.showPage()
        self.page += 1

    def box(self) -> tuple[float, float, float, float]:
        left, right, top, bottom = margins_for(self.page)
        return left, bottom, PAGE_W - left - right, PAGE_H - top - bottom

    def folio(self, *, hide: bool = False) -> None:
        if hide or self.page < 5:
            return
        self.c.setFillColor(SOFT)
        self.c.setFont("Georgia", 9)
        y = 0.38 * inch
        label = str(self.page)
        if self.page % 2 == 1:
            self.c.drawRightString(PAGE_W - 0.55 * inch, y, label)
        else:
            self.c.drawString(0.55 * inch, y, label)

    def running(self, text: str) -> None:
        if self.page < 7:
            return
        self.c.setFillColor(SKY)
        self.c.setFont("Georgia", 7.5)
        left, right, top, _ = margins_for(self.page)
        y = PAGE_H - 0.42 * inch
        self.c.drawCentredString(PAGE_W / 2, y, text.upper())
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.4)
        self.c.line(left, y - 6, PAGE_W - right, y - 6)

    def save(self) -> int:
        self.c.save()
        return self.page


def draw_image(c: pdfcanvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    img = Image.open(path)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    iw, ih = img.size
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    tmp = HERE / ".cache" / path.name
    tmp.parent.mkdir(exist_ok=True)
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        out = tmp.with_suffix(".jpg")
        img.save(out, "JPEG", quality=92)
    else:
        out = tmp.with_suffix(".png")
        img.save(out, "PNG")
    c.drawImage(str(out), dx, dy, width=dw, height=dh, mask="auto")


CAST_BOXES = {
    "trio": (80, 280, 960, 1240),
    "golden": (40, 580, 520, 1180),
    "snowy": (500, 600, 980, 1180),
    "dogs": (60, 620, 980, 1220),
}
CAST_ORDER = ("trio", "golden", "snowy", "dogs")


def portrait_for(num: int, portraits: list[Path]) -> Path:
    """Same cover painting, cropped to follow the story: alone, then pair, then family."""
    trio, golden, snowy, dogs = portraits
    if num <= 2:
        return golden
    if num <= 9:
        return dogs if num % 2 else snowy
    if num <= 22:
        return trio if num % 2 else dogs
    return trio


def circle_crop(im: Image.Image, box: tuple[int, int, int, int], size: int = 900) -> Image.Image:
    crop = im.crop(box).convert("RGB")
    w, h = crop.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    sq = crop.crop((left, top, left + side, top + side)).resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, size - 2, size - 2), fill=255)
    out = sq.convert("RGBA")
    out.putalpha(mask)
    return out


def make_cast() -> list[Path]:
    CAST_DIR.mkdir(exist_ok=True)
    cover = Image.open(COVER_SRC).convert("RGB")
    paths = []
    for name in CAST_ORDER:
        path = CAST_DIR / f"{name}.png"
        circle_crop(cover, CAST_BOXES[name]).save(path, "PNG")
        paths.append(path)
    return paths


def draw_vignette(c: pdfcanvas.Canvas, path: Path, cx: float, cy: float, diameter: float) -> None:
    r = diameter / 2
    c.drawImage(str(path), cx - r, cy - r, width=diameter, height=diameter, mask="auto")
    c.setStrokeColor(SKY)
    c.setLineWidth(0.9)
    c.circle(cx, cy, r + 2, stroke=1, fill=0)


def build_interior(data: dict) -> int:
    register_fonts()
    book = Book(HERE / "interior.pdf")
    S = book.styles

    # 1 half-title
    book.show()
    book.folio(hide=True)
    x, y, w, h = book.box()
    book.c.setFillColor(INK)
    book.c.setFont("Georgia-Bold", 22)
    book.c.drawCentredString(PAGE_W / 2, PAGE_H / 2 + 8, "From Streets to Snuggles")
    book.c.setFont("Georgia-Italic", 11)
    book.c.setFillColor(SOFT)
    book.c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 18, "A tale of kindness, rescue, and belonging")

    # 2 blank
    book.show()
    book.folio(hide=True)

    # 3 title
    book.show()
    book.folio(hide=True)
    x, y, w, h = book.box()
    if COVER_SRC.exists():
        draw_image(book.c, COVER_SRC, x, y + h * 0.38, w, h * 0.58)
    book.c.setFillColor(INK)
    book.c.setFont("Georgia-Bold", 20)
    book.c.drawCentredString(PAGE_W / 2, y + h * 0.28, "From Streets to Snuggles")
    book.c.setFont("Georgia-Italic", 11)
    book.c.setFillColor(SOFT)
    book.c.drawCentredString(PAGE_W / 2, y + h * 0.22, "A tale of kindness, rescue, and belonging")
    book.c.setFillColor(SKY)
    book.c.setFont("Georgia-Bold", 10)
    book.c.drawCentredString(PAGE_W / 2, y + h * 0.12, "ANSHIKA MAHESH")
    book.c.setFillColor(SOFT)
    book.c.setFont("Georgia", 8)
    book.c.drawCentredString(PAGE_W / 2, y + 8, "First paperback edition")

    # 4 copyright
    book.show()
    book.folio(hide=True)
    x, y, w, h = book.box()
    copy = [
        "<b>From Streets to Snuggles</b>",
        "Copyright © 2025 Anshika Mahesh",
        "First paperback edition 2026",
        "All rights reserved. No part of this book may be reproduced without permission from the author, except for brief quotations in a review.",
        "This is a work of fiction. Names, characters, and incidents are from the author’s imagination.",
        "Cover painting of Sam and the two dogs. Interior chapter pictures follow each chapter’s scene, using those same characters. Some interiors were made with image-generation tools; disclose this in the KDP upload form.",
        "Printed independently via Amazon KDP. The ISBN, if any, is assigned in the KDP dashboard.",
        "anshikamahesh.com",
    ]
    frame = Frame(x, y + 0.15 * inch, w, h * 0.45, showBoundary=0)
    frame.addFromList([Paragraph(p, S["copy"]) for p in copy], book.c)

    # 5 contents
    book.show()
    book.folio()
    x, y, w, h = book.box()
    book.c.setFillColor(SKY)
    book.c.setFont("Georgia-Bold", 9)
    book.c.drawString(x, y + h - 6, "CONTENTS")
    book.c.setFillColor(INK)
    book.c.setFont("Georgia-Bold", 16)
    book.c.drawString(x, y + h - 28, "Twenty-five chapters")
    items = []
    for i, row in enumerate(data["toc"], 1):
        items.append(Paragraph(f"{i}. {row['title']}", S["toc_line"]))
        items.append(Paragraph(row["summary"], S["toc_sum"]))
    frame = Frame(x, y, w, h - 44, showBoundary=0)
    leftover = []
    # addFromList consumes the list; copy first
    story = list(items)
    frame.addFromList(story, book.c)
    leftover = story

    # 6 contents continued, or blank. Chapters open as a facing spread:
    # even (left) = picture, odd (right) = words for the same chapter.
    book.show()
    if leftover:
        book.folio()
        x, y, w, h = book.box()
        frame = Frame(x, y, w, h, showBoundary=0)
        frame.addFromList(leftover, book.c)
    else:
        book.folio(hide=True)

    for ch in data["chapters"]:
        # Art must land on an even page (left) so it faces its own text.
        if book.page % 2 == 0:
            book.show()
            book.folio(hide=True)
        book.show()
        book.running("From Streets to Snuggles")
        book.folio()
        x, y, w, h = book.box()
        book.c.setFillColor(SKY)
        book.c.setFont("Georgia-Bold", 9)
        book.c.drawCentredString(PAGE_W / 2, y + h - 4, f"CHAPTER {ch['num']}")
        book.c.setFillColor(INK)
        book.c.setFont("Georgia-Bold", 15)
        book.c.drawCentredString(PAGE_W / 2, y + h - 24, ch["title"])
        plate = PLATE_DIR / f"ch-{ch['num']:02d}.png"
        if plate.exists():
            draw_image(book.c, plate, x, y, w, h - 40)

        book.show()
        book.running(ch["title"])
        book.folio()
        x, y, w, h = book.box()
        paras = []
        for i, text in enumerate(ch["paragraphs"]):
            style = S["body_first"] if i == 0 else S["body"]
            paras.append(Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), style))
        frame = Frame(x, y, w, h, showBoundary=0)
        overflow = list(paras)
        frame.addFromList(overflow, book.c)
        while overflow:
            book.show()
            book.running(ch["title"])
            book.folio()
            x, y, w, h = book.box()
            frame = Frame(x, y, w, h, showBoundary=0)
            frame.addFromList(overflow, book.c)

    # The End
    if book.page % 2 == 1:
        book.show()
        book.folio(hide=True)
    book.show()
    book.folio()
    x, y, w, h = book.box()
    book.c.setFillColor(INK)
    book.c.setFont("Georgia-Bold", 22)
    book.c.drawCentredString(PAGE_W / 2, PAGE_H / 2 + 20, "The End")
    frame = Frame(x, PAGE_H / 2 - 80, w, 70, showBoundary=0)
    frame.addFromList(
        [Paragraph("And now we leave them to dream of new adventures.", S["end"])],
        book.c,
    )

    # About
    book.show()
    book.folio()
    x, y, w, h = book.box()
    book.c.setFillColor(SKY)
    book.c.setFont("Georgia-Bold", 9)
    book.c.drawString(x, y + h - 6, "ABOUT THE BOOK")
    about = [
        "When Sam, a kind-hearted young boy, rescues Fluffy, their bond grows stronger with each passing day. They embark on countless adventures—learning tricks, visiting the vet, making new friends, and even taking a holiday to Goa!",
        "Perfect for animal lovers and young readers, this touching story reminds us that sometimes, the greatest journeys begin with a single act of kindness.",
        "Anshika Mahesh writes stories about friendship, courage, and kindness. Read more at anshikamahesh.com.",
    ]
    frame = Frame(x, y, w, h - 28, showBoundary=0)
    frame.addFromList([Paragraph(p, S["copy"]) for p in about], book.c)

    # even page count (KDP)
    if book.page % 2 == 1:
        book.show()
        book.folio(hide=True)

    return book.save()


def cover_size(page_count: int) -> tuple[float, float, float]:
    spine = page_count * SPINE_PER_PAGE
    width = BLEED + 6 + spine + 6 + BLEED
    height = BLEED + 9 + BLEED
    return width, height, spine


def build_cover(page_count: int) -> dict:
    width_in, height_in, spine_in = cover_size(page_count)
    dpi = 300
    W, H = int(round(width_in * dpi)), int(round(height_in * dpi))
    spine_px = int(round(spine_in * dpi))
    bleed_px = int(round(BLEED * dpi))
    panel = int(round(6 * dpi))

    img = Image.new("RGB", (W, H), "#f4efe6")
    draw = ImageDraw.Draw(img)

    back_x0 = 0
    back_x1 = bleed_px + panel
    spine_x0 = back_x1
    spine_x1 = spine_x0 + spine_px
    front_x0 = spine_x1
    front_x1 = W

    # spine
    draw.rectangle((spine_x0, 0, spine_x1, H), fill="#3d7f99")

    # front art
    cover = Image.open(COVER_SRC).convert("RGB")
    front_w = front_x1 - front_x0
    fitted = ImageEnhance.Contrast(cover).enhance(1.02)
    # cover the front panel including bleed on right/top/bottom
    scale = max(front_w / fitted.width, H / fitted.height)
    nw, nh = int(fitted.width * scale), int(fitted.height * scale)
    fitted = fitted.resize((nw, nh), Image.Resampling.LANCZOS)
    fx = front_x0 + (front_w - nw) // 2
    fy = (H - nh) // 2
    img.paste(fitted, (fx, fy))

    # type bands on front
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle((front_x0, 0, front_x1, int(1.55 * dpi)), fill=(28, 36, 48, 150))
    od.rectangle((front_x0, H - int(1.35 * dpi), front_x1, H), fill=(28, 36, 48, 150))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype(str(FONT_DIR / "Georgia Bold.ttf"), 64)
        sub_font = ImageFont.truetype(str(FONT_DIR / "Georgia Italic.ttf"), 28)
        author_font = ImageFont.truetype(str(FONT_DIR / "Georgia Bold.ttf"), 26)
        back_title = ImageFont.truetype(str(FONT_DIR / "Georgia Bold.ttf"), 36)
        back_body = ImageFont.truetype(str(FONT_DIR / "Georgia.ttf"), 22)
        back_small = ImageFont.truetype(str(FONT_DIR / "Georgia Italic.ttf"), 18)
    except OSError:
        title_font = sub_font = author_font = back_title = back_body = back_small = ImageFont.load_default()

    def centre_text(text, font, cx, cy, fill="white"):
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        draw.text((cx - tw / 2, cy - th / 2), text, font=font, fill=fill)

    cx = front_x0 + front_w / 2
    centre_text("FROM STREETS", title_font, cx, 0.55 * dpi)
    centre_text("TO SNUGGLES", title_font, cx, 0.90 * dpi)
    centre_text("A tale of kindness, rescue, and belonging", sub_font, cx, 1.22 * dpi)
    centre_text("ANSHIKA MAHESH", author_font, cx, H - 0.62 * dpi)

    # back
    margin = bleed_px + int(0.45 * dpi)
    draw.rectangle((0, 0, back_x1, H), fill="#f7f4ef")
    # restore spine over any overlap
    draw.rectangle((spine_x0, 0, spine_x1, H), fill="#3d7f99")

    centre_text("From Streets to Snuggles", back_title, (bleed_px + back_x1) / 2, 1.15 * dpi, fill="#1c2430")
    blurb = (
        "In a heartwarming tale of love, friendship, and second chances, "
        "Fluffy and Snowy find their way from the harsh streets to a loving home — "
        "thanks to one kind boy named Sam."
    )
    # wrap blurb
    max_w = panel - int(0.9 * dpi)
    words = blurb.split()
    lines, line = [], ""
    for word in words:
        trial = (line + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=back_body)[2] <= max_w:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    by = 1.7 * dpi
    for ln in lines:
        bbox = draw.textbbox((0, 0), ln, font=back_body)
        tw = bbox[2] - bbox[0]
        draw.text(((bleed_px + back_x1 - tw) / 2, by), ln, font=back_body, fill="#4a5563")
        by += 34

    about = "Anshika Mahesh  ·  anshikamahesh.com"
    bbox = draw.textbbox((0, 0), about, font=back_small)
    tw = bbox[2] - bbox[0]
    draw.text(((bleed_px + back_x1 - tw) / 2, by + 28), about, font=back_small, fill="#3d7f99")

    # KDP barcode reserve (back, bottom-right, 0.25 in from trim)
    trim_right = back_x1
    trim_bottom = H - bleed_px
    box_w, box_h = int(BARCODE_W * dpi), int(BARCODE_H * dpi)
    inset = int(0.25 * dpi)
    bx1 = trim_right - inset
    by1 = trim_bottom - inset
    bx0, by0 = bx1 - box_w, by1 - box_h
    draw.rectangle((bx0, by0, bx1, by1), fill="white", outline="#d9d0c4")

    png_path = HERE / "cover-wrap.png"
    img.save(png_path, "PNG")

    # PDF page exactly the wrap size
    pdf_path = HERE / "cover-wrap.pdf"
    c = pdfcanvas.Canvas(str(pdf_path), pagesize=(width_in * inch, height_in * inch))
    c.setTitle("From Streets to Snuggles — cover wrap")
    c.setAuthor("Anshika Mahesh")
    c.drawImage(str(png_path), 0, 0, width=width_in * inch, height=height_in * inch)
    c.save()
    return {
        "page_count": page_count,
        "trim": "6 × 9 in",
        "bleed": f"{BLEED} in",
        "spine_in": round(spine_in, 4),
        "cover_width_in": round(width_in, 4),
        "cover_height_in": round(height_in, 4),
        "barcode": "White box reserved on back cover; KDP adds the barcode.",
        "spine_text": "None — under 79 pages, spine is too thin for type.",
        "interior": "interior.pdf",
        "cover": "cover-wrap.pdf",
        "ink": "Premium color, white paper (unique color plate per chapter).",
        "bleed_interior": "No bleed — art is inset inside margins.",
    }


def write_readme(spec: dict) -> None:
    (HERE / "README.md").write_text(
        f"""# From Streets to Snuggles — KDP files

Generated from the site story. Text is Anshika’s, not rewritten.

## Files to upload

| KDP field | File |
| --- | --- |
| Paperback interior | `interior.pdf` ({spec['page_count']} pages, 6 × 9 in, **no bleed**) |
| Paperback cover | `cover-wrap.pdf` ({spec['cover_width_in']} × {spec['cover_height_in']} in, **with 0.125 in bleed**) |
| Kindle manuscript | `from-streets-to-snuggles-kindle.docx` (upload this) |
| Kindle manuscript fallback | `from-streets-to-snuggles-kindle.epub` |
| Kindle cover | `kindle-cover.jpg` (1600 × 2560, RGB JPEG) |

Rebuild after any text or art change:

```bash
python3 kdp/from-streets-to-snuggles/build.py
python3 kdp/from-streets-to-snuggles/build_kindle.py
```

## KDP paperback settings

1. Create a new paperback (not hardcover yet).
2. Language: English. Title: **From Streets to Snuggles**. Subtitle: **A tale of kindness, rescue, and belonging**. Author: **Anshika Mahesh**.
3. Age: 6–8. Categories: Juvenile Fiction / Animals / Dogs; Social Themes / Friendship.
4. Print options: **6 × 9 in**, **Premium color**, **white paper**, **no bleed**.
5. Upload `interior.pdf`. Confirm KDP counts **{spec['page_count']}** pages.
6. Upload `cover-wrap.pdf` (or use Cover Creator only if you abandon this wrap).
7. Pass **Print Previewer**. Order a **proof copy**. Do not publish until the proof is in your hands.
8. Do **not** enroll in KDP Select while the story is free on anshikamahesh.com.

## KDP Kindle eBook settings

Create this as a **new Kindle eBook** on the same Bookshelf title (or link it to the paperback). Use the same title, subtitle, author, age, categories, keywords, and description as the paperback.

1. Upload `from-streets-to-snuggles-kindle.docx` as the manuscript. If KDP still fails, try `from-streets-to-snuggles-kindle.epub`. Do **not** upload the website `.html`, the print PDF, or the older `.epub`.
2. Upload `kindle-cover.jpg` as the eBook cover (separate from the wrap PDF).
3. Tick the AI-generated images disclosure.
4. Preview on phone, tablet, and e-ink in KDP Previewer.
5. DRM: leave **off** — the story is already free on the site.
6. Do **not** enroll in KDP Select (the site copy would violate exclusivity).
7. Suggested list price: **$2.99** (70% royalty if the file stays under ~10 MB). If delivery cost looks high on the pricing page, use **35%** instead.

Spine width used: **{spec['spine_in']} in** (no spine type — book is under 79 pages). If KDP reports a different page count, run the builder again.

Cover art is upscaled from `cover.png` (1024 × 1536). If you have a larger original, replace that file and rebuild.

Each chapter has its own scene plate in `plates/ch-01.png` … `ch-25.png`, drawn from that chapter’s story and the cover characters. Tick KDP’s AI-generated images disclosure when you upload.

Still for Anshika to confirm: printed names (Fluffy vs Bundle).

Do not add the Amazon button on the website until this title is **Live** and you have the product URL.
""",
        encoding="utf-8",
    )


def main() -> None:
    data = parse_story()
    if len(data["chapters"]) != 25:
        raise SystemExit(f"expected 25 chapters, got {len(data['chapters'])}")
    pages = build_interior(data)
    spec = build_cover(pages)
    (HERE / "spec.json").write_text(json.dumps(spec, indent=2) + "\n", encoding="utf-8")
    write_readme(spec)
    print(f"interior.pdf  {pages} pages")
    print(f"cover-wrap.pdf  {spec['cover_width_in']} × {spec['cover_height_in']} in")
    print(f"spine  {spec['spine_in']} in")


if __name__ == "__main__":
    main()
