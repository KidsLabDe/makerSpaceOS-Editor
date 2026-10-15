// js/blocks_db.js – GENERIERT von scripts/build_blocks.js
// Nicht manuell bearbeiten! Neu generieren: node scripts/build_blocks.js
// Generiert: 2026-10-15T20:41:41.091Z

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
        "Akku",
        "Weitere",
        "Ereignisse"
      ],
      "subCategories_en": {
        "Temperatur & Feuchte": "Temperature & Humidity",
        "Abstand & Licht": "Distance & Light",
        "Bewegung": "Motion",
        "Akku": "Battery",
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
        "Fahren",
        "LED",
        "Ton",
        "Servo & Pumpe",
        "Motor"
      ],
      "subCategories_en": {
        "Fahren": "Driving",
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
    "tooltip": "Misst den Abstand in cm – Typ wählen: Grove-Ranger (1 Pin) oder freier HC-SR04 (TRIG + ECHO)",
    "tooltip_en": "Measures the distance in cm – choose type: Grove Ranger (1 pin) or bare HC-SR04 (TRIG + ECHO)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Abstand (cm)  Port:",
        "label_en": "Distance (cm)  port:",
        "name": "SIG",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "label": "Typ:",
        "label_en": "type:",
        "name": "TYPE",
        "fieldType": "sensor_type_dropdown"
      }
    ],
    "hardware": {
      "commonName": "Ultraschall-Ranger (Grove / HC-SR04)",
      "verbrauch3j": 13,
      "kitStandard": true,
      "width_mm": 45,
      "height_mm": 20.5
    },
    "legacyGenerator": true,
    "_file": "sensors/ultrasonic.md",
    "doc": "# Ultraschall-Abstandssensor\n\nMisst Abstände von ca. 2 cm bis 400 cm. Wähle im Block den passenden **Sensor-Typ**:\n\n- **Grove Ranger (1 Pin)**: Das Grove-Ultraschall-Modul misst mit nur einem\n  Signal-Kabel (Trigger und Echo teilen sich Pin 2 des Grove-Steckers).\n- **HC-SR04 (TRIG + ECHO)**: Freier SR04 am Grove-Port verkabelt: VCC und GND\n  an die Stromkabel, **TRIG** an das Signal-Kabel (Pin 2), **ECHO** an das 2.\n  Datenkabel (Pin 1). Der Generator nimmt automatisch die beiden Pins des\n  gewählten Ports.\n\nAchtung: Am Grove-Port hat der Sensor nur 3,3 V statt 5 V – er funktioniert,\naber die maximale Reichweite wird kleiner. Generatoren: siehe `js/generator.js`.",
    "doc_en": "# Ultrasonic distance sensor\n\nMeasures distances from about 2 cm to 4 m. Choose the matching **sensor type**\nin the block:\n\n- **Grove Ranger (1 pin)**: The Grove ultrasonic module measures with a single\n  signal wire (trigger and echo share pin 2 of the Grove connector).\n- **HC-SR04 (TRIG + ECHO)**: Bare SR04 wired to a Grove port: VCC and GND to\n  the power wires, **TRIG** to the signal wire (pin 2), **ECHO** to the second\n  data wire (pin 1). The generator picks both pins of the chosen port\n  automatically.\n\nNote: On a Grove port the sensor only gets 3.3 V instead of 5 V – it works,\nbut the maximum range is reduced. Generators: see `js/generator.js`."
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
    "id": "sensor_akku_laedt",
    "blockCategory": "Sensoren",
    "subCategory": "Akku",
    "requiresBoardFeature": "powerMonitor",
    "label": "Akku lädt?",
    "label_en": "Battery charging?",
    "colour": "#2563EB",
    "tooltip": "Wahr, solange Strom in den Akku fließt (USB steckt und Akku ist nicht voll)",
    "tooltip_en": "True while current flows into the battery (USB plugged in and battery not full)",
    "blockType": "value",
    "output": "Boolean",
    "inputs": [
      {
        "label": "Akku lädt?",
        "label_en": "Battery charging?",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Akku-Messchip INA226 (RoboBuddy-Powerboard)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "sensors/akku_laedt.md",
    "doc": "# Akku lädt? (RoboBuddy)\n\nGibt **Wahr** zurück, solange der Akku geladen wird – also mehr als 20 mA hineinfließen. Ist der Akku voll, hört das Laden auf und der Block meldet wieder **Falsch**.\n\nIdee: Beim Laden ein schlafendes Gesicht zeigen.",
    "doc_en": "# Battery charging? (RoboBuddy)\n\nReturns **true** while the battery is being charged – i.e. more than 20 mA flow in. When the battery is full, charging stops and the block reports **false** again.\n\nIdea: show a sleepy face while charging."
  },
  {
    "id": "sensor_akku_prozent",
    "blockCategory": "Sensoren",
    "subCategory": "Akku",
    "requiresBoardFeature": "powerMonitor",
    "label": "Akkustand (%)",
    "label_en": "Battery level (%)",
    "colour": "#2563EB",
    "tooltip": "Wie voll der Akku ist, in Prozent (0 = leer, 100 = voll) – grob aus der Spannung geschätzt",
    "tooltip_en": "How full the battery is, in percent (0 = empty, 100 = full) – roughly estimated from the voltage",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Akkustand (%)",
        "label_en": "Battery level (%)",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Akku-Messchip INA226 (RoboBuddy-Powerboard)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "sensors/akku_prozent.md",
    "doc": "# Akkustand in Prozent (RoboBuddy)\n\nSchätzt aus der Akkuspannung, wie voll der Akku ist: **0 %** = leer (3,5 V), **100 %** = voll (4,15 V).\n\nDer Wert ist nur eine Schätzung: Beim Fahren sackt die Spannung kurz ab (dann zeigt der Block weniger), beim Laden steigt sie an (dann zeigt er mehr). Am genauesten ist er, wenn der Roboter still steht und nicht lädt.",
    "doc_en": "# Battery level in percent (RoboBuddy)\n\nEstimates from the battery voltage how full the battery is: **0 %** = empty (3.5 V), **100 %** = full (4.15 V).\n\nThe value is only an estimate: while driving the voltage briefly drops (the block shows less), while charging it rises (the block shows more). It is most accurate when the robot is standing still and not charging."
  },
  {
    "id": "sensor_akku_spannung",
    "blockCategory": "Sensoren",
    "subCategory": "Akku",
    "requiresBoardFeature": "powerMonitor",
    "label": "Akkuspannung (V)",
    "label_en": "Battery voltage (V)",
    "colour": "#2563EB",
    "tooltip": "Spannung des Akkus in Volt (voll ≈ 4,2 V, leer ≈ 3,5 V)",
    "tooltip_en": "Battery voltage in volts (full ≈ 4.2 V, empty ≈ 3.5 V)",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Akkuspannung (V)",
        "label_en": "Battery voltage (V)",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Akku-Messchip INA226 (RoboBuddy-Powerboard)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "sensors/akku_spannung.md",
    "doc": "# Akkuspannung (RoboBuddy)\n\nMisst die Spannung des Akkus in Volt, mit zwei Nachkommastellen.\n\n- **4,2 V** – voll geladen\n- **3,6 V** – fast leer, bald laden\n- **3,5 V** – leer: Der RoboBuddy schaltet die Servos ab und schläft\n\nDer Messchip (INA226) sitzt auf dem Powerboard. **Ohne Akku** (nur USB) springt der Wert wild zwischen etwa 4,1 und 4,4 V hin und her – das ist der Lader, kein Fehler.",
    "doc_en": "# Battery voltage (RoboBuddy)\n\nMeasures the battery voltage in volts, with two decimal places.\n\n- **4.2 V** – fully charged\n- **3.6 V** – almost empty, charge soon\n- **3.5 V** – empty: the RoboBuddy switches the servos off and goes to sleep\n\nThe measuring chip (INA226) sits on the power board. **Without a battery** (USB only) the value jumps wildly between about 4.1 and 4.4 V – that's the charger, not a fault."
  },
  {
    "id": "sensor_akku_strom",
    "blockCategory": "Sensoren",
    "subCategory": "Akku",
    "requiresBoardFeature": "powerMonitor",
    "label": "Akkustrom (mA)",
    "label_en": "Battery current (mA)",
    "colour": "#2563EB",
    "tooltip": "Strom am Akku in Milliampere: positiv = Akku wird geladen, negativ = Roboter verbraucht Strom",
    "tooltip_en": "Battery current in milliamps: positive = battery is charging, negative = robot is using power",
    "blockType": "value",
    "output": "Number",
    "inputs": [
      {
        "label": "Akkustrom (mA)",
        "label_en": "Battery current (mA)",
        "fieldType": "fixed_label"
      }
    ],
    "hardware": {
      "commonName": "Akku-Messchip INA226 (RoboBuddy-Powerboard)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "sensors/akku_strom.md",
    "doc": "# Akkustrom (RoboBuddy)\n\nZeigt, wie viel Strom gerade in den Akku hinein- oder aus ihm herausfließt – in Milliampere (mA).\n\n- **positiv** (z. B. `+200`) – der Akku wird **geladen** (USB steckt)\n- **negativ** (z. B. `-450`) – der Roboter **verbraucht** Strom aus dem Akku\n- **ungefähr 0** – nichts passiert, oder der Akku ist voll\n\nProbier mal: Fahren lassen und den Wert im Serial-Monitor ausgeben. Wie viel mehr brauchen die Servos beim Anfahren?",
    "doc_en": "# Battery current (RoboBuddy)\n\nShows how much current is flowing into or out of the battery right now – in milliamps (mA).\n\n- **positive** (e.g. `+200`) – the battery is **charging** (USB plugged in)\n- **negative** (e.g. `-450`) – the robot is **using** power from the battery\n- **about 0** – nothing is happening, or the battery is full\n\nTry it: let the robot drive and print the value in the serial monitor. How much more do the servos need when starting?"
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
        "groveRole": "2pin_sequential"
      }
    ],
    "hardware": {
      "commonName": "Grove Encoder / Drehgeber",
      "verbrauch3j": 0,
      "kitStandard": true,
      "width_mm": 19,
      "height_mm": 26
    },
    "legacyGenerator": true,
    "_file": "sensors/encoder.md",
    "doc": "# Drehgeber / Rotary Encoder (Grove)\n\nZählt Drehbewegungen (unbegrenzt). Positiver Wert = Rechtsdrehung, negativer Wert = Linksdrehung.\nNutzt beide Pins des Grove-Ports (Pin1 = CLK, Pin2 = DT). Generator: siehe `js/generator.js`.\n\n**Wichtiger Hinweis:** CircuitPython liest den Drehgeber per PIO – die beiden Pins müssen\n**benachbarte GPIOs** sein (z. B. GP0/GP1). Deshalb bietet der Port-Auswahlbereich nur\ngeeignete Ports an (beim MAKER-PI: Grove 1, 2, 3, 4, 6 – **nicht** Grove 5 und 7).",
    "doc_en": "# Rotary encoder (Grove)\n\nCounts rotations (unlimited). Positive value = clockwise, negative value = counter-clockwise.\nUses both pins of the Grove port (pin 1 = CLK, pin 2 = DT). Generator: see `js/generator.js`.\n\n**Important:** CircuitPython reads the encoder via PIO – the two pins must be\n**adjacent GPIOs** (e.g. GP0/GP1). The port dropdown therefore only lists suitable\nports (on the MAKER-PI: Grove 1, 2, 3, 4, 6 – **not** Grove 5 and 7)."
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
      "commonName": "LDR / Fotowiderstand",
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
    "tooltip": "Führt Code aus, wenn der Abstand einen Wert überschreitet/unterschreitet (Grove-Ranger oder HC-SR04)",
    "tooltip_en": "Runs code when the distance goes above/below a value (Grove Ranger or HC-SR04)",
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
        "label": "Typ:",
        "label_en": "type:",
        "name": "TYPE",
        "fieldType": "sensor_type_dropdown"
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
      "width_mm": 45,
      "height_mm": 20.5
    },
    "legacyGenerator": true,
    "_file": "sensors/event_ultrasonic.md",
    "doc": "# Ereignis: Wenn Abstand\n\nFührt Aktionen aus, wenn der gemessene Abstand einen Schwellwert über- oder\nunterschreitet. Sensor-Typ wählbar: **Grove Ranger (1 Pin)** oder freier\n**HC-SR04** (TRIG an Pin 2, ECHO an Pin 1 des Grove-Steckers).\nGeneratoren: siehe `js/generator.js`.",
    "doc_en": "# Event: when distance\n\nRuns actions when the measured distance goes above or below a threshold.\nSensor type selectable: **Grove Ranger (1 pin)** or bare **HC-SR04** (TRIG on\npin 2, ECHO on pin 1 of the Grove connector). Generators: see `js/generator.js`."
  },
  {
    "id": "actuator_drive",
    "blockCategory": "Aktionen",
    "subCategory": "Fahren",
    "requiresBoardFeature": "drive",
    "label": "Fahren",
    "label_en": "Drive",
    "colour": "#DC2626",
    "tooltip": "Lässt den RoboBuddy fahren: vorwärts, rückwärts, drehen oder anhalten. Tempo 0 bis 100 %",
    "tooltip_en": "Makes the RoboBuddy drive: forward, backward, turn or stop. Speed 0 to 100 %",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Fahren",
        "label_en": "Drive",
        "name": "DIR",
        "fieldType": "options_dropdown",
        "options": [
          {
            "label": "vorwärts",
            "label_en": "forward",
            "value": "vor"
          },
          {
            "label": "rückwärts",
            "label_en": "backward",
            "value": "zurueck"
          },
          {
            "label": "links drehen",
            "label_en": "turn left",
            "value": "links"
          },
          {
            "label": "rechts drehen",
            "label_en": "turn right",
            "value": "rechts"
          },
          {
            "label": "stopp",
            "label_en": "stop",
            "value": "stopp"
          }
        ]
      }
    ],
    "valueInputs": [
      {
        "name": "SPEED",
        "label": "Tempo",
        "label_en": "speed",
        "check": "Number",
        "defaultValue": 50,
        "suffix": "%"
      }
    ],
    "hardware": {
      "commonName": "2 Dauerdreh-Servos (RoboBuddy, S1 links / S2 rechts)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/drive.md",
    "doc": "# Fahren (RoboBuddy)\n\nSteuert beide Räder des RoboBuddy gleichzeitig:\n\n- **vorwärts / rückwärts** – beide Räder drehen gleich schnell\n- **links drehen / rechts drehen** – die Räder drehen gegeneinander, der Roboter dreht sich auf der Stelle\n- **stopp** – beide Räder halten an\n\n**Tempo** geht von 0 bis 100 %. Der RoboBuddy fährt **sanft an und bremst sanft** (in 0,2 Sekunden) – das schont den Akku.\n\nDer Block fährt so lange, bis ein anderer Fahren-Block kommt. Typisch: `Fahren vorwärts 50 %` → `warte 2 Sekunden` → `Fahren stopp`.\n\n> Die Servos bekommen nur Strom, wenn ein **Akku** steckt – auch wenn USB angeschlossen ist. Ohne Akku läuft das Programm, aber nichts bewegt sich.\n>\n> Rechtes Rad = Servo-Anschluss **S1**, linkes Rad = **S2** (von hinten gesehen; die beiden Servos sind gespiegelt eingebaut, darum kümmert sich der Block).",
    "doc_en": "# Drive (RoboBuddy)\n\nControls both wheels of the RoboBuddy at the same time:\n\n- **forward / backward** – both wheels turn at the same speed\n- **turn left / turn right** – the wheels turn against each other, the robot spins on the spot\n- **stop** – both wheels stop\n\n**Speed** goes from 0 to 100 %. The RoboBuddy **starts and brakes gently** (within 0.2 seconds) – this protects the battery.\n\nThe block keeps driving until another drive block comes. Typical: `drive forward 50 %` → `wait 2 seconds` → `drive stop`.\n\n> The servos only get power when a **battery** is plugged in – even with USB connected. Without a battery the program runs, but nothing moves.\n>\n> Right wheel = servo connector **S1**, left wheel = **S2** (seen from behind; the two servos are mounted mirrored, the block takes care of that)."
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
    "id": "actuator_buzzer_port",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "requiresBoardFeature": "externalBuzzer",
    "label": "Buzzer Ton",
    "label_en": "Buzzer tone",
    "colour": "#DC2626",
    "tooltip": "Spielt einen Ton mit einem passiven Buzzer am gewählten Anschluss (z.B. 440 = Kammerton A)",
    "tooltip_en": "Plays a tone with a passive buzzer on the chosen connector (e.g. 440 = concert pitch A)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Buzzer  Port:",
        "label_en": "Buzzer  port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "FREQ",
        "label": "Ton:",
        "label_en": "tone:",
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
    "generator": {
      "imports": [
        "import board",
        "import pwmio"
      ],
      "defs": [
        {
          "key": "init_buzz_${PIN}",
          "val": "_buzz_${PIN} = pwmio.PWMOut(board.${PIN}, duty_cycle=0, frequency=440, variable_frequency=True)"
        }
      ],
      "code": "_buzz_${PIN}.frequency = ${FREQ}\n_buzz_${PIN}.duty_cycle = 32768\nawait asyncio.sleep(${DURATION})\n_buzz_${PIN}.duty_cycle = 0\n"
    },
    "hardware": {
      "commonName": "Passiver Buzzer (extern)",
      "verbrauch3j": 14,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "actuators/buzzer_port.md",
    "doc": "# Buzzer-Ton (externer Buzzer)\n\nSpielt Töne mit einem **passiven Buzzer**, den du an einen Anschluss steckst (beim RoboBuddy: A0, A1 oder A2). Die Frequenz bestimmt die Tonhöhe: 262 = C, 440 = A.\n\n> Beim RoboBuddy sind die Ton-Ausgänge knapp: Neben den vier Servos gehen höchstens **zwei** weitere Ton-/PWM-Ausgänge gleichzeitig (Buzzer oder PWM-Block). Ein dritter bricht mit einer Fehlermeldung ab.",
    "doc_en": "# Buzzer tone (external buzzer)\n\nPlays tones with a **passive buzzer** that you plug into a connector (on the RoboBuddy: A0, A1 or A2). The frequency sets the pitch: 262 = C, 440 = A.\n\n> On the RoboBuddy, tone outputs are scarce: besides the four servos, at most **two** more tone/PWM outputs work at the same time (buzzer or PWM block). A third one stops with an error message."
  },
  {
    "id": "actuator_buzzer_port_off",
    "blockCategory": "Aktionen",
    "subCategory": "Ton",
    "requiresBoardFeature": "externalBuzzer",
    "label": "Buzzer aus",
    "label_en": "Buzzer off",
    "colour": "#DC2626",
    "tooltip": "Schaltet den Buzzer am gewählten Anschluss aus",
    "tooltip_en": "Turns off the buzzer on the chosen connector",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Buzzer  Port:",
        "label_en": "Buzzer  port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      },
      {
        "label": "aus",
        "label_en": "off",
        "fieldType": "fixed_label"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import pwmio"
      ],
      "defs": [
        {
          "key": "init_buzz_${PIN}",
          "val": "_buzz_${PIN} = pwmio.PWMOut(board.${PIN}, duty_cycle=0, frequency=440, variable_frequency=True)"
        }
      ],
      "code": "_buzz_${PIN}.duty_cycle = 0\n"
    },
    "hardware": {
      "commonName": "Passiver Buzzer (extern)",
      "verbrauch3j": 0,
      "kitStandard": true
    },
    "legacyGenerator": false,
    "_file": "actuators/buzzer_port_off.md",
    "doc": "# Buzzer ausschalten (externer Buzzer)\n\nSchaltet den Buzzer am gewählten Anschluss aus.",
    "doc_en": "# Turn buzzer off (external buzzer)\n\nTurns off the buzzer on the chosen connector."
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
    "id": "actuator_wheel_servo",
    "blockCategory": "Aktionen",
    "subCategory": "Servo & Pumpe",
    "label": "Rad-Servo",
    "label_en": "Wheel servo",
    "colour": "#DC2626",
    "tooltip": "Dreht einen Dauerdreh-Servo (360°): -100 = volle Fahrt rückwärts, 0 = Stopp, 100 = volle Fahrt vorwärts",
    "tooltip_en": "Turns a continuous-rotation servo (360°): -100 = full speed backward, 0 = stop, 100 = full speed forward",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Rad-Servo",
        "label_en": "Wheel servo",
        "name": "SERVO",
        "fieldType": "servo_dropdown"
      }
    ],
    "valueInputs": [
      {
        "name": "SPEED",
        "label": "Tempo",
        "label_en": "speed",
        "check": "Number",
        "defaultValue": 50,
        "suffix": "%  (-100 … 100)"
      }
    ],
    "hardware": {
      "commonName": "Dauerdreh-Servo (360°, z. B. FS90R)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": true,
    "_file": "actuators/wheel_servo.md",
    "doc": "# Rad-Servo (Dauerdreh-Servo)\n\nEin **Dauerdreh-Servo** (auch 360°-Servo) dreht sich endlos wie ein Motor – anders als ein normaler Servo, der nur auf einen Winkel fährt.\n\n- **100** – volle Fahrt vorwärts\n- **0** – Stopp\n- **-100** – volle Fahrt rückwärts\n\nSteht der Servo bei 0 nicht ganz still, ist er leicht verstellt – manche Servos haben dafür eine kleine Stellschraube.",
    "doc_en": "# Wheel servo (continuous-rotation servo)\n\nA **continuous-rotation servo** (also 360° servo) turns endlessly like a motor – unlike a normal servo, which only moves to an angle.\n\n- **100** – full speed forward\n- **0** – stop\n- **-100** – full speed backward\n\nIf the servo does not stand completely still at 0, it is slightly off – some servos have a small adjustment screw for this."
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
    "doc": "# Schrittmotor (28BYJ-48 + ULN2003)\n\nDreht einen 28BYJ-48 Schrittmotor präzise um einen Winkel. Eine volle Umdrehung\nentspricht 4096 Halbschritten (Motor mit 1:64-Getriebe).\n\n## Verdrahtung\n\nDer ULN2003-Treiber hat vier Eingänge **IN1–IN4**, angesteuert über zwei Grove-Ports:\n\n- **Anschluss 1** → IN1 (Pin 1) und IN2 (Signalpin)\n- **Anschluss 2** → IN3 (Pin 1) und IN4 (Signalpin)\n\n> **5 V Versorgung:** Die Grove-Ports liefern nur ein 3,3-V-Signal. Die\n> Stromversorgung (**5 V + GND**) des ULN2003 wird extern vom **Servo-Header**\n> des Boards abgegriffen. Generator: siehe `js/generator.js`.\n\n## Foto-Anleitung\n\nSo sieht das komplette Set aus Treiberboard und 28BYJ-48-Schrittmotor aus:\n\n![Treiberboard und 28BYJ-48-Schrittmotor mit Verbindungskabel](../images/stepper_uebersicht.jpg)\n\nDie beiden Grove-Kabel (Anschluss 1 und Anschluss 2) werden an zwei benachbarte Grove-Ports des Boards angeschlossen:\n\n![Zwei Grove-Kabel an benachbarten Grove-Ports des Boards](../images/stepper_verkabelung_1.jpg)\n\nDie Kabel führen gemeinsam zum Eingangsstecker des ULN2003-Treiberboards. Die Motorspannung (5–12 V) kommt separat über die Schraubklemme:\n\n![Grove-Kabel am Eingangsstecker des ULN2003-Treiberboards](../images/stepper_verkabelung_2.jpg)\n\nAuf der anderen Seite des Treiberboards führt die Leitung weiter zum Schrittmotor:\n\n![Ausgangsseite des Treiberboards zum Schrittmotor](../images/stepper_verkabelung_3.jpg)",
    "doc_en": "# Stepper motor (28BYJ-48 + ULN2003)\n\nTurns a 28BYJ-48 stepper motor precisely by an angle. One full revolution\nequals 4096 half steps (motor with 1:64 gearbox).\n\n## Wiring\n\nThe ULN2003 driver has four inputs **IN1–IN4**, driven via two Grove ports:\n\n- **Connector 1** → IN1 (pin 1) and IN2 (signal pin)\n- **Connector 2** → IN3 (pin 1) and IN4 (signal pin)\n\n> **5 V supply:** the Grove ports only provide a 3.3 V signal. The power\n> supply (**5 V + GND**) of the ULN2003 is taken externally from the board's\n> **servo header**. Generator: see `js/generator.js`.\n\n## Photo guide\n\nThis is the complete set of driver board and 28BYJ-48 stepper motor:\n\n![Driver board and 28BYJ-48 stepper motor with connecting cable](../images/stepper_uebersicht.jpg)\n\nBoth Grove cables (connector 1 and connector 2) are plugged into two neighboring Grove ports on the board:\n\n![Two Grove cables on neighboring Grove ports of the board](../images/stepper_verkabelung_1.jpg)\n\nThe cables lead together to the input connector of the ULN2003 driver board. The motor voltage (5–12 V) comes in separately via the screw terminal:\n\n![Grove cables at the input connector of the ULN2003 driver board](../images/stepper_verkabelung_2.jpg)\n\nOn the other side of the driver board, the wiring continues to the stepper motor:\n\n![Output side of the driver board to the stepper motor](../images/stepper_verkabelung_3.jpg)"
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
    "doc": "# Grove-LCD – Farbe (I2C)\n\nStellt nur die Hintergrundbeleuchtung farbig ein. Lässt den angezeigten Text **unverändert** –\nden Text setzt der Block „📟 LCD Text\".\n> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Greift nur bei Displays mit RGB-Beleuchtung\n> (Grove-LCD RGB Backlight V4/V5). Beim Grove-16x2-LCD (Mono) wird der Block harmlos ignoriert.",
    "doc_en": "# Grove LCD – colour (I2C)\n\nOnly sets the coloured backlight. Leaves the displayed text **unchanged** –\nthe text is set by the \"📟 LCD text\" block.\n> Needs `lib/grove_rgb_lcd.py` on `CIRCUITPY/lib/`. Only works on displays with an RGB backlight\n> (Grove LCD RGB Backlight V4/V5). On the Grove 16x2 LCD (monochrome) the block is harmlessly ignored."
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
    "doc": "# Grove-LCD – Text (I2C)\n\nZeigt bis zu zwei Zeilen Text an (je 16 Zeichen). Ändert die Hintergrundfarbe **nicht** –\ndafür gibt es den Block „📟 LCD Farbe\".\n> Benötigt `lib/grove_rgb_lcd.py` auf `CIRCUITPY/lib/`. Unterstützt Grove-LCD RGB Backlight (V4/V5)\n> **und** das Grove-16x2-LCD (Mono-Versionen, z. B. Schwarz/Gelb) – die Beleuchtung wird automatisch erkannt.",
    "doc_en": "# Grove LCD – text (I2C)\n\nShows up to two lines of text (16 characters each). Does **not** change the\nbackground colour – that's what the \"📟 LCD colour\" block is for.\n> Needs `lib/grove_rgb_lcd.py` on `CIRCUITPY/lib/`. Supports the Grove LCD RGB Backlight (V4/V5)\n> **and** the Grove 16x2 LCD (monochrome variants, e.g. black on yellow) – the backlight is detected automatically."
  },
  {
    "id": "display_clear",
    "blockCategory": "Anzeigen",
    "requiresBoardFeature": "display",
    "label": "Display löschen",
    "label_en": "Clear display",
    "colour": "#0D9488",
    "tooltip": "Macht das runde Display schwarz",
    "tooltip_en": "Makes the round display black",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Display löschen",
        "label_en": "Clear display",
        "fieldType": "fixed_label"
      }
    ],
    "generator": {
      "imports": [
        "import robo_display"
      ],
      "code": "robo_display.loeschen()\n"
    },
    "hardware": {
      "commonName": "Rundes Display GC9A01 (RoboBuddy)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "actuators/display_clear.md",
    "doc": "# Display löschen (RoboBuddy)\n\nMacht das runde Display schwarz – Gesicht und Text verschwinden.",
    "doc_en": "# Clear display (RoboBuddy)\n\nMakes the round display black – face and text disappear."
  },
  {
    "id": "display_eyes",
    "blockCategory": "Anzeigen",
    "requiresBoardFeature": "display",
    "label": "Augen schauen",
    "label_en": "Eyes look",
    "colour": "#0D9488",
    "tooltip": "Lässt die Augen des Gesichts in eine Richtung schauen",
    "tooltip_en": "Makes the face's eyes look in a direction",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Augen schauen",
        "label_en": "Eyes look",
        "name": "DIR",
        "fieldType": "options_dropdown",
        "options": [
          {
            "label": "nach links",
            "label_en": "left",
            "value": "links"
          },
          {
            "label": "nach rechts",
            "label_en": "right",
            "value": "rechts"
          },
          {
            "label": "nach oben",
            "label_en": "up",
            "value": "oben"
          },
          {
            "label": "nach unten",
            "label_en": "down",
            "value": "unten"
          },
          {
            "label": "geradeaus",
            "label_en": "straight ahead",
            "value": "mitte"
          }
        ]
      }
    ],
    "generator": {
      "imports": [
        "import robo_display"
      ],
      "code": "robo_display.augen('${DIR}')\n"
    },
    "hardware": {
      "commonName": "Rundes Display GC9A01 (RoboBuddy)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "actuators/display_eyes.md",
    "doc": "# Augen schauen (RoboBuddy)\n\nBewegt die Augen des Gesichts nach links, rechts, oben, unten oder zurück zur Mitte. Steht gerade Text auf dem Display, erscheint vorher wieder das letzte Gesicht.\n\nIdee: Beim Links-Drehen nach links schauen lassen.",
    "doc_en": "# Eyes look (RoboBuddy)\n\nMoves the face's eyes left, right, up, down or back to the middle. If text is currently on the display, the last face appears again first.\n\nIdea: look left while turning left."
  },
  {
    "id": "display_face",
    "blockCategory": "Anzeigen",
    "requiresBoardFeature": "display",
    "label": "Gesicht zeigen",
    "label_en": "Show face",
    "colour": "#0D9488",
    "tooltip": "Zeigt ein fertiges Gesicht auf dem runden Display",
    "tooltip_en": "Shows a ready-made face on the round display",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Gesicht zeigen",
        "label_en": "Show face",
        "name": "FACE",
        "fieldType": "options_dropdown",
        "options": [
          {
            "label": "fröhlich",
            "label_en": "happy",
            "value": "froehlich"
          },
          {
            "label": "traurig",
            "label_en": "sad",
            "value": "traurig"
          },
          {
            "label": "überrascht",
            "label_en": "surprised",
            "value": "ueberrascht"
          },
          {
            "label": "müde",
            "label_en": "tired",
            "value": "muede"
          },
          {
            "label": "wütend",
            "label_en": "angry",
            "value": "wuetend"
          },
          {
            "label": "verliebt",
            "label_en": "in love",
            "value": "verliebt"
          }
        ]
      }
    ],
    "generator": {
      "imports": [
        "import robo_display"
      ],
      "code": "robo_display.gesicht('${FACE}')\n"
    },
    "hardware": {
      "commonName": "Rundes Display GC9A01 (RoboBuddy)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "actuators/display_face.md",
    "doc": "# Gesicht zeigen (RoboBuddy)\n\nZeigt ein fertiges Gesicht auf dem runden Display: fröhlich, traurig, überrascht, müde, wütend oder verliebt.\n\nMit **Augen schauen** kannst du danach die Augen bewegen.",
    "doc_en": "# Show face (RoboBuddy)\n\nShows a ready-made face on the round display: happy, sad, surprised, tired, angry or in love.\n\nUse **eyes look** afterwards to move the eyes."
  },
  {
    "id": "display_fill",
    "blockCategory": "Anzeigen",
    "requiresBoardFeature": "display",
    "label": "Display füllen",
    "label_en": "Fill display",
    "colour": "#0D9488",
    "tooltip": "Färbt das ganze runde Display in einer Farbe",
    "tooltip_en": "Colours the whole round display in one colour",
    "blockType": "statement",
    "inputs": [
      {
        "label": "Display füllen mit",
        "label_en": "Fill display with",
        "name": "COLOR",
        "fieldType": "colour_picker"
      }
    ],
    "generator": {
      "imports": [
        "import robo_display"
      ],
      "code": "robo_display.fuellen('${COLOR}')\n"
    },
    "hardware": {
      "commonName": "Rundes Display GC9A01 (RoboBuddy)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "actuators/display_fill.md",
    "doc": "# Display füllen (RoboBuddy)\n\nFärbt das ganze runde Display in der gewählten Farbe. Gesicht und Text verschwinden dabei.",
    "doc_en": "# Fill display (RoboBuddy)\n\nColours the whole round display in the chosen colour. Face and text disappear."
  },
  {
    "id": "display_number",
    "blockCategory": "Anzeigen",
    "requiresBoardFeature": "display",
    "label": "Zahl anzeigen",
    "label_en": "Show number",
    "colour": "#0D9488",
    "tooltip": "Zeigt eine Zahl groß in der Mitte des runden Displays (z.B. Akkustand oder Abstand)",
    "tooltip_en": "Shows a number big in the middle of the round display (e.g. battery level or distance)",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Zahl in",
        "label_en": "Number in",
        "name": "COLOR",
        "fieldType": "colour_picker"
      }
    ],
    "valueInputs": [
      {
        "name": "NUM",
        "label": "anzeigen:",
        "label_en": "show:",
        "check": "Number",
        "defaultValue": 42
      }
    ],
    "generator": {
      "imports": [
        "import robo_display"
      ],
      "code": "robo_display.zahl(${NUM}, '${COLOR}')\n"
    },
    "hardware": {
      "commonName": "Rundes Display GC9A01 (RoboBuddy)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "actuators/display_number.md",
    "doc": "# Zahl anzeigen (RoboBuddy)\n\nZeigt eine Zahl groß in der Mitte des runden Displays. Kommazahlen werden auf eine Stelle gerundet.\n\nIdee: `Zahl anzeigen: Akkustand (%)` in einer Für-immer-Schleife.",
    "doc_en": "# Show number (RoboBuddy)\n\nShows a number big in the middle of the round display. Decimal numbers are rounded to one place.\n\nIdea: `show number: battery level (%)` in a forever loop."
  },
  {
    "id": "display_text",
    "blockCategory": "Anzeigen",
    "requiresBoardFeature": "display",
    "label": "Text anzeigen",
    "label_en": "Show text",
    "colour": "#0D9488",
    "tooltip": "Zeigt eine Zeile Text mittig auf dem runden Display – kurze Wörter werden größer",
    "tooltip_en": "Shows one line of text in the middle of the round display – short words get bigger",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "Text in",
        "label_en": "Text in",
        "name": "COLOR",
        "fieldType": "colour_picker"
      }
    ],
    "valueInputs": [
      {
        "name": "TEXT",
        "label": "anzeigen:",
        "label_en": "show:",
        "check": "String",
        "defaultValue": "Hallo!",
        "defaultValue_en": "Hello!"
      }
    ],
    "generator": {
      "imports": [
        "import robo_display"
      ],
      "code": "robo_display.text(${TEXT}, '${COLOR}')\n"
    },
    "hardware": {
      "commonName": "Rundes Display GC9A01 (RoboBuddy)",
      "verbrauch3j": 0,
      "kitStandard": false
    },
    "legacyGenerator": false,
    "_file": "actuators/display_text.md",
    "doc": "# Text anzeigen (RoboBuddy)\n\nZeigt eine Zeile Text in der Mitte des runden Displays. Kurze Wörter werden groß, lange klein. Mehr als etwa 15 Zeichen passen nicht auf das runde Display.\n\nDas Gesicht verschwindet, solange Text angezeigt wird.",
    "doc_en": "# Show text (RoboBuddy)\n\nShows one line of text in the middle of the round display. Short words are big, long ones small. More than about 15 characters do not fit on the round display.\n\nThe face disappears while text is shown."
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
      "width_mm": 23,
      "height_mm": 41.5
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
      "width_mm": 23,
      "height_mm": 41.5
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
  },
  {
    "id": "pwm_write",
    "blockCategory": "Pins",
    "subCategory": "",
    "label": "PWM",
    "label_en": "PWM",
    "colour": "#64748B",
    "tooltip": "Gibt auf einem Port eine stufenlose Stärke aus (0 % = aus, 100 % = voll an) – z. B. für MOSFET-Module, LED-Streifen oder Lüfter",
    "tooltip_en": "Outputs a variable power level on a port (0 % = off, 100 % = fully on) – e.g. for MOSFET modules, LED strips or fans",
    "blockType": "statement",
    "inline": true,
    "inputs": [
      {
        "label": "PWM  Port:",
        "label_en": "PWM  port:",
        "name": "PIN",
        "fieldType": "grove_dropdown",
        "groveRole": "digital"
      }
    ],
    "valueInputs": [
      {
        "name": "PERCENT",
        "label": "Stärke",
        "label_en": "power",
        "check": "Number",
        "defaultValue": 50,
        "suffix": "%"
      }
    ],
    "generator": {
      "imports": [
        "import board",
        "import pwmio"
      ],
      "defs": [
        {
          "key": "init_pwmout_${PIN}",
          "val": "_pwmout_${PIN} = pwmio.PWMOut(board.${PIN}, frequency=1000, duty_cycle=0)"
        }
      ],
      "code": "_pwmout_${PIN}.duty_cycle = max(0, min(65535, int((${PERCENT}) * 655.35)))\n"
    },
    "legacyGenerator": false,
    "_file": "actuators/pwm_write.md",
    "doc": "# PWM-Ausgabe\n\nSchaltet den Port nicht nur **an oder aus**, sondern stufenlos dazwischen:\n0 % = aus, 50 % = halbe Kraft, 100 % = voll an. Dafür schaltet der Pin sehr\nschnell (1000-mal pro Sekunde) an und aus. Je länger er jedes Mal an bleibt,\ndesto heller leuchtet eine LED oder desto schneller dreht ein Lüfter.\n\n**Typischer Einsatz: MOSFET-Modul.** Der Pin selbst liefert nur wenig Strom.\nEin MOSFET-Modul schaltet damit große Lasten mit eigener Stromversorgung:\nLED-Streifen dimmen, Lüfter oder kleine Motoren langsamer und schneller laufen\nlassen. Das Signal-Kabel (gelb / SIG) des Grove-Ports kommt an den Signal-Eingang\ndes Moduls.\n\n**Gut zu wissen:**\n- Am besten **Grove 1–4** nutzen. Auf dem MAKER-PI teilen sich immer zwei Pins\n  einen Taktgeber: Grove 5 und 6 vertragen sich nicht mit Motor M2, Grove 7\n  nicht mit Servo S1/S2 – wer beides gleichzeitig nutzt, bekommt beim Start\n  einen Fehler.\n- Auf dem **RoboBuddy** gehen neben den 4 Servos höchstens **2** PWM-/Buzzer-\n  Ausgänge gleichzeitig – ein dritter bricht beim Start mit einem Fehler ab.\n- Denselben Port im Programm nicht zusätzlich mit „🔌 Digital\" schalten.\n- Werte unter 0 % oder über 100 % werden automatisch begrenzt.",
    "doc_en": "# PWM output\n\nSwitches the port not just **on or off**, but smoothly in between:\n0 % = off, 50 % = half power, 100 % = fully on. To do this the pin switches\non and off very quickly (1000 times per second). The longer it stays on each\ntime, the brighter an LED shines or the faster a fan spins.\n\n**Typical use: MOSFET module.** The pin itself only supplies a little current.\nA MOSFET module uses it to switch big loads with their own power supply:\ndim LED strips, make fans or small motors run slower or faster. The signal wire\n(yellow / SIG) of the Grove port goes to the signal input of the module.\n\n**Good to know:**\n- Best use **Grove 1–4**. On the MAKER-PI two pins always share one timer:\n  Grove 5 and 6 do not get along with motor M2, Grove 7 not with servo S1/S2 –\n  using both at the same time gives an error at start.\n- On the **RoboBuddy**, besides the 4 servos at most **2** PWM/buzzer outputs\n  work at the same time – a third one stops with an error at start.\n- Do not also switch the same port with \"🔌 Digital\" in the program.\n- Values below 0 % or above 100 % are limited automatically."
  }
];
