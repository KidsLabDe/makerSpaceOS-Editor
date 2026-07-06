// blocks/events.js – Ereignis-Hut-Blöcke (Lego-Spike-Stil)
//
// Jeder dieser Blöcke ist ein eigenständiger Top-Level-Stapel (kein
// setPreviousStatement/setNextStatement) und wird vom Generator zu einer
// eigenen, parallel laufenden async-Aufgabe übersetzt.

(function () {
  'use strict';

  const EVENT_COLOUR = '#D97706';

  // ── Feld-Helfer (jeweils frische Field-Instanzen pro Block) ─────────────────

  const _NONE_OPT = ['– bitte auswählen –', '__NONE__'];

  const groveField  = (role) => new Blockly.FieldDropdown([_NONE_OPT, ...BOARD.groveOptions(role || 'digital')]);

  // Alle Grove-Ports als 2pin (Encoder braucht beide Pins)
  const encPortField = () => new Blockly.FieldDropdown([
    _NONE_OPT,
    ...BOARD.grovePorts.map(p => [p.label, String(p.id)]),
  ]);

  // Kombiniertes Taster-Dropdown: Onboard-Taster (aus BOARD.buttons) + alle Grove-Ports
  const tasterField = () => new Blockly.FieldDropdown([
    _NONE_OPT,
    ...Object.entries(BOARD.buttons).map(([k, v]) => [`${k} (${v})`, k]),
    GROVE_SEP,
    ...BOARD.grovePorts.map(p => [p.label, p.signal]),
  ], v => v === '__SEP__' ? null : undefined);

  const stateField  = () => new Blockly.FieldDropdown([['gedrückt', 'pressed'], ['losgelassen', 'released']]);
  const opField     = () => new Blockly.FieldDropdown([['<', '<'], ['>', '>'], ['=', '==']]);
  const dirField    = () => new Blockly.FieldDropdown([['↑ hoch', 'up'], ['↓ runter', 'down']]);

  // ── Schleife, die parallel läuft ────────────────────────────────────────────

  Blockly.Blocks['loop_parallel'] = {
    init: function () {
      this.appendDummyInput().appendField('Schleife (läuft parallel)');
      this.appendStatementInput('DO');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Wiederholt sich endlos – läuft gleichzeitig zu anderen Stapeln');
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
        this.appendStatementInput('DO').appendField('→ dann');
        this.setColour(EVENT_COLOUR);
        this.setTooltip(tooltip);
      }
    };
  }

  digitalHat('when_sound', 'Wenn Geräusch erkannt', 'Startet, sobald ein Geräusch erkannt wird');
  digitalHat('when_touch', 'Wenn berührt',          'Startet, sobald der Sensor berührt wird');

  // ── Taster-Hut (mit gedrückt/losgelassen) ───────────────────────────────────

  Blockly.Blocks['when_button'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Wenn Taster')
          .appendField(tasterField(), 'BTN')
          .appendField(stateField(), 'STATE');
      this.appendStatementInput('DO').appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald der Taster gedrückt bzw. losgelassen wird');
    }
  };

  // ── Drehgeber-Hut (Richtungserkennung) ──────────────────────────────────────

  Blockly.Blocks['when_encoder'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Wenn Drehgeber')
          .appendField(encPortField(), 'PORT')
          .appendField(dirField(), 'DIR');
      this.appendStatementInput('DO').appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald der Drehgeber in die gewählte Richtung gedreht wird');
    }
  };

  // ── Schwellwert-Hüte (Vergleich mit Zahl) ───────────────────────────────────

  Blockly.Blocks['when_distance'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Wenn Abstand  Port:')
          .appendField(groveField('digital'), 'SIG')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(20, 0, 400, 0), 'VALUE')
          .appendField('cm');
      this.appendStatementInput('DO').appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald der gemessene Abstand die Bedingung erfüllt');
    }
  };

  Blockly.Blocks['when_light'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Wenn Helligkeit  Port:')
          .appendField(groveField('analog'), 'PIN')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'VALUE')
          .appendField('%');
      this.appendStatementInput('DO').appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald die Helligkeit (0–100 %) die Bedingung erfüllt');
    }
  };

  Blockly.Blocks['when_temperature'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Wenn Temperatur  Port:')
          .appendField(groveField('digital'), 'PIN')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(25, -40, 80, 0), 'VALUE')
          .appendField('°C');
      this.appendStatementInput('DO').appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald die Temperatur (DHT11) die Bedingung erfüllt');
    }
  };

  Blockly.Blocks['when_humidity'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Wenn Luftfeuchtigkeit  Port:')
          .appendField(groveField('digital'), 'PIN')
          .appendField(opField(), 'OP')
          .appendField(new Blockly.FieldNumber(60, 0, 100, 0), 'VALUE')
          .appendField('%');
      this.appendStatementInput('DO').appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald die Luftfeuchtigkeit (DHT11) die Bedingung erfüllt');
    }
  };

})();
