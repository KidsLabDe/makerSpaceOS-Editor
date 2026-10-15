# ina226.py – kleiner Treiber für den Strom-/Spannungsmesser INA226
# (RoboBuddy-Powerboard: Adresse 0x45, Shunt 10 mΩ zwischen Zelle und
# Verbrauchern). Ohne Abhängigkeiten, nur busio.I2C.
#
#   ina = INA226(i2c)
#   ina.spannung     # Zellspannung in V
#   ina.strom_ma     # Zellstrom in mA, roh: positiv = Entladen, negativ = Laden
#
# Lesefehler (OSError, z. B. Wackelkontakt) liefern den letzten gültigen Wert,
# damit ein Kinderprogramm nicht abstürzt.

# Mittelung 16, Wandlungszeit 1,1 ms für Shunt und Bus, kontinuierlich
# (Bit 14 ist laut Datenblatt immer 1) → ein neuer Wert etwa alle 35 ms.
_CONFIG = 0x4000 | (0b010 << 9) | (0b100 << 6) | (0b100 << 3) | 0b111

_REG_CONFIG = 0x00
_REG_SHUNT = 0x01   # 2,5 µV/LSB, vorzeichenbehaftet
_REG_BUS = 0x02     # 1,25 mV/LSB


class INA226:
    def __init__(self, i2c, addr=0x45, shunt_ohm=0.010):
        self._i2c = i2c
        self._addr = addr
        self._shunt = shunt_ohm
        self._buf = bytearray(2)
        self._v = 0.0
        self._i = 0.0
        self._write(_REG_CONFIG, _CONFIG)

    def _write(self, reg, val):
        while not self._i2c.try_lock():
            pass
        try:
            self._i2c.writeto(self._addr, bytes((reg, val >> 8, val & 0xFF)))
        finally:
            self._i2c.unlock()

    def _read(self, reg):
        while not self._i2c.try_lock():
            pass
        try:
            self._i2c.writeto_then_readfrom(self._addr, bytes((reg,)), self._buf)
        finally:
            self._i2c.unlock()
        return self._buf[0] << 8 | self._buf[1]

    @property
    def spannung(self):
        """Zellspannung in Volt."""
        try:
            self._v = self._read(_REG_BUS) * 1.25e-3
        except OSError:
            pass
        return self._v

    @property
    def strom_ma(self):
        """Zellstrom in mA (positiv = Entladen, negativ = Laden)."""
        try:
            raw = self._read(_REG_SHUNT)
            if raw & 0x8000:
                raw -= 0x10000
            self._i = raw * 2.5e-6 / self._shunt * 1000
        except OSError:
            pass
        return self._i

    def deinit(self):
        # Der Bus gehört dem Aufrufer (geteilt mit anderen Geräten) –
        # hier gibt es nichts freizugeben.
        self._i2c = None
