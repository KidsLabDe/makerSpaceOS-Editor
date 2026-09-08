#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""QR-Beiblatt fuer das A5-Cutout (laser/a5_layout.py/.svg).

Erzeugt `a5_qr_backsheet.pdf`: gleiche Blattgroesse (235 x 150 mm) und
GENAU dieselben Bauteil-Positionen wie a5_layout.py (Modul wird importiert,
keine Duplizierung der Koordinaten) - man kann das Blatt also einfach hinter
den gelaserten Deckel/die Frontplatte legen, und pro Ausschnitt scheint der
passende QR-Code + Bauteilname durch.

Jeder QR-Code verlinkt auf einen Deep-Link in viewer.html (die
Bauteil-/Block-Bibliothek, siehe js/docs_data.js + viewer.html):
  https://mos.kidslab.de/viewer.html?id=comp:<hardware.commonName>
Der Maker-Pi RP2040 hat kein eigenes hardware.commonName in BLOCKS_DB (reines
Board-Doku-MD mit block:false) und verlinkt daher auf die Board-Seite
(?id=board:maker_pi_rp2040) statt auf einen Bauteil-Eintrag.

WICHTIG: Die Basis-URL (VIEWER_BASE_URL) geht davon aus, dass der aktuelle
main-Branch bereits auf mos.kidslab.de deployed ist - sonst zeigen die
QR-Codes ins Leere. Bei sehr kleinen Ausschnitten (Servo 12x23mm, Drehgeber
19x26mm) ist der QR-Code entsprechend winzig - Scanbarkeit vorher testen.

Aufruf: uv run --with reportlab python3 a5_qr_backsheet.py
"""

import os
import urllib.parse

from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

import a5_layout as L

VIEWER_BASE_URL = "https://mos.kidslab.de/viewer.html"

# COMPONENTS-Name (a5_layout.py) -> viewer.html Deep-Link-Key.
# "comp:<hardware.commonName>" fuer echte Bauteile (BLOCKS_DB), "board:<id>"
# fuer den Maker-Pi (reines Doku-MD ohne Blockly-Block).
LINK_TARGETS = {
    "Maker-Pi RP2040": "board:maker_pi_rp2040",
    "LCD":              "comp:Grove-LCD RGB Backlight",
    "Drehgeber":        "comp:Grove Encoder / Drehgeber",
    "Servo":            "comp:Servo SG90",
    "7-Segment":        "comp:7-Segment Display TM1637 (4-stellig)",
    "DHT11":            "comp:DHT11",
    "Ultraschall":      "comp:Grove Ultrasonic Ranger",
}

MARGIN = 2.0        # mm Sicherheitsabstand QR-Code/Text zur Box-Kante
TITLE_H = 4.5        # mm Platzbedarf fuer den Titel (Schriftgroesse + Abstand)
FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"


def qr_url(key):
    return VIEWER_BASE_URL + "?id=" + urllib.parse.quote(key, safe=":")


def draw_qr(c, x_mm, y_mm, size_mm, data):
    """Zeichnet einen vektoriellen QR-Code, obere linke Ecke bei (x_mm,y_mm)."""
    widget = QrCodeWidget(data)
    b = widget.getBounds()
    w, h = b[2] - b[0], b[3] - b[1]
    d = Drawing(size_mm * mm, size_mm * mm, transform=[size_mm * mm / w, 0, 0, size_mm * mm / h, 0, 0])
    d.add(widget)
    renderPDF.draw(d, c, x_mm * mm, (y_mm - size_mm) * mm)


def fit_text(c, text, max_w_mm, font_size):
    """Schriftgroesse so weit reduzieren, bis der Text in max_w_mm passt (min 4pt)."""
    size = font_size
    while size > 4 and c.stringWidth(text, FONT_BOLD, size) > max_w_mm * mm:
        size -= 0.5
    return size


def build():
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, "a5_qr_backsheet.pdf")
    c = canvas.Canvas(out, pagesize=(L.PAGE_W * mm, L.PAGE_H * mm))

    # PDF-Y waechst nach oben, unsere Koordinaten (wie a5_layout.py) nach
    # unten -> transformieren: y_pdf = PAGE_H - y_top.
    def to_pdf_y(y_top_mm):
        return L.PAGE_H - y_top_mm

    for name, w, h, x, y in L.COMPONENTS:
        key = LINK_TARGETS.get(name)
        if not key:
            print("WARNUNG: kein Link-Ziel fuer %r - uebersprungen" % name)
            continue
        url = qr_url(key)

        usable_w = w - 2 * MARGIN
        usable_h = h - 2 * MARGIN
        # Titel nur zeigen, wenn der QR-Code danach noch eine Mindestgroesse
        # behaelt (sonst leidet die Scanbarkeit mehr, als der Titel bringt).
        MIN_QR_WITH_TITLE = 15.0
        show_title = min(usable_w, usable_h - TITLE_H) >= MIN_QR_WITH_TITLE
        qr_h_budget = usable_h - (TITLE_H if show_title else 0)
        qr_size = max(6.0, min(usable_w, qr_h_budget))

        # Box-Oberkante in PDF-Koordinaten (y waechst nach oben)
        top_pdf = to_pdf_y(y)

        cx = x + w / 2
        cursor_y = top_pdf - MARGIN   # von oben nach unten innerhalb der Box

        if show_title:
            fs = fit_text(c, name, usable_w, 7)
            c.setFont(FONT_BOLD, fs)
            # Baseline etwas unterhalb der Zonen-Oberkante (grobe Zeilenhoehe).
            baseline_pt = cursor_y * mm - fs * 0.8
            c.drawCentredString(cx * mm, baseline_pt, name)
            cursor_y -= TITLE_H

        qr_x = cx - qr_size / 2
        draw_qr(c, qr_x, cursor_y, qr_size, url)
        cursor_y -= qr_size

        # Hilfslinie: Box-Umriss (nur zur Ausrichtung beim Ausdrucken/Auflegen,
        # duenn und grau - nicht Teil des Laser-Layouts).
        c.setStrokeColorRGB(0.8, 0.8, 0.8)
        c.setLineWidth(0.2)
        c.rect(x * mm, (top_pdf - h) * mm, w * mm, h * mm, stroke=1, fill=0)

    c.save()
    print("geschrieben:", out)


if __name__ == "__main__":
    build()
