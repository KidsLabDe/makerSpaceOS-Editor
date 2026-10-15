---
id: display_clear
blockCategory: Anzeigen
requiresBoardFeature: display
label: "⬛ Display löschen"
label_en: "⬛ Clear display"
colour: "#0D9488"
tooltip: "Macht das runde Display schwarz"
tooltip_en: "Makes the round display black"
blockType: statement
inputs:
  - label: "⬛ Display löschen"
    label_en: "⬛ Clear display"
    fieldType: fixed_label
generator:
  imports:
    - "import robo_display"
  code: "robo_display.loeschen()\n"
hardware:
  commonName: "Rundes Display GC9A01 (RoboBuddy)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Display löschen (RoboBuddy)

Macht das runde Display schwarz – Gesicht und Text verschwinden.

<!-- lang:en -->

# Clear display (RoboBuddy)

Makes the round display black – face and text disappear.
