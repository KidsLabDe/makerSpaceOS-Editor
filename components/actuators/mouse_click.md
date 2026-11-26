---
id: actuator_mouse_click
blockCategory: Aktionen
component: mouse
subCategory: Maus
requiresBoardFeature: usbHid
advanced: true
label: "Mausklick"
label_en: "mouse click"
colour: "#DC2626"
tooltip: "Drückt eine Maustaste am Computer"
tooltip_en: "Presses a mouse button on the computer"
blockType: statement
inline: true
inputs:
  - label: "Maustaste"
    label_en: "mouse button"
    name: BUTTON
    fieldType: options_dropdown
    options:
      - label: "links"
        label_en: "left"
        value: "1"
      - label: "rechts"
        label_en: "right"
        value: "2"
      - label: "Mitte"
        label_en: "middle"
        value: "4"
  - name: MODE
    fieldType: options_dropdown
    options:
      - label: "kurz klicken"
        label_en: "click"
        value: "tippen"
      - label: "gedrückt halten"
        label_en: "hold down"
        value: "halten"
      - label: "loslassen"
        label_en: "release"
        value: "los"
hardware:
  commonName: "USB-Maus (eingebaut, über das USB-Kabel)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Mausklick (USB-Maus)

- **kurz klicken** – einmal klicken
- **gedrückt halten** – Taste bleibt unten (z. B. zum Ziehen), bis „loslassen“ kommt
- **loslassen** – gehaltene Taste wieder lösen

Beispiel: „Wenn Joystick gedrückt → Maustaste links kurz klicken“. Beim Stoppen
des Programms werden gehaltene Tasten automatisch losgelassen.

<!-- lang:en -->

# Mouse click (USB mouse)

- **click** – click once
- **hold down** – the button stays down (e.g. for dragging) until “release”
- **release** – let go of a held button

Example: “when joystick pressed → click left mouse button”. Held buttons are
released automatically when the program stops.
