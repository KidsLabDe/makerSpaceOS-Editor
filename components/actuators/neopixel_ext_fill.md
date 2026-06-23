---
id: neopixel_ext_fill
blockCategory: NeoPixel
subCategory: ""
label: "🌈 Streifen ganz füllen"
colour: "#E24D3D"
tooltip: "Setzt alle LEDs eines externen NeoPixel-Streifens am Grove-Port auf eine Farbe"
blockType: statement
inputs:
  - label: "🌈 Streifen füllen (Grove)  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
  - label: "LEDs:"
    name: COUNT
    fieldType: number_field
    default: 8
    min: 1
    max: 300
    precision: 1
  - label: "Farbe:"
    name: COLOR
    fieldType: colour_picker
    default: "#ff0000"
hardware:
  commonName: "NeoPixel-Streifen (extern) / WS2812B"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Externer NeoPixel-Streifen – ganz füllen

Setzt alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens auf dieselbe Farbe.
