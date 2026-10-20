---
id: actuator_taste
blockCategory: Aktionen
subCategory: Tastatur
requiresBoardFeature: usbHid
label: "⌨️ Taste"
label_en: "⌨️ Key"
colour: "#DC2626"
tooltip: "Das Board tut so, als wäre es eine Tastatur, und drückt eine Taste am Computer"
tooltip_en: "The board pretends to be a keyboard and presses a key on the computer"
blockType: statement
inline: true
inputs:
  - label: "⌨️ Taste"
    label_en: "⌨️ Key"
    name: KEY
    fieldType: options_dropdown
    options:
      - label: "⬆️ Pfeil hoch"
        label_en: "⬆️ arrow up"
        value: "0x52"
      - label: "⬇️ Pfeil runter"
        label_en: "⬇️ arrow down"
        value: "0x51"
      - label: "⬅️ Pfeil links"
        label_en: "⬅️ arrow left"
        value: "0x50"
      - label: "➡️ Pfeil rechts"
        label_en: "➡️ arrow right"
        value: "0x4F"
      - label: "␣ Leertaste"
        label_en: "␣ space"
        value: "0x2C"
      - label: "↵ Enter"
        label_en: "↵ Enter"
        value: "0x28"
      - label: "W"
        value: "0x1A"
      - label: "A"
        value: "0x04"
      - label: "S"
        value: "0x16"
      - label: "D"
        value: "0x07"
  - name: MODE
    fieldType: options_dropdown
    options:
      - label: "kurz drücken"
        label_en: "tap"
        value: tippen
      - label: "gedrückt halten"
        label_en: "hold down"
        value: halten
      - label: "loslassen"
        label_en: "release"
        value: los
hardware:
  commonName: "USB-Tastatur (eingebaut, über das USB-Kabel)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Taste drücken (USB-Tastatur)

Das Board meldet sich am Computer auch als **Tastatur**. Mit diesem Block drückt
es eine Taste – so wird der GamePadPico zum Gamecontroller für Spiele im Browser
oder Minecraft.

- **kurz drücken** – einmal tippen
- **gedrückt halten** – Taste bleibt unten (z. B. zum Laufen), bis „loslassen" kommt
- **loslassen** – gehaltene Taste wieder lösen

Beispiel: „Wenn Pfeil links berührt → Taste ⬅️ gedrückt halten", und in einer
Schleife loslassen, sobald das Feld nicht mehr berührt wird.

> Vorsicht: Die Tasten landen in dem Fenster, das gerade vorne ist – auch im Editor!

<!-- lang:en -->

# Press key (USB keyboard)

The board also shows up on the computer as a **keyboard**. With this block it
presses a key – turning the GamePadPico into a game controller for browser games
or Minecraft.

- **tap** – press once
- **hold down** – the key stays down (e.g. for walking) until "release"
- **release** – let go of a held key

Example: "When arrow left touched → hold down ⬅️", and in a loop release it as
soon as the pad is no longer touched.

> Careful: the keys go to whichever window is in front – including the editor!
