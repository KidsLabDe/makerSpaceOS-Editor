---
id: neopixel_ext_brightness
blockCategory: Lichter
subCategory: "Streifen"
label: "☀️ Streifen Helligkeit"
label_en: "☀️ Strip brightness"
colour: "#EC4899"
tooltip: "Setzt die Helligkeit eines externen NeoPixel-Streifens am Grove-Port (0–100 %)"
tooltip_en: "Sets the brightness of an external NeoPixel strip on a Grove port (0–100 %)"
blockType: statement
inline: true
inputs:
  - label: "☀️ Streifen Helligkeit (Grove)  Port:"
    label_en: "☀️ Strip brightness (Grove)  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: digital
valueInputs:
  - name: COUNT
    label: "LEDs gesamt"
    label_en: "total LEDs"
    check: Number
    defaultValue: 8
  - name: PERCENT
    label: "Helligkeit"
    label_en: "brightness"
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

<!-- lang:en -->

# External NeoPixel strip – brightness

Sets the brightness of a WS2812B strip connected to a Grove port (0 % = off, 100 % = full brightness).
"Total LEDs" must be set to the same value for all strip blocks on the same port.
