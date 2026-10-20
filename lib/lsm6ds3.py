# lsm6ds3.py – kleiner Treiber für den Beschleunigungssensor im LSM6DS3TR-C
# (GamePadPico: I2C an GP6/GP7, Adresse 0x6A). Ohne Abhängigkeiten, nur
# busio.I2C. Der Gyroskop-Teil bleibt aus.
#
#   imu = LSM6DS3(i2c)
#   imu.acceleration   # (x, y, z) in m/s², in Ruhe z ≈ 9,81
#
# Lesefehler (OSError) liefern den letzten gültigen Wert, damit ein
# Kinderprogramm nicht abstürzt.

import time

_REG_WHO_AM_I = 0x0F
_REG_CTRL1_XL = 0x10   # Datenrate + Messbereich Beschleunigung
_REG_CTRL3_C = 0x12
_REG_STATUS = 0x1E     # Bit 0: neuer Beschleunigungswert da
_REG_OUTX_L_XL = 0x28  # 6 Byte: X, Y, Z (Little Endian, mit Vorzeichen)

_WHO_AM_I = (0x6A, 0x69)   # LSM6DS3TR-C bzw. älterer LSM6DS3
_CTRL1_XL = 0b0100_1000    # 104 Hz, ±4 g
_CTRL3_C = 0b0100_0100     # BDU (Werte konsistent lesen), Adresse auto-inkrement
_MS2_PRO_LSB = 0.122e-3 * 9.80665   # ±4 g: 0,122 mg pro LSB


class LSM6DS3:
    def __init__(self, i2c, addr=0x6A):
        self._i2c = i2c
        self._addr = addr
        self._buf = bytearray(6)
        self._last = (0.0, 0.0, 9.81)
        if self._read(_REG_WHO_AM_I, 1)[0] not in _WHO_AM_I:
            raise RuntimeError("LSM6DS3 nicht gefunden")
        self._write(_REG_CTRL3_C, _CTRL3_C)
        self._write(_REG_CTRL1_XL, _CTRL1_XL)
        # Auf den ersten Messwert warten (~10 ms bei 104 Hz) – sonst liefert
        # die erste Abfrage (0, 0, 0)
        ende = time.monotonic() + 0.1
        while not self._read(_REG_STATUS, 1)[0] & 1 and time.monotonic() < ende:
            pass

    def _write(self, reg, val):
        while not self._i2c.try_lock():
            pass
        try:
            self._i2c.writeto(self._addr, bytes((reg, val)))
        finally:
            self._i2c.unlock()

    def _read(self, reg, n):
        buf = memoryview(self._buf)[:n]
        while not self._i2c.try_lock():
            pass
        try:
            self._i2c.writeto_then_readfrom(self._addr, bytes((reg,)), buf)
        finally:
            self._i2c.unlock()
        return buf

    @property
    def acceleration(self):
        """Beschleunigung (x, y, z) in m/s²."""
        try:
            b = self._read(_REG_OUTX_L_XL, 6)
            werte = []
            for i in (0, 2, 4):
                v = b[i] | b[i + 1] << 8
                if v & 0x8000:
                    v -= 0x10000
                werte.append(v * _MS2_PRO_LSB)
            self._last = tuple(werte)
        except OSError:
            pass
        return self._last

    def deinit(self):
        # Sensor schlafen legen; der Bus gehört dem Aufrufer und ist beim
        # Aufräumen (PIN_RESET_PRELUDE) evtl. schon freigegeben.
        try:
            self._write(_REG_CTRL1_XL, 0)
        except Exception:
            pass
