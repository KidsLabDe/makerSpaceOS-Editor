---
block: false
id: display_matrix_8x8
label: "8x8 Matrix"
hardware:
  commonName: "8x8 NeoPixel-Matrix (WS2812B)"
  width_mm: 67
  height_mm: 65.5
---

# 8×8 NeoPixel-Matrix

64 RGB-LEDs (WS2812B) als 8×8-Raster, angesteuert über einen Servo-Port (S1–S4).
Die zugehörigen Blockly-Blöcke (`matrix_on`, `matrix_symbol`, `matrix_draw` …)
sind handgeschrieben in `js/blocks/matrix.js` – daher kein generierter Block aus
dieser Datei. Sie hält nur die Maße (für das Laser-Layout `laser/a4_layout.py`)
und allgemeine Metadaten.

Maße: 67 × 65,5 mm (Breite × Höhe).
