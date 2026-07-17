// blocks/control.js – Steuerungs-Blöcke

// ── Pflicht-Startblöcke (werden via app.js in Workspace gesetzt) ──────────────

Blockly.Blocks['control_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('SETUP');
    this.appendDummyInput()
        .appendField(L('läuft einmal beim Start', 'runs once at start'));
    this.appendStatementInput('DO');
    this.setColour('#7C3AED');
    this.setTooltip(L('Code hier läuft einmal beim Einschalten / Neustart', 'Code here runs once after power-on / restart'));
  }
};

Blockly.Blocks['control_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(L('FÜR IMMER', 'FOREVER'));
    this.appendStatementInput('DO');
    this.setColour('#7C3AED');
    this.setTooltip(L('Code hier wird immer wieder wiederholt', 'Code here repeats over and over'));
  }
};

// ── Hilfsmittel (in Toolbox verfügbar) ───────────────────────────────────────

Blockly.Blocks['control_wait'] = {
  init: function() {
    this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField(L('Warte', 'Wait'));
    this.appendDummyInput()
        .appendField(L('Sekunden', 'seconds'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#7C3AED');
    this.setTooltip(L('Wartet die angegebene Anzahl Sekunden', 'Waits for the given number of seconds'));
  }
};

// ── Bedingungs-Schleifen (Logik-Kategorie) ───────────────────────────────────
// Kooperativ: der Generator fügt ein await-Yield ein, damit parallele Aufgaben
// (Ereignisse, weitere Schleifen) nicht blockiert werden.

Blockly.Blocks['control_wait_until'] = {
  init: function() {
    this.appendValueInput('COND')
        .setCheck('Boolean')
        .appendField(L('⏳ warte bis', '⏳ wait until'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4FBFE8');
    this.setTooltip(L('Hält an dieser Stelle an, bis die Bedingung erfüllt ist', 'Pauses here until the condition is true'));
  }
};

Blockly.Blocks['control_while'] = {
  init: function() {
    this.appendValueInput('COND')
        .setCheck('Boolean')
        .appendField(L('🔁 solange', '🔁 while'));
    this.appendStatementInput('DO')
        .appendField(L('mache', 'do'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4FBFE8');
    this.setTooltip(L('Wiederholt die Blöcke, solange die Bedingung erfüllt ist', 'Repeats the blocks while the condition is true'));
  }
};

Blockly.Blocks['control_print'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField(L('Ausgabe:', 'Print:'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#7C3AED');
    this.setTooltip(L('Gibt einen Wert im Seriellen Monitor aus', 'Prints a value to the serial monitor'));
  }
};
