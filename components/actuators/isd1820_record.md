---
id: actuator_isd1820_record
blockCategory: Aktionen
subCategory: Ton
label: "⏺ Aufnehmen"
colour: "#DC2626"
tooltip: "Nimmt für die angegebene Dauer auf (REC-Pin HIGH halten). Max. 10 Sekunden."
blockType: statement
inputs:
  - label: "⏺ Aufnehmen  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: 2pin
valueInputs:
  - name: DAUER
    label: "Sekunden"
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
