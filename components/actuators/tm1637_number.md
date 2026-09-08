---
id: tm1637_number
blockCategory: Anzeigen
subCategory: ""
label: "🔢 7-Seg Zahl anzeigen"
label_en: "🔢 7-seg show number"
colour: "#0D9488"
tooltip: "Zeigt eine Zahl (ganze Zahl, −999 bis 9999) auf dem 4-stelligen 7-Segment-Display an"
tooltip_en: "Shows a number (integer, −999 to 9999) on the 4-digit 7-segment display"
blockType: statement
inline: true
inputs:
  - label: "🔢 7-Seg  Port:"
    label_en: "🔢 7-seg  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin
valueInputs:
  - name: VALUE
    check: Number
    label: "Zahl"
    label_en: "number"
    defaultValue: 1234
hardware:
  commonName: "7-Segment Display TM1637 (4-stellig)"
  verbrauch3j: 0
  kitStandard: false
  width_mm: 23
  height_mm: 41.5
legacyGenerator: true
---

# TM1637 4-stelliges 7-Segment-Display – Zahl anzeigen

Zeigt eine ganze Zahl (−999 bis 9999) auf dem Display an.

**Verdrahtung (Grove-Port):**
- CLK → Grove Pin 1 (weiß, z. B. GP2 bei Grove 2)
- DIO → Grove Signal (gelb, z. B. GP3 bei Grove 2)
- VCC / GND → Grove VCC / GND

**Lib:** `adafruit_tm1637` aus dem Adafruit CircuitPython Bundle → nach `CIRCUITPY/lib/` kopieren.

<!-- lang:en -->

# TM1637 4-digit 7-segment display – show number

Shows an integer (−999 to 9999) on the display.

**Wiring (Grove port):**
- CLK → Grove pin 1 (white, e.g. GP2 on Grove 2)
- DIO → Grove signal (yellow, e.g. GP3 on Grove 2)
- VCC / GND → Grove VCC / GND

**Lib:** `adafruit_tm1637` from the Adafruit CircuitPython Bundle → copy to `CIRCUITPY/lib/`.
