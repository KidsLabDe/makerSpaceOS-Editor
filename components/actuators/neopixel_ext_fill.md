---
id: neopixel_ext_fill
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen ganz füllen"
label_en: "🌈 Fill whole strip"
colour: "#EC4899"
tooltip: "Setzt alle LEDs eines externen NeoPixel-Streifens am Grove-Port auf eine Farbe"
tooltip_en: "Sets all LEDs of an external NeoPixel strip on a Grove port to one colour"
blockType: statement
inline: true
inputs:
  - label: "🌈 Streifen füllen (Grove)  Port:"
    label_en: "🌈 Fill strip (Grove)  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
  - label: "Farbe:"
    label_en: "Colour:"
    name: COLOR
    fieldType: colour_picker
    default: "#ff0000"
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

# Externer NeoPixel-Streifen – ganz füllen

Setzt alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens auf dieselbe Farbe.

<!-- lang:en -->

# External NeoPixel strip – fill completely

Sets all LEDs of a WS2812B strip connected to a Grove port to the same colour.
