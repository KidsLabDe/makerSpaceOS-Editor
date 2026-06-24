// blocks/matrix.js – 8x8 NeoPixel-Matrix-Blöcke (Servo-Port S1–S4)
// Custom Blockly-Felder: FieldMatrix8x8 (Pixel malen) + FieldSymbolPicker (Symbole)

(function () {
  'use strict';

  // ── 8x8 Symboldefinitionen (Zeile für Zeile, 0=aus 1=an) ──────────────────

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

  // Konvertiert eine 8x8 Array in eine 64-Zeichen '0'/'1'-Maske
  function gridToMask(grid) {
    return grid.map(row => row.map(v => v ? '1' : '0').join('')).join('');
  }

  // Vorberechnete Masken (öffentlich, für generator.js)
  const SYMBOL_MASKS = {};
  for (const [key, grid] of Object.entries(SYMBOLS)) {
    SYMBOL_MASKS[key] = gridToMask(grid);
  }
  window.MATRIX_SYMBOL_MASKS  = SYMBOL_MASKS;
  window.MATRIX_SYMBOL_KEYS   = Object.keys(SYMBOLS);

  const DEFAULT_MASK   = '0'.repeat(64);
  const DEFAULT_SYMBOL = 'herz';
  const DEFAULT_COLOR  = '#ff0000';
  const MATRIX_COLOR   = '#7B2D8B';
  const CELL           = 8;   // px pro Zelle
  const GAP            = 1;   // px Abstand
  const GRID_PX        = 8 * CELL + 7 * GAP;  // 71 px
  const FIELD_PAD      = 3;

  // ── FieldMatrix8x8 ────────────────────────────────────────────────────────
  // Inline 8x8 Gitter im Block; Klick auf Zelle = umschalten

  class FieldMatrix8x8 extends Blockly.Field {
    constructor(value, validator, config) {
      super(value || DEFAULT_MASK, validator, config);
      this.SERIALIZABLE = true;
      this.CURSOR = 'default';
    }

    static fromJson(options) {
      return new FieldMatrix8x8(options['value']);
    }

    initView() {
      this.gridGroup_ = Blockly.utils.dom.createSvgElement(
        'g', {}, this.fieldGroup_);
      this.cellRects_ = [];

      for (let i = 0; i < 64; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const rect = Blockly.utils.dom.createSvgElement(
          'rect',
          {
            x: FIELD_PAD + col * (CELL + GAP),
            y: FIELD_PAD + row * (CELL + GAP),
            width: CELL,
            height: CELL,
            fill: '#005566',
            rx: 1.5,
          },
          this.gridGroup_,
        );
        rect.setAttribute('data-idx', i);
        rect.style.cursor = 'pointer';

        rect.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
          const val = Array.from(this.getValue() || DEFAULT_MASK);
          val[idx] = val[idx] === '1' ? '0' : '1';
          this.setValue(val.join(''));
        });

        this.cellRects_.push(rect);
      }

      this.updateSize_();
      this.renderCells_();
    }

    updateSize_() {
      this.size_.width  = GRID_PX + 2 * FIELD_PAD;
      this.size_.height = GRID_PX + 2 * FIELD_PAD;
    }

    doValueUpdate_(newValue) {
      if (typeof newValue === 'string' && newValue.length === 64 && /^[01]+$/.test(newValue)) {
        this.value_ = newValue;
      } else {
        this.value_ = DEFAULT_MASK;
      }
      return this.value_;
    }

    render_() {
      this.renderCells_();
    }

    renderCells_() {
      if (!this.cellRects_) return;
      const mask = this.value_ || DEFAULT_MASK;
      for (let i = 0; i < 64; i++) {
        if (this.cellRects_[i]) {
          this.cellRects_[i].setAttribute('fill', mask[i] === '1' ? '#FFFFFF' : '#005566');
        }
      }
    }

    // Kein Popup-Editor – Zellen werden direkt per Klick umgeschaltet
    showEditor_() {}
  }

  Blockly.fieldRegistry.register('field_matrix8x8', FieldMatrix8x8);

  // ── FieldSymbolPicker ─────────────────────────────────────────────────────
  // Zeigt eine Miniaturvorschau des gewählten Symbols;
  // Klick öffnet ein Raster mit allen vordefinierten Symbolen

  const PREV_CELL = 3;   // px pro Zelle in der Vorschau
  const PREV_PX   = 8 * PREV_CELL; // 24 px
  const ARROW_W   = 12;

  class FieldSymbolPicker extends Blockly.Field {
    constructor(value, validator, config) {
      super(value || DEFAULT_SYMBOL, validator, config);
      this.SERIALIZABLE = true;
      this.CURSOR = 'pointer';
    }

    static fromJson(options) {
      return new FieldSymbolPicker(options['value']);
    }

    initView() {
      // Hintergrund-Rect
      this.bgRect_ = Blockly.utils.dom.createSvgElement(
        'rect',
        { x: 0, y: 0, width: PREV_PX + ARROW_W, height: PREV_PX,
          fill: '#005566', rx: 3 },
        this.fieldGroup_,
      );

      // 8x8 Vorschau-Zellen
      this.prevCells_ = [];
      for (let i = 0; i < 64; i++) {
        const r = Math.floor(i / 8);
        const c = i % 8;
        const rect = Blockly.utils.dom.createSvgElement(
          'rect',
          {
            x: c * PREV_CELL,
            y: r * PREV_CELL,
            width: PREV_CELL - 0.5,
            height: PREV_CELL - 0.5,
            fill: '#006070',
          },
          this.fieldGroup_,
        );
        rect.style.pointerEvents = 'none';
        this.prevCells_.push(rect);
      }

      // Dropdown-Pfeil
      const arrow = Blockly.utils.dom.createSvgElement(
        'text',
        { x: PREV_PX + 2, y: PREV_PX * 0.65, style: 'font-size:9px; fill:#fff' },
        this.fieldGroup_,
      );
      arrow.textContent = '▾';
      arrow.style.pointerEvents = 'none';

      this.updateSize_();
      this.renderPreview_();
    }

    updateSize_() {
      this.size_.width  = PREV_PX + ARROW_W;
      this.size_.height = PREV_PX;
    }

    doValueUpdate_(newValue) {
      this.value_ = (newValue && SYMBOL_MASKS[newValue]) ? newValue : DEFAULT_SYMBOL;
      return this.value_;
    }

    render_() {
      this.renderPreview_();
    }

    renderPreview_() {
      if (!this.prevCells_) return;
      const mask = SYMBOL_MASKS[this.value_] || DEFAULT_MASK;
      for (let i = 0; i < 64; i++) {
        if (this.prevCells_[i]) {
          this.prevCells_[i].setAttribute('fill', mask[i] === '1' ? '#FFFFFF' : '#006070');
        }
      }
    }

    showEditor_() {
      Blockly.DropDownDiv.clearContent();
      const content = Blockly.DropDownDiv.getContentDiv();

      content.style.cssText =
        'background:#1a2530; padding:8px; display:grid; ' +
        'grid-template-columns:repeat(4,auto); gap:6px;';

      const currentKey = this.getValue();

      for (const [key, mask] of Object.entries(SYMBOL_MASKS)) {
        const btn = document.createElement('button');
        btn.title = SYMBOL_LABELS[key] || key;
        btn.style.cssText =
          'background:#005566; border:2px solid ' +
          (key === currentKey ? '#a855f7' : 'transparent') +
          '; border-radius:4px; padding:2px; cursor:pointer; line-height:0;';

        btn.addEventListener('mouseenter', () => {
          btn.style.borderColor = '#a855f7';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.borderColor = key === this.getValue() ? '#a855f7' : 'transparent';
        });
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.setValue(key);
          Blockly.DropDownDiv.hideWithoutAnimation();
        });

        // Symbol-Vorschau als SVG (32 × 32)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', 32);
        svg.setAttribute('height', 32);
        const C = 3.5;
        for (let i = 0; i < 64; i++) {
          const rr = Math.floor(i / 8);
          const cc = i % 8;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', cc * C + 0.5);
          rect.setAttribute('y', rr * C + 0.5);
          rect.setAttribute('width', C - 0.5);
          rect.setAttribute('height', C - 0.5);
          rect.setAttribute('fill', mask[i] === '1' ? '#FFFFFF' : '#006070');
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

  // ── Hilfsfunktion: Servo-Dropdown-Optionen ────────────────────────────────
  function matrixServoOptions() {
    return Object.entries(BOARD.servos).map(([k, v]) => [`${k} (${v})`, k]);
  }

  // ── Block-Definitionen ────────────────────────────────────────────────────

  // 1. Matrix anschalten – alle LEDs in einer Farbe
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

  // 2. Matrix ausschalten
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

  // 3. Helligkeit einstellen
  Blockly.Blocks['matrix_brightness'] = {
    init() {
      this.appendDummyInput()
          .appendField('☀️ Matrix Helligkeit  Port:')
          .appendField(new Blockly.FieldDropdown(matrixServoOptions), 'SERVO')
          .appendField('  ')
          .appendField(new Blockly.FieldNumber(0.2, 0, 1, 0.1), 'BRIGHTNESS');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(MATRIX_COLOR);
      this.setTooltip('Stellt die Helligkeit ein (0 = aus, 1 = max). Standard: 0,2');
    },
  };

  // 4. Zeige Symbol (vordefiniertes Muster)
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
      this.setTooltip('Zeigt ein vordefiniertes Symbol auf der Matrix an – Symbol und Farbe auswählen');
    },
  };

  // 5. Zeige LEDs – Pixel selbst malen
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
      this.setTooltip('Male ein eigenes Muster – klicke die Felder an, um LEDs ein- oder auszuschalten');
    },
  };

  // ── Toolbox-Eintrag ───────────────────────────────────────────────────────
  window.MATRIX_TOOLBOX = [{
    kind: 'category',
    name: '🟣 Matrix',
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
