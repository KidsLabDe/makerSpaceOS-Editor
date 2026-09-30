---
id: pegel_wasserstand
label: "Wasserstand"
label_en: "Water level"
tooltip: "Aktueller Wasserstand an einem Pegel einer Bundeswasserstraße in cm – von PEGELONLINE (WSV)"
tooltip_en: "Current water level at a gauge on a German federal waterway in cm – from PEGELONLINE (WSV)"
category: Wasser
url: "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/{pegel}/W/currentmeasurement.json"
params:
  - name: pegel
    label: "Pegel"
    label_en: "gauge"
    type: text
    defaultValue: "PFELLING"
path: value
type: number
unit: "cm"
minInterval_s: 300
source: "https://www.pegelonline.wsv.de"
exampleResponse: '{"timestamp":"2026-09-30T11:00:00+02:00","value":301.0,"stateMnwMhw":"normal","stateNswHsw":"normal"}'
verified: false
---

# Wasserstand (PEGELONLINE)

Der aktuelle Wasserstand an einem Pegel in Zentimetern. PEGELONLINE ist der
Dienst der Wasserstraßen- und Schifffahrtsverwaltung des Bundes.

**Achtung:** Es gibt nur Pegel an **Bundeswasserstraßen** – also z. B. an der
Donau ab Kelheim, aber **nicht** an Lech oder Wertach. Den Pegelnamen findest
du auf pegelonline.wsv.de (Großbuchstaben, z. B. „PFELLING“).

Pegel werden meist alle 15 Minuten gemessen – der Block fragt höchstens alle
5 Minuten nach.

<!-- lang:en -->

# Water level (PEGELONLINE)

The current water level at a gauge in centimetres. PEGELONLINE is the service
of the German Federal Waterways and Shipping Administration.

**Note:** There are only gauges on **federal waterways** – e.g. on the Danube
from Kelheim downstream, but **not** on the Lech or Wertach. Find the gauge name
on pegelonline.wsv.de (capital letters, e.g. "PFELLING").

Gauges usually measure every 15 minutes – the block asks at most every
5 minutes.
