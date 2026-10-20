// blocks/matrix5.js – Blöcke für eine fest eingebaute 5×5-NeoPixel-Matrix
// (GamePadPico: BOARD.matrix5, die 25 Onboard-NeoPixel an BOARD.neopixel).
// Nutzt die Felder aus blocks/matrix.js mit Rastergröße 5.

(function () {
  'use strict';

  const { FieldMatrix8x8, FieldSymbolPicker, COLOR_OPTS, MATRIX_COLOR, gridToMask } = window.MATRIX_FIELDS;

  // ── 5×5-Symbole ───────────────────────────────────────────────────────────

  const SYMBOLS5 = {
    herz: [
      [0,1,0,1,0],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0],
    ],
    smiley: [
      [0,0,0,0,0],
      [0,1,0,1,0],
      [0,0,0,0,0],
      [1,0,0,0,1],
      [0,1,1,1,0],
    ],
    traurig: [
      [0,0,0,0,0],
      [0,1,0,1,0],
      [0,0,0,0,0],
      [0,1,1,1,0],
      [1,0,0,0,1],
    ],
    pfeil_oben: [
      [0,0,1,0,0],
      [0,1,1,1,0],
      [1,0,1,0,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
    ],
    pfeil_unten: [
      [0,0,1,0,0],
      [0,0,1,0,0],
      [1,0,1,0,1],
      [0,1,1,1,0],
      [0,0,1,0,0],
    ],
    pfeil_links: [
      [0,0,1,0,0],
      [0,1,0,0,0],
      [1,1,1,1,1],
      [0,1,0,0,0],
      [0,0,1,0,0],
    ],
    pfeil_rechts: [
      [0,0,1,0,0],
      [0,0,0,1,0],
      [1,1,1,1,1],
      [0,0,0,1,0],
      [0,0,1,0,0],
    ],
    haken: [
      [0,0,0,0,0],
      [0,0,0,0,1],
      [0,0,0,1,0],
      [1,0,1,0,0],
      [0,1,0,0,0],
    ],
    x_symbol: [
      [1,0,0,0,1],
      [0,1,0,1,0],
      [0,0,1,0,0],
      [0,1,0,1,0],
      [1,0,0,0,1],
    ],
    stern: [
      [0,0,1,0,0],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,1,0,1,0],
      [1,0,0,0,1],
    ],
    rahmen: [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1],
    ],
    alles_an: [
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
    ],
  };

  const SYMBOL5_LABELS = {
    herz:         L('❤️ Herz', '❤️ Heart'),
    smiley:       L('😊 Smiley', '😊 Smiley'),
    traurig:      L('😢 Traurig', '😢 Sad'),
    pfeil_oben:   L('↑ Oben', '↑ Up'),
    pfeil_unten:  L('↓ Unten', '↓ Down'),
    pfeil_links:  L('← Links', '← Left'),
    pfeil_rechts: L('→ Rechts', '→ Right'),
    haken:        L('✓ Haken', '✓ Check'),
    x_symbol:     L('✕ Kreuz', '✕ Cross'),
    stern:        L('⭐ Stern', '⭐ Star'),
    rahmen:       L('□ Rahmen', '□ Frame'),
    alles_an:     L('■ Alles an', '■ All on'),
  };

  const SYMBOL5_MASKS = {};
  for (const [key, grid] of Object.entries(SYMBOLS5)) SYMBOL5_MASKS[key] = gridToMask(grid);
  window.MATRIX5_SYMBOL_MASKS = SYMBOL5_MASKS;

  // ── Felder mit Rastergröße 5 ──────────────────────────────────────────────

  class FieldMatrix5x5 extends FieldMatrix8x8 {
    static N = 5;
  }
  Blockly.fieldRegistry.register('field_matrix5x5', FieldMatrix5x5);

  class FieldSymbolPicker5x5 extends FieldSymbolPicker {
    static N       = 5;
    static MASKS   = SYMBOL5_MASKS;
    static LABELS  = SYMBOL5_LABELS;
    static DEFAULT = 'herz';
  }
  Blockly.fieldRegistry.register('field_symbolpicker5x5', FieldSymbolPicker5x5);

  // ── Block-Definitionen ────────────────────────────────────────────────────

  Blockly.Blocks['matrix5_symbol'] = {
    init() {
      this.appendDummyInput()
          .appendField(L('zeige Symbol', 'show symbol'))
          .appendField(new FieldSymbolPicker5x5('herz'), 'SYMBOL')
          .appendField(L('  Farbe:', '  colour:'))
          .appendField(new Blockly.FieldDropdown(COLOR_OPTS), 'COLOR');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip(L('Zeigt ein fertiges Symbol auf der 5×5-Matrix', 'Shows a ready-made symbol on the 5×5 matrix'));
    },
  };

  Blockly.Blocks['matrix5_draw'] = {
    init() {
      this.appendDummyInput()
          .appendField(L('zeige LEDs  Farbe:', 'show LEDs  colour:'))
          .appendField(new Blockly.FieldDropdown(COLOR_OPTS), 'COLOR');
      this.appendDummyInput()
          .appendField(new FieldMatrix5x5(), 'PIXELS');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip(L('Klicke auf die Vorschau, um die leuchtenden Punkte zu malen', 'Click the preview to paint the dots that should light up'));
    },
  };

  // Spalte/Zeile ab 1 (1–5), wie die Positionen bei den Listen-Blöcken
  Blockly.Blocks['matrix5_set_pixel'] = {
    init() {
      this.appendDummyInput()
          .appendField(L('Punkt setzen  Farbe:', 'set dot  colour:'))
          .appendField(new Blockly.FieldDropdown(COLOR_OPTS), 'COLOR');
      this.appendValueInput('X').setCheck('Number').appendField(L('  Spalte', '  column'));
      this.appendValueInput('Y').setCheck('Number').appendField(L('Zeile', 'row'));
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip(L('Schaltet einen Punkt an: Spalte 1–5 (von links), Zeile 1–5 (von oben)', 'Turns on one dot: column 1–5 (from the left), row 1–5 (from the top)'));
    },
  };

  Blockly.Blocks['matrix5_digit'] = {
    init() {
      this.appendValueInput('NUM').setCheck('Number')
          .appendField(L('zeige Ziffer', 'show digit'));
      this.appendDummyInput()
          .appendField(L('Farbe:', 'colour:'))
          .appendField(new Blockly.FieldDropdown(COLOR_OPTS), 'COLOR');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip(L('Zeigt eine Ziffer von 0 bis 9 (bei größeren Zahlen die letzte Stelle)', 'Shows a digit from 0 to 9 (for bigger numbers the last digit)'));
    },
  };

  // ── Toolbox ───────────────────────────────────────────────────────────────
  // Wird in buildFinalToolbox() an "Lichter" angehängt, nur bei BOARD.matrix5.
  window.MATRIX5_TOOLBOX_CONTENTS = [
    { kind: 'block', type: 'matrix5_symbol' },
    { kind: 'block', type: 'matrix5_draw' },
    { kind: 'block', type: 'matrix5_digit',
      inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 7 } } } } },
    { kind: 'block', type: 'matrix5_set_pixel',
      inputs: {
        X: { shadow: { type: 'math_number', fields: { NUM: 3 } } },
        Y: { shadow: { type: 'math_number', fields: { NUM: 3 } } },
      }
    },
  ];

})();
