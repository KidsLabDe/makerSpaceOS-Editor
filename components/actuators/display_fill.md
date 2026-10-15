---
id: display_fill
blockCategory: Anzeigen
requiresBoardFeature: display
label: "🎨 Display füllen"
label_en: "🎨 Fill display"
colour: "#0D9488"
tooltip: "Färbt das ganze runde Display in einer Farbe"
tooltip_en: "Colours the whole round display in one colour"
blockType: statement
inputs:
  - label: "🎨 Display füllen mit"
    label_en: "🎨 Fill display with"
    name: COLOR
    fieldType: colour_picker
generator:
  imports:
    - "import robo_display"
  code: "robo_display.fuellen('${COLOR}')\n"
hardware:
  commonName: "Rundes Display GC9A01 (RoboBuddy)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Display füllen (RoboBuddy)

Färbt das ganze runde Display in der gewählten Farbe. Gesicht und Text verschwinden dabei.

<!-- lang:en -->

# Fill display (RoboBuddy)

Colours the whole round display in the chosen colour. Face and text disappear.
