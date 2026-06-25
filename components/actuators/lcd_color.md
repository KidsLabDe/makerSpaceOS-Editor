---
id: actuator_lcd_color
blockCategory: Anzeigen
subCategory: ""
label: "📟 LCD Farbe"
colour: "#0D9488"
tooltip: "Setzt die Hintergrundfarbe des Grove-LCD – ohne den Text zu ändern"
blockType: statement
inline: false
inputs:
  - label: "📟 LCD Farbe  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
  - label: "Farbe:"
    name: COLOR
    fieldType: rgb_color_dropdown
hardware:
  commonName: "Grove-LCD RGB Backlight"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Grove-LCD RGB Backlight – Farbe (I2C)

Stellt nur die Hintergrundbeleuchtung farbig ein. Lässt den angezeigten Text **unverändert** –
den Text setzt der Block „📟 LCD Text".
> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V).
