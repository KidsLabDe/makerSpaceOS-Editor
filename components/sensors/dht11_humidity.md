---
id: sensor_dht11_humidity
blockCategory: Sensoren
subCategory: Temperatur & Feuchte
label: "💧 DHT11 Luftfeuchte (%)"
colour: "#2563EB"
tooltip: "Liest die Luftfeuchtigkeit in % vom DHT11 Sensor (KY-015)"
blockType: value
output: Number
inputs:
  - label: "💧 DHT11 Luftfeuchte (%)  Port:"
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
  expression: "_dht11_${PIN}.humidity"
  order: MEMBER
hardware:
  kyNumber: "KY-015"
  commonName: "DHT11"
  verbrauch3j: 5
  kitStandard: true
  width_mm: 40
  height_mm: 20
legacyGenerator: false
---

# DHT11 Luftfeuchtesensor

Misst die relative Luftfeuchtigkeit in Prozent mit dem DHT11 Sensor.
