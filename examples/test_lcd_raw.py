# test_lcd_raw.py – LCD-Text OHNE Bibliothek testen (reine HD44780-Sequenz)
#
# Schließt aus, ob eine veraltete grove_rgb_lcd.py das Problem ist.
# Als code.py auf das CIRCUITPY-Laufwerk kopieren und seriellen Monitor lesen.
# Grove 4: SCL=GP17, SDA=GP16  (bei anderem Port unten anpassen)

import time
import board
import busio

i2c = busio.I2C(board.GP17, board.GP16)
TEXT_ADDR = 0x3E


def _w(reg, val):
    while not i2c.try_lock():
        pass
    try:
        i2c.writeto(TEXT_ADDR, bytes([reg, val]))
    finally:
        i2c.unlock()


def cmd(c):
    _w(0x80, c)     # Befehl


def data(c):
    _w(0x40, c)     # Zeichen


# --- Robuste HD44780-Init ---
time.sleep(0.05)
cmd(0x28); time.sleep(0.005)
cmd(0x28); time.sleep(0.0002)
cmd(0x28)
cmd(0x28)          # Function set: 2 Zeilen, 5x8
cmd(0x0C)          # Display an
cmd(0x01)          # löschen
time.sleep(0.002)
cmd(0x06)          # Entry mode
time.sleep(0.002)

print("Schreibe 'HALLO 12345' ...")
for ch in "HALLO 12345":
    data(ord(ch))
    time.sleep(0.001)
print("Fertig. Steht jetzt Text auf dem Display?")
