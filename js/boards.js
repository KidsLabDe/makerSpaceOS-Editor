// boards.js – Board-Profile und Pin-Konstanten

// Trenner-Eintrag im Pin-Dropdown (Wert wird im Validator in block_builder.js abgefangen)
const GROVE_SEP = ['────────────', '__SEP__'];

// ── Geteilte Helfer (nehmen das Profil als 1. Argument) ─────────────────────
// Dropdown-Optionen [Anzeige, Wert] je nach Rolle.
// digital/analog → Wert = Signal-Pin (GPxx/IOxx); i2c/2pin → Wert = Port-ID (String).
// digital/analog bieten zusätzlich (per Trenner abgesetzt) einzelne GPIO-Pins an.
function _groveOptions(profile, role) {
  switch (role) {
    case 'analog': {
      // Roh-Pins, die schon Signal eines Analog-Ports sind, nicht doppelt
      // anbieten – doppelte Werte lassen Blockly das falsche Label anzeigen.
      const usedAnalog = new Set(profile.grovePorts.filter(p => p.analog).map(p => p.signal));
      const extraAnalog = profile.analogPins.filter(p => !usedAnalog.has(p));
      return [
        ...profile.grovePorts.filter(p => p.analog).map(p => [p.label, p.signal]),
        ...(extraAnalog.length ? [GROVE_SEP, ...extraAnalog.map(p => [p, p])] : []),
      ];
    }
    case 'i2c':
      return profile.grovePorts.filter(p => p.i2c).map(p => [p.label, String(p.id)]);
    case '2pin':
      return profile.grovePorts.map(p => [p.label, String(p.id)]);
    case '2pin_sequential': {
      // Für den Drehgeber: rotaryio (PIO) braucht benachbarte GPIO-Pins
      // (GPn + GPn±1, gleiche Pin-Gruppe) → sonst RuntimeError auf dem Board.
      const num = (n) => { const m = String(n).match(/(\d+)$/); return m ? Number(m[1]) : NaN; };
      return profile.grovePorts
        .filter(p => !Number.isNaN(num(p.pin1)) && Math.abs(num(p.pin1) - num(p.signal)) === 1)
        .map(p => [p.label, String(p.id)]);
    }
    case 'digital':
    default: {
      const usedSignals = new Set(profile.grovePorts.map(p => p.signal));
      const extraPins = profile.allGrovePins.filter(p => !usedSignals.has(p));
      return [
        ...profile.grovePorts.map(p => [p.label, p.signal]),
        ...(extraPins.length ? [GROVE_SEP, ...extraPins.map(p => [p, p])] : []),
      ];
    }
  }
}

function _grovePortById(profile, id) {
  return profile.grovePorts.find(p => p.id === Number(id));
}

// Hängt die (board-unabhängigen) Methoden an jedes Profil, damit Aufrufer
// weiterhin BOARD.groveOptions(role) / BOARD.grovePortById(id) nutzen können.
function _attachGroveMethods(profile) {
  profile.groveOptions  = function (role) { return _groveOptions(this, role); };
  profile.grovePortById = function (id)   { return _grovePortById(this, id); };
  return profile;
}

const BOARD_PROFILES = {
  maker_pi_rp2040: {
    name: 'Cytron MAKER-PI-RP2040',
    // NeoPixel: 2 Onboard-Pixel (GP18). Externe Strips erhöhen count.
    neopixel:  { pin: 'GP18', count: 2 },
    buzzer:    'GP22',
    buttons:   { B1: 'GP20', B2: 'GP21' },
    // Motortreiber MX1508 – Pins laut Schaltplan (Sheet 4) / Demo-Code:
    motors: {
      M1: { pinA: 'GP8',  pinB: 'GP9'  },
      M2: { pinA: 'GP10', pinB: 'GP11' }
    },
    servos:    { S1: 'GP12', S2: 'GP13', S3: 'GP14', S4: 'GP15' },
    // Batteriespannung: GP29/ADC3 misst VM über Teiler 10K/10K → VM = Messwert × 2
    battery:   'GP29',
    // Grove-Ports laut Schaltplan Rev 1.0.0 (Sheet 3). Signal liegt auf Pin 2.
    // I2C: SDA = pin1, SCL = signal → busio.I2C(board.signal, board.pin1)
    grovePorts: [
      { id: 1, label: 'Grove 1', pin1: 'GP0',  signal: 'GP1',  analog: false, i2c: true  },
      { id: 2, label: 'Grove 2', pin1: 'GP2',  signal: 'GP3',  analog: false, i2c: true  },
      { id: 3, label: 'Grove 3', pin1: 'GP4',  signal: 'GP5',  analog: false, i2c: true  },
      { id: 4, label: 'Grove 4', pin1: 'GP16', signal: 'GP17', analog: false, i2c: true  },
      { id: 5, label: 'Grove 5', pin1: 'GP6',  signal: 'GP26', analog: true,  i2c: false },
      { id: 6, label: 'Grove 6', pin1: 'GP26', signal: 'GP27', analog: true,  i2c: true  },
      { id: 7, label: 'Grove 7', pin1: 'GP7',  signal: 'GP28', analog: true,  i2c: false },
    ],
    // Roh-Pins (Fallback für pin_dropdown; nach Grove-Migration kaum noch genutzt)
    externalPins: ['GP1','GP3','GP5','GP17','GP26','GP27','GP28'],

    // Alle einzeln wählbaren GPIO: die über die Grove-Stecker herausgeführten
    // (13 eindeutige; GP26 ist Signal von Grove 5 UND pin1 von Grove 6 → nur
    // einmal gelistet) plus die 4 Servo-Pins (S1=GP12 … S4=GP15).
    allGrovePins: ['GP0','GP1','GP2','GP3','GP4','GP5','GP6','GP7','GP12','GP13','GP14','GP15','GP16','GP17','GP26','GP27','GP28'],
    // ADC-fähige Pins (Grove 5/6/7-Signale)
    analogPins:   ['GP26','GP27','GP28'],
  },

  // GamePadPico (KidsLab "nerdYcontroller") – Trägerplatine für einen
  // Raspberry Pi Pico (board_id: raspberry_pi_pico). Onboard laut Schaltplan:
  // 5×5-NeoPixel-Matrix (GP12, Zickzack-Verdrahtung), LSM6DS3-Neigungssensor
  // (I2C: SDA=GP6, SCL=GP7), 4 Touch-Felder als Pfeiltasten (GP14–GP17,
  // Widerstände auf der Platine), Piezo-Summer (GP20), Mikrofon (GP29),
  // 4 Servo-Header (GP10/GP11/GP4/GP5) und 1 Grove-Port (GP9=Signal, GP8).
  gamepad_pico: {
    name: 'GamePadPico',
    // Onboard-Matrix = 25 NeoPixel an GP12 – die Onboard-Licht-Blöcke und die
    // 5×5-Matrix-Blöcke (blocks/matrix5.js) teilen sich dieses _pixels-Objekt.
    neopixel:  { pin: 'GP12', count: 25 },
    buzzer:    'GP20',
    // Keine mechanischen Onboard-Taster – dafür 4 Touch-Felder (siehe touchPins).
    buttons:   {},
    // Kein Motortreiber – Motor-Blöcke ausgeblendet.
    motors:    {},
    // Servo-Header laut Schaltplan: SERVO_0=GP10, SERVO_1=GP11, SERVO_2=GP4, SERVO_3=GP5
    servos:    { S1: 'GP10', S2: 'GP11', S3: 'GP4', S4: 'GP5' },
    battery:   null,
    // Onboard-Extras (schalten board-spezifische Blöcke frei, siehe
    // requiresBoardFeature in components/*.md bzw. blocks/matrix5.js):
    touchPins: { links: 'GP14', oben: 'GP15', rechts: 'GP16', unten: 'GP17' },
    imu:       { sda: 'GP6', scl: 'GP7' },            // LSM6DS3, Adresse 0x6A
    matrix5:   { width: 5, height: 5, serpentine: true },
    usbHid:    true,                                   // Tastatur-Block (USB-HID)
    // 1 Grove-Port: Pin 1 (gelb) = GP9, Pin 2 (weiß) = GP8. GP8/GP9 sind
    // zugleich I2C0 (SDA/SCL) → i2c-fähig (busio.I2C(board.GP9, board.GP8)).
    grovePorts: [
      { id: 1, label: 'Grove (GP9/GP8)', pin1: 'GP8', signal: 'GP9', analog: false, i2c: true },
    ],
    externalPins: ['GP26', 'GP27', 'GP28'],
    // Freie Header-Pins (GP23/GP24 sind auf dem Pico-Modul intern; GP25 =
    // Onboard-LED des Pico; Touch-Pins GP14–17 bewusst nicht gelistet, weil
    // dort feste Touch-Widerstände hängen).
    allGrovePins: ['GP0','GP1','GP2','GP3','GP18','GP19','GP21','GP22','GP25','GP26','GP27','GP28'],
    analogPins:   ['GP26','GP27','GP28'],

    hideBlockIds: ['actuator_motor_forward', 'actuator_motor_backward',
                   'actuator_motor_stop', 'sensor_battery'],
  },

  // Wemos/LOLIN S2 Mini (ESP32-S2). Nacktes Board ohne Grove/Motor/Servo –
  // nur generische GPIO-/Analog-Blöcke + externer NeoPixel (Rest ausgeblendet).
  // CircuitPython-Pin-Namen sind IOxx (board.IO2 …). ADC1 (WLAN-sicher): IO1–IO10.
  // Onboard: board.LED = IO15, board.BUTTON = IO0.
  lolin_s2_mini: {
    name: 'Wemos S2 Mini',
    // Onboard-NeoPixel gibt es nicht (nur eine einfache blaue LED an IO15) – die
    // Onboard-LED-Blöcke sind ausgeblendet; dieser Default wird daher nie benutzt.
    neopixel:  { pin: 'IO18', count: 1 },
    // Externer Summer (kein Onboard-Piezo) – fester Ausgang auf IO16.
    buzzer:    'IO16',
    // Keine Onboard-Taster (IO0 = BOOT/Strapping) → Taster nur extern über Ports.
    buttons:   {},
    // Kein Onboard-Motortreiber – Motor-Blöcke ausgeblendet.
    motors:    {},
    // PWM-Ausgänge für externe Servos UND die 8×8-NeoPixel-Matrix (Datenpin).
    // ESP32-S2 kann PWM/NeoPixel auf beliebigen GPIO – S1…S4 = feste freie Pins.
    servos:    { S1: 'IO37', S2: 'IO38', S3: 'IO39', S4: 'IO40' },
    battery:   null,
    // Ports als physische Pin-Paare (pin1 = kleinere IO, signal = größere IO).
    // i2c=true überall: der ESP32-S2 kann I2C (busio) auf beliebigen Pin-Paaren.
    grovePorts: [
      { id: 1,  label: '2/3',   pin1: 'IO2',  signal: 'IO3',  analog: true,  i2c: true },
      { id: 2,  label: '4/5',   pin1: 'IO4',  signal: 'IO5',  analog: true,  i2c: true },
      { id: 3,  label: '6/7',   pin1: 'IO6',  signal: 'IO7',  analog: true,  i2c: true },
      { id: 4,  label: '8/9',   pin1: 'IO8',  signal: 'IO9',  analog: true,  i2c: true },
      { id: 5,  label: '16/17', pin1: 'IO16', signal: 'IO17', analog: false, i2c: true },
      { id: 6,  label: '18/21', pin1: 'IO18', signal: 'IO21', analog: false, i2c: true },
      { id: 7,  label: '33/34', pin1: 'IO33', signal: 'IO34', analog: false, i2c: true },
      { id: 8,  label: '35/36', pin1: 'IO35', signal: 'IO36', analog: false, i2c: true },
      { id: 9,  label: '37/38', pin1: 'IO37', signal: 'IO38', analog: false, i2c: true },
      { id: 10, label: '39/40', pin1: 'IO39', signal: 'IO40', analog: false, i2c: true },
    ],
    externalPins: ['IO1','IO2','IO3','IO4','IO5','IO6','IO7','IO8','IO9','IO10'],
    // Alle herausgeführten GPIO (ohne IO0 = Button und IO15 = Onboard-LED).
    allGrovePins: ['IO1','IO2','IO3','IO4','IO5','IO6','IO7','IO8','IO9','IO10',
                   'IO11','IO12','IO13','IO14','IO16','IO17','IO18','IO21',
                   'IO33','IO34','IO35','IO36','IO37','IO38','IO39','IO40'],
    // ADC1-Kanäle (mit WLAN nutzbar): IO1–IO10.
    analogPins:   ['IO1','IO2','IO3','IO4','IO5','IO6','IO7','IO8','IO9','IO10'],

    // Nur echte Onboard-Hardware ausblenden (Motortreiber, Onboard-NeoPixel,
    // Batterie-Teiler). Externes (Matrix, 7-Segment, LCD, Servo, Schrittmotor,
    // Summer, Sensoren …) bleibt verfügbar. Onboard-Taster: siehe buttons: {}.
    hideSubCategories: ['Onboard'],                            // Onboard-NeoPixel
    hideBlockIds:      ['actuator_motor_forward', 'actuator_motor_backward',
                        'actuator_motor_stop', 'sensor_battery'],
  },

  // AZ-Delivery ESP32 D1 R32 (ESP32-WROOM-32 im Arduino-Uno-Formfaktor, CH340)
  // mit aufgestecktem Grove Base Shield (Seeed-kompatibel, VCC-Schalter!).
  // Geflasht ist der generische CircuitPython-Build "DOIT ESP32 DevKit V1"
  // (board_id: doit_esp32_devkit_v1) – Pin-Namen sind daher board.D<gpio>
  // (GPIO-Nummer!), plus board.VP (IO36) / board.VN (IO39).
  // ACHTUNG dreifache Namensebene: Shield-Port "D2" = Uno-Pin D2 = GPIO26 =
  // board.D26. Die Port-Labels unten zeigen den Shield-Aufdruck.
  // WICHTIG: VCC-Schalter des Shields auf 3V3 – die ESP32-GPIO sind NICHT
  // 5-V-tolerant!
  esp32_d1_r32: {
    name: 'ESP32 D1 R32 (Uno)',
    // Kein Onboard-NeoPixel (nur einfache LED an GPIO2 = Uno A0) –
    // Onboard-LED-Blöcke sind ausgeblendet; dieser Default wird nie benutzt.
    neopixel:  { pin: 'D26', count: 1 },
    // Externer Summer – fester Ausgang auf Grove-Port D6 (GPIO27).
    buzzer:    'D27',
    // Kein Onboard-Taster (nur EN = Reset) → Taster nur extern über Ports.
    buttons:   {},
    // Kein Onboard-Motortreiber – Motor-Blöcke ausgeblendet.
    motors:    {},
    // PWM geht auf allen Ausgangs-Pins; S1…S4 = Grove-Ports D2/D3/D4/D5
    // (Signal-Pin des jeweiligen Ports).
    servos:    { S1: 'D26', S2: 'D25', S3: 'D17', S4: 'D16' },
    battery:   null,
    // Ports = Grove-Buchsen des Base Shields, Label = Shield-Aufdruck.
    // Grove-Konvention: Port Dn führt Uno-Dn (Signal/gelb) + Uno-Dn+1 (weiß)
    // → benachbarte Ports teilen sich einen Pin (D2 und D3 teilen Uno-D3 usw.),
    // also nicht zwei nebeneinanderliegende D-Ports gleichzeitig belegen.
    // signal = Uno-Dn als GPIO, pin1 = Uno-Dn+1 als GPIO.
    // A2/A3 (GPIO35/34) sind NUR Eingänge (kein LED/Summer/Ultraschall, aber
    // Taster/PIR/Analog-Sensoren OK). A0-Signal (GPIO2) ist zugleich die
    // Onboard-LED. I2C nur am fest verdrahteten I2C-Port (GPIO21/22).
    // Reihenfolge = Shield-Layout: A0–A3, I2C, D2–D8. Der UART-Port des
    // Shields (GPIO1/3) ist durch die USB-Seriell-Verbindung belegt und wird
    // deshalb nicht angeboten.
    grovePorts: [
      { id: 1,  label: 'A0',  pin1: 'D4',  signal: 'D2',  analog: true,  i2c: false },
      { id: 2,  label: 'A1',  pin1: 'D35', signal: 'D4',  analog: true,  i2c: false },
      { id: 3,  label: 'A2',  pin1: 'D34', signal: 'D35', analog: true,  i2c: false },
      { id: 4,  label: 'A3',  pin1: 'VP',  signal: 'D34', analog: true,  i2c: false },
      { id: 5,  label: 'I2C', pin1: 'D21', signal: 'D22', analog: false, i2c: true  },
      { id: 6,  label: 'D2',  pin1: 'D25', signal: 'D26', analog: false, i2c: false },
      { id: 7,  label: 'D3',  pin1: 'D17', signal: 'D25', analog: false, i2c: false },
      { id: 8,  label: 'D4',  pin1: 'D16', signal: 'D17', analog: false, i2c: false },
      { id: 9,  label: 'D5',  pin1: 'D27', signal: 'D16', analog: false, i2c: false },
      { id: 10, label: 'D6',  pin1: 'D14', signal: 'D27', analog: false, i2c: false },
      { id: 11, label: 'D7',  pin1: 'D12', signal: 'D14', analog: false, i2c: false },
      { id: 12, label: 'D8',  pin1: 'D13', signal: 'D12', analog: false, i2c: false },
    ],
    externalPins: ['D2','D4','D34','D35','VP','VN'],
    // Bewusst NUR die Port-Signale (keine zusätzlichen Roh-Pins hinter dem
    // Trenner): Die CircuitPython-Namen (D5 = GPIO5) kollidieren mit den
    // Shield-Labels (Port D5 = GPIO16) und stiften nur Verwirrung.
    allGrovePins: ['D2','D4','D12','D14','D16','D17','D22','D25','D26','D27','D34','D35'],
    // Analog-Signale (A0=D2, A1=D4 sind ADC2 – ohne WLAN nutzbar); alle schon
    // als Ports gelistet → keine Extra-Einträge im Analog-Dropdown.
    analogPins:   ['D2','D4','D34','D35'],

    // Wie beim S2 Mini: nur echte Onboard-Hardware ausblenden.
    hideSubCategories: ['Onboard'],                            // Onboard-NeoPixel
    hideBlockIds:      ['actuator_motor_forward', 'actuator_motor_backward',
                        'actuator_motor_stop', 'sensor_battery'],
  },
};

Object.values(BOARD_PROFILES).forEach(_attachGroveMethods);

// ── Board-Auswahl (persistiert in localStorage; Wechsel via Reload) ─────────
const BOARD_STORAGE = 'makerspaceos.board';
let BOARD_ID = 'maker_pi_rp2040';
try {
  const stored = localStorage.getItem(BOARD_STORAGE);
  if (stored && BOARD_PROFILES[stored]) BOARD_ID = stored;
} catch (e) { /* localStorage evtl. nicht verfügbar */ }

let BOARD = BOARD_PROFILES[BOARD_ID];

// Board wechseln: Auswahl merken und Seite neu laden. Ein Reload ist nötig, weil
// Dropdown-Optionen und Toolbox einmalig zur Registrierung aus BOARD gebaut werden.
function setBoard(id) {
  if (!BOARD_PROFILES[id] || id === BOARD_ID) return;
  try { localStorage.setItem(BOARD_STORAGE, id); } catch (e) { /* ignorieren */ }
  location.reload();
}
