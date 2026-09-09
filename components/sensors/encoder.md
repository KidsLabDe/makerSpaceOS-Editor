---
id: sensor_encoder
blockCategory: Sensoren
subCategory: "Weitere"
label: "🔄 Drehgeber Position"
label_en: "🔄 Encoder position"
colour: "#2563EB"
tooltip: "Liest die Position des Drehgebers (positiv = rechts, negativ = links)"
tooltip_en: "Reads the position of the rotary encoder (positive = right, negative = left)"
blockType: value
output: Number
inputs:
  - label: "🔄 Drehgeber Position  Port:"
    label_en: "🔄 Encoder position  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin_sequential
hardware:
  commonName: "Grove Encoder / Drehgeber"
  verbrauch3j: 0
  kitStandard: true
  width_mm: 19
  height_mm: 26
legacyGenerator: true
---

# Drehgeber / Rotary Encoder (Grove)

Zählt Drehbewegungen (unbegrenzt). Positiver Wert = Rechtsdrehung, negativer Wert = Linksdrehung.
Nutzt beide Pins des Grove-Ports (Pin1 = CLK, Pin2 = DT). Generator: siehe `js/generator.js`.

**Wichtiger Hinweis:** CircuitPython liest den Drehgeber per PIO – die beiden Pins müssen
**benachbarte GPIOs** sein (z. B. GP0/GP1). Deshalb bietet der Port-Auswahlbereich nur
geeignete Ports an (beim MAKER-PI: Grove 1, 2, 3, 4, 6 – **nicht** Grove 5 und 7).

<!-- lang:en -->

# Rotary encoder (Grove)

Counts rotations (unlimited). Positive value = clockwise, negative value = counter-clockwise.
Uses both pins of the Grove port (pin 1 = CLK, pin 2 = DT). Generator: see `js/generator.js`.

**Important:** CircuitPython reads the encoder via PIO – the two pins must be
**adjacent GPIOs** (e.g. GP0/GP1). The port dropdown therefore only lists suitable
ports (on the MAKER-PI: Grove 1, 2, 3, 4, 6 – **not** Grove 5 and 7).
