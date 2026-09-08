---
id: event_ldr
blockCategory: Sensoren
subCategory: Ereignisse
label: "☀️ Wenn Helligkeit"
label_en: "☀️ When brightness"
colour: "#D97706"
tooltip: "Führt Code aus, wenn die Helligkeit einen Wert überschreitet/unterschreitet"
tooltip_en: "Runs code when the brightness goes above/below a value"
blockType: event
inline: true
inputs:
  - label: "☀️ Wenn Helligkeit  Port:"
    label_en: "☀️ When brightness  port:"
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
  label_en: "then"
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
  commonName: "LDR / Fotowiderstand"
  verbrauch3j: 9
  kitStandard: true
legacyGenerator: false
---

# Ereignis: Wenn Helligkeit (LDR)

Führt Aktionen aus, wenn die Helligkeit einen Schwellwert über- oder unterschreitet.

<!-- lang:en -->

# Event: when brightness (LDR)

Runs actions when the brightness goes above or below a threshold.
