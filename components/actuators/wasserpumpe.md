---
id: actuator_wasserpumpe
blockCategory: Aktoren
subCategory: Weitere
label: "💧 Wasserpumpe"
colour: "#E65100"
tooltip: "Schaltet eine Mini-Tauchpumpe ein oder aus (über Relais oder Motorkanal)"
blockType: statement
inputs:
  - label: "💧 Wasserpumpe  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
  - name: STATE
    fieldType: on_off_dropdown
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_pumpe_${PIN}"
      val: "_pumpe_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_pumpe_${PIN}.direction = digitalio.Direction.OUTPUT"
  code: "_pumpe_${PIN}.value = ${STATE}\n"
hardware:
  commonName: "Mini-Tauchpumpe 3–6V"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: false
---

# Wasserpumpe

Steuert eine Mini-Tauchpumpe für automatische Pflanzenbewässerung.

**Wichtig:** Die Pumpe darf nicht direkt an einen GPIO-Pin! Immer über ein Relais (KY-019) oder einen Motorkanal des Boards treiben.

## Empfohlener Aufbau
1. GPIO → Relais (KY-019) → Pumpe
2. Oder: Motorkanal des MAKER-PI-RP2040 → Pumpe
