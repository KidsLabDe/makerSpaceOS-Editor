# Handoff: Robo-Buddy-Powerboard (ESP32-C6-Zero) in makerSpaceOS

> **Umgesetzt** (2026-10-15) – aktueller Stand siehe `docs/robobuddy-c6.md`. Abweichungen zum Vorschlag unten: generischer Build ist der DevKitC-1-**N8** (8 MB), Pin-Namen über `from robobuddy import board`, Strom-Block positiv = Laden, 2-Pin-Geräte über Port-Paare A0+A1/A1+A2, Libs per Web Serial statt Thonny.

Auftrag für Claude Code: makerSpaceOS soll den **MF26 Robo-Buddy mit der Power-Trägerplatine Rev 0.2** als Board unterstützen. Gemeint sind Servos, rundes Display, Strom-/Spannungsmessung, Ladezustand und alle GPIOs des ESP32-C6-Zero, die über die Platine erreichbar sind.

Quelle: Repo `KidsLabDe/Robo-Buddy-Makerfestival26`, Branch **`powerboard`** (Stand Commit `08762d5`, Rev 0.2 bei JLCPCB im Warenkorb). Maßgeblich sind dort:

| Datei (Branch `powerboard`) | Inhalt |
|---|---|
| `POWERBOARD-HANDOFF.md` (Repo-Wurzel) | **Rev 0.2, aktuell.** Schaltungskonzept, Netze, GPIO-Tabelle, Firmware-Anforderungen |
| `hardware/powerboard/README.md` | Ports, Prüfungen, Bestellung, offene Punkte |
| `hardware/powerboard/tools/gen_sch.py` | Schaltplan als Code. Die GPIO-Zuordnung unten ist hier gegengeprüft (Sockel U4, Pins 1–18) |
| `hardware/esp32-c6-zero/README.md` + `ESP32-C6-Zero-Sch.pdf` | Waveshare-Board, Pinout, Stromversorgung |
| ~~`hardware/POWERBOARD-HANDOFF.md`~~ | **Veraltet (Rev 0.1, ESP32-C6 Super Mini, andere Pins).** Nicht verwenden |

Auftraggeber: Gregor (KidsLab). Zielgruppe der Blöcke: Kinder in Workshops. Akkusicherheit hat Vorrang.

---

## 1. Hardware in Kürze

- **MCU:** Waveshare ESP32-C6-Zero (ESP32-C6FH4, RISC-V 160 MHz, 4 MB Flash laut Wiki, 512 KB SRAM). Gesteckt auf 2 × Buchsenleiste 1×9. Onboard: WS2812 an GPIO8, BOOT-Taste an GPIO9, RESET, USB-C (USB-Serial-JTAG, **kein USB-OTG**).
- **Akku:** 1S-Pouch-LiPo an JST-PH J1, Verpolschutz, Zellschutz DW01A (Abschaltung bei 2,4 V oder ~6–8 A), Lader TP4056 (235 mA, aus USB), Schiebeschalter SW1.
- **Messung:** INA226 an I²C **0x45**, Shunt 10 mΩ zwischen Zelle und Verbrauchern. Misst Zellspannung und Zellstrom (**Laden = negativ**).
- **Servo-Schiene:** eigener 5-V-Boost TPS61023 (≥ 2 A), **eingeschaltet über GPIO15 (`SERVO_EN`, High = an, 100 kΩ Pull-down)**. Servos laufen **nur mit eingesteckter Zelle**, auch an USB. Ohne `SERVO_EN = High` bewegt sich kein Servo, der Code läuft aber fehlerfrei durch. Das ist die Fehlerquelle Nummer eins.
- **3V3** für Display, INA226 und alle Ports kommt vom LDO des ESP-Boards (800 mA). Für externe Sensoren bleiben ca. 300 mA.

## 2. GPIO-Belegung (vollständig)

Alle 15 GPIOs an den Leisten des C6-Zero sind auf der Platine belegt. Weitere GPIOs (6, 7, 12, 13, 23) liegen nur als Pads auf der Unterseite des ESP und sind über die Platine **nicht** erreichbar.

| GPIO | Sockel-Pin | Funktion auf dem Powerboard | Stecker / Aufdruck | Für makerSpaceOS |
|---|---|---|---|---|
| 0 | 4 | Analog-Port A0, 1 kΩ in Serie | J7: GND 3V3 SIG | Port „A0“: analog **und** digital (Ein-/Ausgang) |
| 1 | 5 | Analog-Port A1, 1 kΩ in Serie | J8: GND 3V3 SIG | Port „A1“, wie A0 |
| 2 | 6 | Analog-Port A2, 1 kΩ in Serie | J9: GND 3V3 SIG | Port „A2“, wie A0 |
| 3 | 7 | Display RST | J4 | nur Display-Blöcke |
| 4 | 8 | Display SCK (Aufdruck „SCL“) | J4 | nur Display-Blöcke |
| 5 | 9 | Display MOSI (Aufdruck „SDA“) | J4 | nur Display-Blöcke |
| 14 | 12 | I²C SDA, 4,7 kΩ Pull-up | J10, J11 (I2C 1/2) | I²C-Bus (geteilt mit INA226) |
| 15 | 13 | `SERVO_EN` → EN des Boosts | – | intern, vom Generator/Laufzeit gesteuert |
| 16 | 10 | Servo 3 (220 Ω), UART0 TX | J5: S + − | Servo S3 |
| 17 | 11 | Servo 4 (220 Ω), UART0 RX | J6: S + − | Servo S4 |
| 18 | 14 | Servo 2 rechts (220 Ω) | J3: S + − | Servo S2 |
| 19 | 15 | Servo 1 links (220 Ω) | J2: S + − | Servo S1 |
| 20 | 16 | Display DC | J4 | nur Display-Blöcke |
| 21 | 17 | Display CS | J4 | nur Display-Blöcke |
| 22 | 18 | I²C SCL, 4,7 kΩ Pull-up | J10, J11 | I²C-Bus |
| 8 | (ESP onboard) | WS2812 RGB-LED | – | Onboard-NeoPixel, `count: 1` |
| 9 | (ESP onboard) | BOOT-Taste (gegen GND) | – | Optional als Onboard-Taster, siehe 8.6 |

Port-Details:

- **Analog A0–A2:** 1×3, Reihenfolge **GND, 3V3, SIG** (nicht Grove-Reihenfolge, kein Grove-Stecker). ADC1, mit WLAN nutzbar, Messbereich ca. 0–3,1 V. Der 1-kΩ-Serienwiderstand stört digitale Sensoren, LEDs, DHT11, Grove-Ultraschall (Single-Pin) und NeoPixel-Daten nicht.
- **I²C 1/2:** 1×4 in **Grove-Reihenfolge GND, 3V3, SDA, SCL**, Pull-ups auf der Platine. Beide Leisten hängen am **selben Bus** wie der INA226.
- **Servo 1–4:** 1×3 **S, +, −**, Plus = 5 V vom Boost. **Nicht als allgemeine Digital-Ports anbieten**: Wer dort einen 3,3-V-Sensor ansteckt, legt 5 V an den Sensor und über dessen Ausgang an den GPIO.
- **Display J4:** 1×7 **VCC GND SCL SDA DC CS RST** für das GC9A01 (1,28", 240×240, rund), per Kabel.

## 3. CircuitPython auf dem C6-Zero (vor allem anderen klären)

Das ist der Punkt mit dem größten Risiko. Stand der Recherche:

1. **Für den Waveshare ESP32-C6-Zero gibt es meines Wissens keinen eigenen CircuitPython-Build.** Waveshare nennt nur ESP-IDF und Arduino. circuitpython.org führt andere C6-Boards (z. B. Waveshare ESP32-C6-LCD-1.47, Adafruit ESP32-C6 Feather, Espressif DevKitC-1). Am echten Board prüfen.
2. **Flash-Größe:** Das Wiki nennt C6FH4 (4 MB), die Produktseite teils C6FH8 (8 MB). Ein 8-MB-Build (z. B. DevKitC-1 N8) läuft auf 4 MB nicht. Chip mit `esptool.py flash_id` prüfen.
3. **Fremde Board-Builds können Pins ansteuern**, die auf dem Powerboard anders belegt sind. Der LCD-1.47-Build initialisiert z. B. sein eigenes Display. Vorher klären, welche Pins der jeweilige Build in `board_init` anfasst.
4. **Kein CIRCUITPY-Laufwerk** (der C6 hat nur USB-Serial-JTAG, kein USB-OTG). Folgen wie beim ESP32 D1 R32:
   - Der „Libs prüfen“-Button (`js/board_setup.js`) funktioniert nicht.
   - Der UF2-Button (`js/firmware_flash.js`) funktioniert nicht.
   - Libs kommen per **Komplett-Image** (`firmware/makerSpaceOS_firmware_robo-buddy-c6.bin`, per esptool bei 0x0) oder per Thonny nach `/lib/`.
   - Web Serial und Raw REPL im Editor laufen über USB-Serial-JTAG normal (in Chrome/Edge testen).
5. **Empfehlung:** eine **eigene CircuitPython-Board-Definition** `kidslab_robo_buddy_c6` (Fork, `ports/espressif/boards/`). Vorteile:
   - richtige Flash-Größe
   - eindeutige `board_id` für die Auto-Erkennung
   - sprechende Pin-Namen (`board.SERVO1`, `board.SERVO_EN`, `board.A0`, `board.SDA`/`SCL`, `board.TFT_*`, `board.NEOPIXEL`, `board.BUTTON`) und `board.I2C()`/`board.SPI()`
   - Libs als **Frozen Modules** (`makerspaceos`, `asyncio`, `adafruit_ticks`, `adafruit_motor`, `neopixel`, GC9A01-Treiber, INA226). Das löst das Lib-Problem ohne CIRCUITPY-Laufwerk.
   - `SERVO_EN` beim Boot fest auf Low

   Nachteil: Die Board-Definition muss jemand pflegen, bei jedem CircuitPython-Update neu bauen. **Alternative:** einen generischen C6-Build mit 4 MB nehmen und ein Komplett-Image ziehen wie beim D1 R32.
6. Pin-Namen im Profil (Abschnitt 4) hängen vom gewählten Build ab. Unten steht vorläufig `IOxx`. Mit `import board; dir(board)` am echten Board festlegen.

## 4. Board-Profil `robo_buddy_c6` (Vorschlag für `js/boards.js`)

```js
  // MF26 Robo-Buddy mit Power-Trägerplatine Rev 0.2 (KidsLab) und Waveshare
  // ESP32-C6-Zero. Quelle: Robo-Buddy-Makerfestival26, Branch powerboard.
  // Alle 15 Leisten-GPIO sind belegt. Frei nutzbar sind nur die Analog-Ports
  // A0–A2 (GPIO0–2, 1 kΩ in Serie) und der I²C-Bus (GPIO14/22, geteilt mit
  // dem INA226 @ 0x45). Servo-Plus = 5-V-Boost, nur an wenn SERVO_EN (GPIO15)
  // High ist UND eine Zelle steckt.
  // PIN-NAMEN VORLÄUFIG (IOxx) – hängen vom CircuitPython-Build ab.
  robo_buddy_c6: {
    name: 'Robo-Buddy (ESP32-C6)',
    neopixel:  { pin: 'IO8', count: 1 },          // WS2812 auf dem C6-Zero
    buzzer:    'IO2',                             // kein Onboard-Summer → offen, s. 8.5
    buttons:   {},                                // oder { BOOT: 'IO9' }, s. 8.6
    motors:    {},
    servos:    { S1: 'IO19', S2: 'IO18', S3: 'IO16', S4: 'IO17' },
    servoEnable: 'IO15',                          // NEU: Boost der Servo-Schiene
    battery:   null,                              // ersetzt durch powerMonitor
    powerMonitor: { chip: 'ina226', addr: 0x45, shuntOhm: 0.010 },   // NEU
    display:   { driver: 'gc9a01', width: 240, height: 240,          // NEU
                 sck: 'IO4', mosi: 'IO5', dc: 'IO20', cs: 'IO21', rst: 'IO3' },
    i2cBus:    { sda: 'IO14', scl: 'IO22' },     // NEU: ein gemeinsamer Bus
    grovePorts: [
      { id: 1, label: 'A0',    pin1: null,   signal: 'IO0',  analog: true,  i2c: false },
      { id: 2, label: 'A1',    pin1: null,   signal: 'IO1',  analog: true,  i2c: false },
      { id: 3, label: 'A2',    pin1: null,   signal: 'IO2',  analog: true,  i2c: false },
      { id: 4, label: 'I2C 1', pin1: 'IO14', signal: 'IO22', analog: false, i2c: true, digital: false },
      { id: 5, label: 'I2C 2', pin1: 'IO14', signal: 'IO22', analog: false, i2c: true, digital: false },
    ],
    externalPins: ['IO0', 'IO1', 'IO2'],
    allGrovePins: ['IO0', 'IO1', 'IO2'],          // bewusst ohne Servo-/Display-/I²C-Pins
    analogPins:   ['IO0', 'IO1', 'IO2'],
    hideBlockIds: ['actuator_motor_forward', 'actuator_motor_backward',
                   'actuator_motor_stop', 'sensor_battery' /* + 2-Pin-Blöcke, s. 5.4 */],
  },
```

Dazu `_BOARD_ID_MAP` in `js/app.js` um die `board_id` des gewählten Builds ergänzen. Bei einem generischen Build schaltet die Auto-Erkennung **jedes** Board mit diesem Build auf den Robo-Buddy um. Auch deshalb lohnt die eigene Board-Definition.

## 5. Nötige Änderungen am bestehenden Code

### 5.1 Ports ohne zweiten Pin und reine I²C-Ports (`js/boards.js`)

`_groveOptions` geht heute davon aus, dass jeder Port zwei Pins hat und jeder Port digital nutzbar ist:

- `'digital'` listet **alle** `grovePorts` → die I²C-Ports würden als Digital-Pin IO22 angeboten. Ein Kind, das dort eine LED schaltet, legt den INA226 lahm. **Filtern auf `p.digital !== false`.**
- `'2pin'` listet alle Ports → bei `pin1: null` entsteht `board.null`. **Filtern auf `p.pin1`.** (`'2pin_sequential'` filtert schon über die Pin-Nummer.)
- I²C 1 und I²C 2 haben identische Pins. Doppelte Werte im Dropdown sind bei `'i2c'` unkritisch, weil der Wert die Port-ID ist.

### 5.2 Ein gemeinsamer I²C-Bus (`js/generator.js`)

Heute erzeugt jeder I²C-Block sein eigenes Bus-Objekt (`_i2c_lcd`, `_i2c_bmp`, `_i2c_imu_<port>`). Auf dem Powerboard hängt **alles an einem Bus** (INA226 + beide Leisten). Zwei `busio.I2C` auf denselben Pins ergeben `ValueError: IO22 in Benutzung`. Beispiel: LCD-Block + Akku-Block, schon das bricht.

- Helfer `_i2cBusDef(port)` einführen: Key `init_i2c_<scl>_<sda>`, Variable `_i2c_<scl>_<sda>`. Alle I²C-Generatoren darauf umstellen.
- Reihenfolge-Gotcha aus `CLAUDE.md` beachten: `_defs` sortiert alphabetisch. Der Bus muss vor den Geräten stehen (`init_i2c_…` sortiert vor `init_lcd`, aber nach `init_bmp…`). Entweder Bus+Gerät in einem Eintrag zusammenfassen (dann aber Dedup des Busses über eine Prüfung im Helfer) oder ein Präfix wählen, das sicher vorne sortiert (z. B. `init_0_i2c_…`).
- Dasselbe Problem existiert **schon heute beim ESP32 D1 R32** (ein einziger I²C-Port). Der Fix nützt also beiden Boards.
- Die IMU-Retry-Logik (`_i2c_imu_${portId}`, Zeile ~827) baut den Bus bei Fehlern neu. Mit geteiltem Bus darf sie ihn nicht deinitialisieren, solange andere Geräte ihn nutzen.

### 5.3 Servo-Schiene einschalten (`js/generator.js`, `lib/makerspaceos.py`)

- Profil-Feld `servoEnable`. Wenn gesetzt, ergänzt **jeder Servo-Generator** (Winkel-Servo, Dauerdreh-Servo, Fahren, 8×8-Matrix **nicht**) einen Def-Eintrag:
  `_servo_en = digitalio.DigitalInOut(board.IO15); _servo_en.switch_to_output(True)`.
  Danach ca. **50 ms warten**, bis der Boost hochgelaufen ist, sonst gehen die ersten Pulse ins Leere. Im Def-Teil ist das `time.sleep(0.05)` (läuft einmal vor `start()`, blockiert keine Aufgaben).
- `PIN_RESET_PRELUDE` deinitialisiert alle Objekte → GPIO15 wird hochohmig, der 100-kΩ-Pull-down schaltet den Boost ab. Das ist der gewünschte sichere Zustand, wenn ein Programm stoppt oder abstürzt. Nicht ändern.
- **Initialer PWM-Puls:** `pwmio.PWMOut(..., duty_cycle=2**15, frequency=50)` erzeugt beim Anlegen einen 10-ms-Puls (50 %). Für Winkel-Servos egal, ein **Dauerdreh-Servo ruckt dabei kurz los**. Für die Servo-Blöcke `duty_cycle=0` setzen (kein Puls, bis der erste Wert kommt).
- **Stillstand:** Die Robo-Buddy-Firmware schaltet den Boost nach `SERVO_IDLE_MS` = 2 s Stillstand ab (spart Strom, sauberes Ladeende). Option für später: in `makerspaceos.py` eine kleine Aufgabe, die `SERVO_EN` nach 2 s ohne Servo-Befehl abschaltet und beim nächsten Befehl wieder einschaltet. Erst einmal reicht „an, solange das Programm läuft“.
- Ohne Zelle laufen die Servos nicht (Hardware). Der Generator kann das nicht erkennen. Hinweis in die Block-Doku und als Warnung in den Serial-Monitor, wenn der INA226 keine plausible Zellspannung liefert (siehe 6.3).

### 5.4 Blöcke, die auf diesem Board nicht passen

Über `hideBlockIds` ausblenden (bzw. per Feature-Gating, siehe 5.6):

- Motor M1/M2 (kein Motortreiber), `sensor_battery` (fest GP29, ersetzt durch Abschnitt 6).
- **Alle 2-Pin-Blöcke**, solange es keine Ports mit zwei Signalen gibt: Drehgeber (`sensor_encoder`, `when_encoder`), TM1637 (`tm1637_number`, `tm1637_off`), Schrittmotor (4 Pins), HC-SR04-Variante des Ultraschalls (der Grove-Ultraschall mit einem Pin geht).
- Onboard-Taster-Blöcke (es sei denn, BOOT wird freigegeben, 8.6).

Alternative für 2-Pin-Geräte: virtuelle Port-Paare „A0+A1“ / „A1+A2“ (`pin1` = zweiter Analog-Pin). Machbar, aber dann belegt ein Gerät zwei der drei freien Ports. Entscheidung bei Gregor.

### 5.5 PWM-Kanäle

Der ESP32-C6 hat **6 LEDC-Kanäle und 4 Timer**. 4 Servos (alle 50 Hz, ein Timer) belegen 4 Kanäle. Es bleiben 2 für Summer und PWM-Block. Ein fünfter PWM-Ausgang endet mit `RuntimeError: All channels in use` (bzw. deutscher Text). NeoPixel läuft über RMT, nicht betroffen. In der Doku des PWM-Blocks erwähnen.

### 5.6 Board-Feature-Gating fehlt noch

Display-, Akku- und Fahren-Blöcke gibt es nur auf diesem Board. Heute kann ein Profil Blöcke nur **verbergen** (`hideBlockIds`), nicht **voraussetzen**. Dann müsste jedes andere Profil die neuen IDs in seine Ausblendliste schreiben.

`gamepad_pico` deklariert schon `touchPins`, `imu`, `matrix5`, `usbHid` und verweist im Kommentar auf `requiresBoardFeature` in `components/*.md`. **Umgesetzt ist das nirgends** (kein Treffer in `build_blocks.js`, `block_builder.js`, `toolbox.js`; `blocks/matrix5.js` existiert nicht). Vorschlag: Frontmatter-Feld `requiresBoardFeature: display` → `build_blocks.js` übernimmt es nach `blocks_db.js`, `buildToolboxCategories` blendet den Block aus, wenn `BOARD[feature]` fehlt. Davon profitiert auch das GamePadPico.

## 6. Neue Blöcke: Akku, Strom, Laden

### 6.1 Treiber `lib/ina226.py` (neu, eigene Datei)

Klein halten, nur das Nötige. Ob es ein brauchbares INA226-Modul im Adafruit- oder Community-Bundle gibt, habe ich nicht sicher feststellen können. Eigener Treiber ist ~60 Zeilen und ohne Abhängigkeit.

- Register: 0x00 Config, 0x01 Shunt-Spannung (2,5 µV/LSB, signed), 0x02 Bus-Spannung (1,25 mV/LSB), 0x03 Leistung, 0x04 Strom (signed), 0x05 Kalibrierung.
- Kalibrierung für 10 mΩ und Current_LSB = 0,25 mA: `CAL = 0,00512 / (0,00025 A × 0,010 Ω) = 2048`. Bereich ±8,19 A.
- Config: Mittelung 16, Wandlungszeit 1,1 ms, kontinuierlich Shunt + Bus (z. B. `0x4527`, am Datenblatt gegenprüfen).
- Adresse **0x45** (A0 = A1 = VS). Kollidiert mit keinem bestehenden Block (LCD 0x3E/0x30/0x62, ICM20948 0x68/0x69, BMP280 0x76/0x77).
- Lesezugriffe wie bei der ICM20948 gegen `OSError` absichern und den letzten gültigen Wert liefern.
- `deinit()` implementieren (Gotcha aus `CLAUDE.md`: sonst bleibt der Bus beim nächsten „Ausführen“ belegt).
- In `lib_manifest.js` / Firmware-Image aufnehmen.

### 6.2 Blöcke (markdown-getrieben, `components/sensors/`, alle mit `*_en`-Feldern)

Kategorie „Sensoren“, Subkategorie z. B. „Akku“, `requiresBoardFeature: powerMonitor`.

| Block | Typ | Ausgabe | Hinweis |
|---|---|---|---|
| 🔋 Akkuspannung (V) | value, Number | Bus-Spannung, 2 Nachkommastellen | |
| ⚡ Strom (mA) | value, Number | Zellstrom, **positiv = Verbrauch** | Vorzeichen für Kinder umdrehen (INA226: Laden negativ). Entscheiden und dokumentieren |
| 🔌 lädt gerade? | value, Boolean | Strom < −20 mA | Schwelle gegen Rauschen |
| 🔋 Akkustand (%) | value, Number | aus der Ruhespannung, Tabelle 3,5 V = 0 % … 4,15 V = 100 % | Ladungszählung über Programmneustarts hinweg ist nicht verlässlich, deshalb Spannung. Bei Last und beim Laden ungenau, in der Doku sagen |
| 🪫 wenn Akku schwach | event | kantengetriggert bei < 3,6 V | über `_whenTask`, `_HAT_TYPES`, Toolbox „Ereignisse“ |

Optional: „Leistung (mW)“. Für Kinder eher verzichtbar.

### 6.3 Plausibilität

- **Keine Zelle, USB an:** Der TP4056 gibt an BAT+ eine pendelnde Spannung aus. Gilt als „kein Akku“: Spannung < 3,0 V oder > 4,3 V, oder starkes Schwanken. Dann liefern die Blöcke trotzdem Werte; im Serial-Monitor einmal den Hinweis „Kein Akku – Servos laufen nur mit Akku“.
- **Firmware-Schwellen aus dem Hardware-Handoff:** Warnung unter 3,6 V, Servos aus und „Bitte laden“ unter 3,5 V, dann Deep Sleep. Grund: Der LDO des C6-Zero liefert bei 3,4 V unter WLAN-Last schon Brownouts.

### 6.4 Tiefentladeschutz: offene Lücke (bitte mit Gregor klären)

Bisher schützt die Arduino-Firmware die Zelle (Abschnitt 7 im Hardware-Handoff). Läuft auf dem Roboter makerSpaceOS, gibt es diese Firmware nicht mehr. Dann gilt:

- Ein Kinderprogramm überwacht den Akku nur, wenn es den Block benutzt.
- Ist das Programm beendet oder abgestürzt, sitzt der ESP in der REPL und zieht weiter einige 10 mA. Ein vergessener Roboter mit Schalter auf EIN entlädt die Zelle bis zur DW01-Abschaltung bei **2,4 V**. Für recycelte Zellen ohne eigene Schutzschaltung ist das genau der Schaden, den die Firmware vermeiden sollte.

Vorschläge, in dieser Reihenfolge:

1. **`start()` in `lib/makerspaceos.py` startet immer eine Akku-Wächter-Aufgabe**, wenn ein INA226 an 0x45 antwortet. Unter 3,5 V: `SERVO_EN` low, Meldung, `alarm.exit_and_deep_sleep_until_alarms()` ohne Weckquelle (bzw. mit langem Timer). Das Kinderprogramm muss nichts tun.
2. **`code.py` im Firmware-Image** als Fallback, der dasselbe macht, wenn kein Programm läuft (nach dem Booten ohne Editor).
3. Bleibt eine Restlücke: Programm abgestürzt, REPL aktiv. Lässt sich in CircuitPython nicht vollständig schließen. In der Workshop-Doku: „Schalter auf AUS, wenn du fertig bist.“

## 7. Neue Blöcke: Display (GC9A01, rund, 240×240)

### 7.1 Treiber

- `displayio` + GC9A01-Treiber. Im Adafruit-Bundle gibt es keinen offiziellen GC9A01-Treiber, im **Community-Bundle** gibt es einen (`gc9a01`, Init-Sequenz für `BusDisplay`). Prüfen, ob er mit CircuitPython 10 läuft; notfalls eine eigene kleine `lib/gc9a01.py` mit Init-Sequenz (aus der Robo-Buddy-Firmware bzw. dem Datenblatt).
- Ab CircuitPython 9/10: `from fourwire import FourWire` und `busdisplay.BusDisplay`, **nicht** mehr `displayio.FourWire`/`displayio.Display`.
- SPI: `busio.SPI(clock=IO4, MOSI=IO5)`, DC IO20, CS IO21, RST IO3. Die Firmware fährt 40 MHz; in CircuitPython mit 24–40 MHz testen (Kabel!).
- `displayio.release_displays()` gehört an den Anfang (sonst „Pin in Benutzung“ nach erneutem Ausführen). `PIN_RESET_PRELUDE` greift beim Display nicht, weil `BusDisplay` nur über `release_displays()` freigegeben wird → in den Prelude aufnehmen.
- Speicher: displayio zeichnet ohne vollen Framebuffer. Eine 240×240-Bitmap mit 16 Farben kostet ~29 KB, das geht. Große Schriften/Bilder am Board testen.
- **Ausrichtung:** Die Firmware hat `TFT_ROTATION`. Im Gehäuse prüfen, welche Drehung richtig ist, und fest im Generator setzen.

### 7.2 Blöcke (Vorschlag, Kategorie „Display“, `requiresBoardFeature: display`)

Die Firmware zeichnet ein Gesicht (`src/face.cpp`). Für Kinder ist das der naheliegendste Einstieg:

| Block | Beschreibung |
|---|---|
| 🙂 Gesicht zeigen [fröhlich ▾] | Fertige Gesichter: fröhlich, traurig, überrascht, müde, wütend, verliebt. Aus Formen (`vectorio`) gezeichnet, keine Bilddateien |
| 👀 Augen schauen [links ▾] | links, rechts, oben, unten, Mitte |
| 💬 Text anzeigen [ ] Farbe [ ] | zentriert, eine Zeile, Schriftgröße per Skalierung |
| 🔢 Zahl anzeigen [ ] | groß, mittig (z. B. Akkustand, Abstand) |
| 🎨 Display füllen mit Farbe [ ] | |
| ⬛ Display löschen | |

- Gesicht und Text liegen in **einer** `displayio.Group`. Der Generator legt sie einmal an (`_defs`), jeder Block tauscht nur den Inhalt.
- Eine Laufzeit-Hilfsdatei `lib/robo_display.py` mit `gesicht(name)`, `text(s, farbe)` usw. hält den generierten Code kurz (wie `makerspaceos.py`). Die Funktionsnamen bleiben in beiden Sprachen deutsch (Konvention aus `CLAUDE.md`).
- Blinzeln/Animation: als Aufgabe über `immer()` möglich, aber nicht im ersten Schritt.

## 8. Weitere Blöcke und Entscheidungen

### 8.1 Dauerdreh-Servos / Fahren

Der Robo-Buddy fährt mit **zwei Dauerdreh-Servos** (Panzerantrieb, Schleifrad hinten): links GPIO19, rechts GPIO18, **rechts gespiegelt** (`SERVO_RIGHT_INVERT true` in `src/config.h`), Neutral 1500 µs, ±450 µs bei Vollgas.

Der bestehende Servo-Block setzt nur einen **Winkel**. Bei einem Dauerdreh-Servo bedeutet 90° „Stopp“, 0/180° „volle Fahrt“. Für Kinder unverständlich.

- **⚙️ Rad-Servo [S1 ▾] Tempo [ ] %** (−100 … 100) mit `adafruit_motor.servo.ContinuousServo` (`throttle`), `min_pulse=1050`, `max_pulse=1950` passend zur Firmware.
- **🚗 Fahren [vorwärts ▾] Tempo [ ] %** (vorwärts, rückwärts, links drehen, rechts drehen, stopp). Nutzt fest S1 = links, S2 = rechts gespiegelt. Das ist der Block, den Kinder tatsächlich brauchen.
- **Rampe:** Der Hardware-Handoff verlangt, die Pulse über 150–200 ms hochzufahren (halbiert die Stromspitzen, schützt Zelle und DW01). Gehört in die Laufzeit (`robo_drive.py` oder `makerspaceos.py`) als kleine asyncio-Aufgabe, nicht in den Kindercode.
- **Trimmung:** Die Firmware hat eine Trimmung pro Servo (Neutralpunkt). Klone stehen bei 1500 µs oft nicht still. Option: Block „Rad-Servo Stopp-Punkt einstellen“ oder Konstante im Profil. Erst am echten Roboter messen.
- `adafruit_motor` liegt **nicht** im `lib/`-Ordner des Repos (laut `CLAUDE.md` Standard-Bundle). Fürs ESP-Image muss es mit hinein.

### 8.2 Onboard-NeoPixel

WS2812 an GPIO8 auf dem ESP-Board, `count: 1`. Die bestehenden Onboard-Licht-Blöcke funktionieren damit. GPIO8 ist Strapping-Pin, als Ausgang nach dem Boot unkritisch. Im Gehäuse ist die LED vermutlich nicht sichtbar, also eher Debug-Hilfe.

### 8.3 Externe Sensoren

An A0–A2 laufen alle Ein-Pin-Blöcke: Taster, LED, LDR, Bodenfeuchte, Analog lesen, DHT11, Grove-Ultraschall, externer NeoPixel-Streifen, digital lesen/schreiben, PWM. An I²C 1/2 laufen LCD, BMP280 und ICM20948, sobald 5.2 umgesetzt ist. Achtung: Die Leisten sind **keine Grove-Buchsen**, sondern Stiftleisten. Grove-Module brauchen ein Grove-auf-Dupont-Kabel, und bei den Analog-Ports ist die Reihenfolge anders (GND, 3V3, SIG statt SIG, NC, VCC, GND). In der Board-Doku mit Foto zeigen.

### 8.4 3V3-Budget

Display + INA226 + Sensoren hängen am LDO des C6-Zero. Für Sensoren bleiben ca. 300 mA. Ein externer NeoPixel-Streifen an 3V3 ist damit nach wenigen LEDs am Limit. In der Doku des Streifen-Blocks für dieses Board erwähnen (max. ~8 LEDs bei geringer Helligkeit).

### 8.5 Summer

Kein Onboard-Summer, und es ist kein Pin frei. Optionen: Summer-Block auf diesem Board ausblenden, oder `buzzer` fest auf A2 (IO2) legen. Besser wäre ein Port-Dropdown im Summer-Block. Entscheidung bei Gregor.

### 8.6 BOOT-Taste (GPIO9)

Liegt auf dem ESP-Board und ist im Gehäuse vermutlich nicht erreichbar. GPIO9 ist Strapping-Pin (gedrückt beim Reset = Download-Modus). Als `buttons: { BOOT: 'IO9' }` freigeben geht technisch; ob es im Gehäuse Sinn ergibt, klären.

## 9. Dokumentation

- `docs/robo-buddy-c6.md` nach dem Muster von `docs/esp32-d1-r32.md`: Fotos der Platine mit Port-Aufdrucken, Flashen, Lib-Installation, „Servos laufen nur mit Akku“, Prüfschritt vor dem ersten Akku (aus dem Hardware-Handoff, Abschnitt 10), Sicherheitshinweise zu recycelten Zellen (Abschnitt 11).
- `js/docs.js`: Board-Doku in `BOARD_DOCS` / `BOARD_DOCS_EN`.
- `CLAUDE.md`: Abschnitt zum neuen Profil unter „Wichtige Gotchas“ (Pins, SERVO_EN, gemeinsamer I²C-Bus, kein CIRCUITPY, Tiefentladeschutz).
- `components/hardware/` hat Hardware-Beschreibungen (`maker_pi_rp2040.md`). Analog `robo_buddy_powerboard.md` anlegen.

## 10. Reihenfolge der Umsetzung

1. **CircuitPython-Build klären** (Abschnitt 3): Flash-Größe, Build, `board_id`, Pin-Namen. Ohne das ist alles Weitere Spekulation.
2. Am echten Board von Hand in der REPL prüfen: Servo an GPIO19 dreht nach `SERVO_EN` high, INA226 antwortet an 0x45, Display zeigt etwas, ADC an A0.
3. Profil `robo_buddy_c6`, `_BOARD_ID_MAP`, Port-Filter (5.1).
4. Gemeinsamer I²C-Bus (5.2), mit dem D1 R32 gegentesten.
5. `SERVO_EN` im Servo-Generator (5.3), Dauerdreh- und Fahren-Blöcke (8.1).
6. `lib/ina226.py` + Akku-Blöcke (6), Akku-Wächter in `makerspaceos.py` (6.4).
7. Feature-Gating `requiresBoardFeature` (5.6).
8. Display-Treiber + Blöcke (7).
9. Firmware-Komplett-Image, Doku, `CLAUDE.md`, `node scripts/build_blocks.js`.

## 11. Offene Punkte (mit Gregor klären)

1. **Grundsatzfrage:** Ersetzt makerSpaceOS auf dem Roboter die Arduino-Firmware komplett? Dann fallen WLAN-Fernsteuerung per Handy, QR-Code und Gesicht der Firmware weg, solange sie nicht in CircuitPython nachgebaut sind. Oder gibt es zwei Modi (Firmware fürs Festival, makerSpaceOS im Workshop) mit Umflashen?
2. CircuitPython-Build: eigene Board-Definition oder generischer Build (Abschnitt 3.5)?
3. Tiefentladeschutz in der Laufzeit, wie in 6.4 vorgeschlagen?
4. 2-Pin-Geräte: ausblenden oder virtuelle Port-Paare (5.4)?
5. Summer und BOOT-Taste (8.5, 8.6).
6. Vorzeichen des Strom-Blocks (6.2): „positiv = Verbrauch“ für Kinder?
7. Display-Drehung und Servo-Trimmung am fertigen Roboter messen.
