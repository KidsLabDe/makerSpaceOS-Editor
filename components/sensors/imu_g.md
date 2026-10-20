---
id: sensor_imu_g
blockCategory: Sensoren
subCategory: Bewegung
requiresBoardFeature: imu
label: "🫨 Bewegungsstärke (g)"
label_en: "🫨 Motion strength (g)"
colour: "#2563EB"
tooltip: "Wie stark die Platine bewegt wird: in Ruhe 1, beim Schütteln mehr"
tooltip_en: "How strongly the board is moved: 1 at rest, more when shaken"
blockType: value
output: Number
inputs:
  - label: "🫨 Bewegungsstärke (g)"
    label_en: "🫨 Motion strength (g)"
hardware:
  commonName: "Neigungssensor LSM6DS3TR-C (eingebaut)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Bewegungsstärke (g) – eingebauter Sensor

Misst die gesamte Beschleunigung in g. Liegt die Platine still, ist der Wert
etwa **1** (das ist die Erdanziehung). Beim Schütteln oder Stoßen steigt er –
bis höchstens 4. Gut für Schüttel-Würfel oder Schrittzähler.

> Braucht `lsm6ds3.py` auf `CIRCUITPY/lib/` („Libs prüfen").

<!-- lang:en -->

# Motion strength (g) – built-in sensor

Measures the total acceleration in g. When the board lies still the value is
about **1** (that is gravity). Shaking or bumping makes it rise – up to 4 at most.
Great for a shake dice or a step counter.

> Needs `lsm6ds3.py` on `CIRCUITPY/lib/` ("Check libs").
