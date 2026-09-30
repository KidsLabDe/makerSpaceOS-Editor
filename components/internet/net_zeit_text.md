---
id: net_zeit_text
blockCategory: Internet
subCategory: Uhrzeit
requiresBoardFeature: wifi
label: "Uhrzeit als Text"
label_en: "Time as text"
colour: "#7C3AED"
tooltip: "Uhrzeit wie 14:05 oder Datum wie 30.09.2026 als Text – gut für das LCD. Solange unbekannt: --:--"
tooltip_en: "Time like 14:05 or date like 30.09.2026 as text – good for the LCD. While unknown: --:--"
blockType: value
output: String
inputs:
  - label: "als Text:"
    label_en: "as text:"
    name: ART
    fieldType: dropdown
    options:
      - label: "Uhrzeit (14:05)"
        label_en: "time (14:05)"
        value: uhr
      - label: "Datum (30.09.2026)"
        label_en: "date (30.09.2026)"
        value: datum
generator:
  imports:
    - "from makerspaceos_netz import zeit_text"
  expression: "zeit_text(\"${ART}\")"
  order: FUNCTION_CALL
legacyGenerator: false
---

# Uhrzeit als Text

Fertig formatiert zum Anzeigen, z. B. auf dem LCD: `14:05` oder `30.09.2026`.
Solange die Uhr noch nicht gestellt ist, kommt `--:--` bzw. `--.--.----`
zurück – der Block liefert also immer einen Text.

<!-- lang:en -->

# Time as text

Ready formatted for display, e.g. on the LCD: `14:05` or `30.09.2026`. As long
as the clock has not been set, `--:--` or `--.--.----` is returned – so the
block always delivers text.
