# -*- coding: utf-8 -*-
"""Vektor-Schrift fuer Laser-SVGs (Umrisse aus Noto Sans JP, 1000 units/em).

GENERIERT aus Noto Sans JP - nicht von Hand bearbeiten. Zweck: Beschriftungen
als echte <path>-Elemente statt <text>, damit Laser-Software (z.B. MrBeam)
sie unabhaengig von installierten Schriften korrekt uebernimmt.

API:
  text_width(text, size_mm)                 -> Breite in mm
  text_path(text, x, y, size_mm, anchor)    -> SVG-<path>-Element (gefuellt),
                                               y = Grundlinie wie bei <text>
"""

UPM = 1000.0

GLYPHS = {
    'ッ': (1000, [('m',483,576),('q',490,561,501,531.5),('q',512,502,524.5,469),('q',537,436,547,406.5),('q',557,377,562,360),('l',488,334),('q',484,351,474.5,380),('q',465,409,453,442.5),('q',441,476,429,505),('q',417,534,410,551),('z',),('m',845,520),('q',840,505,836.5,492.5),('q',833,480,830,470),('q',810,388,776,309.5),('q',742,231,688,163),('q',619,75,532.5,16),('q',446,-43,362,-75),('l',296,-8),('q',354,10,413.5,40),('q',473,70,526.5,112),('q',580,154,621,205),('q',657,249,685.5,304),('q',714,359,733,421),('q',752,483,759,547),('z',),('m',251,526),('q',259,509,271,480),('q',283,451,296.5,416.5),('q',310,382,322.5,350.5),('q',335,319,342,300),('l',266,272),('q',260,291,248.5,323.5),('q',237,356,223,391),('q',209,426,196.5,455),('q',184,484,177,497),('z',)]),
}


def text_width(text, size_mm):
    s = size_mm / UPM
    return sum(GLYPHS[ch][0] for ch in text if ch in GLYPHS) * s


def _f(v):
    return ("%.3f" % v).rstrip("0").rstrip(".")


def text_path(text, x, y, size_mm, anchor="middle"):
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
                "%s %s" % (pts[i], pts[i + 1]) for i in range(0, len(pts), 2)
            ))
        px += adv * s
    return '<path d="%s"/>' % "".join(d)
