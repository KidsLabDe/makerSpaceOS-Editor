---
id: neopixel_brightness
blockCategory: Lichter
subCategory: "Onboard"
label: "☀️ NeoPixel Helligkeit"
colour: "#EC4899"
tooltip: "Setzt die Helligkeit der Onboard-NeoPixel (0–100 %)"
blockType: statement
inline: true
inputs:
  - label: "☀️ NeoPixel  Helligkeit"
    fieldType: fixed_label
valueInputs:
  - name: PERCENT
    check: Number
    defaultValue: 50
    suffix: "%"
hardware:
  commonName: "NeoPixel / WS2812B"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# NeoPixel Helligkeit (Onboard)

Setzt die Helligkeit der eingebauten NeoPixel-LEDs (0 % = aus, 100 % = volle Helligkeit).
