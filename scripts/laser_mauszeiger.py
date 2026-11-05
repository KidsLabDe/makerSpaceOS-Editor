# 3D-Mauszeiger (schräg extrudiert) als Laser-SVG für Karton
# rot = Schnitt (Außenkontur), schwarz = Schraffur der dicken Konturlinien
# Braucht shapely (pip install shapely), z. B. in einer venv:
#   python3 -m venv /tmp/venv && /tmp/venv/bin/pip install shapely
#   /tmp/venv/bin/python scripts/laser_mauszeiger.py
# Ausgabe: examples/mauszeiger_3d_laser.svg
import math, os
from shapely.geometry import Polygon, LineString, MultiLineString
from shapely.ops import unary_union
from shapely import affinity

HEIGHT = 100.0   # Gesamthöhe Motiv in mm
LINE = 0.5       # Dicke der schwarzen Linien (in Zeiger-Einheiten, Höhe ~18)
GAP = 0.4        # Schraffur-Abstand in mm
ANGLE = 110      # Schraffur-Winkel (quer zu allen Kanten)
MARGIN = 5.0

front = Polygon([(0,0),(0,15.5),(3.7,12.0),(6.1,17.6),(8.6,16.5),(6.2,11.0),(10.8,10.9)])
front = affinity.rotate(front, -17, origin=(0,0))   # y nach unten → optisch gegen den Uhrzeigersinn
d = (-1.6, 1.1)                                      # Extrusionsrichtung (nach links unten)

pts = list(front.exterior.coords)[:-1]
# Außennormale bestimmen: Polygon-Orientierung prüfen
area = sum(pts[i][0]*pts[(i+1)%len(pts)][1]-pts[(i+1)%len(pts)][0]*pts[i][1] for i in range(len(pts)))
quads = []
for i in range(len(pts)):
    a, b = pts[i], pts[(i+1)%len(pts)]
    ex, ey = b[0]-a[0], b[1]-a[1]
    n = (ey, -ex) if area > 0 else (-ey, ex)
    if n[0]*d[0] + n[1]*d[1] > 0:   # Seitenfläche zeigt zum Betrachter
        quads.append(Polygon([a, b, (b[0]+d[0], b[1]+d[1]), (a[0]+d[0], a[1]+d[1])]))
back = affinity.translate(front, *d)
sil = unary_union([front, back] + quads)

# Sichtbare Kanten: Vorderseite + Seitenflächen (ohne das, was die Vorderseite verdeckt)
edges = [front.exterior]
for q in quads:
    edges.append(q.exterior.difference(front))
edges.append(sil.exterior)
black = unary_union([e.buffer(LINE/2, join_style="mitre", cap_style="flat") for e in edges])
black = black.buffer(0.02, join_style="mitre").buffer(-0.02, join_style="mitre")
black = unary_union([black, sil.difference(sil.buffer(-LINE, join_style="mitre"))]).intersection(sil)

# Skalieren auf mm und verschieben
minx, miny, maxx, maxy = sil.bounds
s = HEIGHT / (maxy - miny)
def tf(g):
    g = affinity.translate(g, -minx, -miny)
    g = affinity.scale(g, s, s, origin=(0,0))
    return affinity.translate(g, MARGIN, MARGIN)
sil, black = tf(sil), tf(black)
W = (maxx-minx)*s + 2*MARGIN; H = HEIGHT + 2*MARGIN

# Schraffur
diag = math.hypot(W, H); c = (W/2, H/2)
hl = []
k = -diag
while k < diag:
    hl.append(LineString([(c[0]-diag, c[1]+k), (c[0]+diag, c[1]+k)]))
    k += GAP
hatch = affinity.rotate(MultiLineString(hl), ANGLE, origin=c).intersection(black)

def lines_d(g):
    geoms = getattr(g, "geoms", [g])
    out = []
    for l in geoms:
        if l.geom_type != "LineString" or l.length < 0.05: continue
        out.append("M" + " L".join(f"{x:.3f},{y:.3f}" for x, y in l.coords))
    return " ".join(out)
def poly_d(p):
    out = []
    for ring in [p.exterior, *p.interiors]:
        out.append("M" + " L".join(f"{x:.3f},{y:.3f}" for x, y in list(ring.coords)[:-1]) + " Z")
    return " ".join(out)

svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W:.2f}mm" height="{H:.2f}mm" viewBox="0 0 {W:.3f} {H:.3f}">
  <!-- Schwarz: Schraffur (Gravur) -->
  <path id="schraffur" fill="none" stroke="#000000" stroke-width="0.1" d="{lines_d(hatch)}"/>
  <!-- Rot: Schnitt (Außenkontur) -->
  <path id="schnitt" fill="none" stroke="#FF0000" stroke-width="0.1" d="{poly_d(sil)}"/>
</svg>
'''
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "examples", "mauszeiger_3d_laser.svg")
open(OUT, "w").write(svg)
print(f"{W:.1f} x {H:.1f} mm, Schnitt-Ringe: {1+len(sil.interiors)}, Typ {sil.geom_type}")
