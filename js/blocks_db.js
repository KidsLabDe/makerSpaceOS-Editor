// js/blocks_db.js – GENERIERT von scripts/build_blocks.js
// Nicht manuell bearbeiten! Neu generieren: node scripts/build_blocks.js
// Generiert: 2026-07-15T16:40:50.780Z

const BLOCKS_CATALOG = {
  "categories": [
    {
      "id": "Sensoren",
      "label": "Sensoren",
      "label_en": "Sensors",
      "colour": "#2563EB",
      "subCategories": [
        "Temperatur & Feuchte",
        "Abstand & Licht",
        "Bewegung",
        "Weitere",
        "Ereignisse"
      ],
      "subCategories_en": {
        "Temperatur & Feuchte": "Temperature & Humidity",
        "Abstand & Licht": "Distance & Light",
        "Bewegung": "Motion",
        "Weitere": "More",
        "Ereignisse": "Events"
      }
    },
    {
      "id": "Aktionen",
      "label": "Aktionen",
      "label_en": "Actions",
      "colour": "#DC2626",
      "subCategories": [
        "LED",
        "Ton",
        "Servo & Pumpe",
        "Motor"
      ],
      "subCategories_en": {
        "LED": "LED",
        "Ton": "Sound",
        "Servo & Pumpe": "Servo & Pump",
        "Motor": "Motor"
      }
    },
    {
      "id": "Lichter",
      "label": "Lichter",
      "label_en": "Lights",
      "colour": "#EC4899",
      "subCategories": [
        "Onboard",
        "Streifen"
      ],
      "subCategories_en": {
        "Onboard": "Onboard",
        "Streifen": "Strips"
      }
    },
    {
      "id": "Anzeigen",
      "label": "Anzeigen",
      "label_en": "Displays",
      "colour": "#0D9488",
      "subCategories": []
    },
    {
      "id": "Pins",
      "label": "Pins",
      "label_en": "Pins",
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
    "label_en": "DHT11 humidity (%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Luftfeuchtigkeit in % vom DHT11 Sensor (KY-015)",
    "tooltip_en": "Reads the humidity in % from the DHT11 sensor (KY-015)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "DHT11 Luftfeuchte (%)  Port:",
        "label_en": "DHT11 humidity (%)  port:",
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
    "doc": "# DHT11 Luftfeuchtesensor\n\nMisst die relative Luftfeuchtigkeit in Prozent mit dem DHT11 Sensor.",
    "doc_en": "# DHT11 humidity sensor\n\nMeasures the relative humidity in percent with the DHT11 sensor."
  },
  {
    "id": "sensor_dht11_temperature",
    "blockCategory": "Sensoren",
    "subCategory": "Temperatur & Feuchte",
    "label": "DHT11 Temperatur (°C)",
    "label_en": "DHT11 temperature (°C)",
    "colour": "#2563EB",
    "tooltip": "Liest die Temperatur in Grad Celsius vom DHT11 Sensor (KY-015)",
    "tooltip_en": "Reads the temperature in degrees Celsius from the DHT11 sensor (KY-015)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "DHT11 Temperatur (°C)  Port:",
        "label_en": "DHT11 temperature (°C)  port:",
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
    "doc": "# DHT11 Temperatursensor\n\nGünstiger Sensor für Temperatur und Luftfeuchtigkeit. Weniger genau als DHT22, aber gut für Einsteigerprojekte.",
    "doc_en": "# DHT11 temperature sensor\n\nInexpensive sensor for temperature and humidity. Less accurate than the DHT22,\nbut great for beginner projects."
  },
  {
    "id": "sensor_ldr",
    "blockCategory": "Sensoren",
    "subCategory": "Abstand & Licht",
    "label": "Helligkeit (0–100%)",
    "label_en": "Brightness (0–100%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Helligkeit in Prozent (0 = dunkel, 100 = hell)",
    "tooltip_en": "Reads the brightness in percent (0 = dark, 100 = bright)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Helligkeit (0–100%)  Port:",
        "label_en": "Brightness (0–100%)  port:",
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
    "doc": "# Lichtsensor (LDR / KY-018)\n\nMisst die Umgebungshelligkeit als Prozentwert. 0 % = sehr dunkel, 100 % = sehr hell.",
    "doc_en": "# Light sensor (LDR / KY-018)\n\nMeasures the ambient brightness as a percentage. 0 % = very dark, 100 % = very bright."
  },
  {
    "id": "sensor_ultrasonic",
    "blockCategory": "Sensoren",
    "subCategory": "Abstand & Licht",
    "label": "Abstand (cm)",
    "label_en": "Distance (cm)",
    "colour": "#2563EB",
    "tooltip": "Misst den Abstand in cm mit dem Grove-Ultraschall-Ranger (ein Signal-Pin)",
    "tooltip_en": "Measures the distance in cm with the Grove ultrasonic ranger (one signal pin)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Abstand (cm)  Port:",
        "label_en": "Distance (cm)  port:",
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
    "doc": "# Grove Ultraschall-Abstandssensor\n\nMisst Abstände von ca. 2 cm bis 350 cm. Der Grove-Ranger nutzt **einen einzigen Signal-Pin**\n(Trigger und Echo teilen sich Pin 2 des Grove-Steckers). Generator: siehe `js/generator.js`.",
    "doc_en": "# Grove ultrasonic distance sensor\n\nMeasures distances from about 2 cm to 350 cm. The Grove ranger uses **a single\nsignal pin** (trigger and echo share pin 2 of the Grove connector). Generator:\nsee `js/generator.js`."
  },
  {
    "id": "sensor_icm20948_g",
    "blockCategory": "Sensoren",
    "subCategory": "Bewegung",
    "label": "Beschleunigung (g)",
    "label_en": "Acceleration (g)",
    "colour": "#2563EB",
    "tooltip": "Misst, wie stark der Sensor beschleunigt wird – in Ruhe ≈ 1,0 (Erdanziehung)",
    "tooltip_en": "Measures how strongly the sensor is accelerated – at rest ≈ 1.0 (gravity)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Beschleunigung (g)  Port:",
        "label_en": "Acceleration (g)  port:",
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
    "doc": "# ICM20948 – Beschleunigung (g)\n\nLiefert die Gesamt-Beschleunigung als Zahl in g. In Ruhe zeigt der Sensor ≈ 1,0\n(Erdanziehung), beim Schütteln oder Aufprall deutlich mehr. Messbereich: bis ±16 g.\n\n## Beispiel\n\nBeim Schütteln leuchten die NeoPixel kurz rot, parallel wird der g-Wert jede Sekunde ausgegeben:\n\n![Beispielprogramm: Wenn bewegt (geschüttelt) + Beschleunigung ausgeben](../images/icm20948_beispiel.png)\n\n> Benötigt `adafruit_icm20x.mpy` und `adafruit_register/` auf `CIRCUITPY/lib/`\n> (Adafruit CircuitPython Bundle). Anschluss über Grove-I2C-Adapter, Adresse 0x69.",
    "doc_en": "# ICM20948 – acceleration (g)\n\nReturns the total acceleration as a number in g. At rest the sensor shows ≈ 1.0\n(gravity); when shaken or on impact considerably more. Measuring range: up to ±16 g.\n\n## Example\n\nWhen shaken, the NeoPixels briefly light up red while the g value is printed every second:\n\n![Example program: when moved (shaken) + print acceleration](../images/icm20948_beispiel.png)\n\n> Needs `adafruit_icm20x.mpy` and `adafruit_register/` on `CIRCUITPY/lib/`\n> (Adafruit CircuitPython Bundle). Connect via a Grove I2C adapter, address 0x69."
  },
  {
    "id": "sensor_icm20948_neigung",
    "blockCategory": "Sensoren",
    "subCategory": "Bewegung",
    "label": "Neigung (°)",
    "label_en": "Tilt (°)",
    "colour": "#2563EB",
    "tooltip": "Misst, wie weit der Sensor gekippt ist – in Grad (0 = waagerecht)",
    "tooltip_en": "Measures how far the sensor is tilted – in degrees (0 = level)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Neigung (°)",
        "label_en": "Tilt (°)",
        "name": "DIR",
        "fieldType": "tilt_dropdown"
      },
      {
        "label": "Port:",
        "label_en": "port:",
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
    "doc": "# ICM20948 – Neigung (°)\n\nLiefert den Kippwinkel in Grad: „vor/zurück\" (−90…90) oder „links/rechts\" (−180…180).\n0 bedeutet waagerecht. Gut für Wasserwaagen, Balance-Spiele und Lenk-Steuerungen.\n\n> Benötigt `adafruit_icm20x.mpy` und `adafruit_register/` auf `CIRCUITPY/lib/`\n> (Adafruit CircuitPython Bundle). Anschluss über Grove-I2C-Adapter, Adresse 0x69.",
    "doc_en": "# ICM20948 – tilt (°)\n\nReturns the tilt angle in degrees: \"forward/back\" (−90…90) or \"left/right\" (−180…180).\n0 means level. Great for spirit levels, balance games and steering controls.\n\n> Needs `adafruit_icm20x.mpy` and `adafruit_register/` on `CIRCUITPY/lib/`\n> (Adafruit CircuitPython Bundle). Connect via a Grove I2C adapter, address 0x69."
  },
  {
    "id": "sensor_air_quality",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Luftqualität (0–100%)",
    "label_en": "Air quality (0–100%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Luftverschmutzung in Prozent (0 = frische Luft, 100 = sehr schlechte Luft). Der Sensor braucht nach dem Einschalten ca. 20 Sekunden Aufwärmzeit.",
    "tooltip_en": "Reads the air pollution in percent (0 = fresh air, 100 = very bad air). The sensor needs about 20 seconds to warm up after power-on.",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Luftqualität (0–100%)  Port:",
        "label_en": "Air quality (0–100%)  port:",
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
    "doc": "# Grove Luftqualitätssensor v1.3\n\nMisst die Luftverschmutzung (Kohlenmonoxid, Alkohol, Aceton, Formaldehyd u.a.) als\nProzentwert: **0 % = frische Luft**, höhere Werte = schlechtere Luft. Typisch liegt\nfrische Luft bei ca. 5–10 %, ab ca. 20–30 % ist die Luft merklich verschmutzt.\n\n**Wichtig:** Der Sensor (MP503) braucht nach dem Einschalten ca. **20 Sekunden\nAufwärmzeit**, bevor die Werte stimmen. Anschluss an einen analogen Grove-Port.",
    "doc_en": "# Grove air quality sensor v1.3\n\nMeasures air pollution (carbon monoxide, alcohol, acetone, formaldehyde and more) as a\npercentage: **0 % = fresh air**, higher values = worse air. Fresh air is typically\naround 5–10 %; from about 20–30 % the air is noticeably polluted.\n\n**Important:** after power-on the sensor (MP503) needs about **20 seconds to warm up**\nbefore the values are correct. Connect to an analog Grove port."
  },
  {
    "id": "sensor_battery",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Batteriespannung (V)",
    "label_en": "Battery voltage (V)",
    "colour": "#2563EB",
    "tooltip": "Misst die Versorgungsspannung (VBAT) in Volt über GP29",
    "tooltip_en": "Measures the supply voltage (VBAT) in volts via GP29",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Batteriespannung (V)",
        "label_en": "Battery voltage (V)",
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
    "doc": "# Batteriespannung (GP29)\n\nMisst die Versorgungsspannung über den internen Spannungsteiler (GP29 = VBAT/2) und gibt\nsie in Volt zurück. Praktisch, um den Akkustand zu überwachen.",
    "doc_en": "# Battery voltage (GP29)\n\nMeasures the supply voltage via the internal voltage divider (GP29 = VBAT/2) and\nreturns it in volts. Handy for monitoring the battery level."
  },
  {
    "id": "sensor_bodenfeuchte",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Bodenfeuchte (0–100%)",
    "label_en": "Soil moisture (0–100%)",
    "colour": "#2563EB",
    "tooltip": "Liest die Bodenfeuchte in Prozent aus (0 = trocken, 100 = nass). Kapazitiver Sensor.",
    "tooltip_en": "Reads the soil moisture in percent (0 = dry, 100 = wet). Capacitive sensor.",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Bodenfeuchte (0–100%)  Port:",
        "label_en": "Soil moisture (0–100%)  port:",
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
    "doc": "# Bodenfeuchtesensor (kapazitiv)\n\nMisst die Feuchtigkeit in der Erde. Ideal für automatische Pflanzenbewässerung.\n\n**Wichtig:** Kapazitiver Sensor verwenden (nicht resistiv) – resistive Sonden korrodieren bei Dauernutzung.\n\n## Anschluss\n- AOUT → GP-Pin (analogfähig: GP26, GP27, GP28)\n- VCC → 3.3V oder 5V\n- GND → GND",
    "doc_en": "# Soil moisture sensor (capacitive)\n\nMeasures the moisture in the soil. Ideal for automatic plant watering.\n\n**Important:** use a capacitive sensor (not resistive) – resistive probes corrode with continuous use.\n\n## Wiring\n- AOUT → GP pin (analog-capable: GP26, GP27, GP28)\n- VCC → 3.3V or 5V\n- GND → GND"
  },
  {
    "id": "sensor_encoder",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Drehgeber Position",
    "label_en": "Encoder position",
    "colour": "#2563EB",
    "tooltip": "Liest die Position des Drehgebers (positiv = rechts, negativ = links)",
    "tooltip_en": "Reads the position of the rotary encoder (positive = right, negative = left)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Drehgeber Position  Port:",
        "label_en": "Encoder position  port:",
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
    "doc": "# Drehgeber / Rotary Encoder (Grove)\n\nZählt Drehbewegungen (unbegrenzt). Positiver Wert = Rechtsdrehung, negativer Wert = Linksdrehung.\nNutzt beide Pins des Grove-Ports (Pin1 = CLK, Pin2 = DT). Generator: siehe `js/generator.js`.",
    "doc_en": "# Rotary encoder (Grove)\n\nCounts rotations (unlimited). Positive value = clockwise, negative value = counter-clockwise.\nUses both pins of the Grove port (pin 1 = CLK, pin 2 = DT). Generator: see `js/generator.js`."
  },
  {
    "id": "sensor_taster",
    "blockCategory": "Sensoren",
    "subCategory": "Weitere",
    "label": "Taster gedrückt?",
    "label_en": "Button pressed?",
    "colour": "#2563EB",
    "tooltip": "Gibt Wahr zurück, wenn der Taster gedrückt ist (Board-Taster B1/B2 oder externer Taster)",
    "tooltip_en": "Returns true if the button is pressed (board buttons B1/B2 or an external button)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "Taster",
        "label_en": "Button",
        "name": "BTN",
        "fieldType": "taster_dropdown"
      },
      {
        "label": "gedrückt?",
        "label_en": "pressed?",
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
    "doc": "# Taster gedrückt? (B1/B2 + externer Taster)\n\nGibt `Wahr` zurück wenn der ausgewählte Taster gedrückt ist.\n\n- **B1 (GP20) / B2 (GP21)**: Onboard-Taster des MAKER-PI-RP2040\n- **Grove 1–7**: Externer Taster (KY-004) am Signal-Pin des Grove-Ports",
    "doc_en": "# Button pressed? (B1/B2 + external button)\n\nReturns `true` if the selected button is pressed.\n\n- **B1 (GP20) / B2 (GP21)**: onboard buttons of the MAKER-PI-RP2040\n- **Grove 1–7**: external button (KY-004) on the signal pin of the Grove port"
  },
  {
    "id": "event_air_quality",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Luftqualität",
    "label_en": "When air quality",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn die Luftverschmutzung einen Wert überschreitet/unterschreitet (0 = frisch, 100 = sehr schlecht)",
    "tooltip_en": "Runs code when the air pollution goes above/below a value (0 = fresh, 100 = very bad)",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Luftqualität  Port:",
        "label_en": "When air quality  port:",
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
      "label": "dann",
      "label_en": "then"
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
    "doc": "# Ereignis: Wenn Luftqualität\n\nFührt Aktionen aus, wenn die Luftverschmutzung einen Schwellwert über- oder\nunterschreitet (z.B. Lüfter an, wenn > 30 %).",
    "doc_en": "# Event: when air quality\n\nRuns actions when the air pollution goes above or below a threshold\n(e.g. fan on when > 30 %)."
  },
  {
    "id": "event_button",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Taster",
    "label_en": "When button",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn der Taster gedrückt oder losgelassen wird",
    "tooltip_en": "Runs code when the button is pressed or released",
    "blockType": "event_simple",
    "inputs": [
      {
        "label": "Wenn Taster",
        "label_en": "When button",
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
      "label": "→ dann",
      "label_en": "→ then"
    },
    "hardware": {
      "commonName": "Taster / Board-Taster",
      "verbrauch3j": 28,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/event_button.md",
    "doc": "# Ereignis: Wenn Taster (B1/B2 + extern)\n\nReagiert auf Drücken oder Loslassen eines Tasters.",
    "doc_en": "# Event: when button (B1/B2 + external)\n\nReacts to a button being pressed or released."
  },
  {
    "id": "event_ldr",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Helligkeit",
    "label_en": "When brightness",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn die Helligkeit einen Wert überschreitet/unterschreitet",
    "tooltip_en": "Runs code when the brightness goes above/below a value",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Helligkeit  Port:",
        "label_en": "When brightness  port:",
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
      "label": "dann",
      "label_en": "then"
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
    "doc": "# Ereignis: Wenn Helligkeit (LDR)\n\nFührt Aktionen aus, wenn die Helligkeit einen Schwellwert über- oder unterschreitet.",
    "doc_en": "# Event: when brightness (LDR)\n\nRuns actions when the brightness goes above or below a threshold."
  },
  {
    "id": "event_temperature",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Temperatur",
    "label_en": "When temperature",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn die Temperatur einen Wert überschreitet/unterschreitet",
    "tooltip_en": "Runs code when the temperature goes above/below a value",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Temperatur  Port:",
        "label_en": "When temperature  port:",
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
      "label": "dann",
      "label_en": "then"
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
    "doc": "# Ereignis: Wenn Temperatur (DHT22)\n\nFührt Aktionen aus, wenn die Temperatur einen Schwellwert über- oder unterschreitet.",
    "doc_en": "# Event: when temperature (DHT22)\n\nRuns actions when the temperature goes above or below a threshold."
  },
  {
    "id": "event_ultrasonic",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "Wenn Abstand",
    "label_en": "When distance",
    "colour": "#D97706",
    "tooltip": "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet",
    "tooltip_en": "Runs code when the distance goes above/below a value",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "Wenn Abstand  Port:",
        "label_en": "When distance  port:",
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
      "label": "dann",
      "label_en": "then"
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
    "doc": "# Ereignis: Wenn Abstand (Grove Ultrasonic Ranger)\n\nFührt Aktionen aus, wenn der gemessene Abstand einen Schwellwert über- oder unterschreitet.\nSingle-Pin-Messung – Generator: siehe `js/generator.js`.",
    "doc_en": "# Event: when distance (Grove Ultrasonic Ranger)\n\nRuns actions when the measured distance goes above or below a threshold.\nSingle-pin measurement – generator: see `js/generator.js`."
  },
  {
    "id": "actuator_led",
    "blockCategory": "Aktionen",
    "subCategory": "LED",
    "label": "LED",
    "label_en": "LED",
    "colour": "#DC2626",
    "tooltip": "Schaltet eine LED ein oder aus",
    "tooltip_en": "Turns an LED on or off",
    "blockType": "statement",
    "inputs": [
      {
        "label": "LED  Port:",
        "label_en": "LED  port:",
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
    "doc": "# LED-Block\n\nSchaltet eine einfache LED (oder jeden anderen digitalen Ausgang) ein oder aus.",
    "doc_en": "# LED block\n\nTurns a simple LED (or any other digital output) on or off."
  },
  {
    "id": "actuator_led_blink",
    "blockCategory": "Aktionen",
    "subCategory": "LED",
    "label": "LED blinken",
    "label_en": "LED blink",
    "colour": "#DC2626",
    "tooltip": "Lässt eine LED mehrmals blinken",
    "tooltip_en": "Makes an LED blink several times",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "LED  Port:",
        "label_en": "LED  port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "TIMES",
        "label": "blinken",
        "label_en": "blink",
        "check": "Number",
        "defaultValue": 3
      },
      {
        "name": "PAUSE",
        "label": "mal, Pause",
        "label_en": "times, pause",
        "check": "Number",
        "defaultValue": 0.5,
        "suffix": "Sek",
        "suffix_en": "s"
      }
    ],
    "hardware": {
      "commonName": "LED (blinkend)",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/led_blink.md",
    "doc": "# LED blinken\n\nLässt eine LED eine bestimmte Anzahl mal blinken.",
    "doc_en": "# LED blink\n\nMakes an LED blink a certain number of times."
  },
  {
    "id": "actuator_buzzer",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Buzzer Ton",
    "label_en": "Buzzer tone",
    "colour": "#DC2626",
    "tooltip": "Spielt einen Ton mit der angegebenen Frequenz (z.B. 440 = Kammerton A)",
    "tooltip_en": "Plays a tone at the given frequency (e.g. 440 = concert pitch A)",
    "blockType": "statement",
    "inline": true,
    "valueInputs": [
      {
        "name": "FREQ",
        "label": "Buzzer  Ton:",
        "label_en": "Buzzer  tone:",
        "check": "Number",
        "defaultValue": 440
      },
      {
        "name": "DURATION",
        "label": "Hz  für",
        "label_en": "Hz  for",
        "check": "Number",
        "defaultValue": 0.5,
        "suffix": "Sekunden",
        "suffix_en": "seconds"
      }
    ],
    "hardware": {
      "commonName": "Passiver Buzzer (Board-Pin GP22)",
      "verbrauch3j": 14,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/buzzer.md",
    "doc": "# Board-Buzzer (passiv, GP22)\n\nSpielt Töne mit einstellbarer Frequenz. Verwendet den eingebauten Buzzer auf GP22.",
    "doc_en": "# Board buzzer (passive, GP22)\n\nPlays tones with an adjustable frequency. Uses the built-in buzzer on GP22."
  },
  {
    "id": "actuator_buzzer_off",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Buzzer aus",
    "label_en": "Buzzer off",
    "colour": "#DC2626",
    "tooltip": "Schaltet den Buzzer aus",
    "tooltip_en": "Turns the buzzer off",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Buzzer  aus",
        "label_en": "Buzzer  off",
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
    "doc": "# Buzzer ausschalten",
    "doc_en": "# Turn off the buzzer"
  },
  {
    "id": "actuator_isd1820",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Ton abspielen",
    "label_en": "Play sound",
    "colour": "#DC2626",
    "tooltip": "Spielt die Aufnahme des ISD1820-Sprachmoduls ab. ⚠ Benötigt das ISD1820-Zusatzmodul – nicht der eingebaute Lautsprecher!",
    "tooltip_en": "Plays the recording of the ISD1820 voice module. ⚠ Needs the ISD1820 add-on module – not the built-in speaker!",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Ton abspielen  Port:",
        "label_en": "Play sound  port:",
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
    "doc": "# ISD1820 Sprachmodul (EX-ISD1820)\n\nNimmt Töne/Sprache auf und spielt sie wieder ab.\n\n**Verdrahtung (Grove-Port):**\n- P-E → Grove Signal-Pin\n- Vcc / GND → Grove VCC / GND\n- P-L und REC: offen lassen\n\n**Aufnahme:** REC-Knopf auf dem Modul gedrückt halten (max. 10 Sek.).  \n**Abspielen:** Block ausführen → P-E kurz HIGH → Aufnahme einmal abspielen.",
    "doc_en": "# ISD1820 voice module (EX-ISD1820)\n\nRecords sounds/speech and plays them back.\n\n**Wiring (Grove port):**\n- P-E → Grove signal pin\n- Vcc / GND → Grove VCC / GND\n- P-L and REC: leave open\n\n**Recording:** hold the REC button on the module (max. 10 s).\n**Playback:** run the block → P-E briefly HIGH → recording plays once."
  },
  {
    "id": "actuator_isd1820_record",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "label": "Aufnehmen",
    "label_en": "Record",
    "colour": "#DC2626",
    "tooltip": "Nimmt für die angegebene Dauer auf (REC-Pin HIGH halten). Max. 10 Sekunden.",
    "tooltip_en": "Records for the given duration (holds the REC pin HIGH). Max. 10 seconds.",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Aufnehmen  Port:",
        "label_en": "Record  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "valueInputs": [
      {
        "name": "DAUER",
        "label": "Sekunden",
        "label_en": "seconds",
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
    "doc": "# ISD1820 – Aufnahme per REC-Pin\n\nREC-Pin HIGH halten = aufnehmen. Nach Ablauf der Dauer wird der Pin LOW gesetzt.\nMax. 10 Sekunden (Chip-Limit). Wert über 10 wird auf dem Modul automatisch abgeschnitten.\n\n**Verdrahtung:** REC → Grove Signal-Pin dieses Blocks.",
    "doc_en": "# ISD1820 – recording via REC pin\n\nHold the REC pin HIGH = record. After the duration has elapsed the pin is set LOW.\nMax. 10 seconds (chip limit). Values above 10 are cut off automatically by the module.\n\n**Wiring:** REC → Grove signal pin of this block."
  },
  {
    "id": "actuator_servo",
    "blockCategory": "Aktionen",
    "subCategory": "Servo & Pumpe",
    "label": "Servo",
    "label_en": "Servo",
    "colour": "#DC2626",
    "tooltip": "Dreht einen Servo-Motor auf einen bestimmten Winkel (0 bis 180 Grad)",
    "tooltip_en": "Turns a servo motor to a specific angle (0 to 180 degrees)",
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
        "label_en": "to",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "ANGLE",
        "check": "Number",
        "defaultValue": 90,
        "suffix": "Grad  (0–180)",
        "suffix_en": "degrees  (0–180)"
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
    "doc": "# Servo-Motor\n\nDreht den Servo auf einen Winkel von 0–180 Grad.",
    "doc_en": "# Servo motor\n\nTurns the servo to an angle of 0–180 degrees."
  },
  {
    "id": "actuator_motor_backward",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Motor rückwärts",
    "label_en": "Motor backward",
    "colour": "#DC2626",
    "tooltip": "Fährt einen DC-Motor rückwärts (0–100 % Geschwindigkeit)",
    "tooltip_en": "Drives a DC motor backward (0–100 % speed)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Motor",
        "label_en": "Motor",
        "name": "MOTOR",
        "fieldType": "motor_dropdown"
      },
      {
        "label": "rückwärts",
        "label_en": "backward",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "SPEED",
        "check": "Number",
        "defaultValue": 75,
        "suffix": "% Geschwindigkeit",
        "suffix_en": "% speed"
      }
    ],
    "hardware": {
      "commonName": "DC-Motor / TT-Getriebemotor",
      "verbrauch3j": 50,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/motor_backward.md",
    "doc": "# Motor rückwärts",
    "doc_en": "# Motor backward"
  },
  {
    "id": "actuator_motor_forward",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Motor vorwärts",
    "label_en": "Motor forward",
    "colour": "#DC2626",
    "tooltip": "Fährt einen DC-Motor vorwärts (0–100 % Geschwindigkeit)",
    "tooltip_en": "Drives a DC motor forward (0–100 % speed)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Motor",
        "label_en": "Motor",
        "name": "MOTOR",
        "fieldType": "motor_dropdown"
      },
      {
        "label": "vorwärts",
        "label_en": "forward",
        "fieldType": "fixed_label"
      }
    ],
    "valueInputs": [
      {
        "name": "SPEED",
        "check": "Number",
        "defaultValue": 75,
        "suffix": "% Geschwindigkeit",
        "suffix_en": "% speed"
      }
    ],
    "hardware": {
      "commonName": "DC-Motor / TT-Getriebemotor",
      "verbrauch3j": 50,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/motor_forward.md",
    "doc": "# Motor vorwärts",
    "doc_en": "# Motor forward"
  },
  {
    "id": "actuator_motor_stop",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Motor stopp",
    "label_en": "Motor stop",
    "colour": "#DC2626",
    "tooltip": "Stoppt einen DC-Motor",
    "tooltip_en": "Stops a DC motor",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Motor",
        "label_en": "Motor",
        "name": "MOTOR",
        "fieldType": "motor_dropdown"
      },
      {
        "label": "stopp",
        "label_en": "stop",
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
    "doc": "# Motor stopp",
    "doc_en": "# Motor stop"
  },
  {
    "id": "actuator_stepper",
    "blockCategory": "Aktionen",
    "subCategory": "Motor",
    "label": "Schrittmotor",
    "label_en": "Stepper motor",
    "colour": "#DC2626",
    "tooltip": "Dreht einen 28BYJ-48 Schrittmotor um einen Winkel nach rechts oder links",
    "tooltip_en": "Turns a 28BYJ-48 stepper motor by an angle to the right or left",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "Schrittmotor  Anschluss 1:",
        "label_en": "Stepper motor  connector 1:",
        "name": "PORTA",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      },
      {
        "label": "Anschluss 2:",
        "label_en": "connector 2:",
        "name": "PORTB",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin",
        "newRow": true
      },
      {
        "label": "Drehe",
        "label_en": "Turn",
        "name": "GRAD",
        "fieldType": "number_field",
        "default": 90,
        "min": 0,
        "max": 360,
        "newRow": true
      },
      {
        "label": "Grad",
        "label_en": "degrees",
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
    "doc": "# Schrittmotor (28BYJ-48 + ULN2003)\n\nDreht einen 28BYJ-48 Schrittmotor präzise um einen Winkel. Eine volle Umdrehung\nentspricht 4096 Halbschritten (Motor mit 1:64-Getriebe).\n\n## Verdrahtung\n\nDer ULN2003-Treiber hat vier Eingänge **IN1–IN4**, angesteuert über zwei Grove-Ports:\n\n- **Anschluss 1** → IN1 (Pin 1) und IN2 (Signalpin)\n- **Anschluss 2** → IN3 (Pin 1) und IN4 (Signalpin)\n\n> **5 V Versorgung:** Die Grove-Ports liefern nur ein 3,3-V-Signal. Die\n> Stromversorgung (**5 V + GND**) des ULN2003 wird extern vom **Servo-Header**\n> des Boards abgegriffen. Generator: siehe `js/generator.js`.",
    "doc_en": "# Stepper motor (28BYJ-48 + ULN2003)\n\nTurns a 28BYJ-48 stepper motor precisely by an angle. One full revolution\nequals 4096 half steps (motor with 1:64 gearbox).\n\n## Wiring\n\nThe ULN2003 driver has four inputs **IN1–IN4**, driven via two Grove ports:\n\n- **Connector 1** → IN1 (pin 1) and IN2 (signal pin)\n- **Connector 2** → IN3 (pin 1) and IN4 (signal pin)\n\n> **5 V supply:** the Grove ports only provide a 3.3 V signal. The power\n> supply (**5 V + GND**) of the ULN2003 is taken externally from the board's\n> **servo header**. Generator: see `js/generator.js`."
  },
  {
    "id": "neopixel_brightness",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel Helligkeit",
    "label_en": "NeoPixel brightness",
    "colour": "#EC4899",
    "tooltip": "Setzt die Helligkeit der Onboard-NeoPixel (0–100 %)",
    "tooltip_en": "Sets the brightness of the onboard NeoPixels (0–100 %)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "NeoPixel  Helligkeit",
        "label_en": "NeoPixel  brightness",
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
    "doc": "# NeoPixel Helligkeit (Onboard)\n\nSetzt die Helligkeit der eingebauten NeoPixel-LEDs (0 % = aus, 100 % = volle Helligkeit).",
    "doc_en": "# NeoPixel brightness (onboard)\n\nSets the brightness of the built-in NeoPixel LEDs (0 % = off, 100 % = full brightness)."
  },
  {
    "id": "neopixel_fill",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel alle",
    "label_en": "NeoPixel all",
    "colour": "#EC4899",
    "tooltip": "Setzt alle NeoPixel-LEDs auf die gleiche Farbe",
    "tooltip_en": "Sets all NeoPixel LEDs to the same colour",
    "blockType": "statement",
    "inputs": [
      {
        "label": "NeoPixel  alle  Farbe:",
        "label_en": "NeoPixel  all  colour:",
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
    "doc": "# NeoPixel alle LEDs setzen",
    "doc_en": "# Set all NeoPixel LEDs"
  },
  {
    "id": "neopixel_off",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel alle aus",
    "label_en": "NeoPixel all off",
    "colour": "#EC4899",
    "tooltip": "Schaltet alle NeoPixel-LEDs aus",
    "tooltip_en": "Turns off all NeoPixel LEDs",
    "blockType": "statement",
    "inputs": [
      {
        "label": "NeoPixel  alle aus",
        "label_en": "NeoPixel  all off",
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
    "doc": "# NeoPixel alle LEDs ausschalten",
    "doc_en": "# Turn off all NeoPixel LEDs"
  },
  {
    "id": "neopixel_set",
    "blockCategory": "Lichter",
    "subCategory": "Onboard",
    "label": "NeoPixel LED Nr.",
    "label_en": "NeoPixel LED no.",
    "colour": "#EC4899",
    "tooltip": "Setzt eine einzelne NeoPixel-LED auf eine bestimmte Farbe (1–13)",
    "tooltip_en": "Sets a single NeoPixel LED to a specific colour (1–13)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "NeoPixel  Farbe:",
        "label_en": "NeoPixel  colour:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "valueInputs": [
      {
        "name": "INDEX",
        "label": "LED Nr.",
        "label_en": "LED no.",
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
    "doc": "# NeoPixel einzelne LED setzen",
    "doc_en": "# Set a single NeoPixel LED"
  },
  {
    "id": "neopixel_ext_brightness",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen Helligkeit",
    "label_en": "Strip brightness",
    "colour": "#EC4899",
    "tooltip": "Setzt die Helligkeit eines externen NeoPixel-Streifens am Grove-Port (0–100 %)",
    "tooltip_en": "Sets the brightness of an external NeoPixel strip on a Grove port (0–100 %)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen Helligkeit (Grove)  Port:",
        "label_en": "Strip brightness (Grove)  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "label_en": "total LEDs",
        "check": "Number",
        "defaultValue": 8
      },
      {
        "name": "PERCENT",
        "label": "Helligkeit",
        "label_en": "brightness",
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
    "doc": "# Externer NeoPixel-Streifen – Helligkeit\n\nSetzt die Helligkeit eines an einem Grove-Port angeschlossenen WS2812B-Streifens (0 % = aus, 100 % = volle Helligkeit).\n„LEDs gesamt\" muss für alle Streifen-Blöcke am selben Port gleich gewählt werden.",
    "doc_en": "# External NeoPixel strip – brightness\n\nSets the brightness of a WS2812B strip connected to a Grove port (0 % = off, 100 % = full brightness).\n\"Total LEDs\" must be set to the same value for all strip blocks on the same port."
  },
  {
    "id": "neopixel_ext_fill",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen ganz füllen",
    "label_en": "Fill whole strip",
    "colour": "#EC4899",
    "tooltip": "Setzt alle LEDs eines externen NeoPixel-Streifens am Grove-Port auf eine Farbe",
    "tooltip_en": "Sets all LEDs of an external NeoPixel strip on a Grove port to one colour",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen füllen (Grove)  Port:",
        "label_en": "Fill strip (Grove)  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "label": "Farbe:",
        "label_en": "Colour:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "label_en": "total LEDs",
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
    "doc": "# Externer NeoPixel-Streifen – ganz füllen\n\nSetzt alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens auf dieselbe Farbe.",
    "doc_en": "# External NeoPixel strip – fill completely\n\nSets all LEDs of a WS2812B strip connected to a Grove port to the same colour."
  },
  {
    "id": "neopixel_ext_off",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen aus",
    "label_en": "Strip off",
    "colour": "#EC4899",
    "tooltip": "Schaltet alle LEDs eines externen NeoPixel-Streifens am Grove-Port aus",
    "tooltip_en": "Turns off all LEDs of an external NeoPixel strip on a Grove port",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen aus (Grove)  Port:",
        "label_en": "Strip off (Grove)  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "label_en": "total LEDs",
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
    "doc": "# Externer NeoPixel-Streifen – ausschalten\n\nSchaltet alle LEDs eines an einem Grove-Port angeschlossenen WS2812B-Streifens aus.",
    "doc_en": "# External NeoPixel strip – turn off\n\nTurns off all LEDs of a WS2812B strip connected to a Grove port."
  },
  {
    "id": "neopixel_ext_set",
    "blockCategory": "Lichter",
    "subCategory": "Streifen",
    "label": "Streifen LED setzen",
    "label_en": "Set strip LED",
    "colour": "#EC4899",
    "tooltip": "Setzt eine einzelne LED eines externen NeoPixel-Streifens am Grove-Port",
    "tooltip_en": "Sets a single LED of an external NeoPixel strip on a Grove port",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Streifen (Grove)  Port:",
        "label_en": "Strip (Grove)  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "label": "Farbe:",
        "label_en": "Colour:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ff0000"
      }
    ],
    "valueInputs": [
      {
        "name": "COUNT",
        "label": "LEDs gesamt",
        "label_en": "total LEDs",
        "check": "Number",
        "defaultValue": 8
      },
      {
        "name": "INDEX",
        "label": "LED Nr.",
        "label_en": "LED no.",
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
    "doc": "# Externer NeoPixel-Streifen – einzelne LED setzen\n\nSteuert eine einzelne LED eines an einem Grove-Port angeschlossenen WS2812B-Streifens.\n„LEDs:\" gibt die Gesamtzahl der LEDs im Streifen an (für alle Streifen-Blöcke am selben Port gleich wählen).",
    "doc_en": "# External NeoPixel strip – set a single LED\n\nControls a single LED of a WS2812B strip connected to a Grove port.\n\"LEDs:\" is the total number of LEDs in the strip (choose the same value for all strip blocks on the same port)."
  },
  {
    "id": "actuator_lcd_color",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "LCD Farbe",
    "label_en": "LCD colour",
    "colour": "#0D9488",
    "tooltip": "Setzt die Hintergrundfarbe des Grove-LCD – ohne den Text zu ändern",
    "tooltip_en": "Sets the background colour of the Grove LCD – without changing the text",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "LCD Farbe  Port:",
        "label_en": "LCD colour  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      },
      {
        "label": "Farbe:",
        "label_en": "Colour:",
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
    "doc": "# Grove-LCD RGB Backlight – Farbe (I2C)\n\nStellt nur die Hintergrundbeleuchtung farbig ein. Lässt den angezeigten Text **unverändert** –\nden Text setzt der Block „📟 LCD Text\".\n> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V).",
    "doc_en": "# Grove LCD RGB Backlight – colour (I2C)\n\nOnly sets the coloured backlight. Leaves the displayed text **unchanged** –\nthe text is set by the \"📟 LCD text\" block.\n> Needs `lib/grove_rgb_lcd.py` on `CIRCUITPY/lib/`. Supports Grove LCD RGB Backlight V5 (3.3 V)."
  },
  {
    "id": "actuator_lcd_text",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "LCD Text",
    "label_en": "LCD text",
    "colour": "#0D9488",
    "tooltip": "Zeigt zwei Zeilen Text auf dem Grove-LCD an – ohne die Farbe zu ändern",
    "tooltip_en": "Shows two lines of text on the Grove LCD – without changing the colour",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "LCD Text  Port:",
        "label_en": "LCD text  port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      }
    ],
    "valueInputs": [
      {
        "name": "LINE1",
        "label": "Zeile 1",
        "label_en": "line 1",
        "check": "String",
        "defaultValue": "Hallo",
        "defaultValue_en": "Hello"
      },
      {
        "name": "LINE2",
        "label": "Zeile 2",
        "label_en": "line 2",
        "check": "String",
        "defaultValue": "Welt",
        "defaultValue_en": "World"
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
    "doc": "# Grove-LCD RGB Backlight – Text (I2C)\n\nZeigt bis zu zwei Zeilen Text an (je 16 Zeichen). Ändert die Hintergrundfarbe **nicht** –\ndafür gibt es den Block „📟 LCD Farbe\".\n> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight V5 (3,3 V).",
    "doc_en": "# Grove LCD RGB Backlight – text (I2C)\n\nShows up to two lines of text (16 characters each). Does **not** change the\nbackground colour – that's what the \"📟 LCD colour\" block is for.\n> Needs `lib/grove_rgb_lcd.py` on `CIRCUITPY/lib/`. Supports Grove LCD RGB Backlight V5 (3.3 V)."
  },
  {
    "id": "tm1637_number",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "7-Seg Zahl anzeigen",
    "label_en": "7-seg show number",
    "colour": "#0D9488",
    "tooltip": "Zeigt eine Zahl (ganze Zahl, −999 bis 9999) auf dem 4-stelligen 7-Segment-Display an",
    "tooltip_en": "Shows a number (integer, −999 to 9999) on the 4-digit 7-segment display",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "7-Seg  Port:",
        "label_en": "7-seg  port:",
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
        "label_en": "number",
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
    "doc": "# TM1637 4-stelliges 7-Segment-Display – Zahl anzeigen\n\nZeigt eine ganze Zahl (−999 bis 9999) auf dem Display an.\n\n**Verdrahtung (Grove-Port):**\n- CLK → Grove Pin 1 (weiß, z. B. GP2 bei Grove 2)\n- DIO → Grove Signal (gelb, z. B. GP3 bei Grove 2)\n- VCC / GND → Grove VCC / GND\n\n**Lib:** `adafruit_tm1637` aus dem Adafruit CircuitPython Bundle → nach `CIRCUITPY/lib/` kopieren.",
    "doc_en": "# TM1637 4-digit 7-segment display – show number\n\nShows an integer (−999 to 9999) on the display.\n\n**Wiring (Grove port):**\n- CLK → Grove pin 1 (white, e.g. GP2 on Grove 2)\n- DIO → Grove signal (yellow, e.g. GP3 on Grove 2)\n- VCC / GND → Grove VCC / GND\n\n**Lib:** `adafruit_tm1637` from the Adafruit CircuitPython Bundle → copy to `CIRCUITPY/lib/`."
  },
  {
    "id": "tm1637_off",
    "blockCategory": "Anzeigen",
    "subCategory": "",
    "label": "7-Seg ausschalten",
    "label_en": "7-seg off",
    "colour": "#0D9488",
    "tooltip": "Löscht alle Ziffern auf dem 7-Segment-Display (Anzeige bleibt dunkel)",
    "tooltip_en": "Clears all digits on the 7-segment display (display stays dark)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "7-Seg ausschalten  Port:",
        "label_en": "7-seg off  port:",
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
    "doc": "# TM1637 4-stelliges 7-Segment-Display – Ausschalten\n\nLöscht alle Segmente (Display bleibt dunkel).",
    "doc_en": "# TM1637 4-digit 7-segment display – turn off\n\nClears all segments (display stays dark)."
  },
  {
    "id": "analog_read",
    "blockCategory": "Pins",
    "subCategory": "",
    "label": "Analog lesen",
    "label_en": "Analog read",
    "colour": "#64748B",
    "tooltip": "Liest den analogen Messwert eines Grove-Ports (0–100 %)",
    "tooltip_en": "Reads the analog value of a Grove port (0–100 %)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Analog lesen  Port:",
        "label_en": "Analog read  port:",
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
    "label_en": "Digital read",
    "colour": "#64748B",
    "tooltip": "Liest einen digitalen Grove-Port (Wahr = HIGH / AN, Falsch = LOW / AUS)",
    "tooltip_en": "Reads a digital Grove port (true = HIGH / ON, false = LOW / OFF)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "Digital lesen  Port:",
        "label_en": "Digital read  port:",
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
    "label_en": "Digital",
    "colour": "#64748B",
    "tooltip": "Setzt einen digitalen Grove-Port auf AN oder AUS",
    "tooltip_en": "Sets a digital Grove port to ON or OFF",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Digital  Port:",
        "label_en": "Digital  port:",
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
