---
id: sensor_lautstaerke
blockCategory: Sensoren
subCategory: Weitere
requiresBoardFeature: mic
label: "🎤 Lautstärke (0–100)"
label_en: "🎤 Loudness (0–100)"
colour: "#2563EB"
tooltip: "Misst, wie laut es gerade ist (0 = still, 100 = sehr laut)"
tooltip_en: "Measures how loud it is right now (0 = quiet, 100 = very loud)"
blockType: value
output: Number
inputs:
  - label: "🎤 Lautstärke (0–100)"
    label_en: "🎤 Loudness (0–100)"
hardware:
  commonName: "Mikrofon (eingebaut, GP29)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Lautstärke – eingebautes Mikrofon

Hört kurz zu und sagt, wie laut es ist: **0** = ganz still, **100** = sehr laut.
Probier es mit Klatschen, Pfeifen oder Rufen aus – und lass zum Beispiel die
Matrix umso mehr leuchten, je lauter es ist.

Ungefähre Werte: still **0**, Sprechen **15–25**, Klatschen **80–100**.

> Tipp: Erst im Monitor ausgeben, welche Werte in deinem Raum vorkommen, und
> dann eine passende Grenze wählen.

<!-- lang:en -->

# Loudness – built-in microphone

Listens briefly and tells you how loud it is: **0** = completely quiet,
**100** = very loud. Try clapping, whistling or shouting – and for example let the
matrix light up more the louder it gets.

Rough values: quiet **0**, talking **15–25**, clapping **80–100**.

> Tip: first print the values in the monitor to see what occurs in your room,
> then choose a suitable threshold.
