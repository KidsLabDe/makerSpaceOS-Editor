# grove_ultrasonic.py – Grove Ultrasonic Ranger V2 (Single-Pin-Protokoll)
# Muss nach CIRCUITPY/lib/ kopiert werden.
import digitalio
import time

class GroveUltrasonic:
    def __init__(self, pin):
        self._pin = pin

    @property
    def distance(self):
        """Abstand in cm (ca. 2–350 cm). Gibt -1 zurück bei Timeout."""
        io = digitalio.DigitalInOut(self._pin)
        io.direction = digitalio.Direction.OUTPUT
        io.value = False
        time.sleep(0.000002)
        io.value = True
        time.sleep(0.00001)
        io.value = False
        io.switch_to_input()
        t0 = time.monotonic_ns()
        while not io.value:
            if time.monotonic_ns() - t0 > 30_000_000:
                io.deinit()
                return -1
        start = time.monotonic_ns()
        while io.value:
            if time.monotonic_ns() - start > 30_000_000:
                break
        dur = time.monotonic_ns() - start
        io.deinit()
        return round((dur / 1000) / 58, 1)
