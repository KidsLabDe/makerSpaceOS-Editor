---
id: sensor_encoder
blockCategory: Sensoren
subCategory: "Weitere"
label: "🔄 Drehgeber Position"
colour: "#2563EB"
tooltip: "Liest die Position des Drehgebers (positiv = rechts, negativ = links)"
blockType: value
output: Number
inputs:
  - label: "🔄 Drehgeber Position  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin
hardware:
  commonName: "Grove Encoder / Drehgeber"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# Drehgeber / Rotary Encoder (Grove)

Zählt Drehbewegungen (unbegrenzt). Positiver Wert = Rechtsdrehung, negativer Wert = Linksdrehung.
Nutzt beide Pins des Grove-Ports (Pin1 = CLK, Pin2 = DT). Generator: siehe `js/generator.js`.
