---
id: sensor_imu_neigung
blockCategory: Sensoren
subCategory: Bewegung
requiresBoardFeature: imu
label: "🎢 Neigung (°)"
label_en: "🎢 Tilt (°)"
colour: "#2563EB"
tooltip: "Misst, wie weit die Platine gekippt ist – in Grad (0 = waagerecht)"
tooltip_en: "Measures how far the board is tilted – in degrees (0 = level)"
blockType: value
output: Number
inputs:
  - label: "🎢 Neigung (°)"
    label_en: "🎢 Tilt (°)"
    name: DIR
    fieldType: tilt_dropdown
hardware:
  commonName: "Neigungssensor LSM6DS3TR-C (eingebaut)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Neigung (°) – eingebauter Sensor

Liefert, wie weit die Platine gekippt ist, in Grad: „vor/zurück" (−90…90) oder
„links/rechts" (−180…180). 0 bedeutet waagerecht. Gut für Wasserwaagen,
Balance-Spiele und zum Lenken durch Kippen.

> Der Sensor (LSM6DS3TR-C) ist fest eingebaut, es muss nichts angesteckt werden.
> Braucht `lsm6ds3.py` auf `CIRCUITPY/lib/` („Libs prüfen").

<!-- lang:en -->

# Tilt (°) – built-in sensor

Returns how far the board is tilted, in degrees: "forward/back" (−90…90) or
"left/right" (−180…180). 0 means level. Great for spirit levels, balance games
and steering by tilting.

> The sensor (LSM6DS3TR-C) is built in, nothing needs to be plugged in.
> Needs `lsm6ds3.py` on `CIRCUITPY/lib/` ("Check libs").
