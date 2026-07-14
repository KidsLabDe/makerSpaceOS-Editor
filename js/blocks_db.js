// js/blocks_db.js – GENERIERT von scripts/build_blocks.js
// Nicht manuell bearbeiten! Neu generieren: node scripts/build_blocks.js
// Generiert: 2026-07-14T13:31:06.932Z

const BLOCKS_CATALOG = {
  "categories": [
    {
      "id": "Sensoren",
      "label": "Sensoren",
      "colour": "#2563EB",
      "subCategories": [
        "Temperatur & Feuchte",
        "Abstand & Licht",
        "Bewegung",
        "Weitere",
        "Ereignisse"
      ]
    },
    {
      "id": "Aktionen",
      "label": "Aktionen",
      "colour": "#DC2626",
      "subCategories": [
        "LED",
        "Ton",
        "Servo & Pumpe",
        "Motor"
      ]
    },
    {
      "id": "Lichter",
      "label": "Lichter",
      "colour": "#EC4899",
      "subCategories": [
        "Onboard",
        "Streifen"
      ]
    },
    {
      "id": "Anzeigen",
      "label": "Anzeigen",
      "colour": "#0D9488",
      "subCategories": []
    },
    {
      "id": "Pins",
      "label": "Pins",
      "colour": "#64748B",
      "subCategories": []
    }
  ]
};

const BLOCKS_DB = [
  {
    "id": "sensor_dht11_humidity",
    "blockCategory": "Sensoren",
    "subCategory": "Temperatur & Feuchte",
    "label": "DHT11 Luftfeuchte (%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Luftfeuchtigkeit in % vom DHT11 Sensor (KY-015)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "DHT11 Luftfeuchte (%)  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import adafruit_dht"
      ],
      "defs": [
        {
          "key": "init_dht11_${PIN}",
          "val": "_dht11_${PIN} = adafruit_dht.DHT11(board.${PIN})"
        }
      ],
      "expression": "_dht11_${PIN}.humidity",
      "order": "MEMBER"
    },
    "hardware": {
      "kyNumber": "KY-015",
      "commonName": "DHT11",
      "verbrauch3j": 5,
      "kitStandard": true,
      "width_mm": 40,
      "height_mm": 20
    },
    "legacyGenerator": false,
    "_file": "sensors/dht11_humidity.md",
    "doc": "# DHT11 Luftfeuchtesensor\n\nMisst die relative Luftfeuchtigkeit in Prozent mit dem DHT11 Sensor."
  },
  {
    "id": "sensor_dht11_temperature",
    "blockCategory": "Sensoren",
    "subCategory": "Temperatur & Feuchte",
    "label": "DHT11 Temperatur (°C)",
    "colour": "#2563EB",
    "tooltip": "Liest die Temperatur in Grad Celsius vom DHT11 Sensor (KY-015)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "DHT11 Temperatur (°C)  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import adafruit_dht"
      ],
      "defs": [
        {
          "key": "init_dht11_${PIN}",
          "val": "_dht11_${PIN} = adafruit_dht.DHT11(board.${PIN})"
        }
      ],
      "expression": "_dht11_${PIN}.temperature",
      "order": "MEMBER"
    },
    "hardware": {
      "kyNumber": "KY-015",
      "commonName": "DHT11",
      "verbrauch3j": 5,
      "kitStandard": true,
      "width_mm": 40,
      "height_mm": 20
    },
    "legacyGenerator": false,
    "_file": "sensors/dht11_temperature.md",
    "doc": "# DHT11 Temperatursensor\n\nGünstiger Sensor für Temperatur und Luftfeuchtigkeit. Weniger genau als DHT22, aber gut für Einsteigerprojekte."
  },
  {
    "id": "sensor_ldr",
    "blockCategory": "Sensoren",
    "subCategory": "Abstand & Licht",
    "label": "Helligkeit (0–100%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Helligkeit in Prozent (0 = dunkel, 100 = hell)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Helligkeit (0–100%)  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "analog"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import analogio"
      ],
      "defs": [
        {
          "key": "init_ldr_${PIN}",
          "val": "_ldr_${PIN} = analogio.AnalogIn(board.${PIN})"
        }
      ],
      "expression": "round(_ldr_${PIN}.value / 65535 * 100)",
      "order": "FUNCTION_CALL"
    },
    "hardware": {
      "kyNumber": "KY-018",
      "commonName": "LDR / Fotowiderstand",
      "verbrauch3j": 9,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/ldr.md",
    "doc": "# Lichtsensor (LDR / KY-018)\n\nMisst die Umgebungshelligkeit als Prozentwert. 0 % = sehr dunkel, 100 % = sehr hell."
  },
  {
    "id": "sensor_ultrasonic",
    "blockCategory": "Sensoren",
    "subCategory": "Abstand & Licht",
    "label": "Abstand (cm)",
    "colour": "#2563EB",
    "tooltip": "Misst den Abstand in cm mit dem Grove-Ultraschall-Ranger (ein Signal-Pin)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Abstand (cm)  Port:",
        "name": "SIG",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "hardware": {
      "commonName": "Grove Ultrasonic Ranger",
      "verbrauch3j": 13,
      "kitStandard": true,
      "width_mm": 50,
      "height_mm": 25
    },
    "legacyGenerator": true,
    "_file": "sensors/ultrasonic.md",
    "doc": "# Grove Ultraschall-Abstandssensor\n\nMisst Abstände von ca. 2 cm bis 350 cm. Der Grove-Ranger nutzt **einen einzigen Signal-Pin**\n(Trigger und Echo teilen sich Pin 2 des Grove-Steckers). Generator: siehe `js/generator.js`."
  },
  {
    "id": "sensor_icm20948_g",
    "blockCategory": "Sensoren",
    "subCategory": "Bewegung",
    "label": "Beschleunigung (g)",
    "colour": "#2563EB",
    "tooltip": "Misst, wie stark der Sensor beschleunigt wird – in Ruhe ≈ 1,0 (Erdanziehung)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Beschleunigung (g)  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      }
    ],
    "hardware": {
      "commonName": "Adafruit ICM20948 (9-Achsen-IMU)",
      "verbrauch3j": 0,
      "kitStandard": false,
      "width_mm": 26,
      "height_mm": 18
    },
    "legacyGenerator": true,
    "_file": "sensors/icm20948_g.md",
    "doc": "# ICM20948 – Beschleunigung (g)\n\nLiefert die Gesamt-Beschleunigung als Zahl in g. In Ruhe zeigt der Sensor ≈ 1,0\n(Erdanziehung), beim Schütteln oder Aufprall deutlich mehr. Messbereich: bis ±16 g.\n\n## Beispiel\n\nBeim Schütteln leuchten die NeoPixel kurz rot, parallel wird der g-Wert jede Sekunde ausgegeben:\n\n![Beispielprogramm: Wenn bewegt (geschüttelt) + Beschleunigung ausgeben](../images/icm20948_beispiel.png)\n\n> Benötigt `adafruit_icm20x.mpy` und `adafruit_register/` auf `CIRCUITPY/lib/`\n> (Adafruit CircuitPython Bundle). Anschluss über Grove-I2C-Adapter, Adresse 0x69."
  },
  {
    "id": "sensor_icm20948_neigung",
    "blockCategory": "Sensoren",
    "subCategory": "Bewegung",
    "label": "Neigung (°)",
    "colour": "#2563EB",
    "tooltip": "Misst, wie weit der Sensor gekippt ist – in Grad (0 = waagerecht)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Neigung (°)",
        "name": "DIR",
        "fieldType": "tilt_dropdown"
      },
      {
        "label": "Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      }
    ],
    "hardware": {
      "commonName": "Adafruit ICM20948 (9-Achsen-IMU)",
      "verbrauch3j": 0,
      "kitStandard": false,
      "width_mm": 26,
      "height_mm": 18
    },
    "legacyGenerator": true,
    "_file": "sensors/icm20948_neigung.md",
    "doc": "# ICM20948 – Neigung (°)\n\nLiefert den Kippwinkel in Grad: „vor/zurück\" (−90…90) oder „links/rechts\" (−180…180).\n0 bedeutet waagerecht. Gut für Wasserwaagen, Balance-Spiele und Lenk-Steuerungen.\n\n> Benötigt `adafruit_icm20x.mpy` und `adafruit_register/` auf `CIRCUITPY/lib/`\n> (Adafruit CircuitPython Bundle). Anschluss über Grove-I2C-Adapter, Adresse 0x69."
  },
  {
    "id": "sensor_air_quality",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Luftqualität (0–100%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Luftverschmutzung in Prozent (0 = frische Luft, 100 = sehr schlechte Luft). Der Sensor braucht nach dem Einschalten ca. 20 Sekunden Aufwärmzeit.",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Luftqualität (0–100%)  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "analog"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import analogio"
      ],
      "defs": [
        {
          "key": "init_aq_${PIN}",
          "val": "_aq_${PIN} = analogio.AnalogIn(board.${PIN})"
        }
      ],
      "expression": "round(_aq_${PIN}.value / 65535 * 100)",
      "order": "FUNCTION_CALL"
    },
    "hardware": {
      "commonName": "Grove Air Quality Sensor v1.3",
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "sensors/air_quality.md",
    "doc": "# Grove Luftqualitätssensor v1.3\n\nMisst die Luftverschmutzung (Kohlenmonoxid, Alkohol, Aceton, Formaldehyd u.a.) als\nProzentwert: **0 % = frische Luft**, höhere Werte = schlechtere Luft. Typisch liegt\nfrische Luft bei ca. 5–10 %, ab ca. 20–30 % ist die Luft merklich verschmutzt.\n\n**Wichtig:** Der Sensor (MP503) braucht nach dem Einschalten ca. **20 Sekunden\nAufwärmzeit**, bevor die Werte stimmen. Anschluss an einen analogen Grove-Port."
  },
  {
    "id": "sensor_battery",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Batteriespannung (V)",
    "colour": "#2563EB",
    "tooltip": "Misst die Versorgungsspannung (VBAT) in Volt über GP29",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Batteriespannung (V)",
        "fieldType": "fixed_label"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import analogio"
      ],
      "defs": [
        {
          "key": "init_battery",
          "val": "_battery = analogio.AnalogIn(board.GP29)"
        }
      ],
      "expression": "round(_battery.value / 65535 * 3.3 * 2, 2)",
      "order": "FUNCTION_CALL"
    },
    "hardware": {
      "commonName": "Batterie-Messung (VBAT/2)",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/battery.md",
    "doc": "# Batteriespannung (GP29)\n\nMisst die Versorgungsspannung über den internen Spannungsteiler (GP29 = VBAT/2) und gibt\nsie in Volt zurück. Praktisch, um den Akkustand zu überwachen."
  },
  {
    "id": "sensor_bodenfeuchte",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Bodenfeuchte (0–100%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Bodenfeuchte in Prozent aus (0 = trocken, 100 = nass). Kapazitiver Sensor.",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Bodenfeuchte (0–100%)  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "analog"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import analogio"
      ],
      "defs": [
        {
          "key": "init_boden_${PIN}",
          "val": "_boden_${PIN} = analogio.AnalogIn(board.${PIN})"
        }
      ],
      "expression": "round(_boden_${PIN}.value / 65535 * 100)",
      "order": "FUNCTION_CALL"
    },
    "hardware": {
      "commonName": "Kapazitiver Bodenfeuchtesensor v1.2",
      "verbrauch3j": 4,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/bodenfeuchte.md",
    "doc": "# Bodenfeuchtesensor (kapazitiv)\n\nMisst die Feuchtigkeit in der Erde. Ideal für automatische Pflanzenbewässerung.\n\n**Wichtig:** Kapazitiver Sensor verwenden (nicht resistiv) – resistive Sonden korrodieren bei Dauernutzung.\n\n## Anschluss\n- AOUT → GP-Pin (analogfähig: GP26, GP27, GP28)\n- VCC → 3.3V oder 5V\n- GND → GND"
  },
  {
    "id": "sensor_encoder",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Drehgeber Position",
    "colour": "#2563EB",
    "tooltip": "Liest die Position des Drehgebers (positiv = rechts, negativ = links)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Drehgeber Position  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "hardware": {
      "commonName": "Grove Encoder / Drehgeber",
      "verbrauch3j": 0,
      "kitStandard": true,
      "width_mm": 21.5,
      "height_mm": 18.5
    },
    "legacyGenerator": true,
    "_file": "sensors/encoder.md",
    "doc": "# Drehgeber / Rotary Encoder (Grove)\n\nZählt Drehbewegungen (unbegrenzt). Positiver Wert = Rechtsdrehung, negativer Wert = Linksdrehung.\nNutzt beide Pins des Grove-Ports (Pin1 = CLK, Pin2 = DT). Generator: siehe `js/generator.js`."
  },
  {
    "id": "sensor_taster",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Taster gedrückt?",
    "colour": "#2563EB",
    "tooltip": "Gibt Wahr zurück, wenn der Taster gedrückt ist (Board-Taster B1/B2 oder externer Taster)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "Taster",
        "name": "BTN",
        "fieldType": "taster_dropdown"
      },
      {
        "label": "gedrückt?",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Taster / Drucktaster",
      "verbrauch3j": 28,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/taster.md",
    "doc": "# Taster gedrückt? (B1/B2 + externer Taster)\n\nGibt `Wahr` zurück wenn der ausgewählte Taster gedrückt ist.\n\n- **B1 (GP20) / B2 (GP21)**: Onboard-Taster des MAKER-PI-RP2040\n- **Grove 1–7**: Externer Taster (KY-004) am Signal-Pin des Grove-Ports"
  },
  {
    "id": "event_air_quality",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Luftqualität",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn die Luftverschmutzung einen Wert überschreitet/unterschreitet (0 = frisch, 100 = sehr schlecht)",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Luftqualität  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "analog"
      },
      {
        "name": "OP",
        "fieldType": "op_dropdown"
      },
      {
        "label": "%",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "VALUE",
        "check": "Number",
        "defaultValue": 30
      }
    ],
    "statementInput": {
      "name": "DO",
      "label": "dann"
    },
    "generator": {
      "imports": [
        "import board",
        "import analogio"
      ],
      "defs": [
        {
          "key": "init_aq_${PIN}",
          "val": "_aq_${PIN} = analogio.AnalogIn(board.${PIN})"
        }
      ],
      "code": "if round(_aq_${PIN}.value / 65535 * 100) ${OP} ${VALUE}:\n${DO}"
    },
    "hardware": {
      "commonName": "Grove Air Quality Sensor v1.3",
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "sensors/event_air_quality.md",
    "doc": "# Ereignis: Wenn Luftqualität\n\nFührt Aktionen aus, wenn die Luftverschmutzung einen Schwellwert über- oder\nunterschreitet (z.B. Lüfter an, wenn > 30 %)."
  },
  {
    "id": "event_button",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Taster",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn der Taster gedrückt oder losgelassen wird",
    "blockType": "event_simple",
    "inputs": [
      {
        "label": "Wenn Taster",
        "name": "BTN",
        "fieldType": "taster_dropdown"
      },
      {
        "name": "STATE",
        "fieldType": "state_dropdown"
      }
    ],
    "statementInput": {
      "name": "DO",
      "label": "→ dann"
    },
    "hardware": {
      "commonName": "Taster / Board-Taster",
      "verbrauch3j": 28,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/event_button.md",
    "doc": "# Ereignis: Wenn Taster (B1/B2 + extern)\n\nReagiert auf Drücken oder Loslassen eines Tasters."
  },
  {
    "id": "event_ldr",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Helligkeit",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn die Helligkeit einen Wert überschreitet/unterschreitet",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Helligkeit  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "analog"
      },
      {
        "name": "OP",
        "fieldType": "op_dropdown"
      },
      {
        "label": "%",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "VALUE",
        "check": "Number",
        "defaultValue": 50
      }
    ],
    "statementInput": {
      "name": "DO",
      "label": "dann"
    },
    "generator": {
      "imports": [
        "import board",
        "import analogio"
      ],
      "defs": [
        {
          "key": "init_ldr_${PIN}",
          "val": "_ldr_${PIN} = analogio.AnalogIn(board.${PIN})"
        }
      ],
      "code": "if round(_ldr_${PIN}.value / 65535 * 100) ${OP} ${VALUE}:\n${DO}"
    },
    "hardware": {
      "kyNumber": "KY-018",
      "commonName": "LDR",
      "verbrauch3j": 9,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/event_ldr.md",
    "doc": "# Ereignis: Wenn Helligkeit (LDR)\n\nFührt Aktionen aus, wenn die Helligkeit einen Schwellwert über- oder unterschreitet."
  },
  {
    "id": "event_temperature",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Temperatur",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn die Temperatur einen Wert überschreitet/unterschreitet",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Temperatur  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "name": "OP",
        "fieldType": "op_dropdown"
      }
    ],
    "valueInputs": [
      {
        "name": "VALUE",
        "check": "Number",
        "defaultValue": 25
      }
    ],
    "statementInput": {
      "name": "DO",
      "label": "dann"
    },
    "generator": {
      "imports": [
        "import board",
        "import adafruit_dht"
      ],
      "defs": [
        {
          "key": "init_dht_${PIN}",
          "val": "_dht_${PIN} = adafruit_dht.DHT22(board.${PIN})"
        }
      ],
      "code": "if _dht_${PIN}.temperature ${OP} ${VALUE}:\n${DO}"
    },
    "hardware": {
      "commonName": "DHT22",
      "verbrauch3j": 5,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/event_temperature.md",
    "doc": "# Ereignis: Wenn Temperatur (DHT22)\n\nFührt Aktionen aus, wenn die Temperatur einen Schwellwert über- oder unterschreitet."
  },
  {
    "id": "event_ultrasonic",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Abstand",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Abstand  Port:",
        "name": "SIG",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "name": "OP",
        "fieldType": "op_dropdown"
      },
      {
        "label": "cm",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "VALUE",
        "check": "Number",
        "defaultValue": 20
      }
    ],
    "statementInput": {
      "name": "DO",
      "label": "dann"
    },
    "hardware": {
      "commonName": "Grove Ultrasonic Ranger",
      "verbrauch3j": 13,
      "kitStandard": true,
      "width_mm": 50,
      "height_mm": 25
    },
    "legacyGenerator": true,
    "_file": "sensors/event_ultrasonic.md",
    "doc": "# Ereignis: Wenn Abstand (Grove Ultrasonic Ranger)\n\nFührt Aktionen aus, wenn der gemessene Abstand einen Schwellwert über- oder unterschreitet.\nSingle-Pin-Messung – Generator: siehe `js/generator.js`."
  },
  {
    "id": "actuator_led",
    "blockCategory": "Aktionen",
    "subCategory": "LED",
    "label": "LED",
    "colour": "#DC2626",
    "tooltip": "Schaltet eine LED ein oder aus",
    "blockType": "statement",
    "inputs": [
      {
        "label": "LED  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "name": "STATE",
        "fieldType": "on_off_dropdown"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import digitalio"
      ],
      "defs": [
        {
          "key": "init_led_${PIN}",
          "val": "_led_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_led_${PIN}.direction = digitalio.Direction.OUTPUT"
        }
      ],
      "code": "_led_${PIN}.value = ${STATE}\n"
    },
    "hardware": {
      "commonName": "LED",
      "verbrauch3j": 12,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "actuators/led.md",
    "doc": "# LED-Block\n\nSchaltet eine einfache LED (oder jeden anderen digitalen Ausgang) ein oder aus."
  },
  {
    "id": "actuator_led_blink",
    "blockCategory": "Aktionen",
    "subCategory": "LED",
    "label": "LED blinken",
    "colour": "#DC2626",
    "tooltip": "Lässt eine LED mehrmals blinken",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "LED  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "TIMES",
        "label": "blinken",
        "check": "Number",
        "defaultValue": 3
      },
      {
        "name": "PAUSE",
        "label": "mal, Pause",
        "check": "Number",
        "defaultValue": 0.5,
        "suffix": "Sek"
      }
    ],
    "hardware": {
      "commonName": "LED (blinkend)",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/led_blink.md",
    "doc": "# LED blinken\n\nLässt eine LED eine bestimmte Anzahl mal blinken."
  },
  {
    "id": "actuator_buzzer",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Buzzer Ton",
    "colour": "#DC2626",
    "tooltip": "Spielt einen Ton mit der angegebenen Frequenz (z.B. 440 = Kammerton A)",
    "blockType": "statement",
    "inline": true,
    "valueInputs": [
      {
        "name": "FREQ",
        "label": "Buzzer  Ton:",
        "check": "Number",
        "defaultValue": 440
      },
      {
        "name": "DURATION",
        "label": "Hz  für",
        "check": "Number",
        "defaultValue": 0.5,
        "suffix": "Sekunden"
      }
    ],
    "hardware": {
      "commonName": "Passiver Buzzer (Board-Pin GP22)",
      "verbrauch3j": 14,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/buzzer.md",
    "doc": "# Board-Buzzer (passiv, GP22)\n\nSpielt Töne mit einstellbarer Frequenz. Verwendet den eingebauten Buzzer auf GP22."
  },
  {
    "id": "actuator_buzzer_off",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Buzzer aus",
    "colour": "#DC2626",
    "tooltip": "Schaltet den Buzzer aus",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Buzzer  aus",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Buzzer aus",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/buzzer_off.md",
    "doc": "# Buzzer ausschalten"
  },
  {
    "id": "actuator_isd1820",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Ton abspielen",
    "colour": "#DC2626",
    "tooltip": "Spielt die Aufnahme des ISD1820-Sprachmoduls ab. ⚠ Benötigt das ISD1820-Zusatzmodul – nicht der eingebaute Lautsprecher!",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Ton abspielen  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "hardware": {
      "commonName": "ISD1820 Sprachmodul",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/isd1820.md",
    "doc": "# ISD1820 Sprachmodul (EX-ISD1820)\n\nNimmt Töne/Sprache auf und spielt sie wieder ab.\n\n**Verdrahtung (Grove-Port):**\n- P-E → Grove Signal-Pin\n- Vcc / GND → Grove VCC / GND\n- P-L und REC: offen lassen\n\n**Aufnahme:** REC-Knopf auf dem Modul gedrückt halten (max. 10 Sek.).  \n**Abspielen:** Block ausführen → P-E kurz HIGH → Aufnahme einmal abspielen."
  },
  {
    "id": "actuator_isd1820_record",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Aufnehmen",
    "colour": "#DC2626",
    "tooltip": "Nimmt für die angegebene Dauer auf (REC-Pin HIGH halten). Max. 10 Sekunden.",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Aufnehmen  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "valueInputs": [
      {
        "name": "DAUER",
        "label": "Sekunden",
        "defaultValue": 3,
        "suffix": "s"
      }
    ],
    "hardware": {
      "commonName": "ISD1820 Sprachmodul",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/isd1820_record.md",
    "doc": "# ISD1820 – Aufnahme per REC-Pin\n\nREC-Pin HIGH halten = aufnehmen. Nach Ablauf der Dauer wird der Pin LOW gesetzt.\nMax. 10 Sekunden (Chip-Limit). Wert über 10 wird auf dem Modul automatisch abgeschnitten.\n\n**Verdrahtung:** REC → Grove Signal-Pin dieses Blocks."
  },
  {
    "id": "actuator_servo",
    "blockCategory": "Aktionen",
    "subCategory": "Servo & Pumpe",
    "label": "Servo",
    "colour": "#DC2626",
    "tooltip": "Dreht einen Servo-Motor auf einen bestimmten Winkel (0 bis 180 Grad)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Servo",
        "name": "SERVO",
        "fieldType": "servo_dropdown"
      },
      {
        "label": "auf",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "ANGLE",
        "check": "Number",
        "defaultValue": 90,
        "suffix": "Grad  (0–180)"
      }
    ],
    "hardware": {
      "commonName": "Servo SG90",
      "verbrauch3j": 0,
      "kitStandard": true,
      "width_mm": 12,
      "height_mm": 23
    },
    "legacyGenerator": true,
    "_file": "actuators/servo.md",
    "doc": "# Servo-Motor\n\nDreht den Servo auf einen Winkel von 0–180 Grad."
  },
  {
    "id": "actuator_motor_backward",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Motor rückwärts",
    "colour": "#DC2626",
    "tooltip": "Fährt einen DC-Motor rückwärts (0–100 % Geschwindigkeit)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Motor",
        "name": "MOTOR",
        "fieldType": "motor_dropdown"
      },
      {
        "label": "rückwärts",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "SPEED",
        "check": "Number",
        "defaultValue": 75,
        "suffix": "% Geschwindigkeit"
      }
    ],
    "hardware": {
      "commonName": "DC-Motor / TT-Getriebemotor",
      "verbrauch3j": 50,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/motor_backward.md",
    "doc": "# Motor rückwärts"
  },
  {
    "id": "actuator_motor_forward",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Motor vorwärts",
    "colour": "#DC2626",
    "tooltip": "Fährt einen DC-Motor vorwärts (0–100 % Geschwindigkeit)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Motor",
        "name": "MOTOR",
        "fieldType": "motor_dropdown"
      },
      {
        "label": "vorwärts",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "SPEED",
        "check": "Number",
        "defaultValue": 75,
        "suffix": "% Geschwindigkeit"
      }
    ],
    "hardware": {
      "commonName": "DC-Motor / TT-Getriebemotor",
      "verbrauch3j": 50,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/motor_forward.md",
    "doc": "# Motor vorwärts"
  },
  {
    "id": "actuator_motor_stop",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Motor stopp",
    "colour": "#DC2626",
    "tooltip": "Stoppt einen DC-Motor",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Motor",
        "name": "MOTOR",
        "fieldType": "motor_dropdown"
      },
      {
        "label": "stopp",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "DC-Motor / TT-Getriebemotor",
      "verbrauch3j": 50,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/motor_stop.md",
    "doc": "# Motor stopp"
  },
  {
    "id": "actuator_stepper",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Schrittmotor",
    "colour": "#DC2626",
    "tooltip": "Dreht einen 28BYJ-48 Schrittmotor um einen Winkel nach rechts oder links",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "Schrittmotor  Anschluss 1:",
        "name": "PORTA",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      },
      {
        "label": "Anschluss 2:",
        "name": "PORTB",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin",
        "newRow": true
      },
      {
        "label": "Drehe",
        "name": "GRAD",
        "fieldType": "number_field",
        "default": 90,
        "min": 0,
        "max": 360,
        "newRow": true
      },
      {
        "label": "Grad",
        "name": "DIR",
        "fieldType": "direction_dropdown"
      }
    ],
    "hardware": {
      "commonName": "28BYJ-48 + ULN2003",
      "verbrauch3j": 120,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/stepper.md",
    "doc": "# Schrittmotor (28BYJ-48 + ULN2003)\n\nDreht einen 28BYJ-48 Schrittmotor präzise um einen Winkel. Eine volle Umdrehung\nentspricht 4096 Halbschritten (Motor mit 1:64-Getriebe).\n\n## Verdrahtung\n\nDer ULN2003-Treiber hat vier Eingänge **IN1–IN4**, angesteuert über zwei Grove-Ports:\n\n- **Anschluss 1** → IN1 (Pin 1) und IN2 (Signalpin)\n- **Anschluss 2** → IN3 (Pin 1) und IN4 (Signalpin)\n\n> **5 V Versorgung:** Die Grove-Ports liefern nur ein 3,3-V-Signal. Die\n> Stromversorgung (**5 V + GND**) des ULN2003 wird extern vom **Servo-Header**\n> des Boards abgegriffen. Generator: siehe `js/generator.js`."
  },
  {
    "id": "neopixel_brightness",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel Helligkeit",
    "colour": "#EC4899",
    "tooltip": "Setzt die Helligkeit der Onboard-NeoPixel (0–100 %)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "NeoPixel  Helligkeit",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "PERCENT",
        "check": "Number",
        "defaultValue": 50,
        "suffix": "%"
      }
    ],
    "hardware": {
      "commonName": "NeoPixel / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_brightness.md",
    "doc": "# NeoPixel Helligkeit (Onboard)\n\nSetzt die Helligkeit der eingebauten NeoPixel-LEDs (0 % = aus, 100 % = volle Helligkeit)."
  },
  {
    "id": "neopixel_fill",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel alle",
    "colour": "#EC4899",
    "tooltip": "Setzt alle NeoPixel-LEDs auf die gleiche Farbe",
    "blockType": "statement",
    "inputs": [
      {
        "label": "NeoPixel  alle  Farbe:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "hardware": {
      "commonName": "NeoPixel / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_fill.md",
    "doc": "# NeoPixel alle LEDs setzen"
  },
  {
    "id": "neopixel_off",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel alle aus",
    "colour": "#EC4899",
    "tooltip": "Schaltet alle NeoPixel-LEDs aus",
    "blockType": "statement",
    "inputs": [
      {
        "label": "NeoPixel  alle aus",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "NeoPixel / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_off.md",
    "doc": "# NeoPixel alle LEDs ausschalten"
  },
  {
    "id": "neopixel_set",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel LED Nr.",
    "colour": "#EC4899",
    "tooltip": "Setzt eine einzelne NeoPixel-LED auf eine bestimmte Farbe (1–13)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "NeoPixel  Farbe:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "valueInputs": [
      {
        "name": "INDEX",
        "label": "LED Nr.",
        "check": "Number",
        "defaultValue": 1
      }
    ],
    "hardware": {
      "commonName": "NeoPixel / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_set.md",
    "doc": "# NeoPixel einzelne LED setzen"
  },
  {
    "id": "neopixel_ext_brightness",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen Helligkeit",
    "colour": "#EC4899",
    "tooltip": "Setzt die Helligkeit eines externen NeoPixel-Streifens am Grove-Port (0–100 %)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen Helligkeit (Grove)  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "check": "Number",
        "defaultValue": 8
      },
      {
        "name": "PERCENT",
        "label": "Helligkeit",
        "check": "Number",
        "defaultValue": 50,
        "suffix": "%"
      }
    ],
    "hardware": {
      "commonName": "NeoPixel-Streifen (extern) / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_ext_brightness.md",
    "doc": "# Externer NeoPixel-Streifen – Helligkeit\n\nSetzt die Helligkeit eines an einem Grove-Port angeschlossenen WS2812B-Streifens (0 % = aus, 100 % = volle Helligkeit).\n„LEDs gesamt\" muss für alle Streifen-Blöcke am selben Port gleich gewählt werden."
  },
  {
    "id": "neopixel_ext_fill",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen ganz füllen",
    "colour": "#EC4899",
    "tooltip": "Setzt alle LEDs eines externen NeoPixel-Streifens am Grove-Port auf eine Farbe",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen füllen (Grove)  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "label": "Farbe:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "check": "Number",
        "defaultValue": 8
      }
    ],
    "hardware": {
      "commonName": "NeoPixel-Streifen (extern) / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_ext_fill.md",
    "doc": "# Externer NeoPixel-Streifen – ganz füllen\n\nSetzt alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens auf dieselbe Farbe."
  },
  {
    "id": "neopixel_ext_off",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen aus",
    "colour": "#EC4899",
    "tooltip": "Schaltet alle LEDs eines externen NeoPixel-Streifens am Grove-Port aus",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen aus (Grove)  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "check": "Number",
        "defaultValue": 8
      }
    ],
    "hardware": {
      "commonName": "NeoPixel-Streifen (extern) / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_ext_off.md",
    "doc": "# Externer NeoPixel-Streifen – ausschalten\n\nSchaltet alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens aus."
  },
  {
    "id": "neopixel_ext_set",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen LED setzen",
    "colour": "#EC4899",
    "tooltip": "Setzt eine einzelne LED eines externen NeoPixel-Streifens am Grove-Port",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen (Grove)  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "label": "Farbe:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "check": "Number",
        "defaultValue": 8
      },
      {
        "name": "INDEX",
        "label": "LED Nr.",
        "check": "Number",
        "defaultValue": 1
      }
    ],
    "hardware": {
      "commonName": "NeoPixel-Streifen (extern) / WS2812B",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/neopixel_ext_set.md",
    "doc": "# Externer NeoPixel-Streifen – einzelne LED setzen\n\nSteuert eine einzelne LED eines an einem Grove-Port angeschlossenen WS2812B-Streifens.\n„LEDs:\" gibt die Gesamtzahl der LEDs im Streifen an (für alle Streifen-Blöcke am selben Port gleich wählen)."
  },
  {
    "id": "actuator_lcd_color",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "LCD Farbe",
    "colour": "#0D9488",
    "tooltip": "Setzt die Hintergrundfarbe des Grove-LCD – ohne den Text zu ändern",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "LCD Farbe  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      },
      {
        "label": "Farbe:",
        "name": "COLOR",
        "fieldType": "rgb_color_dropdown"
      }
    ],
    "hardware": {
      "commonName": "Grove-LCD RGB Backlight",
      "verbrauch3j": 0,
      "kitStandard": false,
      "width_mm": 80,
      "height_mm": 40
    },
    "legacyGenerator": true,
    "_file": "actuators/lcd_color.md",
    "doc": "# Grove-LCD RGB Backlight – Farbe (I2C)\n\nStellt nur die Hintergrundbeleuchtung farbig ein. Lässt den angezeigten Text **unverändert** –\nden Text setzt der Block „📟 LCD Text\".\n> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V)."
  },
  {
    "id": "actuator_lcd_text",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "LCD Text",
    "colour": "#0D9488",
    "tooltip": "Zeigt zwei Zeilen Text auf dem Grove-LCD an – ohne die Farbe zu ändern",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "LCD Text  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      }
    ],
    "valueInputs": [
      {
        "name": "LINE1",
        "label": "Zeile 1",
        "check": "String",
        "defaultValue": "Hallo"
      },
      {
        "name": "LINE2",
        "label": "Zeile 2",
        "check": "String",
        "defaultValue": "Welt"
      }
    ],
    "hardware": {
      "commonName": "Grove-LCD RGB Backlight",
      "verbrauch3j": 0,
      "kitStandard": false,
      "width_mm": 80,
      "height_mm": 40
    },
    "legacyGenerator": true,
    "_file": "actuators/lcd_text.md",
    "doc": "# Grove-LCD RGB Backlight – Text (I2C)\n\nZeigt bis zu zwei Zeilen Text an (je 16 Zeichen). Ändert die Hintergrundfarbe **nicht** –\ndafür gibt es den Block „📟 LCD Farbe\".\n> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V)."
  },
  {
    "id": "tm1637_number",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "7-Seg Zahl anzeigen",
    "colour": "#0D9488",
    "tooltip": "Zeigt eine Zahl (ganze Zahl, −999 bis 9999) auf dem 4-stelligen 7-Segment-Display an",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "7-Seg  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "valueInputs": [
      {
        "name": "VALUE",
        "check": "Number",
        "label": "Zahl",
        "defaultValue": 1234
      }
    ],
    "hardware": {
      "commonName": "7-Segment Display TM1637 (4-stellig)",
      "verbrauch3j": 0,
      "kitStandard": false,
      "width_mm": 42,
      "height_mm": 23.5
    },
    "legacyGenerator": true,
    "_file": "actuators/tm1637_number.md",
    "doc": "# TM1637 4-stelliges 7-Segment-Display – Zahl anzeigen\n\nZeigt eine ganze Zahl (−999 bis 9999) auf dem Display an.\n\n**Verdrahtung (Grove-Port):**\n- CLK → Grove Pin 1 (weiß, z. B. GP2 bei Grove 2)\n- DIO → Grove Signal (gelb, z. B. GP3 bei Grove 2)\n- VCC / GND → Grove VCC / GND\n\n**Lib:** `adafruit_tm1637` aus dem Adafruit CircuitPython Bundle → nach `CIRCUITPY/lib/` kopieren."
  },
  {
    "id": "tm1637_off",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "7-Seg ausschalten",
    "colour": "#0D9488",
    "tooltip": "Löscht alle Ziffern auf dem 7-Segment-Display (Anzeige bleibt dunkel)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "7-Seg ausschalten  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "hardware": {
      "commonName": "7-Segment Display TM1637 (4-stellig)",
      "verbrauch3j": 0,
      "kitStandard": false,
      "width_mm": 42,
      "height_mm": 23.5
    },
    "legacyGenerator": true,
    "_file": "actuators/tm1637_off.md",
    "doc": "# TM1637 4-stelliges 7-Segment-Display – Ausschalten\n\nLöscht alle Segmente (Display bleibt dunkel)."
  },
  {
    "id": "analog_read",
    "blockCategory": "Pins",
    "subCategory": "",
    "label": "Analog lesen",
    "colour": "#64748B",
    "tooltip": "Liest den analogen Messwert eines Grove-Ports (0–100 %)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Analog lesen  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "analog"
      }
    ],
    "legacyGenerator": true,
    "_file": "sensors/analog_read.md"
  },
  {
    "id": "digital_read",
    "blockCategory": "Pins",
    "subCategory": "",
    "label": "Digital lesen",
    "colour": "#64748B",
    "tooltip": "Liest einen digitalen Grove-Port (Wahr = HIGH / AN, Falsch = LOW / AUS)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "Digital lesen  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "legacyGenerator": true,
    "_file": "sensors/digital_read.md"
  },
  {
    "id": "digital_write",
    "blockCategory": "Pins",
    "subCategory": "",
    "label": "Digital",
    "colour": "#64748B",
    "tooltip": "Setzt einen digitalen Grove-Port auf AN oder AUS",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Digital  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "name": "STATE",
        "fieldType": "on_off_dropdown"
      }
    ],
    "legacyGenerator": true,
    "_file": "actuators/digital_write.md"
  }
];
