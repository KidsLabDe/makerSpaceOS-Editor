---
id: neopixel_ext_set
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen LED setzen"
label_en: "🌈 Set strip LED"
colour: "#EC4899"
tooltip: "Setzt eine einzelne LED eines externen NeoPixel-Streifens am Grove-Port"
tooltip_en: "Sets a single LED of an external NeoPixel strip on a Grove port"
blockType: statement
inline: true
inputs:
  - label: "🌈 Streifen (Grove)  Port:"
    label_en: "🌈 Strip (Grove)  port:"
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
  - name: INDEX
    label: "LED Nr."
    label_en: "LED no."
    check: Number
    defaultValue: 1
hardware:
  commonName: "NeoPixel-Streifen (extern) / WS2812B"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Externer NeoPixel-Streifen – einzelne LED setzen

Steuert eine einzelne LED eines an einem Grove-Port angeschlossenen WS2812B-Streifens.
„LEDs:" gibt die Gesamtzahl der LEDs im Streifen an (für alle Streifen-Blöcke am selben Port gleich wählen).

<!-- lang:en -->

# External NeoPixel strip – set a single LED

Controls a single LED of a WS2812B strip connected to a Grove port.
"LEDs:" is the total number of LEDs in the strip (choose the same value for all strip blocks on the same port).
