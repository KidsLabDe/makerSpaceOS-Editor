---
id: sensor_ultrasonic
blockCategory: Sensoren
subCategory: Abstand & Licht
label: "📡 Abstand (cm)"
label_en: "📡 Distance (cm)"
colour: "#2563EB"
tooltip: "Misst den Abstand in cm – Typ wählen: Grove-Ranger (1 Pin) oder freier HC-SR04 (TRIG + ECHO)"
tooltip_en: "Measures the distance in cm – choose type: Grove Ranger (1 pin) or bare HC-SR04 (TRIG + ECHO)"
blockType: value
output: Number
inputs:
  - label: "📡 Abstand (cm)  Port:"
    label_en: "📡 Distance (cm)  port:"
    name: SIG
    fieldType: grove_dropdown
    groveRole: digital
  - label: "Typ:"
    label_en: "type:"
    name: TYPE
    fieldType: sensor_type_dropdown
hardware:
  commonName: "Ultraschall-Ranger (Grove / HC-SR04)"
  verbrauch3j: 13
  kitStandard: true
  width_mm: 45
  height_mm: 20.5
legacyGenerator: true
---

# Ultraschall-Abstandssensor

Misst Abstände von ca. 2 cm bis 400 cm. Wähle im Block den passenden **Sensor-Typ**:

- **Grove Ranger (1 Pin)**: Das Grove-Ultraschall-Modul misst mit nur einem
  Signal-Kabel (Trigger und Echo teilen sich Pin 2 des Grove-Steckers).
- **HC-SR04 (TRIG + ECHO)**: Freier SR04 am Grove-Port verkabelt: VCC und GND
  an die Stromkabel, **TRIG** an das Signal-Kabel (Pin 2), **ECHO** an das 2.
  Datenkabel (Pin 1). Der Generator nimmt automatisch die beiden Pins des
  gewählten Ports.

Achtung: Am Grove-Port hat der Sensor nur 3,3 V statt 5 V – er funktioniert,
aber die maximale Reichweite wird kleiner. Generatoren: siehe `js/generator.js`.

<!-- lang:en -->

# Ultrasonic distance sensor

Measures distances from about 2 cm to 4 m. Choose the matching **sensor type**
in the block:

- **Grove Ranger (1 pin)**: The Grove ultrasonic module measures with a single
  signal wire (trigger and echo share pin 2 of the Grove connector).
- **HC-SR04 (TRIG + ECHO)**: Bare SR04 wired to a Grove port: VCC and GND to
  the power wires, **TRIG** to the signal wire (pin 2), **ECHO** to the second
  data wire (pin 1). The generator picks both pins of the chosen port
  automatically.

Note: On a Grove port the sensor only gets 3.3 V instead of 5 V – it works,
but the maximum range is reduced. Generators: see `js/generator.js`.
