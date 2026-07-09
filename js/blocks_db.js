// js/blocks_db.js – GENERIERT von scripts/build_blocks.js
// Nicht manuell bearbeiten! Neu generieren: node scripts/build_blocks.js
// Generiert: 2026-07-09T09:47:48.452Z

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
    "_file": "sensors/dht11_humidity.md"
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
    "_file": "sensors/dht11_temperature.md"
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
    "_file": "sensors/ldr.md"
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
    "_file": "sensors/ultrasonic.md"
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
    "_file": "sensors/icm20948_g.md"
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
    "_file": "sensors/icm20948_neigung.md"
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
    "_file": "sensors/battery.md"
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
    "_file": "sensors/bodenfeuchte.md"
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
    "_file": "sensors/encoder.md"
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
    "_file": "sensors/taster.md"
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
    "_file": "sensors/event_button.md"
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
    "_file": "sensors/event_ldr.md"
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
    "_file": "sensors/event_temperature.md"
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
    "_file": "sensors/event_ultrasonic.md"
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
    "_file": "actuators/led.md"
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
    "_file": "actuators/led_blink.md"
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
    "_file": "actuators/buzzer.md"
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
    "_file": "actuators/buzzer_off.md"
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
    "_file": "actuators/isd1820.md"
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
    "_file": "actuators/isd1820_record.md"
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
    "_file": "actuators/servo.md"
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
    "_file": "actuators/motor_backward.md"
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
    "_file": "actuators/motor_forward.md"
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
    "_file": "actuators/motor_stop.md"
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
    "_file": "actuators/stepper.md"
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
    "_file": "actuators/neopixel_brightness.md"
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
    "_file": "actuators/neopixel_fill.md"
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
    "_file": "actuators/neopixel_off.md"
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
    "_file": "actuators/neopixel_set.md"
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
    "_file": "actuators/neopixel_ext_brightness.md"
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
    "_file": "actuators/neopixel_ext_fill.md"
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
    "_file": "actuators/neopixel_ext_off.md"
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
    "_file": "actuators/neopixel_ext_set.md"
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
    "_file": "actuators/lcd_color.md"
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
    "_file": "actuators/lcd_text.md"
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
    "_file": "actuators/tm1637_number.md"
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
    "_file": "actuators/tm1637_off.md"
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
