// storage.js – Programme speichern: Auto-Speichern, Versionierung, Export als main.py
// Nutzt Blockly-Serialisierung (Block-Zustand) + localStorage.
// Greift zur Laufzeit auf globale app.js-Funktionen zu (workspace, generateCode,
// updateCode, _createFixedBlock) – diese existieren beim Aufruf bereits.

const STORAGE_CURRENT  = 'circuitblox.current';
const STORAGE_VERSIONS = 'circuitblox.versions';
const VERSIONS_MAX     = 15;

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
  Blockly.serialization.workspaces.load(v.state, workspace);
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

// Generierten Code als main.py speichern (Datei-Dialog → CIRCUITPY-Laufwerk).
// CircuitPython lässt sein Laufwerk nicht per Serial beschreiben, daher Dateisystem-API.
async function saveToBoard(code) {
  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'main.py',
      types: [{ description: 'Python', accept: { 'text/x-python': ['.py'] } }],
    });
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
  a.download = 'main.py';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
