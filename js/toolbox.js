// toolbox.js – Statische Toolbox-Kategorien (Steuerung, Mathematik, Text, Logik, Variablen)
// Hardware-Kategorien (Sensoren, Aktoren, Motor, NeoPixel) kommen aus block_builder.js

const TOOLBOX_STATIC_CONTENTS = [
  {
    kind: 'category',
    name: 'Steuerung',
    colour: '#A57BC3',
    contents: [
      { kind: 'block', type: 'control_wait',
        inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      { kind: 'block', type: 'control_print' },
      { kind: 'sep' },
      { kind: 'block', type: 'controls_if' },
      { kind: 'block', type: 'controls_repeat_ext',
        inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
      { kind: 'block', type: 'controls_whileUntil' },
    ]
  },
  { kind: 'sep' },
  {
    kind: 'category',
    name: 'Ereignisse',
    colour: '#F39A1B',
    contents: [
      { kind: 'block', type: 'loop_parallel' },
      { kind: 'sep' },
      { kind: 'block', type: 'when_button' },
      { kind: 'block', type: 'when_obstacle' },
      { kind: 'block', type: 'when_line' },
      { kind: 'block', type: 'when_tilt' },
      { kind: 'block', type: 'when_magnetic' },
      { kind: 'block', type: 'when_flame' },
      { kind: 'block', type: 'when_sound' },
      { kind: 'block', type: 'when_touch' },
      { kind: 'block', type: 'when_vibration' },
      { kind: 'sep' },
      { kind: 'block', type: 'when_distance',
        inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 20 } } } } },
      { kind: 'block', type: 'when_light',
        inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 50 } } } } },
      { kind: 'block', type: 'when_temperature',
        inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 25 } } } } },
    ]
  },
  { kind: 'sep' },
  {
    kind: 'category',
    name: 'Mathematik',
    colour: '#2563EB',
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
    ]
  },
  {
    kind: 'category',
    name: 'Text',
    colour: '#4AB8A6',
    contents: [
      { kind: 'block', type: 'text' },
      { kind: 'block', type: 'text_join' },
      { kind: 'block', type: 'text_length' },
    ]
  },
  {
    kind: 'category',
    name: 'Logik',
    colour: '#4FBFE8',
    contents: [
      { kind: 'block', type: 'logic_compare' },
      { kind: 'block', type: 'logic_operation' },
      { kind: 'block', type: 'logic_negate' },
      { kind: 'block', type: 'logic_boolean' },
    ]
  },
  {
    kind: 'category',
    name: 'Variablen',
    colour: '#E8C534',
    custom: 'VARIABLE',
  },
];

// Baut die vollständige Toolbox: KI-Blöcke + Hardware-Kategorien + statische
function buildFinalToolbox() {
  return {
    kind: 'categoryToolbox',
    contents: [
      ...(window.AI_BLOCKS_TOOLBOX  || []),
      ...(window.BLOCKS_DB_TOOLBOX  || []),
      ...TOOLBOX_STATIC_CONTENTS,
    ]
  };
}
