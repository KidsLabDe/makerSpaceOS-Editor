// toolbox.js – Statische Toolbox-Kategorien + buildFinalToolbox()
// Hardware-Kategorien (Sensoren, Aktionen, Lichter, Anzeigen) kommen aus block_builder.js

// Ereignis-Hüte, die nur auf Boards mit bestimmter Onboard-Hardware passen
// (Gegenstück zu requiresBoardFeature in components/*.md).
const HAT_BOARD_FEATURES = {
  when_battery_low: 'powerMonitor',
  when_touch_pad:   'touchPins',
  when_shake:       'imu',
};

const TOOLBOX_STATIC_CONTENTS = [
  {
    kind: 'category',
    name: L('Steuerung', 'Control'),
    colour: '#7C3AED',
    contents: [
      { kind: 'block', type: 'control_wait',
        inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      { kind: 'block', type: 'control_print' },
      { kind: 'sep' },
      { kind: 'block', type: 'controls_repeat_ext',
        inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
      { kind: 'block', type: 'controls_whileUntil' },
    ]
  },
  { kind: 'sep' },
  {
    kind: 'category',
    name: L('Ereignisse', 'Events'),
    colour: '#D97706',
    contents: [
      { kind: 'block', type: 'loop_parallel' },
      { kind: 'sep' },
      { kind: 'block', type: 'when_button' },
      { kind: 'block', type: 'when_encoder' },
      { kind: 'block', type: 'when_sound' },
      { kind: 'block', type: 'when_touch' },
      { kind: 'block', type: 'when_motion' },
      { kind: 'block', type: 'when_battery_low' },
      { kind: 'block', type: 'when_touch_pad' },
      { kind: 'block', type: 'when_shake' },
      { kind: 'sep' },
      { kind: 'block', type: 'when_distance' },
      { kind: 'block', type: 'when_light' },
      { kind: 'block', type: 'when_temperature' },
      { kind: 'block', type: 'when_humidity' },
    ]
  },
  { kind: 'sep' },
  {
    kind: 'category',
    name: L('Logik', 'Logic'),
    colour: '#4FBFE8',
    contents: [
      { kind: 'label', text: L('── Bedingungen ──', '── Conditions ──') },
      { kind: 'block', type: 'controls_if' },
      { kind: 'block', type: 'controls_if', extraState: { hasElse: true } },
      { kind: 'block', type: 'control_wait_until' },
      { kind: 'block', type: 'control_while' },
      { kind: 'label', text: L('── Vergleichen ──', '── Compare ──') },
      { kind: 'block', type: 'logic_compare' },
      { kind: 'label', text: L('── Logik ──', '── Logic ──') },
      { kind: 'block', type: 'logic_operation' },
      { kind: 'block', type: 'logic_negate' },
      { kind: 'block', type: 'logic_boolean' },
    ]
  },
  {
    kind: 'category',
    name: L('Mathe', 'Math'),
    colour: '#16A34A',
    contents: [
      { kind: 'block', type: 'math_number' },
      { kind: 'block', type: 'math_arithmetic' },
      { kind: 'block', type: 'math_single' },
      { kind: 'block', type: 'math_constrain',
        inputs: {
          LOW:  { shadow: { type: 'math_number', fields: { NUM: 0 } } },
          HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } }
        }
      },
      { kind: 'block', type: 'math_random_int',
        inputs: {
          FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          TO:   { shadow: { type: 'math_number', fields: { NUM: 10 } } }
        }
      },
      { kind: 'block', type: 'logic_boolean' },
    ]
  },
  {
    kind: 'category',
    name: L('Variablen', 'Variables'),
    colour: '#CA8A04',
    custom: 'VARIABLE',
  },
  {
    kind: 'category',
    name: L('Listen', 'Lists'),
    colour: '#9333EA',
    contents: [
      { kind: 'block', type: 'lists_create_empty' },
      { kind: 'block', type: 'lists_create_with', extraState: { itemCount: 3 },
        inputs: {
          ADD0: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          ADD1: { shadow: { type: 'math_number', fields: { NUM: 2 } } },
          ADD2: { shadow: { type: 'math_number', fields: { NUM: 3 } } },
        }
      },
      { kind: 'block', type: 'list_append',
        inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
      { kind: 'block', type: 'list_get',
        inputs: { INDEX: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      { kind: 'block', type: 'list_set',
        inputs: {
          INDEX: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
        }
      },
      { kind: 'block', type: 'list_remove',
        inputs: { INDEX: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      { kind: 'block', type: 'lists_length' },
      { kind: 'block', type: 'lists_isEmpty' },
      { kind: 'block', type: 'controls_forEach' },
    ]
  },
  {
    kind: 'category',
    name: L('Text', 'Text'),
    colour: '#0891B2',
    contents: [
      { kind: 'block', type: 'text' },
      { kind: 'block', type: 'text_verbinden' },
      { kind: 'block', type: 'text_length' },
    ]
  },
];

// Baut die vollständige Toolbox: statische Kategorien + Hardware-Kategorien.
// Matrix-Blöcke (aus matrix.js) werden als Unterkategorie in "Lichter" gemergt.
function buildFinalToolbox() {
  // Hardware-Kategorien flach kopieren, Lichter-Contents duplizieren
  const hwCats = (window.BLOCKS_DB_TOOLBOX || []).map(cat => {
    if (cat.kind !== 'category') return cat;
    return { ...cat, contents: cat.contents ? [...cat.contents] : [] };
  });

  // Matrix-Inhalte an Lichter-Kategorie anhängen (board-abhängig ausblendbar)
  const lichter = hwCats.find(c => c.kind === 'category' && c.name === L('Lichter', 'Lights'));
  const hideIds = new Set(BOARD.hideBlockIds || []);
  const matrixContents = (window.MATRIX_TOOLBOX_CONTENTS || [])
    .filter(e => !(e.type && hideIds.has(e.type)));
  // Fest eingebaute 5×5-Matrix (matrix5.js) nur auf Boards mit BOARD.matrix5
  const matrix5Contents = BOARD.matrix5 ? (window.MATRIX5_TOOLBOX_CONTENTS || []) : [];
  if (lichter && matrix5Contents.length) {
    lichter.contents.push({ kind: 'label', text: L('── 5×5 Matrix (eingebaut) ──', '── 5×5 matrix (built-in) ──') });
    lichter.contents.push(...matrix5Contents);
  }
  if (lichter && matrixContents.length) {
    lichter.contents.push({ kind: 'label', text: '── 8×8 Matrix ──' });
    lichter.contents.push(...matrixContents);
  }

  // Board-spezifische Ereignis-Hüte nur zeigen, wenn das Profil das Feature hat.
  const staticCats = TOOLBOX_STATIC_CONTENTS.map(cat => {
    if (cat.kind !== 'category' || !cat.contents) return cat;
    return { ...cat, contents: cat.contents.filter(e =>
      !(e.type && (hideIds.has(e.type) ||
        (HAT_BOARD_FEATURES[e.type] && !BOARD[HAT_BOARD_FEATURES[e.type]])))) };
  });

  return {
    kind: 'categoryToolbox',
    contents: [
      ...(window.AI_BLOCKS_TOOLBOX || []),
      ...staticCats,
      { kind: 'sep' },
      ...hwCats,
    ]
  };
}
