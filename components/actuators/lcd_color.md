---
id: actuator_lcd_color
blockCategory: Anzeigen
subCategory: ""
label: "📟 LCD Farbe"
label_en: "📟 LCD colour"
colour: "#0D9488"
tooltip: "Setzt die Hintergrundfarbe des Grove-LCD – ohne den Text zu ändern"
tooltip_en: "Sets the background colour of the Grove LCD – without changing the text"
blockType: statement
inline: false
inputs:
  - label: "📟 LCD Farbe  Port:"
    label_en: "📟 LCD colour  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
  - label: "Farbe:"
    label_en: "Colour:"
    name: COLOR
    fieldType: rgb_color_dropdown
hardware:
  commonName: "Grove-LCD RGB Backlight"
  verbrauch3j: 0
  kitStandard: false
  width_mm: 80
  height_mm: 40
legacyGenerator: true
---

# Grove-LCD RGB Backlight – Farbe (I2C)

Stellt nur die Hintergrundbeleuchtung farbig ein. Lässt den angezeigten Text **unverändert** –
den Text setzt der Block „📟 LCD Text".
> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V).

<!-- lang:en -->

# Grove LCD RGB Backlight – colour (I2C)

Only sets the coloured backlight. Leaves the displayed text **unchanged** –
the text is set by the "📟 LCD text" block.
> Needs `lib/grove_rgb_lcd.py` on `CIRCUITPY/lib/`. Supports Grove LCD RGB Backlight V5 (3.3 V).
