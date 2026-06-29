---
id: neopixel_ext_brightness
blockCategory: Lichter
subCategory: "Streifen"
label: "☀️ Streifen Helligkeit"
colour: "#EC4899"
tooltip: "Setzt die Helligkeit eines externen NeoPixel-Streifens am Grove-Port (0–100 %)"
blockType: statement
inline: true
inputs:
  - label: "☀️ Streifen Helligkeit (Grove)  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: COUNT
    label: "LEDs gesamt"
    check: Number
    defaultValue: 8
  - name: PERCENT
    label: "Helligkeit"
    check: Number
    defaultValue: 50
    suffix: "%"
hardware:
  commonName: "NeoPixel-Streifen (extern) / WS2812B"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Externer NeoPixel-Streifen – Helligkeit

Setzt die Helligkeit eines an einem Grove-Port angeschlossenen WS2812B-Streifens (0 % = aus, 100 % = volle Helligkeit).
„LEDs gesamt" muss für alle Streifen-Blöcke am selben Port gleich gewählt werden.
