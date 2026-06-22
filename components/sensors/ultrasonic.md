---
id: sensor_ultrasonic
blockCategory: Sensoren
subCategory: Abstand & Licht
label: "📡 Abstand (cm)"
colour: "#1565C0"
tooltip: "Misst den Abstand in cm mit dem Grove-Ultraschall-Ranger (ein Signal-Pin)"
blockType: value
output: Number
inputs:
  - label: "📡 Abstand (cm)  Port:"
    name: SIG
    fieldType: grove_dropdown
    groveRole: digital
hardware:
  commonName: "Grove Ultrasonic Ranger"
  verbrauch3j: 13
  kitStandard: true
legacyGenerator: true
---

# Grove Ultraschall-Abstandssensor

Misst Abstände von ca. 2 cm bis 350 cm. Der Grove-Ranger nutzt **einen einzigen Signal-Pin**
(Trigger und Echo teilen sich Pin 2 des Grove-Steckers). Generator: siehe `js/generator.js`.
