#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A4-Laser-Layout fuer die makerSpaceOS-Bauteile (Querformat 297x210 mm).

Erzeugt `a4_layout.svg`: Maker-Pi mittig, die uebrigen Bauteile drumherum,
jedes Bauteil mit Beschriftung darueber.

Laser-Konventionen (in zwei getrennten Inkscape-Layern):
  - "Schnitt"  -> ROT (#FF0000), Haarlinie 0,1 mm  -> SCHNEIDEN.
                  Oeffnung = Bauteil-Footprint + Toleranz (CUT_TOL), damit das
                  Teil hineinpasst (Kerf/Passung).
  - "Gravur"   -> SCHWARZ -> GRAVIEREN: Nennmass-Umriss (exaktes Mass) als
                  Platzierungshilfe + Beschriftung mittig ueber dem Bauteil.

Hinweis: Falls die Lasersoftware keine SVG-Schrift rastert, in Inkscape die
Texte markieren und "Pfad -> Objekt in Pfad" anwenden. CUT_TOL je nach
Material/Kerf anpassen.

Die Bauteilmasse spiegeln die Felder `hardware.width_mm`/`height_mm` der
`components/*.md` (Maker-Pi und 8x8-Matrix: `components/hardware/*.md`, reine
Doku-MDs mit `block: false`). Positionen (x,y = linke obere Ecke in mm) sind
frei anpassbar.
"""

import os

PAGE_W, PAGE_H = 297.0, 210.0   # A4 quer (mm)
CUT_TOL  = 0.4                  # mm Uebermass gesamt fuer Schnitt-Oeffnungen
LABEL_DY = 5.0                  # mm Abstand Beschriftung ueber Bauteil-Oberkante
FONT_MM  = 5.0                  # Schriftgroesse (mm)

# (Name, Breite, Hoehe, x, y) -- x,y = linke obere Ecke (mm)
COMPONENTS = [
    ("Maker-Pi RP2040", 88.0, 64.0, 104.5,  73.0),   # Mitte
    ("8x8 Matrix",      67.0, 65.5,  18.0,  22.0),
    ("Ultraschall",     50.0, 25.0,  22.0, 120.0),
    ("Drehgeber",       21.5, 18.5,  30.0, 165.0),
    ("LCD",             80.0, 40.0, 205.0,  22.0),
    ("7-Segment",       42.0, 23.5, 210.0,  95.0),
    ("DHT11",           40.0, 20.0, 210.0, 150.0),
    ("Servo",           12.0, 23.0, 142.5, 160.0),
]


def fmt(v):
    """Zahl kompakt (keine ueberfluessigen Nullen)."""
    return ("%g" % round(v, 3))


def build_svg():
    cut, engrave = [], []
    for name, w, h, x, y in COMPONENTS:
        # Schnitt: Oeffnung mit Toleranz
        cx, cy = x - CUT_TOL / 2, y - CUT_TOL / 2
        cw, ch = w + CUT_TOL, h + CUT_TOL
        cut.append(
            '    <rect x="%s" y="%s" width="%s" height="%s" rx="1" ry="1"/>'
            % (fmt(cx), fmt(cy), fmt(cw), fmt(ch))
        )
        # Gravur: Nennmass-Umriss
        engrave.append(
            '    <rect x="%s" y="%s" width="%s" height="%s"/>'
            % (fmt(x), fmt(y), fmt(w), fmt(h))
        )
        # Gravur: Beschriftung mittig ueber dem Bauteil
        tx, ty = x + w / 2, y - LABEL_DY
        engrave.append(
            '    <text x="%s" y="%s">%s</text>' % (fmt(tx), fmt(ty), name)
        )

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
  <!-- GRAVIEREN: schwarz (Nennmass-Umriss + Beschriftung) -->
  <g inkscape:groupmode="layer" inkscape:label="Gravur">
    <g fill="none" stroke="#000000" stroke-width="0.2">
{outline}
    </g>
    <g fill="#000000" stroke="none"
       font-family="sans-serif" font-size="{font}" text-anchor="middle">
{labels}
    </g>
  </g>
</svg>
""".format(
        pw=fmt(PAGE_W), ph=fmt(PAGE_H), font=fmt(FONT_MM),
        cut="\n".join(cut),
        outline="\n".join(l for l in engrave if "<rect" in l),
        labels="\n".join(l for l in engrave if "<text" in l),
    )


def check_layout():
    """Warnt bei Ueberlappungen oder Bauteilen ausserhalb des Blattes."""
    warns = []
    for name, w, h, x, y in COMPONENTS:
        if x < 0 or y < 0 or x + w > PAGE_W or y + h > PAGE_H:
            warns.append("  %s ragt ueber den Blattrand hinaus" % name)
    for i in range(len(COMPONENTS)):
        n1, w1, h1, x1, y1 = COMPONENTS[i]
        for j in range(i + 1, len(COMPONENTS)):
            n2, w2, h2, x2, y2 = COMPONENTS[j]
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
