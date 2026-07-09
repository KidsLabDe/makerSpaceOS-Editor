---
id: sensor_icm20948_neigung
blockCategory: Sensoren
subCategory: Bewegung
label: "🎢 Neigung (°)"
colour: "#2563EB"
tooltip: "Misst, wie weit der Sensor gekippt ist – in Grad (0 = waagerecht)"
blockType: value
output: Number
inputs:
  - label: "🎢 Neigung (°)"
    name: DIR
    fieldType: tilt_dropdown
  - label: "Port:"
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
