---
id: sensor_akku_strom
blockCategory: Sensoren
subCategory: Akku
requiresBoardFeature: powerMonitor
label: "⚡ Akkustrom (mA)"
label_en: "⚡ Battery current (mA)"
colour: "#2563EB"
tooltip: "Strom am Akku in Milliampere: positiv = Akku wird geladen, negativ = Roboter verbraucht Strom"
tooltip_en: "Battery current in milliamps: positive = battery is charging, negative = robot is using power"
blockType: value
output: Number
inputs:
  - label: "⚡ Akkustrom (mA)"
    label_en: "⚡ Battery current (mA)"
    fieldType: fixed_label
hardware:
  commonName: "Akku-Messchip INA226 (RoboBuddy-Powerboard)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Akkustrom (RoboBuddy)

Zeigt, wie viel Strom gerade in den Akku hinein- oder aus ihm herausfließt – in Milliampere (mA).

- **positiv** (z. B. `+200`) – der Akku wird **geladen** (USB steckt)
- **negativ** (z. B. `-450`) – der Roboter **verbraucht** Strom aus dem Akku
- **ungefähr 0** – nichts passiert, oder der Akku ist voll

Probier mal: Fahren lassen und den Wert im Serial-Monitor ausgeben. Wie viel mehr brauchen die Servos beim Anfahren?

<!-- lang:en -->

# Battery current (RoboBuddy)

Shows how much current is flowing into or out of the battery right now – in milliamps (mA).

- **positive** (e.g. `+200`) – the battery is **charging** (USB plugged in)
- **negative** (e.g. `-450`) – the robot is **using** power from the battery
- **about 0** – nothing is happening, or the battery is full

Try it: let the robot drive and print the value in the serial monitor. How much more do the servos need when starting?
