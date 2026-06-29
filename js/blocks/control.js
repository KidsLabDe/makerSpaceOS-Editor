// blocks/control.js – Steuerungs-Blöcke

// ── Pflicht-Startblöcke (werden via app.js in Workspace gesetzt) ──────────────

Blockly.Blocks['control_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('SETUP');
    this.appendDummyInput()
        .appendField('läuft einmal beim Start');
    this.appendStatementInput('DO');
    this.setColour('#7C3AED');
    this.setTooltip('Code hier läuft einmal beim Einschalten / Neustart');
  }
};

Blockly.Blocks['control_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('FÜR IMMER');
    this.appendStatementInput('DO');
    this.setColour('#7C3AED');
    this.setTooltip('Code hier wird immer wieder wiederholt');
  }
};

// ── Hilfsmittel (in Toolbox verfügbar) ───────────────────────────────────────

Blockly.Blocks['control_wait'] = {
  init: function() {
    this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField('Warte');
    this.appendDummyInput()
        .appendField('Sekunden');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#7C3AED');
    this.setTooltip('Wartet die angegebene Anzahl Sekunden');
  }
};

// ── Bedingungs-Schleifen (Logik-Kategorie) ───────────────────────────────────
// Kooperativ: der Generator fügt ein await-Yield ein, damit parallele Aufgaben
// (Ereignisse, weitere Schleifen) nicht blockiert werden.

Blockly.Blocks['control_wait_until'] = {
  init: function() {
    this.appendValueInput('COND')
        .setCheck('Boolean')
        .appendField('⏳ warte bis');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4FBFE8');
    this.setTooltip('Hält an dieser Stelle an, bis die Bedingung erfüllt ist');
  }
};

Blockly.Blocks['control_while'] = {
  init: function() {
    this.appendValueInput('COND')
        .setCheck('Boolean')
        .appendField('🔁 solange');
    this.appendStatementInput('DO')
        .appendField('mache');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4FBFE8');
    this.setTooltip('Wiederholt die Blöcke, solange die Bedingung erfüllt ist');
  }
};

Blockly.Blocks['control_print'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField('Ausgabe:');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#7C3AED');
    this.setTooltip('Gibt einen Wert im Seriellen Monitor aus');
  }
};
