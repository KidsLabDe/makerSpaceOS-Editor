# robo_display.py – rundes Display (GC9A01, 240×240) des RoboBuddy
#
# Muss nach /lib/ auf das Board, zusammen mit gc9a01.py und
# adafruit_display_text/. Der generierte Code ruft nur diese Funktionen auf:
#
#   gesicht("froehlich")   froehlich | traurig | ueberrascht | muede | wuetend | verliebt
#   augen("links")         links | rechts | oben | unten | mitte
#   text("Hallo", "#00FFFF")    Farben als "#RRGGBB" oder Zahl 0xRRGGBB
#   zahl(42, "#FFFFFF")
#   fuellen("#FF0000")
#   loeschen()
#
# Alles liegt in EINER displayio.Group; jeder Aufruf tauscht nur den Inhalt.
# Das Display bleibt über mehrere „Ausführen“ hinweg in diesem Modul
# initialisiert (sys.modules) – so gibt es kein „Pin in Benutzung“.
import busio
import displayio
import fourwire
import terminalio
import vectorio
import microcontroller

P = microcontroller.pin
ROTATION = 0          # im Gehäuse prüfen; 0/90/180/270
AUGEN_FARBE = 0x00E5FF
MUND_FARBE = 0xFFFFFF

_disp = None
_spi = None
_root = None
_bg_pal = None
_gesicht = None       # Group mit Augen + Mund
_augen = None         # Group nur mit den Augen (wird zum Schauen verschoben)
_label = None
_name = "froehlich"


def _start():
    global _disp, _spi, _root, _bg_pal, _gesicht, _augen, _label
    if _disp is not None:
        if _disp.root_group is not _root:
            _disp.root_group = _root   # nach Programmende zeigt CP die Konsole
        return
    import gc9a01
    displayio.release_displays()
    if _spi is not None:
        try:
            _spi.deinit()
        except Exception:
            pass
    _spi = busio.SPI(clock=P.GPIO4, MOSI=P.GPIO5)
    bus = fourwire.FourWire(_spi, command=P.GPIO20, chip_select=P.GPIO21,
                            reset=P.GPIO3, baudrate=40_000_000)
    _disp = gc9a01.GC9A01(bus, rotation=ROTATION)
    _root = displayio.Group()
    _bg_pal = displayio.Palette(1)
    _bg_pal[0] = 0x000000
    _root.append(vectorio.Rectangle(pixel_shader=_bg_pal, width=240, height=240, x=0, y=0))
    _gesicht = displayio.Group()
    _augen = displayio.Group()
    _root.append(_gesicht)
    from adafruit_display_text import label
    _label = label.Label(terminalio.FONT, text="", color=0xFFFFFF,
                         anchor_point=(0.5, 0.5), anchored_position=(120, 120))
    _root.append(_label)
    _disp.root_group = _root


def _farbe(f):
    if isinstance(f, str):
        return int(f.lstrip("#"), 16)
    return f


def _pal(farbe):
    p = displayio.Palette(1)
    p[0] = farbe
    return p


def _bogen(cx, cy, r, dicke, von, bis, n=12):
    """Dicker Kreisbogen als Polygon (Winkel in Grad, 0 = rechts, 90 = unten)."""
    import math
    aussen, innen = [], []
    for k in range(n + 1):
        w = math.radians(von + (bis - von) * k / n)
        c, s = math.cos(w), math.sin(w)
        aussen.append((int(cx + r * c), int(cy + r * s)))
        innen.append((int(cx + (r - dicke) * c), int(cy + (r - dicke) * s)))
    return aussen + innen[::-1]


def _herz(cx, cy, g):
    return [(cx, cy + g), (cx - g, cy), (cx - g, cy - g // 2), (cx - g // 2, cy - g),
            (cx, cy - g // 2), (cx + g // 2, cy - g), (cx + g, cy - g // 2), (cx + g, cy)]


def _leeren(gruppe):
    while len(gruppe):
        gruppe.pop()


def _zeichne(name):
    _leeren(_gesicht)
    _leeren(_augen)
    auge = _pal(AUGEN_FARBE)
    mund = _pal(MUND_FARBE)
    lx, rx, ay = 80, 160, 95
    if name == "ueberrascht":
        for x in (lx, rx):
            _augen.append(vectorio.Circle(pixel_shader=auge, radius=30, x=x, y=ay))
        _gesicht.append(vectorio.Circle(pixel_shader=mund, radius=16, x=120, y=170))
    elif name == "muede":
        for x in (lx, rx):
            _augen.append(vectorio.Rectangle(pixel_shader=auge, width=50, height=10, x=x - 25, y=ay))
        _gesicht.append(vectorio.Rectangle(pixel_shader=mund, width=50, height=8, x=95, y=170))
    elif name == "verliebt":
        rot = _pal(0xFF1744)
        for x in (lx, rx):
            _augen.append(vectorio.Polygon(pixel_shader=rot, points=_herz(x, ay, 24), x=0, y=0))
        _gesicht.append(vectorio.Polygon(pixel_shader=mund, points=_bogen(120, 130, 50, 10, 30, 150), x=0, y=0))
    else:
        for x in (lx, rx):
            _augen.append(vectorio.Circle(pixel_shader=auge, radius=24, x=x, y=ay))
        if name == "traurig":
            _gesicht.append(vectorio.Polygon(pixel_shader=mund, points=_bogen(120, 205, 45, 10, 210, 330), x=0, y=0))
        elif name == "wuetend":
            rot = _pal(0xFF3D00)
            _gesicht.append(vectorio.Polygon(pixel_shader=rot, points=[(50, 55), (105, 72), (105, 82), (50, 65)], x=0, y=0))
            _gesicht.append(vectorio.Polygon(pixel_shader=rot, points=[(190, 55), (135, 72), (135, 82), (190, 65)], x=0, y=0))
            _gesicht.append(vectorio.Rectangle(pixel_shader=mund, width=60, height=10, x=90, y=170))
        else:   # froehlich
            _gesicht.append(vectorio.Polygon(pixel_shader=mund, points=_bogen(120, 130, 50, 10, 30, 150), x=0, y=0))
    _gesicht.append(_augen)


def gesicht(name="froehlich"):
    """Fertiges Gesicht zeigen (Text wird ausgeblendet)."""
    global _name
    _start()
    _name = name
    _label.text = ""
    _bg_pal[0] = 0x000000
    _zeichne(name)
    _gesicht.hidden = False


_BLICK = {"links": (-25, 0), "rechts": (25, 0), "oben": (0, -20), "unten": (0, 20), "mitte": (0, 0)}


def augen(richtung="mitte"):
    """Augen in eine Richtung schauen lassen (zeigt das Gesicht, falls nötig)."""
    _start()
    if not len(_gesicht) or _gesicht.hidden:
        gesicht(_name)
    _augen.x, _augen.y = _BLICK.get(richtung, (0, 0))


def _zeige_text(s, farbe, gross):
    _start()
    _gesicht.hidden = True
    s = str(s)
    n = max(1, len(s))
    if gross:
        scale = 6 if n <= 3 else 5 if n <= 4 else 4 if n <= 5 else 3 if n <= 7 else 2
    else:
        scale = 4 if n <= 4 else 3 if n <= 6 else 2 if n <= 10 else 1
    _label.scale = scale
    _label.color = _farbe(farbe)
    _label.text = s


def text(s, farbe=0xFFFFFF):
    """Eine Zeile Text mittig anzeigen (Größe passt sich der Länge an)."""
    _zeige_text(s, farbe, False)


def zahl(n, farbe=0xFFFFFF):
    """Eine Zahl groß und mittig anzeigen."""
    if isinstance(n, float):
        n = int(n) if n == int(n) else round(n, 1)
    _zeige_text(n, farbe, True)


def fuellen(farbe):
    """Ganzes Display in einer Farbe (Gesicht und Text verschwinden)."""
    _start()
    _gesicht.hidden = True
    _label.text = ""
    _bg_pal[0] = _farbe(farbe)


def loeschen():
    """Display schwarz."""
    fuellen(0)
