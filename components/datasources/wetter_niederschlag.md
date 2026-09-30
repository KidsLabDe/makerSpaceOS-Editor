---
id: wetter_niederschlag
label: "Niederschlag jetzt"
label_en: "Precipitation now"
tooltip: "Regen/Schnee in der letzten Viertelstunde in mm – von Open-Meteo"
tooltip_en: "Rain/snow in the last quarter hour in mm – from Open-Meteo"
category: Wetter
url: "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=precipitation"
params:
  - name: lat
    label: "Breite"
    label_en: "latitude"
    type: number
    defaultValue: 48.37
  - name: lon
    label: "Länge"
    label_en: "longitude"
    type: number
    defaultValue: 10.90
path: current.precipitation
type: number
unit: "mm"
minInterval_s: 60
source: "https://open-meteo.com"
exampleResponse: '{"latitude":48.36,"longitude":10.9,"generationtime_ms":0.02,"utc_offset_seconds":0,"timezone":"GMT","timezone_abbreviation":"GMT","elevation":494.0,"current_units":{"time":"iso8601","interval":"seconds","precipitation":"mm"},"current":{"time":"2026-09-30T09:15","interval":900,"precipitation":0.0}}'
verified: false
---

# Niederschlag jetzt (Open-Meteo)

Wie viel Regen (oder Schnee als Wasser) gerade fällt, in Millimetern pro
Viertelstunde. `0` heißt: trocken. Ort als Koordinaten wie beim Block
„Temperatur jetzt“.

Idee: Regenwarner – bei mehr als 0 mm leuchten die NeoPixel blau.

<!-- lang:en -->

# Precipitation now (Open-Meteo)

How much rain (or snow as water) is falling right now, in millimetres per
quarter hour. `0` means dry. Location as coordinates, like in the
"Temperature now" block.

Idea: rain alarm – above 0 mm the NeoPixels light up blue.
