---
id: tm1637_number
blockCategory: Anzeigen
subCategory: ""
label: "🔢 7-Seg Zahl anzeigen"
colour: "#0D9488"
tooltip: "Zeigt eine Zahl (ganze Zahl, −999 bis 9999) auf dem 4-stelligen 7-Segment-Display an"
blockType: statement
inline: true
inputs:
  - label: "🔢 7-Seg  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin
valueInputs:
  - name: VALUE
    check: Number
    label: "Zahl"
    defaultValue: 1234
hardware:
  commonName: "7-Segment Display TM1637 (4-stellig)"
  verbrauch3j: 0
  kitStandard: false
  width_mm: 42
  height_mm: 23.5
legacyGenerator: true
---

# TM1637 4-stelliges 7-Segment-Display – Zahl anzeigen

Zeigt eine ganze Zahl (−999 bis 9999) auf dem Display an.

**Verdrahtung (Grove-Port):**
- CLK → Grove Pin 1 (weiß, z. B. GP2 bei Grove 2)
- DIO → Grove Signal (gelb, z. B. GP3 bei Grove 2)
- VCC / GND → Grove VCC / GND

**Lib:** `adafruit_tm1637` aus dem Adafruit CircuitPython Bundle → nach `CIRCUITPY/lib/` kopieren.
