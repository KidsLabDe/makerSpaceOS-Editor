# makerspaceos.py – Laufzeit für von makerSpaceOS erzeugte Programme
#
# Versteckt die asyncio-Mechanik (parallele Aufgaben, Flankenerkennung beim
# Polling), damit der generierte Code aus sauber benannten Handler-Funktionen
# plus kurzen Registrierungszeilen besteht (Stil wie MakeCode).
#
# Muss nach CIRCUITPY/lib/ kopiert werden (wie grove_rgb_lcd.py).
# Benötigt asyncio + adafruit_ticks im selben lib/-Ordner.
#
# Verwendung (so erzeugt der Generator den Code):
#   from makerspaceos import immer, wenn, start
#
#   async def fuer_immer():
#       print("läuft")
#
#   async def on_taster_a():
#       print("gedrückt")
#
#   immer(fuer_immer)
#   wenn(lambda: not button_a.value, on_taster_a)
#   start(beim_start)
import asyncio

_tasks = []   # alle registrierten Dauer-Aufgaben (Schleifen + Ereignisse)


def immer(fn):
    """Registriert eine Funktion, die endlos wiederholt wird (FÜR IMMER / parallele Schleife)."""
    async def _t():
        while True:
            await fn()
            await asyncio.sleep(0)   # Yield-Punkt: lässt die anderen Aufgaben dran
    _tasks.append(_t())


def wenn(bedingung, fn, poll=0.02):
    """Registriert einen Ereignis-Handler.

    `bedingung` ist eine Funktion (z.B. lambda), die True/False liefert.
    `fn` wird einmal aufgerufen, sobald die Bedingung von False auf True
    kippt (Flankenerkennung – feuert nicht erneut, solange sie True bleibt).
    `poll` ist der Abstand zwischen zwei Prüfungen in Sekunden.
    """
    async def _t():
        vorher = False
        while True:
            jetzt = bedingung()
            if jetzt and not vorher:
                await fn()
            vorher = jetzt
            await asyncio.sleep(poll)
    _tasks.append(_t())


def start(setup=None):
    """Startet das Programm: führt einmal `setup` aus (BEIM START),
    danach laufen alle registrierten Aufgaben parallel."""
    async def _main():
        if setup is not None:
            await setup()
        if _tasks:
            await asyncio.gather(*_tasks)
    asyncio.run(_main())
