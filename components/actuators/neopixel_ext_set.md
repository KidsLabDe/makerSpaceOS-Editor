---
id: neopixel_ext_set
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen LED setzen"
colour: "#EC4899"
tooltip: "Setzt eine einzelne LED eines externen NeoPixel-Streifens am Grove-Port"
blockType: statement
inline: true
inputs:
  - label: "🌈 Streifen (Grove)  Port:"
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
  - name: INDEX
    label: "LED Nr."
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
