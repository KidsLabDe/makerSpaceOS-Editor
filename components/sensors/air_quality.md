---
id: sensor_air_quality
blockCategory: Sensoren
subCategory: Weitere
label: "🌫️ Luftqualität (0–100%)"
label_en: "🌫️ Air quality (0–100%)"
colour: "#2563EB"
tooltip: "Liest die Luftverschmutzung in Prozent (0 = frische Luft, 100 = sehr schlechte Luft). Der Sensor braucht nach dem Einschalten ca. 20 Sekunden Aufwärmzeit."
tooltip_en: "Reads the air pollution in percent (0 = fresh air, 100 = very bad air). The sensor needs about 20 seconds to warm up after power-on."
blockType: value
output: Number
inputs:
  - label: "🌫️ Luftqualität (0–100%)  Port:"
    label_en: "🌫️ Air quality (0–100%)  port:"
    name: PIN
    fieldType: grove_dropdown
    groveRole: analog
generator:
  imports:
    - "import board"
    - "import analogio"
  defs:
    - key: "init_aq_${PIN}"
      val: "_aq_${PIN} = analogio.AnalogIn(board.${PIN})"
  expression: "round(_aq_${PIN}.value / 65535 * 100)"
  order: FUNCTION_CALL
hardware:
  commonName: "Grove Air Quality Sensor v1.3"
  kitStandard: false
legacyGenerator: false
---

# Grove Luftqualitätssensor v1.3

Misst die Luftverschmutzung (Kohlenmonoxid, Alkohol, Aceton, Formaldehyd u.a.) als
Prozentwert: **0 % = frische Luft**, höhere Werte = schlechtere Luft. Typisch liegt
frische Luft bei ca. 5–10 %, ab ca. 20–30 % ist die Luft merklich verschmutzt.

**Wichtig:** Der Sensor (MP503) braucht nach dem Einschalten ca. **20 Sekunden
Aufwärmzeit**, bevor die Werte stimmen. Anschluss an einen analogen Grove-Port.

<!-- lang:en -->

# Grove air quality sensor v1.3

Measures air pollution (carbon monoxide, alcohol, acetone, formaldehyde and more) as a
percentage: **0 % = fresh air**, higher values = worse air. Fresh air is typically
around 5–10 %; from about 20–30 % the air is noticeably polluted.

**Important:** after power-on the sensor (MP503) needs about **20 seconds to warm up**
before the values are correct. Connect to an analog Grove port.
