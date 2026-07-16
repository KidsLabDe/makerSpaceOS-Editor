---
id: neopixel_set
blockCategory: Lichter
subCategory: "Onboard"
label: "🌈 NeoPixel LED Nr."
label_en: "🌈 NeoPixel LED no."
colour: "#EC4899"
tooltip: "Setzt eine einzelne NeoPixel-LED auf eine bestimmte Farbe (1–13)"
tooltip_en: "Sets a single NeoPixel LED to a specific colour (1–13)"
blockType: statement
inline: true
inputs:
  - label: "🌈 NeoPixel  Farbe:"
    label_en: "🌈 NeoPixel  colour:"
    name: COLOR
    fieldType: colour_picker
    default: "#ff0000"
valueInputs:
  - name: INDEX
    label: "LED Nr."
    label_en: "LED no."
    check: Number
    defaultValue: 1
hardware:
  commonName: "NeoPixel / WS2812B"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# NeoPixel einzelne LED setzen

<!-- lang:en -->

# Set a single NeoPixel LED
