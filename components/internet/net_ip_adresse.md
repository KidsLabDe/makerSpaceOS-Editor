---
id: net_ip_adresse
blockCategory: Internet
subCategory: WLAN
requiresBoardFeature: wifi
label: "IP-Adresse"
label_en: "IP address"
colour: "#7C3AED"
tooltip: "Die IP-Adresse des Boards im WLAN als Text, oder keine"
tooltip_en: "The board's IP address in the Wi-Fi network as text, or keine (none)"
blockType: value
output: String
inputs:
  - label: "IP-Adresse"
    label_en: "IP address"
generator:
  imports:
    - "from makerspaceos_netz import ip_adresse"
  expression: "ip_adresse()"
  order: FUNCTION_CALL
legacyGenerator: false
---

# IP-Adresse

Die Adresse, unter der das Board im WLAN erreichbar ist, z. B. `192.168.1.42`.
Ohne Verbindung kommt der Text `keine` zurück.

<!-- lang:en -->

# IP address

The address of the board in the Wi-Fi network, e.g. `192.168.1.42`. Without a
connection the text `keine` (none) is returned.
