---
id: event_temperature
blockCategory: Sensoren
subCategory: Ereignisse
label: "🌡️ Wenn Temperatur"
colour: "#F39A1B"
tooltip: "Führt Code aus, wenn die Temperatur einen Wert überschreitet/unterschreitet"
blockType: event
inline: true
inputs:
  - label: "🌡️ Wenn Temperatur  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
  - name: OP
    fieldType: op_dropdown
valueInputs:
  - name: VALUE
    check: Number
    defaultValue: 25
statementInput:
  name: DO
  label: "dann"
generator:
  imports:
    - "import board"
    - "import adafruit_dht"
  defs:
    - key: "init_dht_${PIN}"
      val: "_dht_${PIN} = adafruit_dht.DHT22(board.${PIN})"
  code: "if _dht_${PIN}.temperature ${OP} ${VALUE}:\n${DO}"
hardware:
  commonName: "DHT22"
  verbrauch3j: 5
  kitStandard: true
legacyGenerator: false
---

# Ereignis: Wenn Temperatur (DHT22)

Führt Aktionen aus, wenn die Temperatur einen Schwellwert über- oder unterschreitet.
