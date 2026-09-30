---
id: net_wlan_verbunden
blockCategory: Internet
subCategory: WLAN
requiresBoardFeature: wifi
label: "WLAN verbunden?"
label_en: "Wi-Fi connected?"
colour: "#7C3AED"
tooltip: "Wahr, wenn das Board mit einem WLAN verbunden ist. Sagt nichts darüber, ob das Internet erreichbar ist."
tooltip_en: "True if the board is connected to a Wi-Fi network. Says nothing about whether the internet is reachable."
blockType: value
output: Boolean
inputs:
  - label: "WLAN verbunden?"
    label_en: "Wi-Fi connected?"
generator:
  imports:
    - "from makerspaceos_netz import wlan_verbunden"
  expression: "wlan_verbunden()"
  order: FUNCTION_CALL
legacyGenerator: false
---

# WLAN verbunden?

Wahr, sobald das Board in einem WLAN angemeldet ist. Die Zugangsdaten stehen in
der Datei `settings.toml` auf dem Board – im Editor über **WLAN einrichten**.

Achtung: *Verbunden* heißt noch nicht *im Internet*. In WLANs mit Anmeldeseite
(Hotel, manche Schulen) ist das Board verbunden, kommt aber nicht raus – dafür
gibt es den Block **Internet erreichbar?**.

Es funktionieren nur WLANs mit normalem Passwort (WPA2-Personal) oder ein
Handy-Hotspot. Schul-WLANs mit Benutzername und Passwort (802.1X) gehen nicht.

<!-- lang:en -->

# Wi-Fi connected?

True as soon as the board is logged into a Wi-Fi network. The credentials are
stored in the file `settings.toml` on the board – in the editor via **Wi-Fi setup**.

Note: *connected* does not mean *on the internet*. In networks with a login page
(hotels, some schools) the board is connected but cannot get out – use the
**Internet reachable?** block for that.

Only networks with a normal password (WPA2-Personal) or a phone hotspot work.
School networks with user name and password (802.1X) do not.
