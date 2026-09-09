# grove_rgb_lcd.py – Grove-LCD (Text + optionale RGB-Beleuchtung) für CircuitPython
#
# Eigenständige, an CircuitPython (busio) angepasste Bibliothek.
# Das Text-Display (HD44780 via JHD1313/JHD1802) liegt auf I2C 0x3E –
# auf ALLEN Varianten. Die Hintergrundbeleuchtung wird automatisch
# erkannt (wird nur gesucht, ist nie zwingend erforderlich):
#   * V4.0 – RGB-Treiber PCA9633  @ I2C 0x62
#   * V5.0 – RGB-Treiber SGM31323 @ I2C 0x30
#   * Grove-16x2-LCD (Mono-Versionen, z. B. Schwarz/Gelb) – gar kein
#     I2C-Beleuchtungstriever → Text-Modus, set_rgb() hat keine Wirkung
#
# Verwendung:
#   import board, busio
#   from grove_rgb_lcd import GroveRgbLcd
#   i2c = busio.I2C(board.GP17, board.GP16)   # (scl, sda)
#   lcd = GroveRgbLcd(i2c)                    # Beleuchtung wird automatisch erkannt
#   lcd.set_text("Hallo\nWelt")
#   lcd.set_rgb(0, 128, 64)   # greift nur, wenn ein RGB-Treiber gefunden wurde
#
# Diese Datei nach CIRCUITPY/lib/ kopieren.

import time

_TEXT_ADDR = 0x3E   # Text-Controller (JHD1313), versionsunabhängig


class GroveRgbLcd:
    def __init__(self, i2c, rgb_addr=None):
        self._i2c = i2c
        self._rgb_addr = None

        # --- Text-Display initialisieren (robuste HD44780-Sequenz) ---
        # Function set MUSS nach dem Einschalten mehrfach mit Wartezeiten kommen,
        # sonst bleibt die Anzeige leer (Beleuchtung geht trotzdem).
        time.sleep(0.05)       # >40 ms nach Power-on
        self._cmd(0x28)        # Function set: 2 Zeilen, 5x8 Punkte
        time.sleep(0.005)      # >4.1 ms
        self._cmd(0x28)
        time.sleep(0.0002)     # >100 µs
        self._cmd(0x28)
        self._cmd(0x28)        # endgültiges Function set
        self._cmd(0x0C)        # Display an, kein Cursor, kein Blinken
        self._cmd(0x01)        # Display löschen
        time.sleep(0.002)      # Clear braucht ~1.5 ms
        self._cmd(0x06)        # Entry mode: Adresse hochzählen
        time.sleep(0.002)

        # --- Hintergrundbeleuchtung: automatisch erkennen (oder explizit) ---
        # Das 16x2-LCD (Mono) hat keinen I2C-Beleuchtungstriever – das ist kein
        # Fehler: wir fallen auf Text-Modus zurück, set_rgb() hat dann keine
        # Wirkung. Die Beleuchtung dieser Displays ist fest angeschlossen.
        if rgb_addr is not None:
            self._init_backlight(rgb_addr)
        else:
            for _addr in (0x30, 0x62):      # erst V5, dann V4 versuchen
                if self._init_backlight(_addr):
                    break
        if self._rgb_addr is None:
            print("LCD: keine RGB-Beleuchtung gefunden – nur Text-Modus "
                  "(set_rgb hat keine Wirkung)")

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

    def _init_backlight(self, addr):
        """Initialisiert den Beleuchtungstriever auf `addr`.

        Liefert True bei Erfolg. Antwortet kein Gerät (z. B. 16x2-LCD ohne
        RGB-Treiber), wird False geliefert – statt einer OSError nach oben.
        """
        try:
            if addr == 0x30:           # V5.0 – SGM31323
                self._write(addr, 0x00, 0x07)  # Reset
                self._write(addr, 0x04, 0x15)  # LED-Ausgänge aktivieren
            else:                          # V4.0 – PCA9633
                self._write(addr, 0x00, 0x00)  # MODE1
                self._write(addr, 0x01, 0x00)  # MODE2
                self._write(addr, 0x08, 0xAA)  # LEDOUT: alle Kanäle PWM-gesteuert
        except OSError:
            self._rgb_addr = None
            return False
        self._rgb_addr = addr
        return True

    # --- Öffentliche API ---
    def set_rgb(self, r, g, b):
        if self._rgb_addr is None:     # keine RGB-Beleuchtung (z. B. 16x2-Mono-LCD)
            return
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
