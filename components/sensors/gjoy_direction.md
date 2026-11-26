---
id: sensor_gjoy_direction
blockCategory: Sensoren
component: joystick_grove
subCategory: "Weitere"
label: "nach … ?"
label_en: "towards … ?"
colour: "#2563EB"
tooltip: "Wahr, wenn der Joystick deutlich in diese Richtung gedrückt wird"
tooltip_en: "True if the joystick is clearly moved in this direction"
blockType: value
output: Boolean
requiresBoardFeature: analogPairs
inputs:
  - label: "nach"
    label_en: "towards"
    name: DIR
    fieldType: options_dropdown
    options:
      - label: "links"
        label_en: "left"
        value: "left"
      - label: "rechts"
        label_en: "right"
        value: "right"
      - label: "oben"
        label_en: "up"
        value: "up"
      - label: "unten"
        label_en: "down"
        value: "down"
  - label: "?  Port:"
    label_en: "?  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin_analog
legacyGenerator: true
---

# Grove-Joystick (Thumb Joystick)

Ein Grove-Kabel genügt: X = gelbes Kabel, Y = weißes Kabel. Weil beide Pins analog
lesen müssen, bietet der Block nur passende Ports an (beim MAKER-PI: **Grove 6**).

`Wahr`, wenn der Joystick mehr als halb in die gewählte Richtung bewegt ist.

<!-- lang:en -->

# Grove joystick (Thumb Joystick)

One Grove cable is enough: X = yellow wire, Y = white wire. Both pins must read analog
values, so the block only offers suitable ports (on the MAKER-PI: **Grove 6**).

`true` if the joystick is moved more than halfway in the chosen direction.
