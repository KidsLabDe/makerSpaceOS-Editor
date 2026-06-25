---
id: actuator_stepper
blockCategory: Aktionen
subCategory: "Motor"
label: "🔄 Schrittmotor"
colour: "#DC2626"
tooltip: "Dreht einen 28BYJ-48 Schrittmotor um einen Winkel nach rechts oder links"
blockType: statement
inline: false
inputs:
  - label: "🔄 Schrittmotor  Anschluss 1:"
    name: PORTA
    fieldType: grove_dropdown
    groveRole: 2pin
  - label: "Anschluss 2:"
    name: PORTB
    fieldType: grove_dropdown
    groveRole: 2pin
    newRow: true
  - label: "Drehe"
    name: GRAD
    fieldType: number_field
    default: 90
    min: 0
    max: 360
    newRow: true
  - label: "Grad"
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
