---
id: neopixel_ext_off
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen aus"
colour: "#EC4899"
tooltip: "Schaltet alle LEDs eines externen NeoPixel-Streifens am Grove-Port aus"
blockType: statement
inline: true
inputs:
  - label: "🌈 Streifen aus (Grove)  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
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

# Externer NeoPixel-Streifen – ausschalten

Schaltet alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens aus.
