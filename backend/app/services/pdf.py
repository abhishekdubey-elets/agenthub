"""Render an agent report (markdown text) into a clean PDF using fpdf2.

Core fonts are latin-1 only, so non-latin characters (e.g. emoji) are stripped
before rendering. Inline **bold** is honoured via fpdf2's markdown support.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fpdf import FPDF
from fpdf.enums import XPos, YPos


def _latin1(text: str) -> str:
    """Drop characters the core PDF fonts can't encode (emoji, etc.)."""
    return text.encode("latin-1", "ignore").decode("latin-1")


def render_report_pdf(title: str, body_markdown: str, subtitle: str | None = None) -> bytes:
    pdf = FPDF(format="A4")
    pdf.set_margins(18, 18, 18)
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    def line(text: str, size: int, style: str = "", gap: float = 6, markdown: bool = False):
        pdf.set_font("Helvetica", style, size)
        pdf.multi_cell(
            0, gap, _latin1(text),
            new_x=XPos.LMARGIN, new_y=YPos.NEXT, markdown=markdown,
        )

    # Title + timestamp
    line(title, 18, "B", gap=9)
    pdf.set_text_color(130, 130, 130)
    stamp = subtitle or datetime.now(timezone.utc).strftime("Generated %d %b %Y")
    line(stamp, 9)
    pdf.set_text_color(20, 20, 20)
    pdf.ln(3)

    for raw in (body_markdown or "").splitlines():
        stripped = raw.strip()
        if not stripped:
            pdf.ln(2)
            continue
        if stripped.startswith("### "):
            line(stripped[4:], 12, "B", gap=7)
        elif stripped.startswith("## "):
            pdf.ln(1)
            line(stripped[3:], 14, "B", gap=8)
        elif stripped.startswith("# "):
            line(stripped[2:], 15, "B", gap=8)
        elif stripped[:2] in ("- ", "* "):
            line(f"  -  {stripped[2:]}", 11, markdown=True)
        else:
            line(stripped, 11, markdown=True)

    return bytes(pdf.output())
