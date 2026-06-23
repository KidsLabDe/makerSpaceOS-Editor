---
id: sensor_button
blockCategory: Sensoren
subCategory: Digital-Sensoren
label: "🔘 Board-Taster"
colour: "#2563EB"
tooltip: "Gibt Wahr zurück, wenn der Board-Taster gedrückt wird"
blockType: value
output: Boolean
inputs:
  - label: "🔘 Taster"
    name: BTN
    fieldType: button_dropdown
  - label: "gedrückt?"
    fieldType: fixed_label
hardware:
  commonName: "Board-Taster B1/B2"
  verbrauch3j: 28
  kitStandard: true
legacyGenerator: true
---

# Board-Taster (B1 / B2)

Die beiden eingebauten Taster des MAKER-PI-RP2040 (GP20 / GP21).

**Hinweis:** Dieser Block verwendet BOARD.buttons und wird direkt in `generator.js` verarbeitet.
