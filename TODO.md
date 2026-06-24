# makerSpaceOS – TODO & Ideen

## ✅ Phase 2 – Serial-Verbindung (erledigt)
- [x] Web Serial API implementiert (serial.js)
- [x] "▶ Ausführen" Button: Code per Raw REPL auf Board laden und starten
- [x] "⏹ Stopp" Button: Ctrl+C über Serial
- [x] Serieller Monitor: Live-Output von `print()` anzeigen
- [x] Eingabefeld im Serial Monitor: manuelle REPL-Befehle senden
- [ ] **Praxistest mit echtem MAKER-PI-RP2040 noch ausstehend**

## Phase 2.5 – Code persistent speichern
- [ ] **"💾 Als code.py speichern"** via File System Access API
  - Browser öffnet Dateipicker → User wählt CIRCUITPY-Laufwerk
  - `code.py` wird direkt auf das Laufwerk geschrieben
  - CircuitPython erkennt Änderung und startet automatisch neu
  - Kein `boot.py`-Setup nötig, kein Serial erforderlich
  - Gleiche Browser-Voraussetzung: Chrome/Edge
  - Referenz: so macht es auch code.circuitpython.org

## Phase 3 – Projekte & Usability
- [ ] Projekte speichern/laden (localStorage + Blockly XML Export/Import)
- [ ] "Neues Projekt" Button (leert Workspace, behält Startblöcke)
- [ ] Board-Profil-Auswahl (MAKER-PI-RP2040 vs. Generisch mit freien Pins)

## Phase 4 – Mehr Blöcke
- [ ] OLED Display SSD1306 (Text anzeigen, Pixel setzen)
- [ ] I2C Temperatursensor (z.B. BMP280)
- [ ] Einzelne NeoPixel-Farben via RGB-Schieberegler
- [ ] Töne nach Notenname (C4, D4, ... statt Hz-Eingabe)
- [ ] Lernmodus: Schritt-für-Schritt Anleitungen zu Beispielprojekten

## Design
- [ ] Farben der Blöcke überarbeiten

## Offen / Ideen
- [ ] GitHub Pages: README mit Screenshot und Kurzanleitung ergänzen
- [ ] Mobile-freundliches Layout (Tablets im Unterricht)
- [ ] Mehrsprachigkeit (EN) für internationale Nutzung
