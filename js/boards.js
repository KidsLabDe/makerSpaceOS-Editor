// boards.js – Board-Profile und Pin-Konstanten

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
      { id: 6, label: 'Grove 6', pin1: 'GP26', signal: 'GP27', analog: true,  i2c: false },
      { id: 7, label: 'Grove 7', pin1: 'GP7',  signal: 'GP28', analog: true,  i2c: false },
    ],
    // Roh-Pins (Fallback für pin_dropdown; nach Grove-Migration kaum noch genutzt)
    externalPins: ['GP1','GP3','GP5','GP17','GP26','GP27','GP28'],

    // Dropdown-Optionen [Anzeige, Wert] je nach Rolle.
    // digital/analog → Wert = Signal-Pin (GPxx); i2c/2pin → Wert = Port-ID (String).
    groveOptions(role) {
      switch (role) {
        case 'analog':
          return this.grovePorts.filter(p => p.analog).map(p => [p.label, p.signal]);
        case 'i2c':
          return this.grovePorts.filter(p => p.i2c).map(p => [p.label, String(p.id)]);
        case '2pin':
          return this.grovePorts.map(p => [p.label, String(p.id)]);
        case 'digital':
        default:
          return this.grovePorts.map(p => [p.label, p.signal]);
      }
    },

    grovePortById(id) {
      return this.grovePorts.find(p => p.id === Number(id));
    },
  }
};

const BOARD = BOARD_PROFILES.maker_pi_rp2040;
