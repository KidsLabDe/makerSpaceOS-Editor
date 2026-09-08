#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cutout-Layout (235 x 150 mm, Projektname "a5") fuer 7 Bauteile.

Erzeugt `a5_layout.svg`. Gleiche Laser-Konventionen wie `a4_layout.py`:
  - Layer "Schnitt"  -> ROT (#FF0000), Haarlinie -> SCHNEIDEN (Oeffnung =
    Bauteil-Footprint + Toleranz CUT_TOL). Einzige Kontur je Ausschnitt.
  - Layer "Gravur"   -> SCHWARZ -> GRAVIEREN (Logo + Beschriftungen, alles
    als Vektorpfade via vector_font.py, kein <text>). Kein zusaetzlicher
    Nennmass-Umriss mehr (war eine Platzierungshilfe, optisch doppelt zur
    roten Schnittkontur - auf Wunsch entfernt).

Bauteilmasse aus `components/*.md` (hardware.width_mm/height_mm) bzw. den
Werten in `a4_layout.py`. Hinweis: 235 x 150 mm entspricht NICHT dem
DIN-Format A5 (148 x 210 mm) - "a5" ist hier nur der Projektname/Rufname
fuer dieses kleinere Cutout, kein Papierformat.
"""

import math
import os

import vector_font

PAGE_W, PAGE_H = 235.0, 150.0
CUT_TOL  = 0.4                  # mm Uebermass gesamt fuer Schnitt-Oeffnungen
                                 # (08.09.: -1.6 war zu eng -> wieder 2mm mehr
                                 # Abstand, zurueck auf den urspruenglichen
                                 # Wert 0.4 = leichtes Spiel statt Klemmsitz)
LABEL_DY = 3.5                  # mm Abstand Beschriftung ueber Bauteil-Oberkante
FONT_MM  = 3.5                  # Schriftgroesse Bauteil-Labels (mm)

# (Name, Breite, Hoehe, x, y) -- x,y = linke obere Ecke (mm)
# Maker-Pi + LCD als Mittelblock nach oben gerueckt (mehr Steg zum unteren
# Blattrand - 2 mm Rand ist beim Lasercutten abgerissen), Logo daher aus der
# Kopfzeile raus und stattdessen unten in die linke Spalte verschoben.
# Masse Ultraschall/Drehgeber/7-Segment nachgemessen (07.09., vgl. commit).
COMPONENTS = [
    ("Maker-Pi RP2040", 88.0, 64.0,  73.5,  15.0),   # oben Mitte
    ("LCD",              80.0, 40.0,  77.5,  90.0),   # darunter Mitte
    ("Drehgeber",        19.0, 26.0,  26.0,  46.5),   # mitte links (oben links bleibt frei)
    ("Servo",            12.0, 23.0,  30.0,  83.5),   # mitte links, unten
    ("7-Segment",        41.5, 23.0, 178.0,  15.0),   # oben rechts, quer
    ("DHT11",             40.0, 20.0, 178.0,  67.5),   # mitte rechts
    ("Ultraschall",      45.0, 20.5, 178.0,  98.5),   # unten rechts
]

# Zusaetzliche reine Schnitt-Ausschnitte ohne Label/Gravur (z.B. Kabeldurchlass):
# (Name, Breite, Hoehe, x, y). x,y hier bereits fertig berechnet, s.u.
_ultraschall = next(c for c in COMPONENTS if c[0] == "Ultraschall")
_us_name, _us_w, _us_h, _us_x, _us_y = _ultraschall
EXTRA_CUTOUTS = [
    (
        "Kabeldurchlass Ultraschall", 15.0, 15.0,
        _us_x + _us_w / 2 - 7.5,   # x: horizontal mittig zum Ultraschall-Ausschnitt
        _us_y + _us_h,             # y: direkt unterhalb, angrenzend
    ),
]

# ----------------------------------------------------------------------------
# Logo (Geometrie aus makerSpaceOS/design/svg/logo-mark-mono.svg, viewBox 110x100)
# ----------------------------------------------------------------------------
LOGO_VB_W, LOGO_VB_H = 110.0, 100.0
LOGO_HEX_LINES = [          # Hexagon-Kanten (stroke-width 8 in Logo-Units)
    (37.5, 11.9, 72.5, 11.9), (79.25, 15.797, 96.75, 46.103),
    (96.75, 53.897, 79.25, 84.203), (72.5, 88.1, 37.5, 88.1),
    (30.75, 84.203, 13.25, 53.897), (13.25, 46.103, 30.75, 15.797),
]
LOGO_PINS = [(33, 11.9), (77, 11.9), (99, 50), (77, 88.1), (33, 88.1), (11, 50)]
LOGO_PIN_R, LOGO_PIN_SW = 5.5, 3.6
LOGO_PROMPT = [(43, 40), (54, 50), (43, 60)]     # ">" (stroke-width 6.5, round)
LOGO_UNDERSCORE = (59, 60, 69, 60)               # "_" (stroke-width 6.5, round)

LOGO_W    = 16.0            # Logo-Breite auf dem Blatt (mm)
LOGO_X    = 12.0             # linke Kante Logo (mm) -- unten links, unter Servo
LOGO_Y    = 111.5            # obere Kante Logo (mm)
TITLE     = "makerSpaceOS"
TITLE_MM  = 5.5              # Schriftgroesse Schriftzug (mm)
TITLE_GAP = 4.0               # Abstand Logo -> Schriftzug (mm)
SUBTITLE     = "TEST-SET"
SUBTITLE_MM  = 3.0


def fmt(v):
    """Zahl kompakt (keine ueberfluessigen Nullen)."""
    return ("%g" % round(v, 3))


def _line_fill_pts(x1, y1, x2, y2, w, cap="butt", segments=16):
    """Umriss-Punkte einer Linie der Breite w als gefuelltes Polygon
    (Stroke-to-Fill, reine Vektorrechnung, kein shapely noetig). cap="round"
    setzt Halbkreise an beide Enden, "butt" schneidet gerade ab."""
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy)
    if length == 0:
        return []
    ux, uy = dx / length, dy / length   # Richtung (laengs)
    r = w / 2

    def to_global(lx, ly):
        # lokal: Linie liegt auf der x-Achse von (0,0) bis (length,0)
        return (x1 + lx * ux - ly * uy, y1 + lx * uy + ly * ux)

    if cap != "round":
        return [to_global(0, r), to_global(length, r),
                to_global(length, -r), to_global(0, -r)]

    pts = []
    for i in range(segments + 1):          # Halbkreis am Endpunkt (rechts)
        a = math.pi / 2 - math.pi * i / segments
        pts.append(to_global(length + r * math.cos(a), r * math.sin(a)))
    for i in range(segments + 1):          # Halbkreis am Startpunkt (links)
        a = -math.pi / 2 - math.pi * i / segments
        pts.append(to_global(r * math.cos(a), r * math.sin(a)))
    return pts


def _poly_to_d(pts):
    return "M " + " L ".join("%s,%s" % (fmt(x), fmt(y)) for x, y in pts) + " Z"


def _circle_ring_d(cx, cy, r, sw):
    """Kreisring (Aussen-/Innenradius) als SVG-Pfad, fill-rule evenodd."""
    r_out, r_in = r + sw / 2, r - sw / 2

    def circle_d(rr):
        return ("M %s,%s A %s,%s 0 1 0 %s,%s A %s,%s 0 1 0 %s,%s Z"
                % (fmt(cx + rr), fmt(cy), fmt(rr), fmt(rr), fmt(cx - rr), fmt(cy),
                   fmt(rr), fmt(rr), fmt(cx + rr), fmt(cy)))

    return circle_d(r_out) + " " + circle_d(r_in)


def _lockup_box():
    """Bounding-Box (x, y, w, h) von Logo + Schriftzug (fest: unten links)."""
    s = LOGO_W / LOGO_VB_W
    logo_h = LOGO_VB_H * s
    total_w = LOGO_W + TITLE_GAP + vector_font.text_width(TITLE, TITLE_MM)
    return (LOGO_X, LOGO_Y, total_w, logo_h)


def build_logo():
    """Logo + Schriftzug + Untertitel als Gravur-SVG (nur gefuellte Pfade,
    kein stroke - Mr Beam stuft duenne fill:none-Konturen unabhaengig von der
    Farbe leicht als Schnitt-Kandidat ein, siehe Deckel.svg-Fix. Stroke-to-Fill
    per reiner Vektorrechnung, s. _line_fill_pts/_circle_ring_d oben)."""
    x0, y0, total_w, logo_h = _lockup_box()
    s = LOGO_W / LOGO_VB_W

    def X(v):
        return x0 + v * s   # unskaliert (float) - Fill-Berechnung braucht Zahlen

    def Y(v):
        return y0 + v * s

    out = ['    <g fill="#000000" stroke="none">']
    for x1, y1, x2, y2 in LOGO_HEX_LINES:
        pts = _line_fill_pts(X(x1), Y(y1), X(x2), Y(y2), 8 * s, cap="butt")
        out.append('      <path d="%s"/>' % _poly_to_d(pts))
    for cx, cy in LOGO_PINS:
        out.append('      <path fill-rule="evenodd" d="%s"/>'
                   % _circle_ring_d(X(cx), Y(cy), LOGO_PIN_R * s, LOGO_PIN_SW * s))
    for (px1, py1), (px2, py2) in zip(LOGO_PROMPT, LOGO_PROMPT[1:]):
        pts = _line_fill_pts(X(px1), Y(py1), X(px2), Y(py2), 6.5 * s, cap="round")
        out.append('      <path d="%s"/>' % _poly_to_d(pts))
    ux1, uy1, ux2, uy2 = LOGO_UNDERSCORE
    pts = _line_fill_pts(X(ux1), Y(uy1), X(ux2), Y(uy2), 6.5 * s, cap="round")
    out.append('      <path d="%s"/>' % _poly_to_d(pts))
    out.append('    </g>')

    # Schriftzug rechts neben dem Logo, vertikal auf Logo-Mitte
    tx = x0 + LOGO_W + TITLE_GAP
    ty = y0 + logo_h / 2 + 0.365 * TITLE_MM   # Grundlinie ~ Mitte der Versalhoehe
    out.append("    " + vector_font.text_path(TITLE, tx, ty, TITLE_MM, anchor="start"))

    # Untertitel "TEST-SET" mittig unter dem Lockup
    sx = x0 + total_w / 2
    sy = y0 + logo_h + SUBTITLE_MM + 1.5
    out.append("    " + vector_font.text_path(SUBTITLE, sx, sy, SUBTITLE_MM, anchor="middle"))
    return out


def build_svg():
    # Kein schwarzer Nennmass-Umriss mehr um die Ausschnitte (war eine reine
    # Platzierungshilfe, doppelte sich optisch mit der roten Schnittkontur -
    # auf Wunsch entfernt). Schnitt (rot) bleibt die einzige Kontur je Bauteil.
    cut, labels = [], []
    for name, w, h, x, y in COMPONENTS:
        # Schnitt: Oeffnung mit Toleranz
        cx, cy = x - CUT_TOL / 2, y - CUT_TOL / 2
        cw, ch = w + CUT_TOL, h + CUT_TOL
        cut.append(
            '    <rect x="%s" y="%s" width="%s" height="%s" rx="1" ry="1"/>'
            % (fmt(cx), fmt(cy), fmt(cw), fmt(ch))
        )
        # Gravur: Beschriftung mittig ueber dem Bauteil (als Vektorpfad)
        tx, ty = x + w / 2, y - LABEL_DY
        labels.append("    " + vector_font.text_path(name, tx, ty, FONT_MM))

    for name, w, h, x, y in EXTRA_CUTOUTS:
        # Reiner Schnitt-Ausschnitt, keine Toleranz-Anpassung, kein Label.
        cut.append(
            '    <rect x="%s" y="%s" width="%s" height="%s" rx="1" ry="1"/>'
            % (fmt(x), fmt(y), fmt(w), fmt(h))
        )

    return """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     width="{pw}mm" height="{ph}mm" viewBox="0 0 {pw} {ph}">
  <!-- Hilfslinie: Blattrand (orange statt grau, damit Mr Beam sie als
       eigenen, klar unterscheidbaren Job-Slot erkennt - Leistung dort auf
       0 lassen, nicht wirklich schneiden) -->
  <g inkscape:groupmode="layer" inkscape:label="Hilfslinien">
    <rect x="0" y="0" width="{pw}" height="{ph}" fill="none"
          stroke="#ff8800" stroke-width="0.2" stroke-dasharray="2,2"/>
  </g>
  <!-- SCHNEIDEN: rot, Haarlinie -->
  <g inkscape:groupmode="layer" inkscape:label="Schnitt"
     fill="none" stroke="#ff0000" stroke-width="0.1">
{cut}
  </g>
  <!-- GRAVIEREN: schwarz (Logo, Beschriftungen als Pfade) -->
  <g inkscape:groupmode="layer" inkscape:label="Gravur">
{logo}
    <g fill="#000000" stroke="none">
{labels}
    </g>
  </g>
</svg>
""".format(
        pw=fmt(PAGE_W), ph=fmt(PAGE_H),
        cut="\n".join(cut),
        logo="\n".join(build_logo()),
        labels="\n".join(labels),
    )


def check_layout():
    """Warnt bei Ueberlappungen oder Elementen ausserhalb des Blattes.

    Prueft Bauteil-Footprints (inkl. Label-Zeile darueber) sowie Logo/Titel.
    """
    lx, ly, lw, lh = _lockup_box()
    boxes = [("Logo+Schriftzug", lw, lh, lx, ly)]
    for name, w, h, x, y in COMPONENTS:
        # Label-Zeile als Teil der Bounding-Box mitzaehlen (grobe Breite: w)
        label_h = LABEL_DY + FONT_MM
        boxes.append((name, w, h + label_h, x, y - label_h))
    for name, w, h, x, y in EXTRA_CUTOUTS:
        boxes.append((name, w, h, x, y))   # kein Label, keine Extra-Hoehe
    warns = []
    for name, w, h, x, y in boxes:
        if x < 0 or y < 0 or x + w > PAGE_W or y + h > PAGE_H:
            warns.append("  %s ragt ueber den Blattrand hinaus (x=%.1f y=%.1f w=%.1f h=%.1f)"
                         % (name, x, y, w, h))
    for i in range(len(boxes)):
        n1, w1, h1, x1, y1 = boxes[i]
        for j in range(i + 1, len(boxes)):
            n2, w2, h2, x2, y2 = boxes[j]
            if x1 < x2 + w2 and x2 < x1 + w1 and y1 < y2 + h2 and y2 < y1 + h1:
                warns.append("  %s ueberlappt %s" % (n1, n2))
    return warns


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, "a5_layout.svg")
    with open(out, "w", encoding="utf-8") as f:
        f.write(build_svg())
    print("geschrieben: %s" % out)
    print("Blatt: %s x %s mm, %d Bauteile" % (fmt(PAGE_W), fmt(PAGE_H), len(COMPONENTS)))
    warns = check_layout()
    if warns:
        print("WARNUNGEN:")
        print("\n".join(warns))
    else:
        print("Layout-Check: keine Ueberlappungen, alles im Blatt.")


if __name__ == "__main__":
    main()
