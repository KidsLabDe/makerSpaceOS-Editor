---
id: event_button
blockCategory: Sensoren
subCategory: Ereignisse
label: "🔘 Wenn Taster"
label_en: "🔘 When button"
colour: "#D97706"
tooltip: "Führt Code aus, wenn der Taster gedrückt oder losgelassen wird"
tooltip_en: "Runs code when the button is pressed or released"
blockType: event_simple
inputs:
  - label: "🔘 Wenn Taster"
    label_en: "🔘 When button"
    name: BTN
    fieldType: taster_dropdown
  - name: STATE
    fieldType: state_dropdown
statementInput:
  name: DO
  label: "→ dann"
  label_en: "→ then"
hardware:
  commonName: "Taster / Board-Taster"
  verbrauch3j: 28
  kitStandard: true
legacyGenerator: true
---

# Ereignis: Wenn Taster (B1/B2 + extern)

Reagiert auf Drücken oder Loslassen eines Tasters.

<!-- lang:en -->

# Event: when button (B1/B2 + external)

Reacts to a button being pressed or released.
