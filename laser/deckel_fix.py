#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fixt `Deckel.svg` fuers Lasern (MrBeam & Co.):

  - Alle <text>-Elemente (Wortmarke, Untertitel, Ueberschrift, Ablauf-Labels)
    werden durch echte Vektorpfade ersetzt (vector_font*.py) - kein <text>
    mehr, das fehlende/andere Schriften am Laser falsch/riesig rendert.
  - Fonts: Pixelify Sans fuer die Wortmarke (vector_font.py), Inter
    Regular/Bold fuer Untertitel/Ueberschrift/Ablauf-Labels (vector_font_inter*.py,
    ersetzt Ubuntu/Arial - beide am System nicht vorhanden), Noto Sans JP
    nur fuers Zeichen "ッ" (vector_font_ja.py, aus Google Fonts nachgeladen,
    Subset mit genau diesem einen Glyph).
  - Leeres rotes Platzhalter-Rechteck oben (Affinity-Export-Ueberbleibsel)
    entfernt.
  - QR-Code (https://mos.kidslab.de/) unten rechts ergaenzt, aus `qrencode`
    (reine <rect>-Module, kein Font noetig) + kleine URL-Beschriftung.

Erzeugt `Deckel_fixed.svg` neben dem Original (ueberschreibt `Deckel.svg`
nicht automatisch).
"""

import os
import re
import subprocess

import vector_font as vf_pixelify
import vector_font_inter as vf_inter
import vector_font_inter_bold as vf_inter_bold
import vector_font_ja as vf_ja

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "Deckel.svg")
OUT = os.path.join(HERE, "Deckel_fixed.svg")

QR_URL = "https://mos.kidslab.de/"
QR_SIZE_MM = 32.0      # Kantenlaenge auf dem Deckel
QR_X, QR_Y = 236.0, 154.0   # linke obere Ecke (mm, im mm-Koordinatensystem der Zeichnung)
QR_LABEL = "mos.kidslab.de"
QR_LABEL_MM = 3.2


def build_qr_group():
    """QR-Module als <rect>-Gruppe (schwarz, Gravur) + kleine URL-Beschriftung."""
    svg_out = subprocess.run(
        ["qrencode", "-t", "SVG", "-l", "Q", QR_URL],
        capture_output=True, check=True, text=True,
    ).stdout
    rects = re.findall(r'<rect x="(\d+)" y="(\d+)" width="1" height="1" fill="#000000"/>', svg_out)
    n = max(int(v) for pair in rects for v in pair) + 1  # Modul-Anzahl (Kante)
    cell = QR_SIZE_MM / n

    out = ['    <g fill="#000000" stroke="none">']
    for mx, my in rects:
        mx, my = int(mx), int(my)
        out.append(
            '      <rect x="%.3f" y="%.3f" width="%.3f" height="%.3f"/>'
            % (QR_X + mx * cell, QR_Y + my * cell, cell + 0.02, cell + 0.02)
        )
    out.append("    </g>")
    label_y = QR_Y + QR_SIZE_MM + QR_LABEL_MM + 1.5
    out.append(
        '    <g fill="#000000" stroke="none">%s</g>'
        % vf_inter.text_path(QR_LABEL, QR_X + QR_SIZE_MM / 2, label_y, QR_LABEL_MM, anchor="middle")
    )
    return "\n".join(out)


def main():
    svg = open(SRC, encoding="utf-8").read()

    # 1) Wortmarke "makerSpaceOS" (Pixelify Sans, 22mm) -----------------------
    wordmark_re = re.compile(
        r'<g transform="matrix\(1,0,0,1,148\.5,120\)">\s*<text[^>]*>.*?</text>\s*</g>',
        re.S,
    )
    wordmark_path = vf_pixelify.text_path("makerSpaceOS", -79.145, 0, 22, anchor="start")
    svg, n = wordmark_re.subn(
        '<g transform="matrix(1,0,0,1,148.5,120)">\n            %s\n        </g>' % wordmark_path,
        svg,
    )
    assert n == 1, "Wortmarke nicht gefunden/ersetzt"

    # 2) Untertitel + Zeichen "ッ" (Inter 6mm + Noto Sans JP 6mm) --------------
    subtitle_re = re.compile(
        r'<g transform="matrix\(1,0,0,1,186\.176667,150\.606667\)">.*?</g>',
        re.S,
    )
    subtitle_paths = "\n            ".join([
        vf_inter.text_path("Digitale Bildung für junge Menschen", -52.68, 0, 6, anchor="start"),
        vf_ja.text_path("ッ", 47.49, 0, 6, anchor="start"),
    ])
    svg, n = subtitle_re.subn(
        '<g transform="matrix(1,0,0,1,186.176667,150.606667)">\n            %s\n        </g>' % subtitle_paths,
        svg,
    )
    assert n == 1, "Untertitel nicht gefunden/ersetzt"

    # 3) Ueberschrift "HARDWARE TRIFFT SOFTWARE" (Inter Bold, 3.4mm) ----------
    headline_re = re.compile(
        r'<g transform="matrix\(1,0,0,1,184\.178333,160\.098667\)">.*?</g>',
        re.S,
    )
    headline_path = vf_inter_bold.text_path("HARDWARE TRIFFT SOFTWARE", -28.662, 0, 3.4, anchor="start")
    svg, n = headline_re.subn(
        '<g transform="matrix(1,0,0,1,184.178333,160.098667)">\n            %s\n        </g>' % headline_path,
        svg,
    )
    assert n == 1, "Ueberschrift nicht gefunden/ersetzt"

    # 4) Ablauf-Labels (Inter Regular, versch. Groessen) -----------------------
    labels = [
        ("32,163.78", "Wenn Start", 3.6),
        ("32,171.45", "miss Abstand", 3.3),
        ("32,179.04", "wiederhole", 3.4),
        ("37.5,185.8", "drehe Servo", 3),
        ("37.5,192.3", "leuchte Matrix", 3),
    ]
    for pos, text, size in labels:
        label_re = re.compile(
            r'<g transform="matrix\(1,0,0,1,%s\)">\s*<text[^>]*>.*?</text>\s*</g>'
            % re.escape(pos),
            re.S,
        )
        path = vf_inter.text_path(text, 0, 0, size, anchor="start")
        svg, n = label_re.subn(
            '<g transform="matrix(1,0,0,1,%s)">\n                %s\n            </g>' % (pos, path),
            svg,
        )
        assert n == 1, "Label %r nicht gefunden/ersetzt" % text

    # 5) leeres rotes Platzhalter-Rechteck entfernen ---------------------------
    stray_re = re.compile(
        r'\s*<g transform="matrix\(11\.811024,0,0,11\.811024,0,0\)">\s*'
        r'<path d="M168\.5,23\.411.*?stroke:rgb\(255,0,0\)[^/]*/>\s*</g>',
        re.S,
    )
    svg, n = stray_re.subn("", svg)
    assert n == 1, "rotes Platzhalter-Rechteck nicht gefunden/entfernt"

    # 6) QR-Code einfuegen -- als LETZTES KIND der mm-Koordinatensystem-Gruppe,
    #    also VOR deren schliessendem </g> (sonst liegt es ausserhalb der
    #    matrix(11.811024,...)-Transformation und die mm-Werte werden als
    #    rohe px interpretiert -> landet nahe der Blattecke 0,0). --------------
    qr_group = build_qr_group()
    svg = svg.replace("    </g>\n</svg>", "%s\n    </g>\n</svg>" % qr_group, 1)

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(svg)
    print("geschrieben:", OUT)


if __name__ == "__main__":
    main()
