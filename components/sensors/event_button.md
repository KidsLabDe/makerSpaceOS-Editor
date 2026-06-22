---
id: event_button
blockCategory: Sensoren
subCategory: Ereignisse
label: "🔘 Wenn Taster"
colour: "#0D47A1"
tooltip: "Führt Code aus, wenn der Taster gedrückt oder losgelassen wird"
blockType: event_simple
inputs:
  - label: "🔘 Wenn Taster"
    name: BTN
    fieldType: button_dropdown
  - name: STATE
    fieldType: state_dropdown
statementInput:
  name: DO
  label: "→ dann"
hardware:
  commonName: "Board-Taster B1/B2"
  verbrauch3j: 28
  kitStandard: true
legacyGenerator: true
---

# Ereignis: Wenn Taster (B1/B2)

Reagiert auf Drücken oder Loslassen der Board-Taster.

**Hinweis:** Bedingter Code je nach STATE-Feld – wird direkt in `generator.js` verarbeitet.
