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
  - label: "Version:"
    name: VERSION
    fieldType: lcd_version_dropdown
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
Wähle die **Version** passend zu deinem Display (V4 = ältere Platine, V5 = neuere).

> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Generator: siehe `js/generator.js`.
>
> **Achtung Spannung:** Die Grove-Ports des Maker-Pi liefern **3,3 V**. Der **V4**-LCD
> ist 5-V-only – an 3,3 V geht die Beleuchtung, aber der Text bleibt leer. Nimm ein
> **V5**-Display (3,3 V) oder versorge das V4 separat mit 5 V.
