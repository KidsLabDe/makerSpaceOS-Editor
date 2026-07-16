---
id: sensor_battery
blockCategory: Sensoren
subCategory: "Weitere"
label: "🔋 Batteriespannung (V)"
label_en: "🔋 Battery voltage (V)"
colour: "#2563EB"
tooltip: "Misst die Versorgungsspannung (VBAT) in Volt über GP29"
tooltip_en: "Measures the supply voltage (VBAT) in volts via GP29"
blockType: value
output: Number
inputs:
  - label: "🔋 Batteriespannung (V)"
    label_en: "🔋 Battery voltage (V)"
    fieldType: fixed_label
generator:
  imports:
    - "import board"
    - "import analogio"
  defs:
    - key: "init_battery"
      val: "_battery = analogio.AnalogIn(board.GP29)"
  expression: "round(_battery.value / 65535 * 3.3 * 2, 2)"
  order: FUNCTION_CALL
hardware:
  commonName: "Batterie-Messung (VBAT/2)"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: false
---

# Batteriespannung (GP29)

Misst die Versorgungsspannung über den internen Spannungsteiler (GP29 = VBAT/2) und gibt
sie in Volt zurück. Praktisch, um den Akkustand zu überwachen.

<!-- lang:en -->

# Battery voltage (GP29)

Measures the supply voltage via the internal voltage divider (GP29 = VBAT/2) and
returns it in volts. Handy for monitoring the battery level.
