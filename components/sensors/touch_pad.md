---
id: sensor_touch_pad
blockCategory: Sensoren
subCategory: Weitere
requiresBoardFeature: touchPins
label: "👆 Pfeil berührt?"
label_en: "👆 Arrow touched?"
colour: "#2563EB"
tooltip: "Wahr, solange du das Pfeil-Feld auf der Platine mit dem Finger berührst"
tooltip_en: "True while you touch the arrow pad on the board with your finger"
blockType: value
output: Boolean
inputs:
  - label: "👆 Pfeil"
    label_en: "👆 arrow"
    name: PIN
    fieldType: options_dropdown
    options:
      - label: "⬅️ links"
        label_en: "⬅️ left"
        value: GP14
      - label: "⬆️ oben"
        label_en: "⬆️ up"
        value: GP15
      - label: "➡️ rechts"
        label_en: "➡️ right"
        value: GP16
      - label: "⬇️ unten"
        label_en: "⬇️ down"
        value: GP17
  - label: "berührt?"
    label_en: "touched?"
generator:
  imports:
    - "import board"
    - "import touchio"
  defs:
    - key: "init_touch_${PIN}"
      val: "_touch_${PIN} = touchio.TouchIn(board.${PIN})"
  expression: "_touch_${PIN}.value"
  order: MEMBER
hardware:
  commonName: "Touch-Pfeile (GamePadPico, GP14–GP17)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Pfeil berührt? (GamePadPico)

Die vier Pfeile auf dem GamePadPico sind **Berührungsfelder** – einfach mit dem
Finger antippen, drücken muss man nicht. Der Block ist **wahr**, solange du das
gewählte Feld berührst. Gut für Spielsteuerungen: „wenn Pfeil links berührt,
dann bewege die Figur nach links".

> Die Messung stellt sich beim Programmstart ein – dann die Felder nicht berühren.

<!-- lang:en -->

# Arrow touched? (GamePadPico)

The four arrows on the GamePadPico are **touch pads** – just touch them with your
finger, no pressing needed. The block is **true** while you touch the chosen
pad. Great for game controls: "if arrow left is touched, move the figure left".

> The sensor calibrates itself when the program starts – don't touch the pads then.
