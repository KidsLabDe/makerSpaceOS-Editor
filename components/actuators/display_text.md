---
id: display_text
blockCategory: Anzeigen
requiresBoardFeature: display
label: "💬 Text anzeigen"
label_en: "💬 Show text"
colour: "#0D9488"
tooltip: "Zeigt eine Zeile Text mittig auf dem runden Display – kurze Wörter werden größer"
tooltip_en: "Shows one line of text in the middle of the round display – short words get bigger"
blockType: statement
inline: true
inputs:
  - label: "💬 Text in"
    label_en: "💬 Text in"
    name: COLOR
    fieldType: colour_picker
valueInputs:
  - name: TEXT
    label: "anzeigen:"
    label_en: "show:"
    check: String
    defaultValue: "Hallo!"
    defaultValue_en: "Hello!"
generator:
  imports:
    - "import robo_display"
  code: "robo_display.text(${TEXT}, '${COLOR}')\n"
hardware:
  commonName: "Rundes Display GC9A01 (RoboBuddy)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Text anzeigen (RoboBuddy)

Zeigt eine Zeile Text in der Mitte des runden Displays. Kurze Wörter werden groß, lange klein. Mehr als etwa 15 Zeichen passen nicht auf das runde Display.

Das Gesicht verschwindet, solange Text angezeigt wird.

<!-- lang:en -->

# Show text (RoboBuddy)

Shows one line of text in the middle of the round display. Short words are big, long ones small. More than about 15 characters do not fit on the round display.

The face disappears while text is shown.
