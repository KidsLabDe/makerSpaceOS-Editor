---
id: sensor_gjoy_axis
blockCategory: Sensoren
component: joystick_grove
subCategory: "Weitere"
label: "Achse"
label_en: "axis"
colour: "#2563EB"
tooltip: "Stellung des Joysticks: -100 bis 100, 0 = Mitte"
tooltip_en: "Joystick position: -100 to 100, 0 = centre"
blockType: value
output: Number
requiresBoardFeature: analogPairs
inputs:
  - name: AXIS
    fieldType: options_dropdown
    options:
      - label: "X (links / rechts)"
        label_en: "X (left / right)"
        value: "x"
      - label: "Y (oben / unten)"
        label_en: "Y (up / down)"
        value: "y"
  - label: "Port:"
    label_en: "port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin_analog
legacyGenerator: true
---

# Grove-Joystick (Thumb Joystick)

Ein Grove-Kabel genügt: X = gelbes Kabel, Y = weißes Kabel. Weil beide Pins analog
lesen müssen, bietet der Block nur passende Ports an (beim MAKER-PI: **Grove 6**).

Der Block liefert -100 bis 100, in der Mitte 0. Während der Joystick gedrückt ist, liefert X immer 0.

<!-- lang:en -->

# Grove joystick (Thumb Joystick)

One Grove cable is enough: X = yellow wire, Y = white wire. Both pins must read analog
values, so the block only offers suitable ports (on the MAKER-PI: **Grove 6**).

The block returns -100 to 100, 0 in the centre. While the joystick is pressed, X always returns 0.
