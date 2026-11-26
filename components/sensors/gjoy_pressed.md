---
id: sensor_gjoy_pressed
blockCategory: Sensoren
component: joystick_grove
subCategory: "Weitere"
label: "gedrückt?"
label_en: "pressed?"
colour: "#2563EB"
tooltip: "Wahr, wenn der Joystick hineingedrückt wird"
tooltip_en: "True if the joystick is pushed in"
blockType: value
output: Boolean
requiresBoardFeature: analogPairs
inputs:
  - label: "gedrückt?  Port:"
    label_en: "pressed?  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin_analog
legacyGenerator: true
---

# Grove-Joystick (Thumb Joystick)

Ein Grove-Kabel genügt: X = gelbes Kabel, Y = weißes Kabel. Weil beide Pins analog
lesen müssen, bietet der Block nur passende Ports an (beim MAKER-PI: **Grove 6**).

`Wahr`, wenn der Joystick hineingedrückt wird.

<!-- lang:en -->

# Grove joystick (Thumb Joystick)

One Grove cable is enough: X = yellow wire, Y = white wire. Both pins must read analog
values, so the block only offers suitable ports (on the MAKER-PI: **Grove 6**).

`true` if the joystick is pushed in.
