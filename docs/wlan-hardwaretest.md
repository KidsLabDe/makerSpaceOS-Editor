# Hardwaretest: Robo ESP32 + WLAN (Ebene 2)

Alles in dieser Liste ist bisher **nur im Browser bzw. unter CPython** getestet,
nicht auf echter Hardware. Erst nach diesem Test gilt ein Punkt als „da“.

Ergebnisse bitte direkt hier eintragen (Datum, Board, Firmware, Beobachtung).

## 0. Vorbereitung

- [ ] Firmware: DOIT-ESP32-DevKit-V1-Build (CircuitPython 10.2.1 de_DE) auf das
      NodeMCU-ESP32-Modul des Robo flashen – Anleitung wie beim D1 R32
      (`docs/esp32-d1-r32.md`). Passt das vorhandene Komplett-Image
      `firmware/makerSpaceOS_firmware_esp32-d1-r32.bin` (4 MB)? Flash-Größe
      des Moduls notieren: ________
- [ ] Libs nach `/lib/` kopieren (Thonny, kein CIRCUITPY-Laufwerk):
      `makerspaceos.py`, `makerspaceos_netz.py`, `asyncio/`, `adafruit_ticks.mpy`,
      `neopixel.py`, `adafruit_requests.mpy`, `adafruit_connection_manager.mpy`,
      `adafruit_ntp.mpy` (+ was die benutzten Sensor-Blöcke brauchen).
      Achtung: Das bestehende Komplett-Image enthält die drei Netz-Libs und
      `makerspaceos_netz.py` noch **nicht**.
- [ ] Im Editor „Robo ESP32“ wählen, verbinden. Wird die Auswahl beim Verbinden
      beibehalten (board_id `doit_esp32_devkit_v1` ist mehrdeutig)?
- [ ] Freier Speicher ohne Programm: `import gc; gc.collect(); print(gc.mem_free())` → ________ Bytes

## 1. Board-Profil (ohne WLAN)

- [ ] Grove 1: LED leuchtet über Block mit Port „Grove 1“ (Signal = D16, gelbes Kabel)
- [ ] Grove 2: Grove-LCD (I2C) zeigt Text – bestätigt SDA = D21, SCL = D22
- [ ] Analog-Sensor an Grove 4/5/6/7 liefert plausible Werte
- [ ] Taster B1 (D34) / B2 (D35): Block „Taster gedrückt“ reagiert, keine
      Fehlermeldung wegen `Pull.UP` (D34/D35 haben keine internen Pull-ups)
- [ ] Motoren M1/M2: vorwärts, rückwärts, stopp (PWM 50 Hz)
- [ ] Servos S1–S4 (D4, D5, D18, D19)
- [ ] Summer (D23, Schalter auf ON), 2 NeoPixel (D15)
- [ ] Summer + 4 Servos + 2 Motoren gleichzeitig ohne `RuntimeError` (PWM-Kanäle)

## 2. WLAN-Dialog

- [ ] „WLAN“ → Name/Passwort → Speichern → Meldung „Gespeichert“
- [ ] `settings.toml` enthält die beiden Einträge; vorher vorhandene Einträge
      (z. B. `CIRCUITPY_WEB_API_PASSWORD`) sind noch da
- [ ] Passwort mit Sonderzeichen (`"`, `\`, Umlaut) – verbindet trotzdem?
- [ ] „Verbindung testen“ zeigt IP + Signalstärke
- [ ] Falsches Passwort → verständliche Fehlermeldung
- [ ] Nach Reset verbindet sich das Board selbst (Web Workflow); Port 80 belegt?
- [ ] Monitor zeigt das Passwort nirgends an

## 3. Netze

| Test | WPA2-WLAN | Handy-Hotspot |
|---|---|---|
| verbindet | | |
| `WLAN verbunden?` = wahr | | |
| `Internet erreichbar?` = wahr | | |
| Uhrzeit per NTP (Konsole „über NTP gestellt“) | | |

- [ ] Ohne WLAN (Hotspot aus): Programm läuft weiter, Blöcke liefern
      `None`/`--:--`/-100, Konsole zeigt Ursache, **kein Absturz**
- [ ] WLAN ohne Internet (Hotspot ohne mobile Daten): `WLAN verbunden?` wahr,
      `Internet erreichbar?` falsch
- [ ] Hotspot während eines Abrufs ausschalten: kein Absturz, letzter Wert bleibt
- [ ] Hotspot später einschalten: Board verbindet sich von selbst (höchstens alle 30 s ein Versuch)
- [ ] Netz mit gesperrtem NTP (falls verfügbar): Uhrzeit kommt über HTTP

## 4. Datenquellen

Für jede Quelle: `gc.mem_free()` vor/nach dem ersten Abruf, Dauer des Abrufs.

| Quelle | Wert plausibel | mem_free vorher | nachher | Dauer | Antwortgröße |
|---|---|---|---|---|---|
| Temperatur jetzt (Open-Meteo) | | | | | |
| Niederschlag jetzt (Open-Meteo) | | | | | |
| Wasserstand (PEGELONLINE, Pegel PFELLING) | | | | | |
| hole JSON von URL (Standard-URL) | | | | | |

- [ ] Pegelname PFELLING existiert? Sonst passenden Donau-Pegel eintragen
- [ ] Innerhalb des Intervalls kein neuer Abruf (Konsole/Netzwerk ruhig)
- [ ] Danach `node scripts/test_datasources.js --online` am Rechner, gemessene
      Größe als `responseSize_bytes` eintragen, `verified: true` setzen

## 5. Dauerlauf und Mehrbetrieb

- [ ] 30 Minuten: Temperatur + Uhrzeit alle paar Sekunden aufs LCD, kein Absturz,
      `gc.mem_free()` am Ende ähnlich wie am Anfang
- [ ] Wie lange „frieren“ Motoren/Ereignisse während eines Abrufs ein? ________ s
- [ ] Mehrere Boards gleichzeitig im selben Netz, alle holen Daten
