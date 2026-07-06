// blocks/variables.js – Variablen verändern: "erhöhe" / "verringere"
// Ersetzt den Standard-Block "math_change" ("erhöhe … um") durch zwei klare
// Blöcke, sodass Kinder zum Runterzählen keine negative Zahl brauchen.
// math_change selbst bleibt registriert (generator.js) – alte gespeicherte
// Programme mit diesem Block funktionieren weiterhin.

(function () {
  'use strict';

  const HUE = '%{BKY_VARIABLES_HUE}';

  function defVarDelta(type, message0, tooltip) {
    Blockly.Blocks[type] = {
      init: function () {
        this.jsonInit({
          message0: message0,                    // z.B. "erhöhe %1 um %2"
          args0: [
            { type: 'field_variable', name: 'VAR', variable: null },
            { type: 'input_value',    name: 'DELTA', check: 'Number' },
          ],
          inputsInline: true,
          previousStatement: null,
          nextStatement: null,
          colour: HUE,
          tooltip: tooltip,
          helpUrl: '',
        });
      },
    };
  }

  defVarDelta('var_increase',  'erhöhe %1 um %2',     'Erhöht die Variable um den angegebenen Wert.');
  defVarDelta('var_decrease',  'verringere %1 um %2', 'Verringert die Variable um den angegebenen Wert.');

  // Eigener Variablen-Flyout: baut den Standard-Flyout und tauscht den einen
  // "math_change"-Block gegen "erhöhe" + "verringere" (gleiche VAR/DELTA-Struktur,
  // daher lässt sich das vorhandene Element einfach klonen). Der Rest (Button
  // "Variable erstellen", setzen, holen) bleibt unverändert.
  window.variableFlyoutCallback = function (workspace) {
    const list = Blockly.Variables.flyoutCategory(workspace);   // Array aus DOM-Elementen
    const out = [];
    for (const el of list) {
      const isMathChange = el.tagName && el.tagName.toLowerCase() === 'block'
        && el.getAttribute('type') === 'math_change';
      if (isMathChange) {
        out.push(_cloneAs(el, 'var_increase'));
        out.push(_cloneAs(el, 'var_decrease'));
      } else {
        out.push(el);
      }
    }
    return out;
  };

  function _cloneAs(el, type) {
    const clone = el.cloneNode(true);   // übernimmt VAR-Feld + DELTA-Shadow (math_number = 1)
    clone.setAttribute('type', type);
    return clone;
  }
})();
