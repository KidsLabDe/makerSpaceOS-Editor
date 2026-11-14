---
id: sensor_icm20948_neigung
blockCategory: Sensoren
component: imu_ext
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
  commonName: "Grove IMU 9DOF (MPU-9250) / ICM20948"
  verbrauch3j: 0
  kitStandard: false
  width_mm: 26
  height_mm: 18
legacyGenerator: true
---

# Bewegungssensor – Neigung (°)

Liefert den Kippwinkel in Grad: „vor/zurück" (−90…90) oder „links/rechts" (−180…180).
0 bedeutet waagerecht. Gut für Wasserwaagen, Balance-Spiele und Lenk-Steuerungen.

> Passende Sensoren werden automatisch erkannt: Seeed **Grove IMU 9DOF** (MPU-9250
> oder ICM-20600), MPU-6050 und Adafruit ICM20948. Treiber: `grove_imu.py` auf
> `CIRCUITPY/lib/` (beim ICM20948 zusätzlich `adafruit_icm20x.mpy` + `adafruit_register/`).

<!-- lang:en -->

# Motion sensor – tilt (°)

Returns the tilt angle in degrees: "forward/back" (−90…90) or "left/right" (−180…180).
0 means level. Great for spirit levels, balance games and steering controls.

> Supported sensors are detected automatically: Seeed **Grove IMU 9DOF** (MPU-9250
> or ICM-20600), MPU-6050 and Adafruit ICM20948. Driver: `grove_imu.py` on
> `CIRCUITPY/lib/` (for the ICM20948 also `adafruit_icm20x.mpy` + `adafruit_register/`).
