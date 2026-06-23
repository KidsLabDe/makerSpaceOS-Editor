---
id: sensor_sound
blockCategory: Sensoren
subCategory: Digital-Sensoren
label: "🔊 Geräusch erkannt?"
colour: "#2563EB"
tooltip: "Gibt Wahr zurück, wenn der Mikrofon-Sensor ein Geräusch über dem Schwellwert erkennt (KY-037, KY-038)"
blockType: value
output: Boolean
inputs:
  - label: "🔊 Geräusch erkannt?  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_sound_${PIN}"
      val: "_sound_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_sound_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
  expression: "(not _sound_${PIN}.value)"
  order: NONE
hardware:
  kyNumber: "KY-038"
  commonName: "Mikrofon-Schallsensor"
  verbrauch3j: 7
  kitStandard: true
legacyGenerator: false
---

# Schallsensor / Mikrofon (KY-038)

Erkennt laute Geräusche (Klatschsteuerung, Sprachsteuerung). Der Schwellwert kann am Poti eingestellt werden.
