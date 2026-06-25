// storage.js – Programme speichern: Auto-Speichern, Versionierung, Export als code.py
// Nutzt Blockly-Serialisierung (Block-Zustand) + localStorage.
// Greift zur Laufzeit auf globale app.js-Funktionen zu (workspace, generateCode,
// updateCode, _createFixedBlock) – diese existieren beim Aufruf bereits.

const STORAGE_CURRENT  = 'makerspaceos.current';
const STORAGE_VERSIONS = 'makerspaceos.versions';
const VERSIONS_MAX     = 15;

// Einmalige, nicht-destruktive Migration: alte "circuitblox.*"/"circuitblox_*"-Keys
// auf die neuen "makerspaceos.*" kopieren. Die alten Einträge bleiben als Backup
// erhalten, damit keine gespeicherten Programme verloren gehen.
(function migrateLegacyStorageKeys() {
  const map = {
    'circuitblox.current':   'makerspaceos.current',
    'circuitblox.versions':  'makerspaceos.versions',
    'circuitblox_ai_key':    'makerspaceos_ai_key',
    'circuitblox_ai_model':  'makerspaceos_ai_model',
    'circuitblox_ai_blocks': 'makerspaceos_ai_blocks',
    'circuitblox_ai_chat':   'makerspaceos_ai_chat',
  };
  try {
    for (const oldKey in map) {
      const newKey = map[oldKey];
      if (localStorage.getItem(newKey) === null) {
        const val = localStorage.getItem(oldKey);
        if (val !== null) localStorage.setItem(newKey, val);
      }
    }
  } catch (e) { /* localStorage evtl. nicht verfügbar – ignorieren */ }
})();

// Migriert veraltete Block-Zustände auf aktuelle Feldnamen.
function migrateState(state) {
  if (!state || !state.blocks || !state.blocks.blocks) return state;
  function patchBlock(b) {
    if (b.type === 'actuator_lcd' && b.inputs) {
      // TEXT → LINE1 (Umbenennung vom einzeiligen auf zweizeiligen LCD-Block)
      if (b.inputs.TEXT && !b.inputs.LINE1) {
        b.inputs.LINE1 = b.inputs.TEXT;
        delete b.inputs.TEXT;
      }
      // VERSION-Feld entfernen (nicht mehr vorhanden)
      if (b.fields && b.fields.VERSION !== undefined) delete b.fields.VERSION;
      // Aufspaltung in zwei Blöcke: alter Kombi-Block → reiner Text-Block.
      // Die Farbe (COLOR) entfällt; dafür gibt es jetzt den Block "LCD Farbe".
      if (b.fields && b.fields.COLOR !== undefined) delete b.fields.COLOR;
      b.type = 'actuator_lcd_text';
    }
    // Schwellwert-Ereignisse: VALUE wurde vom Wert-Eingang zum Zahlenfeld.
    // Gespeicherte Zahl aus dem Shadow-Block in das neue Feld übernehmen.
    if (['when_distance', 'when_light', 'when_temperature', 'when_humidity'].includes(b.type)
        && b.inputs && b.inputs.VALUE) {
      const vi  = b.inputs.VALUE;
      const num = (vi.shadow && vi.shadow.fields && vi.shadow.fields.NUM)
               ?? (vi.block  && vi.block.fields  && vi.block.fields.NUM);
      if (num !== undefined) {
        b.fields = b.fields || {};
        if (b.fields.VALUE === undefined) b.fields.VALUE = num;
      }
      delete b.inputs.VALUE;
    }
    // Verschachtelte Blöcke rekursiv patchen
    for (const inp of Object.values(b.inputs || {})) {
      if (inp.block) patchBlock(inp.block);
      if (inp.shadow) patchBlock(inp.shadow);
    }
    if (b.next && b.next.block) patchBlock(b.next.block);
  }
  const patched = JSON.parse(JSON.stringify(state));
  for (const b of patched.blocks.blocks || []) patchBlock(b);
  return patched;
}

// Lädt einen Workspace-Zustand fehlertolerant: Blöcke mit unbekanntem Typ oder
// fehlenden Verbindungen werden still herausgefiltert; der Rest bleibt erhalten.
function safeLoadState(state, ws) {
  const migrated = migrateState(state);
  try {
    Blockly.serialization.workspaces.load(migrated, ws);
    return { ok: true, dropped: 0 };
  } catch (_) {
    // Einzelne Blöcke der obersten Ebene herausfiltern bis der Zustand lädt.
    const blocks = (migrated.blocks && migrated.blocks.blocks) ? [...migrated.blocks.blocks] : [];
    let dropped = 0;
    for (let i = blocks.length - 1; i >= 0; i--) {
      const candidate = { ...migrated, blocks: { ...migrated.blocks, blocks: blocks.filter((_, j) => j !== i) } };
      try {
        ws.clear();
        Blockly.serialization.workspaces.load(candidate, ws);
        dropped++;
        blocks.splice(i, 1);  // dauerhaft entfernen und weiter versuchen
        i = blocks.length;     // nochmal von vorne falls mehrere Fehler
      } catch (_2) { /* weiter */ }
    }
    if (dropped > 0) return { ok: true, dropped };
    ws.clear();
    return { ok: false, dropped: 0 };
  }
}

let _saveTimer = null;

// Aktuellen Workspace-Stand sichern
function saveCurrent() {
  if (!workspace) return;
  try {
    const state = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem(STORAGE_CURRENT,
      JSON.stringify({ state, code: generateCode(), ts: Date.now() }));
  } catch (e) {
    console.warn('saveCurrent fehlgeschlagen:', e);
  }
}

// Debounced-Variante für den Change-Listener
function saveCurrentDebounced() {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(saveCurrent, 800);
}

function loadCurrent() {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('loadCurrent fehlgeschlagen:', e);
    return null;
  }
}

function getVersions() {
  try {
    const raw = localStorage.getItem(STORAGE_VERSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Aktuellen Stand als neue Version ablegen (bei "Ausführen")
function pushVersion() {
  if (!workspace) return;
  try {
    const state    = Blockly.serialization.workspaces.save(workspace);
    const versions = getVersions();
    // Doppelte (unveränderte) Stände nicht erneut speichern
    if (versions.length && JSON.stringify(versions[0].state) === JSON.stringify(state)) return;
    versions.unshift({ state, code: generateCode(), ts: Date.now() });
    if (versions.length > VERSIONS_MAX) versions.length = VERSIONS_MAX;
    localStorage.setItem(STORAGE_VERSIONS, JSON.stringify(versions));
  } catch (e) {
    console.warn('pushVersion fehlgeschlagen:', e);
  }
}

function restoreVersion(index) {
  const v = getVersions()[index];
  if (!v) return;
  const result = safeLoadState(v.state, workspace);
  if (result.dropped) showToast(`${result.dropped} veraltete(r) Block(e) übersprungen`, 'warn');
  ensureFixedBlocks();
  updateCode();
  saveCurrent();
}

// Pflichtblöcke (SETUP + FÜR IMMER) garantieren – nach dem Laden eines Zustands
function ensureFixedBlocks() {
  for (const type of ['control_setup', 'control_forever']) {
    let blocks = workspace.getBlocksByType(type, false);
    if (!blocks.length) {
      _createFixedBlock(type, type === 'control_setup' ? 40 : 360, 40);
      blocks = workspace.getBlocksByType(type, false);
    }
    for (const b of blocks) {
      b.setDeletable(false);
      b.setMovable(true);
    }
  }
}

// Letztes gespeichertes File-Handle merken → Dialog öffnet beim nächsten Mal
// direkt im gleichen Ordner (CIRCUITPY, sobald der Nutzer es einmal navigiert hat).
let _lastBoardHandle = null;

// Generierten Code als code.py speichern (Datei-Dialog → CIRCUITPY-Laufwerk).
// CircuitPython lässt sein Laufwerk nicht per Serial beschreiben, daher Dateisystem-API.
async function saveToBoard(code) {
  if (window.showSaveFilePicker) {
    showToast('📂 Bitte zum CIRCUITPY-Laufwerk navigieren und code.py speichern', 'ok');
    const opts = {
      suggestedName: 'code.py',
      types: [{ description: 'Python', accept: { 'text/x-python': ['.py'] } }],
    };
    if (_lastBoardHandle) opts.startIn = _lastBoardHandle;
    const handle = await window.showSaveFilePicker(opts);
    _lastBoardHandle = handle;
    const writable = await handle.createWritable();
    await writable.write(code);
    await writable.close();
    return 'saved';
  }
  // Fallback (Browser ohne File System Access API): Download
  const blob = new Blob([code], { type: 'text/x-python' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'code.py';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
