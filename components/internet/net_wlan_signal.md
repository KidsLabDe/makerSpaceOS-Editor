---
id: net_wlan_signal
blockCategory: Internet
subCategory: WLAN
requiresBoardFeature: wifi
label: "WLAN-Signalstärke (dBm)"
label_en: "Wi-Fi signal strength (dBm)"
colour: "#7C3AED"
tooltip: "Wie stark das WLAN empfangen wird: -50 sehr gut, -70 ok, -85 schwach. Ohne Verbindung -100."
tooltip_en: "How strong the Wi-Fi signal is: -50 very good, -70 ok, -85 weak. Without a connection -100."
blockType: value
output: Number
inputs:
  - label: "WLAN-Signalstärke (dBm)"
    label_en: "Wi-Fi signal strength (dBm)"
generator:
  imports:
    - "from makerspaceos_netz import wlan_signal"
  expression: "wlan_signal()"
  order: FUNCTION_CALL
legacyGenerator: false
---

# WLAN-Signalstärke

Die Empfangsstärke in dBm – das sind **negative** Zahlen:

| Wert | Bedeutung |
|---|---|
| -30 bis -55 | sehr gut |
| -55 bis -70 | gut |
| -70 bis -85 | schwach |
| -100 | keine Verbindung |

Idee: Den Wert auf dem LCD anzeigen und mit dem Board herumlaufen.

<!-- lang:en -->

# Wi-Fi signal strength

The received signal strength in dBm – these are **negative** numbers:

| Value | Meaning |
|---|---|
| -30 to -55 | very good |
| -55 to -70 | good |
| -70 to -85 | weak |
| -100 | no connection |

Idea: show the value on the LCD and walk around with the board.
