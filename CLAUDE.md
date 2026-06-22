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
  toolbox.js         – Statische Toolbox-Kategorien (Steuerung, Ereignisse, Mathe …)
  blocks/
    control.js       – SETUP- und FÜR-IMMER-Pflichtblöcke (handgeschrieben)
    events.js        – Ereignis-Hut-Blöcke (when_*, loop_parallel) → parallele async-Aufgaben
  blocks_db.js       – GENERIERT aus components/*.md (nicht manuell bearbeiten!)
  block_builder.js   – registriert Sensor-/Aktor-Blöcke + Generatoren aus blocks_db.js
  generator.js       – Blockly → CircuitPython Transpiler (asyncio-Multitask-Modell)
  app.js             – Workspace-Init, UI-Events
  serial.js          – Web Serial API (Raw REPL)
components/**/*.md   – Markdown-Quelle der Sensor-/Aktor-Blöcke (Frontmatter = Block-Definition)
scripts/build_blocks.js – baut components/*.md → js/blocks_db.js (node scripts/build_blocks.js)
RaspberryPico_allCodes_en/  – MicroPython-Referenzdateien (nicht geladen, nur Doku)
```

Die JS-Dateien werden direkt im Browser geladen – es gibt keinen Build-Schritt für die App. Hardware-Blöcke (Sensoren/Aktoren) sind aber **markdown-getrieben**: Sie werden in `components/**/*.md` definiert und per `node scripts/build_blocks.js` nach `js/blocks_db.js` kompiliert. Ein Syntaxfehler in den geladenen JS-Dateien bricht die App stumm.

## Neuen Sensor-/Aktor-Block hinzufügen – markdown-getrieben

Hardware-Blöcke werden **nicht** mehr in JS-Dateien definiert, sondern als Markdown in `components/sensors/` bzw. `components/actuators/`. Eine `.md`-Datei beschreibt im YAML-Frontmatter Block-Definition, Generator und Toolbox-Eintrag in einem:

```yaml
---
id: mein_block
blockCategory: Aktoren        # Kategorie (siehe components/catalog.json)
subCategory: LED
label: "💡 Mein Block"
colour: "#E65100"
blockType: statement          # value | statement | event | event_simple
inputs:                       # gerenderte Felder (Reihenfolge = Anzeige)
  - label: "💡 Mein Block  Port:"
    name: PIN
    fieldType: grove_dropdown  # grove_dropdown | pin_dropdown | on_off_dropdown | op_dropdown |
                               # motor_dropdown | servo_dropdown | button_dropdown | state_dropdown |
                               # rgb_color_dropdown | lcd_version_dropdown | number_field | colour_picker
    groveRole: digital         # digital | analog | i2c | 2pin  (nur bei grove_dropdown)
valueInputs:                  # optionale Wert-Eingänge (für statement/event)
  - name: SPEED
    label: "Tempo"
    defaultValue: 75
    suffix: "%"                # optionales Label hinter dem Slot
generator:
  imports: ["import board", "import digitalio"]
  defs:
    - key: "init_${PIN}"
      val: "_x_${PIN} = digitalio.DigitalInOut(board.${PIN})"
  code: "_x_${PIN}.value = ${SPEED}\n"   # oder: expression + order (für value-Blöcke)
legacyGenerator: false        # true ⇒ Generator bleibt handgeschrieben in generator.js
---
```

Danach **`node scripts/build_blocks.js`** ausführen → `js/blocks_db.js` wird neu erzeugt; `block_builder.js` registriert Block, Generator und Toolbox-Eintrag automatisch.

- **`legacyGenerator: true`** ist der Ausweg für Generatoren, die JS-Logik brauchen (z.B. Zugriff auf `BOARD.buttons`/`BOARD.servos`, Farb-Mappings). Dann liefert die `.md` nur die `inputs` (zum Rendern), und der Generator bleibt handgeschrieben in `js/generator.js`. **Wichtig:** `generator.js` lädt nach `block_builder.js` und überschreibt dort registrierte Generatoren – bei `legacyGenerator: false` darf es daher keinen gleichnamigen Generator in `generator.js` geben.
- **Kern-Blöcke** (SETUP, FÜR IMMER, Ereignis-Hüte) sind handgeschrieben in `js/blocks/control.js` / `events.js` + `generator.js` + Toolbox-Eintrag in `js/toolbox.js`.

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
- **Grove-Ports statt Roh-Pins**: Hardware-Blöcke nutzen `fieldType: grove_dropdown` (zeigt „Grove 1…7"). `groveRole` bestimmt Wert + Auswahl: `digital`/`analog` → Wert = Signal-Pin (Pin 2 des Steckers, GPxx); `i2c`/`2pin` → Wert = Port-ID (String), Generator löst Pins über `BOARD.grovePortById(id)` auf. Mapping/Helfer in `js/boards.js` (`grovePorts`, `groveOptions(role)`). `analog` bietet nur die ADC-Ports 5/6/7 (GP26/27/28).
- **Motor-Pins**: M1=GP8/GP9, M2=GP10/GP11 (MX1508, Schaltplan Sheet 4). NeoPixel: 2 Onboard-Pixel auf GP18. Battery: GP29 = VBAT/2 (Teiler).
- **`grove_rgb_lcd.py`** (LCD-Block) liegt unter `lib/` im Repo und muss nach `CIRCUITPY/lib/` kopiert werden; unterstützt V4 (0x62/PCA9633) und V5 (0x30/SGM31323).
- **adafruit_bmp280** muss manuell auf `CIRCUITPY/lib/` kopiert werden. Alle anderen (`adafruit_dht`, `neopixel`, `adafruit_motor`) sind Standard im Adafruit CircuitPython Bundle. Der Grove-Ultraschall-Block nutzt keinen Treiber mehr (Single-Pin-Messung in `generator.js`).
- **asyncio + adafruit_ticks** werden vom generierten Code immer benötigt (Multitask-Modell) und müssen in `CIRCUITPY/lib/` liegen. Beide sind im Standard-Adafruit-Bundle; `asyncio` hängt von `adafruit_ticks` ab.
- `RaspberryPico_allCodes_en/` enthält **MicroPython**-Referenzcode (nicht CircuitPython). Bei neuen Blöcken den Code in CircuitPython übersetzen (`digitalio`/`analogio` statt `machine`).

## Commit-Stil

Deutsche Commit-Nachrichten, wie in der Git-History. Kein vorgeschriebenes Format.

## Testen

Code direkt im Chrome/Edge-Browser öffnen (`index.html`), dann über Web Serial auf dem MAKER-PI-RP2040 testen. Kein lokaler Dev-Server nötig.
