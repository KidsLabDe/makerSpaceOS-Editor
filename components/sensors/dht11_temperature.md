---
id: sensor_dht11_temperature
blockCategory: Sensoren
subCategory: Temperatur & Feuchte
label: "🌡️ DHT11 Temperatur (°C)"
label_en: "🌡️ DHT11 temperature (°C)"
colour: "#2563EB"
tooltip: "Liest die Temperatur in Grad Celsius vom DHT11 Sensor (KY-015)"
tooltip_en: "Reads the temperature in degrees Celsius from the DHT11 sensor (KY-015)"
blockType: value
output: Number
inputs:
  - label: "🌡️ DHT11 Temperatur (°C)  Port:"
    label_en: "🌡️ DHT11 temperature (°C)  port:"
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
  width_mm: 40
  height_mm: 20
legacyGenerator: false
---

# DHT11 Temperatursensor

Günstiger Sensor für Temperatur und Luftfeuchtigkeit. Weniger genau als DHT22, aber gut für Einsteigerprojekte.

<!-- lang:en -->

# DHT11 temperature sensor

Inexpensive sensor for temperature and humidity. Less accurate than the DHT22,
but great for beginner projects.
