---
id: sensor_ultrasonic
blockCategory: Sensoren
subCategory: Abstand & Licht
label: "📡 Abstand (cm)"
label_en: "📡 Distance (cm)"
colour: "#2563EB"
tooltip: "Misst den Abstand in cm mit dem Grove-Ultraschall-Ranger (ein Signal-Pin)"
tooltip_en: "Measures the distance in cm with the Grove ultrasonic ranger (one signal pin)"
blockType: value
output: Number
inputs:
  - label: "📡 Abstand (cm)  Port:"
    label_en: "📡 Distance (cm)  port:"
    name: SIG
    fieldType: grove_dropdown
    groveRole: digital
hardware:
  commonName: "Grove Ultrasonic Ranger"
  verbrauch3j: 13
  kitStandard: true
  width_mm: 45
  height_mm: 20.5
legacyGenerator: true
---

# Grove Ultraschall-Abstandssensor

Misst Abstände von ca. 2 cm bis 350 cm. Der Grove-Ranger nutzt **einen einzigen Signal-Pin**
(Trigger und Echo teilen sich Pin 2 des Grove-Steckers). Generator: siehe `js/generator.js`.

<!-- lang:en -->

# Grove ultrasonic distance sensor

Measures distances from about 2 cm to 350 cm. The Grove ranger uses **a single
signal pin** (trigger and echo share pin 2 of the Grove connector). Generator:
see `js/generator.js`.
