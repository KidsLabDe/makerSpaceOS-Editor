---
id: neopixel_ext_fill
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen ganz füllen"
colour: "#EC4899"
tooltip: "Setzt alle LEDs eines externen NeoPixel-Streifens am Grove-Port auf eine Farbe"
blockType: statement
inline: true
inputs:
  - label: "🌈 Streifen füllen (Grove)  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
  - label: "Farbe:"
    name: COLOR
    fieldType: colour_picker
    default: "#ff0000"
valueInputs:
  - name: COUNT
    label: "LEDs gesamt"
    check: Number
    defaultValue: 8
hardware:
  commonName: "NeoPixel-Streifen (extern) / WS2812B"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Externer NeoPixel-Streifen – ganz füllen

Setzt alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens auf dieselbe Farbe.
