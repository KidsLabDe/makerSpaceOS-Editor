# grove_imu.py – Beschleunigungssensor für Grove-/Breakout-IMUs mit
# automatischer Chip-Erkennung. Nur busio.I2C nötig (für den ICM20948
# zusätzlich adafruit_icm20x + adafruit_register).
#
# Erkannt werden (Adresse 0x68 oder 0x69):
#   - MPU-Familie über WHO_AM_I (Register 0x75): MPU-6050, MPU-6500,
#     MPU-9250/9255 (Seeed Grove IMU 9DOF v2.0), ICM-20600/20602/20608/20689
#     (neuerer Seeed Grove IMU 9DOF). Alle haben dieselben Register für den
#     Beschleunigungsteil → eigener Mini-Treiber, Messbereich ±16 g.
#   - ICM20948 (Adafruit 4554) über Bank-0-Register 0x00 = 0xEA →
#     adafruit_icm20x, Messbereich ±16 g.
#
#   imu = GroveIMU(i2c)
#   imu.chip           # z. B. "MPU-9250"
#   imu.acceleration   # (x, y, z) in m/s², in Ruhe ≈ (0, 0, 9,81)
#
# Lesefehler (OSError, z. B. Wackelkontakt am Grove-Stecker beim Schütteln)
# liefern den letzten gültigen Wert, damit ein Kinderprogramm nicht abstürzt.

import time

_ADRESSEN = (0x68, 0x69)

# MPU-Familie: Register-Adressen
_REG_ACCEL_CONFIG = 0x1C
_REG_ACCEL_XOUT_H = 0x3B   # 6 Byte: X, Y, Z (Big Endian, mit Vorzeichen)
_REG_PWR_MGMT_1 = 0x6B
_REG_WHO_AM_I = 0x75

_MPU_IDS = {
    0x68: "MPU-6050",
    0x70: "MPU-6500",
    0x71: "MPU-9250",
    0x73: "MPU-9255",
    0x11: "ICM-20600",
    0x12: "ICM-20602",
    0xAF: "ICM-20608",
    0x98: "ICM-20689",
}

_ACCEL_16G = 0x18                  # Bits 4:3 = 11 → ±16 g
_MS2_PRO_LSB = 9.80665 / 2048      # ±16 g: 2048 LSB pro g

# ICM20948: Bank-Auswahl 0x7F, WHO_AM_I in Bank 0 an 0x00
_ICM20948_BANK_SEL = 0x7F
_ICM20948_WHO_AM_I = 0xEA


class GroveIMU:
    def __init__(self, i2c, address=None):
        self._i2c = i2c
        self._buf = bytearray(6)
        self._last = (0.0, 0.0, 9.81)
        self._icm = None
        self.chip = None
        adressen = (address,) if address is not None else _ADRESSEN
        vorhanden = self._scan()
        for addr in adressen:
            if vorhanden is not None and addr not in vorhanden:
                continue
            self._addr = addr
            if self._probe_mpu() or self._probe_icm20948():
                return
        raise RuntimeError("Kein Bewegungssensor gefunden (I2C-Adressen: %s)"
                           % ([hex(a) for a in vorhanden] if vorhanden else "keine"))

    # ── Erkennung ────────────────────────────────────────────────────────
    def _scan(self):
        while not self._i2c.try_lock():
            pass
        try:
            return self._i2c.scan()
        except OSError:
            return None
        finally:
            self._i2c.unlock()

    def _probe_mpu(self):
        try:
            name = _MPU_IDS.get(self._read(_REG_WHO_AM_I, 1)[0])
        except OSError:
            return False
        if name is None:
            return False
        self._write(_REG_PWR_MGMT_1, 0x80)   # Reset (Messbereich auf Standard)
        time.sleep(0.1)
        self._write(_REG_PWR_MGMT_1, 0x01)   # aufwecken, beste Taktquelle
        time.sleep(0.01)
        self._write(_REG_ACCEL_CONFIG, _ACCEL_16G)
        time.sleep(0.02)                     # erster Messwert
        self.chip = name
        return True

    def _probe_icm20948(self):
        try:
            self._write(_ICM20948_BANK_SEL, 0x00)
            if self._read(0x00, 1)[0] != _ICM20948_WHO_AM_I:
                return False
        except OSError:
            return False
        import adafruit_icm20x
        self._icm = adafruit_icm20x.ICM20948(self._i2c, address=self._addr)
        self._icm.accelerometer_range = adafruit_icm20x.AccelRange.RANGE_16G
        self.chip = "ICM20948"
        return True

    # ── I2C ──────────────────────────────────────────────────────────────
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

    # ── Messwerte ────────────────────────────────────────────────────────
    @property
    def acceleration(self):
        """Beschleunigung (x, y, z) in m/s²."""
        try:
            if self._icm is not None:
                self._last = tuple(self._icm.acceleration)
            else:
                b = self._read(_REG_ACCEL_XOUT_H, 6)
                werte = []
                for i in (0, 2, 4):
                    v = b[i] << 8 | b[i + 1]
                    if v & 0x8000:
                        v -= 0x10000
                    werte.append(v * _MS2_PRO_LSB)
                self._last = tuple(werte)
        except OSError:
            pass
        return self._last

    def deinit(self):
        # Der Bus gehört dem Aufrufer (gemeinsamer I2C-Bus) – hier nichts
        # freigeben, nur den MPU schlafen legen.
        if self._icm is None:
            try:
                self._write(_REG_PWR_MGMT_1, 0x40)
            except Exception:
                pass
