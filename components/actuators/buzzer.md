---
id: actuator_buzzer
blockCategory: Aktionen
subCategory: Ton
label: "🔔 Buzzer Ton"
label_en: "🔔 Buzzer tone"
colour: "#DC2626"
tooltip: "Spielt einen Ton mit der angegebenen Frequenz (z.B. 440 = Kammerton A)"
tooltip_en: "Plays a tone at the given frequency (e.g. 440 = concert pitch A)"
blockType: statement
inline: true
valueInputs:
  - name: FREQ
    label: "🔔 Buzzer  Ton:"
    label_en: "🔔 Buzzer  tone:"
    check: Number
    defaultValue: 440
  - name: DURATION
    label: "Hz  für"
    label_en: "Hz  for"
    check: Number
    defaultValue: 0.5
    suffix: "Sekunden"
    suffix_en: "seconds"
hardware:
  commonName: "Passiver Buzzer (Board-Pin GP22)"
  verbrauch3j: 14
  kitStandard: true
legacyGenerator: true
---

# Board-Buzzer (passiv, GP22)

Spielt Töne mit einstellbarer Frequenz. Verwendet den eingebauten Buzzer auf GP22.

<!-- lang:en -->

# Board buzzer (passive, GP22)

Plays tones with an adjustable frequency. Uses the built-in buzzer on GP22.
