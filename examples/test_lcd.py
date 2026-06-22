# test_lcd.py – Grove-LCD RGB Backlight isoliert testen
#
# So testen:
#   1. lib/grove_rgb_lcd.py nach CIRCUITPY/lib/ kopieren
#   2. Diese Datei als code.py auf das CIRCUITPY-Laufwerk kopieren
#   3. Seriellen Monitor öffnen (z.B. in CircuitBlox) und Ausgabe lesen
#
# Bei anderem Grove-Port die Pins unten anpassen (SCL = Pin 2, SDA = Pin 1):
#   Grove 1: GP1/GP0   Grove 2: GP3/GP2   Grove 3: GP5/GP4
#   Grove 4: GP17/GP16  Grove 6: GP27/GP26

import time
import board
import busio
from grove_rgb_lcd import GroveRgbLcd

# Grove 4 (Standard-I2C0): SCL=GP17, SDA=GP16
i2c = busio.I2C(board.GP17, board.GP16)

# 1) I2C-Bus scannen – zeigt, welche Geräte erkannt werden
while not i2c.try_lock():
    pass
addrs = i2c.scan()
i2c.unlock()
print("Gefundene I2C-Adressen:", [hex(a) for a in addrs])
print("Erwartet: 0x3e (Text) und 0x62 (V4) bzw. 0x30 (V5)")

if 0x3e not in addrs:
    print("FEHLER: Text-Controller 0x3e nicht gefunden -> Verkabelung/Port prüfen!")

# 2) Backlight-Version automatisch wählen
rgb_addr = 0x30 if 0x30 in addrs else 0x62
print("Verwende Backlight-Adresse:", hex(rgb_addr))

# 3) Display ansteuern
lcd = GroveRgbLcd(i2c, rgb_addr=rgb_addr)
lcd.set_rgb(0, 128, 64)          # türkise Beleuchtung
lcd.set_text("Hallo\nCircuitBlox")
print("Text gesendet – steht jetzt etwas auf dem Display?")
