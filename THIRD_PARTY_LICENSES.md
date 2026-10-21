# Fremde Bestandteile

Der Editor enthält folgende Bestandteile anderer Projekte. Sie behalten ihre
eigenen Lizenzen; die Volltexte liegen in [`LICENSES/`](LICENSES/).

## Im Browser

| Bestandteil | Pfad | Urheber | Lizenz |
|---|---|---|---|
| Blockly | `vendor/blockly/` | Google LLC | [Apache-2.0](LICENSES/Apache-2.0.txt) |
| CodeMirror 5.65.16 | `vendor/codemirror/` | Marijn Haverbeke und Mitwirkende | [MIT](LICENSES/MIT.txt) |
| Inter (Schrift) | `css/fonts/inter-*.woff2` | The Inter Project Authors (Rasmus Andersson) | [SIL OFL 1.1](LICENSES/OFL-1.1.txt) |
| Pixelify Sans (Schrift) | `css/fonts/pixelify-*.woff2` | The Pixelify Sans Project Authors (Stefie Justprince) | [SIL OFL 1.1](LICENSES/OFL-1.1.txt) |
| monofur (Schrift) | `css/fonts/monofur-*.woff` | Tobias Benjamin Köhler | Freeware – Lizenz noch zu klären |

## Auf dem Board

| Bestandteil | Pfad | Urheber | Lizenz |
|---|---|---|---|
| CircuitPython (Firmware) | `firmware/*.uf2`, `firmware/*.bin` | Damien P. George, Adafruit Industries und Mitwirkende | [MIT](LICENSES/MIT.txt) |
| Adafruit CircuitPython-Bibliotheken: `adafruit_bus_device`, `adafruit_display_text`, `adafruit_motor`, `adafruit_register`, `adafruit_dht`, `adafruit_icm20x`, `adafruit_ticks`, `asyncio`, `neopixel` | `lib/` | Adafruit Industries und Mitwirkende | [MIT](LICENSES/MIT.txt) |
| TM1637-Treiber (kompiliert) | `lib/tm1637_display.mpy` | unbekannt | Herkunft noch zu klären |

Die Copyright-Hinweise der einzelnen Autoren stehen in den jeweiligen
Quelldateien bzw. in den Original-Repositories
(<https://github.com/adafruit/circuitpython>, <https://github.com/adafruit>).

Alle übrigen Dateien in `lib/` (z. B. `makerspaceos.py`, `grove_rgb_lcd.py`,
`sr04.py`, `gc9a01.py`) sind Eigenentwicklungen und stehen unter der
[MIT-Lizenz](LICENSE) des Projekts.
