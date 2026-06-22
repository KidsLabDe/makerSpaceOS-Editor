// block_builder.js – registriert Blockly-Blöcke + Generatoren aus BLOCKS_DB
// Läuft nach boards.js und blocks_db.js

(function () {
  'use strict';

  // ── Feld-Optionen aus BOARD ────────────────────────────────────────────────

  function getFieldOptions(inp) {
    switch (inp.fieldType) {
      case 'pin_dropdown':
        return BOARD[inp.pinSource || 'externalPins'].map(p => [p, p]);
      case 'grove_dropdown':
        return BOARD.groveOptions(inp.groveRole || 'digital');
      case 'lcd_version_dropdown':
        return [['Version 4', '0x62'], ['Version 5', '0x30']];
      case 'on_off_dropdown':
        return [['einschalten', 'True'], ['ausschalten', 'False']];
      case 'op_dropdown':
        return [['<', '<'], ['>', '>'], ['=', '==']];
      case 'motor_dropdown':
        return Object.keys(BOARD.motors).map(k => [k, k]);
      case 'servo_dropdown':
        return Object.entries(BOARD.servos).map(([k, v]) => [`${k} (${v})`, k]);
      case 'button_dropdown':
        return Object.entries(BOARD.buttons).map(([k, v]) => [`${k} (${v})`, k]);
      case 'state_dropdown':
        return [['gedrückt', 'pressed'], ['losgelassen', 'released']];
      case 'rgb_color_dropdown':
        return [
          ['🔴 Rot', 'red'], ['🟢 Grün', 'green'], ['🔵 Blau', 'blue'],
          ['🟡 Gelb', 'yellow'], ['🩵 Türkis', 'cyan'], ['🟣 Pink', 'pink'],
          ['⬜ Weiß', 'white'], ['⬛ Aus', 'off'],
        ];
      default:
        return (inp.options || []);
    }
  }

  // ── Feld zu Blockly-Input hinzufügen ──────────────────────────────────────

  function addFields(input, inpDefs) {
    for (const inp of (inpDefs || [])) {
      if (inp.label) input.appendField(inp.label);
      if (!inp.fieldType || inp.fieldType === 'fixed_label') continue;

      if (inp.fieldType === 'number_field') {
        input.appendField(
          new Blockly.FieldNumber(
            inp.default ?? 1,
            inp.min ?? 0,
            inp.max ?? Infinity,
            inp.precision ?? 0
          ),
          inp.name
        );
      } else if (inp.fieldType === 'colour_picker') {
        input.appendField(new Blockly.FieldColour(inp.default || '#ff0000'), inp.name);
      } else {
        input.appendField(new Blockly.FieldDropdown(getFieldOptions(inp)), inp.name);
      }
    }
  }

  // ── Block-init-Funktion aus Definition bauen ───────────────────────────────

  function buildInit(def) {
    return function () {
      const block = this;

      if (def.blockType === 'value') {
        const dummyInput = block.appendDummyInput();
        addFields(dummyInput, def.inputs);
        block.setOutput(true, def.output || 'Number');

      } else if (def.blockType === 'statement') {
        if (def.inputs && def.inputs.length) {
          addFields(block.appendDummyInput(), def.inputs);
        }
        // Wert-Eingänge (z.B. blinken-Anzahl, Servo-Winkel, Motor-Tempo)
        for (const vi of (def.valueInputs || [])) {
          const v = block.appendValueInput(vi.name).setCheck(vi.check || 'Number');
          if (vi.label)  v.appendField(vi.label);
          if (vi.suffix) block.appendDummyInput().appendField(vi.suffix);
        }
        if (def.valueInputs && def.valueInputs.length) {
          block.setInputsInline(def.inline !== false);
        }
        block.setPreviousStatement(true, null);
        block.setNextStatement(true, null);

      } else if (def.blockType === 'event_simple') {
        // Alle Felder auf dem StatementInput selbst
        const si = block.appendStatementInput(def.statementInput?.name || 'DO');
        addFields(si, def.inputs);
        si.appendField(def.statementInput?.label || '→ dann');
        block.setPreviousStatement(true, null);
        block.setNextStatement(true, null);

      } else if (def.blockType === 'event') {
        // Felder + OP auf ValueInput; Körper auf StatementInput
        const vi = block.appendValueInput(def.valueInputs?.[0]?.name || 'VALUE')
          .setCheck(def.valueInputs?.[0]?.check || 'Number');
        addFields(vi, def.inputs);

        const si = block.appendStatementInput(def.statementInput?.name || 'DO')
          .appendField(def.statementInput?.label || 'dann');
        block.setInputsInline(def.inline !== false);
        block.setPreviousStatement(true, null);
        block.setNextStatement(true, null);
      }

      block.setColour(def.colour || '#1565C0');
      if (def.tooltip) block.setTooltip(def.tooltip);
      if (def.inline) block.setInputsInline(true);
    };
  }

  // ── Template-Engine: ${FIELD} → Wert ─────────────────────────────────────

  function interpolate(template, ctx) {
    return String(template).replace(/\$\{([^}]+)\}/g, (_, k) => ctx[k] ?? '');
  }

  // ── Import-Key aus Import-String ableiten ─────────────────────────────────

  function importToKey(importStr) {
    if (importStr.startsWith('from ')) {
      const m = importStr.match(/import\s+(\w+)/);
      return 'from_' + (m ? m[1] : 'unknown');
    }
    const m = importStr.match(/import\s+(\w+)$/);
    if (!m) return 'import_' + importStr.replace(/\W+/g, '_');
    return 'import_' + m[1].replace(/^adafruit_/, '');
  }

  // ── Generator-Funktion aus Definition bauen ───────────────────────────────

  function buildGenerator(def) {
    const gen = def.generator;
    return function (block) {
      // 1. Feldwerte sammeln
      const ctx = {};
      for (const inp of (def.inputs || [])) {
        if (inp.name && inp.fieldType && inp.fieldType !== 'fixed_label') {
          ctx[inp.name] = block.getFieldValue(inp.name) || '';
        }
      }

      // 2. ValueInputs auswerten
      for (const vi of (def.valueInputs || [])) {
        ctx[vi.name] = Blockly.Python.valueToCode(
          block, vi.name, Blockly.Python.ORDER_NONE
        ) || String(vi.defaultValue ?? '0');
      }

      // 3. StatementInput auswerten
      if (def.statementInput) {
        ctx['DO'] = Blockly.Python.statementToCode(block, def.statementInput.name)
          || '    pass\n';
      }

      // 4. Imports in _defs eintragen
      for (const imp of (gen.imports || [])) {
        _defs[importToKey(imp)] = imp;
      }

      // 5. Defs mit Interpolation eintragen
      for (const { key, val } of (gen.defs || [])) {
        _defs[interpolate(key, ctx)] = interpolate(val, ctx);
      }

      // 6. Expression oder Code zurückgeben
      const ORDER_MAP = {
        NONE:          Blockly.Python.ORDER_NONE,
        MEMBER:        Blockly.Python.ORDER_MEMBER,
        FUNCTION_CALL: Blockly.Python.ORDER_FUNCTION_CALL,
        ATOMIC:        Blockly.Python.ORDER_ATOMIC,
      };

      if (gen.expression) {
        return [interpolate(gen.expression, ctx), ORDER_MAP[gen.order] ?? Blockly.Python.ORDER_NONE];
      }
      return interpolate(gen.code || '', ctx);
    };
  }

  // ── Toolbox-Kategorien aus BLOCKS_DB bauen ────────────────────────────────

  function buildToolboxCategories(db) {
    const categories = [];

    for (const catDef of BLOCKS_CATALOG.categories) {
      const catBlocks = db.filter(b => b.blockCategory === catDef.id);
      if (!catBlocks.length) continue;

      const contents = [];

      if (catDef.subCategories && catDef.subCategories.length) {
        for (const sc of catDef.subCategories) {
          const scBlocks = catBlocks.filter(b => b.subCategory === sc);
          if (!scBlocks.length) continue;
          contents.push({ kind: 'label', text: `── ${sc} ──` });
          for (const b of scBlocks) contents.push(toolboxEntry(b));
        }
        // blocks without a subCategory
        const noSc = catBlocks.filter(b => !b.subCategory || !catDef.subCategories.includes(b.subCategory));
        for (const b of noSc) contents.push(toolboxEntry(b));
      } else {
        for (const b of catBlocks) contents.push(toolboxEntry(b));
      }

      categories.push({
        kind:     'category',
        name:     catDef.label,
        colour:   catDef.colour,
        contents,
      });
    }

    return categories;
  }

  function toolboxEntry(def) {
    const entry = { kind: 'block', type: def.id };
    // Schatten-Werte für ValueInputs
    if (def.valueInputs && def.valueInputs.length) {
      entry.inputs = {};
      for (const vi of def.valueInputs) {
        if (vi.defaultValue !== undefined) {
          entry.inputs[vi.name] = {
            shadow: { type: 'math_number', fields: { NUM: vi.defaultValue } }
          };
        }
      }
    }
    return entry;
  }

  // ── Hauptschleife: alle Blöcke registrieren ───────────────────────────────

  for (const def of BLOCKS_DB) {
    // Block-Definition registrieren (skip wenn bereits vorhanden = legacy in sensors.js)
    if (!Blockly.Blocks[def.id]) {
      Blockly.Blocks[def.id] = { init: buildInit(def) };
    }

    // Generator registrieren (skip bei legacyGenerator oder bereits vorhanden)
    if (!def.legacyGenerator && def.generator && !Blockly.Python[def.id]) {
      Blockly.Python[def.id] = buildGenerator(def);
    }
  }

  // Toolbox-Einträge global verfügbar machen (für app.js)
  window.BLOCKS_DB_TOOLBOX = buildToolboxCategories(BLOCKS_DB);

})();
