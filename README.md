# makerSpaceOS

**Browserbasierte Blockly-IDE für CircuitPython auf dem Cytron MAKER-PI-RP2040**

makerSpaceOS ermöglicht es Kindern und Einsteigern, physische Elektronikprojekte zu programmieren – ohne eine einzige Zeile Code zu tippen. Per Drag & Drop werden bunte Blöcke zu einem Programm zusammengesteckt, das makerSpaceOS direkt in lauffähigen CircuitPython-Code übersetzt und über eine serielle Verbindung auf den Mikrocontroller überträgt.

---

## Intention

Der Einstieg in Mikrocontroller-Programmierung scheitert oft an zwei Hürden: der Entwicklungsumgebung und der Syntax. makerSpaceOS beseitigt beides.

- **Kein Setup**: Die App läuft direkt im Browser – kein npm, kein Build-Schritt, keine Installation.
- **Kein Tippen**: Blöcke statt Syntax. Kinder im Grundschul- und Mittelschulalter können sofort loslegen.
- **Echte Hardware**: Der generierte Code läuft auf echtem CircuitPython, nicht auf einem Simulator. Was man baut, funktioniert wirklich.
- **Deutsch**: Alle Labels, Tooltips und Fehlermeldungen sind auf Deutsch – für den Einsatz im deutschsprachigen Unterricht oder Makerspaces.

Das Projekt entstand mit dem Ziel, ein Werkzeug zu schaffen, das in AGs, Schulstunden und Workshops ohne Vorkenntnisse sofort einsetzbar ist.

---

## Empfohlene Hardware

### Mikrocontroller: Cytron MAKER-PI-RP2040

makerSpaceOS ist auf dieses Board zugeschnitten:

- **RP2040**-Chip (Dual-Core ARM Cortex-M0+, 264 KB RAM)
- **Onboard**: 2× Grove-kompatible I2C-Ports, 7× Grove-Ports (GPIO/ADC), 4× Motor-Treiber (DC + Servo), 2× RGB-NeoPixel, Piezo-Buzzer, programmierbare LEDs, USB-C
- **CircuitPython**-kompatibel: Wird als USB-Laufwerk (`CIRCUITPY`) erkannt, Code einfach kopieren
- **Kinder-freundlich**: Robuste Stecker, farbige Ports, kein Löten nötig

> ⚠️ **Stromversorgung für die Motor-Treiber: maximal 6 Volt!** Keine 9-V-Blöcke an den Versorgungseingang (VIN/Batterie-Anschluss) anschließen – das zerstört das Board. Geeignet sind z. B. 4× AA-Batterien (6 V) oder ein LiPo-Akku (3,7 V).

> Bezugsquelle: [Cytron](https://www.cytron.io/p-maker-pi-rp2040) oder gängige Elektronik-Distributoren (Mouser, Reichelt, …)

### Sensoren & Aktoren (KY-Sensor-Set)

makerSpaceOS hat fertige Blöcke für folgende Komponenten:

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
- **Board-Libs-Button** – prüft, ob die Bibliotheken auf dem Board aktuell sind (🟢 „Libs aktuell" / 🔴 „Jetzt aktualisieren") und installiert sie bei Bedarf automatisch, inkl. Neustart
- **UF2-Firmware-Button** – flasht die Firmware aus dem Browser ins BOOTSEL-Laufwerk des Boards (`RP2040`/`RPI-RP2`): Manifest-Check per SHA-256, chunkweises Schreiben mit Fortschritt, Schritt-für-Schritt-Fotos als Hilfe („So geht's") vor dem Flash, kein Brick-Risiko (der ROM-Bootloader ist über Mass Storage nicht überschreibbar)
- **Parallele Aktionen (Ereignis-Blöcke)** – mehrere Stapel laufen gleichzeitig (z. B. eine Dauer-Animation *und* eine Sensor-Reaktion), ähnlich wie bei Lego Spike. Umgesetzt über kooperatives Multitasking mit `asyncio`.
- **Serieller Monitor** – `print()`-Ausgaben des Boards live im Browser sehen
- **REPL-Eingabe** – manuelle Befehle direkt ins Board schicken
- **KI-Agenten (optional)** – über einen MCP-Server können Claude, Codex oder lokale Modelle Blöcke im Editor bauen, das Board starten und die Konsole lesen (siehe unten)
- **Keine Installation** – `index.html` im Browser öffnen, fertig

---

## Schnellstart

1. Editor per lokalem Web-Server ausliefern, z. B. `python3 -m http.server 8001` im Editor-Verzeichnis, und `http://localhost:8001` in Chrome oder Edge öffnen
2. **Firmware installieren** (nur bei leerem Pico): **BOOTSEL gedrückt halten** und per USB-C anstecken (das Laufwerk `RP2040`/`RPI-RP2` erscheint) → „⚡ Firmware" im Header → Bootloader-Laufwerk wählen → **Flashen**. Der Bootloader verifiziert das UF2-Image (SHA-256-Prüfdaten aus dem generierten Manifest) und startet automatisch in die neue Firmware.
3. Board per USB-C anschließen (Normalbetrieb)
4. **Board einrichten** – Header-Button „📦 Libs prüfen": Beim ersten Mal das Board-Laufwerk `CIRCUITPY` wählen. Der Editor lädt danach alle benötigten Bibliotheken (`makerspaceos.py`, `asyncio`, `adafruit_ticks`, je nach Blöcken `adafruit_dht`, `neopixel`, …) per `fetch()` von dem Server herunter, der die Seite ausliefert, kopiert sie nach `CIRCUITPY/lib/` und startet das Board per serieller Verbindung neu – kein lokaler Repo-Checkout nötig, ein leeres Board wird so komplett bespielt. Der Button wird grün („Libs aktuell") – fertig. Liegt das Board nicht aktuell, wird der Button rot („Jetzt aktualisieren").
5. Blöcke zusammenstecken
6. **▶ Ausführen** klicken → Browser fragt nach Zugriff auf den seriellen Port → Board auswählen
7. Programm läuft auf dem Board; Ausgaben erscheinen im Seriellen Monitor

> **Ohne serialen Port / ohne File System Access API / Seite unter `file://` geöffnet?** `lib/` manuell oder per `scripts/sync_lib.sh` auf `CIRCUITPY/lib/` kopieren und danach das Board neu starten (USB trennen & neu stecken).

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
  lib_manifest.js    – generiertes lib/-Manifest (libVersion für den Board-Libs-Button)
  board_setup.js     – Board-Libs-Button: Versions-Check + lib/-Installation + Auto-Reboot
  firmware_manifest.js – generierte UF2-Firmware-Liste (Name + Größe + SHA-256)
  firmware_flash.js  – UF2-Firmware-Dialog: BOOTSEL-Laufwerk wählen + verifiziertes Flashen
  agent/             – Brücke für den MCP-Server (lädt nur mit ?agent=1)
mcp/                 – MCP-Server für KI-Agenten (Node, nur Dev-Werkzeug)
firmware/            – UF2-Images (Pico) + ESP32 .bin (nicht per UF2 flashbar)
```

---

## Roadmap

- **Phase 2.5** – Code direkt als `code.py` auf CIRCUITPY speichern (File System Access API)
- **Phase 3** – Projekte speichern/laden, Board-Auswahl
- **Phase 4** – OLED-Display, weitere Sensoren, Notenblöcke, Lernmodus

---

## Lizenz

Dieses Projekt ist für den Einsatz in Bildung und Maker-Communities gedacht. Lizenz folgt.
