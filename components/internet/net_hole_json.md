---
id: net_hole_json
blockCategory: Internet
subCategory: Experten
requiresBoardFeature: wifi
label: "hole JSON von URL"
label_en: "get JSON from URL"
colour: "#7C3AED"
tooltip: "Ruft eine Internetadresse ab und liefert die ganze JSON-Antwort. Höchstens alle 30 Sekunden ein echter Abruf."
tooltip_en: "Fetches an internet address and returns the whole JSON answer. At most one real fetch every 30 seconds."
blockType: value
output: Any
inputs:
  - label: "hole JSON von"
    label_en: "get JSON from"
valueInputs:
  - name: URL
    check: String
    defaultValue: "https://api.open-meteo.com/v1/forecast?latitude=48.37&longitude=10.9&current=temperature_2m"
generator:
  imports:
    - "from makerspaceos_netz import hole_json"
  expression: "hole_json(${URL})"
  order: FUNCTION_CALL
legacyGenerator: false
---

# hole JSON von URL

Für Fortgeschrittene: ruft **irgendeine** Internetadresse ab, die JSON liefert,
und gibt die ganze Antwort zurück. Einen einzelnen Wert daraus holst du mit dem
Block **Wert aus … Pfad …**.

- Frag nur das an, was du brauchst – große Antworten passen nicht in den
  Speicher des Boards (dann kommt `None` und in der Konsole steht
  „zu wenig Speicher“).
- Höchstens alle 30 Sekunden ein echter Abruf, dazwischen die gespeicherte
  Antwort.
- Nur Dienste **ohne** Anmeldung/API-Schlüssel.

<!-- lang:en -->

# get JSON from URL

For advanced users: fetches **any** internet address that delivers JSON and
returns the whole answer. Get a single value out of it with the
**value from … path …** block.

- Only request what you need – large answers don't fit into the board's memory
  (then you get `None` and the console says "zu wenig Speicher").
- At most one real fetch every 30 seconds, the stored answer in between.
- Only services **without** login/API key.
