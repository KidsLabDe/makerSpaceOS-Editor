---
id: event_ldr
blockCategory: Sensoren
subCategory: Ereignisse
label: "☀️ Wenn Helligkeit"
colour: "#0D47A1"
tooltip: "Führt Code aus, wenn die Helligkeit einen Wert überschreitet/unterschreitet"
blockType: event
inline: true
inputs:
  - label: "☀️ Wenn Helligkeit  Port:"
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
    defaultValue: 50
statementInput:
  name: DO
  label: "dann"
generator:
  imports:
    - "import board"
    - "import analogio"
  defs:
    - key: "init_ldr_${PIN}"
      val: "_ldr_${PIN} = analogio.AnalogIn(board.${PIN})"
  code: "if round(_ldr_${PIN}.value / 65535 * 100) ${OP} ${VALUE}:\n${DO}"
hardware:
  kyNumber: "KY-018"
  commonName: "LDR"
  verbrauch3j: 9
  kitStandard: true
legacyGenerator: false
---

# Ereignis: Wenn Helligkeit (LDR)

Führt Aktionen aus, wenn die Helligkeit einen Schwellwert über- oder unterschreitet.
