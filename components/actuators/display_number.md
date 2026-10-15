---
id: display_number
blockCategory: Anzeigen
requiresBoardFeature: display
label: "🔢 Zahl anzeigen"
label_en: "🔢 Show number"
colour: "#0D9488"
tooltip: "Zeigt eine Zahl groß in der Mitte des runden Displays (z.B. Akkustand oder Abstand)"
tooltip_en: "Shows a number big in the middle of the round display (e.g. battery level or distance)"
blockType: statement
inline: true
inputs:
  - label: "🔢 Zahl in"
    label_en: "🔢 Number in"
    name: COLOR
    fieldType: colour_picker
valueInputs:
  - name: NUM
    label: "anzeigen:"
    label_en: "show:"
    check: Number
    defaultValue: 42
generator:
  imports:
    - "import robo_display"
  code: "robo_display.zahl(${NUM}, '${COLOR}')\n"
hardware:
  commonName: "Rundes Display GC9A01 (RoboBuddy)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Zahl anzeigen (RoboBuddy)

Zeigt eine Zahl groß in der Mitte des runden Displays. Kommazahlen werden auf eine Stelle gerundet.

Idee: `Zahl anzeigen: Akkustand (%)` in einer Für-immer-Schleife.

<!-- lang:en -->

# Show number (RoboBuddy)

Shows a number big in the middle of the round display. Decimal numbers are rounded to one place.

Idea: `show number: battery level (%)` in a forever loop.
