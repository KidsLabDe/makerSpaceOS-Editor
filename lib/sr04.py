# sr04.py – HC-SR04 / SR04 Ultraschall-Entfernungsmesser (2-Pin-Protokoll: TRIG + ECHO)
# Muss nach CIRCUITPY/lib/ kopiert werden.
import digitalio
import time
try:
    import pulseio
except ImportError:
    pulseio = None

# Der Sensor braucht ~60 ms Pause zwischen zwei Messungen – sonst kommt
# jede zweite Messung ohne Echo zurück (am MAKER-PI gemessen).
_PAUSE_NS = 60_000_000
_TIMEOUT_NS = 30_000_000      # ~5 m Laufzeit, danach gilt die Messung als verloren

class SR04:
    def __init__(self, trig, echo):
        self._trig = digitalio.DigitalInOut(trig)
        self._trig.direction = digitalio.Direction.OUTPUT
        self._trig.value = False
        self._echo = None
        self._pulses = None
        if pulseio:
            try:
                # Hardware-Zeitmessung (PIO/RMT) – genauer als Python-Polling
                self._pulses = pulseio.PulseIn(echo, maxlen=4, idle_state=False)
                self._pulses.pause()
            except Exception:
                self._pulses = None
        if self._pulses is None:
            self._echo = digitalio.DigitalInOut(echo)
            self._echo.direction = digitalio.Direction.INPUT
        self._last = -1
        self._t_last = time.monotonic_ns() - _PAUSE_NS

    def deinit(self):
        """Gibt die Pins frei (wird vom Editor vor jedem neuen Lauf gerufen)."""
        for _p in (self._trig, self._echo, self._pulses):
            try:
                _p.deinit()
            except Exception:
                pass

    def _trigger(self):
        self._trig.value = True
        time.sleep(0.00001)        # 10 µs Trigger-Puls
        self._trig.value = False

    def _messen_pulsein(self):
        p = self._pulses
        p.clear()
        p.resume()
        self._trigger()
        t0 = time.monotonic_ns()
        while time.monotonic_ns() - t0 < _TIMEOUT_NS:
            # Kurze Störspitzen (< 2 cm) ignorieren
            for i in range(len(p)):
                if p[i] > 100:
                    p.pause()
                    return p[i] / 58
            time.sleep(0.001)
        p.pause()
        return None

    def _messen_polling(self):
        self._trigger()
        t0 = time.monotonic_ns()
        while not self._echo.value:            # auf steigende Echo-Flanke warten
            if time.monotonic_ns() - t0 > _TIMEOUT_NS:
                return None
        start = time.monotonic_ns()
        while self._echo.value:                # Echo-Pulslänge messen
            if time.monotonic_ns() - start > _TIMEOUT_NS:
                return None
        return (time.monotonic_ns() - start) / 1000 / 58

    @property
    def distance(self):
        """Abstand in cm (ca. 2–400 cm). Liefert bei zu schnellen Abfragen oder
        verlorenem Echo den letzten gültigen Wert; -1 nur, wenn noch nie gemessen."""
        now = time.monotonic_ns()
        if now - self._t_last < _PAUSE_NS:
            return self._last
        self._t_last = now
        if self._pulses is not None:
            cm = self._messen_pulsein()
        else:
            cm = self._messen_polling()
        if cm is not None and 2 <= cm <= 450:
            self._last = round(cm, 1)
        return self._last
