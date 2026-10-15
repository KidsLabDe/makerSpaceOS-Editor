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
  'when_sound', 'when_touch', 'when_motion', 'when_battery_low',
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
    _tasks.push({ kind: 'loop', name: L('fuer_immer', 'forever'), body });
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
  // Boards mit Akku-Messchip (RoboBuddy): Jedes Programm bekommt den
  // Tiefentladeschutz als Hintergrund-Aufgabe – und läuft deshalb immer über
  // start(), auch wenn es nur aus BEIM START besteht.
  const guard = !!BOARD.powerMonitor && (hasSetup || _tasks.length > 0);
  if (guard) {
    _akkuDefs();
    _defs['from_robobuddy_waechter'] = 'from robobuddy import akku_waechter';
  }
  const hasAsync = guard || _tasks.length > 0 || /\bawait\b/.test(_setupCode);
  if (hasAsync) _defs['import_asyncio'] = 'import asyncio';

  // Import-Einträge aus Standard-Blockly-Blöcken übernehmen (z.B. math_random_int →
  // 'import random', math_single → 'import math'). Diese landen in
  // Blockly.Python.definitions_ statt in _defs und würden sonst fehlen.
  // Hilfsfunktionen (provideFunction_ → 'def …', z.B. von Standard-Listenblöcken)
  // ebenso – sie landen als Initialisierung hinter den Imports.
  const helperFns = [];
  for (const [k, v] of Object.entries(Blockly.Python.definitions_ || {})) {
    if (typeof v !== 'string') continue;
    if (v.startsWith('import ') || v.startsWith('from ')) _defs[k] = v;
    else if (v.startsWith('def ')) helperFns.push(v.trimEnd());
  }

  const imports = [];
  const inits   = [];
  for (const key of Object.keys(_defs).sort()) {
    let val = _defs[key];
    // Board-eigenes Pin-Modul (RoboBuddy: lib/robobuddy.py kennt alle GPIOs)
    if (key === 'import_board' && BOARD.boardModule) val = `from ${BOARD.boardModule} import board`;
    if (val.startsWith('import ') || val.startsWith('from ')) imports.push(val);
    else inits.push(val);
  }

  // Alle Blockly-Variablen aus dem Workspace sammeln – als Python-Namen aus
  // nameDB_ (gleiche Umwandlung wie in den Blöcken: Leerzeichen → "_",
  // Umlaute kodiert). Mit v.name kämen z.B. "meine liste = None" heraus.
  const ws = Blockly.getMainWorkspace();
  const allVarNames = ws ? ws.getAllVariables().map(v => {
    try {
      return Blockly.Python.nameDB_.getName(v.getId(), Blockly.Names.NameType.VARIABLE);
    } catch (_) {
      return v.name;
    }
  }) : [];

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

  let result = L('# === makerSpaceOS – Generierter Code ===\n', '# === makerSpaceOS – generated code ===\n');
  if (hasAsync) result += 'from makerspaceos import immer, wenn, start\n';
  if (imports.length) result += imports.join('\n') + '\n';
  if (inits.length)   result += L('\n# --- Initialisierungen ---\n', '\n# --- Initialisation ---\n') + inits.join('\n') + '\n';
  if (helperFns.length) result += L('\n# --- Hilfsfunktionen ---\n', '\n# --- Helper functions ---\n') + helperFns.join('\n\n') + '\n';

  // Variablen auf Modulebene vordeklarieren (None als Platzhalter),
  // damit sie in allen async-Funktionen per 'global' erreichbar sind.
  if (hasAsync && allVarNames.length) {
    result += L('\n# --- Variablen ---\n', '\n# --- Variables ---\n') + allVarNames.map(v => `${v} = None`).join('\n') + '\n';
  }

  if (hasAsync) {
    const used = Object.create(null);
    const unique = (base) => {
      let n = base, i = 2;
      while (used[n]) n = `${base}_${i++}`;
      used[n] = true;
      return n;
    };
    const startFn = L('beim_start', 'on_start');
    if (hasSetup) used[startFn] = true;
    _tasks.forEach(t => { t.fn = unique(t.name); });

    result += L('\n# --- Dein Programm ---\n', '\n# --- Your program ---\n');
    if (hasSetup) result += `async def ${startFn}():\n` + withGlobals(_setupCode) + '\n';
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
    if (guard) result += 'akku_waechter()\n';
    result += `start(${hasSetup ? startFn : ''})\n`;
  } else if (hasSetup) {
    result += L('\n# --- Setup (einmalig) ---\n', '\n# --- Setup (runs once) ---\n') + _dedent(_setupCode);
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

// "erhöhe"/"verringere VARIABLE um X" (siehe js/blocks/variables.js)
function _varDelta(block, op) {
  let varName;
  try {
    varName = Blockly.Python.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  } catch (_) {
    varName = block.getFieldValue('VAR');
  }
  const delta = Blockly.Python.valueToCode(block, 'DELTA', Blockly.Python.ORDER_NONE) || '0';
  return `${varName} = (${varName} if isinstance(${varName}, (int, float)) else 0) ${op} (${delta})\n`;
}
Blockly.Python['var_increase'] = (block) => _varDelta(block, '+');
Blockly.Python['var_decrease'] = (block) => _varDelta(block, '-');

// ── Listen (siehe js/blocks/lists.js) ─────────────────────────────────────────
// Positionen zählen im Block ab 1 → Python-Index = Nr. - 1.

function _listVarName(block) {
  try {
    return Blockly.Python.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  } catch (_) {
    return block.getFieldValue('VAR');
  }
}

function _listIndex(block) {
  const idx = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '1';
  return /^\d+$/.test(idx) ? String(Math.max(0, parseInt(idx, 10) - 1)) : `int(${idx}) - 1`;
}

// Variablen sind auf Modulebene mit None vordeklariert → Anhängen legt die
// Liste bei Bedarf selbst an, damit Kinder nicht erst "leere Liste" setzen müssen.
Blockly.Python['list_append'] = function(block) {
  const v   = _listVarName(block);
  const val = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
  return `if not isinstance(${v}, list):\n    ${v} = []\n${v}.append(${val})\n`;
};

Blockly.Python['list_get'] = function(block) {
  return [`${_listVarName(block)}[${_listIndex(block)}]`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['list_set'] = function(block) {
  const val = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
  return `${_listVarName(block)}[${_listIndex(block)}] = ${val}\n`;
};

Blockly.Python['list_remove'] = function(block) {
  return `del ${_listVarName(block)}[${_listIndex(block)}]\n`;
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

// Wartet (nicht blockierend) bis die Bedingung wahr ist – pollt mit kleinem
// await-sleep, damit parallele Aufgaben weiterlaufen.
Blockly.Python['control_wait_until'] = function(block) {
  const cond = Blockly.Python.valueToCode(block, 'COND', Blockly.Python.ORDER_NONE) || 'False';
  return `while not (${cond}):\n    await asyncio.sleep(0.02)\n`;
};

// Solange-Schleife – mit await-Yield am Ende jedes Durchlaufs, damit auch eine
// rein synchrone Schleife andere Aufgaben nicht blockiert.
Blockly.Python['control_while'] = function(block) {
  const cond = Blockly.Python.valueToCode(block, 'COND', Blockly.Python.ORDER_NONE) || 'False';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  return `while ${cond}:\n${body}    await asyncio.sleep(0)\n`;
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

// Freier HC-SR04 am Grove-Port: TRIG = Signal-Pin, ECHO = 2. Pin (pin1) des
// Ports. Nutzt lib/sr04.py (nach CIRCUITPY/lib/ kopieren).
// Ports ohne zweiten Pin (RoboBuddy A0–A2): ECHO kommt dann aus dem
// Port-Paar mit gleichem Signal-Pin (A0 → A0+A1, A1 → A1+A2).
function _sr04SonarDef(sig) {
  const ports = (BOARD.grovePorts || []).filter(p => p.signal === sig);
  const port  = ports.find(p => p.pin1 && p.twoPin !== false) || ports[0];
  const echo  = (port && port.pin1) || sig;
  _defs['import_board']            = 'import board';
  _defs['from_sr04']               = 'from sr04 import SR04';
  _defs[`init_sr04_${sig}`]        = `_sr04_${sig} = SR04(board.${sig}, board.${echo})`;
  return echo !== sig;
}

// Sensor-Ausdruck je nach Block-Feld TYPE ('grove' | 'sr04', Default 'grove').
function _sonarExpression(block) {
  const sig  = block.getFieldValue('SIG');
  const type = block.getFieldValue('TYPE') || 'grove';
  if (type === 'sr04') {
    const ok = _sr04SonarDef(sig);
    block.setWarningText(ok ? null
      : L('⚠ HC-SR04 braucht zwei Pins – bitte einen Port mit zweitem Pin wählen!', '⚠ HC-SR04 needs two pins – please choose a port with a second pin!'));
    return `_sr04_${sig}.distance`;
  }
  block.setWarningText(null);
  _groveSonarDef(sig);
  return `_sonar_${sig}.distance`;
}

Blockly.Python['sensor_ultrasonic'] = function(block) {
  return [_sonarExpression(block), Blockly.Python.ORDER_MEMBER];
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
  const expr = _sonarExpression(block);
  const op   = block.getFieldValue('OP');
  const val  = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '20';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  return `if ${expr} ${op} ${val}:\n${body}`;
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

// Servo-Schiene einschalten, falls das Board sie schaltet (RoboBuddy: 5-V-Boost
// an SERVO_EN). Key "init_0_…" → läuft vor allen PWM-Inits. Die Laufzeit
// schaltet die Schiene nach Stopp/Absturz wieder ab (beim_beenden).
function _servoPowerDef() {
  if (!BOARD.servoEnable) return;
  _defs['from_robobuddy_servo_strom'] = 'from robobuddy import servo_strom';
  _defs['init_0_servo_strom'] = 'servo_strom(True)';
}

// PWM-Ausgang eines Servo-Anschlusses (S1…S4), geteilt von Winkel-Servo,
// Rad-Servo und Fahren. duty_cycle=0: kein Puls bis zum ersten Befehl –
// sonst ruckt ein Dauerdreh-Servo beim Programmstart kurz los.
function _servoPwmDef(s) {
  const pin = BOARD.servos[s];
  _servoPowerDef();
  _defs['import_board']  = 'import board';
  _defs['import_pwmio']  = 'import pwmio';
  _defs[`init_pwm_${s}`] = `_pwm_${s} = pwmio.PWMOut(board.${pin}, duty_cycle=0, frequency=50)`;
  return `_pwm_${s}`;
}

Blockly.Python['actuator_servo'] = function(block) {
  const s     = block.getFieldValue('SERVO');
  const angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_NONE) || '90';
  const pwm   = _servoPwmDef(s);
  _defs['from_servo']    = 'from adafruit_motor import servo as _servo_mod';
  _defs[`init_srv_${s}`] = `_servo_${s} = _servo_mod.Servo(${pwm})`;
  return `_servo_${s}.angle = ${angle}\n`;
};

// ── Aktoren: Rad-Servo (Dauerdreh-Servo) + Fahren ────────────────────────────
// Pulsbreite 1050…1950 µs wie in der Robo-Buddy-Firmware, 1500 µs = Stopp.

function _wheelDef(s) {
  const pwm = _servoPwmDef(s);
  _defs['from_servo']    = 'from adafruit_motor import servo as _servo_mod';
  _defs[`init_rad_${s}`] =
    `_rad_${s} = _servo_mod.ContinuousServo(${pwm}, min_pulse=1050, max_pulse=1950)`;
  return `_rad_${s}`;
}

Blockly.Python['actuator_wheel_servo'] = function(block) {
  const s = block.getFieldValue('SERVO');
  if (!s || s === '__NONE__') {
    block.setWarningText(L('⚠ Bitte Servo auswählen!', '⚠ Please select a servo!'));
    return L('pass  # ⚠ Kein Servo ausgewählt\n', 'pass  # ⚠ No servo selected\n');
  }
  block.setWarningText(null);
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE) || '0';
  return `${_wheelDef(s)}.throttle = max(-1, min(1, (${speed}) / 100))\n`;
};

Blockly.Python['actuator_drive'] = function(block) {
  const dir   = block.getFieldValue('DIR');
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE) || '50';
  const drv   = BOARD.drive;
  if (!drv) return '';
  const links  = _wheelDef(drv.left);
  const rechts = _wheelDef(drv.right);
  _defs['from_robobuddy_fahren'] = 'from robobuddy import fahren';
  return `await fahren(${links}, ${rechts}, '${dir}', ${dir === 'stopp' ? 0 : speed})\n`;
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
  return `_motor_${m}.throttle = max(0, min(100, ${speed})) / 100\n`;
};

Blockly.Python['actuator_motor_backward'] = function(block) {
  const m     = block.getFieldValue('MOTOR');
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE) || '75';
  _motorDefs(m);
  return `_motor_${m}.throttle = -max(0, min(100, ${speed})) / 100\n`;
};

Blockly.Python['actuator_motor_stop'] = function(block) {
  const m = block.getFieldValue('MOTOR');
  _motorDefs(m);
  return `_motor_${m}.throttle = 0\n`;
};

// ── Schrittmotor (28BYJ-48 + ULN2003) ─────────────────────────────────────────

Blockly.Python['actuator_stepper'] = function(block) {
  const idA = block.getFieldValue('PORTA');
  const idB = block.getFieldValue('PORTB');
  if (!idA || idA === '__NONE__' || !idB || idB === '__NONE__') {
    block.setWarningText(L('⚠ Bitte beide Anschlüsse auswählen!', '⚠ Please select both connectors!'));
    return '';
  }
  block.setWarningText(null);

  const portA = BOARD.grovePortById(idA);
  const portB = BOARD.grovePortById(idB);
  const dir   = block.getFieldValue('DIR');   // 'cw' | 'ccw'
  const grad  = block.getFieldValue('GRAD') || '90';

  // Anschluss 1 → IN1/IN2, Anschluss 2 → IN3/IN4
  const pins = [portA.pin1, portA.signal, portB.pin1, portB.signal];
  pins.forEach(p => _digitalOutDef(p, 'step'));

  _defs['def_schrittmotor'] =
    '_STEP_SEQ = (\n' +
    '    (1, 0, 0, 0), (1, 1, 0, 0), (0, 1, 0, 0), (0, 1, 1, 0),\n' +
    '    (0, 0, 1, 0), (0, 0, 1, 1), (0, 0, 0, 1), (1, 0, 0, 1),\n' +
    ')\n' +
    'async def _schrittmotor(pins, grad, rechts):\n' +
    '    schritte = round(grad / 360 * 4096)\n' +
    '    for i in range(schritte):\n' +
    '        idx = (i % 8) if rechts else (7 - (i % 8))\n' +
    '        for pin, wert in zip(pins, _STEP_SEQ[idx]):\n' +
    '            pin.value = bool(wert)\n' +
    '        await asyncio.sleep(0.001)\n' +
    '    for pin in pins:\n' +
    '        pin.value = False';

  const rechts = dir === 'cw' ? 'True' : 'False';
  const list   = pins.map(p => `_step_${p}`).join(', ');
  return `await _schrittmotor([${list}], ${grad}, ${rechts})\n`;
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
  const idx = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '1';
  return `_pixels[(${idx}) - 1] = ${hexToRgbTuple(block.getFieldValue('COLOR'))}\n_pixels.show()\n`;
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
  const count = Blockly.Python.valueToCode(block, 'COUNT', Blockly.Python.ORDER_NONE) || '8';
  _neopixelExtDefs(pin, count);
  const idx = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '1';
  return `_npx_${pin}[(${idx}) - 1] = ${hexToRgbTuple(block.getFieldValue('COLOR'))}\n_npx_${pin}.show()\n`;
};

Blockly.Python['neopixel_ext_fill'] = function(block) {
  const pin = block.getFieldValue('PORT');
  const count = Blockly.Python.valueToCode(block, 'COUNT', Blockly.Python.ORDER_NONE) || '8';
  _neopixelExtDefs(pin, count);
  return `_npx_${pin}.fill(${hexToRgbTuple(block.getFieldValue('COLOR'))})\n_npx_${pin}.show()\n`;
};

Blockly.Python['neopixel_ext_off'] = function(block) {
  const pin = block.getFieldValue('PORT');
  const count = Blockly.Python.valueToCode(block, 'COUNT', Blockly.Python.ORDER_NONE) || '8';
  _neopixelExtDefs(pin, count);
  return `_npx_${pin}.fill((0, 0, 0))\n_npx_${pin}.show()\n`;
};

Blockly.Python['neopixel_brightness'] = function(block) {
  _neopixelDefs();
  const pct = Blockly.Python.valueToCode(block, 'PERCENT', Blockly.Python.ORDER_NONE) || '50';
  return `_pixels.brightness = (${pct}) / 100\n_pixels.show()\n`;
};

Blockly.Python['neopixel_ext_brightness'] = function(block) {
  const pin = block.getFieldValue('PORT');
  const count = Blockly.Python.valueToCode(block, 'COUNT', Blockly.Python.ORDER_NONE) || '8';
  _neopixelExtDefs(pin, count);
  const pct = Blockly.Python.valueToCode(block, 'PERCENT', Blockly.Python.ORDER_NONE) || '50';
  return `_npx_${pin}.brightness = (${pct}) / 100\n_npx_${pin}.show()\n`;
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

// ── Gemeinsamer I2C-Bus ───────────────────────────────────────────────────────
// Ein busio.I2C je Pin-Paar, von allen I2C-Geräten geteilt (LCD, ICM20948,
// Akku-Messchip …). Zwei busio.I2C auf denselben Pins → „in Benutzung".
// Key-Präfix "init_0_" sortiert vor allen Geräte-Inits (init_grove_lcd,
// init_imu_* …) → der Bus existiert, bevor ein Gerät ihn braucht.
// Vor dem Anlegen wird der Bus freigetaktet: Nach einem Absturz mitten in
// einer Übertragung hält ein Sensor SDA evtl. auf Low (Auto-Reload macht ihn
// nicht stromlos) → busio.I2C meldet sonst „Kein Pull-up gefunden".
// Gibt den Variablennamen des Busses zurück.
function _i2cBusDef(port) {
  const scl = port.signal, sda = port.pin1;
  const bus = `_i2c_${scl}_${sda}`;
  _defs['import_board']     = 'import board';
  _defs['import_busio']     = 'import busio';
  _defs['import_digitalio'] = 'import digitalio';
  _defs['import_time']      = 'import time';
  _defs['init_0_0_i2c_freigeben'] =
    `def _i2c_freigeben(scl_pin, sda_pin):\n` +
    `    _scl = digitalio.DigitalInOut(scl_pin)\n` +
    `    _sda = digitalio.DigitalInOut(sda_pin)\n` +
    `    _scl.switch_to_output(value=True)\n` +
    `    _sda.switch_to_input(pull=digitalio.Pull.UP)\n` +
    `    for _ in range(16):\n` +
    `        _scl.value = False\n` +
    `        time.sleep(0.001)\n` +
    `        _scl.value = True\n` +
    `        time.sleep(0.001)\n` +
    `    _scl.deinit()\n` +
    `    _sda.deinit()`;
  _defs[`init_0_i2c_${scl}_${sda}`] =
    `_i2c_freigeben(board.${scl}, board.${sda})\n` +
    `${bus} = busio.I2C(board.${scl}, board.${sda})`;
  return bus;
}

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

// ── ICM20948-Generatoren (9-Achsen-IMU, Grove-I2C) ───────────────────────────
// ±16g-Bereich, damit auch das 9g-Ereignis auslösen kann (Standard wäre ±8g).

function _imuDefs(portId) {
  const port = BOARD.grovePortById(portId);
  const bus  = _i2cBusDef(port);
  _defs['import_math']      = 'import math';
  _defs['import_time']      = 'import time';
  _defs['import_icm20x']    = 'import adafruit_icm20x';
  // Sensor + Hilfsfunktionen in einem Eintrag (der Bus kommt aus _i2cBusDef
  // und steht durch seinen Key garantiert davor). Retry: der interne Kompass
  // (AK09916) meldet sich nach dem Einschalten oft erst beim 2. Versuch – nur
  // der Sensor wird neu angelegt, der (evtl. geteilte) Bus bleibt bestehen.
  // time.sleep ist hier ok – läuft einmalig vor den Tasks.
  // Lesefehler (z.B. Wackelkontakt am Stecker beim Schütteln) dürfen das
  // Programm nicht beenden – dann gilt der letzte gültige Messwert weiter.
  _defs[`init_imu_${portId}`] =
    `_imu_${portId} = None\n` +
    `for _imu_versuch in range(5):\n` +
    `    try:\n` +
    `        _imu_${portId} = adafruit_icm20x.ICM20948(${bus})\n` +
    `        break\n` +
    `    except (OSError, RuntimeError, ValueError):\n` +
    `        time.sleep(0.3)  ` + L('# Sensor braucht nach dem Einschalten einen Moment', '# sensor needs a moment after power-on') + `\n` +
    `if _imu_${portId} is None:\n` +
    `    raise RuntimeError("` + L(`Bewegungssensor nicht gefunden - steckt er fest an ${port.label}?`, `Motion sensor not found - is it plugged firmly into ${port.label}?`) + `")\n` +
    `_imu_${portId}.accelerometer_range = adafruit_icm20x.AccelRange.RANGE_16G\n` +
    `_imu_${portId}_last = [0.0, 0.0, 9.81]\n` +
    `def _imu_accel_${portId}():\n` +
    `    try:\n` +
    `        _imu_${portId}_last[0], _imu_${portId}_last[1], _imu_${portId}_last[2] = _imu_${portId}.acceleration\n` +
    `    except OSError:\n` +
    `        pass  ` + L('# kurzer Kontakt-Aussetzer: letzten Wert behalten', '# brief contact dropout: keep last value') + `\n` +
    `    return _imu_${portId}_last\n` +
    `def _imu_g_${portId}():\n` +
    `    _ax, _ay, _az = _imu_accel_${portId}()\n` +
    `    return round(math.sqrt(_ax*_ax + _ay*_ay + _az*_az) / 9.81, 2)\n` +
    `def _imu_neigung_vor_${portId}():\n` +
    `    _ax, _ay, _az = _imu_accel_${portId}()\n` +
    `    return round(math.degrees(math.atan2(-_ax, math.sqrt(_ay*_ay + _az*_az))))\n` +
    `def _imu_neigung_seite_${portId}():\n` +
    `    _ax, _ay, _az = _imu_accel_${portId}()\n` +
    `    return round(math.degrees(math.atan2(_ay, _az)))`;
}

Blockly.Python['sensor_icm20948_g'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') {
    block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!'));
    return ['None', Blockly.Python.ORDER_NONE];
  }
  block.setWarningText(null);
  _imuDefs(portId);
  return [`_imu_g_${portId}()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['sensor_icm20948_neigung'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') {
    block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!'));
    return ['None', Blockly.Python.ORDER_NONE];
  }
  block.setWarningText(null);
  const dir = block.getFieldValue('DIR');
  _imuDefs(portId);
  const fn = dir === 'roll' ? `_imu_neigung_seite_${portId}` : `_imu_neigung_vor_${portId}`;
  return [`${fn}()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

// ── Akku (RoboBuddy: INA226 @ 0x45 am geteilten I2C-Bus) ─────────────────────
// Die Messlogik steckt in lib/robobuddy.py (akku_*). Strom: positiv = Laden.

function _akkuDefs() {
  const pm  = BOARD.powerMonitor;
  const bus = _i2cBusDef(BOARD.grovePortById(pm.port));
  _defs['from_robobuddy_akku'] =
    'from robobuddy import akku_start, akku_spannung, akku_strom, akku_laedt, akku_prozent';
  _defs['init_akku'] = `akku_start(${bus})`;
}

function _akkuValue(expr) {
  return function(_block) {
    if (!BOARD.powerMonitor) return ['0', Blockly.Python.ORDER_ATOMIC];
    _akkuDefs();
    return [expr, Blockly.Python.ORDER_FUNCTION_CALL];
  };
}
Blockly.Python['sensor_akku_spannung'] = _akkuValue('akku_spannung()');
Blockly.Python['sensor_akku_strom']    = _akkuValue('akku_strom()');
Blockly.Python['sensor_akku_laedt']    = _akkuValue('akku_laedt()');
Blockly.Python['sensor_akku_prozent']  = _akkuValue('akku_prozent()');

Blockly.Python['when_battery_low'] = function(block) {
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  if (!BOARD.powerMonitor) return null;
  _akkuDefs();
  // > 0: ohne Messchip liefert akku_spannung() 0 – das ist kein „schwach“
  return _whenTask(L('wenn_akku_schwach', 'when_battery_low'), '(0 < akku_spannung() < 3.6)', body, '1');
};

// ── Drehgeber-Generator (KY-040) ──────────────────────────────────────────────
// rotaryio (PIO) verlangt benachbarte GPIO-Pins (GPn + GPn±1) – sonst
// RuntimeError „Pins must be sequential GPIO pins" auf dem Board.
function _encoderWarning(block, port) {
  const num = (n) => { const m = String(n).match(/(\d+)$/); return m ? Number(m[1]) : NaN; };
  const ok = !Number.isNaN(num(port.pin1)) && Math.abs(num(port.pin1) - num(port.signal)) === 1;
  block.setWarningText(ok ? null
    : L('⚠ Drehgeber braucht benachbarte Pins – bitte anderen Port wählen!', '⚠ Encoder needs adjacent pins – please choose another port!'));
}

Blockly.Python['sensor_encoder'] = function(block) {
  const port = BOARD.grovePortById(block.getFieldValue('PORT'));
  _encoderWarning(block, port);
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

// ── Text verbinden ────────────────────────────────────────────────────────────

Blockly.Python['text_verbinden'] = function(block) {
  const a = Blockly.Python.valueToCode(block, 'A', Blockly.Python.ORDER_NONE) || "''";
  const b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || "''";
  return [`str(${a}) + str(${b})`, Blockly.Python.ORDER_ADDITIVE];
};

// ── Grove-LCD (I2C): Text + optionale RGB-Beleuchtung ─────────────────────────
// Nutzt lib/grove_rgb_lcd.py. Die Beleuchtung erkennt die Library automatisch:
// V5 (SGM31323 @ 0x30), V4 (PCA9633 @ 0x62) oder gar keine (Grove-16x2-LCD,
// Mono-Version → Text-Modus, set_rgb hat dann keine Wirkung).
function _groveLcdDef(portId) {
  const port = BOARD.grovePortById(portId);
  const bus  = _i2cBusDef(port);
  _defs['from_grove_rgb_lcd'] = 'from grove_rgb_lcd import GroveRgbLcd';
  _defs['init_grove_lcd'] = `_lcd = GroveRgbLcd(${bus})`;
}

// Text und Farbe sind getrennte Blöcke (gemeinsames _lcd-Objekt via _defs),
// damit man die Farbe ändern kann, ohne den Text zu überschreiben – und umgekehrt.
Blockly.Python['actuator_lcd_text'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return ''; }
  block.setWarningText(null);
  const line1 = Blockly.Python.valueToCode(block, 'LINE1', Blockly.Python.ORDER_NONE) || '""';
  const line2 = Blockly.Python.valueToCode(block, 'LINE2', Blockly.Python.ORDER_NONE) || '""';
  _groveLcdDef(portId);
  return `_lcd.set_text((${line1})[:16] + "\\n" + (${line2})[:16])\n`;
};

Blockly.Python['actuator_lcd_color'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return ''; }
  block.setWarningText(null);
  const colour = block.getFieldValue('COLOR') || '#FFFFFF';
  _groveLcdDef(portId);
  const rgb = hexToRgbTuple(colour).slice(1, -1); // "(r, g, b)" → "r, g, b"
  return `_lcd.set_rgb(${rgb})\n`;
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
    block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!'));
    return null;
  }
  block.setWarningText(null);
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _digitalInDef(pin, prefix, pull);
  const expr = activeLow ? `(not _${prefix}_${pin}.value)` : `_${prefix}_${pin}.value`;
  return _whenTask(`${L('wenn', 'when')}_${prefix}`, expr, body, '0.02');
}

Blockly.Python['when_button'] = function(block) {
  const val   = block.getFieldValue('BTN');
  if (!val || val === '__NONE__') { block.setWarningText(L('⚠ Bitte Taster auswählen!', '⚠ Please select a button!')); return null; }
  block.setWarningText(null);
  const state   = block.getFieldValue('STATE');
  const body    = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  const varName = _tasterDef(val);
  const expr    = state === 'pressed' ? `(not ${varName}.value)` : `${varName}.value`;
  return _whenTask(`${L('wenn_taster', 'when_button')}_${String(val).toLowerCase().replace(/\./g, '_')}`, expr, body, '0.02');
};

Blockly.Python['when_sound'] = function(b) { return _whenDigital(b, 'sound', 'DOWN', true); };
Blockly.Python['when_touch'] = function(b) { return _whenDigital(b, 'touch', 'DOWN', true); };

// ── Drehgeber-Ereignis (Richtungserkennung) ───────────────────────────────────

Blockly.Python['when_encoder'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return null; }
  block.setWarningText(null);
  const port   = BOARD.grovePortById(portId);
  _encoderWarning(block, port);
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
  const taskName = dir === 'up' ? L('wenn_drehgeber_hoch', 'when_encoder_up') : L('wenn_drehgeber_runter', 'when_encoder_down');
  return _whenTask(taskName, `${fn}()`, body, '0.02');
};

Blockly.Python['when_distance'] = function(block) {
  const sig = block.getFieldValue('SIG');
  if (!sig || sig === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = block.getFieldValue('VALUE') || '20';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _groveSonarDef(sig);
  return _whenTask(L('wenn_abstand', 'when_distance'), `(_sonar_${sig}.distance ${op} ${val})`, body, '0.05');
};

Blockly.Python['when_light'] = function(block) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = block.getFieldValue('VALUE') || '50';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']    = 'import board';
  _defs['import_analogio'] = 'import analogio';
  _defs[`init_ldr_${pin}`] = `_ldr_${pin} = analogio.AnalogIn(board.${pin})`;
  return _whenTask(L('wenn_licht', 'when_light'), `(round((1 - _ldr_${pin}.value / 65535) * 100) ${op} ${val})`, body, '0.05');
};

Blockly.Python['when_temperature'] = function(block) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = block.getFieldValue('VALUE') || '25';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']  = 'import board';
  _defs['import_dht']    = 'import adafruit_dht';
  _defs[`init_dht11_${pin}`] = `_dht11_${pin} = adafruit_dht.DHT11(board.${pin})`;
  return _whenTask(L('wenn_temperatur', 'when_temperature'), `(_dht11_${pin}.temperature ${op} ${val})`, body, '1');
};

Blockly.Python['when_humidity'] = function(block) {
  const pin = block.getFieldValue('PIN');
  if (!pin || pin === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return null; }
  block.setWarningText(null);
  const op   = block.getFieldValue('OP');
  const val  = block.getFieldValue('VALUE') || '60';
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _defs['import_board']  = 'import board';
  _defs['import_dht']    = 'import adafruit_dht';
  _defs[`init_dht11_${pin}`] = `_dht11_${pin} = adafruit_dht.DHT11(board.${pin})`;
  return _whenTask(L('wenn_feuchte', 'when_humidity'), `(_dht11_${pin}.humidity ${op} ${val})`, body, '1');
};

// ── Bewegungs-Ereignis (ICM20948, geschüttelt / 3g / 6g / 9g) ────────────────

Blockly.Python['when_motion'] = function(block) {
  const portId = block.getFieldValue('PORT');
  if (!portId || portId === '__NONE__') { block.setWarningText(L('⚠ Bitte Port auswählen!', '⚠ Please select a port!')); return null; }
  block.setWarningText(null);
  const mode = block.getFieldValue('MODE');
  const body = Blockly.Python.statementToCode(block, 'DO') || '    pass\n';
  _imuDefs(portId);
  // „geschüttelt" = Gesamt-g über 2 (in Ruhe ≈ 1); 3g/6g/9g = feste Schwellen
  const threshold = mode === 'shake' ? '2' : mode;
  const taskName  = mode === 'shake' ? L('wenn_geschuettelt', 'when_shaken') : `${L('wenn', 'when')}_${mode}g`;
  return _whenTask(taskName, `(_imu_g_${portId}() > ${threshold})`, body, '0.02');
};

// ── 8x8 NeoPixel-Matrix (Servo-Ports S1–S4 = GP12–GP15) ──────────────────────

function _matrixDefs(pin) {
  _servoPowerDef();   // Matrix hängt am 5-V-Plus des Servo-Anschlusses
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

Blockly.Python['matrix_set_pixel'] = function(block) {
  const pin = _matrixPin(block);
  _matrixDefs(pin);
  const rgb = hexToRgbTuple(block.getFieldValue('COLOR'));
  const x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_NONE) || '0';
  const y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_NONE) || '0';
  // Sequentielle Verdrahtung: Index = Zeile * 8 + Spalte
  return `_matrix_${pin}[(${y}) * 8 + (${x})] = ${rgb}\n_matrix_${pin}.show()\n`;
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
        block.setWarningText(L('⚠ Bitte Port / Pin auswählen!', '⚠ Please select a port / pin!'));
        if (block.outputConnection) return ['None', Blockly.Python.ORDER_NONE];
        // pass statt reinem Kommentar – sonst bleibt z. B. fuer_immer() ohne Rumpf (IndentationError)
        return L('pass  # ⚠ Kein Port ausgewählt\n', 'pass  # ⚠ No port selected\n');
      }
      block.setWarningText(null);
    }
    return _orig(block, opt_thisOnly);
  };
})();
