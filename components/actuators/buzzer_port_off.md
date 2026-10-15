---
id: actuator_buzzer_port_off
blockCategory: Aktionen
subCategory: Ton
requiresBoardFeature: externalBuzzer
label: "🔔 Buzzer aus"
label_en: "🔔 Buzzer off"
colour: "#DC2626"
tooltip: "Schaltet den Buzzer am gewählten Anschluss aus"
tooltip_en: "Turns off the buzzer on the chosen connector"
blockType: statement
inputs:
  - label: "🔔 Buzzer  Port:"
    label_en: "🔔 Buzzer  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
  - label: "aus"
    label_en: "off"
    fieldType: fixed_label
generator:
  imports:
    - "import board"
    - "import pwmio"
  defs:
    - key: "init_buzz_${PIN}"
      val: "_buzz_${PIN} = pwmio.PWMOut(board.${PIN}, duty_cycle=0, frequency=440, variable_frequency=True)"
  code: "_buzz_${PIN}.duty_cycle = 0\n"
hardware:
  commonName: "Passiver Buzzer (extern)"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: false
---

# Buzzer ausschalten (externer Buzzer)

Schaltet den Buzzer am gewählten Anschluss aus.

<!-- lang:en -->

# Turn buzzer off (external buzzer)

Turns off the buzzer on the chosen connector.
