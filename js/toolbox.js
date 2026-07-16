// toolbox.js – Statische Toolbox-Kategorien + buildFinalToolbox()
// Hardware-Kategorien (Sensoren, Aktionen, Lichter, Anzeigen) kommen aus block_builder.js

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
  if (lichter && matrixContents.length) {
    lichter.contents.push({ kind: 'label', text: '── 8×8 Matrix ──' });
    lichter.contents.push(...matrixContents);
  }

  return {
    kind: 'categoryToolbox',
    contents: [
      ...(window.AI_BLOCKS_TOOLBOX || []),
      ...TOOLBOX_STATIC_CONTENTS,
      { kind: 'sep' },
      ...hwCats,
    ]
  };
}
