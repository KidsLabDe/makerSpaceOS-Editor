---
id: sensor_joystick_x
blockCategory: Sensoren
component: joystick
subCategory: "Weitere"
label: "X-Achse"
label_en: "X axis"
colour: "#2563EB"
tooltip: "Stellung des Joysticks (links / rechts): -100 bis 100, 0 = Mitte"
tooltip_en: "Joystick position (left / right): -100 to 100, 0 = centre"
blockType: value
output: Number
inputs:
  - label: "X-Achse  Pin:"
    label_en: "X axis  pin:"
    name: PIN_X
    fieldType: grove_dropdown
    groveRole: analog
legacyGenerator: true
---

# Joystick (KY-023, z. B. ELEGOO 37-Sensor-Kit)

Anschluss mit Einzelkabeln: **GND** → GND, **+5V** → **3V3** (nicht 5 V!),
**VRx** und **VRy** → je ein Analog-Pin, **SW** → ein beliebiger Digital-Pin.
Beim MAKER-PI-RP2040 sind die Analog-Pins GP26, GP27 und GP28.

Der Block liefert -100 bis 100 (links / rechts), in der Mitte 0.
Zählt er falsch herum, dreh das Modul um.

<!-- lang:en -->

# Joystick (KY-023, e.g. ELEGOO 37 sensor kit)

Connect with single wires: **GND** → GND, **+5V** → **3V3** (not 5 V!),
**VRx** and **VRy** → one analog pin each, **SW** → any digital pin.
On the MAKER-PI-RP2040 the analog pins are GP26, GP27 and GP28.

The block returns -100 to 100 (left / right), 0 in the centre.
If it counts the wrong way round, turn the module around.
