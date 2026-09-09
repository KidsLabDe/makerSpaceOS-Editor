// blocks/events.js – Ereignis-Hut-Blöcke (Lego-Spike-Stil)
//
// Jeder dieser Blöcke ist ein eigenständiger Top-Level-Stapel (kein
// setPreviousStatement/setNextStatement) und wird vom Generator zu einer
// eigenen, parallel laufenden async-Aufgabe übersetzt.

(function () {
  'use strict';

  const EVENT_COLOUR = '#D97706';

  // ── Feld-Helfer (jeweils frische Field-Instanzen pro Block) ─────────────────

  const _NONE_OPT = [L('– bitte auswählen –', '– please select –'), '__NONE__'];

  const groveField  = (role) => new Blockly.FieldDropdown([_NONE_OPT, ...BOARD.groveOptions(role || 'digital')]);

  // Alle gültigen Grove-Ports als 2pin (Encoder braucht benachbarte Pins → gefiltert)
  const encPortField = () => new Blockly.FieldDropdown([
    _NONE_OPT,
    ...BOARD.groveOptions('2pin_sequential'),
  ]);

  // Kombiniertes Taster-Dropdown: Onboard-Taster (aus BOARD.buttons) + alle Grove-Ports
  const tasterField = () => new Blockly.FieldDropdown([
    _NONE_OPT,
    ...Object.entries(BOARD.buttons).map(([k, v]) => [`${k} (${v})`, k]),
    GROVE_SEP,
    ...BOARD.grovePorts.map(p => [p.label, p.signal]),
  ], v => v === '__SEP__' ? null : undefined);

  const stateField  = () => new Blockly.FieldDropdown([[L('gedrückt', 'pressed'), 'pressed'], [L('losgelassen', 'released'), 'released']]);
  const opField     = () => new Blockly.FieldDropdown([['<', '<'], ['>', '>'], ['=', '==']]);
  const dirField    = () => new Blockly.FieldDropdown([[L('↑ hoch', '↑ up'), 'up'], [L('↓ runter', '↓ down'), 'down']]);

  // ── Schleife, die parallel läuft ────────────────────────────────────────────

  Blockly.Blocks['loop_parallel'] = {
    init: function () {
      this.appendDummyInput().appendField(L('Schleife (läuft parallel)', 'Loop (runs in parallel)'));
      this.appendStatementInput('DO');
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Wiederholt sich endlos – läuft gleichzeitig zu anderen Stapeln', 'Repeats forever – runs at the same time as other stacks'));
    }
  };

  // ── Digitale Trigger-Hüte (verbleibende) ────────────────────────────────────

  function digitalHat(type, label, tooltip) {
    Blockly.Blocks[type] = {
      init: function () {
        this.appendDummyInput()
            .appendField(label)
            .appendField('  Port:')
            .appendField(groveField('digital'), 'PIN');
        this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
        this.setColour(EVENT_COLOUR);
        this.setTooltip(tooltip);
      }
    };
  }

  digitalHat('when_sound', L('Wenn Geräusch erkannt', 'When sound detected'), L('Startet, sobald ein Geräusch erkannt wird', 'Starts as soon as a sound is detected'));
  digitalHat('when_touch', L('Wenn berührt', 'When touched'),          L('Startet, sobald der Sensor berührt wird', 'Starts as soon as the sensor is touched'));

  // ── Taster-Hut (mit gedrückt/losgelassen) ───────────────────────────────────

  Blockly.Blocks['when_button'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn Taster', 'When button'))
          .appendField(tasterField(), 'BTN')
          .appendField(stateField(), 'STATE');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald der Taster gedrückt bzw. losgelassen wird', 'Starts as soon as the button is pressed or released'));
    }
  };

  // ── Drehgeber-Hut (Richtungserkennung) ──────────────────────────────────────

  Blockly.Blocks['when_encoder'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn Drehgeber', 'When rotary encoder'))
          .appendField(encPortField(), 'PORT')
          .appendField(dirField(), 'DIR');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald der Drehgeber in die gewählte Richtung gedreht wird', 'Starts as soon as the encoder is turned in the chosen direction'));
    }
  };

  // ── Bewegungs-Hut (ICM20948, geschüttelt / 3g / 6g / 9g) ────────────────────

  const motionField = () => new Blockly.FieldDropdown([
    [L('geschüttelt', 'shaken'), 'shake'], ['3g', '3'], ['6g', '6'], ['9g', '9'],
  ]);

  Blockly.Blocks['when_motion'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn bewegt', 'When moved'))
          .appendField(motionField(), 'MODE')
          .appendField('  Port:')
          .appendField(groveField('i2c'), 'PORT');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald der Bewegungssensor (ICM20948) geschüttelt oder stark beschleunigt wird', 'Starts as soon as the motion sensor (ICM20948) is shaken or strongly accelerated'));
    }
  };

  // ── Schwellwert-Hüte (Vergleich mit Zahl) ───────────────────────────────────

  Blockly.Blocks['when_distance'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn Abstand  Port:', 'When distance  port:'))
          .appendField(groveField('digital'), 'SIG')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(20, 0, 400, 0), 'VALUE')
          .appendField('cm');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald der gemessene Abstand die Bedingung erfüllt', 'Starts as soon as the measured distance meets the condition'));
    }
  };

  Blockly.Blocks['when_light'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn Helligkeit  Port:', 'When brightness  port:'))
          .appendField(groveField('analog'), 'PIN')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'VALUE')
          .appendField('%');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald die Helligkeit (0–100 %) die Bedingung erfüllt', 'Starts as soon as the brightness (0–100 %) meets the condition'));
    }
  };

  Blockly.Blocks['when_temperature'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn Temperatur  Port:', 'When temperature  port:'))
          .appendField(groveField('digital'), 'PIN')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(25, -40, 80, 0), 'VALUE')
          .appendField('°C');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald die Temperatur (DHT11) die Bedingung erfüllt', 'Starts as soon as the temperature (DHT11) meets the condition'));
    }
  };

  Blockly.Blocks['when_humidity'] = {
    init: function () {
      this.appendDummyInput()
          .appendField(L('Wenn Luftfeuchtigkeit  Port:', 'When humidity  port:'))
          .appendField(groveField('digital'), 'PIN')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(60, 0, 100, 0), 'VALUE')
          .appendField('%');
      this.appendStatementInput('DO').appendField(L('→ dann', '→ then'));
      this.setColour(EVENT_COLOUR);
      this.setTooltip(L('Startet, sobald die Luftfeuchtigkeit (DHT11) die Bedingung erfüllt', 'Starts as soon as the humidity (DHT11) meets the condition'));
    }
  };

})();
