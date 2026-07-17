---
id: actuator_motor_backward
blockCategory: Aktionen
subCategory: "Motor"
label: "🚗 Motor rückwärts"
label_en: "🚗 Motor backward"
colour: "#DC2626"
tooltip: "Fährt einen DC-Motor rückwärts (0–100 % Geschwindigkeit)"
tooltip_en: "Drives a DC motor backward (0–100 % speed)"
blockType: statement
inline: true
inputs:
  - label: "🚗 Motor"
    label_en: "🚗 Motor"
    name: MOTOR
    fieldType: motor_dropdown
  - label: "rückwärts"
    label_en: "backward"
    fieldType: fixed_label
valueInputs:
  - name: SPEED
    check: Number
    defaultValue: 75
    suffix: "% Geschwindigkeit"
    suffix_en: "% speed"
hardware:
  commonName: "DC-Motor / TT-Getriebemotor"
  verbrauch3j: 50
  kitStandard: true
legacyGenerator: true
---

# Motor rückwärts

<!-- lang:en -->

# Motor backward
