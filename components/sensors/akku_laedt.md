---
id: sensor_akku_laedt
blockCategory: Sensoren
subCategory: Akku
requiresBoardFeature: powerMonitor
label: "🔌 Akku lädt?"
label_en: "🔌 Battery charging?"
colour: "#2563EB"
tooltip: "Wahr, solange Strom in den Akku fließt (USB steckt und Akku ist nicht voll)"
tooltip_en: "True while current flows into the battery (USB plugged in and battery not full)"
blockType: value
output: Boolean
inputs:
  - label: "🔌 Akku lädt?"
    label_en: "🔌 Battery charging?"
    fieldType: fixed_label
hardware:
  commonName: "Akku-Messchip INA226 (RoboBuddy-Powerboard)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Akku lädt? (RoboBuddy)

Gibt **Wahr** zurück, solange der Akku geladen wird – also mehr als 20 mA hineinfließen. Ist der Akku voll, hört das Laden auf und der Block meldet wieder **Falsch**.

Idee: Beim Laden ein schlafendes Gesicht zeigen.

<!-- lang:en -->

# Battery charging? (RoboBuddy)

Returns **true** while the battery is being charged – i.e. more than 20 mA flow in. When the battery is full, charging stops and the block reports **false** again.

Idea: show a sleepy face while charging.
