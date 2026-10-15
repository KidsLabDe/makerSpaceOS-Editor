# robobuddy.py – Laufzeit-Helfer für den RoboBuddy
# (MF26 Robo-Buddy, Power-Trägerplatine Rev 0.2, Waveshare ESP32-C6-Zero).
#
# Muss nach /lib/ auf das Board (wie makerspaceos.py). Benötigt ina226.py,
# asyncio und adafruit_ticks im selben Ordner.
#
# Inhalt:
#   board          – Pin-Namen IO0 … IO30 wie im Editor. Der generische
#                    CircuitPython-Build (ESP32-C6-DevKitC-1-N8) kennt IO14
#                    nicht und nennt IO16/IO17 TX/RX; der generierte Code
#                    schreibt deshalb `from robobuddy import board`.
#   servo_strom()  – 5-V-Boost der Servo-Schiene (SERVO_EN = IO15) an/aus
#   akku_*()       – Spannung, Strom, Ladezustand über den INA226 (0x45)
#   akku_waechter()– Tiefentladeschutz als Hintergrund-Aufgabe
#   fahren()       – beide Rad-Servos mit sanfter Anfahr-Rampe
import time
import digitalio
import microcontroller

try:
    import makerspaceos as _ms
except ImportError:
    _ms = None


class board:
    """Pin-Namen wie im Editor (IOxx = GPIOxx) plus sprechende Namen."""


for _n in dir(microcontroller.pin):
    if _n.startswith("GPIO"):
        setattr(board, "IO" + _n[4:], getattr(microcontroller.pin, _n))
board.SDA = board.IO14
board.SCL = board.IO22
board.SERVO_EN = board.IO15
board.NEOPIXEL = board.IO8
board.SERVO1 = board.IO19
board.SERVO2 = board.IO18
board.SERVO3 = board.IO16
board.SERVO4 = board.IO17

# ── Servo-Schiene ─────────────────────────────────────────────────────────────
# Der Boost läuft nur, wenn SERVO_EN High ist UND eine Zelle steckt (auch an
# USB). Das DigitalInOut bleibt über mehrere „Ausführen“ hinweg in diesem
# Modul (sys.modules) bestehen – so gibt es kein „IO15 in Benutzung“.
_servo_en = None


def servo_strom(an=True):
    """Servo-Schiene ein-/ausschalten. Beim Einschalten 50 ms warten, bis der
    Boost hochgelaufen ist – sonst gehen die ersten Pulse ins Leere."""
    global _servo_en
    if _servo_en is None:
        _servo_en = digitalio.DigitalInOut(board.SERVO_EN)
        _servo_en.switch_to_output(False)
    if an:
        if not _servo_en.value:
            _servo_en.value = True
            time.sleep(0.05)
        if _ms is not None:
            _ms.beim_beenden(_servo_aus)
    else:
        _servo_en.value = False


def _servo_aus():
    servo_strom(False)


# ── Akku (INA226) ─────────────────────────────────────────────────────────────
AKKU_WARNUNG = 3.6     # V – einmal warnen (Ereignis „wenn Akku schwach“)
AKKU_LEER = 3.5        # V in Ruhe – Servos aus, schlafen gehen
AKKU_LEER_LAST = 3.3   # V unter Last (> 200 mA) – Spannung sackt beim Fahren ab
_ina = None


def akku_start(i2c):
    """Messchip am (geteilten) I2C-Bus anmelden. Gibt False zurück, wenn er
    nicht antwortet (dann liefern die akku_*-Funktionen 0)."""
    global _ina
    from ina226 import INA226
    try:
        _ina = INA226(i2c, 0x45, 0.010)
    except (OSError, ValueError, RuntimeError):
        _ina = None
        print("Akku-Messchip (INA226) antwortet nicht.")
    return _ina is not None


def akku_spannung():
    """Zellspannung in Volt (2 Nachkommastellen)."""
    return round(_ina.spannung, 2) if _ina else 0


def akku_strom():
    """Zellstrom in mA. Positiv = Akku wird geladen, negativ = Roboter
    verbraucht Strom."""
    return round(-_ina.strom_ma) if _ina else 0


def akku_laedt():
    """True, solange Strom in den Akku fließt (Schwelle gegen Rauschen)."""
    return akku_strom() > 20


# Ruhespannung → Ladezustand (grob, für Kinder). Unter Last und beim Laden
# ungenau – Ladungszählung wäre über Programmneustarts nicht verlässlich.
_KURVE = ((3.50, 0), (3.60, 5), (3.70, 15), (3.75, 25), (3.80, 40),
          (3.85, 50), (3.90, 60), (3.95, 70), (4.00, 80), (4.08, 90), (4.15, 100))


def akku_prozent():
    v = akku_spannung()
    if v <= _KURVE[0][0]:
        return 0
    for (v0, p0), (v1, p1) in zip(_KURVE, _KURVE[1:]):
        if v <= v1:
            return round(p0 + (p1 - p0) * (v - v0) / (v1 - v0))
    return 100


def akku_plausibel(v, streuung=0):
    """Ohne Zelle gibt der Lader an BAT+ eine pendelnde Spannung aus
    (gemessen: 4,13 … 4,39 V innerhalb von Sekunden). Eine echte Zelle
    schwankt in Ruhe nur um wenige mV. Außerhalb 3,0 … 4,3 V oder mit mehr
    als 80 mV Streuung gilt das als „kein Akku“."""
    return 3.0 <= v <= 4.3 and streuung < 0.08


def akku_waechter():
    """Tiefentladeschutz: Läuft als Hintergrund-Aufgabe neben dem Programm.
    Unter 3,6 V einmal warnen; 5 s am Stück unter 3,5 V (unter Last 3,3 V)
    → Servos aus, Meldung, Tiefschlaf. Ohne Akku nur ein Hinweis."""
    if _ms is None or _ina is None:
        return
    import asyncio

    async def _t():
        gewarnt = kein_akku_gemeldet = False
        leer = 0
        while True:
            werte = []
            for _ in range(5):
                werte.append(_ina.spannung)
                await asyncio.sleep(0.05)
            v = sum(werte) / len(werte)
            i = _ina.strom_ma
            if not akku_plausibel(v, max(werte) - min(werte)):
                leer = 0
                if not kein_akku_gemeldet:
                    kein_akku_gemeldet = True
                    print("Kein Akku erkannt – die Servos laufen nur mit eingestecktem Akku.")
            else:
                if v < AKKU_WARNUNG and not gewarnt:
                    gewarnt = True
                    print("Akku schwach (%.2f V) – bitte bald laden!" % v)
                grenze = AKKU_LEER_LAST if i > 200 else AKKU_LEER
                leer = leer + 1 if v < grenze else 0
                if leer >= 5:
                    _akku_leer(v)
            await asyncio.sleep(0.75)

    _ms._tasks.append(_t())


def _akku_leer(v):
    servo_strom(False)
    print("Akku leer (%.2f V) – Servos aus, RoboBuddy schläft. Bitte laden!" % v)
    try:
        import alarm
        # Nach einer Stunde kurz aufwachen und erneut prüfen (code.py).
        alarm.exit_and_deep_sleep_until_alarms(
            alarm.time.TimeAlarm(monotonic_time=time.monotonic() + 3600))
    except Exception:
        # Ohne Tiefschlaf zumindest das Programm anhalten.
        raise KeyboardInterrupt


# ── Fahren (zwei Dauerdreh-Servos, Panzerantrieb) ─────────────────────────────
# links = S2, rechts = S1 (gespiegelt eingebaut; der Generator übergibt die
# Räder in dieser Reihenfolge – Profil `drive`). Pulsbreite 1050…1950 µs,
# 1500 µs = Stillstand. Anfahren/Bremsen über 200 ms in kleinen Schritten –
# halbiert die Stromspitzen und schont Akku und Zellschutz.
RAMPE_S = 0.2
_RICHTUNG = {
    "vor": (1, 1), "zurueck": (-1, -1),
    "links": (-1, 1), "rechts": (1, -1), "stopp": (0, 0),
}


def _throttle_jetzt(rad):
    # Vor dem ersten Befehl ist duty_cycle = 0 (kein Puls) – throttle läge
    # dann weit unter -1. Das zählt als Stillstand.
    pwm = getattr(rad, "_pwm_out", None)
    if pwm is not None and pwm.duty_cycle == 0:
        return 0
    try:
        return max(-1, min(1, rad.throttle))
    except (TypeError, ValueError):
        return 0


async def rad_rampe(raeder, ziele):
    """Mehrere Rad-Servos (ContinuousServo) gleichzeitig sanft auf neue
    throttle-Werte (-1 … 1) fahren."""
    import asyncio
    starts = [_throttle_jetzt(r) for r in raeder]
    schritte = 10
    for n in range(1, schritte + 1):
        for r, a, z in zip(raeder, starts, ziele):
            r.throttle = a + (z - a) * n / schritte
        await asyncio.sleep(RAMPE_S / schritte)


async def fahren(links, rechts, richtung, tempo):
    """richtung: vor | zurueck | links | rechts | stopp, tempo 0 … 100 %."""
    t = max(0, min(100, tempo)) / 100
    fl, fr = _RICHTUNG.get(richtung, (0, 0))
    await rad_rampe((links, rechts), (fl * t, -fr * t))
