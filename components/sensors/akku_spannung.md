---
id: sensor_akku_spannung
blockCategory: Sensoren
subCategory: Akku
requiresBoardFeature: powerMonitor
label: "🔋 Akkuspannung (V)"
label_en: "🔋 Battery voltage (V)"
colour: "#2563EB"
tooltip: "Spannung des Akkus in Volt (voll ≈ 4,2 V, leer ≈ 3,5 V)"
tooltip_en: "Battery voltage in volts (full ≈ 4.2 V, empty ≈ 3.5 V)"
blockType: value
output: Number
inputs:
  - label: "🔋 Akkuspannung (V)"
    label_en: "🔋 Battery voltage (V)"
    fieldType: fixed_label
hardware:
  commonName: "Akku-Messchip INA226 (RoboBuddy-Powerboard)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Akkuspannung (RoboBuddy)

Misst die Spannung des Akkus in Volt, mit zwei Nachkommastellen.

- **4,2 V** – voll geladen
- **3,6 V** – fast leer, bald laden
- **3,5 V** – leer: Der RoboBuddy schaltet die Servos ab und schläft

Der Messchip (INA226) sitzt auf dem Powerboard. **Ohne Akku** (nur USB) springt der Wert wild zwischen etwa 4,1 und 4,4 V hin und her – das ist der Lader, kein Fehler.

<!-- lang:en -->

# Battery voltage (RoboBuddy)

Measures the battery voltage in volts, with two decimal places.

- **4.2 V** – fully charged
- **3.6 V** – almost empty, charge soon
- **3.5 V** – empty: the RoboBuddy switches the servos off and goes to sleep

The measuring chip (INA226) sits on the power board. **Without a battery** (USB only) the value jumps wildly between about 4.1 and 4.4 V – that's the charger, not a fault.
