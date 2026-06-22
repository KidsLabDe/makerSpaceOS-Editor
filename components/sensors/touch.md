---
id: sensor_touch
blockCategory: Sensoren
subCategory: Digital-Sensoren
label: "👆 Berührt?"
colour: "#1565C0"
tooltip: "Gibt Wahr zurück, wenn der Berührungssensor berührt wird (KY-036)"
blockType: value
output: Boolean
inputs:
  - label: "👆 Berührt?  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_touch_${PIN}"
      val: "_touch_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_touch_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
  expression: "(not _touch_${PIN}.value)"
  order: NONE
hardware:
  kyNumber: "KY-036"
  commonName: "Touch-Sensor"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Berührungs-Sensor (KY-036)

Kapazitiver Berührungssensor. Reagiert auf leichte Berührung der Metallfläche.
