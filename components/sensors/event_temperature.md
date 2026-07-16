---
id: event_temperature
blockCategory: Sensoren
subCategory: Ereignisse
label: "🌡️ Wenn Temperatur"
label_en: "🌡️ When temperature"
colour: "#D97706"
tooltip: "Führt Code aus, wenn die Temperatur einen Wert überschreitet/unterschreitet"
tooltip_en: "Runs code when the temperature goes above/below a value"
blockType: event
inline: true
inputs:
  - label: "🌡️ Wenn Temperatur  Port:"
    label_en: "🌡️ When temperature  port:"
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
  label_en: "then"
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

<!-- lang:en -->

# Event: when temperature (DHT22)

Runs actions when the temperature goes above or below a threshold.
