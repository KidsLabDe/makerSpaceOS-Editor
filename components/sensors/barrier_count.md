---
id: barrier_count
blockCategory: Sensoren
component: light_barrier
subCategory: Abstand & Licht
label: "Anzahl Kugeln"
label_en: "number of marbles"
colour: "#2563EB"
tooltip: "Wie viele Kugeln seit dem Start vorbeigerollt sind"
tooltip_en: "How many marbles have passed since the start"
blockType: value
output: Number
inputs:
  - label: "Anzahl Kugeln  Port:"
    label_en: "number of marbles  port:"
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
  expression: "_ls_${PIN}.anzahl"
  order: MEMBER
legacyGenerator: false
---

# Lichtschranke: Anzahl Kugeln

Zählt alle Kugeln, die seit dem Programmstart vorbeigerollt sind.

<!-- lang:en -->

# Light barrier: number of marbles

Counts all marbles that have passed since the program started.
