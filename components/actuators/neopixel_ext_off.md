---
id: neopixel_ext_off
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen aus"
label_en: "🌈 Strip off"
colour: "#EC4899"
tooltip: "Schaltet alle LEDs eines externen NeoPixel-Streifens am Grove-Port aus"
tooltip_en: "Turns off all LEDs of an external NeoPixel strip on a Grove port"
blockType: statement
inline: true
inputs:
  - label: "🌈 Streifen aus (Grove)  Port:"
    label_en: "🌈 Strip off (Grove)  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: COUNT
    label: "LEDs gesamt"
    label_en: "total LEDs"
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

<!-- lang:en -->

# External NeoPixel strip – turn off

Turns off all LEDs of a WS2812B strip connected to a Grove port.
