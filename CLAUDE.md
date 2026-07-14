# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt-Überblick

makerSpaceOS ist eine **browser-basierte Blockly-IDE**, die visuelle Blöcke in **CircuitPython**-Code für den **Cytron MAKER-PI-RP2040** (RP2040, CircuitPython) übersetzt. Kein Build-Schritt, kein npm – reine statische HTML/JS/CSS-App.

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

## Ausführungsmodell (asyncio-Multitask, makerspaceos-Laufzeit)

Der Generator erzeugt **kein einzelnes `while True:`** mehr, sondern ein kooperatives Multitasking-Programm. Die asyncio-Mechanik (parallele Aufgaben, Flankenerkennung beim Polling) steckt **nicht** im generierten Code, sondern in der Laufzeit-Bibliothek `lib/makerspaceos.py` (`immer` / `wenn` / `start`). Der generierte Code (`generator.js`, `workspaceToCode`/`finish`) besteht daher nur noch aus **benannten Handler-Funktionen + kurzen Registrierungszeilen** (Stil wie MakeCode):

- Jeder **Top-Level-Stapel** wird zu einem benannten `async def <name>()`: `control_forever` → `fuer_immer`, `loop_parallel` → `parallel[_N]`, jeder `when_*`-Hut-Block → `wenn_<typ>` (z.B. `wenn_taster_a`, `wenn_abstand`). `control_setup` → `beim_start`.
- Registriert wird am Dateiende: `immer(fuer_immer)` (Endlosschleife), `wenn(lambda: <bedingung>, wenn_taster_a[, poll])` (kantengetriggert, feuert einmal beim Wahr-Werden), `start(beim_start)` (führt Setup einmal aus, dann laufen alle Aufgaben parallel).
- `import asyncio`/`gather`/`run` tauchen im generierten Code **nicht mehr** auf – nur `from makerspaceos import immer, wenn, start`. `lib/makerspaceos.py` muss nach `CIRCUITPY/lib/` kopiert werden.
- Helfer in `generator.js`: `_indent(code, levels)`, `_whenTask(name, expr, body, poll)` (liefert einen Deskriptor `{kind:'event', name, expr, body, poll}`, **kein** fertiger Code mehr). `workspaceToCode` sammelt Deskriptoren in `_tasks`; `finish()` baut daraus die `async def`-Handler + Registrierungszeilen und vergibt eindeutige Namen (Kollision → Suffix `_2`).
- Ein neuer Ereignis-Hut-Block braucht: Definition in `js/blocks/events.js`, Generator in `generator.js` (gibt `_whenTask(name, ...)` zurück), Eintrag im `_HAT_TYPES`-Array **und** in der Toolbox-Kategorie „🎬 Ereignisse".

## Block-Design-Prinzipien

- **Emoji im Label** – jeder Block bekommt ein passendes Emoji (🌡️, 🚧, ⚡ …).
- **Minimale Pflichtfelder** – so wenige Dropdowns/Eingaben wie möglich; sinnvolle Defaults.
- **Kein Fachvokabular** – Kinder sollen Blöcke ohne Erklärung verstehen.
- **Deutsche Labels und Tooltips** durchgängig.
- Sensor-Wert-Blöcke: `setOutput(true, 'Number')` oder `'Boolean'`.
- Sensor-Ereignis-Blöcke und Aktor-Blöcke: `setPreviousStatement(true, null)` + `setNextStatement(true, null)`.
- Farben: Sensoren `#1565C0` (Wert-Blöcke), `#0D47A1` (Ereignis-Blöcke); Aktoren `#E65100`.

## Wichtige Gotchas

- **HTTP-Cache-Busting**: Alle lokalen `js/`- und `css/`-Einbindungen in den HTML-Dateien tragen einen `?v=<Zeitstempel>`. `node scripts/bump_cache.js` erneuert den Stempel (läuft automatisch am Ende von `build_blocks.js`). Nach Änderungen an JS/CSS, die **nicht** über `build_blocks.js` laufen, vor dem Deploy einmal ausführen – sonst liefern Browser alte Dateien aus dem HTTP-Cache (304/heuristisches Caching).
- **Web Serial API** funktioniert nur in Chrome/Edge. Firefox und Safari schlagen stumm fehl.
- **Kein Persistenz-Layer** – Projekte werden nicht gespeichert (kommt in Phase 3).
- **Board-Auswahl** – `boards.js` hält mehrere Profile in `BOARD_PROFILES` (`maker_pi_rp2040` = Default, `lolin_s2_mini` = Wemos S2 Mini, `esp32_d1_r32` = AZ-Delivery ESP32 D1 R32). Das aktive Profil steht in der globalen `let BOARD` und wird aus `localStorage['makerspaceos.board']` gewählt; `setBoard(id)` persistiert die Wahl und **lädt die Seite neu** (Dropdown-Optionen/Toolbox werden nur einmal zur Registrierung aus `BOARD` gebaut, daher Reload statt Live-Wechsel). Das Header-Dropdown `#board-select` steuert dies. Beim Verbinden liest `serial.readBoardId()` `board.board_id` per REPL; `detectAndSwitchBoard()` (app.js) schaltet automatisch auf das erkannte Profil um.
- **Pin-Namen je Board** – Der Generator gibt Pins immer als `board.${pin}` aus. RP2040-Profile nutzen `GPxx`, der ESP32-S2 (`lolin_s2_mini`) nutzt `IOxx` (z.B. `board.IO2`). Ports beim S2 Mini sind physische **Pin-Paare** (`2/3`, `4/5`, … `39/40`) statt „Grove 1…7". Onboard: `board.LED`=IO15, `board.BUTTON`=IO0; ADC1 (WLAN-sicher): IO1–IO10.
- **Board-spezifische Blöcke ausblenden** – Ein Profil kann `hideCategories` / `hideSubCategories` / `hideBlockIds` deklarieren (siehe `lolin_s2_mini`) + `buttons: {}` (keine Onboard-Taster). `block_builder.js` (`buildToolboxCategories`) und `toolbox.js` (`buildFinalToolbox`, Matrix) filtern die Toolbox danach. Beim S2 Mini ist **nur echte Onboard-Hardware** verborgen: Motortreiber (`actuator_motor_*`), Onboard-NeoPixel (Subkategorie „Onboard"), Onboard-Taster und der Batterie-Block (`sensor_battery`, fest auf GP29). **Externes bleibt verfügbar** – Matrix, 7-Segment (TM1637), LCD, Servo, Schrittmotor, Summer, alle Sensoren und externe NeoPixel-Streifen. Matrix/Servo nutzen `BOARD.servos` (S2: PWM-Pins IO37–IO40), LCD nutzt `i2c`-Ports (beim S2 sind alle Pin-Paare I2C-fähig).
- **Runtime-Libs auch auf S2** – `makerspaceos.py`, `asyncio`, `adafruit_ticks`, `neopixel` laufen auf beiden Boards und müssen wie beim RP2040 nach `CIRCUITPY/lib/` kopiert werden.
- **ESP32 D1 R32 (`esp32_d1_r32`)** – AZ-Delivery-Board (ESP32-WROOM-32 im Uno-Formfaktor, CH340) **mit Grove Base Shield** (Seeed-kompatibel). Geflasht ist der generische CircuitPython-Build **„DOIT ESP32 DevKit V1"** (`board_id: doit_esp32_devkit_v1`) – die Auto-Erkennung mappt diese ID auf das Profil. Pin-Namen sind `board.D<GPIO-Nummer>` plus `board.VP` (IO36) / `board.VN` (IO39). **Dreifache Namensebene:** Shield-Port „D2" = Uno-Pin D2 = GPIO26 = `board.D26`. Die Port-Labels im Editor zeigen den **Shield-Aufdruck** (D2–D8, A0–A3, I2C); benachbarte D-Ports teilen sich einen Pin (Grove-Konvention: Port Dn = Uno-Dn + Uno-Dn+1). Ports `A2`/`A3` (GPIO35/34) sind **nur Eingänge**; A0-Signal (GPIO2) ist zugleich die Onboard-LED; I2C fest auf GPIO21/22. **VCC-Schalter des Shields auf 3V3** – ESP32-GPIO sind nicht 5-V-tolerant. **Kein natives USB**: kein `CIRCUITPY`-Laufwerk am Mac/PC – Libs (`makerspaceos.py`, `asyncio`, `adafruit_ticks` …) per **Thonny** (Dateibrowser über die serielle REPL) nach `/lib/` kopieren – oder einfach das fertige Komplett-Image `firmware/makerSpaceOS_firmware_esp32-d1-r32.bin` flashen (CircuitPython 10.2.1 de_DE + alle Libs aus `lib/`, per esptool bei 0x0). `lib/neopixel.py` liegt dafür jetzt mit im Repo. Der Editor selbst (Raw REPL über Web Serial/CH340) funktioniert normal. Boot-Modus fürs Flashen setzt esptool automatisch (Auto-Reset-Schaltung); es gibt keinen BOOT-Taster. Anleitung mit Fotos: `docs/esp32-d1-r32.md`.
- **Grove-Ports statt Roh-Pins**: Hardware-Blöcke nutzen `fieldType: grove_dropdown` (zeigt „Grove 1…7"). `groveRole` bestimmt Wert + Auswahl: `digital`/`analog` → Wert = Signal-Pin (Pin 2 des Steckers, GPxx); `i2c`/`2pin` → Wert = Port-ID (String), Generator löst Pins über `BOARD.grovePortById(id)` auf. Mapping/Helfer in `js/boards.js` (`grovePorts`, `groveOptions(role)`). `analog` bietet nur die ADC-Ports 5/6/7 (GP26/27/28).
- **Motor-Pins**: M1=GP8/GP9, M2=GP10/GP11 (MX1508, Schaltplan Sheet 4). NeoPixel: 2 Onboard-Pixel auf GP18. Battery: GP29 = VBAT/2 (Teiler).
- **`grove_rgb_lcd.py`** (LCD-Block) liegt unter `lib/` im Repo und muss nach `CIRCUITPY/lib/` kopiert werden; unterstützt V4 (0x62/PCA9633) und V5 (0x30/SGM31323).
- **Grove-Ports liefern 3,3 V** (Schaltplan Sheet 3, VCC = +3V3), nicht 5 V. Folge: Der **Grove-LCD V4 ist 5-V-only** – an 3,3 V meldet sich I2C (0x3e) und die Beleuchtung (0x62) funktioniert, aber der Zeichen-LCD bleibt **blank** (zu wenig Kontrastspannung). **V5** (3,3 V/5 V) läuft direkt; V4 braucht 5 V an VCC. Die V5-Beleuchtung (SGM31323 @ 0x30) **antwortet nicht auf `i2c.scan()`** – zum Erkennen: 0x62 vorhanden ⇒ V4, sonst V5.
- **adafruit_bmp280** muss manuell auf `CIRCUITPY/lib/` kopiert werden. Alle anderen (`adafruit_dht`, `neopixel`, `adafruit_motor`) sind Standard im Adafruit CircuitPython Bundle. Der Grove-Ultraschall-Block nutzt keinen Treiber mehr (Single-Pin-Messung in `generator.js`).
- **ICM20948-Blöcke** (Beschleunigung/Neigung/`when_motion`) brauchen `adafruit_icm20x.mpy` + `adafruit_register/` auf `CIRCUITPY/lib/` – beide liegen unter `lib/` im Repo (aus dem 10.x-Bundle). Der Generator stellt den Messbereich auf ±16g, damit das 9g-Ereignis auslösen kann; „geschüttelt" = Gesamt-g > 2. Lesezugriffe fangen `OSError` ab und liefern den letzten gültigen Wert – beim Schütteln verliert der Grove-Steckkontakt sonst kurz die I2C-Verbindung (Errno 19) und das ganze Programm stürzt ab.
- **asyncio + adafruit_ticks** werden vom generierten Code immer benötigt (Multitask-Modell) und müssen in `CIRCUITPY/lib/` liegen. Beide sind im Standard-Adafruit-Bundle; `asyncio` hängt von `adafruit_ticks` ab.
- **`makerspaceos.py`** (Laufzeit mit `immer`/`wenn`/`start`) liegt unter `lib/` im Repo und muss nach `CIRCUITPY/lib/` kopiert werden – ohne sie scheitert jedes generierte Programm mit `ImportError`. Siehe Ausführungsmodell.
- `RaspberryPico_allCodes_en/` enthält **MicroPython**-Referenzcode (nicht CircuitPython). Bei neuen Blöcken den Code in CircuitPython übersetzen (`digitalio`/`analogio` statt `machine`).

## Commit-Stil

Deutsche Commit-Nachrichten, wie in der Git-History. Kein vorgeschriebenes Format.

## Testen

Code direkt im Chrome/Edge-Browser öffnen (`index.html`), dann über Web Serial auf dem MAKER-PI-RP2040 testen. Kein lokaler Dev-Server nötig.
