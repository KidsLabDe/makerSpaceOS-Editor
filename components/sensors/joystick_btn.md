---
id: sensor_joystick_btn
blockCategory: Sensoren
component: joystick
subCategory: "Weitere"
label: "gedrückt?"
label_en: "pressed?"
colour: "#2563EB"
tooltip: "Wahr, wenn der Joystick hineingedrückt wird"
tooltip_en: "True if the joystick is pushed in"
blockType: value
output: Boolean
inputs:
  - label: "gedrückt?  Pin:"
    label_en: "pressed?  pin:"
    name: PIN_BTN
    fieldType: grove_dropdown
    groveRole: digital
legacyGenerator: true
---

# Joystick (KY-023, z. B. ELEGOO 37-Sensor-Kit)

Anschluss mit Einzelkabeln: **GND** → GND, **+5V** → **3V3** (nicht 5 V!),
**VRx** und **VRy** → je ein Analog-Pin, **SW** → ein beliebiger Digital-Pin.
Beim MAKER-PI-RP2040 sind die Analog-Pins GP26, GP27 und GP28.

`Wahr`, wenn der Joystick hineingedrückt wird (Kabel **SW**).

<!-- lang:en -->

# Joystick (KY-023, e.g. ELEGOO 37 sensor kit)

Connect with single wires: **GND** → GND, **+5V** → **3V3** (not 5 V!),
**VRx** and **VRy** → one analog pin each, **SW** → any digital pin.
On the MAKER-PI-RP2040 the analog pins are GP26, GP27 and GP28.

`true` if the joystick is pushed in (wire **SW**).
