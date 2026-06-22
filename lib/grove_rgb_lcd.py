# grove_rgb_lcd.py – Grove-LCD RGB Backlight für CircuitPython
#
# Eigenständige, an CircuitPython (busio) angepasste Bibliothek.
# Unterstützt beide Hardware-Versionen des Grove-LCD RGB Backlight:
#   * V4.0 – RGB-Treiber PCA9633  @ I2C 0x62
#   * V5.0 – RGB-Treiber SGM31323 @ I2C 0x30
# Das Text-Display (JHD1313) liegt in beiden Fällen auf 0x3E.
#
# Verwendung:
#   import board, busio
#   from grove_rgb_lcd import GroveRgbLcd
#   i2c = busio.I2C(board.GP17, board.GP16)   # (scl, sda)
#   lcd = GroveRgbLcd(i2c, rgb_addr=0x62)      # 0x62 = V4, 0x30 = V5
#   lcd.set_rgb(0, 128, 64)
#   lcd.set_text("Hallo\nWelt")
#
# Diese Datei nach CIRCUITPY/lib/ kopieren.

import time

_TEXT_ADDR = 0x3E   # Text-Controller (JHD1313), versionsunabhängig


class GroveRgbLcd:
    def __init__(self, i2c, rgb_addr=0x62):
        self._i2c = i2c
        self._rgb_addr = rgb_addr

        # --- Text-Display initialisieren ---
        time.sleep(0.05)
        self._cmd(0x28)        # Function set: 2 Zeilen, 5x8 Punkte
        self._cmd(0x0C)        # Display an, kein Cursor, kein Blinken
        self._cmd(0x01)        # Display löschen
        time.sleep(0.002)
        self._cmd(0x06)        # Entry mode: Adresse hochzählen

        # --- Hintergrundbeleuchtung initialisieren (versionsabhängig) ---
        if rgb_addr == 0x30:           # V5.0 – SGM31323
            self._reg(0x00, 0x07)      # Reset
            self._reg(0x04, 0x15)      # LED-Ausgänge aktivieren
        else:                          # V4.0 – PCA9633
            self._reg(0x00, 0x00)      # MODE1
            self._reg(0x01, 0x00)      # MODE2
            self._reg(0x08, 0xAA)      # LEDOUT: alle Kanäle PWM-gesteuert

        self.set_rgb(255, 255, 255)

    # --- Low-Level I2C ---
    def _write(self, addr, reg, val):
        while not self._i2c.try_lock():
            pass
        try:
            self._i2c.writeto(addr, bytes([reg, val & 0xFF]))
        finally:
            self._i2c.unlock()

    def _cmd(self, value):
        self._write(_TEXT_ADDR, 0x80, value)

    def _reg(self, reg, value):
        self._write(self._rgb_addr, reg, value)

    # --- Öffentliche API ---
    def set_rgb(self, r, g, b):
        if self._rgb_addr == 0x30:     # V5.0
            self._reg(0x06, r)
            self._reg(0x07, g)
            self._reg(0x08, b)
        else:                          # V4.0
            self._reg(0x04, r)
            self._reg(0x03, g)
            self._reg(0x02, b)

    def clear(self):
        self._cmd(0x01)
        time.sleep(0.002)

    def set_text(self, text):
        self.clear()
        self._cmd(0x0C)                # Display an
        self._cmd(0x28)                # 2 Zeilen
        count = 0
        row = 0
        for c in str(text):
            if c == '\n' or count == 16:
                count = 0
                row += 1
                if row == 2:
                    break
                self._cmd(0xC0)        # Sprung in Zeile 2
                if c == '\n':
                    continue
            count += 1
            self._write(_TEXT_ADDR, 0x40, ord(c))
