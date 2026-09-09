---
id: actuator_lcd_text
blockCategory: Anzeigen
subCategory: ""
label: "📟 LCD Text"
label_en: "📟 LCD text"
colour: "#0D9488"
tooltip: "Zeigt zwei Zeilen Text auf dem Grove-LCD an – ohne die Farbe zu ändern"
tooltip_en: "Shows two lines of text on the Grove LCD – without changing the colour"
blockType: statement
inline: false
inputs:
  - label: "📟 LCD Text  Port:"
    label_en: "📟 LCD text  port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
valueInputs:
  - name: LINE1
    label: "Zeile 1"
    label_en: "line 1"
    check: String
    defaultValue: "Hallo"
    defaultValue_en: "Hello"
  - name: LINE2
    label: "Zeile 2"
    label_en: "line 2"
    check: String
    defaultValue: "Welt"
    defaultValue_en: "World"
hardware:
  commonName: "Grove-LCD RGB Backlight"
  verbrauch3j: 0
  kitStandard: false
  width_mm: 80
  height_mm: 40
legacyGenerator: true
---

# Grove-LCD – Text (I2C)

Zeigt bis zu zwei Zeilen Text an (je 16 Zeichen). Ändert die Hintergrundfarbe **nicht** –
dafür gibt es den Block „📟 LCD Farbe".
> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight (V4/V5)
> **und** das Grove-16x2-LCD (Mono-Versionen, z. B. Schwarz/Gelb) – die Beleuchtung wird automatisch erkannt.

<!-- lang:en -->

# Grove LCD – text (I2C)

Shows up to two lines of text (16 characters each). Does **not** change the
background colour – that's what the "📟 LCD colour" block is for.
> Needs `lib/grove_rgb_lcd.py` on `CIRCUITPY/lib/`. Supports the Grove LCD RGB Backlight (V4/V5)
> **and** the Grove 16x2 LCD (monochrome variants, e.g. black on yellow) – the backlight is detected automatically.
