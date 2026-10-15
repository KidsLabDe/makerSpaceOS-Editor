---
id: display_eyes
blockCategory: Anzeigen
requiresBoardFeature: display
label: "👀 Augen schauen"
label_en: "👀 Eyes look"
colour: "#0D9488"
tooltip: "Lässt die Augen des Gesichts in eine Richtung schauen"
tooltip_en: "Makes the face's eyes look in a direction"
blockType: statement
inputs:
  - label: "👀 Augen schauen"
    label_en: "👀 Eyes look"
    name: DIR
    fieldType: options_dropdown
    options:
      - label: "nach links"
        label_en: "left"
        value: links
      - label: "nach rechts"
        label_en: "right"
        value: rechts
      - label: "nach oben"
        label_en: "up"
        value: oben
      - label: "nach unten"
        label_en: "down"
        value: unten
      - label: "geradeaus"
        label_en: "straight ahead"
        value: mitte
generator:
  imports:
    - "import robo_display"
  code: "robo_display.augen('${DIR}')\n"
hardware:
  commonName: "Rundes Display GC9A01 (RoboBuddy)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Augen schauen (RoboBuddy)

Bewegt die Augen des Gesichts nach links, rechts, oben, unten oder zurück zur Mitte. Steht gerade Text auf dem Display, erscheint vorher wieder das letzte Gesicht.

Idee: Beim Links-Drehen nach links schauen lassen.

<!-- lang:en -->

# Eyes look (RoboBuddy)

Moves the face's eyes left, right, up, down or back to the middle. If text is currently on the display, the last face appears again first.

Idea: look left while turning left.
