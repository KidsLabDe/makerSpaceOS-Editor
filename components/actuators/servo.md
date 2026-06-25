---
id: actuator_servo
blockCategory: Aktionen
subCategory: "Servo & Pumpe"
label: "⚙️ Servo"
colour: "#DC2626"
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
  width_mm: 12
  height_mm: 23
legacyGenerator: true
---

# Servo-Motor

Dreht den Servo auf einen Winkel von 0–180 Grad.
