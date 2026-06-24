// blocks/matrix.js – 8x8 NeoPixel-Matrix-Blöcke (Servo-Port S1–S4)
// Custom Blockly-Felder: FieldMatrix8x8 (Pixel malen) + FieldSymbolPicker

(function () {
  'use strict';

  // ── 8x8 Symboldefinitionen ────────────────────────────────────────────────

  const SYMBOLS = {
    herz: [
      [0,1,1,0,0,1,1,0],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    smiley: [
      [0,0,1,1,1,1,0,0],
      [0,1,0,0,0,0,1,0],
      [1,0,1,0,0,1,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,1,0,0,1,0,1],
      [1,0,0,1,1,0,0,1],
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
    ],
    traurig: [
      [0,0,1,1,1,1,0,0],
      [0,1,0,0,0,0,1,0],
      [1,0,1,0,0,1,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,1],
      [1,0,1,0,0,1,0,1],
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
    ],
    stern: [
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,1,0],
    ],
    pfeil_oben: [
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,0,1,1,0,1,1],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
    ],
    pfeil_unten: [
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [1,1,0,1,1,0,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,1,1,0,0,0],
    ],
    pfeil_links: [
      [0,0,0,1,0,0,0,0],
      [0,0,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1],
      [0,0,1,1,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    pfeil_rechts: [
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,1,1,0,0],
      [1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,0],
      [0,0,0,0,1,1,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    x_symbol: [
      [1,1,0,0,0,0,1,1],
      [1,1,1,0,0,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,0,0,1,1,1],
      [1,1,0,0,0,0,1,1],
    ],
    haken: [
      [0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,1,1],
      [0,0,0,0,0,1,1,0],
      [0,0,0,0,1,1,0,0],
      [1,0,0,1,1,0,0,0],
      [1,1,1,1,0,0,0,0],
      [0,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    diamant: [
      [0,0,0,1,1,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,1],
      [0,1,0,0,0,0,1,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    rahmen: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1],
    ],
    blitz: [
      [0,0,0,1,1,1,0,0],
      [0,0,1,1,1,0,0,0],
      [0,1,1,1,1,1,0,0],
      [1,1,1,1,1,0,0,0],
      [0,0,0,1,1,1,1,0],
      [0,0,0,0,1,1,0,0],
      [0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    note: [
      [0,0,0,1,1,1,1,0],
      [0,0,0,1,0,0,1,0],
      [0,0,0,1,0,0,0,0],
      [0,1,1,1,0,0,0,0],
      [1,1,1,0,0,0,0,0],
      [1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    haus: [
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [0,1,1,0,0,1,1,0],
      [0,1,1,0,0,1,1,0],
      [0,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,0],
    ],
    gitter: [
      [1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1],
    ],
    alles_an: [
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
    ],
  };

  const SYMBOL_LABELS = {
    herz:        '❤️ Herz',
    smiley:      '😊 Smiley',
    traurig:     '😢 Traurig',
    stern:       '⭐ Stern',
    pfeil_oben:  '↑ Oben',
    pfeil_unten: '↓ Unten',
    pfeil_links: '← Links',
    pfeil_rechts:'→ Rechts',
    x_symbol:    '✕ Kreuz',
    haken:       '✓ Haken',
    diamant:     '◇ Diamant',
    rahmen:      '□ Rahmen',
    blitz:       '⚡ Blitz',
    note:        '🎵 Note',
    haus:        '🏠 Haus',
    gitter:      '⊞ Gitter',
    alles_an:    '■ Alles an',
  };

  function gridToMask(grid) {
    return grid.map(row => row.map(v => v ? '1' : '0').join('')).join('');
  }

  const SYMBOL_MASKS = {};
  for (const [key, grid] of Object.entries(SYMBOLS)) {
    SYMBOL_MASKS[key] = gridToMask(grid);
  }
  window.MATRIX_SYMBOL_MASKS = SYMBOL_MASKS;
  window.MATRIX_SYMBOL_KEYS  = Object.keys(SYMBOLS);

  const DEFAULT_MASK   = '0'.repeat(64);
  const DEFAULT_SYMBOL = 'herz';
  const DEFAULT_COLOR  = '#ff0000';
  const MATRIX_COLOR   = '#7B2D8B';

  // ── Vorschaugröße im Block (klein) ────────────────────────────────────────
  const PV = 5;   // px pro Zelle (Vorschau)
  const PVG = 1;  // Abstand
  const PV_TOTAL = 8 * PV + 7 * PVG + 4; // ≈ 51 px

  // ── FieldMatrix8x8 ────────────────────────────────────────────────────────
  // Zeigt eine kleine Vorschau im Block; Klick öffnet Modal zum Malen.

  class FieldMatrix8x8 extends Blockly.Field {
    constructor(value, validator, config) {
      super(value || DEFAULT_MASK, validator, config);
      this.SERIALIZABLE = true;
      this.CURSOR = 'pointer';
      // Größe gleich im Konstruktor setzen, damit Blockly Platz reserviert
      this.size_.width  = PV_TOTAL;
      this.size_.height = PV_TOTAL;
    }

    static fromJson(options) {
      return new FieldMatrix8x8(options['value']);
    }

    initView() {
      this.prevGroup_ = Blockly.utils.dom.createSvgElement('g', {}, this.fieldGroup_);

      // Hintergrund
      Blockly.utils.dom.createSvgElement('rect', {
        x: 0, y: 0, width: PV_TOTAL, height: PV_TOTAL,
        fill: '#0d1f2d', rx: 3,
      }, this.prevGroup_);

      this.prevCells_ = [];
      for (let i = 0; i < 64; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const rect = Blockly.utils.dom.createSvgElement('rect', {
          x: 2 + col * (PV + PVG),
          y: 2 + row * (PV + PVG),
          width: PV, height: PV,
          fill: '#005566', rx: 1,
          style: 'pointer-events:none',
        }, this.prevGroup_);
        this.prevCells_.push(rect);
      }

      this.updateSize_();
      this.renderCells_();
    }

    updateSize_() {
      this.size_.width  = PV_TOTAL;
      this.size_.height = PV_TOTAL;
    }

    doValueUpdate_(newValue) {
      this.value_ = (typeof newValue === 'string' && newValue.length === 64 && /^[01]+$/.test(newValue))
        ? newValue : DEFAULT_MASK;
      return this.value_;
    }

    render_() { this.renderCells_(); }

    renderCells_() {
      if (!this.prevCells_) return;
      const mask = this.value_ || DEFAULT_MASK;
      const colorField = this.sourceBlock_ && this.sourceBlock_.getField('COLOR');
      const onColor = colorField ? colorField.getValue() : '#FFFFFF';
      for (let i = 0; i < 64; i++) {
        if (this.prevCells_[i]) {
          this.prevCells_[i].setAttribute('fill', mask[i] === '1' ? onColor : '#1a3a4a');
        }
      }
    }

    showEditor_() {
      this._openModal();
    }

    _openModal() {
      const currentMask = Array.from(this.getValue() || DEFAULT_MASK);
      const colorField  = this.sourceBlock_ && this.sourceBlock_.getField('COLOR');
      const onColor     = colorField ? colorField.getValue() : DEFAULT_COLOR;

      // Overlay
      const overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'background:rgba(0,0,0,0.8);z-index:9999;' +
        'display:flex;align-items:center;justify-content:center;';

      // Panel
      const panel = document.createElement('div');
      panel.style.cssText =
        'background:#1a2530;border-radius:12px;padding:20px;' +
        'box-shadow:0 8px 32px rgba(0,0,0,0.7);user-select:none;';

      // Titel
      const title = document.createElement('div');
      title.textContent = '🖊️ LEDs malen';
      title.style.cssText = 'color:#fff;font-size:15px;font-weight:bold;margin-bottom:14px;text-align:center;';
      panel.appendChild(title);

      // Gitter-Container
      const CELL = 18, GAP = 2;
      const grid = document.createElement('div');
      grid.style.cssText =
        `display:grid;grid-template-columns:repeat(8,${CELL}px);` +
        `gap:${GAP}px;cursor:crosshair;background:#0d1f2d;` +
        `padding:4px;border-radius:6px;touch-action:none;`;

      const cells = [];
      let painting = null; // null | 'on' | 'off'

      function setCell(idx, on) {
        currentMask[idx] = on ? '1' : '0';
        cells[idx].style.background = on ? onColor : '#005566';
      }

      function cellIndexAt(e) {
        const t = e.target;
        return t && t.hasAttribute('data-idx') ? parseInt(t.getAttribute('data-idx'), 10) : -1;
      }

      for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.setAttribute('data-idx', i);
        cell.style.cssText =
          `width:${CELL}px;height:${CELL}px;border-radius:3px;` +
          `background:${currentMask[i] === '1' ? onColor : '#005566'};`;
        cells.push(cell);
        grid.appendChild(cell);
      }

      grid.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const idx = cellIndexAt(e);
        if (idx < 0) return;
        painting = currentMask[idx] === '1' ? 'off' : 'on';
        setCell(idx, painting === 'on');
      });
      grid.addEventListener('mousemove', (e) => {
        if (!painting) return;
        const idx = cellIndexAt(e);
        if (idx >= 0) setCell(idx, painting === 'on');
      });
      document.addEventListener('mouseup', () => { painting = null; }, { once: false });

      panel.appendChild(grid);

      // Schaltflächen
      const btnRow = document.createElement('div');
      btnRow.style.cssText = 'display:flex;gap:8px;margin-top:14px;justify-content:center;';

      const btnStyle =
        'padding:6px 14px;border:none;border-radius:6px;cursor:pointer;' +
        'font-size:13px;color:#fff;';

      const btnClear = document.createElement('button');
      btnClear.textContent = '🔳 Löschen';
      btnClear.style.cssText = btnStyle + 'background:#444;';
      btnClear.onclick = () => {
        for (let i = 0; i < 64; i++) setCell(i, false);
      };

      const btnFill = document.createElement('button');
      btnFill.textContent = '💡 Alles an';
      btnFill.style.cssText = btnStyle + 'background:#444;';
      btnFill.onclick = () => {
        for (let i = 0; i < 64; i++) setCell(i, true);
      };

      const btnDone = document.createElement('button');
      btnDone.textContent = '✓ Fertig';
      btnDone.style.cssText = btnStyle + 'background:#7B2D8B;';
      btnDone.onclick = () => {
        this.setValue(currentMask.join(''));
        this.renderCells_();
        document.body.removeChild(overlay);
      };

      btnRow.appendChild(btnClear);
      btnRow.appendChild(btnFill);
      btnRow.appendChild(btnDone);
      panel.appendChild(btnRow);

      overlay.appendChild(panel);

      // Klick auf Overlay außerhalb Panel = schließen
      overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay) {
          this.setValue(currentMask.join(''));
          this.renderCells_();
          document.body.removeChild(overlay);
        }
      });

      document.body.appendChild(overlay);
    }
  }

  Blockly.fieldRegistry.register('field_matrix8x8', FieldMatrix8x8);

  // ── FieldSymbolPicker ─────────────────────────────────────────────────────

  const SP = 3;          // px pro Zelle in der Vorschau
  const SP_TOTAL = 8 * SP + 2; // 26 px Breite
  const SP_H     = 8 * SP + 2; // 26 px Höhe
  const SP_ARR   = 12;         // Breite des Pfeils

  class FieldSymbolPicker extends Blockly.Field {
    constructor(value, validator, config) {
      super(value || DEFAULT_SYMBOL, validator, config);
      this.SERIALIZABLE = true;
      this.CURSOR = 'pointer';
      this.size_.width  = SP_TOTAL + SP_ARR;
      this.size_.height = SP_H;
    }

    static fromJson(options) {
      return new FieldSymbolPicker(options['value']);
    }

    initView() {
      // Hintergrund
      Blockly.utils.dom.createSvgElement('rect', {
        x: 0, y: 0, width: SP_TOTAL + SP_ARR, height: SP_H,
        fill: '#0d1f2d', rx: 3,
      }, this.fieldGroup_);

      // Vorschau-Zellen
      this.prevCells_ = [];
      for (let i = 0; i < 64; i++) {
        const r = Math.floor(i / 8);
        const c = i % 8;
        const rect = Blockly.utils.dom.createSvgElement('rect', {
          x: 1 + c * SP,
          y: 1 + r * SP,
          width: SP - 0.5,
          height: SP - 0.5,
          fill: '#005566',
          style: 'pointer-events:none',
        }, this.fieldGroup_);
        this.prevCells_.push(rect);
      }

      // Pfeil-Symbol
      const arrow = Blockly.utils.dom.createSvgElement('text', {
        x: SP_TOTAL + 2,
        y: SP_H * 0.68,
        style: 'font-size:9px;fill:#aaa;pointer-events:none',
      }, this.fieldGroup_);
      arrow.textContent = '▾';

      this.updateSize_();
      this.renderPreview_();
    }

    updateSize_() {
      this.size_.width  = SP_TOTAL + SP_ARR;
      this.size_.height = SP_H;
    }

    doValueUpdate_(newValue) {
      this.value_ = (newValue && SYMBOL_MASKS[newValue]) ? newValue : DEFAULT_SYMBOL;
      return this.value_;
    }

    render_() { this.renderPreview_(); }

    renderPreview_() {
      if (!this.prevCells_) return;
      const mask = SYMBOL_MASKS[this.value_] || DEFAULT_MASK;
      for (let i = 0; i < 64; i++) {
        if (this.prevCells_[i]) {
          this.prevCells_[i].setAttribute('fill', mask[i] === '1' ? '#FFFFFF' : '#005566');
        }
      }
    }

    showEditor_() {
      Blockly.DropDownDiv.clearContent();
      const content = Blockly.DropDownDiv.getContentDiv();
      content.style.cssText =
        'background:#1a2530;padding:8px;display:grid;' +
        'grid-template-columns:repeat(4,auto);gap:6px;';

      const currentKey = this.getValue();

      for (const [key, mask] of Object.entries(SYMBOL_MASKS)) {
        const btn = document.createElement('button');
        btn.title = SYMBOL_LABELS[key] || key;
        btn.style.cssText =
          'background:#005566;border:2px solid ' +
          (key === currentKey ? '#a855f7' : 'transparent') +
          ';border-radius:4px;padding:2px;cursor:pointer;line-height:0;';

        btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#a855f7'; });
        btn.addEventListener('mouseleave', () => {
          btn.style.borderColor = key === this.getValue() ? '#a855f7' : 'transparent';
        });
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.setValue(key);
          Blockly.DropDownDiv.hideWithoutAnimation();
        });

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', 32);
        svg.setAttribute('height', 32);
        const C = 3.5;
        for (let i = 0; i < 64; i++) {
          const rr = Math.floor(i / 8), cc = i % 8;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x',      cc * C + 0.5);
          rect.setAttribute('y',      rr * C + 0.5);
          rect.setAttribute('width',  C - 0.5);
          rect.setAttribute('height', C - 0.5);
          rect.setAttribute('fill',   mask[i] === '1' ? '#FFFFFF' : '#006070');
          rect.style.pointerEvents = 'none';
          svg.appendChild(rect);
        }
        btn.appendChild(svg);
        content.appendChild(btn);
      }

      Blockly.DropDownDiv.setColour('#1a2530', '#3e5a6e');
      Blockly.DropDownDiv.showPositionedByField(this, () => {});
    }
  }

  Blockly.fieldRegistry.register('field_symbolpicker', FieldSymbolPicker);

  // ── Servo-Dropdown-Optionen ───────────────────────────────────────────────
  function matrixServoOptions() {
    return Object.entries(BOARD.servos).map(([k, v]) => [`${k} (${v})`, k]);
  }

  // ── Block-Definitionen ────────────────────────────────────────────────────

  Blockly.Blocks['matrix_on'] = {
    init() {
      this.appendDummyInput()
          .appendField('💡 Matrix anschalten  Port:')
          .appendField(new Blockly.FieldDropdown(matrixServoOptions), 'SERVO')
          .appendField('  Farbe:')
          .appendField(new Blockly.FieldColour(DEFAULT_COLOR), 'COLOR');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip('Schaltet alle 64 LEDs der 8×8 Matrix in einer Farbe an');
    },
  };

  Blockly.Blocks['matrix_off'] = {
    init() {
      this.appendDummyInput()
          .appendField('🔳 Matrix ausschalten  Port:')
          .appendField(new Blockly.FieldDropdown(matrixServoOptions), 'SERVO');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip('Schaltet alle LEDs der Matrix aus');
    },
  };

  // Helligkeit: 0–100 %, wobei 100 % = brightness 0.3 (sicherer Maximalwert)
  Blockly.Blocks['matrix_brightness'] = {
    init() {
      this.appendDummyInput()
          .appendField('☀️ Helligkeit  Port:')
          .appendField(new Blockly.FieldDropdown(matrixServoOptions), 'SERVO')
          .appendField('  ')
          .appendField(new Blockly.FieldNumber(50, 0, 100, 1), 'PCT')
          .appendField('%');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip('Helligkeit in % (0 = aus, 100 % = max. 0,3 Brightness, sicherer Maximalwert)');
    },
  };

  Blockly.Blocks['matrix_symbol'] = {
    init() {
      this.appendDummyInput()
          .appendField('🔣 zeige Symbol  Port:')
          .appendField(new Blockly.FieldDropdown(matrixServoOptions), 'SERVO')
          .appendField('  ')
          .appendField(new FieldSymbolPicker(DEFAULT_SYMBOL), 'SYMBOL')
          .appendField('  Farbe:')
          .appendField(new Blockly.FieldColour(DEFAULT_COLOR), 'COLOR');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip('Zeigt ein vordefiniertes Symbol auf der Matrix an');
    },
  };

  Blockly.Blocks['matrix_draw'] = {
    init() {
      this.appendDummyInput()
          .appendField('🖊️ zeige LEDs  Port:')
          .appendField(new Blockly.FieldDropdown(matrixServoOptions), 'SERVO')
          .appendField('  Farbe:')
          .appendField(new Blockly.FieldColour(DEFAULT_COLOR), 'COLOR');
      this.appendDummyInput()
          .appendField(new FieldMatrix8x8(DEFAULT_MASK), 'PIXELS');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip('Klicke auf die Vorschau, um den Editor zu öffnen und Pixel zu malen');
    },
  };

  // ── Toolbox ───────────────────────────────────────────────────────────────
  window.MATRIX_TOOLBOX = [{
    kind: 'category',
    name: 'Matrix',
    colour: MATRIX_COLOR,
    contents: [
      { kind: 'block', type: 'matrix_on' },
      { kind: 'block', type: 'matrix_off' },
      { kind: 'block', type: 'matrix_brightness' },
      { kind: 'sep' },
      { kind: 'block', type: 'matrix_symbol' },
      { kind: 'block', type: 'matrix_draw' },
    ],
  }];

})();
