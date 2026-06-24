---
id: neopixel_ext_off
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen aus"
colour: "#EC4899"
tooltip: "Schaltet alle LEDs eines externen NeoPixel-Streifens am Grove-Port aus"
blockType: statement
inputs:
  - label: "🌈 Streifen aus (Grove)  Port:"
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
hardware:
  commonName: "NeoPixel-Streifen (extern) / WS2812B"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Externer NeoPixel-Streifen – ausschalten

Schaltet alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens aus.
