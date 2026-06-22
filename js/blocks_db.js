// js/blocks_db.js – GENERIERT von scripts/build_blocks.js
// Nicht manuell bearbeiten! Neu generieren: node scripts/build_blocks.js
// Generiert: 2026-06-22T11:06:58.708Z

const BLOCKS_CATALOG = {
  "categories": [
    {
      "id": "Sensoren",
      "label": "🔵 Sensoren",
      "colour": "#1565C0",
      "subCategories": [
        "Temperatur & Feuchte",
        "Druck & I2C",
        "Abstand & Licht",
        "Analog",
        "Digital-Sensoren",
        "Joystick & Encoder",
        "Ereignisse"
      ]
    },
    {
      "id": "Aktoren",
      "label": "🟠 Aktoren",
      "colour": "#E65100",
      "subCategories": [
        "LED",
        "Ton",
        "Weitere"
      ]
    },
    {
      "id": "Anzeige",
      "label": "📟 Anzeige",
      "colour": "#00838F",
      "subCategories": []
    },
    {
      "id": "Motor",
      "label": "🟣 Motor",
      "colour": "#6A1B9A",
      "subCategories": []
    },
    {
      "id": "NeoPixel",
      "label": "🌈 NeoPixel",
      "colour": "#006064",
      "subCategories": []
    }
  ]
};

const BLOCKS_DB = [
  {
    "id": "sensor_dht11_humidity",
    "blockCategory": "Sensoren",
    "subCategory": "Temperatur & Feuchte",
    "label": "💧 DHT11 Luftfeuchte (%)",
    "colour": "#1565C0",
    "tooltip": "Liest die Luftfeuchtigkeit in % vom DHT11 Sensor (KY-015)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "💧 DHT11 Luftfeuchte (%)  Port:",
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
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/dht11_humidity.md"
  },
  {
    "id": "sensor_dht11_temperature",
    "blockCategory": "Sensoren",
    "subCategory": "Temperatur & Feuchte",
    "label": "🌡️ DHT11 Temperatur (°C)",
    "colour": "#1565C0",
    "tooltip": "Liest die Temperatur in Grad Celsius vom DHT11 Sensor (KY-015)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "🌡️ DHT11 Temperatur (°C)  Port:",
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
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/dht11_temperature.md"
  },
  {
    "id": "sensor_ldr",
    "blockCategory": "Sensoren",
    "subCategory": "Abstand & Licht",
    "label": "☀️ Helligkeit (0–100%)",
    "colour": "#1565C0",
    "tooltip": "Liest die Helligkeit in Prozent (0 = dunkel, 100 = hell)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "☀️ Helligkeit (0–100%)  Port:",
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
    "label": "📡 Abstand (cm)",
    "colour": "#1565C0",
    "tooltip": "Misst den Abstand in cm mit dem Grove-Ultraschall-Ranger (ein Signal-Pin)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "📡 Abstand (cm)  Port:",
        "name": "SIG",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "hardware": {
      "commonName": "Grove Ultrasonic Ranger",
      "verbrauch3j": 13,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/ultrasonic.md"
  },
  {
    "id": "sensor_battery",
    "blockCategory": "Sensoren",
    "subCategory": "Analog",
    "label": "🔋 Batteriespannung (V)",
    "colour": "#1565C0",
    "tooltip": "Misst die Versorgungsspannung (VBAT) in Volt über GP29",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "🔋 Batteriespannung (V)",
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
    "subCategory": "Analog",
    "label": "🌱 Bodenfeuchte (0–100%)",
    "colour": "#1565C0",
    "tooltip": "Liest die Bodenfeuchte in Prozent aus (0 = trocken, 100 = nass). Kapazitiver Sensor.",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "🌱 Bodenfeuchte (0–100%)  Port:",
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
    "id": "sensor_button",
    "blockCategory": "Sensoren",
    "subCategory": "Digital-Sensoren",
    "label": "🔘 Board-Taster",
    "colour": "#1565C0",
    "tooltip": "Gibt Wahr zurück, wenn der Board-Taster gedrückt wird",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "🔘 Taster",
        "name": "BTN",
        "fieldType": "button_dropdown"
      },
      {
        "label": "gedrückt?",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Board-Taster B1/B2",
      "verbrauch3j": 28,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/button.md"
  },
  {
    "id": "sensor_pir",
    "blockCategory": "Sensoren",
    "subCategory": "Digital-Sensoren",
    "label": "🚶 Bewegung erkannt?",
    "colour": "#1565C0",
    "tooltip": "Gibt Wahr zurück, wenn der PIR-Sensor eine Bewegung erkennt (HC-SR501)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "🚶 Bewegung erkannt?  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import digitalio"
      ],
      "defs": [
        {
          "key": "init_pir_${PIN}",
          "val": "_pir_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_pir_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
        }
      ],
      "expression": "_pir_${PIN}.value",
      "order": "MEMBER"
    },
    "hardware": {
      "commonName": "PIR-Sensor HC-SR501",
      "verbrauch3j": 6,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/pir.md"
  },
  {
    "id": "sensor_sound",
    "blockCategory": "Sensoren",
    "subCategory": "Digital-Sensoren",
    "label": "🔊 Geräusch erkannt?",
    "colour": "#1565C0",
    "tooltip": "Gibt Wahr zurück, wenn der Mikrofon-Sensor ein Geräusch über dem Schwellwert erkennt (KY-037, KY-038)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "🔊 Geräusch erkannt?  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import digitalio"
      ],
      "defs": [
        {
          "key": "init_sound_${PIN}",
          "val": "_sound_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_sound_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
        }
      ],
      "expression": "(not _sound_${PIN}.value)",
      "order": "NONE"
    },
    "hardware": {
      "kyNumber": "KY-038",
      "commonName": "Mikrofon-Schallsensor",
      "verbrauch3j": 7,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/sound.md"
  },
  {
    "id": "sensor_taster",
    "blockCategory": "Sensoren",
    "subCategory": "Digital-Sensoren",
    "label": "🔘 Taster gedrückt?",
    "colour": "#1565C0",
    "tooltip": "Gibt Wahr zurück, wenn der externe Taster an einem beliebigen Pin gedrückt wird (KY-004)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "🔘 Taster gedrückt?  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import digitalio"
      ],
      "defs": [
        {
          "key": "init_taster_${PIN}",
          "val": "_taster_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_taster_${PIN}.switch_to_input(pull=digitalio.Pull.UP)"
        }
      ],
      "expression": "(not _taster_${PIN}.value)",
      "order": "NONE"
    },
    "hardware": {
      "kyNumber": "KY-004",
      "commonName": "Taster / Drucktaster",
      "verbrauch3j": 28,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/taster.md"
  },
  {
    "id": "sensor_touch",
    "blockCategory": "Sensoren",
    "subCategory": "Digital-Sensoren",
    "label": "👆 Berührt?",
    "colour": "#1565C0",
    "tooltip": "Gibt Wahr zurück, wenn der Berührungssensor berührt wird (KY-036)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "👆 Berührt?  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import digitalio"
      ],
      "defs": [
        {
          "key": "init_touch_${PIN}",
          "val": "_touch_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_touch_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
        }
      ],
      "expression": "(not _touch_${PIN}.value)",
      "order": "NONE"
    },
    "hardware": {
      "kyNumber": "KY-036",
      "commonName": "Touch-Sensor",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "sensors/touch.md"
  },
  {
    "id": "sensor_encoder",
    "blockCategory": "Sensoren",
    "subCategory": "Joystick & Encoder",
    "label": "🔄 Drehgeber Position",
    "colour": "#1565C0",
    "tooltip": "Liest die Position des Drehgebers (positiv = rechts, negativ = links)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "🔄 Drehgeber Position  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "2pin"
      }
    ],
    "hardware": {
      "commonName": "Grove Encoder / Drehgeber",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/encoder.md"
  },
  {
    "id": "event_button",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "🔘 Wenn Taster",
    "colour": "#0D47A1",
    "tooltip": "Führt Code aus, wenn der Taster gedrückt oder losgelassen wird",
    "blockType": "event_simple",
    "inputs": [
      {
        "label": "🔘 Wenn Taster",
        "name": "BTN",
        "fieldType": "button_dropdown"
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
      "commonName": "Board-Taster B1/B2",
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
    "label": "☀️ Wenn Helligkeit",
    "colour": "#0D47A1",
    "tooltip": "Führt Code aus, wenn die Helligkeit einen Wert überschreitet/unterschreitet",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "☀️ Wenn Helligkeit  Port:",
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
    "id": "event_sound",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "🔊 Wenn Geräusch erkannt",
    "colour": "#0D47A1",
    "tooltip": "Führt Code aus, wenn der Mikrofon-Sensor ein Geräusch über dem Schwellwert erkennt",
    "blockType": "event_simple",
    "inputs": [
      {
        "label": "🔊 Wenn Geräusch erkannt  Port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "statementInput": {
      "name": "DO",
      "label": "→ dann"
    },
    "generator": {
      "imports": [
        "import board",
        "import digitalio"
      ],
      "defs": [
        {
          "key": "init_sound_${PIN}",
          "val": "_sound_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_sound_${PIN}.switch_to_input(pull=digitalio.Pull.DOWN)"
        }
      ],
      "code": "if not _sound_${PIN}.value:\n${DO}"
    },
    "hardware": {
      "kyNumber": "KY-038",
      "commonName": "Schallsensor",
      "verbrauch3j": 7,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "sensors/event_sound.md"
  },
  {
    "id": "event_temperature",
    "blockCategory": "Sensoren",
    "subCategory": "Ereignisse",
    "label": "🌡️ Wenn Temperatur",
    "colour": "#0D47A1",
    "tooltip": "Führt Code aus, wenn die Temperatur einen Wert überschreitet/unterschreitet",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "🌡️ Wenn Temperatur  Port:",
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
    "label": "📡 Wenn Abstand",
    "colour": "#0D47A1",
    "tooltip": "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet",
    "blockType": "event",
    "inline": true,
    "inputs": [
      {
        "label": "📡 Wenn Abstand  Port:",
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
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "sensors/event_ultrasonic.md"
  },
  {
    "id": "actuator_led",
    "blockCategory": "Aktoren",
    "subCategory": "LED",
    "label": "💡 LED",
    "colour": "#E65100",
    "tooltip": "Schaltet eine LED ein oder aus",
    "blockType": "statement",
    "inputs": [
      {
        "label": "💡 LED  Port:",
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
    "blockCategory": "Aktoren",
    "subCategory": "LED",
    "label": "💡 LED blinken",
    "colour": "#E65100",
    "tooltip": "Lässt eine LED mehrmals blinken",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "💡 LED  Port:",
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
    "blockCategory": "Aktoren",
    "subCategory": "Ton",
    "label": "🔔 Buzzer Ton",
    "colour": "#E65100",
    "tooltip": "Spielt einen Ton mit der angegebenen Frequenz (z.B. 440 = Kammerton A)",
    "blockType": "statement",
    "inline": true,
    "valueInputs": [
      {
        "name": "FREQ",
        "label": "🔔 Buzzer  Ton:",
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
    "blockCategory": "Aktoren",
    "subCategory": "Ton",
    "label": "🔔 Buzzer aus",
    "colour": "#E65100",
    "tooltip": "Schaltet den Buzzer aus",
    "blockType": "statement",
    "inputs": [
      {
        "label": "🔔 Buzzer  aus",
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
    "id": "actuator_servo",
    "blockCategory": "Aktoren",
    "subCategory": "Weitere",
    "label": "⚙️ Servo",
    "colour": "#E65100",
    "tooltip": "Dreht einen Servo-Motor auf einen bestimmten Winkel (0 bis 180 Grad)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "⚙️ Servo",
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
      "kitStandard": true
    },
    "legacyGenerator": true,
    "_file": "actuators/servo.md"
  },
  {
    "id": "actuator_wasserpumpe",
    "blockCategory": "Aktoren",
    "subCategory": "Weitere",
    "label": "💧 Wasserpumpe",
    "colour": "#E65100",
    "tooltip": "Schaltet eine Mini-Tauchpumpe ein oder aus (über Relais oder Motorkanal)",
    "blockType": "statement",
    "inputs": [
      {
        "label": "💧 Wasserpumpe  Port:",
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
          "key": "init_pumpe_${PIN}",
          "val": "_pumpe_${PIN} = digitalio.DigitalInOut(board.${PIN})\n_pumpe_${PIN}.direction = digitalio.Direction.OUTPUT"
        }
      ],
      "code": "_pumpe_${PIN}.value = ${STATE}\n"
    },
    "hardware": {
      "commonName": "Mini-Tauchpumpe 3–6V",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "actuators/wasserpumpe.md"
  },
  {
    "id": "actuator_lcd",
    "blockCategory": "Anzeige",
    "subCategory": "",
    "label": "📟 LCD anzeigen",
    "colour": "#00838F",
    "tooltip": "Zeigt Text auf dem Grove-LCD RGB Backlight an und setzt die Hintergrundfarbe",
    "blockType": "statement",
    "inline": false,
    "inputs": [
      {
        "label": "📟 LCD anzeigen  Port:",
        "name": "PORT",
        "fieldType": "grove_dropdown",
        "groveRole": "i2c"
      },
      {
        "label": "Version:",
        "name": "VERSION",
        "fieldType": "lcd_version_dropdown"
      },
      {
        "label": "Farbe:",
        "name": "COLOR",
        "fieldType": "colour_picker",
        "default": "#ffffff"
      }
    ],
    "valueInputs": [
      {
        "name": "TEXT",
        "label": "Text",
        "check": "String"
      }
    ],
    "hardware": {
      "commonName": "Grove-LCD RGB Backlight",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/lcd.md"
  },
  {
    "id": "actuator_motor_backward",
    "blockCategory": "Motor",
    "subCategory": "",
    "label": "🚗 Motor rückwärts",
    "colour": "#6A1B9A",
    "tooltip": "Fährt einen DC-Motor rückwärts (0–100 % Geschwindigkeit)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "🚗 Motor",
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
    "blockCategory": "Motor",
    "subCategory": "",
    "label": "🚗 Motor vorwärts",
    "colour": "#6A1B9A",
    "tooltip": "Fährt einen DC-Motor vorwärts (0–100 % Geschwindigkeit)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "🚗 Motor",
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
    "blockCategory": "Motor",
    "subCategory": "",
    "label": "🛑 Motor stopp",
    "colour": "#6A1B9A",
    "tooltip": "Stoppt einen DC-Motor",
    "blockType": "statement",
    "inputs": [
      {
        "label": "🛑 Motor",
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
    "id": "neopixel_fill",
    "blockCategory": "NeoPixel",
    "subCategory": "",
    "label": "🌈 NeoPixel alle",
    "colour": "#006064",
    "tooltip": "Setzt alle NeoPixel-LEDs auf die gleiche Farbe",
    "blockType": "statement",
    "inputs": [
      {
        "label": "🌈 NeoPixel  alle  Farbe:",
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
    "blockCategory": "NeoPixel",
    "subCategory": "",
    "label": "🌈 NeoPixel alle aus",
    "colour": "#006064",
    "tooltip": "Schaltet alle NeoPixel-LEDs aus",
    "blockType": "statement",
    "inputs": [
      {
        "label": "🌈 NeoPixel  alle aus",
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
    "blockCategory": "NeoPixel",
    "subCategory": "",
    "label": "🌈 NeoPixel LED Nr.",
    "colour": "#006064",
    "tooltip": "Setzt eine einzelne NeoPixel-LED auf eine bestimmte Farbe (1–13)",
    "blockType": "statement",
    "inputs": [
      {
        "label": "🌈 NeoPixel  LED Nr.",
        "name": "INDEX",
        "fieldType": "number_field",
        "default": 1,
        "min": 1,
        "max": 13,
        "precision": 1
      },
      {
        "label": "Farbe:",
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
    "_file": "actuators/neopixel_set.md"
  }
];
