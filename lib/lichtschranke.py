# lichtschranke.py – Reflex-Lichtschranke für rollende Kugeln
# (z. B. Pololu QTR-HD-01A oder ein Kanal des QTR-HD-02A)
#
# Etwas vor dem Sensor reflektiert mehr Licht → der Messwert SINKT.
#   Signal = Ruhewert - Messwert
#   erkannt, wenn Signal > Schwelle; wieder frei, wenn Signal < Schwelle / 2
# Der Ruhewert wird beim Start eingemessen und folgt danach langsam (ca. 2 s)
# dem Umgebungslicht. Während einer Erkennung bleibt er stehen.
#
# Gemessen wird in einer Hintergrund-Aufgabe (ca. alle 1 ms) und mitgezählt –
# so geht keine Kugel verloren, während ein Ereignis-Block noch beschäftigt ist.
# Blöcke, die lange blockieren (Ultraschall, DHT, LCD), können trotzdem dazu
# führen, dass eine schnelle Kugel übersehen wird.
#
# Muss zusammen mit makerspaceos.py nach CIRCUITPY/lib/ kopiert werden.
import time

import analogio
import asyncio
import supervisor

import makerspaceos

_AN = 2            # Messungen in Folge bis "erkannt" (ignoriert Störspitzen)
_AUS = 3           # Messungen in Folge bis "wieder frei"
_TAKT_MS = 10      # so oft wird der Ruhewert nachgeführt
_ALPHA = 0.005     # Anteil je Takt → Zeitkonstante ca. 2 s
_HAENGT_MS = 3000  # länger erkannt → keine Kugel: neuer Ruhewert
_TICKS_MASK = (1 << 29) - 1


def _seit(start):
    return (supervisor.ticks_ms() - start) & _TICKS_MASK


class Lichtschranke:
    def __init__(self, pin, name="", schwelle=2000):
        self.name = name
        self.schwelle = schwelle
        self.anzahl = 0
        self._sensor = analogio.AnalogIn(pin)
        self.neu_einmessen()
        makerspaceos.im_hintergrund(self._messen)

    def neu_einmessen(self):
        """Ruhewert neu bestimmen (dauert ca. 0,2 s, freie Sicht nötig)."""
        summe = 0
        for _ in range(200):
            summe += self._sensor.value
            time.sleep(0.001)
        self._ruhe_setzen(summe / 200)
        print("Lichtschranke {}: Ruhewert {}".format(self.name, int(self.ruhe)))

    def davor(self):
        """True, solange etwas vor dem Sensor ist."""
        return self._erkannt

    def ereignis(self):
        """Liefert eine Prüf-Funktion für makerspaceos.wenn().

        Sie ist je neuer Kugel genau einmal True und dazwischen einmal False,
        damit auch aufgestaute Kugeln einzeln gemeldet werden.
        """
        stand = [self.anzahl, False]   # [schon gemeldet, eben True gewesen]

        def neu():
            if stand[1] or stand[0] >= self.anzahl:
                stand[1] = False
                return False
            stand[0] += 1
            stand[1] = True
            return True

        return neu

    def deinit(self):
        self._sensor.deinit()

    def _ruhe_setzen(self, wert):
        self.ruhe = wert
        self._erkannt = False
        self._folge = 0
        self._spitze = 0
        self._seit_erkannt = 0

    def _pruefen(self, wert):
        signal = self.ruhe - wert
        if not self._erkannt:
            if signal <= self.schwelle:
                self._folge = 0
                return
            self._folge += 1
            if self._folge >= _AN:
                self._folge = 0
                self._erkannt = True
                self._spitze = signal
                self._seit_erkannt = supervisor.ticks_ms()
                self.anzahl += 1
            return

        if signal > self._spitze:
            self._spitze = signal
        if signal >= self.schwelle / 2:
            self._folge = 0
            return
        self._folge += 1
        if self._folge >= _AUS:
            self._folge = 0
            self._erkannt = False
            # Hilft beim Montieren: Signal sollte deutlich über der Schwelle liegen
            print("Lichtschranke {}: {} ms, Signal {} (Schwelle {})".format(
                self.name, _seit(self._seit_erkannt), int(self._spitze),
                self.schwelle))

    def _nachfuehren(self, wert):
        if self._erkannt:
            if _seit(self._seit_erkannt) > _HAENGT_MS:
                print("Lichtschranke {}: bleibt belegt, neuer Ruhewert".format(self.name))
                self._ruhe_setzen(wert)
        elif wert - self.ruhe > self.schwelle:
            # deutlich dunkler als der Ruhewert (liegengebliebene Kugel wurde
            # weggenommen) → sofort übernehmen
            self.ruhe = wert
        elif self._folge == 0:
            self.ruhe += (wert - self.ruhe) * _ALPHA

    async def _messen(self):
        takt = supervisor.ticks_ms()
        while True:
            wert = self._sensor.value
            self._pruefen(wert)
            if _seit(takt) >= _TAKT_MS:
                takt = supervisor.ticks_ms()
                self._nachfuehren(wert)
            await asyncio.sleep(0.001)
