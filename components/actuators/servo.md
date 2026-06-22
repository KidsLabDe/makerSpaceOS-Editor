---
id: actuator_servo
blockCategory: Aktoren
subCategory: Weitere
label: "⚙️ Servo"
colour: "#E65100"
tooltip: "Dreht einen Servo-Motor auf einen bestimmten Winkel (0 bis 180 Grad)"
blockType: statement
inline: true
inputs:
  - label: "⚙️ Servo"
    name: SERVO
    fieldType: servo_dropdown
  - label: "auf"
    fieldType: fixed_label
valueInputs:
  - name: ANGLE
    check: Number
    defaultValue: 90
    suffix: "Grad  (0–180)"
hardware:
  commonName: "Servo SG90"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# Servo-Motor

Dreht den Servo auf einen Winkel von 0–180 Grad.
