---
id: barrier_calibrate
blockCategory: Sensoren
component: light_barrier
subCategory: Abstand & Licht
label: "neu einmessen"
label_en: "recalibrate"
colour: "#2563EB"
tooltip: "Misst den Ruhezustand neu – dabei muss die Sicht frei sein"
tooltip_en: "Measures the resting state again – the view has to be clear"
blockType: statement
inputs:
  - label: "neu einmessen  Port:"
    label_en: "recalibrate  port:"
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
  code: "_ls_${PIN}.neu_einmessen()\n"
legacyGenerator: false
---

# Lichtschranke: neu einmessen

Normalerweise nicht nötig: Die Lichtschranke misst sich beim Start selbst ein. Nützlich, nachdem der Sensor verschoben wurde.

<!-- lang:en -->

# Light barrier: recalibrate

Usually not needed: the light barrier calibrates itself at the start. Useful after the sensor has been moved.
