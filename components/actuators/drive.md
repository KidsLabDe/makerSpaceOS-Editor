---
id: actuator_drive
blockCategory: Aktionen
subCategory: Fahren
requiresBoardFeature: drive
label: "🚗 Fahren"
label_en: "🚗 Drive"
colour: "#DC2626"
tooltip: "Lässt den RoboBuddy fahren: vorwärts, rückwärts, drehen oder anhalten. Tempo 0 bis 100 %"
tooltip_en: "Makes the RoboBuddy drive: forward, backward, turn or stop. Speed 0 to 100 %"
blockType: statement
inline: true
inputs:
  - label: "🚗 Fahren"
    label_en: "🚗 Drive"
    name: DIR
    fieldType: options_dropdown
    options:
      - label: "vorwärts"
        label_en: "forward"
        value: vor
      - label: "rückwärts"
        label_en: "backward"
        value: zurueck
      - label: "links drehen"
        label_en: "turn left"
        value: links
      - label: "rechts drehen"
        label_en: "turn right"
        value: rechts
      - label: "stopp"
        label_en: "stop"
        value: stopp
valueInputs:
  - name: SPEED
    label: "Tempo"
    label_en: "speed"
    check: Number
    defaultValue: 50
    suffix: "%"
hardware:
  commonName: "2 Dauerdreh-Servos (RoboBuddy, S1 links / S2 rechts)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Fahren (RoboBuddy)

Steuert beide Räder des RoboBuddy gleichzeitig:

- **vorwärts / rückwärts** – beide Räder drehen gleich schnell
- **links drehen / rechts drehen** – die Räder drehen gegeneinander, der Roboter dreht sich auf der Stelle
- **stopp** – beide Räder halten an

**Tempo** geht von 0 bis 100 %. Der RoboBuddy fährt **sanft an und bremst sanft** (in 0,2 Sekunden) – das schont den Akku.

Der Block fährt so lange, bis ein anderer Fahren-Block kommt. Typisch: `Fahren vorwärts 50 %` → `warte 2 Sekunden` → `Fahren stopp`.

> Die Servos bekommen nur Strom, wenn ein **Akku** steckt – auch wenn USB angeschlossen ist. Ohne Akku läuft das Programm, aber nichts bewegt sich.
>
> Rechtes Rad = Servo-Anschluss **S1**, linkes Rad = **S2** (von hinten gesehen; die beiden Servos sind gespiegelt eingebaut, darum kümmert sich der Block).

<!-- lang:en -->

# Drive (RoboBuddy)

Controls both wheels of the RoboBuddy at the same time:

- **forward / backward** – both wheels turn at the same speed
- **turn left / turn right** – the wheels turn against each other, the robot spins on the spot
- **stop** – both wheels stop

**Speed** goes from 0 to 100 %. The RoboBuddy **starts and brakes gently** (within 0.2 seconds) – this protects the battery.

The block keeps driving until another drive block comes. Typical: `drive forward 50 %` → `wait 2 seconds` → `drive stop`.

> The servos only get power when a **battery** is plugged in – even with USB connected. Without a battery the program runs, but nothing moves.
>
> Right wheel = servo connector **S1**, left wheel = **S2** (seen from behind; the two servos are mounted mirrored, the block takes care of that).
