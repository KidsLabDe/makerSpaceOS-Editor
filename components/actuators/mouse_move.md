---
id: actuator_mouse_move
blockCategory: Aktionen
component: mouse
subCategory: Maus
requiresBoardFeature: usbHid
advanced: true
label: "Maus bewegen"
label_en: "move mouse"
colour: "#DC2626"
tooltip: "Bewegt den Mauszeiger am Computer um so viele Schritte"
tooltip_en: "Moves the mouse pointer on the computer by this many steps"
blockType: statement
inline: true
valueInputs:
  - name: DX
    label: "bewegen  rechts"
    label_en: "move  right"
    defaultValue: 10
  - name: DY
    label: "hoch"
    label_en: "up"
    defaultValue: 0
hardware:
  commonName: "USB-Maus (eingebaut, über das USB-Kabel)"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Maus bewegen (USB-Maus)

Das Board meldet sich am Computer auch als **Maus**. Der Block schiebt den
Mauszeiger ein Stück weiter: **rechts** und **hoch** in Pixeln, negative Zahlen
gehen nach links bzw. unten.

**Mit Joystick steuern:** In FÜR IMMER „Maus bewegen“ legen und bei *rechts*
„Joystick X-Achse ÷ 10“, bei *hoch* „Joystick Y-Achse ÷ 10“ einsetzen.
Eine größere Teilzahl macht den Zeiger langsamer.

> Vorsicht: Der Zeiger bewegt sich wirklich! Falls er nicht mehr zu bändigen ist:
> USB-Kabel ziehen.

<!-- lang:en -->

# Move mouse (USB mouse)

The board also shows up on the computer as a **mouse**. This block pushes the
pointer a bit further: **right** and **up** in pixels, negative numbers go left
or down.

**Steer with a joystick:** put “move mouse” into FOREVER and use
“joystick X axis ÷ 10” for *right* and “joystick Y axis ÷ 10” for *up*.
A bigger divisor makes the pointer slower.

> Careful: the pointer really moves! If you cannot control it any more:
> unplug the USB cable.
