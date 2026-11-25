---
id: barrier_blocked
blockCategory: Sensoren
component: light_barrier
subCategory: Abstand & Licht
label: "Kugel davor?"
label_en: "marble in front?"
colour: "#2563EB"
tooltip: "Wahr, solange etwas vor der Lichtschranke ist"
tooltip_en: "True while something is in front of the light barrier"
blockType: value
output: Boolean
inputs:
  - label: "Kugel davor?  Port:"
    label_en: "marble in front?  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: analog
generator:
  imports:
    - "import board"
    - "from lichtschranke import Lichtschranke"
  defs:
    - key: "init_ls_${PIN}"
      val: "_ls_${PIN} = Lichtschranke(board.${PIN}, \"${PIN}\")"
  expression: "_ls_${PIN}.davor()"
  order: FUNCTION_CALL
legacyGenerator: false
---

# Lichtschranke: Kugel davor?

Wahr, solange etwas vor dem Sensor ist. Bleibt es länger als 3 Sekunden dort, gilt das als neuer Ruhezustand.

**Anschluss:** Pololu QTR-HD-01A (oder ein Kanal des QTR-HD-02A) an einen analogen Port: OUT an das gelbe Kabel, VCC an 3V3, GND an GND, CTRL bleibt frei.

<!-- lang:en -->

# Light barrier: marble in front?

True while something is in front of the sensor. If it stays there for more than 3 seconds, this becomes the new resting state.

**Wiring:** Pololu QTR-HD-01A (or one channel of the QTR-HD-02A) on an analog port: OUT to the yellow wire, VCC to 3V3, GND to GND, leave CTRL unconnected.
