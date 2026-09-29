// blocks/lists.js – einfache Listen-Blöcke (Ergänzung zu den Blockly-Standard-Listen)
// Ersetzt die sperrigen Standard-Blöcke lists_getIndex / lists_setIndex (zwei
// Dropdowns) durch klare Blöcke mit fester Formulierung. Die Liste wird – wie bei
// "erhöhe/verringere" – direkt per Variablen-Dropdown gewählt.
// Positionen zählen ab 1 (wie in Blockly üblich); der Generator rechnet auf 0 um.
// Generatoren in js/generator.js, Toolbox-Eintrag in js/toolbox.js.

(function () {
  'use strict';

  const COLOUR = '#9333EA';

  // ➕ hänge [Wert] an [liste] an
  Blockly.Blocks['list_append'] = {
    init: function () {
      this.jsonInit({
        message0: L('➕ hänge %1 an %2 an', '➕ append %1 to %2'),
        args0: [
          { type: 'input_value',    name: 'VALUE' },
          { type: 'field_variable', name: 'VAR', variable: L('liste', 'list') },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: COLOUR,
        tooltip: L('Hängt einen Wert hinten an die Liste an. Die Liste wird dabei um einen Platz länger.',
                   'Adds a value to the end of the list. The list gets one place longer.'),
        helpUrl: '',
      });
    },
  };

  // 📋 Element Nr. [1] aus [liste]
  Blockly.Blocks['list_get'] = {
    init: function () {
      this.jsonInit({
        message0: L('📋 Element Nr. %1 aus %2', '📋 item no. %1 of %2'),
        args0: [
          { type: 'input_value',    name: 'INDEX', check: 'Number' },
          { type: 'field_variable', name: 'VAR', variable: L('liste', 'list') },
        ],
        inputsInline: true,
        output: null,
        colour: COLOUR,
        tooltip: L('Liefert den Wert an dieser Stelle der Liste. Nr. 1 ist der erste Platz.',
                   'Returns the value at this position in the list. No. 1 is the first place.'),
        helpUrl: '',
      });
    },
  };

  // ✏️ setze Element Nr. [1] in [liste] auf [Wert]
  Blockly.Blocks['list_set'] = {
    init: function () {
      this.jsonInit({
        message0: L('✏️ setze Element Nr. %1 in %2 auf %3', '✏️ set item no. %1 in %2 to %3'),
        args0: [
          { type: 'input_value',    name: 'INDEX', check: 'Number' },
          { type: 'field_variable', name: 'VAR', variable: L('liste', 'list') },
          { type: 'input_value',    name: 'VALUE' },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: COLOUR,
        tooltip: L('Überschreibt den Wert an dieser Stelle der Liste. Nr. 1 ist der erste Platz.',
                   'Overwrites the value at this position in the list. No. 1 is the first place.'),
        helpUrl: '',
      });
    },
  };

  // 🗑️ lösche Element Nr. [1] aus [liste]
  Blockly.Blocks['list_remove'] = {
    init: function () {
      this.jsonInit({
        message0: L('🗑️ lösche Element Nr. %1 aus %2', '🗑️ remove item no. %1 from %2'),
        args0: [
          { type: 'input_value',    name: 'INDEX', check: 'Number' },
          { type: 'field_variable', name: 'VAR', variable: L('liste', 'list') },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: COLOUR,
        tooltip: L('Entfernt den Wert an dieser Stelle. Die Einträge dahinter rutschen einen Platz nach vorne.',
                   'Removes the value at this position. The entries after it move up one place.'),
        helpUrl: '',
      });
    },
  };
})();
