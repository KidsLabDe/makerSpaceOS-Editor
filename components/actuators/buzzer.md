---
id: actuator_buzzer
blockCategory: Aktoren
subCategory: Ton
label: "🔔 Buzzer Ton"
colour: "#E65100"
tooltip: "Spielt einen Ton mit der angegebenen Frequenz (z.B. 440 = Kammerton A)"
blockType: statement
inline: true
valueInputs:
  - name: FREQ
    label: "🔔 Buzzer  Ton:"
    check: Number
    defaultValue: 440
  - name: DURATION
    label: "Hz  für"
    check: Number
    defaultValue: 0.5
    suffix: "Sekunden"
hardware:
  commonName: "Passiver Buzzer (Board-Pin GP22)"
  verbrauch3j: 14
  kitStandard: true
legacyGenerator: true
---

# Board-Buzzer (passiv, GP22)

Spielt Töne mit einstellbarer Frequenz. Verwendet den eingebauten Buzzer auf GP22.
