// app.js – Haupt-Anwendungslogik

let workspace  = null;
let codeEditor = null;
let serial     = new CircuitPythonSerial();

// ── Initialisierung ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initBlockly();
  initCodeEditor();
  initButtons();
});

function initBlockly() {
  const cbTheme = Blockly.Theme.defineTheme('circuitblox', {
    base: Blockly.Themes.Classic,
    fontStyle: { family: "'Segoe UI', system-ui, sans-serif", weight: '600', size: 13 },
    componentStyles: {
      workspaceBackgroundColour: '#f4f6fb',
      toolboxBackgroundColour:   '#1e1e2e',
      toolboxForegroundColour:   '#e0e0e0',
      flyoutBackgroundColour:    '#252538',
      flyoutForegroundColour:    '#d0d0d0',
      flyoutOpacity:             1,
      scrollbarColour:           '#444466',
      scrollbarOpacity:          0.6,
    },
  });

  workspace = Blockly.inject('blockly-workspace', {
    toolbox: buildFinalToolbox(),
    renderer: 'zelos',
    theme: cbTheme,
    scrollbars: true,
    trashcan: true,
    zoom: { controls: true, wheel: true, startScale: 1.0 },
    grid: { spacing: 20, length: 3, colour: '#d8dde8', snap: true },
  });

  // Pflicht-Startblöcke: SETUP + FÜR IMMER (nicht löschbar, aber einzeln verschiebbar)
  // Nebeneinander platziert, damit sie sich nicht überlappen.
  _createFixedBlock('control_setup',   40, 40);
  _createFixedBlock('control_forever', 360, 40);

  // Live Code-Generierung bei jeder Änderung
  workspace.addChangeListener(updateCode);
}

function _createFixedBlock(type, x, y) {
  const block = workspace.newBlock(type);
  block.initSvg();
  block.render();
  block.moveBy(x, y);
  block.setDeletable(false);   // dürfen nicht gelöscht werden …
  block.setMovable(true);      // … aber einzeln frei verschiebbar
}

function initCodeEditor() {
  codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode:        'python',
    theme:       'dracula',
    lineNumbers:  true,
    readOnly:     true,
    indentUnit:   4,
    tabSize:      4,
    lineWrapping: false,
    extraKeys:    { 'Tab': 'indentMore' },
  });
  updateCode();
}

// ── Code-Generierung ─────────────────────────────────────────────────────────

function generateCode() {
  try {
    return Blockly.Python.workspaceToCode(workspace);
  } catch (e) {
    return `# Fehler beim Generieren:\n# ${e.message}`;
  }
}

function updateCode() {
  if (!workspace || !codeEditor) return;
  const code = generateCode();
  const isReadOnly = codeEditor.getOption('readOnly');
  if (isReadOnly) {
    codeEditor.setValue(code);
  }
}

// ── Buttons ──────────────────────────────────────────────────────────────────

function initButtons() {
  document.getElementById('btn-connect').addEventListener('click', toggleConnect);
  document.getElementById('btn-run').addEventListener('click', runCode);
  document.getElementById('btn-stop').addEventListener('click', stopCode);
  document.getElementById('btn-copy').addEventListener('click', copyCode);
  document.getElementById('btn-toggle-edit').addEventListener('click', toggleEdit);
  document.getElementById('btn-clear-serial').addEventListener('click', clearSerial);
  document.getElementById('btn-send').addEventListener('click', sendLine);

  document.getElementById('serial-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendLine();
  });
}

async function toggleConnect() {
  if (serial.isConnected) {
    await serial.disconnect();
    setConnected(false);
  } else {
    try {
      await serial.connect();
      serial.onData = appendSerialOutput;
      setConnected(true);
    } catch (e) {
      showToast('Verbindung fehlgeschlagen: ' + e.message, 'error');
    }
  }
}

async function runCode() {
  if (!serial.isConnected) {
    showToast('Bitte zuerst verbinden!', 'warn');
    return;
  }
  const code = generateCode();
  try {
    await serial.uploadAndRun(code);
    showToast('Code wird ausgeführt…', 'ok');
  } catch (e) {
    showToast('Fehler: ' + e.message, 'error');
  }
}

async function stopCode() {
  if (!serial.isConnected) return;
  try {
    await serial.stop();
    showToast('Gestoppt', 'ok');
  } catch (e) {
    showToast('Fehler: ' + e.message, 'error');
  }
}

function copyCode() {
  const code = codeEditor.getValue();
  navigator.clipboard.writeText(code).then(() => {
    showToast('Code in Zwischenablage kopiert!', 'ok');
  }).catch(() => {
    showToast('Kopieren fehlgeschlagen', 'error');
  });
}

function toggleEdit() {
  const ro = codeEditor.getOption('readOnly');
  codeEditor.setOption('readOnly', !ro);
  const btn = document.getElementById('btn-toggle-edit');
  btn.classList.toggle('active', ro);
  btn.title = ro ? 'Bearbeitung aktiv (Blöcke sync deaktiviert)' : 'Bearbeiten';
  if (!ro) {
    // Zurück zu readOnly: Code neu aus Blockly generieren
    updateCode();
  }
}

async function sendLine() {
  const input = document.getElementById('serial-input');
  const line  = input.value.trim();
  if (!line || !serial.isConnected) return;
  await serial.sendLine(line);
  input.value = '';
}

// ── Serieller Monitor ────────────────────────────────────────────────────────

function appendSerialOutput(text) {
  const el = document.getElementById('serial-output');
  el.textContent += text;
  el.scrollTop = el.scrollHeight;
}

function clearSerial() {
  document.getElementById('serial-output').textContent = '';
}

// ── UI-Hilfsfunktionen ────────────────────────────────────────────────────────

function setConnected(connected) {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const btn  = document.getElementById('btn-connect');

  if (connected) {
    dot.className  = 'status-dot connected';
    text.textContent = 'Verbunden';
    btn.textContent  = 'Trennen';
    btn.className    = 'btn btn-danger';
  } else {
    dot.className  = 'status-dot';
    text.textContent = 'Nicht verbunden';
    btn.textContent  = 'Verbinden';
    btn.className    = 'btn btn-primary';
  }

  document.getElementById('btn-run').disabled  = !connected;
  document.getElementById('btn-stop').disabled  = !connected;
  document.getElementById('serial-input').disabled = !connected;
  document.getElementById('btn-send').disabled  = !connected;
}

let _toastTimer = null;
function showToast(msg, type = 'ok') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast show ${type}`;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.className = 'toast', 2500);
}
