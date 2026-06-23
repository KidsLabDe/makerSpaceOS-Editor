---
id: neopixel_set
blockCategory: NeoPixel
subCategory: ""
label: "🌈 NeoPixel LED Nr."
colour: "#E24D3D"
tooltip: "Setzt eine einzelne NeoPixel-LED auf eine bestimmte Farbe (1–13)"
blockType: statement
inputs:
  - label: "🌈 NeoPixel  LED Nr."
    name: INDEX
    fieldType: number_field
    default: 1
    min: 1
    max: 13
    precision: 1
  - label: "Farbe:"
    name: COLOR
    fieldType: colour_picker
    default: "#ff0000"
hardware:
  commonName: "NeoPixel / WS2812B"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# NeoPixel einzelne LED setzen
