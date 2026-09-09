---
id: event_ultrasonic
blockCategory: Sensoren
subCategory: Ereignisse
label: "📡 Wenn Abstand"
label_en: "📡 When distance"
colour: "#D97706"
tooltip: "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet (Grove-Ranger oder HC-SR04)"
tooltip_en: "Runs code when the distance goes above/below a value (Grove Ranger or HC-SR04)"
blockType: event
inline: true
inputs:
  - label: "📡 Wenn Abstand  Port:"
    label_en: "📡 When distance  port:"
    name: SIG
    fieldType: grove_dropdown
    groveRole: digital
  - label: "Typ:"
    label_en: "type:"
    name: TYPE
    fieldType: sensor_type_dropdown
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
  width_mm: 45
  height_mm: 20.5
legacyGenerator: true
---

# Ereignis: Wenn Abstand

Führt Aktionen aus, wenn der gemessene Abstand einen Schwellwert über- oder
unterschreitet. Sensor-Typ wählbar: **Grove Ranger (1 Pin)** oder freier
**HC-SR04** (TRIG an Pin 2, ECHO an Pin 1 des Grove-Steckers).
Generatoren: siehe `js/generator.js`.

<!-- lang:en -->

# Event: when distance

Runs actions when the measured distance goes above or below a threshold.
Sensor type selectable: **Grove Ranger (1 pin)** or bare **HC-SR04** (TRIG on
pin 2, ECHO on pin 1 of the Grove connector). Generators: see `js/generator.js`.
