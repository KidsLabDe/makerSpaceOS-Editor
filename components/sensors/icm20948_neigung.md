---
id: sensor_icm20948_neigung
blockCategory: Sensoren
subCategory: Bewegung
label: "🎢 Neigung (°)"
label_en: "🎢 Tilt (°)"
colour: "#2563EB"
tooltip: "Misst, wie weit der Sensor gekippt ist – in Grad (0 = waagerecht)"
tooltip_en: "Measures how far the sensor is tilted – in degrees (0 = level)"
blockType: value
output: Number
inputs:
  - label: "🎢 Neigung (°)"
    label_en: "🎢 Tilt (°)"
    name: DIR
    fieldType: tilt_dropdown
  - label: "Port:"
    label_en: "port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
hardware:
  commonName: "Adafruit ICM20948 (9-Achsen-IMU)"
  verbrauch3j: 0
  kitStandard: false
  width_mm: 26
  height_mm: 18
legacyGenerator: true
---

# ICM20948 – Neigung (°)

Liefert den Kippwinkel in Grad: „vor/zurück" (−90…90) oder „links/rechts" (−180…180).
0 bedeutet waagerecht. Gut für Wasserwaagen, Balance-Spiele und Lenk-Steuerungen.

> Benötigt `adafruit_icm20x.mpy` und `adafruit_register/` auf `CIRCUITPY/lib/`
> (Adafruit CircuitPython Bundle). Anschluss über Grove-I2C-Adapter, Adresse 0x69.

<!-- lang:en -->

# ICM20948 – tilt (°)

Returns the tilt angle in degrees: "forward/back" (−90…90) or "left/right" (−180…180).
0 means level. Great for spirit levels, balance games and steering controls.

> Needs `adafruit_icm20x.mpy` and `adafruit_register/` on `CIRCUITPY/lib/`
> (Adafruit CircuitPython Bundle). Connect via a Grove I2C adapter, address 0x69.
