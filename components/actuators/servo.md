---
id: actuator_servo
blockCategory: Aktionen
subCategory: "Servo & Pumpe"
label: "⚙️ Servo"
label_en: "⚙️ Servo"
colour: "#DC2626"
tooltip: "Dreht einen Servo-Motor auf einen bestimmten Winkel (0 bis 180 Grad)"
tooltip_en: "Turns a servo motor to a specific angle (0 to 180 degrees)"
blockType: statement
inline: true
inputs:
  - label: "⚙️ Servo"
    name: SERVO
    fieldType: servo_dropdown
  - label: "auf"
    label_en: "to"
    fieldType: fixed_label
valueInputs:
  - name: ANGLE
    check: Number
    defaultValue: 90
    suffix: "Grad  (0–180)"
    suffix_en: "degrees  (0–180)"
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

<!-- lang:en -->

# Servo motor

Turns the servo to an angle of 0–180 degrees.
