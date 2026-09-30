---
id: wetter_temperatur
label: "Temperatur jetzt"
label_en: "Temperature now"
tooltip: "Aktuelle Lufttemperatur (2 m über dem Boden) an einem Ort – von Open-Meteo"
tooltip_en: "Current air temperature (2 m above ground) at a location – from Open-Meteo"
category: Wetter
url: "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m"
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
path: current.temperature_2m
type: number
unit: "°C"
minInterval_s: 60
source: "https://open-meteo.com"
exampleResponse: '{"latitude":48.36,"longitude":10.9,"generationtime_ms":0.02,"utc_offset_seconds":0,"timezone":"GMT","timezone_abbreviation":"GMT","elevation":494.0,"current_units":{"time":"iso8601","interval":"seconds","temperature_2m":"°C"},"current":{"time":"2026-09-30T09:15","interval":900,"temperature_2m":14.2}}'
verified: false
---

# Temperatur jetzt (Open-Meteo)

Liefert die aktuelle Lufttemperatur in °C für einen Ort. Den Ort gibst du als
**Koordinaten** an (Breite/Länge) – voreingestellt ist Augsburg. Koordinaten
findest du z. B. in einer Karten-App (lange auf den Ort tippen).

Open-Meteo aktualisiert die Werte alle 15 Minuten. Der Block fragt höchstens
einmal pro Minute nach, dazwischen kommt der gespeicherte Wert zurück.

Solange noch kein Wert geholt wurde (z. B. kein WLAN), liefert der Block
**nichts** (`None`). Prüfe das, bevor du damit rechnest – sonst bricht das
Programm ab.

<!-- lang:en -->

# Temperature now (Open-Meteo)

Returns the current air temperature in °C for a location. You enter the
location as **coordinates** (latitude/longitude) – the default is Augsburg.
You can find coordinates e.g. in a map app (long-press on the place).

Open-Meteo updates the values every 15 minutes. The block asks at most once per
minute; in between it returns the stored value.

As long as no value has been fetched yet (e.g. no Wi-Fi), the block returns
**nothing** (`None`). Check for that before calculating with it – otherwise
the program stops.
