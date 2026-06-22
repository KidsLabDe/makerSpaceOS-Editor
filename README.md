# CircuitBlox

**Browserbasierte Blockly-IDE für CircuitPython auf dem Cytron MAKER-PI-RP2040**

CircuitBlox ermöglicht es Kindern und Einsteigern, physische Elektronikprojekte zu programmieren – ohne eine einzige Zeile Code zu tippen. Per Drag & Drop werden bunte Blöcke zu einem Programm zusammengesteckt, das CircuitBlox direkt in lauffähigen CircuitPython-Code übersetzt und über eine serielle Verbindung auf den Mikrocontroller überträgt.

---

## Intention

Der Einstieg in Mikrocontroller-Programmierung scheitert oft an zwei Hürden: der Entwicklungsumgebung und der Syntax. CircuitBlox beseitigt beides.

- **Kein Setup**: Die App läuft direkt im Browser – kein npm, kein Build-Schritt, keine Installation.
- **Kein Tippen**: Blöcke statt Syntax. Kinder im Grundschul- und Mittelschulalter können sofort loslegen.
- **Echte Hardware**: Der generierte Code läuft auf echtem CircuitPython, nicht auf einem Simulator. Was man baut, funktioniert wirklich.
- **Deutsch**: Alle Labels, Tooltips und Fehlermeldungen sind auf Deutsch – für den Einsatz im deutschsprachigen Unterricht oder Makerspaces.

Das Projekt entstand mit dem Ziel, ein Werkzeug zu schaffen, das in AGs, Schulstunden und Workshops ohne Vorkenntnisse sofort einsetzbar ist.

---

## Empfohlene Hardware

### Mikrocontroller: Cytron MAKER-PI-RP2040

CircuitBlox ist auf dieses Board zugeschnitten:

- **RP2040**-Chip (Dual-Core ARM Cortex-M0+, 264 KB RAM)
- **Onboard**: 2× Grove-kompatible I2C-Ports, 7× Grove-Ports (GPIO/ADC), 4× Motor-Treiber (DC + Servo), 2× RGB-NeoPixel, Piezo-Buzzer, programmierbare LEDs, USB-C
- **CircuitPython**-kompatibel: Wird als USB-Laufwerk (`CIRCUITPY`) erkannt, Code einfach kopieren
- **Kinder-freundlich**: Robuste Stecker, farbige Ports, kein Löten nötig

> Bezugsquelle: [Cytron](https://www.cytron.io/p-maker-pi-rp2040) oder gängige Elektronik-Distributoren (Mouser, Reichelt, …)

### Sensoren & Aktoren (KY-Sensor-Set)

CircuitBlox hat fertige Blöcke für folgende Komponenten:

| Kategorie | Komponenten |
|---|---|
| Temperatur & Feuchte | DHT22, DHT11, BMP280 |
| Abstand & Licht | HC-SR04 (Ultraschall), LDR (Fotowiderstand), BH1750 (Lux) |
| Digital-Sensoren | Taster, Hindernis, Liniensensor, Neigung, Magnetfeld, Flamme, Schall, Touch, Vibration |
| Analog (universell) | Analogeingang (0–65535), NTC-Temperaturfühler |
| Joystick & Encoder | Joystick (X/Y/Taster), Rotary Encoder |
| LED & Licht | Einzel-LED, Blink-LED, RGB-LED, 2-Farb-LED, NeoPixel |
| Ton | Passiver Buzzer (Frequenz), Aktiver Buzzer |
| Bewegung | Servo (Winkel), DC-Motor (vorwärts/rückwärts/stop) |
| Sonstiges | Relais |

Ein günstiges **37-teiliges oder 45-teiliges KY-Sensor-Set** (z. B. „Elegoo Sensor Kit" oder vergleichbare Sets) deckt den Großteil der Blöcke ab.

### Browser

Web Serial API wird benötigt – unterstützt von:
- **Google Chrome** (empfohlen)
- **Microsoft Edge**

Firefox und Safari werden **nicht** unterstützt.

---

## Features

- **Visueller Editor** mit Blockly (Drag & Drop)
- **Live-Codegenerierung** – CircuitPython-Code wird in Echtzeit angezeigt
- **Direkt ausführen** – Code wird per Web Serial Raw REPL auf das Board geladen und gestartet
- **Parallele Aktionen (Ereignis-Blöcke)** – mehrere Stapel laufen gleichzeitig (z. B. eine Dauer-Animation *und* eine Sensor-Reaktion), ähnlich wie bei Lego Spike. Umgesetzt über kooperatives Multitasking mit `asyncio`.
- **Serieller Monitor** – `print()`-Ausgaben des Boards live im Browser sehen
- **REPL-Eingabe** – manuelle Befehle direkt ins Board schicken
- **Keine Installation** – `index.html` im Browser öffnen, fertig

---

## Schnellstart

1. Board per USB-C anschließen (CircuitPython muss installiert sein)
2. Benötigte Bibliotheken nach `CIRCUITPY/lib/` kopieren (aus dem Adafruit CircuitPython Bundle):
   - **`asyncio`** und **`adafruit_ticks`** – Pflicht, da der generierte Code immer mit kooperativem Multitasking läuft
   - je nach genutzten Blöcken zusätzlich `adafruit_dht`, `neopixel`, `adafruit_hcsr04`, `adafruit_motor`, `adafruit_bmp280`
3. `index.html` in Chrome oder Edge öffnen
4. Blöcke zusammenstecken
5. **▶ Ausführen** klicken → Browser fragt nach Zugriff auf den seriellen Port → Board auswählen
6. Programm läuft auf dem Board; Ausgaben erscheinen im Seriellen Monitor

---

## Projektstruktur

```
index.html           – Einstiegspunkt (keine Build-Pipeline nötig)
css/style.css        – Dunkles Theme
js/
  boards.js          – Board-Profil & Pin-Konstanten
  toolbox.js         – Block-Kategorien & Toolbox-Definition
  blocks/
    control.js       – SETUP- und FÜR-IMMER-Blöcke
    events.js        – Ereignis-Hut-Blöcke (parallele Aktionen)
  blocks_db.js       – generiert aus components/*.md (Sensor-/Aktor-Blöcke)
  block_builder.js   – registriert Blöcke aus blocks_db.js
  generator.js       – Blockly → CircuitPython Transpiler (asyncio-Multitask)
  app.js             – Workspace-Init & UI-Events
  serial.js          – Web Serial API (Raw REPL)
```

---

## Roadmap

- **Phase 2.5** – Code direkt als `code.py` auf CIRCUITPY speichern (File System Access API)
- **Phase 3** – Projekte speichern/laden, Board-Auswahl
- **Phase 4** – OLED-Display, weitere Sensoren, Notenblöcke, Lernmodus

---

## Lizenz

Dieses Projekt ist für den Einsatz in Bildung und Maker-Communities gedacht. Lizenz folgt.
