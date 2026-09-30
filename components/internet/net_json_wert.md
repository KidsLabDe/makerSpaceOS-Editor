---
id: net_json_wert
blockCategory: Internet
subCategory: Experten
requiresBoardFeature: wifi
label: "Wert aus Daten"
label_en: "value from data"
colour: "#7C3AED"
tooltip: "Holt einen Wert aus JSON-Daten. Pfad mit Punkten, Zahlen sind Listenplätze (0 = erster, -1 = letzter)."
tooltip_en: "Gets a value from JSON data. Path with dots, numbers are list positions (0 = first, -1 = last)."
blockType: value
output: Any
inputs:
  - label: "Wert aus"
    label_en: "value from"
valueInputs:
  - name: DATEN
    check: Any
  - name: PFAD
    label: "Pfad"
    label_en: "path"
    check: String
    defaultValue: "current.temperature_2m"
generator:
  imports:
    - "from makerspaceos_netz import json_wert"
  expression: "json_wert(${DATEN}, ${PFAD})"
  order: FUNCTION_CALL
legacyGenerator: false
---

# Wert aus Daten

Sucht in verschachtelten JSON-Daten einen einzelnen Wert. Der **Pfad** besteht
aus Namen und Zahlen, getrennt durch Punkte:

| Pfad | bedeutet |
|---|---|
| `current.temperature_2m` | im Bereich „current“ der Wert „temperature_2m“ |
| `items.0.name` | aus der Liste „items“ der **erste** Eintrag, davon „name“ |
| `werte.-1` | der **letzte** Eintrag der Liste „werte“ |

Gibt es den Pfad nicht, liefert der Block `None` und schreibt in die Konsole,
welcher Teil gefehlt hat.

<!-- lang:en -->

# value from data

Finds a single value in nested JSON data. The **path** consists of names and
numbers separated by dots:

| Path | means |
|---|---|
| `current.temperature_2m` | in the "current" section the value "temperature_2m" |
| `items.0.name` | from the list "items" the **first** entry, of that "name" |
| `werte.-1` | the **last** entry of the list "werte" |

If the path does not exist, the block returns `None` and writes to the console
which part was missing.
