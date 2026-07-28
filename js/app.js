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
  // KidsLab: Kategorie-Zeile mit Farbquadrat statt farbigem Rand.
  class KidsLabToolboxCategory extends Blockly.ToolboxCategory {
    addColourBorder_() { /* kein farbiger Rand – wir nutzen ein Quadrat */ }
    createIconDom_() {
      const sq = document.createElement('span');
      sq.className = 'cb-cat-square';
      sq.style.backgroundColor = this.colour_;
      return sq;
    }
  }
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    KidsLabToolboxCategory,
    true   // Default-Kategorie überschreiben
  );

  const cbTheme = Blockly.Theme.defineTheme('makerspaceos', {
    base: Blockly.Themes.Classic,
    fontStyle: { family: "'Inter', system-ui, sans-serif", weight: '600', size: 13 },
    componentStyles: {
      workspaceBackgroundColour: '#FBF8F3',
      toolboxBackgroundColour:   '#ffffff',
      toolboxForegroundColour:   '#1e293b',
      flyoutBackgroundColour:    '#F3EDE1',
      flyoutForegroundColour:    '#1e293b',
      flyoutOpacity:             1,
      scrollbarColour:           '#cfc7b5',
      scrollbarOpacity:          0.7,
    },
  });

  workspace = Blockly.inject('blockly-workspace', {
    toolbox: buildFinalToolbox(),
    renderer: 'zelos',
    theme: cbTheme,
    scrollbars: true,
    trashcan: true,
    zoom: { controls: true, wheel: true, startScale: 1.0 },
    grid: { spacing: 22, length: 3, colour: '#E3DCCB', snap: true },
  });

  // Eigener Variablen-Flyout: "erhöhe"/"verringere" statt Standard-"math_change".
  if (window.variableFlyoutCallback) {
    workspace.registerToolboxCategoryCallback('VARIABLE', window.variableFlyoutCallback);
  }

  // Zuletzt bearbeiteten Stand wiederherstellen, sonst Pflichtblöcke neu anlegen.
  const saved = loadCurrent();
  if (saved && saved.state) {
    const result = safeLoadState(saved.state, workspace);
    if (result.dropped) showToast(L(`${result.dropped} veraltete(r) Block(e) übersprungen`, `Skipped ${result.dropped} outdated block(s)`), 'warn');
    if (!result.ok) {
      _createFixedBlock('control_setup',   40, 40);
      _createFixedBlock('control_forever', 360, 40);
    }
  } else {
    // Pflicht-Startblöcke: SETUP + FÜR IMMER, nebeneinander.
    _createFixedBlock('control_setup',   40, 40);
    _createFixedBlock('control_forever', 360, 40);
  }
  // Pflichtblöcke garantieren (existieren + nicht löschbar) – auch nach Restore.
  ensureFixedBlocks();

  // Live Code-Generierung + Auto-Speichern bei jeder Änderung
  workspace.addChangeListener(onWorkspaceChange);
}

function onWorkspaceChange(_e) {
  updateCode();
  saveCurrentDebounced();
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
    return L(`# Fehler beim Generieren:\n# ${e.message}`, `# Error while generating:\n# ${e.message}`);
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
  document.getElementById('btn-save-board').addEventListener('click', saveToBoardClick);
  document.getElementById('btn-history').addEventListener('click', toggleHistory);

  document.getElementById('serial-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendLine();
  });

  // Board-Auswahl: aktuelles Board vorbelegen; Wechsel lädt die Seite neu.
  const boardSel = document.getElementById('board-select');
  if (boardSel) {
    boardSel.value = BOARD_ID;
    boardSel.addEventListener('change', () => setBoard(boardSel.value));
  }
  const logoSub = document.getElementById('logo-sub');
  if (logoSub) logoSub.textContent = 'MakeYourSchool · ' + BOARD.name;
}

async function toggleConnect() {
  if (serial.isConnected) {
    await serial.disconnect();
    setConnected(false);
  } else {
    try {
      await serial.connect();
      serial.onData = appendSerialOutput;
      serial.onDisconnect = () => {
        setConnected(false);
        showToast(L('Board getrennt', 'Board disconnected'), 'warn');
      };
      setConnected(true);
      detectAndSwitchBoard();   // Board erkennen und ggf. Profil umschalten
    } catch (e) {
      showToast(L('Verbindung fehlgeschlagen: ', 'Connection failed: ') + e.message, 'error');
    }
  }
}

// Erkennt das angeschlossene Board über board.board_id und schaltet bei Bedarf
// automatisch auf das passende Profil um (Reload). Fehlschlag = still ignorieren.
const _BOARD_ID_MAP = {
  lolin_s2_mini:          'lolin_s2_mini',
  cytron_maker_pi_rp2040: 'maker_pi_rp2040',
  // Generischer ESP32-WROOM-Build – bei uns auf dem AZ-Delivery ESP32 D1 R32.
  doit_esp32_devkit_v1:   'esp32_d1_r32',
};
async function detectAndSwitchBoard() {
  let id = null;
  try { id = await serial.readBoardId(); } catch (_) { return; }
  const want = _BOARD_ID_MAP[id];
  if (!want) return;   // unbekanntes/kein Board – aktuelle Auswahl gilt
  if (want !== BOARD_ID) {
    showToast(L('Board erkannt: ', 'Board detected: ') + BOARD_PROFILES[want].name + L(' – lade neu…', ' – reloading…'), 'ok');
    setBoard(want);    // persistiert + location.reload()
  } else {
    showToast(L('Board erkannt: ', 'Board detected: ') + BOARD.name, 'ok');
  }
}

async function runCode() {
  if (!serial.isConnected) {
    showToast(L('Bitte zuerst verbinden!', 'Please connect first!'), 'warn');
    return;
  }
  const code = generateCode();
  try {
    await serial.uploadAndRun(code);
    // Bei jedem Ausführen einen Versionsstand sichern
    pushVersion();
    saveCurrent();
    showToast(L('Code wird ausgeführt…', 'Running code…'), 'ok');
  } catch (e) {
    showToast(L('Fehler: ', 'Error: ') + e.message, 'error');
  }
}

// ── Speichern auf RP2040 + Verlauf ────────────────────────────────────────────

async function saveToBoardClick() {
  const code = generateCode();
  try {
    const res = await saveToBoard(code);
    if (res === 'failed_downloaded') {
      showToast(L('Speichern aufs Board schlug fehl (Datei blieb leer) – code.py wurde stattdessen heruntergeladen, bitte manuell aufs Laufwerk kopieren',
                  'Saving to the board failed (file stayed empty) – code.py was downloaded instead, please copy it to the drive manually'), 'error');
    } else {
      showToast(res === 'saved' ? L('code.py auf dem RP2040 gespeichert!', 'code.py saved to the board!')
                                : L('code.py heruntergeladen', 'code.py downloaded'), 'ok');
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;  // Dialog abgebrochen
    showToast(L('Speichern fehlgeschlagen: ', 'Saving failed: ') + e.message, 'error');
  }
}

function toggleHistory() {
  const drawer  = document.getElementById('history-drawer');
  const overlay = document.getElementById('history-overlay');
  const open    = drawer.classList.toggle('open');
  overlay.classList.toggle('show', open);
  if (open) renderHistory();
}

function closeHistory() {
  document.getElementById('history-drawer').classList.remove('open');
  document.getElementById('history-overlay').classList.remove('show');
}

function exportProject() {
  const dom  = Blockly.Xml.workspaceToDom(workspace);
  const xml  = Blockly.Xml.domToPrettyText(dom);
  const blob = new Blob([xml], { type: 'application/xml' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'makerSpaceOS-Projekt.xml';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(L('Projekt exportiert', 'Project exported'), 'ok');
}

function importProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const dom = Blockly.Xml.textToDom(e.target.result);
      workspace.clear();
      Blockly.Xml.domToWorkspace(dom, workspace);
      showToast(L('Projekt importiert', 'Project imported'), 'ok');
    } catch {
      showToast(L('Datei konnte nicht gelesen werden', 'Could not read file'), 'error');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// Einfacher Zeilendiff: gibt Array von {type:'=','+'|'-', text} zurück.
// Nutzt LCS (Longest Common Subsequence) auf gefilterten Zeilen.
function _diffCode(oldCode, newCode) {
  const clean = c => (c || '').split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));
  const a = clean(oldCode);
  const b = clean(newCode);

  // LCS-Tabelle
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);

  const diff = [];
  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && a[i] === b[j]) {
      diff.push({ type: '=', text: a[i++] }); j++;
    } else if (j < n && (i >= m || dp[i][j+1] >= dp[i+1][j])) {
      diff.push({ type: '+', text: b[j++] });
    } else {
      diff.push({ type: '-', text: a[i++] });
    }
  }
  return diff;
}

function renderHistory() {
  const list = document.getElementById('history-list');
  const versions = getVersions();
  list.innerHTML = '';
  if (!versions.length) {
    list.innerHTML = '<p class="history-empty">' + L('Noch keine gespeicherten Stände. Führe ein Programm aus, um eine Version anzulegen.',
      'No saved versions yet. Run a program to create one.') + '</p>';
    return;
  }
  const currentCode = generateCode();
  versions.forEach((v, i) => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const head = document.createElement('div');
    head.className = 'history-head';
    const ts = document.createElement('span');
    ts.className = 'history-ts';
    ts.textContent = '🕘 ' + new Date(v.ts).toLocaleString(L('de-DE', 'en-GB'));
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost btn-sm';
    btn.textContent = L('Wiederherstellen', 'Restore');
    btn.addEventListener('click', () => {
      restoreVersion(i);
      closeHistory();
      showToast(L('Version wiederhergestellt', 'Version restored'), 'ok');
    });
    head.appendChild(ts);
    head.appendChild(btn);

    // Mini-Diff gegen den aktuellen Stand
    const diff = _diffCode(v.code, currentCode);
    const changes = diff.filter(d => d.type !== '=');
    const pre = document.createElement('pre');
    pre.className = 'history-preview';
    if (!changes.length) {
      pre.innerHTML = '<span class="diff-eq">' + L('≡ identisch mit aktuellem Stand', '≡ identical to current state') + '</span>';
    } else {
      // Nur geänderte Zeilen anzeigen, max. 6
      pre.innerHTML = changes.slice(0, 6).map(d => {
        const cls = d.type === '+' ? 'diff-add' : 'diff-rem';
        const prefix = d.type === '+' ? '+ ' : '− ';
        return `<span class="${cls}">${prefix}${d.text.replace(/</g, '&lt;')}</span>`;
      }).join('\n') + (changes.length > 6 ? `\n<span class="diff-more">… ${changes.length - 6} ${L('weitere', 'more')}</span>` : '');
    }

    item.appendChild(head);
    item.appendChild(pre);
    list.appendChild(item);
  });
}

async function stopCode() {
  if (!serial.isConnected) return;
  try {
    await serial.stop();
    showToast(L('Gestoppt', 'Stopped'), 'ok');
  } catch (e) {
    showToast('Fehler: ' + e.message, 'error');
  }
}

function copyCode() {
  const code = codeEditor.getValue();
  navigator.clipboard.writeText(code).then(() => {
    showToast(L('Code in Zwischenablage kopiert!', 'Code copied to clipboard!'), 'ok');
  }).catch(() => {
    showToast(L('Kopieren fehlgeschlagen', 'Copy failed'), 'error');
  });
}

function toggleEdit() {
  const ro = codeEditor.getOption('readOnly');
  codeEditor.setOption('readOnly', !ro);
  const btn = document.getElementById('btn-toggle-edit');
  btn.classList.toggle('active', ro);
  btn.title = ro ? L('Bearbeitung aktiv (Blöcke sync deaktiviert)', 'Editing active (block sync disabled)') : L('Bearbeiten', 'Edit');
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

// Eingehende Serial-Daten werden gepuffert und nur einmal pro Frame ins DOM
// geschrieben (statt bei jedem Chunk). Der Puffer ist begrenzt – so bleibt die
// Seite auch bei einer Datenflut (z.B. Boot-/Reset-Schleife des Boards) flüssig.
const _SERIAL_MAX = 100000;  // max. Zeichen im Monitor
let _serialBuf = '';
let _serialPending = false;

function appendSerialOutput(text) {
  _serialBuf += text;
  if (_serialPending) return;
  _serialPending = true;
  requestAnimationFrame(_flushSerialOutput);
}

function _flushSerialOutput() {
  _serialPending = false;
  const el = document.getElementById('serial-output');
  if (!el) return;
  let next = el.textContent + _serialBuf;
  _serialBuf = '';
  if (next.length > _SERIAL_MAX) next = next.slice(next.length - _SERIAL_MAX);
  el.textContent = next;
  el.scrollTop = el.scrollHeight;
}

function clearSerial() {
  _serialBuf = '';
  document.getElementById('serial-output').textContent = '';
}

// ── UI-Hilfsfunktionen ────────────────────────────────────────────────────────

function setConnected(connected) {
  const dot   = document.getElementById('status-dot');
  const text  = document.getElementById('status-text');
  const btn   = document.getElementById('btn-connect');
  const label = btn.querySelector('.btn-label');

  if (connected) {
    dot.className  = 'status-dot connected';
    text.textContent = L('Verbunden', 'Connected');
    label.textContent = L('Trennen', 'Disconnect');
    btn.className    = 'btn btn-danger';
  } else {
    dot.className  = 'status-dot';
    text.textContent = L('Nicht verbunden', 'Not connected');
    label.textContent = L('Verbinden', 'Connect');
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
