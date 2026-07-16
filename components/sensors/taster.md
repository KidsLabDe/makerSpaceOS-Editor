---
id: sensor_taster
blockCategory: Sensoren
subCategory: "Weitere"
label: "🔘 Taster gedrückt?"
label_en: "🔘 Button pressed?"
colour: "#2563EB"
tooltip: "Gibt Wahr zurück, wenn der Taster gedrückt ist (Board-Taster B1/B2 oder externer Taster)"
tooltip_en: "Returns true if the button is pressed (board buttons B1/B2 or an external button)"
blockType: value
output: Boolean
inputs:
  - label: "🔘 Taster"
    label_en: "🔘 Button"
    name: BTN
    fieldType: taster_dropdown
  - label: "gedrückt?"
    label_en: "pressed?"
    fieldType: fixed_label
hardware:
  commonName: "Taster / Drucktaster"
  verbrauch3j: 28
  kitStandard: true
legacyGenerator: true
---

# Taster gedrückt? (B1/B2 + externer Taster)

Gibt `Wahr` zurück wenn der ausgewählte Taster gedrückt ist.

- **B1 (GP20) / B2 (GP21)**: Onboard-Taster des MAKER-PI-RP2040
- **Grove 1–7**: Externer Taster (KY-004) am Signal-Pin des Grove-Ports

<!-- lang:en -->

# Button pressed? (B1/B2 + external button)

Returns `true` if the selected button is pressed.

- **B1 (GP20) / B2 (GP21)**: onboard buttons of the MAKER-PI-RP2040
- **Grove 1–7**: external button (KY-004) on the signal pin of the Grove port
