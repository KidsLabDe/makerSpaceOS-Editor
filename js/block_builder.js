// block_builder.js – registriert Blockly-Blöcke + Generatoren aus BLOCKS_DB
// Läuft nach boards.js und blocks_db.js

(function () {
  'use strict';

  // ── Feld-Optionen aus BOARD ────────────────────────────────────────────────

  const _NONE_OPT = [L('– bitte auswählen –', '– please select –'), '__NONE__'];

  // Einheitliches Farb-Dropdown für alle Blöcke (colour_picker + rgb_color_dropdown)
  const _COLOR_OPTS = [
    [L('🔴 Rot', '🔴 Red'),      '#FF0000'],
    [L('🟠 Orange', '🟠 Orange'),'#FF6600'],
    [L('🟡 Gelb', '🟡 Yellow'),  '#FFFF00'],
    [L('🟢 Grün', '🟢 Green'),   '#00FF00'],
    [L('🩵 Cyan', '🩵 Cyan'),    '#00FFFF'],
    [L('🔵 Blau', '🔵 Blue'),    '#0000FF'],
    [L('🟣 Lila', '🟣 Purple'),  '#8000FF'],
    [L('🩷 Pink', '🩷 Pink'),    '#FF00FF'],
    [L('⚪ Weiß', '⚪ White'),   '#FFFFFF'],
    [L('⚫ Aus', '⚫ Off'),      '#000000'],
  ];

  function getFieldOptions(inp) {
    switch (inp.fieldType) {
      case 'pin_dropdown':
        return [_NONE_OPT, ...BOARD[inp.pinSource || 'externalPins'].map(p => [p, p])];
      case 'grove_dropdown':
        return [_NONE_OPT, ...BOARD.groveOptions(inp.groveRole || 'digital')];
      case 'motor_dropdown':
        return [_NONE_OPT, ...Object.keys(BOARD.motors).map(k => [k, k])];
      case 'servo_dropdown':
        return [_NONE_OPT, ...Object.entries(BOARD.servos).map(([k, v]) => [`${k} (${v})`, k])];
      case 'taster_dropdown':
        return [
          _NONE_OPT,
          ...Object.entries(BOARD.buttons).map(([k, v]) => [`${k} (${v})`, k]),
          GROVE_SEP,
          ...BOARD.grovePorts.map(p => [p.label, p.signal]),
        ];
      case 'lcd_version_dropdown':
        return [['Version 4', '0x62'], ['Version 5', '0x30']];
      case 'on_off_dropdown':
        return [[L('einschalten', 'turn on'), 'True'], [L('ausschalten', 'turn off'), 'False']];
      case 'direction_dropdown':
        return [[L('rechts ↻', 'right ↻'), 'cw'], [L('links ↺', 'left ↺'), 'ccw']];
      case 'op_dropdown':
        return [['<', '<'], ['>', '>'], ['=', '==']];
      case 'button_dropdown':
        return Object.entries(BOARD.buttons).map(([k, v]) => [`${k} (${v})`, k]);
      case 'state_dropdown':
        return [[L('gedrückt', 'pressed'), 'pressed'], [L('losgelassen', 'released'), 'released']];
      case 'tilt_dropdown':
        return [[L('vor/zurück', 'forward/back'), 'pitch'], [L('links/rechts', 'left/right'), 'roll']];
      case 'rgb_color_dropdown':
        return _COLOR_OPTS;
      default:
        return (inp.options || []);
    }
  }

  // ── Feld zu Blockly-Input hinzufügen ──────────────────────────────────────

  function addFields(input, inpDefs) {
    for (const inp of (inpDefs || [])) {
      if (inp.label) input.appendField(LF(inp, 'label'));
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
        input.appendField(new Blockly.FieldDropdown(_COLOR_OPTS), inp.name);
      } else {
        // Validator verwirft den Trenner-Eintrag (__SEP__) → nicht auswählbar
        const dd = new Blockly.FieldDropdown(
          getFieldOptions(inp),
          v => v === '__SEP__' ? null : undefined
        );
        input.appendField(dd, inp.name);
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
          // Standard: alle Felder in einer Zeile. Ein Input mit newRow:true
          // beginnt eine neue Dummy-Zeile (mehrzeilige Blöcke).
          let row = null;
          for (const inp of def.inputs) {
            if (!row || inp.newRow) row = block.appendDummyInput();
            addFields(row, [inp]);
          }
        }
        // Wert-Eingänge (z.B. blinken-Anzahl, Servo-Winkel, Motor-Tempo)
        for (const vi of (def.valueInputs || [])) {
          const v = block.appendValueInput(vi.name).setCheck(vi.check || 'Number');
          if (vi.label)  v.appendField(LF(vi, 'label'));
          if (vi.suffix) block.appendDummyInput().appendField(LF(vi, 'suffix'));
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
        si.appendField((def.statementInput && LF(def.statementInput, 'label')) || L('→ dann', '→ then'));
        block.setPreviousStatement(true, null);
        block.setNextStatement(true, null);

      } else if (def.blockType === 'event') {
        // Felder + OP auf ValueInput; Körper auf StatementInput
        const vi = block.appendValueInput(def.valueInputs?.[0]?.name || 'VALUE')
          .setCheck(def.valueInputs?.[0]?.check || 'Number');
        addFields(vi, def.inputs);

        const si = block.appendStatementInput(def.statementInput?.name || 'DO')
          .appendField((def.statementInput && LF(def.statementInput, 'label')) || L('dann', 'then'));
        block.setInputsInline(def.inline !== false);
        block.setPreviousStatement(true, null);
        block.setNextStatement(true, null);
      }

      block.setColour(def.colour || '#2563EB');
      if (def.tooltip) block.setTooltip(LF(def, 'tooltip'));
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

  const _HW_FIELDS = new Set(['grove_dropdown', 'servo_dropdown', 'motor_dropdown', 'pin_dropdown', 'taster_dropdown']);

  function buildGenerator(def) {
    const gen = def.generator;
    return function (block) {
      // 1. Feldwerte sammeln
      const ctx = {};
      let hasUnset = false;
      for (const inp of (def.inputs || [])) {
        if (inp.name && inp.fieldType && inp.fieldType !== 'fixed_label') {
          ctx[inp.name] = block.getFieldValue(inp.name) || '';
          if (_HW_FIELDS.has(inp.fieldType) && ctx[inp.name] === '__NONE__') hasUnset = true;
        }
      }
      if (hasUnset) {
        block.setWarningText(L('⚠ Bitte Port / Pin auswählen!', '⚠ Please select a port / pin!'));
        if (block.outputConnection) return ['None', Blockly.Python.ORDER_NONE];
        return L('# ⚠ Kein Port ausgewählt\n', '# ⚠ No port selected\n');
      }
      block.setWarningText(null);

      // 2. ValueInputs auswerten
      for (const vi of (def.valueInputs || [])) {
        const viDefault = (IS_EN && vi.defaultValue_en !== undefined) ? vi.defaultValue_en : vi.defaultValue;
        ctx[vi.name] = Blockly.Python.valueToCode(
          block, vi.name, Blockly.Python.ORDER_NONE
        ) || String(viDefault ?? '0');
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

    // Board-spezifische Ausblendungen (aktives BOARD-Profil, optional).
    const hideCats  = new Set(BOARD.hideCategories    || []);
    const hideSubs  = new Set(BOARD.hideSubCategories || []);
    const hideIds   = new Set(BOARD.hideBlockIds      || []);
    const visible   = b => !hideIds.has(b.id);

    for (const catDef of BLOCKS_CATALOG.categories) {
      if (hideCats.has(catDef.id)) continue;
      const catBlocks = db.filter(b => b.blockCategory === catDef.id && visible(b));
      if (!catBlocks.length) continue;

      const contents = [];

      if (catDef.subCategories && catDef.subCategories.length) {
        for (const sc of catDef.subCategories) {
          if (hideSubs.has(sc)) continue;
          const scBlocks = catBlocks.filter(b => b.subCategory === sc);
          if (!scBlocks.length) continue;
          const scLabel = (IS_EN && catDef.subCategories_en && catDef.subCategories_en[sc]) || sc;
          contents.push({ kind: 'label', text: `── ${scLabel} ──` });
          for (const b of scBlocks) contents.push(toolboxEntry(b));
        }
        // blocks without a subCategory
        const noSc = catBlocks.filter(b => !b.subCategory || !catDef.subCategories.includes(b.subCategory));
        for (const b of noSc) contents.push(toolboxEntry(b));
      } else {
        for (const b of catBlocks) contents.push(toolboxEntry(b));
      }

      if (!contents.length) continue;

      categories.push({
        kind:     'category',
        name:     LF(catDef, 'label'),
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
        const dv = (IS_EN && vi.defaultValue_en !== undefined) ? vi.defaultValue_en : vi.defaultValue;
        if (dv !== undefined) {
          // String-Eingänge bekommen einen editierbaren Text-Schatten, sonst eine Zahl
          entry.inputs[vi.name] = (vi.check === 'String')
            ? { shadow: { type: 'text', fields: { TEXT: dv } } }
            : { shadow: { type: 'math_number', fields: { NUM: dv } } };
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
