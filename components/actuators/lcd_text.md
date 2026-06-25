---
id: actuator_lcd_text
blockCategory: Anzeigen
subCategory: ""
label: "📟 LCD Text"
colour: "#0D9488"
tooltip: "Zeigt zwei Zeilen Text auf dem Grove-LCD an – ohne die Farbe zu ändern"
blockType: statement
inline: false
inputs:
  - label: "📟 LCD Text  Port:"
    name: PORT
    fieldType: grove_dropdown
    groveRole: i2c
valueInputs:
  - name: LINE1
    label: "Zeile 1"
    check: String
    defaultValue: "Hallo"
  - name: LINE2
    label: "Zeile 2"
    check: String
    defaultValue: "Welt"
hardware:
  commonName: "Grove-LCD RGB Backlight"
  verbrauch3j: 0
  kitStandard: false
legacyGenerator: true
---

# Grove-LCD RGB Backlight – Text (I2C)

Zeigt bis zu zwei Zeilen Text an (je 16 Zeichen). Ändert die Hintergrundfarbe **nicht** –
dafür gibt es den Block „📟 LCD Farbe".
> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V).
