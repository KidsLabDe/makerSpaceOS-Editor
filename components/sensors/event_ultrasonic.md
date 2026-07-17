---
id: event_ultrasonic
blockCategory: Sensoren
subCategory: Ereignisse
label: "📡 Wenn Abstand"
label_en: "📡 When distance"
colour: "#D97706"
tooltip: "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet"
tooltip_en: "Runs code when the distance goes above/below a value"
blockType: event
inline: true
inputs:
  - label: "📡 Wenn Abstand  Port:"
    label_en: "📡 When distance  port:"
    name: SIG
    fieldType: grove_dropdown
    groveRole: digital
  - name: OP
    fieldType: op_dropdown
  - label: "cm"
    fieldType: fixed_label
valueInputs:
  - name: VALUE
    check: Number
    defaultValue: 20
statementInput:
  name: DO
  label: "dann"
  label_en: "then"
hardware:
  commonName: "Grove Ultrasonic Ranger"
  verbrauch3j: 13
  kitStandard: true
  width_mm: 50
  height_mm: 25
legacyGenerator: true
---

# Ereignis: Wenn Abstand (Grove Ultrasonic Ranger)

Führt Aktionen aus, wenn der gemessene Abstand einen Schwellwert über- oder unterschreitet.
Single-Pin-Messung – Generator: siehe `js/generator.js`.

<!-- lang:en -->

# Event: when distance (Grove Ultrasonic Ranger)

Runs actions when the measured distance goes above or below a threshold.
Single-pin measurement – generator: see `js/generator.js`.
