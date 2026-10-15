# RoboBuddy (Powerboard Rev 0.2 + ESP32-C6-Zero)

Anleitung für den **MF26 Robo-Buddy** mit Power-Trägerplatine Rev 0.2 und Waveshare **ESP32-C6-Zero** – Board-Profil `robobuddy` im Editor. Die Arduino-Firmware des Robo-Buddy ist ein eigenes Projekt; hier geht es nur um CircuitPython + makerSpaceOS.

## Flashen

Der C6-Zero hat **8 MB Flash** und wird mit dem generischen CircuitPython-Build **„ESP32-C6-DevKitC-1-N8"** betrieben (gleiche WS2812 an GPIO8). Einen eigenen Build für den C6-Zero gibt es nicht.

1. Build von [circuitpython.org/board/espressif_esp32c6_devkitc_1_n8](https://circuitpython.org/board/espressif_esp32c6_devkitc_1_n8/) herunterladen (`.bin`, Sprache `de_DE`, getestet mit 10.3.1).
2. esptool setzt das Board über USB-Serial-JTAG normalerweise selbst in den Download-Modus. Klappt das nicht: **BOOT gedrückt halten, RESET kurz drücken**, BOOT loslassen.
3. Flashen (`pipx install esptool`; Port unter Linux meist `/dev/ttyACM0`, am Mac `/dev/tty.usbmodem*`):

   ```bash
   esptool --port /dev/ttyACM0 erase-flash
   esptool --port /dev/ttyACM0 write-flash -z 0x0 adafruit-circuitpython-espressif_esp32c6_devkitc_1_n8-de_DE-10.3.1.bin
   ```

4. RESET drücken. Im Editor verbinden – das Board wird automatisch als RoboBuddy erkannt (`board_id: espressif_esp32c6_devkitc_1_n8`).

## Bibliotheken

Der C6 hat nur USB-Serial-JTAG: **kein CIRCUITPY-Laufwerk** und **kein UF2**. Dafür ist das Dateisystem aus Python beschreibbar. Der Button **„Libs prüfen"** liest nach dem Verbinden die Versionsdatei über die serielle Schnittstelle; bei „Jetzt aktualisieren" überträgt er den kompletten `lib/`-Ordner (~200 KB, etwa 35 s) und startet die Python-VM neu (`supervisor.reload()`). Der UF2-Button ist bei diesem Board ausgeblendet.

CLI-Alternative: Thonny (Dateibrowser über die REPL) oder `mpremote`-ähnliche Werkzeuge, Ziel `/lib/`.

## Pin-Namen

Das `board`-Modul des DevKitC-Builds kennt **GPIO14 nicht** (I²C-SDA des Powerboards) und nennt GPIO16/17 `TX`/`RX`; Attribute lassen sich nicht nachrüsten. Der Generator schreibt deshalb auf diesem Board `from robobuddy import board` statt `import board` (Profil-Feld `boardModule`). `lib/robobuddy.py` baut daraus ein Objekt mit allen `IO0 … IO30` plus `SDA`, `SCL`, `SERVO_EN`, `SERVO1 … SERVO4`.

## Anschlüsse

| Anschluss | Pins | Stecker | Für |
|---|---|---|---|
| A0 / A1 / A2 | IO0 / IO1 / IO2 (1 kΩ in Serie) | **GND, 3V3, SIG** | Sensoren, LEDs, Buzzer – analog und digital |
| A0+A1 / A1+A2 | zwei SIG-Leitungen | – | 2-Pin-Geräte: TM1637, Drehgeber, HC-SR04 (3,3-V-Variante) |
| I2C 1 / I2C 2 | SDA IO14, SCL IO22 | GND, 3V3, SDA, SCL | LCD, ICM20948 – derselbe Bus wie der INA226 |
| S1 … S4 | IO19, IO18, IO16, IO17 | S, +, − (5 V) | Servos; **S1 = rechtes, S2 = linkes Rad** (Blick von hinten) |

Die Leisten sind **keine Grove-Buchsen**: Grove-Module brauchen ein Grove-auf-Dupont-Kabel, und bei A0–A2 ist die Reihenfolge anders als bei Grove.

## Servos und Akku

- Die Servo-Schiene hat einen eigenen 5-V-Boost, eingeschaltet über **SERVO_EN (IO15)**. Er läuft nur, wenn **eine Zelle steckt** – auch an USB. Der Generator schaltet ihn bei jedem Servo-/Fahren-/Matrix-Block ein (`servo_strom(True)`); nach Programmende, Stopp oder Absturz schaltet ihn `makerspaceos.beim_beenden` wieder ab.
- Servo-PWM startet mit `duty_cycle=0` (kein Puls) – sonst ruckt ein Dauerdreh-Servo beim Start los.
- **Fahren** nutzt S2 (links) und S1 (rechts, gespiegelt) mit `ContinuousServo` mit 1050–1950 µs und eine Rampe von 200 ms (`robobuddy.fahren`). Gemessen ohne Räder: Vollgas vorwärts kostet gut 200 mA.
- **Akku-Wächter**: Jedes Programm auf diesem Board startet `akku_waechter()` als Hintergrund-Aufgabe: Warnung unter 3,6 V, 5 s am Stück unter 3,5 V (unter Last 3,3 V) → Servos aus, Tiefschlaf. Ohne Zelle pendelt die Lader-Spannung zwischen 4,1 und 4,4 V – der Wächter erkennt das an der Streuung (> 80 mV) und meldet nur „Kein Akku erkannt".
- Restlücke: Ist das Programm beendet und das Board steht in der REPL, schützt nichts die Zelle (bis zur DW01-Abschaltung bei 2,4 V). Darum im Workshop: **Schalter auf AUS, wenn du fertig bist.**

## Display

GC9A01, 240 × 240, rund, SPI an IO4/IO5 (SCK/MOSI), DC IO20, CS IO21, RST IO3, 40 MHz. Treiber `lib/gc9a01.py`, Gesichter/Text in `lib/robo_display.py` (`vectorio` + `adafruit_display_text`). Das Display bleibt im Modul `robo_display` über mehrere „Ausführen" initialisiert; nach Programmende zeigt CircuitPython wieder die Konsole.

## PWM-Kanäle

Der ESP32-C6 hat 6 LEDC-Kanäle und 4 Timer. Die 4 Servos (50 Hz) teilen sich einen Timer; dazu passen **höchstens 2** weitere Ausgänge mit eigener Frequenz (Buzzer, PWM-Block). Der dritte meldet „Conflicting settings for shared resource".
