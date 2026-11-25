# makerSpaceOS

**Browserbasierte Blockly-IDE für CircuitPython – für den Cytron MAKER-PI-RP2040 und weitere Boards**

makerSpaceOS ermöglicht es Kindern und Einsteigern, physische Elektronikprojekte zu programmieren – ohne eine einzige Zeile Code zu tippen. Per Drag & Drop werden bunte Blöcke zu einem Programm zusammengesteckt, das makerSpaceOS direkt in lauffähigen CircuitPython-Code übersetzt und über eine serielle Verbindung auf den Mikrocontroller überträgt.

---

## Intention

Der Einstieg in Mikrocontroller-Programmierung scheitert oft an zwei Hürden: der Entwicklungsumgebung und der Syntax. makerSpaceOS beseitigt beides.

- **Kein Setup**: Die App läuft direkt im Browser – kein npm, kein Build-Schritt, keine Installation.
- **Kein Tippen**: Blöcke statt Syntax. Kinder im Grundschul- und Mittelschulalter können sofort loslegen.
- **Echte Hardware**: Der generierte Code läuft auf echtem CircuitPython, nicht auf einem Simulator. Was man baut, funktioniert wirklich.
- **Deutsch und Englisch**: Deutsch ist Standard, Englisch lässt sich im Header zuschalten – für den Einsatz im Unterricht oder Makerspace.

Das Projekt entstand mit dem Ziel, ein Werkzeug zu schaffen, das in AGs, Schulstunden und Workshops ohne Vorkenntnisse sofort einsetzbar ist.

---

## Hardware

### Unterstützte Boards

Das Board wird im Dropdown im Header gewählt. Beim Verbinden erkennt der Editor die meisten Boards selbst.

| Board | Chip | Hinweise |
|---|---|---|
| **Cytron MAKER-PI-RP2040** (Standard, empfohlen) | RP2040 | Grove-Ports, Motortreiber, Servo-Anschlüsse |
| **GamePadPico** (KidsLab „nerdYcontroller") | RP2040 | 5×5-Matrix, Touch-Pfeile, Neigungssensor, Mikrofon; im Dropdown selbst wählen (keine Auto-Erkennung) |
| **Wemos/LOLIN S2 Mini** | ESP32-S2 | Ports sind Pin-Paare |
| **AZ-Delivery ESP32 D1 R32** mit Grove Base Shield | ESP32 | Kein `CIRCUITPY`-Laufwerk, siehe [Anleitung](docs/esp32-d1-r32.md) |
| **RoboBuddy** (MF26, Waveshare ESP32-C6-Zero) | ESP32-C6 | Fahrwerk, Rund-Display, Akku-Messung; Libs über USB-Seriell, siehe [Anleitung](docs/robobuddy-c6.md) |

Welche Blöcke in der Bausteine-Leiste erscheinen, hängt vom gewählten Board ab.

### Empfohlen: Cytron MAKER-PI-RP2040

- **RP2040**-Chip (Dual-Core ARM Cortex-M0+, 264 KB RAM)
- **Onboard**: 7× Grove-Ports (GPIO/ADC/I2C), Motortreiber für 2 DC-Motoren, 4× Servo-Anschlüsse, 2× RGB-NeoPixel, Piezo-Buzzer, 2 Taster, LEDs, USB
- **CircuitPython**-kompatibel: Wird als USB-Laufwerk (`CIRCUITPY`) erkannt
- **Kinder-freundlich**: Robuste Stecker, kein Löten nötig

> ⚠️ **Stromversorgung für die Motor-Treiber: maximal 6 Volt!** Keine 9-V-Blöcke an den Versorgungseingang (VIN/Batterie-Anschluss) anschließen – das zerstört das Board. Geeignet sind z. B. 4× AA-Batterien (6 V) oder ein LiPo-Akku (3,7 V).

> Bezugsquellen für Boards und Bauteile: Seite [`shop.html`](shop.html) („Bauteile bestellen" im Fuß der Hilfe-Leiste).

### Sensoren & Aktoren

makerSpaceOS hat fertige Blöcke für folgende Komponenten (je nach Board):

| Kategorie | Komponenten |
|---|---|
| Sensoren | DHT11, DHT22, Ultraschall (Grove oder HC-SR04), Lichtsensor, Luftqualität, Bodenfeuchte, Bewegungssensor (eingebaut oder Grove), Drehgeber, Taster, Geräusch- und Berührungssensor, Mikrofon, Touch-Pfeile, Akku/Batterie |
| Aktionen | LED, Piepser (eingebaut/extern), MP3-Player, Sprachmodul (ISD1820), Servo, Rad-Servo, DC-Motor, Schrittmotor, Fahrwerk, Tastatur (USB) |
| Lichter | NeoPixel (eingebaut), LED-Streifen |
| Anzeigen | LCD, 7-Segment, Rund-Display, Matrix 8×8, Matrix 5×5 |
| Pins | Digital lesen/schreiben, Analog lesen, PWM, Seriell senden (UART) |

### Browser

Für die Verbindung zum Board wird die Web Serial API benötigt:

| Browser (Desktop) | Verbinden, Ausführen, serieller Monitor | „Libs prüfen" und „Firmware" über Laufwerke |
|---|---|---|
| **Google Chrome** (empfohlen) | ✅ | ✅ |
| **Microsoft Edge** | ✅ | ✅ |
| **Firefox** ab Version 151 | ✅ | ❌ |
| Safari | ❌ | ❌ |

In **Firefox** fehlt die File System Access API: Bibliotheken (z. B. mit `scripts/sync_lib.sh`) und Firmware werden dort von Hand kopiert, und „Aufs Board" lädt `code.py` herunter. Beim RoboBuddy laufen Bibliotheken und `code.py` auch in Firefox über die serielle Verbindung.

---

## Features

- **Visueller Editor** mit Blockly (Drag & Drop), Bausteine nach Bauteilen gruppiert
- **Live-Codegenerierung** – CircuitPython-Code wird in Echtzeit angezeigt
- **Direkt ausführen** – Code wird per Web Serial (Raw REPL) auf das Board geladen und gestartet
- **Aufs Board speichern** – Programm als `code.py` sichern, damit es auch ohne Computer startet
- **Prüfung vor dem Start** – fehlende Auswahlen (z. B. ein Port) werden am Block markiert; häufige Board-Fehler werden verständlich erklärt
- **Projekte** – automatisches Speichern im Browser, Versionsverlauf, Beispiele, Datei-Export/-Import und Teilen per Link (ohne Server)
- **Hilfe-Leiste** – „Erste Schritte" und Erklärungen zum angeklickten Block, dazu eine vollständige Anleitung
- **Board-Libs-Button** – prüft, ob die Bibliotheken auf dem Board aktuell sind (🟢 „Libs aktuell" / 🔴 „Jetzt aktualisieren") und installiert sie bei Bedarf, inkl. Neustart
- **Firmware-Button** – flasht UF2-Firmware aus dem Browser auf RP2040-Boards im BOOTSEL-Modus, mit Größen- und SHA-256-Prüfung und Schritt-für-Schritt-Fotos
- **Parallele Aktionen (Ereignis-Blöcke)** – mehrere Stapel laufen gleichzeitig (z. B. eine Dauer-Animation *und* eine Sensor-Reaktion), ähnlich wie bei Lego Spike. Umgesetzt über kooperatives Multitasking mit `asyncio`.
- **Serieller Monitor** – `print()`-Ausgaben des Boards live im Browser sehen, mit Eingabezeile für die REPL
- **KI-Agenten (optional)** – über einen MCP-Server können Claude, Codex oder lokale Modelle Blöcke im Editor bauen, das Board starten und die Konsole lesen (siehe unten)
- **Keine Installation** – statische Web-App ohne Build-Schritt

---

## Schnellstart

Die Schritte gelten für den MAKER-PI-RP2040. Für die ESP32-Boards siehe die oben verlinkten Anleitungen.

1. Editor per lokalem Web-Server ausliefern, z. B. `python3 -m http.server 8000` im Editor-Verzeichnis, und `http://localhost:8000` in Chrome, Edge oder Firefox öffnen
2. **Firmware installieren** (nur bei leerem Board): in den **BOOTSEL-Modus** wechseln (das Laufwerk `RP2040`/`RPI-RP2` erscheint; Fotos unter „So geht's" im Dialog) → Header-Button „Firmware" → Bootloader-Laufwerk wählen → **Flashen**. Der Editor prüft das Image vorher (Größe und SHA-256), danach startet das Board in die neue Firmware.
3. Board per USB anschließen (Normalbetrieb)
4. **Board einrichten** – Header-Button „Libs prüfen": Beim ersten Mal das Board-Laufwerk `CIRCUITPY` wählen. Der Editor lädt die Bibliotheken aus `lib/` (`makerspaceos.py`, `asyncio`, `adafruit_ticks`, `neopixel` …) vom ausliefernden Server, kopiert sie nach `CIRCUITPY/lib/` und startet das Board neu – ein leeres Board wird so komplett bespielt. Danach zeigt der Button „Libs aktuell".
5. Blöcke zusammenstecken
6. **Verbinden** klicken und den seriellen Port wählen, dann **Ausführen**
7. Das Programm läuft auf dem Board; Ausgaben erscheinen im seriellen Monitor

> **Ohne File System Access API oder Seite unter `file://` geöffnet?** `lib/` manuell oder per `scripts/sync_lib.sh` auf `CIRCUITPY/lib/` kopieren und danach das Board neu starten (USB trennen & neu stecken).

---

## KI-Agenten per MCP (optional)

Ein kleiner MCP-Server (`mcp/`) verbindet KI-Agenten mit dem laufenden Editor. Die App selbst bleibt ohne npm – nur dieses Entwickler-Werkzeug braucht Node.

**Regel:** Agenten ändern Programme **nur über Blöcke**. Python-Code ist für sie nur lesbar (Debugging); es gibt kein Werkzeug, das Code schreibt oder fremden Code startet. Lässt sich ein Problem nicht mit Blöcken lösen, erzeugt `prepare_bug_report` einen Bericht, den du bei [kidslab.de](https://kidslab.de) oder als [GitHub-Issue](https://github.com/KidsLabDe/makerSpaceOS-Editor/issues) meldest.

1. `cd mcp && npm install`
2. Server im MCP-Client eintragen, z. B. `claude mcp add makerspaceos -- node /pfad/zu/makerSpaceOS-Editor/mcp/server.js` (Codex und lokale Modelle: siehe [`mcp/README.md`](mcp/README.md))
3. Editor wie im Schnellstart ausliefern (`python3 -m http.server 8000`), den Agenten `get_editor_url` aufrufen lassen und die URL (`…?agent=1&port=…&token=…`) in Chrome/Edge öffnen – unten links erscheint „🤖 Agent verbunden". Ohne `?agent=1` ist die Brücke aus.
4. Board einmal selbst per „Verbinden" wählen (Browser-Regel); danach kann der Agent ausführen und die Konsole lesen.

Der Agent bekommt Wissen aus der eingebauten Bibliothek (Blöcke, Boards, `docs/`) und feste Regeln/Erinnerungen (`mcp/rules.js`, `mcp/guide.{de,en}.md`).

---

## Projektstruktur

```
index.html           – Einstiegspunkt des Editors
viewer.html          – vollständige Anleitung
shop.html            – Bezugsquellen für Boards und Bauteile
admin.html           – internes Werkzeug
css/style.css        – helles KidsLab-Theme (Code-/Serial-Bereich dunkel)
js/
  i18n.js            – Deutsch/Englisch
  boards.js          – Board-Profile & Pin-Konstanten
  toolbox.js         – statische Toolbox-Kategorien
  blocks/            – handgeschriebene Blöcke (Steuerung, Ereignisse, Listen, Matrix …)
  blocks_db.js       – generiert aus components/*.md
  block_builder.js   – registriert die Blöcke aus blocks_db.js
  generator.js       – Blockly → CircuitPython (asyncio-Multitask)
  app.js             – Workspace-Init & UI-Events
  storage.js         – Speichern, Versionsverlauf, code.py
  serial.js          – Web Serial API (Raw REPL)
  board_setup.js     – Board-Libs-Button
  firmware_flash.js  – UF2-Firmware-Dialog
  docs.js            – Hilfe-Leiste (Texte in docs_data.js)
  *_manifest.js, examples_db.js – generiert
  agent/             – Brücke für den MCP-Server (lädt nur mit ?agent=1)
components/          – Hardware-Blöcke als Markdown, Bauteil-Register catalog.json
lib/                 – CircuitPython-Bibliotheken fürs Board
examples/            – Beispielprojekte
docs/                – Board-Anleitungen
firmware/            – Firmware-Images (UF2 für RP2040, .bin für ESP32)
scripts/             – Generatoren und Hilfsskripte
mcp/                 – MCP-Server für KI-Agenten (Node, nur Dev-Werkzeug)
vendor/              – Blockly und CodeMirror
laser/               – Laser-Vorlagen
```

---

## Entwicklung

Die App selbst braucht kein npm. Für die Generatoren genügt Node.js.

| Änderung | Danach ausführen |
|---|---|
| `components/`, `lib/`, `firmware/`, `examples/projects/` | `node scripts/build_blocks.js` (erzeugt alle generierten Dateien) |
| Nur JS oder CSS | `node scripts/bump_cache.js` (Cache-Busting) |
| `mcp/` | `cd mcp && npm install && npm test` |

Weitere Hinweise zu Architektur und Konventionen stehen in [`CLAUDE.md`](CLAUDE.md).

---

## Ideen

- Anzeige, ob das Programm gerade läuft
- OLED-Display, weitere Sensoren, Notenblöcke, Lernmodus

Offene Punkte: [`TODO.md`](TODO.md)

---

## Lizenz

- **Quellcode:** [MIT-Lizenz](LICENSE)
- **Inhalte** (Doku, Beispiele, Bilder, Laser-/Druckvorlagen): [CC BY 4.0](LICENSE-CONTENT.md)
- **Name und Logo** sind ausgenommen, siehe [LICENSE-CONTENT.md](LICENSE-CONTENT.md)
- **Fremde Bestandteile** (Blockly, CodeMirror, CircuitPython, Adafruit-Bibliotheken, Schriften): siehe [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)
