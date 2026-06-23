---
id: event_sound
blockCategory: Sensoren
subCategory: Ereignisse
label: "🔊 Wenn Geräusch erkannt"
colour: "#F39A1B"
tooltip: "Führt Code aus, wenn der Mikrofon-Sensor ein Geräusch über dem Schwellwert erkennt"
blockType: event_simple
inputs:
  - label: "🔊 Wenn Geräusch erkannt  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
statementInput:
  name: DO
  label: "→ dann"
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_sound_${PIN}"
      val: "_sound_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_sound_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
  code: "if not _sound_${PIN}.value:\n${DO}"
hardware:
  kyNumber: "KY-038"
  commonName: "Schallsensor"
  verbrauch3j: 7
  kitStandard: true
legacyGenerator: false
---

# Ereignis: Wenn Geräusch erkannt
