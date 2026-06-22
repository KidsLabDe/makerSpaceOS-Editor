---
id: actuator_lcd
blockCategory: Anzeige
subCategory: ""
label: "📟 LCD anzeigen"
colour: "#00838F"
tooltip: "Zeigt Text auf dem Grove-LCD RGB Backlight an und setzt die Hintergrundfarbe"
blockType: statement
inline: false
inputs:
  - label: "📟 LCD anzeigen  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
  - label: "Version:"
    name: VERSION
    fieldType: lcd_version_dropdown
  - label: "Farbe:"
    name: COLOR
    fieldType: colour_picker
    default: "#ffffff"
valueInputs:
  - name: TEXT
    label: "Text"
    check: String
hardware:
  commonName: "Grove-LCD RGB Backlight"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Grove-LCD RGB Backlight (I2C)

Zeigt bis zu zwei Zeilen Text an und stellt die Hintergrundbeleuchtung farbig ein.
Wähle die **Version** passend zu deinem Display (V4 = ältere Platine, V5 = neuere).

> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Generator: siehe `js/generator.js`.
