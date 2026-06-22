---
id: actuator_led_blink
blockCategory: Aktoren
subCategory: LED
label: "💡 LED blinken"
colour: "#E65100"
tooltip: "Lässt eine LED mehrmals blinken"
blockType: statement
inline: true
inputs:
  - label: "💡 LED  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: TIMES
    label: "blinken"
    check: Number
    defaultValue: 3
  - name: PAUSE
    label: "mal, Pause"
    check: Number
    defaultValue: 0.5
    suffix: "Sek"
hardware:
  commonName: "LED (blinkend)"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# LED blinken

Lässt eine LED eine bestimmte Anzahl mal blinken.
