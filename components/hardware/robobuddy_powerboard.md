---
block: false
id: board_robobuddy
label: "RoboBuddy (Powerboard Rev 0.2)"
hardware:
  commonName: "MF26 Robo-Buddy, Power-Trägerplatine Rev 0.2 + Waveshare ESP32-C6-Zero"
---

# RoboBuddy (Powerboard Rev 0.2 + ESP32-C6-Zero)

Board-Profil `robobuddy` in `js/boards.js`. Hardware-Quelle: Repo
`KidsLabDe/Robo-Buddy-Makerfestival26`, Branch `powerboard`
(`POWERBOARD-HANDOFF.md`, `hardware/powerboard/tools/gen_sch.py`).

| GPIO | Funktion | Anschluss |
|---|---|---|
| 0 / 1 / 2 | Analog-Ports A0 / A1 / A2 (1 kΩ in Serie) | GND 3V3 SIG |
| 3 / 4 / 5 / 20 / 21 | Display RST / SCK / MOSI / DC / CS (GC9A01) | J4 |
| 14 / 22 | I²C SDA / SCL (4,7 kΩ Pull-ups, INA226 @ 0x45) | I2C 1/2: GND 3V3 SDA SCL |
| 15 | SERVO_EN (5-V-Boost, 100 kΩ Pull-down) | – |
| 19 / 18 / 16 / 17 | Servo S1 (rechtes Rad) / S2 (linkes Rad) / S3 / S4 | S + − |
| 8 | WS2812 auf dem C6-Zero | – |

Am Board geprüft (2026-10-15, CircuitPython 10.3.1, Build
`espressif_esp32c6_devkitc_1_n8`): INA226 antwortet an 0x45, Ladestrom
+200 mA (positiv = Laden), Display-Init + Farben, `rotaryio` auf jedem Paar
aus IO0–IO2, PWM: 4 × 50 Hz + 2 variable Frequenzen (der dritte meldet
„Conflicting settings for shared resource").
