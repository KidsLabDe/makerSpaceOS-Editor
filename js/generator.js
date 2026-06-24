// generator.js – CircuitPython Code-Generator

Blockly.Python.INDENT = '    ';

// Modul-globale Sammel-Variablen (reset vor jeder Generierung)
var _defs      = Object.create(null);  // imports + initialisierungen (var = global für block_builder.js)
var _setupCode = '';                   // Code aus dem SETUP-Block (Prolog in beim_start)
var _tasks     = [];                   // Task-Deskriptoren {kind, name, body, expr?, poll?} → je ein Handler

// Top-Level-Ereignis-Blöcke (Hut-Stapel) → je eine kantengetriggerte async-Aufgabe
var _HAT_TYPES = [
  'when_button', 'when_distance', 'when_light', 'when_temperature',
  'when_obstacle', 'when_line', 'when_tilt', 'when_magnetic',
  'when_flame', 'when_sound', 'when_touch', 'when_vibration'
];

Blockly.Python.workspaceToCode = function(workspace) {
  _defs      = Object.create(null);
  _setupCode = '';
  _tasks     = [];

  // init für Blockly-interne Variablen (nameDB_ etc.)
  try { Blockly.Python.init(workspace); } catch(_) {}

  // SETUP läuft einmal als Prolog in _main() – schwebende Blöcke werden ignoriert
  const setupBlock = workspace.getBlocksByType('control_setup', false)[0];
  if (setupBlock) Blockly.Python['control_setup'].call(Blockly.Python, setupBlock);

  // Jeder Schleifen-Stapel → ein Handler, der per immer(...) endlos läuft.
  for (const b of workspace.getBlocksByType('control_forever', false)) {
    const body = Blockly.Python.statementToCode(b, 'DO') || '    pass\n';
    _tasks.push({ kind: 'loop', name: 'fuer_immer', body });
  }
  const parallel = workspace.getBlocksByType('loop_parallel', false);
  parallel.forEach((b, i) => {
    const body = Blockly.Python.statementToCode(b, 'DO') || '    pass\n';
    _tasks.push({ kind: 'loop', name: parallel.length > 1 ? `parallel_${i + 1}` : 'parallel', body });
  });

  // Jeder Ereignis-Hut-Block → eine kantengetriggerte Aufgabe
  for (const t of _HAT_TYPES)
    for (const b of workspace.getBlocksByType(t, false))
      _tasks.push(Blockly.Python[t].call(Blockly.Python, b));

  return Blockly.Python.finish();
};

// Hilfsfunktion: Hex → CircuitPython RGB-Tuple
function hexToRgbTuple(hex) {
  return `(${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)})`;
}

// Jede nicht-leere Zeile um `levels` zusätzliche Ebenen (je 4 Spaces) einrücken
function _indent(code, levels) {
  const pad = Blockly.Python.INDENT.repeat(levels);
  return code.split('\n').map(l => l.length ? pad + l : l).join('\n');
}

// Eine Einrückungsebene entfernen (für Setup-only-Programme ohne async-Hülle)
function _dedent(code) {
  const pad = Blockly.Python.INDENT;
  return code.split('\n').map(l => l.startsWith(pad) ? l.slice(pad.length) : l).join('\n');
}

// Ereignis-Deskriptor: Bedingung (für wenn(lambda: ...)) + Handler-Body + Poll-Abstand.
// Die Polling-/Flankenlogik selbst liegt in der makerspaceos-Laufzeit (wenn()).
function _whenTask(name, activeExpr, body, poll) {
  return { kind: 'event', name, expr: activeExpr, body, poll };
}

// finish(): erzeugt den finalen formatierten Code
Blockly.Python.finish = function() {
  // makerspaceos-Laufzeit, sobald es Aufgaben gibt oder der Setup-Code selbst await nutzt
  const hasSetup = !!_setupCode.trim();
  const hasAsync = _tasks.length > 0 || /\bawait\b/.test(_setupCode);
  // Die Handler-Bodies nutzen await asyncio.sleep(...) (Warte/Buzzer/Blink) →
  // asyncio muss im generierten Code importiert sein (makerspaceos importiert es
  // nur für sich selbst, nicht in den Namespace des Programms).
  if (hasAsync) _defs['import_asyncio'] = 'import asyncio';

  const imports = [];
  const inits   = [];
  for (const key of Object.keys(_defs).sort()) {
    const val = _defs[key];
    if (val.startsWith('import ') || val.startsWith('from ')) imports.push(val);
    else inits.push(val);
  }

  let result = '# === makerSpaceOS – Generierter Code ===\n';
  if (hasAsync) result += 'from makerspaceos import immer, wenn, start\n';
  if (imports.length) result += imports.join('\n') + '\n';
  if (inits.length)   result += '\n# --- Initialisierungen ---\n' + inits.join('\n') + '\n';

  if (hasAsync) {
    // Eindeutige Handler-Namen vergeben (gleiche Block-Typen → Suffix _2, _3 …)
    const used = Object.create(null);
    const unique = (base) => {
      let n = base, i = 2;
      while (used[n]) n = `${base}_${i++}`;
      used[n] = true;
      return n;
    };
    if (hasSetup) used['beim_start'] = true;
    _tasks.forEach(t => { t.fn = unique(t.name); });

    // --- Handler-Funktionen (das eigentliche Programm) ---
    result += '\n# --- Dein Programm ---\n';
    if (hasSetup) result += 'async def beim_start():\n' + _setupCode + '\n';  // bereits 1 Ebene eingerückt
    _tasks.forEach(t => {
      // body kommt aus statementToCode → bereits 1 Ebene eingerückt
      result += `async def ${t.fn}():\n${t.body}\n`;
    });

    // --- Registrierung + Start ---
    result += '# --- Start ---\n';
    _tasks.forEach(t => {
      if (t.kind === 'loop') {
        result += `immer(${t.fn})\n`;
      } else {
        const poll = (t.poll && String(t.poll) !== '0.02') ? `, ${t.poll}` : '';
        result += `wenn(lambda: ${t.expr}, ${t.fn}${poll})\n`;
      }
    });
    result += `start(${hasSetup ? 'beim_start' : ''})\n`;
  } else if (hasSetup) {
    // Keine Aufgaben, kein await: Setup einmalig auf Modulebene ausführen
    result += '\n# --- Setup (einmalig) ---\n' + _dedent(_setupCode);
  }
  return result;
};

// ── Pflicht-Startblöcke ───────────────────────────────────────────────────────

Blockly.Python['control_setup'] = function(block) {
  // Code landet in _setupCode (Prolog in _main), nicht in einer Aufgabe
  _setupCode = Blockly.Python.statementToCode(block, 'DO');
  return '';
};

Blockly.Python['control_forever'] = function(block) {
  // Wird in workspaceToCode direkt via statementToCode verarbeitet; hier nur
  // als Fallback, falls die Funktion anderweitig aufgerufen wird.
  return Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
};

// ── Steuerung ────────────────────────────────────────────────────────────────

Blockly.Python['control_wait'] = function(block) {
  const secs = Blockly.Python.valueToCode(block, 'SECONDS', Blockly.Python.ORDER_NONE) || '1';
  return `await asyncio.sleep(${secs})\n`;
};

Blockly.Python['control_print'] = function(block) {
  const val = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '""';
  return `print(${val})\n`;
};

// ── Sensor-Wert-Blöcke ────────────────────────────────────────────────────────

Blockly.Python['sensor_dht_temperature'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']     = 'import board';
  _defs['import_dht']       = 'import adafruit_dht';
  _defs[`init_dht_${pin}`]  = `_dht_${pin} = adafruit_dht.DHT22(board.${pin})`;
  return [`_dht_${pin}.temperature`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['sensor_dht_humidity'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']     = 'import board';
  _defs['import_dht']       = 'import adafruit_dht';
  _defs[`init_dht_${pin}`]  = `_dht_${pin} = adafruit_dht.DHT22(board.${pin})`;
  return [`_dht_${pin}.humidity`, Blockly.Python.ORDER_MEMBER];
};

// Grove-Ultraschall-Ranger: nutzt lib/grove_ultrasonic.py (nach CIRCUITPY/lib/ kopieren).
function _groveSonarDef(sig) {
  _defs['import_board']             = 'import board';
  _defs['from_grove_ultrasonic']    = 'from grove_ultrasonic import GroveUltrasonic';
  _defs[`init_sonar_${sig}`]        = `_sonar_${sig} = GroveUltrasonic(board.${sig})`;
}

Blockly.Python['sensor_ultrasonic'] = function(block) {
  const sig = block.getFieldValue('SIG');
  _groveSonarDef(sig);
  return [`_sonar_${sig}.distance`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['sensor_ldr'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_ldr_${pin}`] = `_ldr_${pin} = analogio.AnalogIn(board.${pin})`;
  // Normiert auf 0–100 %
  return [`round(_ldr_${pin}.value / 65535 * 100)`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_button'] = function(block) {
  const btn = block.getFieldValue('BTN');
  const pin = BOARD.buttons[btn];
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_btn_${btn}`]  =
    `_btn_${btn} = digitalio.DigitalInOut(board.${pin})\n` +
    `_btn_${btn}.switch_to_input(pull=digitalio.Pull.UP)`;
  return [`(not _btn_${btn}.value)`, Blockly.Python.ORDER_NONE];
};

// ── Ereignis-Blöcke ───────────────────────────────────────────────────────────

Blockly.Python['event_temperature'] = function(block) {
  const pin = block.getFieldValue('PIN');
  const op  = block.getFieldValue('OP');
  const val = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '25';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']     = 'import board';
  _defs['import_dht']       = 'import adafruit_dht';
  _defs[`init_dht_${pin}`]  = `_dht_${pin} = adafruit_dht.DHT22(board.${pin})`;
  return `if _dht_${pin}.temperature ${op} ${val}:\n${body}`;
};

Blockly.Python['event_ultrasonic'] = function(block) {
  const sig  = block.getFieldValue('SIG');
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '20';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _groveSonarDef(sig);
  return `if _sonar_${sig}.distance ${op} ${val}:\n${body}`;
};

Blockly.Python['event_ldr'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '50';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_ldr_${pin}`] = `_ldr_${pin} = analogio.AnalogIn(board.${pin})`;
  return `if round(_ldr_${pin}.value / 65535 * 100) ${op} ${val}:\n${body}`;
};

Blockly.Python['event_button'] = function(block) {
  const btn   = block.getFieldValue('BTN');
  const state = block.getFieldValue('STATE');
  const pin   = BOARD.buttons[btn];
  const body  = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_btn_${btn}`]  =
    `_btn_${btn} = digitalio.DigitalInOut(board.${pin})\n` +
    `_btn_${btn}.switch_to_input(pull=digitalio.Pull.UP)`;
  const condition = state === 'pressed'
    ? `not _btn_${btn}.value`
    : `_btn_${btn}.value`;
  return `if ${condition}:\n${body}`;
};

// ── Aktoren: LED ─────────────────────────────────────────────────────────────

Blockly.Python['actuator_led'] = function(block) {
  const pin   = block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_led_${pin}`]  =
    `_led_${pin} = digitalio.DigitalInOut(board.${pin})\n` +
    `_led_${pin}.direction = digitalio.Direction.OUTPUT`;
  return `_led_${pin}.value = ${state}\n`;
};

Blockly.Python['actuator_led_blink'] = function(block) {
  const pin   = block.getFieldValue('PIN');
  const times = Blockly.Python.valueToCode(block, 'TIMES', Blockly.Python.ORDER_NONE) || '3';
  const pause = Blockly.Python.valueToCode(block, 'PAUSE', Blockly.Python.ORDER_NONE) || '0.5';
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_led_${pin}`]  =
    `_led_${pin} = digitalio.DigitalInOut(board.${pin})\n` +
    `_led_${pin}.direction = digitalio.Direction.OUTPUT`;
  return (
    `for _i in range(${times}):\n` +
    `    _led_${pin}.value = True\n` +
    `    await asyncio.sleep(${pause})\n` +
    `    _led_${pin}.value = False\n` +
    `    await asyncio.sleep(${pause})\n`
  );
};

// ── Aktoren: Servo ────────────────────────────────────────────────────────────

Blockly.Python['actuator_servo'] = function(block) {
  const s     = block.getFieldValue('SERVO');
  const pinMap = { S1: BOARD.servos.S1, S2: BOARD.servos.S2,
                   S3: BOARD.servos.S3, S4: BOARD.servos.S4 };
  const pin   = pinMap[s];
  const angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_NONE) || '90';
  _defs['import_board']  = 'import board';
  _defs['import_pwmio']  = 'import pwmio';
  _defs['from_servo']    = 'from adafruit_motor import servo as _servo_mod';
  _defs[`init_srv_${s}`] =
    `_pwm_${s} = pwmio.PWMOut(board.${pin}, duty_cycle=2 ** 15, frequency=50)\n` +
    `_servo_${s} = _servo_mod.Servo(_pwm_${s})`;
  return `_servo_${s}.angle = ${angle}\n`;
};

// ── Aktoren: Buzzer ───────────────────────────────────────────────────────────

Blockly.Python['actuator_buzzer'] = function(block) {
  const pin  = BOARD.buzzer;
  const freq = Blockly.Python.valueToCode(block, 'FREQ',     Blockly.Python.ORDER_NONE) || '440';
  const dur  = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_NONE) || '0.5';
  _defs['import_board']  = 'import board';
  _defs['import_pwmio']  = 'import pwmio';
  _defs['init_buzzer']   =
    `_buzz = pwmio.PWMOut(board.${pin}, variable_frequency=True)\n_buzz.duty_cycle = 0`;
  return `_buzz.frequency = ${freq}\n_buzz.duty_cycle = 32768\nawait asyncio.sleep(${dur})\n_buzz.duty_cycle = 0\n`;
};

Blockly.Python['actuator_buzzer_off'] = function(_block) {
  _defs['import_board']  = 'import board';
  _defs['import_pwmio']  = 'import pwmio';
  _defs['init_buzzer']   =
    `_buzz = pwmio.PWMOut(board.${BOARD.buzzer}, variable_frequency=True)\n_buzz.duty_cycle = 0`;
  return `_buzz.duty_cycle = 0\n`;
};

// ── Aktoren: Motor ────────────────────────────────────────────────────────────

function _motorDefs(motorKey) {
  const pins = BOARD.motors[motorKey];
  _defs['import_board']         = 'import board';
  _defs['import_pwmio']         = 'import pwmio';
  _defs['from_motor']           = 'from adafruit_motor import motor as _motor_mod';
  _defs[`init_mot_${motorKey}`] =
    `_m${motorKey}a = pwmio.PWMOut(board.${pins.pinA}, frequency=50)\n` +
    `_m${motorKey}b = pwmio.PWMOut(board.${pins.pinB}, frequency=50)\n` +
    `_motor_${motorKey} = _motor_mod.DCMotor(_m${motorKey}a, _m${motorKey}b)`;
}

Blockly.Python['actuator_motor_forward'] = function(block) {
  const m     = block.getFieldValue('MOTOR');
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE) || '75';
  _motorDefs(m);
  return `_motor_${m}.throttle = ${speed} / 100\n`;
};

Blockly.Python['actuator_motor_backward'] = function(block) {
  const m     = block.getFieldValue('MOTOR');
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE) || '75';
  _motorDefs(m);
  return `_motor_${m}.throttle = -(${speed} / 100)\n`;
};

Blockly.Python['actuator_motor_stop'] = function(block) {
  const m = block.getFieldValue('MOTOR');
  _motorDefs(m);
  return `_motor_${m}.throttle = 0\n`;
};

// ── NeoPixel ──────────────────────────────────────────────────────────────────

function _neopixelDefs() {
  _defs['import_board']    = 'import board';
  _defs['import_neopixel'] = 'import neopixel';
  _defs['init_pixels']     =
    `_pixels = neopixel.NeoPixel(board.${BOARD.neopixel.pin}, ${BOARD.neopixel.count}, brightness=0.3, auto_write=False)`;
}

Blockly.Python['neopixel_set'] = function(block) {
  _neopixelDefs();
  return `_pixels[${parseInt(block.getFieldValue('INDEX'),10) - 1}] = ${hexToRgbTuple(block.getFieldValue('COLOR'))}\n_pixels.show()\n`;
};

Blockly.Python['neopixel_fill'] = function(block) {
  _neopixelDefs();
  return `_pixels.fill(${hexToRgbTuple(block.getFieldValue('COLOR'))})\n_pixels.show()\n`;
};

Blockly.Python['neopixel_off'] = function(_block) {
  _neopixelDefs();
  return `_pixels.fill((0, 0, 0))\n_pixels.show()\n`;
};

// Externer NeoPixel-Streifen am Grove-Port (Signal-Pin + Anzahl LEDs).
// Variablenname enthält den Pin → mehrere Streifen an verschiedenen Ports möglich.
function _neopixelExtDefs(pin, count) {
  _defs['import_board']    = 'import board';
  _defs['import_neopixel'] = 'import neopixel';
  _defs[`init_npx_${pin}`] =
    `_npx_${pin} = neopixel.NeoPixel(board.${pin}, ${count}, brightness=0.3, auto_write=False)`;
}

Blockly.Python['neopixel_ext_set'] = function(block) {
  const pin = block.getFieldValue('PORT');
  _neopixelExtDefs(pin, block.getFieldValue('COUNT'));
  const idx = parseInt(block.getFieldValue('INDEX'), 10) - 1;
  return `_npx_${pin}[${idx}] = ${hexToRgbTuple(block.getFieldValue('COLOR'))}\n_npx_${pin}.show()\n`;
};

Blockly.Python['neopixel_ext_fill'] = function(block) {
  const pin = block.getFieldValue('PORT');
  _neopixelExtDefs(pin, block.getFieldValue('COUNT'));
  return `_npx_${pin}.fill(${hexToRgbTuple(block.getFieldValue('COLOR'))})\n_npx_${pin}.show()\n`;
};

Blockly.Python['neopixel_ext_off'] = function(block) {
  const pin = block.getFieldValue('PORT');
  _neopixelExtDefs(pin, block.getFieldValue('COUNT'));
  return `_npx_${pin}.fill((0, 0, 0))\n_npx_${pin}.show()\n`;
};

// ── Hilfsfunktionen für neue Blöcke ──────────────────────────────────────────

function _digitalInDef(pin, varPrefix, pull) {
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_${varPrefix}_${pin}`] =
    `_${varPrefix}_${pin} = digitalio.DigitalInOut(board.${pin})\n` +
    `_${varPrefix}_${pin}.switch_to_input(pull=digitalio.Pull.${pull})`;
}

function _digitalOutDef(pin, varPrefix) {
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_${varPrefix}_${pin}`] =
    `_${varPrefix}_${pin} = digitalio.DigitalInOut(board.${pin})\n` +
    `_${varPrefix}_${pin}.direction = digitalio.Direction.OUTPUT`;
}

// ── Digital-Sensor-Generatoren ────────────────────────────────────────────────

Blockly.Python['sensor_obstacle'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'obstacle', 'DOWN');
  return [`(not _obstacle_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

Blockly.Python['sensor_line'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'line', 'DOWN');
  return [`_line_${pin}.value`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['sensor_tilt'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'tilt', 'DOWN');
  return [`(not _tilt_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

Blockly.Python['sensor_magnetic'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'mag', 'DOWN');
  return [`(not _mag_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

Blockly.Python['sensor_flame'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'flame', 'DOWN');
  return [`(not _flame_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

Blockly.Python['sensor_sound'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'sound', 'DOWN');
  return [`(not _sound_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

Blockly.Python['sensor_touch'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'touch', 'DOWN');
  return [`(not _touch_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

Blockly.Python['sensor_vibration'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'vib', 'DOWN');
  return [`(not _vib_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

// ── Analog-Sensor-Generatoren ─────────────────────────────────────────────────

Blockly.Python['sensor_analog_raw'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_analog_${pin}`] = `_analog_${pin} = analogio.AnalogIn(board.${pin})`;
  return [`round(_analog_${pin}.value / 65535 * 100)`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_ntc_temp'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs['import_math']     = 'import math';
  _defs[`init_ain_ntc_${pin}`] = `_ain_ntc_${pin} = analogio.AnalogIn(board.${pin})`;
  _defs[`fn_ntc_${pin}`] =
    `def _ntc_${pin}():\n` +
    `    _v = _ain_ntc_${pin}.value * 3.3 / 65535\n` +
    `    if _v <= 0 or _v >= 3.29: return 0\n` +
    `    _r = (_v / 3.3 * 10000) / (1 - _v / 3.3)\n` +
    `    return round(1 / (1 / 298.15 + 1 / 3950 * math.log(_r / 10000)) - 273.15, 1)`;
  return [`_ntc_${pin}()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_lux'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs['import_math']     = 'import math';
  _defs[`init_ain_lux_${pin}`] = `_ain_lux_${pin} = analogio.AnalogIn(board.${pin})`;
  _defs[`fn_lux_${pin}`] =
    `def _lux_${pin}():\n` +
    `    _u2 = _ain_lux_${pin}.value * 3.3 / 65535\n` +
    `    if _u2 <= 0: return 0\n` +
    `    _r1 = (5 * 10000) / _u2\n` +
    `    _i = (5 / _r1) * 1000000\n` +
    `    return round(math.log(_i) / 0.06, 1)`;
  return [`_lux_${pin}()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

// ── Joystick-Generatoren (KY-023) ─────────────────────────────────────────────

Blockly.Python['sensor_joystick_x'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_joy_x_${pin}`] = `_joy_x_${pin} = analogio.AnalogIn(board.${pin})`;
  return [`round(_joy_x_${pin}.value / 65535 * 100)`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_joystick_y'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_joy_y_${pin}`] = `_joy_y_${pin} = analogio.AnalogIn(board.${pin})`;
  return [`round(_joy_y_${pin}.value / 65535 * 100)`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_joystick_btn'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'joy_btn', 'UP');
  return [`(not _joy_btn_${pin}.value)`, Blockly.Python.ORDER_NONE];
};

// ── DHT11-Generatoren (KY-015) ────────────────────────────────────────────────

Blockly.Python['sensor_dht11_temperature'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board'] = 'import board';
  _defs['import_dht']   = 'import adafruit_dht';
  _defs[`init_dht11_${pin}`] = `_dht11_${pin} = adafruit_dht.DHT11(board.${pin})`;
  return [`_dht11_${pin}.temperature`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['sensor_dht11_humidity'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board'] = 'import board';
  _defs['import_dht']   = 'import adafruit_dht';
  _defs[`init_dht11_${pin}`] = `_dht11_${pin} = adafruit_dht.DHT11(board.${pin})`;
  return [`_dht11_${pin}.humidity`, Blockly.Python.ORDER_MEMBER];
};

// ── BMP280-Generatoren (KY-052) ───────────────────────────────────────────────

function _bmp280Defs(sda, scl) {
  _defs['import_board']  = 'import board';
  _defs['import_busio']  = 'import busio';
  _defs['import_bmp280'] = 'import adafruit_bmp280';
  // I2C und Sensor in einem Eintrag, damit die Reihenfolge garantiert ist
  _defs['init_bmp280'] =
    `_i2c_bmp = busio.I2C(board.${scl}, board.${sda})\n` +
    `_bmp280 = adafruit_bmp280.Adafruit_BMP280_I2C(_i2c_bmp)`;
}

Blockly.Python['sensor_bmp280_temp'] = function(block) {
  _bmp280Defs(block.getFieldValue('SDA'), block.getFieldValue('SCL'));
  return ['round(_bmp280.temperature, 1)', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_bmp280_pressure'] = function(block) {
  _bmp280Defs(block.getFieldValue('SDA'), block.getFieldValue('SCL'));
  return ['round(_bmp280.pressure, 1)', Blockly.Python.ORDER_FUNCTION_CALL];
};

// ── Drehgeber-Generator (KY-040) ──────────────────────────────────────────────

Blockly.Python['sensor_encoder'] = function(block) {
  const port = BOARD.grovePortById(block.getFieldValue('PORT'));
  const pinA = port.pin1;
  const pinB = port.signal;
  _defs['import_board']    = 'import board';
  _defs['import_rotaryio'] = 'import rotaryio';
  _defs[`init_enc_${pinA}_${pinB}`] =
    `_enc_${pinA}_${pinB} = rotaryio.IncrementalEncoder(board.${pinA}, board.${pinB})`;
  return [`_enc_${pinA}_${pinB}.position`, Blockly.Python.ORDER_MEMBER];
};

// ── Neue Ereignis-Generatoren ─────────────────────────────────────────────────

Blockly.Python['event_obstacle'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, 'obstacle', 'DOWN');
  return `if not _obstacle_${pin}.value:\n${body}`;
};

Blockly.Python['event_flame'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, 'flame', 'DOWN');
  return `if not _flame_${pin}.value:\n${body}`;
};

Blockly.Python['event_sound'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, 'sound', 'DOWN');
  return `if not _sound_${pin}.value:\n${body}`;
};

Blockly.Python['event_tilt'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, 'tilt', 'DOWN');
  return `if not _tilt_${pin}.value:\n${body}`;
};

Blockly.Python['event_magnetic'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, 'mag', 'DOWN');
  return `if not _mag_${pin}.value:\n${body}`;
};

Blockly.Python['event_line'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, 'line', 'DOWN');
  return `if _line_${pin}.value:\n${body}`;
};

// ── Neue Aktor-Generatoren ────────────────────────────────────────────────────

const _2C_COLORS = {
  red:    [true,  false],
  green:  [false, true ],
  yellow: [true,  true ],
  off:    [false, false],
};

Blockly.Python['actuator_2color_led'] = function(block) {
  const pinR  = block.getFieldValue('PIN_R');
  const pinG  = block.getFieldValue('PIN_G');
  const color = block.getFieldValue('COLOR');
  _digitalOutDef(pinR, 'tc_r');
  _digitalOutDef(pinG, 'tc_g');
  const [r, g] = _2C_COLORS[color];
  const py = v => v ? 'True' : 'False';
  return (
    `_tc_r_${pinR}.value = ${py(r)}\n` +
    `_tc_g_${pinG}.value = ${py(g)}\n`
  );
};

Blockly.Python['actuator_relay'] = function(block) {
  const pin   = block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  _digitalOutDef(pin, 'relay');
  return `_relay_${pin}.value = ${state}\n`;
};

Blockly.Python['actuator_active_buzzer'] = function(block) {
  const pin   = block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  _digitalOutDef(pin, 'abuzz');
  return `_abuzz_${pin}.value = ${state}\n`;
};

// ── Grove-LCD RGB Backlight (I2C) ─────────────────────────────────────────────
// Nutzt lib/grove_rgb_lcd.py. Hardcodiert auf V5 (SGM31323 @ 0x30, 3,3 V).
function _groveLcdDef(portId, rgbAddr) {
  const port = BOARD.grovePortById(portId);
  _defs['import_board'] = 'import board';
  _defs['import_busio'] = 'import busio';
  _defs['from_grove_rgb_lcd'] = 'from grove_rgb_lcd import GroveRgbLcd';
  // I2C + LCD-Objekt in einem Eintrag (Reihenfolge garantiert)
  _defs['init_grove_lcd'] =
    `_i2c_lcd = busio.I2C(board.${port.signal}, board.${port.pin1})\n` +
    `_lcd = GroveRgbLcd(_i2c_lcd, rgb_addr=${rgbAddr})`;
}

// Benannte Farben (rgb_color_dropdown) → RGB-Werte für die LCD-Beleuchtung
const _LCD_RGB = {
  red:    '255, 0, 0',   green: '0, 255, 0',   blue:   '0, 0, 255',
  yellow: '255, 255, 0', cyan:  '0, 255, 255', pink:   '255, 0, 255',
  white:  '255, 255, 255', off:  '0, 0, 0',
};

Blockly.Python['actuator_lcd'] = function(block) {
  const portId = block.getFieldValue('PORT');
  const colour = block.getFieldValue('COLOR') || 'white';
  const line1  = Blockly.Python.valueToCode(block, 'LINE1', Blockly.Python.ORDER_NONE) || '""';
  const line2  = Blockly.Python.valueToCode(block, 'LINE2', Blockly.Python.ORDER_NONE) || '""';
  _groveLcdDef(portId, '0x30');
  const rgb = _LCD_RGB[colour] || '255, 255, 255';
  return `_lcd.set_rgb(${rgb})\n_lcd.set_text((${line1})[:16] + "\\n" + (${line2})[:16])\n`;
};

// ── ISD1820 Sprachmodul ───────────────────────────────────────────────────────
// P-E ist flankengesteuert: kurzer HIGH-Puls → spielt Aufnahme einmal ab.
// REC: HIGH halten solange aufgenommen werden soll (max. 10 s).
// ISD1820: alle Steuerpins sind Active-LOW.
// Idle = HIGH, Trigger = fallende Flanke (HIGH→LOW→HIGH).
function _isd1820Init(portId) {
  const port = BOARD.grovePortById(portId);
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_isd_${portId}`] =
    `_isd_pe_${portId} = digitalio.DigitalInOut(board.${port.signal})\n` +
    `_isd_pe_${portId}.direction = digitalio.Direction.OUTPUT\n` +
    `_isd_pe_${portId}.value = True\n` +
    `_isd_rec_${portId} = digitalio.DigitalInOut(board.${port.pin1})\n` +
    `_isd_rec_${portId}.direction = digitalio.Direction.OUTPUT\n` +
    `_isd_rec_${portId}.value = True`;
}

Blockly.Python['actuator_isd1820'] = function(block) {
  const portId = block.getFieldValue('PORT');
  _isd1820Init(portId);
  return `_isd_pe_${portId}.value = False\nawait asyncio.sleep(0.1)\n_isd_pe_${portId}.value = True\n`;
};

Blockly.Python['actuator_isd1820_record'] = function(block) {
  const portId = block.getFieldValue('PORT');
  const dauer  = Blockly.Python.valueToCode(block, 'DAUER', Blockly.Python.ORDER_NONE) || '3';
  _isd1820Init(portId);
  return `_isd_rec_${portId}.value = False\nawait asyncio.sleep(min(${dauer}, 10))\n_isd_rec_${portId}.value = True\n`;
};

// ── Ereignis-Hut-Blöcke (je ein benannter Handler) ───────────────────────────
// Diese Generatoren geben einen Deskriptor {name, expr, body, poll} zurück;
// finish() baut daraus `async def <name>():` + `wenn(lambda: <expr>, <name>)`.

// Lesbare deutsche Handler-Namen je Sensor-Typ (Basis; wird bei Bedarf nummeriert)
const _WHEN_NAMES = {
  obstacle: 'wenn_hindernis', line: 'wenn_linie',     tilt:  'wenn_neigung',
  mag:      'wenn_magnet',    flame: 'wenn_flamme',    sound: 'wenn_geraeusch',
  touch:    'wenn_beruehrung', vib:  'wenn_vibration',
};

// Gemeinsamer Helfer für digitale Trigger-Sensoren
function _whenDigital(block, prefix, pull, activeLow) {
  const pin  = block.getFieldValue('PIN');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, prefix, pull);
  const expr = activeLow ? `(not _${prefix}_${pin}.value)` : `_${prefix}_${pin}.value`;
  return _whenTask(_WHEN_NAMES[prefix] || `wenn_${prefix}`, expr, body, '0.02');
}

Blockly.Python['when_button'] = function(block) {
  const btn   = block.getFieldValue('BTN');
  const state = block.getFieldValue('STATE');
  const pin   = BOARD.buttons[btn];
  const body  = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_btn_${btn}`]  =
    `_btn_${btn} = digitalio.DigitalInOut(board.${pin})\n` +
    `_btn_${btn}.switch_to_input(pull=digitalio.Pull.UP)`;
  const expr = state === 'pressed' ? `(not _btn_${btn}.value)` : `_btn_${btn}.value`;
  return _whenTask(`wenn_taster_${String(btn).toLowerCase()}`, expr, body, '0.02');
};

Blockly.Python['when_obstacle']  = function(b) { return _whenDigital(b, 'obstacle', 'DOWN', true);  };
Blockly.Python['when_line']      = function(b) { return _whenDigital(b, 'line',     'DOWN', false); };
Blockly.Python['when_tilt']      = function(b) { return _whenDigital(b, 'tilt',     'DOWN', true);  };
Blockly.Python['when_magnetic']  = function(b) { return _whenDigital(b, 'mag',      'DOWN', true);  };
Blockly.Python['when_flame']     = function(b) { return _whenDigital(b, 'flame',    'DOWN', true);  };
Blockly.Python['when_sound']     = function(b) { return _whenDigital(b, 'sound',    'DOWN', true);  };
Blockly.Python['when_touch']     = function(b) { return _whenDigital(b, 'touch',    'DOWN', true);  };
Blockly.Python['when_vibration'] = function(b) { return _whenDigital(b, 'vib',      'DOWN', true);  };

Blockly.Python['when_distance'] = function(block) {
  const sig  = block.getFieldValue('SIG');
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '20';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _groveSonarDef(sig);
  return _whenTask('wenn_abstand', `(_sonar_${sig}.distance ${op} ${val})`, body, '0.05');
};

Blockly.Python['when_light'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '50';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_ldr_${pin}`] = `_ldr_${pin} = analogio.AnalogIn(board.${pin})`;
  return _whenTask('wenn_licht', `(round(_ldr_${pin}.value / 65535 * 100) ${op} ${val})`, body, '0.05');
};

Blockly.Python['when_temperature'] = function(block) {
  const pin  = block.getFieldValue('PIN');
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '25';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board'] = 'import board';
  _defs['import_dht']   = 'import adafruit_dht';
  _defs[`init_dht_${pin}`] = `_dht_${pin} = adafruit_dht.DHT22(board.${pin})`;
  return _whenTask('wenn_temperatur', `(_dht_${pin}.temperature ${op} ${val})`, body, '1');
};
