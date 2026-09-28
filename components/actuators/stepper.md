---
id: actuator_stepper
blockCategory: Aktionen
subCategory: "Motor"
label: "🔄 Schrittmotor"
label_en: "🔄 Stepper motor"
colour: "#DC2626"
tooltip: "Dreht einen 28BYJ-48 Schrittmotor um einen Winkel nach rechts oder links"
tooltip_en: "Turns a 28BYJ-48 stepper motor by an angle to the right or left"
blockType: statement
inline: false
inputs:
  - label: "🔄 Schrittmotor  Anschluss 1:"
    label_en: "🔄 Stepper motor  connector 1:"
    name: PORTA
    fieldType: grove_dropdown
    groveRole: 2pin
  - label: "Anschluss 2:"
    label_en: "connector 2:"
    name: PORTB
    fieldType: grove_dropdown
    groveRole: 2pin
    newRow: true
  - label: "Drehe"
    label_en: "Turn"
    name: GRAD
    fieldType: number_field
    default: 90
    min: 0
    max: 360
    newRow: true
  - label: "Grad"
    label_en: "degrees"
    name: DIR
    fieldType: direction_dropdown
hardware:
  commonName: "28BYJ-48 + ULN2003"
  verbrauch3j: 120
  kitStandard: false
legacyGenerator: true
---

# Schrittmotor (28BYJ-48 + ULN2003)

Dreht einen 28BYJ-48 Schrittmotor präzise um einen Winkel. Eine volle Umdrehung
entspricht 4096 Halbschritten (Motor mit 1:64-Getriebe).

## Verdrahtung

Der ULN2003-Treiber hat vier Eingänge **IN1–IN4**, angesteuert über zwei Grove-Ports:

- **Anschluss 1** → IN1 (Pin 1) und IN2 (Signalpin)
- **Anschluss 2** → IN3 (Pin 1) und IN4 (Signalpin)

> **5 V Versorgung:** Die Grove-Ports liefern nur ein 3,3-V-Signal. Die
> Stromversorgung (**5 V + GND**) des ULN2003 wird extern vom **Servo-Header**
> des Boards abgegriffen. Generator: siehe `js/generator.js`.

## Foto-Anleitung

So sieht das komplette Set aus Treiberboard und 28BYJ-48-Schrittmotor aus:

![Treiberboard und 28BYJ-48-Schrittmotor mit Verbindungskabel](../images/stepper_uebersicht.jpg)

Die beiden Grove-Kabel (Anschluss 1 und Anschluss 2) werden an zwei benachbarte Grove-Ports des Boards angeschlossen:

![Zwei Grove-Kabel an benachbarten Grove-Ports des Boards](../images/stepper_verkabelung_1.jpg)

Die Kabel führen gemeinsam zum Eingangsstecker des ULN2003-Treiberboards. Die Motorspannung (5–12 V) kommt separat über die Schraubklemme:

![Grove-Kabel am Eingangsstecker des ULN2003-Treiberboards](../images/stepper_verkabelung_2.jpg)

Auf der anderen Seite des Treiberboards führt die Leitung weiter zum Schrittmotor:

![Ausgangsseite des Treiberboards zum Schrittmotor](../images/stepper_verkabelung_3.jpg)

<!-- lang:en -->

# Stepper motor (28BYJ-48 + ULN2003)

Turns a 28BYJ-48 stepper motor precisely by an angle. One full revolution
equals 4096 half steps (motor with 1:64 gearbox).

## Wiring

The ULN2003 driver has four inputs **IN1–IN4**, driven via two Grove ports:

- **Connector 1** → IN1 (pin 1) and IN2 (signal pin)
- **Connector 2** → IN3 (pin 1) and IN4 (signal pin)

> **5 V supply:** the Grove ports only provide a 3.3 V signal. The power
> supply (**5 V + GND**) of the ULN2003 is taken externally from the board's
> **servo header**. Generator: see `js/generator.js`.

## Photo guide

This is the complete set of driver board and 28BYJ-48 stepper motor:

![Driver board and 28BYJ-48 stepper motor with connecting cable](../images/stepper_uebersicht.jpg)

Both Grove cables (connector 1 and connector 2) are plugged into two neighboring Grove ports on the board:

![Two Grove cables on neighboring Grove ports of the board](../images/stepper_verkabelung_1.jpg)

The cables lead together to the input connector of the ULN2003 driver board. The motor voltage (5–12 V) comes in separately via the screw terminal:

![Grove cables at the input connector of the ULN2003 driver board](../images/stepper_verkabelung_2.jpg)

On the other side of the driver board, the wiring continues to the stepper motor:

![Output side of the driver board to the stepper motor](../images/stepper_verkabelung_3.jpg)
