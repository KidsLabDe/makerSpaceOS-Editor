---
id: event_ultrasonic
blockCategory: Sensoren
subCategory: Ereignisse
label: "📡 Wenn Abstand"
colour: "#F39A1B"
tooltip: "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet"
blockType: event
inline: true
inputs:
  - label: "📡 Wenn Abstand  Port:"
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
hardware:
  commonName: "Grove Ultrasonic Ranger"
  verbrauch3j: 13
  kitStandard: true
legacyGenerator: true
---

# Ereignis: Wenn Abstand (Grove Ultrasonic Ranger)

Führt Aktionen aus, wenn der gemessene Abstand einen Schwellwert über- oder unterschreitet.
Single-Pin-Messung – Generator: siehe `js/generator.js`.
