---
id: sensor_taster
blockCategory: Sensoren
subCategory: Digital-Sensoren
label: "🔘 Taster gedrückt?"
colour: "#1565C0"
tooltip: "Gibt Wahr zurück, wenn der externe Taster an einem beliebigen Pin gedrückt wird (KY-004)"
blockType: value
output: Boolean
inputs:
  - label: "🔘 Taster gedrückt?  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_taster_${PIN}"
      val: "_taster_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_taster_${PIN}.switch_to_input(pull=digitalio.Pull.UP)"
  expression: "(not _taster_${PIN}.value)"
  order: NONE
hardware:
  kyNumber: "KY-004"
  commonName: "Taster / Drucktaster"
  verbrauch3j: 28
  kitStandard: true
legacyGenerator: false
---

# Externer Taster (KY-004)

Ein einfacher Drucktaster an einem beliebigen externen Pin. Gibt `Wahr` zurück, wenn gedrückt.

## Anschluss
- Signal → GP-Pin (konfigurierbar)
- VCC → 3.3V oder 5V
- GND → GND
