---
id: actuator_mouse_scroll
blockCategory: Aktionen
component: mouse
subCategory: Maus
requiresBoardFeature: usbHid
advanced: true
label: "Mausrad"
label_en: "mouse wheel"
colour: "#DC2626"
tooltip: "Dreht das Mausrad: positive Zahl = nach oben, negative = nach unten"
tooltip_en: "Turns the mouse wheel: positive = up, negative = down"
blockType: statement
inline: true
valueInputs:
  - name: STEPS
    label: "Mausrad drehen"
    label_en: "turn mouse wheel"
    defaultValue: 1
hardware:
  commonName: "USB-Maus (eingebaut, über das USB-Kabel)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Mausrad drehen (USB-Maus)

Scrollt am Computer: **positive** Zahlen nach oben, **negative** nach unten.
In einer Schleife kurz warten, sonst rast die Seite davon.

<!-- lang:en -->

# Turn mouse wheel (USB mouse)

Scrolls on the computer: **positive** numbers up, **negative** numbers down.
Wait briefly inside loops, otherwise the page races away.
