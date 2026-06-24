---
id: event_button
blockCategory: Sensoren
subCategory: Ereignisse
label: "🔘 Wenn Taster"
colour: "#D97706"
tooltip: "Führt Code aus, wenn der Taster gedrückt oder losgelassen wird"
blockType: event_simple
inputs:
  - label: "🔘 Wenn Taster"
    name: BTN
    fieldType: taster_dropdown
  - name: STATE
    fieldType: state_dropdown
statementInput:
  name: DO
  label: "→ dann"
hardware:
  commonName: "Taster / Board-Taster"
  verbrauch3j: 28
  kitStandard: true
legacyGenerator: true
---

# Ereignis: Wenn Taster (B1/B2 + extern)

Reagiert auf Drücken oder Loslassen eines Tasters.
