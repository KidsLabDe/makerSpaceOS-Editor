// boards.js – Board-Profile und Pin-Konstanten

// Trenner-Eintrag im Pin-Dropdown (Wert wird im Validator in block_builder.js abgefangen)
const GROVE_SEP = ['────────────', '__SEP__'];

// ── Geteilte Helfer (nehmen das Profil als 1. Argument) ─────────────────────
// Dropdown-Optionen [Anzeige, Wert] je nach Rolle.
// digital/analog → Wert = Signal-Pin (GPxx/IOxx); i2c/2pin → Wert = Port-ID (String).
// digital/analog bieten zusätzlich (per Trenner abgesetzt) einzelne GPIO-Pins an.
function _groveOptions(profile, role) {
  switch (role) {
    case 'analog':
      return [
        ...profile.grovePorts.filter(p => p.analog).map(p => [p.label, p.signal]),
        GROVE_SEP,
        ...profile.analogPins.map(p => [p, p]),
      ];
    case 'i2c':
      return profile.grovePorts.filter(p => p.i2c).map(p => [p.label, String(p.id)]);
    case '2pin':
      return profile.grovePorts.map(p => [p.label, String(p.id)]);
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
