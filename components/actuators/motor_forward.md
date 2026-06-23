---
id: actuator_motor_forward
blockCategory: Motor
subCategory: ""
label: "🚗 Motor vorwärts"
colour: "#E24D3D"
tooltip: "Fährt einen DC-Motor vorwärts (0–100 % Geschwindigkeit)"
blockType: statement
inline: true
inputs:
  - label: "🚗 Motor"
    name: MOTOR
    fieldType: motor_dropdown
  - label: "vorwärts"
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

# Motor vorwärts
