---
id: actuator_rgb_led
blockCategory: Aktoren
subCategory: LED
label: "🌈 RGB-LED"
colour: "#E65100"
tooltip: "Setzt eine RGB-LED auf eine Farbe über drei digitale Ausgänge (KY-009, KY-016)"
blockType: statement
inputs:
  - label: "🌈 RGB-LED  R-Pin:"
    name: PIN_R
    fieldType: pin_dropdown
    pinSource: externalPins
  - label: "G-Pin:"
    name: PIN_G
    fieldType: pin_dropdown
    pinSource: externalPins
  - label: "B-Pin:"
    name: PIN_B
    fieldType: pin_dropdown
    pinSource: externalPins
  - label: "Farbe:"
    name: COLOR
    fieldType: rgb_color_dropdown
hardware:
  kyNumber: "KY-009"
  commonName: "RGB-LED"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# RGB-LED (KY-009 / KY-016)

Steuert eine dreifarbige LED mit separaten Pins für Rot, Grün und Blau.
