---
id: actuator_isd1820_record
blockCategory: Aktionen
subCategory: Ton
label: "⏺ Aufnehmen"
label_en: "⏺ Record"
colour: "#DC2626"
tooltip: "Nimmt für die angegebene Dauer auf (REC-Pin HIGH halten). Max. 10 Sekunden."
tooltip_en: "Records for the given duration (holds the REC pin HIGH). Max. 10 seconds."
blockType: statement
inputs:
  - label: "⏺ Aufnehmen  Port:"
    label_en: "⏺ Record  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin
valueInputs:
  - name: DAUER
    label: "Sekunden"
    label_en: "seconds"
    defaultValue: 3
    suffix: "s"
hardware:
  commonName: "ISD1820 Sprachmodul"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# ISD1820 – Aufnahme per REC-Pin

REC-Pin HIGH halten = aufnehmen. Nach Ablauf der Dauer wird der Pin LOW gesetzt.
Max. 10 Sekunden (Chip-Limit). Wert über 10 wird auf dem Modul automatisch abgeschnitten.

**Verdrahtung:** REC → Grove Signal-Pin dieses Blocks.

<!-- lang:en -->

# ISD1820 – recording via REC pin

Hold the REC pin HIGH = record. After the duration has elapsed the pin is set LOW.
Max. 10 seconds (chip limit). Values above 10 are cut off automatically by the module.

**Wiring:** REC → Grove signal pin of this block.
