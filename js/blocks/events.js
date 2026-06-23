// blocks/events.js – Ereignis-Hut-Blöcke (Lego-Spike-Stil)
//
// Jeder dieser Blöcke ist ein eigenständiger Top-Level-Stapel (kein
// setPreviousStatement/setNextStatement) und wird vom Generator zu einer
// eigenen, parallel laufenden async-Aufgabe übersetzt.

(function () {
  'use strict';

  const EVENT_COLOUR = '#F39A1B';   // Ereignis-Blau (siehe CLAUDE.md)

  // ── Feld-Helfer (jeweils frische Field-Instanzen pro Block) ─────────────────

  // Grove-Port-Dropdowns (Anzeige „Grove 1…7", Wert = Signal-Pin bzw. Port-ID)
  const groveField  = (role) => new Blockly.FieldDropdown(BOARD.groveOptions(role || 'digital'));
  const pinField    = () => groveField('digital');
  const buttonField = () => new Blockly.FieldDropdown(
    Object.entries(BOARD.buttons).map(([k, v]) => [`${k} (${v})`, k]));
  const stateField  = () => new Blockly.FieldDropdown([['gedrückt', 'pressed'], ['losgelassen', 'released']]);
  const opField     = () => new Blockly.FieldDropdown([['<', '<'], ['>', '>'], ['=', '==']]);

  // ── Schleife, die parallel läuft ────────────────────────────────────────────

  Blockly.Blocks['loop_parallel'] = {
    init: function () {
      this.appendDummyInput().appendField('Schleife (läuft parallel)');
      this.appendStatementInput('DO');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Wiederholt sich endlos – läuft gleichzeitig zu anderen Stapeln');
    }
  };

  // ── Digitale Trigger-Hüte ───────────────────────────────────────────────────
  // Definitions-Helfer: ein Label + Pin-Dropdown auf dem Statement-Eingang.

  function digitalHat(type, label, tooltip) {
    Blockly.Blocks[type] = {
      init: function () {
        this.appendStatementInput('DO')
            .appendField(label)
            .appendField('  Port:')
            .appendField(pinField(), 'PIN')
            .appendField('→ dann');
        this.setColour(EVENT_COLOUR);
        this.setTooltip(tooltip);
      }
    };
  }

  digitalHat('when_obstacle',  'Wenn Hindernis erkannt',   'Startet, sobald ein Hindernis erkannt wird');
  digitalHat('when_line',      'Wenn Linie erkannt',        'Startet, sobald eine Linie erkannt wird');
  digitalHat('when_tilt',      'Wenn geneigt',             'Startet, sobald der Sensor geneigt wird');
  digitalHat('when_magnetic',  'Wenn Magnetfeld erkannt',  'Startet, sobald ein Magnetfeld erkannt wird');
  digitalHat('when_flame',     'Wenn Flamme erkannt',      'Startet, sobald eine Flamme erkannt wird');
  digitalHat('when_sound',     'Wenn Geräusch erkannt',    'Startet, sobald ein Geräusch erkannt wird');
  digitalHat('when_touch',     'Wenn berührt',             'Startet, sobald der Sensor berührt wird');
  digitalHat('when_vibration', 'Wenn Erschütterung',       'Startet bei einer Erschütterung');

  // ── Taster-Hut (mit gedrückt/losgelassen) ───────────────────────────────────

  Blockly.Blocks['when_button'] = {
    init: function () {
      this.appendStatementInput('DO')
          .appendField('Wenn Taster')
          .appendField(buttonField(), 'BTN')
          .appendField(stateField(), 'STATE')
          .appendField('→ dann');
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald der Taster gedrückt bzw. losgelassen wird');
    }
  };

  // ── Schwellwert-Hüte (Vergleich mit Zahl) ───────────────────────────────────

  Blockly.Blocks['when_distance'] = {
    init: function () {
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendField('Wenn Abstand  Port:')
          .appendField(groveField('digital'), 'SIG')
          .appendField(opField(), 'OP');
      this.appendStatementInput('DO').appendField('cm → dann');
      this.setInputsInline(true);
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald der gemessene Abstand die Bedingung erfüllt');
    }
  };

  Blockly.Blocks['when_light'] = {
    init: function () {
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendField('Wenn Helligkeit  Port:')
          .appendField(groveField('analog'), 'PIN')
          .appendField(opField(), 'OP');
      this.appendStatementInput('DO').appendField('% → dann');
      this.setInputsInline(true);
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald die Helligkeit (0–100 %) die Bedingung erfüllt');
    }
  };

  Blockly.Blocks['when_temperature'] = {
    init: function () {
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendField('Wenn Temperatur  Port:')
          .appendField(groveField('digital'), 'PIN')
          .appendField(opField(), 'OP');
      this.appendStatementInput('DO').appendField('°C → dann');
      this.setInputsInline(true);
      this.setColour(EVENT_COLOUR);
      this.setTooltip('Startet, sobald die Temperatur die Bedingung erfüllt');
    }
  };

})();
