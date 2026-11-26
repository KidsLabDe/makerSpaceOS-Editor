---
id: actuator_servo_pulse
blockCategory: Aktionen
component: servo
subCategory: "Servo & Pumpe"
label: "🔧 Puls einstellen (Profi)"
label_en: "🔧 set pulse (advanced)"
colour: "#DC2626"
tooltip: "Für Profis: stellt ein, wie weit ein Servo wirklich dreht. Einmal beim SETUP verwenden – gilt dann für alle Servo-Blöcke an diesem Anschluss"
tooltip_en: "Advanced: sets how far a servo really turns. Use once in SETUP – then applies to all servo blocks on this connector"
blockType: statement
inline: true
inputs:
  - label: "🔧 Puls einstellen (Profi)"
    label_en: "🔧 set pulse (advanced)"
    name: SERVO
    fieldType: servo_dropdown
  - label: "0° ="
    name: MIN
    fieldType: number_field
    default: 350
    min: 300
    max: 1200
  - label: "µs   180° ="
    name: MAX
    fieldType: number_field
    default: 2400
    min: 1800
    max: 2700
  - label: "µs"
    fieldType: fixed_label
hardware:
  commonName: "Servo SG90"
  verbrauch3j: 0
  kitStandard: true
legacyGenerator: true
---

# Servo-Puls einstellen (für Profis)

Manche Mini-Servos drehen nur etwa **130°**, obwohl du **0 bis 180** eingibst. Mit diesem Block stellst du ein, welches Signal der Servo für 0° und für 180° bekommt.

Lege den Block **ganz oben in SETUP**. Danach benutzt du wie gewohnt den Block **Servo auf … Grad**.

Jedes Servo-Modell ist etwas anders. **350 bis 2400** passt zum Beispiel beim **TIANKONGRC MG90S** – andere Servos brauchen vielleicht andere Werte.

So findest du die richtigen Werte:

1. Starte mit **350** (0°) und **2400** (180°).
2. Lass den Servo auf 0 und auf 180 Grad fahren.
3. **Brummt oder zittert** er am Ende, stößt er an den Anschlag: Mach den Bereich kleiner (0°-Wert größer bzw. 180°-Wert kleiner).
4. Dreht er **zu wenig**, mach den Bereich größer (0°-Wert kleiner bzw. 180°-Wert größer).

> ⚠️ Lass den Servo nicht längere Zeit am Anschlag brummen – er wird heiß und kann kaputtgehen.

Ohne diesen Block gelten **750** und **2250** µs.

<!-- lang:en -->

# Set servo pulse (advanced)

Some micro servos only turn about **130°**, although you enter **0 to 180**. This block sets which signal the servo gets for 0° and for 180°.

Put the block **at the very top of SETUP**. After that, use the **servo to … degrees** block as usual.

Every servo model is a bit different. **350 to 2400** works for the **TIANKONGRC MG90S**, for example – other servos may need other values.

How to find the right values:

1. Start with **350** (0°) and **2400** (180°).
2. Move the servo to 0 and to 180 degrees.
3. If it **hums or jitters** at an end, it is hitting the end stop: make the range smaller (increase the 0° value or decrease the 180° value).
4. If it turns **too little**, make the range wider (decrease the 0° value or increase the 180° value).

> ⚠️ Do not let the servo hum against the end stop for long – it gets hot and may break.

Without this block, **750** and **2250** µs apply.
