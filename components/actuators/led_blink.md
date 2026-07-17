---
id: actuator_led_blink
blockCategory: Aktionen
subCategory: LED
label: "💡 LED blinken"
label_en: "💡 LED blink"
colour: "#DC2626"
tooltip: "Lässt eine LED mehrmals blinken"
tooltip_en: "Makes an LED blink several times"
blockType: statement
inline: true
inputs:
  - label: "💡 LED  Port:"
    label_en: "💡 LED  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: TIMES
    label: "blinken"
    label_en: "blink"
    check: Number
    defaultValue: 3
  - name: PAUSE
    label: "mal, Pause"
    label_en: "times, pause"
    check: Number
    defaultValue: 0.5
    suffix: "Sek"
    suffix_en: "s"
hardware:
  commonName: "LED (blinkend)"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# LED blinken

Lässt eine LED eine bestimmte Anzahl mal blinken.

<!-- lang:en -->

# LED blink

Makes an LED blink a certain number of times.
