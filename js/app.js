// app.js – Haupt-Anwendungslogik

let workspace  = null;
let codeEditor = null;
let serial     = new CircuitPythonSerial();

// ── Initialisierung ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initBlockly();
  initCodeEditor();
  initButtons();
  initBoardSetup();
  loadSharedFromHash();   // geteilter Link (#p=…) → Projekt laden
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
  // Ausklappbare Kategorie (hat Bauteil-Unterkategorien, z. B. Anzeigen):
  // Das Icon ist hier der Auf/Zu-Pfeil, das Farbquadrat kommt vor das Label.
  class KidsLabCollapsibleCategory extends Blockly.CollapsibleToolboxCategory {
    constructor(def, toolbox, parent) {
      super(def, toolbox, parent);
      // Blockly startet mit expanded_=false, init() → setExpanded(false) wäre
      // dann ein No-op: Unterkategorien sichtbar, Pfeil zeigt aber „zu“.
      this.expanded_ = null;
    }
    addColourBorder_() {}
    createLabelDom_(name) {
      const label = super.createLabelDom_(name);
      const sq = document.createElement('span');
      sq.className = 'cb-cat-square';
      sq.style.backgroundColor = this.colour_;
      const wrap = document.createElement('span');
      wrap.className = 'cb-cat-labelwrap';
      wrap.id = label.id;          // aria-labelledby zeigt auf den Wrapper
      label.removeAttribute('id');
      wrap.append(sq, label);
      return wrap;
    }
  }
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.CollapsibleToolboxCategory.registrationName,
    KidsLabCollapsibleCategory,
    true
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
  initPortMemory(workspace);   // Port/Typ pro Bauteil übernehmen
  // Erklärungs-Leiste folgt dem ausgewählten Block (docs.js)
  if (window.docsAttachWorkspace) docsAttachWorkspace(workspace);
}

// ── Port pro Bauteil übernehmen ───────────────────────────────────────────────
// Wird ein Block mit „– bitte auswählen –“ abgelegt, übernimmt er Port/Typ von
// einem anderen Block desselben Bauteils im Programm, sonst die zuletzt für
// dieses Bauteil gewählte Einstellung (pro Board gemerkt). Nur Felder, die noch
// leer sind – eine bewusste Auswahl wird nie überschrieben.
const _LAST_PORTS_KEY = 'makerspaceos.lastPorts';
function _loadLastPorts() {
  try { return JSON.parse(localStorage.getItem(_LAST_PORTS_KEY) || '{}')[BOARD_ID] || {}; }
  catch (_) { return {}; }
}
function _saveLastPort(comp, field, value) {
  try {
    const all = JSON.parse(localStorage.getItem(_LAST_PORTS_KEY) || '{}');
    all[BOARD_ID] = all[BOARD_ID] || {};
    all[BOARD_ID][comp] = all[BOARD_ID][comp] || {};
    all[BOARD_ID][comp][field] = value;
    localStorage.setItem(_LAST_PORTS_KEY, JSON.stringify(all));
  } catch (_) { /* localStorage voll/gesperrt – dann eben ohne Merken */ }
}

function _fillFromComponent(ws, block) {
  const comp = block.componentId_;
  if (!comp) return [];
  const filled = [];
  const last = _loadLastPorts()[comp] || {};
  const others = ws.getAllBlocks(false).filter(b => b !== block && b.componentId_ === comp && !b.isInFlyout);
  for (const input of block.inputList) {
    for (const f of input.fieldRow) {
      if (!(f instanceof Blockly.FieldDropdown) || !f.name || f.getValue() !== '__NONE__') continue;
      const valid = new Set(f.getOptions(false).map(o => o[1]));
      const used = others.map(o => o.getFieldValue(f.name)).filter(v => v && v !== '__NONE__' && valid.has(v));
      // Mehrere Bauteile gleicher Art an verschiedenen Ports: die zuletzt gewählte bevorzugen
      let pick = used.includes(last[f.name]) ? last[f.name] : used[0];
      if (!pick && valid.has(last[f.name])) pick = last[f.name];
      if (!pick) continue;
      f.setValue(pick);
      filled.push(f.getText());
    }
  }
  return filled;
}

function initPortMemory(ws) {
  ws.addChangeListener(e => {
    // Bewusste Auswahl merken (Laden eines Projekts feuert keine Feld-Änderungen)
    if (e.type === Blockly.Events.BLOCK_CHANGE && e.element === 'field') {
      const b = ws.getBlockById(e.blockId);
      if (b && b.componentId_ && e.newValue && e.newValue !== '__NONE__' &&
          b.getField(e.name) instanceof Blockly.FieldDropdown) {
        _saveLastPort(b.componentId_, e.name, e.newValue);
      }
      return;
    }
    // Abgelegt (aus der Toolbox oder verschoben) → leere Felder auffüllen.
    // Bewusst nicht beim Erzeugen: Laden/Import feuert auch Create-Events.
    if (e.type === Blockly.Events.BLOCK_DRAG && !e.isStart) {
      const top = ws.getBlockById(e.blockId);
      if (!top) return;
      const prevGroup = Blockly.Events.getGroup();
      Blockly.Events.setGroup(e.group || true);   // gleicher Undo-Schritt wie das Ablegen
      const filled = [];
      try {
        for (const b of top.getDescendants(false)) filled.push(..._fillFromComponent(ws, b));
      } finally {
        Blockly.Events.setGroup(prevGroup || false);
      }
      if (filled.length) {
        showToast(L('🔌 Übernommen: ', '🔌 Taken over: ') + [...new Set(filled)].join(', ') +
                  L(' – wie beim gleichen Bauteil', ' – same as the matching part'), 'ok', 3000);
      }
    }
  });
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
  document.getElementById('btn-board-libs').addEventListener('click', onBoardLibsClick);
  document.getElementById('lib-dl-close').addEventListener('click', closeLibDownload);
  document.getElementById('lib-dl-zip').addEventListener('click', downloadLibZip);
  document.getElementById('lib-dl-all').addEventListener('change', _bsRenderDownloadList);
  document.getElementById('btn-firmware').addEventListener('click', openFwHelp);   // erst die Anleitung, dann Picker + Flash
  document.getElementById('fw-close').addEventListener('click', closeFwModal);
  document.getElementById('fw-close-btn').addEventListener('click', closeFwModal);
  document.getElementById('fw-flash-btn').addEventListener('click', flashSelectedFirmware);
  document.getElementById('fw-help-btn').addEventListener('click', openFwHelp);
  document.getElementById('fw-help-close').addEventListener('click', closeFwHelp);
  document.getElementById('fw-help-flash-btn').addEventListener('click', fwHelpContinue);
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
  if (logoSub) logoSub.textContent = BOARD.name;
}

async function toggleConnect() {
  if (serial.isConnected) {
    await serial.disconnect();
    setConnected(false);
  } else {
    try {
      await connectBoard();
    } catch (e) {
      showToast(L('Verbindung fehlgeschlagen: ', 'Connection failed: ') + e.message, 'error');
    }
  }
}

// Verbindet das Board und richtet UI + Monitor ein. port = optional bereits
// freigegebener Port (Agent-Bridge); ohne Angabe öffnet der Browser den Picker.
async function connectBoard(port = null) {
  await serial.connect(port);
  serial.onData = appendSerialOutput;
  serial.onDisconnect = () => {
    setConnected(false);
    showToast(L('Board getrennt', 'Board disconnected'), 'warn');
  };
  setConnected(true);
  // Board erkennen und ggf. Profil umschalten; Boards ohne CIRCUITPY-Laufwerk
  // prüfen danach ihre Bibliotheken über die serielle Schnittstelle.
  detectAndSwitchBoard().then(() => {
    if (typeof serialLibCheck === 'function') serialLibCheck();
  });
}

// Erkennt das angeschlossene Board über board.board_id und schaltet bei Bedarf
// automatisch auf das passende Profil um (Reload). Fehlschlag = still ignorieren.
const _BOARD_ID_MAP = {
  lolin_s2_mini:          'lolin_s2_mini',
  cytron_maker_pi_rp2040: 'maker_pi_rp2040',
  // Generischer ESP32-WROOM-Build – bei uns auf dem AZ-Delivery ESP32 D1 R32.
  doit_esp32_devkit_v1:   'esp32_d1_r32',
  // Generischer ESP32-C6-Build (8 MB) – bei uns auf dem RoboBuddy (C6-Zero).
  espressif_esp32c6_devkitc_1_n8: 'robobuddy',
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

// ── Prüfung vor dem Start: fehlende Auswahl (Port, Typ …) ─────────────────────
// Ohne Port erzeugt ein Block nur „pass“ – das Programm liefe, täte aber nichts.
// Deshalb vor Ausführen / Aufs Board: erstes Dropdown mit „– bitte auswählen –“
// (Wert '__NONE__') in einem laufenden Stapel suchen, hinspringen, Dropdown öffnen.
function findMissingSelection() {
  const roots = new Set(['control_setup', 'control_forever', 'loop_parallel', ..._HAT_TYPES]);
  // Lesereihenfolge (oben → unten), damit der „erste“ Fehler auch der oberste ist
  for (const top of workspace.getTopBlocks(true)) {
    if (!roots.has(top.type)) continue;              // schwebende Blöcke laufen nicht mit
    for (const b of top.getDescendants(true)) {
      if (!b.isEnabled()) continue;
      for (const input of b.inputList) {
        let label = '';
        for (const f of input.fieldRow) {
          if (f instanceof Blockly.FieldLabel) {
            const t = String(f.getText() || '').trim();
            if (t) label = t;
          } else if (f instanceof Blockly.FieldDropdown && f.getValue() === '__NONE__') {
            return { block: b, field: f, label };
          }
        }
      }
    }
  }
  return null;
}

// true = alles ausgewählt; sonst Block zeigen + Hinweis, Rückgabe false
function checkBeforeRun() {
  const miss = findMissingSelection();
  if (!miss) return true;
  const { block, field } = miss;
  // Feld-Bezeichnung ohne Emoji und Doppelpunkt („📏 Ultraschall  Port:“ → „Port“)
  const what = (miss.label.split(/\s{2,}/).pop() || '').replace(/[:：]\s*$/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const isType = field.name === 'TYPE';
  const msg = what
    ? (isType
        ? L(`Bitte noch „${what}“ auswählen – welches Bauteil benutzt du genau?`,
            `Please choose “${what}” first – which part exactly are you using?`)
        : L(`Bitte noch „${what}“ auswählen – sonst weiß das Programm nicht, wo das Bauteil steckt.`,
            `Please choose “${what}” first – otherwise the program doesn't know where the part is plugged in.`))
    : L('Bei einem Block fehlt noch eine Auswahl.', 'A block still needs a selection.');
  if (!block.warning || !block.warning.getText || !block.warning.getText()) {
    block.setWarningText(L('⚠ Bitte auswählen!', '⚠ Please select!'));
  }
  workspace.centerOnBlock(block.id);
  block.select();
  showToast('⚠ ' + msg, 'warn', 6000);
  // Dropdown direkt aufklappen – kürzester Weg zur Lösung
  setTimeout(() => { try { field.showEditor(); } catch (_) {} }, 150);
  return false;
}

async function runCode() {
  if (!serial.isConnected) {
    showToast(L('Bitte zuerst verbinden!', 'Please connect first!'), 'warn');
    return;
  }
  const code = generateCode();
  if (!checkBeforeRun()) return;
  try {
    await serial.uploadAndRun(code);
    hideErrorBanner();
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
  if (!checkBeforeRun()) return;
  const btn = document.getElementById('btn-save-board');
  if (btn && btn.disabled) return;
  if (btn) btn.disabled = true;   // kein Doppelklick während des Schreibens
  try {
    const res = await saveToBoard(code);
    if (res === 'failed_downloaded') {
      showToast(L('Speichern aufs Board schlug fehl (Datei blieb leer) – code.py wurde stattdessen heruntergeladen, bitte manuell aufs Laufwerk kopieren',
                  'Saving to the board failed (file stayed empty) – code.py was downloaded instead, please copy it to the drive manually'), 'error');
    } else {
      showToast(res === 'saved' ? L('code.py auf dem Board gespeichert!', 'code.py saved to the board!')
                                : L('code.py heruntergeladen', 'code.py downloaded'), 'ok');
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;  // Dialog abgebrochen
    showToast(L('Speichern fehlgeschlagen: ', 'Saving failed: ') + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function toggleHistory() {
  const drawer  = document.getElementById('history-drawer');
  const overlay = document.getElementById('history-overlay');
  const open    = drawer.classList.toggle('open');
  overlay.classList.toggle('show', open);
  if (open) { renderExamples(); renderHistory(); }
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

// XML-Projekt (Export/Import, Beispiele) in den Workspace laden. Vorher den
// aktuellen Stand als Version sichern → über „Verlauf“ zurückholbar.
function loadXmlProject(xmlText) {
  const dom = Blockly.Xml.textToDom(xmlText);   // wirft bei kaputtem XML → vor clear()
  migrateXmlDom(dom);
  pushVersion();
  workspace.clear();
  Blockly.Xml.domToWorkspace(dom, workspace);
  ensureFixedBlocks();
  updateCode();
  saveCurrent();
}

function importProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      loadXmlProject(e.target.result);
      closeHistory();
      showToast(L('Projekt importiert', 'Project imported'), 'ok');
    } catch {
      showToast(L('Datei konnte nicht gelesen werden', 'Could not read file'), 'error');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ── Projekt-Menü: Alles löschen ───────────────────────────────────────────────
// SETUP / FÜR IMMER bleiben stehen (nur geleert), alles andere fliegt raus.
// Als eine Event-Gruppe → ein Strg+Z holt alles zurück; zusätzlich Version im Verlauf.
function clearProject() {
  if (!confirm(L('Wirklich alle Blöcke löschen?\n\nDer jetzige Stand landet im Verlauf und kann von dort wiederhergestellt werden.',
                 'Really delete all blocks?\n\nThe current state is kept in the history and can be restored from there.'))) return;
  pushVersion();
  Blockly.Events.setGroup(true);
  try {
    for (const b of workspace.getTopBlocks(false)) {
      if (b.type === 'control_setup' || b.type === 'control_forever') {
        const inner = b.getInputTargetBlock('DO');
        if (inner) inner.dispose(false);
      } else {
        b.dispose(false);
      }
    }
  } finally {
    Blockly.Events.setGroup(false);
  }
  ensureFixedBlocks();
  updateCode();
  saveCurrent();
  closeHistory();
  showToast(L('Alles gelöscht – Strg+Z oder „Verlauf“ holt es zurück', 'Everything deleted – Ctrl+Z or “History” brings it back'), 'ok', 4000);
}

// ── Projekt-Menü: Beispiele (js/examples_db.js, generiert) ───────────────────
function renderExamples() {
  const list = document.getElementById('example-list');
  if (!list) return;
  list.innerHTML = '';
  const examples = (typeof EXAMPLES_DB !== 'undefined') ? EXAMPLES_DB : [];
  if (!examples.length) {
    list.innerHTML = '<p class="history-empty">' + L('Noch keine Beispiele vorhanden.', 'No examples yet.') + '</p>';
    return;
  }
  for (const ex of examples) {
    const btn = document.createElement('button');
    btn.className = 'example-item';
    const title = document.createElement('span');
    title.className = 'example-title';
    title.textContent = LF(ex, 'title');
    btn.appendChild(title);
    if (ex.desc) {
      const d = document.createElement('span');
      d.className = 'example-desc';
      d.textContent = LF(ex, 'desc');
      btn.appendChild(d);
    }
    if (ex.board && BOARD_PROFILES[ex.board]) {
      const b = document.createElement('span');
      b.className = 'example-board';
      b.textContent = '🔌 ' + BOARD_PROFILES[ex.board].name;
      btn.appendChild(b);
    }
    btn.addEventListener('click', () => loadExample(ex));
    list.appendChild(btn);
  }
}

function loadExample(ex) {
  if (!confirm(L(`Beispiel „${LF(ex, 'title')}“ laden?\n\nDein jetziges Programm landet im Verlauf.`,
                 `Load example “${LF(ex, 'title')}”?\n\nYour current program is kept in the history.`))) return;
  try {
    loadXmlProject(ex.xml);
    closeHistory();
    const other = ex.board && ex.board !== BOARD_ID && BOARD_PROFILES[ex.board];
    showToast(other
      ? L(`Beispiel geladen – es ist für ${other.name} gedacht, Ports evtl. anpassen`, `Example loaded – it is made for ${other.name}, ports may need adjusting`)
      : L('Beispiel geladen', 'Example loaded'), other ? 'warn' : 'ok', other ? 5000 : 2500);
  } catch (e) {
    showToast(L('Beispiel konnte nicht geladen werden', 'Could not load example'), 'error');
  }
}

// ── Projekt-Menü: Teilen per Link ────────────────────────────────────────────
// Das ganze Projekt steckt komprimiert im Link (#p=…) – kein Server, keine
// Daten bei Dritten. Block-IDs werden weggelassen (Blockly vergibt neue),
// Variablen-IDs bleiben (Felder verweisen darauf).
function _stripBlockIds(node) {
  if (Array.isArray(node)) { node.forEach(_stripBlockIds); return; }
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string' && 'id' in node) delete node.id;
  for (const v of Object.values(node)) _stripBlockIds(v);
}
function _b64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function _unb64url(str) {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
async function _pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}

async function copyShareLink() {
  try {
    const state = Blockly.serialization.workspaces.save(workspace);
    _stripBlockIds(state.blocks);
    const json = JSON.stringify({ v: 1, board: BOARD_ID, state });
    const packed = await _pipe(new TextEncoder().encode(json), new CompressionStream('deflate'));
    const url = location.href.split('#')[0] + '#p=' + _b64url(packed);
    await navigator.clipboard.writeText(url);
    showToast(L(`Link kopiert (${url.length} Zeichen) – einfach in Chat, Moodle oder E-Mail einfügen`,
                `Link copied (${url.length} characters) – just paste it into a chat, Moodle or e-mail`), 'ok', 4000);
  } catch (e) {
    showToast(L('Link konnte nicht erstellt werden: ', 'Could not create link: ') + e.message, 'error');
  }
}

// Beim Start: Projekt aus #p=… laden (aktueller Stand → Verlauf), Hash entfernen
async function loadSharedFromHash() {
  const m = location.hash.match(/^#p=([\w-]+)/);
  if (!m) return;
  history.replaceState(null, '', location.href.split('#')[0]);   // Reload lädt nicht erneut
  try {
    const raw  = await _pipe(_unb64url(m[1]), new DecompressionStream('deflate'));
    const data = JSON.parse(new TextDecoder().decode(raw));
    if (!data || !data.state) throw new Error('leer');
    pushVersion();
    const result = safeLoadState(data.state, workspace);
    if (!result.ok) throw new Error('state');
    ensureFixedBlocks();
    updateCode();
    saveCurrent();
    const other = data.board && data.board !== BOARD_ID && BOARD_PROFILES[data.board];
    showToast(other
      ? L(`Geteiltes Projekt geladen – es wurde für ${other.name} gebaut, Ports evtl. anpassen`, `Shared project loaded – it was built for ${other.name}, ports may need adjusting`)
      : L('Geteiltes Projekt geladen – dein vorheriges Programm liegt im Verlauf', 'Shared project loaded – your previous program is in the history'),
      other ? 'warn' : 'ok', 5000);
  } catch (e) {
    showToast(L('Der Link ist kaputt oder unvollständig', 'The link is broken or incomplete'), 'error', 4000);
  }
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

// Fehler-Banner: erkennt Python-Fehler im Board-Output, bleibt bis zum nächsten erfolgreichen Upload
let _errTail = '';
function _checkSerialError(text) {
  _errTail = (_errTail + text).slice(-600); // Rest-Puffer, falls der Fehler über Chunks geteilt ankommt
  // Nur die Fehlerzeile zählt (nicht "Traceback"): Stopp sendet Ctrl+C → "Traceback … KeyboardInterrupt:" ist kein Fehler
  if (/\w(?:Error|Exception):/.test(_errTail)) {
    showErrorBanner();
    _showErrorHint(_explainError(_errTail));
  }
}

// ── Python-Fehler kindgerecht erklären ────────────────────────────────────────
// Die Board-Meldung ist oft kryptisch („'float' Objekt ist nicht abonnierbar“).
// Erste passende Regel gewinnt; Muster decken englische UND deutsche
// CircuitPython-Builds ab. Der Original-Traceback bleibt im Monitor stehen.
const _ERROR_HINTS = [
  { re: /ImportError:.*?['"]?([\w.]+)['"]?\s*$/m, de: m => `Auf dem Board fehlt eine Bibliothek („${m[1]}“). Drücke oben auf „Libs prüfen“.`,
                                                  en: m => `A library is missing on the board (“${m[1]}”). Click “Check libs” at the top.` },
  { re: /ValueError:.*(in use|in Benutzung|benutzt)/i,
    de: 'Ein Anschluss wird doppelt benutzt. Prüfe, ob zwei verschiedene Bauteile am selben Port eingestellt sind.',
    en: 'A port is used twice. Check whether two different parts are set to the same port.' },
  { re: /RuntimeError:.*(sequential|geordnete)/i,
    de: 'Der Drehgeber braucht einen Anschluss mit zwei benachbarten Pins – wähle einen anderen Port.',
    en: 'The rotary encoder needs a port with two neighbouring pins – choose a different port.' },
  { re: /OSError:.*(Errno\s*(5|19|110|116)|ENODEV|ETIMEDOUT|No such device|Kein solches Ger)/i,
    de: 'Ein Bauteil antwortet nicht. Ist das Kabel fest eingesteckt und der richtige Port ausgewählt?',
    en: 'A part is not answering. Is the cable plugged in firmly and the right port selected?' },
  { re: /(No pull up found|Kein Pull-up|pull.?up)/i,
    de: 'Am I²C-Anschluss wird kein Bauteil gefunden. Steckt das Kabel am richtigen Port?',
    en: 'No part found on the I²C port. Is the cable in the right port?' },
  { re: /TypeError:.*NoneType/i,
    de: 'Eine Variable hat noch keinen Wert. Setze sie zuerst – zum Beispiel in „beim Start“.',
    en: 'A variable has no value yet. Set it first – for example in “on start”.' },
  { re: /TypeError:.*(subscript|abonnierbar|unsupported|nicht unterst|can't convert|kann nicht|str|'int'|'float')/i,
    de: 'Hier werden Zahl und Text gemischt. Nimm den Block „🔗 verbinde … und …“, um Zahlen in Text zu verwandeln.',
    en: 'Numbers and text are mixed here. Use the “🔗 join … and …” block to turn numbers into text.' },
  { re: /ZeroDivisionError/,
    de: 'Es wurde durch 0 geteilt – das geht in Mathe nicht. Prüfe deine Rechnung.',
    en: 'Something was divided by 0 – that is not possible. Check your calculation.' },
  { re: /IndexError/,
    de: 'Diese Position gibt es in der Liste nicht. Ist die Liste vielleicht kürzer?',
    en: 'This position does not exist in the list. Is the list shorter than you think?' },
  { re: /MemoryError/,
    de: 'Dem Board ist der Speicher ausgegangen. Versuche, das Programm kleiner zu machen.',
    en: 'The board ran out of memory. Try to make the program smaller.' },
  { re: /(SyntaxError|IndentationError)/,
    de: 'Der erzeugte Code ist fehlerhaft. Hast du den Code von Hand bearbeitet? Sonst melde den Fehler bitte bei uns.',
    en: 'The generated code is broken. Did you edit the code by hand? Otherwise please report the bug to us.' },
];
function _explainError(tail) {
  // Nur die letzte Fehlerzeile betrachten (ältere Tracebacks im Puffer ignorieren)
  const lines = tail.split(/\r?\n/).filter(l => /\w(?:Error|Exception):/.test(l));
  const line = lines[lines.length - 1] || '';
  for (const h of _ERROR_HINTS) {
    const m = line.match(h.re);
    if (!m) continue;
    const t = IS_EN ? h.en : h.de;
    return typeof t === 'function' ? t(m) : t;
  }
  return '';
}
function _showErrorHint(text) {
  const el = document.getElementById('error-hint');
  if (!el) return;
  if (el.textContent === (text ? '💡 ' + text : '')) return;
  el.textContent = text ? '💡 ' + text : '';
  el.hidden = !text;
  if (!document.getElementById('error-banner').hidden) drawErrorArrow(); // Box ist jetzt höher
}
function showErrorBanner() {
  // Code-/Serial-Panel einblenden, falls ausgeblendet – dort steht die Fehlermeldung
  if (document.getElementById('code-panel').style.display === 'none') {
    document.getElementById('btn-toggle-panel').click();
  }
  document.getElementById('error-banner').hidden = false;
  drawErrorArrow();
}
// Eine Kurve von der Mitte der Banner-Unterkante zur linken Mitte des seriellen Monitors
function drawErrorArrow() {
  const arrow = document.getElementById('error-arrow');
  const b = document.getElementById('error-banner').getBoundingClientRect();
  const m = document.getElementById('serial-output').getBoundingClientRect();
  const sx = b.left + b.width / 2, sy = b.bottom + 14;   // Abstand zum Banner
  const ex = m.left - 14,          ey = m.top + m.height / 2; // Abstand zum Monitor
  const pt = t => {                                        // Punkt auf der Kurve (kubische Bézier)
    const u = 1 - t, c = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [c[0] * sx + c[1] * sx + c[2] * (ex - 120) + c[3] * ex,
            c[0] * sy + c[1] * ey + c[2] * ey + c[3] * ey];
  };
  // Handgezeichnet: Punkte seitlich leicht wackeln lassen (an den Enden auslaufend)
  const N = 48, pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, [x, y] = pt(t), [x2, y2] = pt(Math.min(1, t + 0.01));
    const len = Math.hypot(x2 - x, y2 - y) || 1;
    const w = (3 * Math.sin(t * 17) + 2 * Math.sin(t * 41 + 1)) * Math.sin(Math.PI * t);
    pts.push(`${(x - (y2 - y) / len * w).toFixed(1)} ${(y + (x2 - x) / len * w).toFixed(1)}`);
  }
  arrow.querySelector('path').setAttribute('d',
    `M${pts.join(' L')} ` +
    `M${ex - 19} ${ey - 11} L${ex} ${ey} M${ex} ${ey} L${ex - 15} ${ey + 14}`); // Pfeilspitze leicht schief
  arrow.toggleAttribute('hidden', false); // SVG hat keine .hidden-Property
}
window.addEventListener('resize', () => {
  if (!document.getElementById('error-arrow').hasAttribute('hidden')) drawErrorArrow();
});
// Klick auf die Fehlerbox schließt Box und Pfeil (sonst erst beim nächsten erfolgreichen Upload)
document.getElementById('error-banner').addEventListener('click', () => hideErrorBanner());
function hideErrorBanner() {
  _errTail = '';
  _showErrorHint('');
  document.getElementById('error-banner').hidden = true;
  document.getElementById('error-arrow').toggleAttribute('hidden', true);
}

function appendSerialOutput(text) {
  _checkSerialError(text);
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
function showToast(msg, type = 'ok', ms = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast show ${type}`;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.className = 'toast', ms);
}
