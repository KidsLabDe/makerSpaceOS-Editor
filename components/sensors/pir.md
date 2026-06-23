---
id: sensor_pir
blockCategory: Sensoren
subCategory: Digital-Sensoren
label: "🚶 Bewegung erkannt?"
colour: "#2563EB"
tooltip: "Gibt Wahr zurück, wenn der PIR-Sensor eine Bewegung erkennt (HC-SR501)"
blockType: value
output: Boolean
inputs:
  - label: "🚶 Bewegung erkannt?  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
generator:
  imports:
    - "import board"
    - "import digitalio"
  defs:
    - key: "init_pir_${PIN}"
      val: "_pir_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_pir_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
  expression: "_pir_${PIN}.value"
  order: MEMBER
hardware:
  commonName: "PIR-Sensor HC-SR501"
  verbrauch3j: 6
  kitStandard: true
legacyGenerator: false
---

# PIR-Bewegungssensor (HC-SR501)

Erkennt Wärmebewegungen (Personen, Tiere) in einem Bereich von ca. 7 m. Ideal für Alarmanlagen und automatische Beleuchtung.

## Anschluss
- OUT → GP-Pin
- VCC → 5V (wichtig: braucht 5V, nicht 3.3V)
- GND → GND

## Tipp
Der Sensor hat eine kurze Aufwärmzeit von ~30 Sekunden nach dem Einschalten.
