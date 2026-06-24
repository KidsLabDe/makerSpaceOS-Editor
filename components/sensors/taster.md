---
id: sensor_taster
blockCategory: Sensoren
subCategory: "Weitere"
label: "🔘 Taster gedrückt?"
colour: "#2563EB"
tooltip: "Gibt Wahr zurück, wenn der Taster gedrückt ist (Board-Taster B1/B2 oder externer Taster)"
blockType: value
output: Boolean
inputs:
  - label: "🔘 Taster"
    name: BTN
    fieldType: taster_dropdown
  - label: "gedrückt?"
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
