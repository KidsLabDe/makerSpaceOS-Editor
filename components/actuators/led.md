---
id: actuator_led
blockCategory: Aktionen
subCategory: LED
label: "💡 LED"
label_en: "💡 LED"
colour: "#DC2626"
tooltip: "Schaltet eine LED ein oder aus"
tooltip_en: "Turns an LED on or off"
blockType: statement
inputs:
  - label: "💡 LED  Port:"
    label_en: "💡 LED  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
  - name: STATE
    fieldType: on_off_dropdown
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_led_${PIN}"
      val: "_led_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_led_${PIN}.direction = digitalio.Direction.OUTPUT"
  code: "_led_${PIN}.value = ${STATE}\n"
hardware:
  commonName: "LED"
  verbrauch3j: 12
  kitStandard: true
legacyGenerator: false
---

# LED-Block

Schaltet eine einfache LED (oder jeden anderen digitalen Ausgang) ein oder aus.

<!-- lang:en -->

# LED block

Turns a simple LED (or any other digital output) on or off.
