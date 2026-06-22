---
id: sensor_dht11_temperature
blockCategory: Sensoren
subCategory: Temperatur & Feuchte
label: "🌡️ DHT11 Temperatur (°C)"
colour: "#1565C0"
tooltip: "Liest die Temperatur in Grad Celsius vom DHT11 Sensor (KY-015)"
blockType: value
output: Number
inputs:
  - label: "🌡️ DHT11 Temperatur (°C)  Port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: digital
generator:
  imports:
    - "import board"
    - "import adafruit_dht"
  defs:
    - key: "init_dht11_${PIN}"
      val: "_dht11_${PIN} = adafruit_dht.DHT11(board.${PIN})"
  expression: "_dht11_${PIN}.temperature"
  order: MEMBER
hardware:
  kyNumber: "KY-015"
  commonName: "DHT11"
  verbrauch3j: 5
  kitStandard: true
legacyGenerator: false
---

# DHT11 Temperatursensor

Günstiger Sensor für Temperatur und Luftfeuchtigkeit. Weniger genau als DHT22, aber gut für Einsteigerprojekte.
