---
id: net_python_auswerten
blockCategory: Internet
subCategory: Experten
requiresBoardFeature: wifi
label: "werte aus mit Python"
label_en: "evaluate with Python"
colour: "#7C3AED"
tooltip: "Expertenblock: eigener Python-Code wertet die Daten aus (Variable daten) und gibt mit return ein Ergebnis zurück. Fehler liefern None."
tooltip_en: "Expert block: your own Python code evaluates the data (variable daten) and returns a result with return. Errors give None."
blockType: value
output: Any
inputs:
  - label: "werte aus mit Python"
    label_en: "evaluate with Python"
  - name: CODE
    fieldType: multiline_text
    default: "return daten[\"current\"][\"temperature_2m\"]"
valueInputs:
  - name: DATEN
    label: "Daten"
    label_en: "data"
    check: Any
legacyGenerator: true
---

# werte aus mit Python

**Expertenblock.** Hier schreibst du ein paar Zeilen Python, die die Daten
auswerten. Die Daten stehen in der Variable `daten`, dein Ergebnis gibst du mit
`return` zurück:

```python
werte = daten["hourly"]["temperature_2m"]
return max(werte)
```

- Der Editor macht daraus eine Funktion `def auswerten_…(daten):` und rückt
  deinen Code automatisch ein.
- Passiert ein Fehler, liefert der Block `None` und der Fehler steht in der
  Konsole – das Programm läuft weiter.
- Kopierten Code, den du nicht verstehst, bitte nicht hier einfügen: Der normale
  Weg sind die Blöcke **Wert aus … Pfad …**. Dieser Block ist ein Ausweg, wenn
  die Blöcke nicht reichen.

<!-- lang:en -->

# evaluate with Python

**Expert block.** Write a few lines of Python here that evaluate the data. The
data is in the variable `daten`, return your result with `return`:

```python
werte = daten["hourly"]["temperature_2m"]
return max(werte)
```

- The editor turns this into a function `def auswerten_…(daten):` and indents
  your code automatically.
- If an error happens, the block returns `None` and the error is shown in the
  console – the program keeps running.
- Please don't paste copied code you don't understand here: the normal way are
  the **value from … path …** blocks. This block is a way out when the blocks
  are not enough.
