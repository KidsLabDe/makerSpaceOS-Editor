---
id: net_internet_da
blockCategory: Internet
subCategory: WLAN
requiresBoardFeature: wifi
label: "Internet erreichbar?"
label_en: "Internet reachable?"
colour: "#7C3AED"
tooltip: "Wahr, wenn wirklich eine Internetseite abgerufen werden kann. Wird höchstens alle 30 Sekunden neu geprüft."
tooltip_en: "True if a web page can really be fetched. Re-checked at most every 30 seconds."
blockType: value
output: Boolean
inputs:
  - label: "Internet erreichbar?"
    label_en: "Internet reachable?"
generator:
  imports:
    - "from makerspaceos_netz import internet_da"
  expression: "internet_da()"
  order: FUNCTION_CALL
legacyGenerator: false
---

# Internet erreichbar?

Ruft eine winzige Testseite ab und prüft die Antwort. So merkt der Block auch,
wenn das WLAN eine Anmeldeseite vorschaltet (dann: falsch).

Das Ergebnis wird 30 Sekunden lang gemerkt – du kannst den Block also ruhig in
einer Schleife benutzen. Beim echten Test wartet das Board kurz (höchstens
5 Sekunden).

<!-- lang:en -->

# Internet reachable?

Fetches a tiny test page and checks the answer. This way the block also notices
when the Wi-Fi puts a login page in front (then: false).

The result is remembered for 30 seconds – so it is fine to use the block in a
loop. During the real test the board waits briefly (at most 5 seconds).
