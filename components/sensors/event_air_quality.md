---
id: event_air_quality
blockCategory: Sensoren
subCategory: Ereignisse
label: "🌫️ Wenn Luftqualität"
colour: "#D97706"
tooltip: "Führt Code aus, wenn die Luftverschmutzung einen Wert überschreitet/unterschreitet (0 = frisch, 100 = sehr schlecht)"
blockType: event
inline: true
inputs:
  - label: "🌫️ Wenn Luftqualität  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: analog
  - name: OP
    fieldType: op_dropdown
  - label: "%"
    fieldType: fixed_label
valueInputs:
  - name: VALUE
    check: Number
    defaultValue: 30
statementInput:
  name: DO
  label: "dann"
generator:
  imports:
    - "import board"
    - "import analogio"
  defs:
    - key: "init_aq_${PIN}"
      val: "_aq_${PIN} = analogio.AnalogIn(board.${PIN})"
  code: "if round(_aq_${PIN}.value / 65535 * 100) ${OP} ${VALUE}:\n${DO}"
hardware:
  commonName: "Grove Air Quality Sensor v1.3"
  kitStandard: false
legacyGenerator: false
---

# Ereignis: Wenn Luftqualität

Führt Aktionen aus, wenn die Luftverschmutzung einen Schwellwert über- oder
unterschreitet (z.B. Lüfter an, wenn > 30 %).
