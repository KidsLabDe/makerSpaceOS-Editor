#!/usr/bin/env python3
"""Extrahiert Glyphen-Umrisse aus einer TTF und schreibt laser/vector_font.py.

Aufruf:  python3 extract_font.py <pfad/zur/schrift.ttf> "<Schrift-Name>"
Braucht: pip install fonttools   (nur zum Generieren, nicht zur Laufzeit)

Aktuelle Schrift: Pixelify Sans (OFL), z.B. von
https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/PixelifySans%5Bwght%5D.ttf

Gespeichert werden pro Zeichen: Advance-Breite + Kontur-Operationen
('m','l','q','c','z') in Font-Units (y nach oben). Die Umwandlung in
SVG-Pfade (absolute mm-Koordinaten) macht vector_font.py zur Laufzeit.
"""
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen

CHARSET = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789"
    " -._,:;+*/()!?%&=\"'"
    "ÄÖÜäöüß°"
)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vector_font.py")


def decompose(rec_value):
    """RecordingPen-Aufzeichnung -> flache Op-Liste mit expliziten Punkten.

    qCurveTo mit mehreren Off-Curve-Punkten wird in einzelne Quadratiken
    mit implizierten On-Curve-Zwischenpunkten zerlegt.
    """
    ops = []
    cur = None
    start = None
    for op, pts in rec_value:
        if op == "moveTo":
            cur = start = pts[0]
            ops.append(("m", cur[0], cur[1]))
        elif op == "lineTo":
            cur = pts[0]
            ops.append(("l", cur[0], cur[1]))
        elif op == "qCurveTo":
            assert pts[-1] is not None, "TrueType-Sonderfall (nur Off-Curve) nicht unterstuetzt"
            offs, end = list(pts[:-1]), pts[-1]
            for i, ctrl in enumerate(offs):
                if i < len(offs) - 1:
                    nxt = offs[i + 1]
                    mid = ((ctrl[0] + nxt[0]) / 2.0, (ctrl[1] + nxt[1]) / 2.0)
                else:
                    mid = end
                ops.append(("q", ctrl[0], ctrl[1], mid[0], mid[1]))
                cur = mid
            if not offs:
                ops.append(("l", end[0], end[1]))
                cur = end
        elif op == "curveTo":
            c1, c2, end = pts
            ops.append(("c", c1[0], c1[1], c2[0], c2[1], end[0], end[1]))
            cur = end
        elif op == "closePath":
            ops.append(("z",))
            cur = start
        else:
            raise ValueError("unbekannte Pen-Op: %s" % op)
    return ops


def fmtnum(v):
    if v == int(v):
        return str(int(v))
    return repr(round(v, 1))


def main():
    if len(sys.argv) != 3:
        sys.exit("Aufruf: python3 extract_font.py <schrift.ttf> \"<Schrift-Name>\"")
    path, font_name = sys.argv[1], sys.argv[2]
    font = TTFont(path)
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    glyphset = font.getGlyphSet()

    entries = []
    missing = []
    for ch in CHARSET:
        cp = ord(ch)
        if cp not in cmap:
            missing.append(ch)
            continue
        gname = cmap[cp]
        pen = DecomposingRecordingPen(glyphset)
        glyphset[gname].draw(pen)
        ops = decompose(pen.value)
        adv = glyphset[gname].width
        ops_src = "[" + ",".join(
            "(" + ",".join([repr(o[0])] + [fmtnum(v) for v in o[1:]]) + ("," if len(o) == 1 else "") + ")"
            for o in ops
        ) + "]"
        entries.append("    %r: (%d, %s)," % (ch, adv, ops_src))

    if missing:
        print("WARNUNG, fehlende Zeichen:", missing, file=sys.stderr)

    src = '''# -*- coding: utf-8 -*-
"""Vektor-Schrift fuer Laser-SVGs (Umrisse aus %(fontname)s, %(upm)d units/em).

GENERIERT aus %(fontname)s (OFL-lizenziert, Google Fonts) - nicht von Hand
bearbeiten. Zweck: Beschriftungen als echte <path>-Elemente statt <text>,
damit Laser-Software (z.B. MrBeam) sie unabhaengig von installierten
Schriften korrekt uebernimmt.

API:
  text_width(text, size_mm)                 -> Breite in mm
  text_path(text, x, y, size_mm, anchor)    -> SVG-<path>-Element (gefuellt),
                                               y = Grundlinie wie bei <text>
"""

UPM = %(upm)d.0

# Zeichen -> (Advance in Font-Units, Kontur-Ops in Font-Units, y nach oben)
# Ops: ('m',x,y) ('l',x,y) ('q',cx,cy,x,y) ('c',c1x,c1y,c2x,c2y,x,y) ('z',)
GLYPHS = {
%(entries)s
}


def text_width(text, size_mm):
    """Breite des Textes in mm (Summe der Advance-Breiten)."""
    s = size_mm / UPM
    return sum(GLYPHS[ch][0] for ch in text if ch in GLYPHS) * s


def _f(v):
    return ("%%.3f" %% v).rstrip("0").rstrip(".")


def text_path(text, x, y, size_mm, anchor="middle"):
    """Text als einzelnes SVG-<path>-Element (absolute mm-Koordinaten).

    x/y wie bei SVG-<text>: y ist die Grundlinie; anchor: 'start'|'middle'|'end'.
    Unbekannte Zeichen werden uebersprungen.
    """
    s = size_mm / UPM
    w = text_width(text, size_mm)
    px = x - {"start": 0.0, "middle": w / 2.0, "end": w}[anchor]
    d = []
    for ch in text:
        if ch not in GLYPHS:
            continue
        adv, ops = GLYPHS[ch]
        for op in ops:
            k = op[0]
            if k == "z":
                d.append("Z")
                continue
            pts = []
            for i in range(1, len(op), 2):
                pts.append(_f(px + op[i] * s))
                pts.append(_f(y - op[i + 1] * s))
            d.append({"m": "M", "l": "L", "q": "Q", "c": "C"}[k] + " ".join(
                "%%s %%s" %% (pts[i], pts[i + 1]) for i in range(0, len(pts), 2)
            ))
        px += adv * s
    return '<path d="%%s"/>' %% "".join(d)
''' % {"upm": upm, "entries": "\n".join(entries), "fontname": font_name}

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(src)
    print("geschrieben:", OUT, "(%d Zeichen, upm=%d)" % (len(entries), upm))


if __name__ == "__main__":
    main()
