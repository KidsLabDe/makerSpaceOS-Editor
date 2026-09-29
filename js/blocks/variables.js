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

  defVarDelta('var_increase',  L('erhöhe %1 um %2', 'increase %1 by %2'),     L('Erhöht die Variable um den angegebenen Wert.', 'Increases the variable by the given value.'));
  defVarDelta('var_decrease',  L('verringere %1 um %2', 'decrease %1 by %2'), L('Verringert die Variable um den angegebenen Wert.', 'Decreases the variable by the given value.'));

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

  // Variablennamen ohne Leerzeichen und Umlaute: Blockly nutzt den Namen-Dialog
  // nur für "Variable erstellen" / "umbenennen". Leerzeichen werden dort direkt
  // zu "_", Umlaute ausgeschrieben (größe → groesse) – sonst kodiert Blockly sie
  // im Python-Code unleserlich (gr_C3_B6_C3_9Fe). So steht der Name im Editor
  // genau so, wie er im Code auftaucht.
  const UMLAUTE = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue', 'ß': 'ss' };

  Blockly.dialog.setPrompt(function (message, defaultValue, callback) {
    const name = window.prompt(message, defaultValue);
    callback(name == null ? name : name.trim()
      .replace(/\s+/g, '_')
      .replace(/[äöüÄÖÜß]/g, (c) => UMLAUTE[c]));
  });

  function _cloneAs(el, type) {
    const clone = el.cloneNode(true);   // übernimmt VAR-Feld + DELTA-Shadow (math_number = 1)
    clone.setAttribute('type', type);
    return clone;
  }
})();
