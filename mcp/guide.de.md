# makerSpaceOS – Leitfaden für KI-Agenten

makerSpaceOS ist eine Blockly-IDE für Kinder und Einsteiger: Blöcke → CircuitPython für Boards
(MAKER-PI-RP2040, Wemos S2 Mini, ESP32 D1 R32). Zielgruppe: Kinder – einfache, klare Programme.

## Regeln (verbindlich)
1. **Nur mit Blöcken arbeiten.** Programme werden ausschließlich über Block-Werkzeuge geändert
   (`add_block`, `connect_blocks`, `set_field`, `set_workspace` …). Es gibt kein Werkzeug, das Python
   schreibt – und du darfst den Nutzer nie bitten oder empfehlen, Python selbst zu ändern.
2. **Code ist nur zum Lesen und Debuggen** (`get_python`, `get_code_editor`). Nie als „Lösungsvorschlag“ Code liefern.
3. **Nicht mit Blöcken lösbar?** (falscher generierter Code, fehlender Block, Fehler in einer lib/dem Generator)
   → `prepare_bug_report` aufrufen und den Nutzer bitten, den Bericht bei **kidslab.de** oder
   **https://github.com/KidsLabDe/makerSpaceOS-Editor/issues** zu melden. Nichts umgehen.
4. **Verbindung prüfen:** vor `run`, `stop` und Konsolen-Werkzeugen `connection_status`. Nicht verbunden →
   `connect`; klappt das nicht, den Nutzer bitten, einmal selbst „Verbinden“ zu klicken (Browser-Regel).
5. **Nie „läuft“ melden ohne Konsole:** nach `run` mit `get_console`/`wait_for_output` auf Fehler prüfen
   (`Traceback|Error`).
6. **Erst nachschlagen, dann bauen:** `list_blocks` → `describe_block` (Feldnamen, gültige Dropdown-Werte)
   → bauen → `validate`. Blöcke nie raten.
7. **Nutzerarbeit schützen:** Vor `set_workspace`/`clear_workspace` bei vorhandenem Programm nachfragen.
   Der alte Stand liegt im Editor-Verlauf (`list_versions`/`restore_version`).
8. Blöcke mit Warnungen oder lose herumliegende Blöcke (ohne SETUP/FÜR IMMER/Ereignis) laufen nicht: beheben.

## Wichtige Fakten
- **Ausführungsmodell:** `SETUP` läuft einmal, `FÜR IMMER`, `parallel` und `wenn …`-Ereignisse laufen gleichzeitig
  (asyncio, Laufzeit `lib/makerspaceos.py`). Wartezeiten sind `await asyncio.sleep`, nie `time.sleep`.
- **Grove-Ports** (1…7 beim MAKER-PI): 3,3 V. Analog nur Ports 5/6/7. Drehgeber nur Ports mit Nachbar-Pins (1, 2, 3, 4, 6).
- **Boards** blenden Blöcke aus (S2 Mini: kein Motortreiber/Onboard-NeoPixel/Taster) – `get_board_info` nutzen.
- Der Editor läuft in Chrome/Edge (Web Serial). Ausführen ohne Neustart; Libs liegen unter `CIRCUITPY/lib/`.
- Block-Positionen zählen ab 1 (Listen). Namen von Variablen: keine Leerzeichen/Umlaute.

## Ablauf
`get_project_guide` → `connection_status` → `list_blocks`/`describe_block` → Blöcke bauen → `validate` →
`run` → `get_console`/`wait_for_output` → bei Fehlern: mit Blöcken korrigieren oder `prepare_bug_report`.
