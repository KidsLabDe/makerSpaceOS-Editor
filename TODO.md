# makerSpaceOS – TODO & Ideen

## ✅ Phase 2 – Serial-Verbindung (erledigt)
- [x] Web Serial API implementiert (serial.js)
- [x] "▶ Ausführen" Button: Code per Raw REPL auf Board laden und starten
- [x] "⏹ Stopp" Button: Ctrl+C über Serial
- [x] Serieller Monitor: Live-Output von `print()` anzeigen
- [x] Eingabefeld im Serial Monitor: manuelle REPL-Befehle senden
- [x] **Praxistest mit echtem MAKER-PI-RP2040 noch ausstehend**

## Phase 2.5 – Code persistent speichern
- [x] **"💾 Als code.py speichern"** via File System Access API
  - Browser öffnet Dateipicker → User wählt CIRCUITPY-Laufwerk
  - `code.py` wird direkt auf das Laufwerk geschrieben
  - CircuitPython erkennt Änderung und startet automatisch neu
  - Kein `boot.py`-Setup nötig, kein Serial erforderlich
  - Gleiche Browser-Voraussetzung: Chrome/Edge
  - Referenz: so macht es auch code.circuitpython.org

## Phase 3 – Projekte & Usability
- [x] Projekte speichern/laden (localStorage + Blockly XML Export/Import)

- [ ] "Neues Projekt" Button (leert Workspace, behält Startblöcke)

  





## Offen / Ideen
- [ ] GitHub Pages: README mit Screenshot und Kurzanleitung ergänzen

- [ ] Generische Digital AN / AUS und Analog LESEN / SETZEN blöcke - Brauchen wir da einen PULLUP / PULLDOWN init? oder ein INPUT oder OUTPUT init?

- [ ] helligkeit - ist verkehrtherum 99% ist sehr dunkel und 5% ist hell....

- [ ] Motor Testen

- [ ] Schrittmotor programmieren (2 groove ports)  Set bestehend aus einem 28BYJ48 Schrittmotor und einem Treiberboard ULN2003 Der 28BYJ48 ist ein kleiner DC 5V 4-Phasen Schrittmotor mit 5  Anschlussleitungen. Zum Ansteuern enthält dieses Set ein ULN2003  Treiberboard welches direkt an einen Arduino angeschlossen wird.

- [ ] Schrittmotor testen 

- [ ] fasse alle featiures und kompontenten mal zusammen

- [ ] aktualisiere die komponten in ../kom

  
