---
id: sensor_bodenfeuchte
blockCategory: Sensoren
subCategory: "Weitere"
label: "🌱 Bodenfeuchte (0–100%)"
colour: "#2563EB"
tooltip: "Liest die Bodenfeuchte in Prozent aus (0 = trocken, 100 = nass). Kapazitiver Sensor."
blockType: value
output: Number
inputs:
  - label: "🌱 Bodenfeuchte (0–100%)  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: analog
generator:
  imports:
    - "import board"
    - "import analogio"
  defs:
    - key: "init_boden_${PIN}"
      val: "_boden_${PIN} = analogio.AnalogIn(board.${PIN})"
  expression: "round(_boden_${PIN}.value / 65535 * 100)"
  order: FUNCTION_CALL
hardware:
  commonName: "Kapazitiver Bodenfeuchtesensor v1.2"
  verbrauch3j: 4
  kitStandard: true
legacyGenerator: false
---

# Bodenfeuchtesensor (kapazitiv)

Misst die Feuchtigkeit in der Erde. Ideal für automatische Pflanzenbewässerung.

**Wichtig:** Kapazitiver Sensor verwenden (nicht resistiv) – resistive Sonden korrodieren bei Dauernutzung.

## Anschluss
- AOUT → GP-Pin (analogfähig: GP26, GP27, GP28)
- VCC → 3.3V oder 5V
- GND → GND
