---
id: neopixel_set
blockCategory: Lichter
subCategory: "Onboard"
label: "🌈 NeoPixel LED Nr."
colour: "#EC4899"
tooltip: "Setzt eine einzelne NeoPixel-LED auf eine bestimmte Farbe (1–13)"
blockType: statement
inline: true
inputs:
  - label: "🌈 NeoPixel  Farbe:"
    name: COLOR
    fieldType: colour_picker
    default: "#ff0000"
valueInputs:
  - name: INDEX
    label: "LED Nr."
    check: Number
    defaultValue: 1
hardware:
  commonName: "NeoPixel / WS2812B"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# NeoPixel einzelne LED setzen
