// generator.js – CircuitPython Code-Generator

Blockly.Python.INDENT = '    ';

// Modul-globale Sammel-Variablen (reset vor jeder Generierung)
var _defs      = Object.create(null);  // imports + initialisierungen (var = global für block_builder.js)
var _setupCode = '';                   // Code aus dem SETUP-Block (Prolog in beim_start)
var _tasks     = [];                   // Task-Deskriptoren {kind, name, body, expr?, poll?} → je ein Handler

// Top-Level-Ereignis-Blöcke (Hut-Stapel) → je eine kantengetriggerte async-Aufgabe
var _HAT_TYPES = [
  'when_button', 'when_encoder',
  'when_distance', 'when_light', 'when_temperature', 'when_humidity',
  'when_sound', 'when_touch',
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
    for (const b of workspace.getBlocksByType(t, false)) {
      const task = Blockly.Python[t].call(Blockly.Python, b);
      if (task) _tasks.push(task);
    }

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
  const hasSetup = !!_setupCode.trim();
  const hasAsync = _tasks.length > 0 || /\bawait\b/.test(_setupCode);
  if (hasAsync) _defs['import_asyncio'] = 'import asyncio';

  const imports = [];
  const inits   = [];
  for (const key of Object.keys(_defs).sort()) {
    const val = _defs[key];
    if (val.startsWith('import ') || val.startsWith('from ')) imports.push(val);
    else inits.push(val);
  }

  // Alle Blockly-Variablen aus dem Workspace sammeln
  const ws = Blockly.getMainWorkspace();
  const allVarNames = ws ? ws.getAllVariables().map(v => v.name) : [];

  // Fügt 'global var1, var2' an den Anfang eines Funktionskörpers ein,
  // für alle Variablen die im Body vorkommen.
  // Nötig weil Python sonst eine neue lokale Variable anlegt statt die
  // Modul-Variable zu nutzen – was in anderen async-Funktionen zu NameError führt.
  function withGlobals(body) {
    if (!allVarNames.length) return body;
    const used = allVarNames.filter(v => new RegExp(`\\b${v}\\b`).test(body));
    if (!used.length) return body;
    return `    global ${used.join(', ')}\n` + body;
  }

  let result = '# === makerSpaceOS – Generierter Code ===\n';
  if (hasAsync) result += 'from makerspaceos import immer, wenn, start\n';
  if (imports.length) result += imports.join('\n') + '\n';
  if (inits.length)   result += '\n# --- Initialisierungen ---\n' + inits.join('\n') + '\n';

  // Variablen auf Modulebene vordeklarieren (None als Platzhalter),
  // damit sie in allen async-Funktionen per 'global' erreichbar sind.
  if (hasAsync && allVarNames.length) {
    result += '\n# --- Variablen ---\n' + allVarNames.map(v => `${v} = None`).join('\n') + '\n';
  }

  if (hasAsync) {
    const used = Object.create(null);
    const unique = (base) => {
      let n = base, i = 2;
      while (used[n]) n = `${base}_${i++}`;
      used[n] = true;
      return n;
    };
    if (hasSetup) used['beim_start'] = true;
    _tasks.forEach(t => { t.fn = unique(t.name); });

    result += '\n# --- Dein Programm ---\n';
    if (hasSetup) result += 'async def beim_start():\n' + withGlobals(_setupCode) + '\n';
    _tasks.forEach(t => {
      result += `async def ${t.fn}():\n${withGlobals(t.body)}\n`;
    });

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
    result += '\n# --- Setup (einmalig) ---\n' + _dedent(_setupCode);
  }
  return result;
};

// Blockly's Python-Generator nutzt 'Number' (JavaScript-Typ) statt (int, float).
// Wird für den "Ändere X um Y"-Block benötigt.
Blockly.Python['math_change'] = function(block) {
  let varName;
  try {
    varName = Blockly.Python.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  } catch(_) {
    varName = block.getFieldValue('VAR');
  }
  const delta = Blockly.Python.valueToCode(block, 'DELTA', Blockly.Python.ORDER_ADDITIVE) || '0';
  return `${varName} = (${varName} if isinstance(${varName}, (int, float)) else 0) + ${delta}\n`;
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
  return [`round((1 - _ldr_${pin}.value / 65535) * 100)`, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Gemeinsamer Helfer: B1/B2 (Onboard) oder externer Grove-Pin
function _tasterDef(val) {
  const pin     = (val === 'B1' || val === 'B2') ? BOARD.buttons[val] : val;
  const varName = `_taster_${val}`;
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_taster_${val}`] =
    `${varName} = digitalio.DigitalInOut(board.${pin})\n` +
    `${varName}.switch_to_input(pull=digitalio.Pull.UP)`;
  return varName;
}

Blockly.Python['sensor_taster'] = function(block) {
  const val     = block.getFieldValue('BTN');
  const varName = _tasterDef(val);
  return [`(not ${varName}.value)`, Blockly.Python.ORDER_NONE];
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
  const val     = block.getFieldValue('BTN');
  const state   = block.getFieldValue('STATE');
  const varName = _tasterDef(val);
  const body    = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  const condition = state === 'pressed' ? `not ${varName}.value` : `${varName}.value`;
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

// ── Generische Pin-Blöcke ─────────────────────────────────────────────────────

Blockly.Python['digital_read'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _digitalInDef(pin, 'din', 'UP');
  return [`_din_${pin}.value`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['digital_write'] = function(block) {
  const pin   = block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  _digitalOutDef(pin, 'dout');
  return `_dout_${pin}.value = ${state}\n`;
};

Blockly.Python['analog_read'] = function(block) {
  const pin = block.getFieldValue('PIN');
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_ain_${pin}`] = `_ain_${pin} = analogio.AnalogIn(board.${pin})`;
  return [`round(_ain_${pin}.value / 65535 * 100)`, Blockly.Python.ORDER_FUNCTION_CALL];
};

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

// ── Aktor-Generatoren ────────────────────────────────────────────────────────

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

Blockly.Python['actuator_lcd'] = function(block) {
  const portId = block.getFieldValue('PORT');
  const colour = block.getFieldValue('COLOR') || '#FFFFFF';
  const line1  = Blockly.Python.valueToCode(block, 'LINE1', Blockly.Python.ORDER_NONE) || '""';
  const line2  = Blockly.Python.valueToCode(block, 'LINE2', Blockly.Python.ORDER_NONE) || '""';
  _groveLcdDef(portId, '0x30');
  const rgb = hexToRgbTuple(colour).slice(1, -1); // "(r, g, b)" → "r, g, b"
  return `_lcd.set_rgb(${rgb})\n_lcd.set_text((${line1})[:16] + "\\n" + (${line2})[:16])\n`;
};

// ── TM1637 4-stelliges 7-Segment-Display ─────────────────────────────────────
// CLK = Grove pin1, DIO = Grove signal
// Lib: adafruit_tm1637 (Adafruit CircuitPython Bundle)

function _tm1637Defs(portId) {
  const port = BOARD.grovePortById(portId);
  _defs['import_board']    = 'import board';
  _defs['import_tm1637']   = 'from tm1637_display import TM1637Display';
  _defs[`init_tm_${portId}`] =
    `_tm_${portId} = TM1637Display(board.${port.pin1}, board.${port.signal})`;
}

Blockly.Python['tm1637_number'] = function(block) {
  const portId = block.getFieldValue('PORT');
  _tm1637Defs(portId);
  const val = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
  return `_tm_${portId}.print(int(${val}))\n`;
};

Blockly.Python['tm1637_off'] = function(block) {
  const portId = block.getFieldValue('PORT');
  _tm1637Defs(portId);
  return `_tm_${portId}.clear()\n`;
};

// ── ISD1820 Sprachmodul ───────────────────────────────────────────────────────
// P-E ist flankengesteuert: kurzer HIGH-Puls → spielt Aufnahme einmal ab.
// REC: HIGH halten solange aufgenommen werden soll (max. 10 s).
// ISD1820: Active-HIGH – Idle=LOW, kurzer HIGH-Puls zum Abspielen/Aufnehmen.
function _isd1820Init(portId) {
  const port = BOARD.grovePortById(portId);
  _defs['import_board']     = 'import board';
  _defs['import_digitalio'] = 'import digitalio';
  _defs[`init_isd_${portId}`] =
    `_isd_pe_${portId} = digitalio.DigitalInOut(board.${port.signal})\n` +
    `_isd_pe_${portId}.direction = digitalio.Direction.OUTPUT\n` +
    `_isd_pe_${portId}.value = False\n` +
    `_isd_rec_${portId} = digitalio.DigitalInOut(board.${port.pin1})\n` +
    `_isd_rec_${portId}.direction = digitalio.Direction.OUTPUT\n` +
    `_isd_rec_${portId}.value = False`;
}

Blockly.Python['actuator_isd1820'] = function(block) {
  const portId = block.getFieldValue('PORT');
  _isd1820Init(portId);
  return `_isd_pe_${portId}.value = True\nawait asyncio.sleep(0.1)\n_isd_pe_${portId}.value = False\n`;
};

Blockly.Python['actuator_isd1820_record'] = function(block) {
  const portId = block.getFieldValue('PORT');
  const dauer  = Blockly.Python.valueToCode(block, 'DAUER', Blockly.Python.ORDER_NONE) || '3';
  _isd1820Init(portId);
  return `_isd_rec_${portId}.value = True\nawait asyncio.sleep(min(${dauer}, 10))\n_isd_rec_${portId}.value = False\n`;
};

// ── Ereignis-Hut-Blöcke (je ein benannter Handler) ───────────────────────────
// Diese Generatoren geben einen Deskriptor {name, expr, body, poll} zurück;
// finish() baut daraus `async def <name>():` + `wenn(lambda: <expr>, <name>)`.

// Lesbare deutsche Handler-Namen je Sensor-Typ (Basis; wird bei Bedarf nummeriert)
// Gemeinsamer Helfer für digitale Trigger-Sensoren (Geräusch, Berührt)
function _whenDigital(block, prefix, pull, activeLow) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') {
    block.setWarningText('⚠ Bitte Port auswählen!');
    return null;
  }
  block.setWarningText(null);
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, prefix, pull);
  const expr = activeLow ? `(not _${prefix}_${pin}.value)` : `_${prefix}_${pin}.value`;
  return _whenTask(`wenn_${prefix}`, expr, body, '0.02');
}

Blockly.Python['when_button'] = function(block) {
  const val   = block.getFieldValue('BTN');
  if (!val || val === '__NONE__') { block.setWarningText('⚠ Bitte Taster auswählen!'); return null; }
  block.setWarningText(null);
  const state   = block.getFieldValue('STATE');
  const body    = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  const varName = _tasterDef(val);
  const expr    = state === 'pressed' ? `(not ${varName}.value)` : `${varName}.value`;
  return _whenTask(`wenn_taster_${String(val).toLowerCase().replace(/\./g, '_')}`, expr, body, '0.02');
};

Blockly.Python['when_sound'] = function(b) { return _whenDigital(b, 'sound', 'DOWN', true); };
Blockly.Python['when_touch'] = function(b) { return _whenDigital(b, 'touch', 'DOWN', true); };

// ── Drehgeber-Ereignis (Richtungserkennung) ───────────────────────────────────

Blockly.Python['when_encoder'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') { block.setWarningText('⚠ Bitte Port auswählen!'); return null; }
  block.setWarningText(null);
  const port   = BOARD.grovePortById(portId);
  const pinA   = port.pin1;
  const pinB   = port.signal;
  const dir    = block.getFieldValue('DIR');
  const body   = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  const encVar  = `_enc_${pinA}_${pinB}`;
  const prevVar = `_enc_${pinA}_${pinB}_prev`;
  const fnHoch  = `_enc_${pinA}_${pinB}_hoch`;
  const fnRunter= `_enc_${pinA}_${pinB}_runter`;
  _defs['import_board']    = 'import board';
  _defs['import_rotaryio'] = 'import rotaryio';
  // Encoder-Init + Hilfsfunktionen in einem Eintrag (Reihenfolge garantiert)
  _defs[`init_enc_${pinA}_${pinB}`] =
    `${encVar} = rotaryio.IncrementalEncoder(board.${pinA}, board.${pinB})\n` +
    `${prevVar} = [${encVar}.position]\n` +
    `def ${fnHoch}():\n` +
    `    _p = ${encVar}.position; _d = _p - ${prevVar}[0]; ${prevVar}[0] = _p; return _d > 0\n` +
    `def ${fnRunter}():\n` +
    `    _p = ${encVar}.position; _d = _p - ${prevVar}[0]; ${prevVar}[0] = _p; return _d < 0`;
  const fn       = dir === 'up' ? fnHoch : fnRunter;
  const taskName = dir === 'up' ? `wenn_drehgeber_hoch` : `wenn_drehgeber_runter`;
  return _whenTask(taskName, `${fn}()`, body, '0.02');
};

Blockly.Python['when_distance'] = function(block) {
  const sig = block.getFieldValue('SIG');
  if (!sig || sig === '__NONE__') { block.setWarningText('⚠ Bitte Port auswählen!'); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '20';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _groveSonarDef(sig);
  return _whenTask('wenn_abstand', `(_sonar_${sig}.distance ${op} ${val})`, body, '0.05');
};

Blockly.Python['when_light'] = function(block) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') { block.setWarningText('⚠ Bitte Port auswählen!'); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '50';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_ldr_${pin}`] = `_ldr_${pin} = analogio.AnalogIn(board.${pin})`;
  return _whenTask('wenn_licht', `(round((1 - _ldr_${pin}.value / 65535) * 100) ${op} ${val})`, body, '0.05');
};

Blockly.Python['when_temperature'] = function(block) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') { block.setWarningText('⚠ Bitte Port auswählen!'); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '25';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']  = 'import board';
  _defs['import_dht']    = 'import adafruit_dht';
  _defs[`init_dht11_${pin}`] = `_dht11_${pin} = adafruit_dht.DHT11(board.${pin})`;
  return _whenTask('wenn_temperatur', `(_dht11_${pin}.temperature ${op} ${val})`, body, '1');
};

Blockly.Python['when_humidity'] = function(block) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') { block.setWarningText('⚠ Bitte Port auswählen!'); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '60';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']  = 'import board';
  _defs['import_dht']    = 'import adafruit_dht';
  _defs[`init_dht11_${pin}`] = `_dht11_${pin} = adafruit_dht.DHT11(board.${pin})`;
  return _whenTask('wenn_feuchte', `(_dht11_${pin}.humidity ${op} ${val})`, body, '1');
};

// ── 8x8 NeoPixel-Matrix (Servo-Ports S1–S4 = GP12–GP15) ──────────────────────

function _matrixDefs(pin) {
  _defs['import_board']    = 'import board';
  _defs['import_neopixel'] = 'import neopixel';
  _defs[`init_matrix_${pin}`] =
    `_matrix_${pin} = neopixel.NeoPixel(board.${pin}, 64, brightness=0.1, auto_write=False)`;
}

function _matrixPin(block) {
  return BOARD.servos[block.getFieldValue('SERVO')];
}

// Setzt einzelne Pixel aus einer 64-Zeichen-Maske.
// Sequentielle Verdrahtung: Pixel-Index = Zeile * 8 + Spalte
function _maskToPixelLines(mask, rgbTuple, varName) {
  const lines = [];
  for (let i = 0; i < 64; i++) {
    if (mask[i] === '1') lines.push(`${varName}[${i}] = ${rgbTuple}`);
  }
  return lines.join('\n');
}

Blockly.Python['matrix_on'] = function(block) {
  const pin = _matrixPin(block);
  _matrixDefs(pin);
  const rgb = hexToRgbTuple(block.getFieldValue('COLOR'));
  return `_matrix_${pin}.fill(${rgb})\n_matrix_${pin}.show()\n`;
};

Blockly.Python['matrix_off'] = function(block) {
  const pin = _matrixPin(block);
  _matrixDefs(pin);
  return `_matrix_${pin}.fill((0, 0, 0))\n_matrix_${pin}.show()\n`;
};

Blockly.Python['matrix_brightness'] = function(block) {
  const pin = _matrixPin(block);
  _matrixDefs(pin);
  const pct = parseFloat(block.getFieldValue('PCT'));
  // 100 % = 0.3 (sicherer Maximalwert, verhindert Überstrom)
  const bri = (pct / 100 * 0.3).toFixed(3);
  return `_matrix_${pin}.brightness = ${bri}\n_matrix_${pin}.show()\n`;
};

Blockly.Python['matrix_symbol'] = function(block) {
  const pin    = _matrixPin(block);
  _matrixDefs(pin);
  const key    = block.getFieldValue('SYMBOL');
  const masks  = window.MATRIX_SYMBOL_MASKS || {};
  const mask   = masks[key] || '0'.repeat(64);
  const rgb    = hexToRgbTuple(block.getFieldValue('COLOR'));
  const varN   = `_matrix_${pin}`;
  const pixels = _maskToPixelLines(mask, rgb, varN);
  return `${varN}.fill((0, 0, 0))\n${pixels ? pixels + '\n' : ''}${varN}.show()\n`;
};

Blockly.Python['matrix_draw'] = function(block) {
  const pin  = _matrixPin(block);
  _matrixDefs(pin);
  const mask = block.getFieldValue('PIXELS') || '0'.repeat(64);
  const rgb  = hexToRgbTuple(block.getFieldValue('COLOR'));
  const varN = `_matrix_${pin}`;
  const pixels = _maskToPixelLines(mask, rgb, varN);
  return `${varN}.fill((0, 0, 0))\n${pixels ? pixels + '\n' : ''}${varN}.show()\n`;
};

// ── "Bitte auswählen"-Schutz: blockToCode-Wrapper ────────────────────────────
// Fängt alle verschachtelten Blöcke (Statement + Value) ab, bevor der
// eigentliche Generator aufgerufen wird. HAT-Blöcke werden direkt in
// workspaceToCode behandelt.
(function () {
  const _orig = Blockly.Python.blockToCode.bind(Blockly.Python);
  Blockly.Python.blockToCode = function (block, opt_thisOnly) {
    if (block) {
      let hasNone = false;
      outer: for (const input of block.inputList) {
        for (const field of input.fieldRow) {
          if (typeof field.getValue === 'function' && field.getValue() === '__NONE__') {
            hasNone = true;
            break outer;
          }
        }
      }
      if (hasNone) {
        block.setWarningText('⚠ Bitte Port / Pin auswählen!');
        if (block.outputConnection) return ['None', Blockly.Python.ORDER_NONE];
        return '# ⚠ Kein Port ausgewählt\n';
      }
      block.setWarningText(null);
    }
    return _orig(block, opt_thisOnly);
  };
})();
