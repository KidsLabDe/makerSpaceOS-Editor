---
id: actuator_motor_backward
blockCategory: Aktionen
subCategory: "Motor"
label: "🚗 Motor rückwärts"
colour: "#DC2626"
tooltip: "Fährt einen DC-Motor rückwärts (0–100 % Geschwindigkeit)"
blockType: statement
inline: true
inputs:
  - label: "🚗 Motor"
    name: MOTOR
    fieldType: motor_dropdown
  - label: "rückwärts"
    fieldType: fixed_label
valueInputs:
  - name: SPEED
    check: Number
    defaultValue: 75
    suffix: "% Geschwindigkeit"
hardware:
  commonName: "DC-Motor / TT-Getriebemotor"
  verbrauch3j: 50
  kitStandard: true
legacyGenerator: true
---

# Motor rückwärts
