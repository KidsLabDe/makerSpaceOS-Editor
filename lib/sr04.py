# sr04.py – HC-SR04 / SR04 Ultraschall-Entfernungsmesser (2-Pin-Protokoll: TRIG + ECHO)
# Muss nach CIRCUITPY/lib/ kopiert werden.
import digitalio
import time

class SR04:
    def __init__(self, trig, echo):
        self._trig = digitalio.DigitalInOut(trig)
        self._trig.direction = digitalio.Direction.OUTPUT
        self._trig.value = False
        self._echo = digitalio.DigitalInOut(echo)
        self._echo.direction = digitalio.Direction.INPUT

    def deinit(self):
        """Gibt die Pins frei (wird vom Editor vor jedem neuen Lauf gerufen)."""
        for _p in (self._trig, self._echo):
            try:
                _p.deinit()
            except Exception:
                pass

    @property
    def distance(self):
        """Abstand in cm (ca. 2–400 cm). Gibt -1 zurück bei Timeout (30 ms)."""
        self._trig.value = False
        time.sleep(0.000002)
        self._trig.value = True
        time.sleep(0.000010)        # 10 µs Trigger-Puls
        self._trig.value = False
        t0 = time.monotonic_ns()
        while not self._echo.value:            # auf steigende Echo-Flanke warten
            if time.monotonic_ns() - t0 > 30_000_000:
                return -1
        start = time.monotonic_ns()
        while self._echo.value:                # Echo-Pulslänge messen
            if time.monotonic_ns() - start > 30_000_000:
                break
        return round((time.monotonic_ns() - start) / 1000 / 58, 1)
