---
id: neopixel_ext_set
blockCategory: Lichter
subCategory: "Streifen"
label: "🌈 Streifen LED setzen"
colour: "#EC4899"
tooltip: "Setzt eine einzelne LED eines externen NeoPixel-Streifens am Grove-Port"
blockType: statement
inputs:
  - label: "🌈 Streifen (Grove)  Port:"
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
  - label: "LED Nr."
    name: INDEX
    fieldType: number_field
    default: 1
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

# Externer NeoPixel-Streifen – einzelne LED setzen

Steuert eine einzelne LED eines an einem Grove-Port angeschlossenen WS2812B-Streifens.
„LEDs:" gibt die Gesamtzahl der LEDs im Streifen an (für alle Streifen-Blöcke am selben Port gleich wählen).
