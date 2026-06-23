# Event-Blöcke (Lego-Spike-Stil) mit asyncio

## Kontext

makerSpaceOS erzeugte ursprünglich **eine einzige `while True:`-Schleife** (`workspaceToCode` nahm nur den *ersten* `control_forever`-Block). Die alten `event_*`-Blöcke waren nur `if`-Abfragen *innerhalb* dieser Schleife. Folge: Sobald irgendwo `time.sleep()` lief (Warte-Block, LED-blinken, Buzzer), **fror das ganze Programm ein** – eine Dauer-Animation und eine gleichzeitige Sensor-Reaktion waren unmöglich.

Ziel (wie bei Lego Spike): mehrere **unabhängige „Hut"-Stapel**, die **echt nebenläufig** laufen – z. B. eine NeoPixel-Animation in einer Endlosschleife *und* parallel eine Reaktion auf einen Taster/Sensor.

Lösung: **kooperatives Multitasking mit `asyncio`**. Jeder Top-Level-Stapel wird zu einer eigenen `async`-Aufgabe, `time.sleep()` wird zu `await asyncio.sleep()`, alle Aufgaben laufen über `asyncio.gather()`.

## Zielbild des generierten Codes

```python
# === makerSpaceOS – Generierter Code ===
import asyncio
import board
import digitalio

# --- Initialisierungen ---
_btn_B1 = digitalio.DigitalInOut(board.GP20)
_btn_B1.switch_to_input(pull=digitalio.Pull.UP)

# --- Aufgaben (laufen parallel) ---
async def _task0():            # aus "FÜR IMMER" / loop_parallel
    while True:
        _pixels.fill((0, 0, 30)); _pixels.show()
        await asyncio.sleep(0.5)
        _pixels.fill((0, 0, 0)); _pixels.show()
        await asyncio.sleep(0.5)
        await asyncio.sleep(0)          # garantiertes Yield

async def _task1():            # aus "Wenn Taster gedrückt"
    _prev = False
    while True:
        _now = (not _btn_B1.value)
        if _now and not _prev:          # kantengetriggert: einmal pro Ereignis
            _buzz.frequency = 440; _buzz.duty_cycle = 32768
        _prev = _now
        await asyncio.sleep(0.02)

# --- Start ---
async def _main():
    # (Setup-Code als Prolog, falls vorhanden)
    await asyncio.gather(_task0(), _task1())

asyncio.run(_main())
```

Kernmodell: **jeder Top-Level-Stapel → eine `async def _taskN()`**, gesammelt und per `asyncio.gather` parallel gestartet. `control_setup` läuft einmal als Prolog in `_main()`.

## Umsetzung

### `js/generator.js`

- **`workspaceToCode`** sammelt jetzt *alle* Top-Level-Stapel statt nur den ersten `control_forever`:
  - `control_setup` (max. 1) → füllt `_setupCode` (Prolog in `_main`).
  - alle `control_forever` **und** `loop_parallel` → je eine Loop-Aufgabe (`_wrapLoop`).
  - alle `when_*`-Hut-Blöcke (Liste in `_HAT_TYPES`) → je eine kantengetriggerte Aufgabe.
  - Die fertigen Aufgaben-Bodys landen im Modul-Array `_tasks`.
- **`finish()`** baut die `async def _taskN()`-Hüllen, `async def _main()` mit `asyncio.gather(...)` und `asyncio.run(_main())`. `import asyncio` wird zentral gesetzt, sobald es Aufgaben gibt (oder der Setup-Code `await` nutzt). Ohne Aufgaben/await wird der Setup-Code dedentiert auf Modulebene ausgegeben.
- **Helfer**: `_indent(code, levels)`, `_dedent(code)`, `_wrapLoop(body)` (Endlosschleife + abschließendes `await asyncio.sleep(0)` als Yield), `_whenTask(activeExpr, body, poll)` (kantengetriggerte Polling-Schleife). Der Body innerhalb der `if`-Bedingung wird via `_indent(body, 1)` eine Ebene tiefer gesetzt.
- **`when_*`-Generatoren** geben den fertigen Aufgaben-Body via `_whenTask(...)` zurück:
  - Digitale Trigger (`when_button`, `when_obstacle`, `when_line`, `when_tilt`, `when_magnetic`, `when_flame`, `when_sound`, `when_touch`, `when_vibration`) nutzen `_digitalInDef`/`BOARD.buttons`; Poll `0.02`.
  - Schwellwert-Trigger (`when_distance`, `when_light`, `when_temperature`) mit OP-Dropdown + Wert-Eingang; Poll `0.05` bzw. `1` (DHT22).
- **Sleep → await**: `control_wait`, `actuator_led_blink`, `actuator_buzzer` erzeugen `await asyncio.sleep(...)` statt `time.sleep(...)`; das alte `import time` entfällt.

### `js/blocks/events.js` (neu)

Hut-Block-Definitionen (eigenständige Top-Level-Blöcke ohne `setPreviousStatement`/`setNextStatement`, Farbe `#0D47A1`): `loop_parallel`, `when_button` (mit gedrückt/losgelassen), 8 digitale `when_*`-Blöcke und 3 Schwellwert-`when_*`-Blöcke.

### `index.html`, `js/toolbox.js`

`events.js` nach `control.js` eingebunden; neue Toolbox-Kategorie **„🎬 Ereignisse"** (`#0D47A1`) mit allen Hut-Blöcken und Shadow-Zahlen für die Schwellwert-Blöcke.

## Abhängigkeiten

`asyncio` und `adafruit_ticks` müssen in `CIRCUITPY/lib/` liegen (beide im Standard-Adafruit-Bundle; `asyncio` hängt von `adafruit_ticks` ab). Der generierte Code nutzt immer das async-Modell.

## Designentscheidungen

- **Kantentrigger** (`if _now and not _prev`) = Spikes „Wenn X passiert" (einmal pro Ereignis). `_prev`/`_now` sind lokal je Aufgabe – keine Kollision.
- **Mehrere parallele Loops** über `control_forever` + beliebig viele `loop_parallel`.
- **Setup im Prolog** von `_main()` – darf damit auch `await` (Warte-Block) enthalten.
- **Rückwärtskompatibel**: Projekte mit nur SETUP + FÜR IMMER erzeugen weiter gültigen Code (FÜR IMMER → genau eine Aufgabe). Alte inline-`event_*`-Blöcke funktionieren unverändert als `if` im Loop-Body.

## Verifikation

1. **Syntax-Gate (offline)**: generierten Code in eine Datei schreiben und `python3 -c "import ast,sys; ast.parse(open(sys.argv[1]).read())" out.py` – prüft async-Struktur/Einrückung ohne Hardware. (Mit einem Blockly-Stub in Node automatisierbar.)
2. **Browser (Chrome/Edge)**: `index.html` öffnen, „FÜR IMMER" (NeoPixel-Blink + Warte) plus „Wenn Taster gedrückt" (Buzzer) bauen. Code-Panel prüfen: `import asyncio`, je eine `async def _taskN()`, `await asyncio.sleep`, `asyncio.run(_main())`; kein `time.sleep`, kein `while True:` auf Modulebene.
3. **Hardware (MAKER-PI-RP2040)**: `asyncio` + `adafruit_ticks` nach `CIRCUITPY/lib/`, Code flashen, prüfen dass Animation **und** Taster-Reaktion gleichzeitig laufen (Animation stockt nicht beim Tasterdruck).
