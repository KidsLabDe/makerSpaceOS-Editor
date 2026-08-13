#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Wandelt alle "fill:none;stroke:..."-Konturen in Deckel.svg in gefuellte
Flaechen um (Stroke-to-Fill), damit die Datei fuers Mr Beam Plugin eindeutig
als GRAVUR erkannt wird.

Hintergrund (Mr-Beam-Doku): duenne, ungefuellte Konturen werden von der
Software typischerweise als Schnitt-Kandidaten interpretiert, unabhaengig
von der Farbe. Gefuellte Vektorflaechen werden dagegen als Gravur graviert.
Diese Datei hatte mehrere reine "fill:none;stroke:black"-Umrisse (Rahmen,
Hex-Logo, Flowchart-Boxen) - dieses Skript macht daraus geschlossene,
gefuellte Pfade mit dem exakt gleichen Erscheinungsbild.

Technik: jeder Stroke-Pfad wird (ueber svgpathtools) in eine Polylinie
abgetastet, dann per Shapely um die halbe Stroke-Breite gepuffert
(cap_style/join_style aus dem Original-SVG-Style uebernommen). Kreise
(Logo-Pins) werden direkt als Kreisring (Aussen-/Innenradius) gebaut.

Aufruf: uv run --with shapely --with svgpathtools python3 deckel_stroke_to_fill.py
"""

import os
import re

import svgpathtools
from shapely.geometry import LineString

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "Deckel_2.svg")
OUT = os.path.join(HERE, "Deckel_filled.svg")

SAMPLES_PER_SEGMENT = 48


def parse_style(style):
    d = {}
    for part in style.split(";"):
        part = part.strip()
        if ":" in part:
            k, v = part.split(":", 1)
            d[k.strip()] = v.strip()
    return d


def sample_path(d_str):
    """Path-d-String -> Liste von (x,y)-Punkten (Kurven abgetastet)."""
    path = svgpathtools.parse_path(d_str)
    pts = []
    for seg in path:
        n = 2 if seg.__class__.__name__ == "Line" else SAMPLES_PER_SEGMENT
        for i in range(n):
            t = i / n
            p = seg.point(t)
            pts.append((p.real, p.imag))
    if path:
        end = path[-1].point(1.0)
        pts.append((end.real, end.imag))
    return pts


def poly_to_d(coords):
    """Liste von (x,y) (geschlossener Ring, letzter=erster Punkt) -> SVG-Pfad."""
    coords = list(coords)
    d = "M " + " L ".join("%.4f,%.4f" % (x, y) for x, y in coords) + " Z"
    return d


def buffer_to_path_d(poly):
    """Shapely Polygon (ggf. mit Loechern) -> SVG-Pfad-d mit fill-rule evenodd."""
    rings = [poly.exterior] + list(poly.interiors)
    return " ".join(poly_to_d(r.coords) for r in rings)


CAP_MAP = {"round": "round", "square": "square", "butt": "flat", None: "flat"}
JOIN_MAP = {"round": "round", "bevel": "bevel", "miter": "mitre", None: "mitre"}


def stroke_path_to_fill(d_str, stroke_width, style):
    cap = CAP_MAP[style.get("stroke-linecap")]
    join = JOIN_MAP[style.get("stroke-linejoin")]
    pts = sample_path(d_str)
    ls = LineString(pts)
    poly = ls.buffer(stroke_width / 2.0, cap_style=cap, join_style=join, resolution=16)
    return buffer_to_path_d(poly)


def circle_to_ring_d(cx, cy, r, stroke_width):
    r_out = r + stroke_width / 2.0
    r_in = r - stroke_width / 2.0

    def circle_d(cx, cy, r):
        return (
            "M %.4f,%.4f "
            "A %.4f,%.4f 0 1 0 %.4f,%.4f "
            "A %.4f,%.4f 0 1 0 %.4f,%.4f Z"
            % (cx + r, cy, r, r, cx - r, cy, r, r, cx + r, cy)
        )

    return circle_d(cx, cy, r_out) + " " + circle_d(cx, cy, r_in)


def main():
    svg = open(SRC, encoding="utf-8").read()

    # 1) <path style="fill:none;...stroke...">  -----------------------------
    path_re = re.compile(r'<path d="([^"]*)" style="([^"]*fill:none[^"]*)"/>')

    def repl_path(m):
        d_str, style_str = m.group(1), m.group(2)
        style = parse_style(style_str)
        sw = float(style["stroke-width"].replace("px", ""))
        new_d = stroke_path_to_fill(d_str, sw, style)
        return '<path d="%s" fill-rule="evenodd" fill="#000000" stroke="none"/>' % new_d

    svg, n_path = path_re.subn(repl_path, svg)

    # 2) <circle style="fill:none;...stroke...">  ----------------------------
    circle_re = re.compile(
        r'<circle cx="([^"]*)" cy="([^"]*)" r="([^"]*)" style="([^"]*fill:none[^"]*)"/>'
    )

    def repl_circle(m):
        cx, cy, r = float(m.group(1)), float(m.group(2)), float(m.group(3))
        style = parse_style(m.group(4))
        sw = float(style["stroke-width"].replace("px", ""))
        d = circle_to_ring_d(cx, cy, r, sw)
        return '<path d="%s" fill-rule="evenodd" fill="#000000" stroke="none"/>' % d

    svg, n_circle = circle_re.subn(repl_circle, svg)

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(svg)
    print("Pfade konvertiert: %d, Kreise konvertiert: %d" % (n_path, n_circle))
    print("geschrieben:", OUT)

    remaining = len(re.findall(r'fill:none', svg))
    print("verbleibende fill:none-Treffer:", remaining)


if __name__ == "__main__":
    main()
