---
id: actuator_motor_forward
blockCategory: Aktionen
subCategory: "Motor"
label: "🚗 Motor vorwärts"
label_en: "🚗 Motor forward"
colour: "#DC2626"
tooltip: "Fährt einen DC-Motor vorwärts (0–100 % Geschwindigkeit)"
tooltip_en: "Drives a DC motor forward (0–100 % speed)"
blockType: statement
inline: true
inputs:
  - label: "🚗 Motor"
    label_en: "🚗 Motor"
    name: MOTOR
    fieldType: motor_dropdown
  - label: "vorwärts"
    label_en: "forward"
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

# Motor vorwärts

<!-- lang:en -->

# Motor forward
