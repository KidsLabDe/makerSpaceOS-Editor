# makerSpaceOS MCP-Server

Lässt KI-Agenten (Claude, Codex, lokale Modelle mit MCP-Client) **Blöcke** im laufenden Editor bauen,
das Board starten und die Konsole lesen. Wissen aus der Bibliothek/dem Wiki ist eingebaut.
Lets AI agents build **blocks** in the running editor, run them on the board and read the console.

**Regel / Rule:** Programme ändern sich nur über Blöcke. Python ist nur lesbar (`get_python`, `get_code_editor`);
es gibt kein Werkzeug, das Code schreibt, das Code-Feld bearbeitet oder fremden Code ausführt.
Nicht mit Blöcken lösbar → `prepare_bug_report` → kidslab.de / https://github.com/KidsLabDe/makerSpaceOS-Editor/issues.

## Einrichten / Setup
```sh
cd mcp && npm install            # nur dieses Dev-Tool; die App selbst bleibt ohne npm
python3 -m http.server 8000      # Editor ausliefern (im Repo-Root), file:// geht nicht
```
MCP-Client eintragen (Pfad anpassen):
```sh
claude mcp add makerspaceos -- node /pfad/zu/makerSpaceOS-Editor/mcp/server.js     # Claude Code
```
```toml
# Codex: ~/.codex/config.toml
[mcp_servers.makerspaceos]
command = "node"
args = ["/pfad/zu/makerSpaceOS-Editor/mcp/server.js"]
```
Lokale Modelle: jeder MCP-fähige Client (z. B. Goose, Open WebUI via mcpo) mit demselben Befehl (stdio).

Dann den Agenten `get_editor_url` aufrufen lassen und die URL in **Chrome/Edge** öffnen
(`…/index.html?agent=1&port=8765&token=…`). Unten links erscheint „🤖 Agent verbunden“.
Ohne `?agent=1` ist die Brücke aus – normaler Betrieb bleibt unberührt.

| Variable | Default | Zweck |
|---|---|---|
| `MAKERSPACEOS_PORT` | `8765` | WebSocket-Port (nur 127.0.0.1) |
| `MAKERSPACEOS_EDITOR_URL` | `http://localhost:8000/index.html` | Basis der Editor-URL |
| `MAKERSPACEOS_TOKEN` | Datei `mcp/.agent_token` (automatisch, gitignored) | Geheimnis für die Verbindung |
| `MAKERSPACEOS_LANG` | `de` | Startsprache; danach folgt sie dem Editor |

## Werkzeuge
- **Wissen:** `get_project_guide` (zuerst!), `list_categories`, `list_blocks`, `describe_block`, `get_board_info`, `search_docs`, `get_doc`; Ressourcen `makerspaceos://guide`, `makerspaceos://docs/<name>`
- **Blöcke:** `get_workspace` (outline/json), `set_workspace`, `add_block`, `connect_blocks`, `move_block`, `delete_block`, `set_field`, `clear_workspace`, `undo`, `validate`, `list_versions`, `restore_version`, `screenshot`
- **Code (nur lesen):** `get_python`, `get_code_editor`
- **Board:** `connection_status`, `connect`, `run`, `stop`, `get_console`, `wait_for_output`, `get_js_console`
- **Fehler melden:** `prepare_bug_report` (sendet nichts – der Nutzer prüft und meldet selbst)

Erinnerungen (Verbindung prüfen, nur Blöcke, Konsole prüfen …) stehen in `rules.js` (DE/EN) und werden
an Werkzeug-Ergebnisse angehängt.

## Grenzen
- Das erste Verbinden braucht einen echten Klick auf „Verbinden“ (Web-Serial-Regel); danach kann `connect` den freigegebenen Port ohne Dialog öffnen.
- Lib-Installation und Firmware-Flashen bleiben beim Menschen.
- Tests: `npm test` (Server + gefälschter Editor). `node e2e.mjs` = manueller Test gegen den echten Editor (siehe Kopfkommentar).
