---
id: sensor_bodenfeuchte
blockCategory: Sensoren
subCategory: "Weitere"
label: "🌱 Bodenfeuchte (0–100%)"
label_en: "🌱 Soil moisture (0–100%)"
colour: "#2563EB"
tooltip: "Liest die Bodenfeuchte in Prozent aus (0 = trocken, 100 = nass). Kapazitiver Sensor."
tooltip_en: "Reads the soil moisture in percent (0 = dry, 100 = wet). Capacitive sensor."
blockType: value
output: Number
inputs:
  - label: "🌱 Bodenfeuchte (0–100%)  Port:"
    label_en: "🌱 Soil moisture (0–100%)  port:"
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

<!-- lang:en -->

# Soil moisture sensor (capacitive)

Measures the moisture in the soil. Ideal for automatic plant watering.

**Important:** use a capacitive sensor (not resistive) – resistive probes corrode with continuous use.

## Wiring
- AOUT → GP pin (analog-capable: GP26, GP27, GP28)
- VCC → 3.3V or 5V
- GND → GND
