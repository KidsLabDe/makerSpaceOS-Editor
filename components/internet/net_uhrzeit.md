---
id: net_uhrzeit
blockCategory: Internet
subCategory: Uhrzeit
requiresBoardFeature: wifi
label: "Uhrzeit"
label_en: "Clock"
colour: "#7C3AED"
tooltip: "Teil der aktuellen Uhrzeit (deutsche Zeit, mit Sommerzeit). Die Uhr wird einmal über das Internet gestellt."
tooltip_en: "Part of the current time (German time incl. daylight saving). The clock is set once via the internet."
blockType: value
output: Number
inputs:
  - label: "Uhrzeit:"
    label_en: "clock:"
    name: TEIL
    fieldType: dropdown
    options:
      - label: "Stunde"
        label_en: "hour"
        value: stunde
      - label: "Minute"
        label_en: "minute"
        value: minute
      - label: "Sekunde"
        label_en: "second"
        value: sekunde
      - label: "Tag"
        label_en: "day"
        value: tag
      - label: "Monat"
        label_en: "month"
        value: monat
      - label: "Jahr"
        label_en: "year"
        value: jahr
      - label: "Wochentag (1 = Montag)"
        label_en: "weekday (1 = Monday)"
        value: wochentag
generator:
  imports:
    - "from makerspaceos_netz import uhrzeit"
  expression: "uhrzeit(\"${TEIL}\")"
  order: FUNCTION_CALL
legacyGenerator: false
---

# Uhrzeit

Das Board hat eine eingebaute Uhr, die aber nach jedem Start falsch geht. Beim
ersten Benutzen dieses Blocks stellt das Board sie über das Internet (NTP) –
danach läuft sie von allein weiter und wird alle 6 Stunden neu gestellt.

- Deutsche Zeit, Sommer- und Winterzeit werden automatisch berücksichtigt.
- **Wochentag:** 1 = Montag … 7 = Sonntag.
- Solange die Uhr noch nicht gestellt ist (kein WLAN), liefert der Block
  **nichts** (`None`).
- Manche Schulnetze sperren NTP. Dann holt sich das Board die Uhrzeit aus der
  Antwort einer Webseite (auf die Sekunde genau reicht das nicht ganz).

Idee: Pausen-Gong – um 9:45 Uhr spielt der Summer eine Melodie.

<!-- lang:en -->

# Clock

The board has a built-in clock, but it is wrong after every start. The first
time this block is used, the board sets it via the internet (NTP) – after that
it keeps running on its own and is re-set every 6 hours.

- German time; summer and winter time are handled automatically.
- **Weekday:** 1 = Monday … 7 = Sunday.
- As long as the clock has not been set (no Wi-Fi), the block returns
  **nothing** (`None`).
- Some school networks block NTP. Then the board takes the time from a web
  page's response (not quite accurate to the second).

Idea: break bell – at 9:45 the buzzer plays a tune.
