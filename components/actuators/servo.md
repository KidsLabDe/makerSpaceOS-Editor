---
id: actuator_servo
blockCategory: Aktionen
component: servo
subCategory: "Servo & Pumpe"
label: "⚙️ Servo"
label_en: "⚙️ Servo"
colour: "#DC2626"
tooltip: "Dreht einen Servo-Motor auf einen bestimmten Winkel (0 bis 180 Grad)"
tooltip_en: "Turns a servo motor to a specific angle (0 to 180 degrees)"
blockType: statement
inline: true
inputs:
  - name: SERVO
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

So steckst du den Servo an: Das **orange** Kabel kommt an **S**, **rot** an **+**, **braun** an **−**.
Auf dem MAKER-PI steht neben jeder Reihe der Pin: **GP12 = S1**, GP13 = S2, GP14 = S3, GP15 = S4.

![Servo-Stecker am MAKER-PI auf S1 (GP12): orange an S, rot an +, braun an −](../images/anschluss-servo.jpg)

<!-- lang:en -->

# Servo motor

Turns the servo to an angle of 0–180 degrees.

How to plug in the servo: the **orange** wire goes to **S**, **red** to **+**, **brown** to **−**.
On the MAKER-PI each row is labelled with its pin: **GP12 = S1**, GP13 = S2, GP14 = S3, GP15 = S4.

![Servo plug on the MAKER-PI at S1 (GP12): orange to S, red to +, brown to −](../images/anschluss-servo.jpg)
