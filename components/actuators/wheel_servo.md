---
id: actuator_wheel_servo
blockCategory: Aktionen
subCategory: "Servo & Pumpe"
label: "⚙️ Rad-Servo"
label_en: "⚙️ Wheel servo"
colour: "#DC2626"
tooltip: "Dreht einen Dauerdreh-Servo (360°): -100 = volle Fahrt rückwärts, 0 = Stopp, 100 = volle Fahrt vorwärts"
tooltip_en: "Turns a continuous-rotation servo (360°): -100 = full speed backward, 0 = stop, 100 = full speed forward"
blockType: statement
inline: true
inputs:
  - label: "⚙️ Rad-Servo"
    label_en: "⚙️ Wheel servo"
    name: SERVO
    fieldType: servo_dropdown
valueInputs:
  - name: SPEED
    label: "Tempo"
    label_en: "speed"
    check: Number
    defaultValue: 50
    suffix: "%  (-100 … 100)"
hardware:
  commonName: "Dauerdreh-Servo (360°, z. B. FS90R)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Rad-Servo (Dauerdreh-Servo)

Ein **Dauerdreh-Servo** (auch 360°-Servo) dreht sich endlos wie ein Motor – anders als ein normaler Servo, der nur auf einen Winkel fährt.

- **100** – volle Fahrt vorwärts
- **0** – Stopp
- **-100** – volle Fahrt rückwärts

Steht der Servo bei 0 nicht ganz still, ist er leicht verstellt – manche Servos haben dafür eine kleine Stellschraube.

<!-- lang:en -->

# Wheel servo (continuous-rotation servo)

A **continuous-rotation servo** (also 360° servo) turns endlessly like a motor – unlike a normal servo, which only moves to an angle.

- **100** – full speed forward
- **0** – stop
- **-100** – full speed backward

If the servo does not stand completely still at 0, it is slightly off – some servos have a small adjustment screw for this.
