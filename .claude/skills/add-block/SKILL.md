---
name: add-block
description: Fügt einen neuen Blockly-Block zu makerSpaceOS hinzu (markdown-getrieben über components/*.md). Nutze diesen Skill wenn der Nutzer einen neuen Sensor oder Aktor als Block implementieren möchte.
---

Sensor-/Aktor-Blöcke sind in makerSpaceOS **markdown-getrieben**: Eine Datei in `components/sensors/` bzw. `components/actuators/` beschreibt Block-Definition, Generator und Toolbox-Eintrag in einem. `node scripts/build_blocks.js` kompiliert daraus `js/blocks_db.js`; `js/block_builder.js` registriert beim Laden Block, Generator und Toolbox-Eintrag automatisch.

## Schritt 1: Vorlage ansehen

Lies eine bestehende, vollständige Komponente als Muster:
- **Wert-Block** (gibt Zahl/Boolean zurück): `components/sensors/ldr.md`
- **Statement-Block** (Aktor): `components/actuators/led.md`
- **Statement mit Wert-Eingängen** (Tempo/Winkel/Anzahl): `components/actuators/servo.md`, `components/actuators/led_blink.md`
- **Ereignis-Block**: `components/sensors/event_ldr.md` (mit Vergleich) oder `components/sensors/event_sound.md` (einfach)

Kategorien/Unterkategorien stehen in `components/catalog.json`.

## Schritt 2: Neue `.md`-Datei anlegen

Lege `components/<sensors|actuators>/<id>.md` an. Das YAML-Frontmatter ist die Block-Definition:

```yaml
---
id: mein_block
blockCategory: Aktoren          # muss in components/catalog.json existieren
subCategory: LED
label: "💡 Mein Block"
colour: "#E65100"               # #1565C0 Sensor-Wert, #0D47A1 Ereignis, #E65100 Aktor
tooltip: "Beschreibung für Kinder, auf Deutsch, ggf. mit KY-Nummer"
blockType: statement            # value | statement | event | event_simple
# output: Boolean               # nur bei blockType: value (Number/Boolean)
inputs:                         # gerenderte Felder (Reihenfolge = Anzeige)
  - label: "💡 Mein Block  Pin:"
    name: PIN
    fieldType: pin_dropdown
    pinSource: externalPins
valueInputs:                    # optional, für statement/event
  - name: SPEED
    label: "Tempo"
    defaultValue: 75
    suffix: "%"                 # optionales Label hinter dem Eingang
generator:
  imports: ["import board", "import digitalio"]
  defs:
    - key: "init_${PIN}"
      val: "_x_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_x_${PIN}.direction = digitalio.Direction.OUTPUT"
  code: "_x_${PIN}.value = ${SPEED}\n"   # statement: code | value: expression + order
legacyGenerator: false
---

# Mein Block

Kurze Beschreibung (wird im Bauteil-Katalog angezeigt).
```

**Feldtypen (`fieldType`)** werden von `block_builder.js` aufgelöst: `pin_dropdown`, `on_off_dropdown`, `op_dropdown`, `motor_dropdown`, `servo_dropdown`, `button_dropdown`, `state_dropdown`, `rgb_color_dropdown`, `number_field` (mit `default`/`min`/`max`/`precision`), `colour_picker` (mit `default`), `fixed_label` (nur Text). Braucht ein Feld andere Optionen, ergänze einen Fall in `getFieldOptions()` in `block_builder.js` (keine rohen `options`-Arrays im YAML – der einfache Parser kann sie nicht).

**`${FELD}`-Interpolation:** In `defs`/`code`/`expression` werden Feld- und Wert-Eingangs-Namen ersetzt. Bei `blockType: value` statt `code` ein `expression` + `order` (NONE/MEMBER/FUNCTION_CALL/ATOMIC) angeben.

**`legacyGenerator: true`** nur, wenn der Generator JS-Logik braucht (Zugriff auf `BOARD.buttons`/`BOARD.servos`, Farb-Mappings o.ä.). Dann liefert die `.md` nur die `inputs` (zum Rendern) und der Generator bleibt handgeschrieben in `js/generator.js`. Achtung: `generator.js` lädt nach `block_builder.js` und überschreibt dort registrierte Generatoren – bei `legacyGenerator: false` darf es **keinen** gleichnamigen Generator in `generator.js` geben.

## Schritt 3: Bauen

```
node scripts/build_blocks.js
```

Erzeugt `js/blocks_db.js` neu. Der Toolbox-Eintrag entsteht automatisch (für `valueInputs` mit `defaultValue` wird ein Shadow-Zahlenblock ergänzt).

## Abschluss-Check

1. `node -c js/blocks_db.js` und `node -c js/block_builder.js` müssen fehlerfrei sein.
2. In Chrome/Edge `index.html` öffnen → Toolbox-Kategorie prüfen → Block in den Workspace ziehen → Code-Vorschau prüfen → auf dem MAKER-PI-RP2040 testen.
3. Wenn der Block eine Bibliothek nutzt, die *nicht* im Standard-Adafruit-Bundle ist (z.B. `adafruit_bmp280`): darauf hinweisen, dass sie nach `CIRCUITPY/lib/` kopiert werden muss. (`asyncio` + `adafruit_ticks` werden ohnehin immer gebraucht.)
