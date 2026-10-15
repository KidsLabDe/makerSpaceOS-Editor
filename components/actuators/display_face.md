---
id: display_face
blockCategory: Anzeigen
requiresBoardFeature: display
label: "🙂 Gesicht zeigen"
label_en: "🙂 Show face"
colour: "#0D9488"
tooltip: "Zeigt ein fertiges Gesicht auf dem runden Display"
tooltip_en: "Shows a ready-made face on the round display"
blockType: statement
inputs:
  - label: "🙂 Gesicht zeigen"
    label_en: "🙂 Show face"
    name: FACE
    fieldType: options_dropdown
    options:
      - label: "fröhlich"
        label_en: "happy"
        value: froehlich
      - label: "traurig"
        label_en: "sad"
        value: traurig
      - label: "überrascht"
        label_en: "surprised"
        value: ueberrascht
      - label: "müde"
        label_en: "tired"
        value: muede
      - label: "wütend"
        label_en: "angry"
        value: wuetend
      - label: "verliebt"
        label_en: "in love"
        value: verliebt
generator:
  imports:
    - "import robo_display"
  code: "robo_display.gesicht('${FACE}')\n"
hardware:
  commonName: "Rundes Display GC9A01 (RoboBuddy)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: false
---

# Gesicht zeigen (RoboBuddy)

Zeigt ein fertiges Gesicht auf dem runden Display: fröhlich, traurig, überrascht, müde, wütend oder verliebt.

Mit **Augen schauen** kannst du danach die Augen bewegen.

<!-- lang:en -->

# Show face (RoboBuddy)

Shows a ready-made face on the round display: happy, sad, surprised, tired, angry or in love.

Use **eyes look** afterwards to move the eyes.
