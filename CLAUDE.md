# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt-Überblick

CircuitBlox ist eine **browser-basierte Blockly-IDE**, die visuelle Blöcke in **CircuitPython**-Code für den **Cytron MAKER-PI-RP2040** (RP2040, CircuitPython) übersetzt. Kein Build-Schritt, kein npm – reine statische HTML/JS/CSS-App.

Zielgruppe: **Kinder und Einsteiger**. Alle UI-Strings und Code-Kommentare sind auf **Deutsch**.

## Architektur

```
index.html           – Einstiegspunkt, lädt alle Skripte
css/style.css        – Dunkles Theme, CSS-Variablen
js/
  boards.js          – Board-Profile + Pin-Konstanten (BOARD global)
  toolbox.js         – Blockly-Toolbox-Definition (TOOLBOX global)
  blocks/
    control.js       – SETUP- und FÜR-IMMER-Pflichtblöcke
    events.js        – Ereignis-Hut-Blöcke (when_*, loop_parallel) → parallele async-Aufgaben
    sensors.js       – Sensor-Block-Definitionen (Blockly.Blocks[...])
    actuators.js     – Aktor-Block-Definitionen
  generator.js       – Blockly → CircuitPython Transpiler (asyncio-Multitask-Modell)
  app.js             – Workspace-Init, UI-Events
  serial.js          – Web Serial API (Raw REPL)
RaspberryPico_allCodes_en/  – MicroPython-Referenzdateien (nicht geladen, nur Doku)
```

Die JS-Dateien werden direkt im Browser geladen – es gibt keinen Build-Schritt. Ein Syntaxfehler bricht die App stumm.

## Neuen Block hinzufügen – das 3-Datei-Pattern

Jeder neue Block braucht Einträge in exakt drei Dateien:

1. **`js/blocks/sensors.js`** oder **`js/blocks/actuators.js`** – Block-Definition:
   ```js
   Blockly.Blocks['mein_block'] = {
     init: function() { ... }
   };
   ```

2. **`js/generator.js`** – CircuitPython-Generator (an das Ende anhängen):
   ```js
   Blockly.Python['mein_block'] = function(block) {
     _defs['import_board'] = 'import board';
     // weitere _defs-Einträge ...
     return 'generierter_code\n';  // oder [ausdruck, ORDER_...]
   };
   ```

3. **`js/toolbox.js`** – Eintrag im passenden `contents`-Array:
   ```js
   { kind: 'block', type: 'mein_block' }
   ```

Alle drei Schritte sind Pflicht – fehlt einer, erscheint der Block nicht oder generiert keinen Code.

## Generator-Regeln (`generator.js`)

- **`_defs`-Objekt** dedupliziert Imports und Initialisierungen. Keys sind eindeutige Strings (z.B. `'import_board'`, `'init_led_GP16'`). Gleicher Key = gleicher Eintrag → automatisch dedupliziert.
- **Imports** (`import ...` / `from ...`) werden automatisch an den Anfang sortiert.
- **Reihenfolge-Gotcha bei I2C**: Wenn ein Objekt auf ein anderes referenziert (z.B. `_bmp280` auf `_i2c_bmp`), beide in einem einzigen `_defs`-Eintrag zusammenfassen, da Keys alphabetisch sortiert werden.
- **Hilfsfunktionen** `_digitalInDef(pin, varPrefix, pull)` und `_digitalOutDef(pin, varPrefix)` für digitale Ein-/Ausgänge nutzen (Boilerplate vermeiden).
- Wert-Blöcke geben `[ausdruck, Blockly.Python.ORDER_...]` zurück; Statement-Blöcke geben einen Code-String zurück.
- Schwebende Blöcke (kein SETUP, FÜR IMMER, `loop_parallel` oder `when_*`) werden ignoriert.
- **Kein `time.sleep()` mehr** – Wartezeiten als `await asyncio.sleep(...)` generieren (siehe Ausführungsmodell), sonst blockiert ein Block alle parallelen Aufgaben.

## Ausführungsmodell (asyncio-Multitask)

Der Generator erzeugt **kein einzelnes `while True:`** mehr, sondern ein kooperatives Multitasking-Programm (`generator.js`, `workspaceToCode`/`finish`):

- Jeder **Top-Level-Stapel** wird zu einer eigenen `async def _taskN()`: `control_forever` und `loop_parallel` → Endlosschleife; jeder `when_*`-Hut-Block → kantengetriggerte Polling-Aufgabe (`_whenTask`, feuert einmal beim Wahr-Werden).
- Alle Aufgaben starten parallel via `asyncio.gather()` in `async def _main()`, gestartet mit `asyncio.run(_main())`.
- `control_setup` läuft einmal als Prolog in `_main()` (darf daher auch `await` enthalten).
- Helfer: `_indent(code, levels)`, `_wrapLoop(body)`, `_whenTask(expr, body, poll)`. Jeder Hut-Generator gibt den **fertigen Aufgaben-Body** zurück; `workspaceToCode` sammelt sie in `_tasks` und `finish()` baut die `async def`-Hüllen.
- Ein neuer Ereignis-Hut-Block braucht: Definition in `js/blocks/events.js`, Generator in `generator.js` (gibt `_whenTask(...)` zurück), Eintrag im `_HAT_TYPES`-Array **und** in der Toolbox-Kategorie „🎬 Ereignisse".

## Block-Design-Prinzipien

- **Emoji im Label** – jeder Block bekommt ein passendes Emoji (🌡️, 🚧, ⚡ …).
- **Minimale Pflichtfelder** – so wenige Dropdowns/Eingaben wie möglich; sinnvolle Defaults.
- **Kein Fachvokabular** – Kinder sollen Blöcke ohne Erklärung verstehen.
- **Deutsche Labels und Tooltips** durchgängig.
- Sensor-Wert-Blöcke: `setOutput(true, 'Number')` oder `'Boolean'`.
- Sensor-Ereignis-Blöcke und Aktor-Blöcke: `setPreviousStatement(true, null)` + `setNextStatement(true, null)`.
- Farben: Sensoren `#1565C0` (Wert-Blöcke), `#0D47A1` (Ereignis-Blöcke); Aktoren `#E65100`.

## Wichtige Gotchas

- **Web Serial API** funktioniert nur in Chrome/Edge. Firefox und Safari schlagen stumm fehl.
- **Kein Persistenz-Layer** – Projekte werden nicht gespeichert (kommt in Phase 3).
- **Board ist hardcodiert** – `boards.js` enthält nur `MAKER-PI-RP2040`. Board-Auswahl kommt in Phase 3.
- **adafruit_bmp280** muss manuell auf `CIRCUITPY/lib/` kopiert werden. Alle anderen (`adafruit_dht`, `neopixel`, `adafruit_hcsr04`, `adafruit_motor`) sind Standard im Adafruit CircuitPython Bundle.
- **asyncio + adafruit_ticks** werden vom generierten Code immer benötigt (Multitask-Modell) und müssen in `CIRCUITPY/lib/` liegen. Beide sind im Standard-Adafruit-Bundle; `asyncio` hängt von `adafruit_ticks` ab.
- `RaspberryPico_allCodes_en/` enthält **MicroPython**-Referenzcode (nicht CircuitPython). Bei neuen Blöcken den Code in CircuitPython übersetzen (`digitalio`/`analogio` statt `machine`).

## Commit-Stil

Deutsche Commit-Nachrichten, wie in der Git-History. Kein vorgeschriebenes Format.

## Testen

Code direkt im Chrome/Edge-Browser öffnen (`index.html`), dann über Web Serial auf dem MAKER-PI-RP2040 testen. Kein lokaler Dev-Server nötig.
