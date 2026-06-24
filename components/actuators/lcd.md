---
id: actuator_lcd
blockCategory: Anzeige
subCategory: ""
label: "📟 LCD anzeigen"
colour: "#E24D3D"
tooltip: "Zeigt Text auf dem Grove-LCD RGB Backlight an und setzt die Hintergrundfarbe"
blockType: statement
inline: false
inputs:
  - label: "📟 LCD anzeigen  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
  - label: "Farbe:"
    name: COLOR
    fieldType: rgb_color_dropdown
valueInputs:
  - name: TEXT
    label: "Text"
    check: String
    defaultValue: "Hallo"
hardware:
  commonName: "Grove-LCD RGB Backlight"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Grove-LCD RGB Backlight (I2C)

Zeigt bis zu zwei Zeilen Text an und stellt die Hintergrundbeleuchtung farbig ein.
> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V).
