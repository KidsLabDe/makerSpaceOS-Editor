#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A4-Laser-Layout fuer die makerSpaceOS-Bauteile (Querformat 297x210 mm).

Erzeugt `a4_layout.svg`: Maker-Pi mittig, die uebrigen Bauteile drumherum,
jedes Bauteil mit Beschriftung darueber, oben mittig Logo + Schriftzug.

Laser-Konventionen (in zwei getrennten Inkscape-Layern):
  - "Schnitt"  -> ROT (#FF0000), Haarlinie 0,1 mm  -> SCHNEIDEN.
                  Oeffnung = Bauteil-Footprint + Toleranz (CUT_TOL), damit das
                  Teil hineinpasst (Kerf/Passung).
  - "Gravur"   -> SCHWARZ -> GRAVIEREN: Nennmass-Umriss (exaktes Mass) als
                  Platzierungshilfe + Beschriftung mittig ueber dem Bauteil.

Alle Beschriftungen werden als echte Vektorpfade ausgegeben (vector_font.py,
Umrisse aus DejaVu Sans) - KEINE <text>-Elemente. Laser-Software wie MrBeam
rendert <text> sonst mit eigenen/fehlenden Schriften falsch (riesige,
unlesbare Zeichen), obwohl die Browser-Vorschau gut aussieht.

Die Bauteilmasse spiegeln die Felder `hardware.width_mm`/`height_mm` der
`components/*.md` (Maker-Pi und 8x8-Matrix: `components/hardware/*.md`, reine
Doku-MDs mit `block: false`). Positionen (x,y = linke obere Ecke in mm) sind
frei anpassbar. CUT_TOL je nach Material/Kerf anpassen.
"""

import os

import vector_font

PAGE_W, PAGE_H = 340.0, 240.0   # 34 x 24 cm (mm)
CUT_TOL  = 0.4                  # mm Uebermass gesamt fuer Schnitt-Oeffnungen
LABEL_DY = 5.0                  # mm Abstand Beschriftung ueber Bauteil-Oberkante
FONT_MM  = 5.0                  # Schriftgroesse Bauteil-Labels (mm)

# (Name, Breite, Hoehe, x, y) -- x,y = linke obere Ecke (mm)
COMPONENTS = [
    ("Maker-Pi RP2040", 88.0, 64.0, 104.5,  73.0),   # Mitte
    ("8x8 Matrix",      67.0, 65.5,  18.0,  22.0),
    ("Ultraschall",     50.0, 25.0,  22.0, 120.0),
    ("Drehgeber",       21.5, 18.5,  30.0, 165.0),
    ("LCD",             80.0, 40.0, 228.0,  22.0),
    ("7-Segment",       42.0, 23.5, 210.0,  95.0),
    ("DHT11",           40.0, 20.0, 210.0, 150.0),
    ("Servo",           12.0, 23.0, 142.5, 160.0),
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

LOGO_W    = 24.0            # Logo-Breite auf dem Blatt (mm)
LOGO_TOP  = 12.0            # Oberkante Logo (mm)
TITLE     = "makerSpaceOS"
TITLE_MM  = 8.0             # Schriftgroesse Schriftzug (mm)
TITLE_GAP = 5.0             # Abstand Logo -> Schriftzug (mm)


def fmt(v):
    """Zahl kompakt (keine ueberfluessigen Nullen)."""
    return ("%g" % round(v, 3))


def _lockup_box():
    """Bounding-Box (x, y, w, h) von Logo + Schriftzug, mittig auf dem Blatt."""
    s = LOGO_W / LOGO_VB_W
    logo_h = LOGO_VB_H * s
    total_w = LOGO_W + TITLE_GAP + vector_font.text_width(TITLE, TITLE_MM)
    return (PAGE_W / 2 - total_w / 2, LOGO_TOP, total_w, logo_h)


def build_logo():
    """Logo + Schriftzug als Gravur-SVG (nur Pfade/Grundformen, kein <text>)."""
    x0, y0, _, logo_h = _lockup_box()
    s = LOGO_W / LOGO_VB_W

    def X(v):
        return fmt(x0 + v * s)

    def Y(v):
        return fmt(y0 + v * s)

    out = ['    <g fill="none" stroke="#000000">']
    out.append('      <g stroke-width="%s">' % fmt(8 * s))
    for x1, y1, x2, y2 in LOGO_HEX_LINES:
        out.append('        <line x1="%s" y1="%s" x2="%s" y2="%s"/>'
                   % (X(x1), Y(y1), X(x2), Y(y2)))
    out.append('      </g>')
    out.append('      <g stroke-width="%s">' % fmt(LOGO_PIN_SW * s))
    for cx, cy in LOGO_PINS:
        out.append('        <circle cx="%s" cy="%s" r="%s"/>'
                   % (X(cx), Y(cy), fmt(LOGO_PIN_R * s)))
    out.append('      </g>')
    out.append(
        '      <polyline points="%s" stroke-width="%s"'
        ' stroke-linecap="round" stroke-linejoin="round"/>'
        % (" ".join("%s,%s" % (X(px), Y(py)) for px, py in LOGO_PROMPT),
           fmt(6.5 * s))
    )
    ux1, uy1, ux2, uy2 = LOGO_UNDERSCORE
    out.append(
        '      <line x1="%s" y1="%s" x2="%s" y2="%s" stroke-width="%s"'
        ' stroke-linecap="round"/>'
        % (X(ux1), Y(uy1), X(ux2), Y(uy2), fmt(6.5 * s))
    )
    out.append('    </g>')

    # Schriftzug rechts neben dem Logo, vertikal auf Logo-Mitte
    tx = x0 + LOGO_W + TITLE_GAP
    ty = y0 + logo_h / 2 + 0.365 * TITLE_MM   # Grundlinie ~ Mitte der Versalhoehe
    out.append("    " + vector_font.text_path(TITLE, tx, ty, TITLE_MM, anchor="start"))
    return out


def build_svg():
    cut, outline, labels = [], [], []
    for name, w, h, x, y in COMPONENTS:
        # Schnitt: Oeffnung mit Toleranz
        cx, cy = x - CUT_TOL / 2, y - CUT_TOL / 2
        cw, ch = w + CUT_TOL, h + CUT_TOL
        cut.append(
            '    <rect x="%s" y="%s" width="%s" height="%s" rx="1" ry="1"/>'
            % (fmt(cx), fmt(cy), fmt(cw), fmt(ch))
        )
        # Gravur: Nennmass-Umriss
        outline.append(
            '    <rect x="%s" y="%s" width="%s" height="%s"/>'
            % (fmt(x), fmt(y), fmt(w), fmt(h))
        )
        # Gravur: Beschriftung mittig ueber dem Bauteil (als Vektorpfad)
        tx, ty = x + w / 2, y - LABEL_DY
        labels.append("    " + vector_font.text_path(name, tx, ty, FONT_MM))

    return """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     width="{pw}mm" height="{ph}mm" viewBox="0 0 {pw} {ph}">
  <!-- Hilfslinie: A4-Blattrand (nicht schneiden) -->
  <g inkscape:groupmode="layer" inkscape:label="Hilfslinien">
    <rect x="0" y="0" width="{pw}" height="{ph}" fill="none"
          stroke="#cccccc" stroke-width="0.2" stroke-dasharray="2,2"/>
  </g>
  <!-- SCHNEIDEN: rot, Haarlinie -->
  <g inkscape:groupmode="layer" inkscape:label="Schnitt"
     fill="none" stroke="#ff0000" stroke-width="0.1">
{cut}
  </g>
  <!-- GRAVIEREN: schwarz (Umrisse, Logo, Beschriftungen als Pfade) -->
  <g inkscape:groupmode="layer" inkscape:label="Gravur">
    <g fill="none" stroke="#000000" stroke-width="0.2">
{outline}
    </g>
{logo}
    <g fill="#000000" stroke="none">
{labels}
    </g>
  </g>
</svg>
""".format(
        pw=fmt(PAGE_W), ph=fmt(PAGE_H),
        cut="\n".join(cut),
        outline="\n".join(outline),
        logo="\n".join(build_logo()),
        labels="\n".join(labels),
    )


def check_layout():
    """Warnt bei Ueberlappungen oder Elementen ausserhalb des Blattes."""
    lx, ly, lw, lh = _lockup_box()
    boxes = [(n, w, h, x, y) for n, w, h, x, y in COMPONENTS]
    boxes.append(("Logo+Schriftzug", lw, lh, lx, ly))
    warns = []
    for name, w, h, x, y in boxes:
        if x < 0 or y < 0 or x + w > PAGE_W or y + h > PAGE_H:
            warns.append("  %s ragt ueber den Blattrand hinaus" % name)
    for i in range(len(boxes)):
        n1, w1, h1, x1, y1 = boxes[i]
        for j in range(i + 1, len(boxes)):
            n2, w2, h2, x2, y2 = boxes[j]
            if x1 < x2 + w2 and x2 < x1 + w1 and y1 < y2 + h2 and y2 < y1 + h1:
                warns.append("  %s ueberlappt %s" % (n1, n2))
    return warns


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, "a4_layout.svg")
    with open(out, "w", encoding="utf-8") as f:
        f.write(build_svg())
    print("geschrieben: %s" % out)
    print("Blatt: %s x %s mm (quer), %d Bauteile" % (fmt(PAGE_W), fmt(PAGE_H), len(COMPONENTS)))
    warns = check_layout()
    if warns:
        print("WARNUNGEN:")
        print("\n".join(warns))
    else:
        print("Layout-Check: keine Ueberlappungen, alles im Blatt.")


if __name__ == "__main__":
    main()
