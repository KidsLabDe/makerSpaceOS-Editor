---
id: tm1637_number
blockCategory: Anzeigen
component: seg7
subCategory: ""
label: "🔢 7-Seg Zahl anzeigen"
label_en: "🔢 7-seg show number"
colour: "#0D9488"
tooltip: "Zeigt eine Zahl (ganze Zahl, −999 bis 9999) auf dem 4-stelligen 7-Segment-Display an"
tooltip_en: "Shows a number (integer, −999 to 9999) on the 4-digit 7-segment display"
blockType: statement
inline: true
inputs:
  - label: "Port:"
    label_en: "port:"
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

![7-Segment-Display von vorne mit angestecktem Grove-Kabel](../images/anschluss-7segment-vorne.jpg)

![Rückseite: GND schwarz, VCC rot, DIO gelb, CLK weiß](../images/anschluss-7segment-hinten.jpg)

**Lib:** `adafruit_tm1637` aus dem Adafruit CircuitPython Bundle → nach `CIRCUITPY/lib/` kopieren.

<!-- lang:en -->

# TM1637 4-digit 7-segment display – show number

Shows an integer (−999 to 9999) on the display.

**Wiring (Grove port):**
- CLK → Grove pin 1 (white, e.g. GP2 on Grove 2)
- DIO → Grove signal (yellow, e.g. GP3 on Grove 2)
- VCC / GND → Grove VCC / GND

![7-segment display from the front with the Grove cable plugged in](../images/anschluss-7segment-vorne.jpg)

![Back side: GND black, VCC red, DIO yellow, CLK white](../images/anschluss-7segment-hinten.jpg)

**Lib:** `adafruit_tm1637` from the Adafruit CircuitPython Bundle → copy to `CIRCUITPY/lib/`.
