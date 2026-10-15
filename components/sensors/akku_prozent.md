---
id: sensor_akku_prozent
blockCategory: Sensoren
subCategory: Akku
requiresBoardFeature: powerMonitor
label: "🔋 Akkustand (%)"
label_en: "🔋 Battery level (%)"
colour: "#2563EB"
tooltip: "Wie voll der Akku ist, in Prozent (0 = leer, 100 = voll) – grob aus der Spannung geschätzt"
tooltip_en: "How full the battery is, in percent (0 = empty, 100 = full) – roughly estimated from the voltage"
blockType: value
output: Number
inputs:
  - label: "🔋 Akkustand (%)"
    label_en: "🔋 Battery level (%)"
    fieldType: fixed_label
hardware:
  commonName: "Akku-Messchip INA226 (RoboBuddy-Powerboard)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Akkustand in Prozent (RoboBuddy)

Schätzt aus der Akkuspannung, wie voll der Akku ist: **0 %** = leer (3,5 V), **100 %** = voll (4,15 V).

Der Wert ist nur eine Schätzung: Beim Fahren sackt die Spannung kurz ab (dann zeigt der Block weniger), beim Laden steigt sie an (dann zeigt er mehr). Am genauesten ist er, wenn der Roboter still steht und nicht lädt.

<!-- lang:en -->

# Battery level in percent (RoboBuddy)

Estimates from the battery voltage how full the battery is: **0 %** = empty (3.5 V), **100 %** = full (4.15 V).

The value is only an estimate: while driving the voltage briefly drops (the block shows less), while charging it rises (the block shows more). It is most accurate when the robot is standing still and not charging.
