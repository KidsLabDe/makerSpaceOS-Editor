// board_setup.js – Board-Bibliotheken (lib/) prüfen & aktualisieren
//
// Mechanik: Das Build-Skript (scripts/build_lib_manifest.js) legt js/lib_manifest.js
// mit dem libVersion-Aggregat an (SHA-256 über alle lib/-Dateien). Nach einem
// erfolgreichen Update speichert dieses Script die Versionsnummer als
// .makerspaceos_lib_version in der Wurzel des CIRCUITPY-Volumens des Boards.
// Der Start-Check ist dadurch nur noch ein String-Vergleich: persistedes
// CIRCUITPY-Handle aus IndexedDB + queryPermission({mode:'read'}) → bei
// 'granted' wird die eine kleine Datei still eingelesen (ohne Picker, ohne
// Pro-Datei-Hashing). Ohne vorherige Berechtigung bleibt der Button neutral
// (idle) bis zum ersten Klick.
//
// Der Update-Flow kopiert den kompletten lib/-Baum idempotent vom Repo
// (zweites Directory-Handle, einmalig gewählt und in IndexedDB persistiert)
// auf das Board, schreibt die Versionsdatei und startet das Board über Web
// Serial weich neu (Soft-Reboot) – danach wird automatisch wieder verbunden.
//
// CircuitPython lässt sein Laufwerk nicht per Serial beschreiben, daher
// File System Access API. Greift zur Laufzeit auf globale app.js-/i18n.js-
// Funktionen zu (serial, showToast, setConnected, L) – diese existieren
// beim Aufruf bereits.

const BS_DB_NAME      = 'makerspaceos-fs';
const BS_DB_VERSION   = 1;
const BS_STORE        = 'handles';
const BS_VERSION_FILE = '.makerspaceos_lib_version';  // in der CIRCUITPY-Wurzel

let _bsState      = 'idle';    // 'idle' | 'ok' | 'stale'
let _bsToastShown = false;     // einmaliger Warn-Toast pro Sitzungsstart
let _bsCopying    = false;     // Sperre gegen parallele Updates

// ---------- IndexedDB: persistente Directory-Handles (CIRCUITPY + Repo lib/) ----------

function _bsOpenDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB nicht verfügbar')); return; }
    const req = indexedDB.open(BS_DB_NAME, BS_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(BS_STORE)) db.createObjectStore(BS_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

async function _bsSaveHandle(key, handle) {
  const db = await _bsOpenDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(BS_STORE, 'readwrite');
      tx.objectStore(BS_STORE).put(handle, key);
      tx.oncomplete = () => resolve();
      tx.onerror   = () => reject(tx.error);
    });
  } finally { db.close(); }
}

async function _bsLoadHandle(key) {
  const db = await _bsOpenDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx  = db.transaction(BS_STORE, 'readonly');
      const req = tx.objectStore(BS_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => reject(req.error);
    });
  } finally { db.close(); }
}

function _bsSleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// Existiert `name` im Ordner (als Datei ODER Unterverzeichnis)?
async function _entryExists(dirHandle, name) {
  try { await dirHandle.getDirectoryHandle(name); return true; } catch (_) {}
  try { await dirHandle.getFileHandle(name); return true; } catch (_) { return false; }
}

// ---------- Versionsdatei auf dem Board lesen/schreiben ----------

// Liefert die gespeicherte libVersion (String) oder null (Datei fehlt/leer).
async function readLibVersion(cpHandle) {
  try {
    const fh   = await cpHandle.getFileHandle(BS_VERSION_FILE);
    const text = (await (await fh.getFile()).text()).trim();
    return text || null;
  } catch (_) { return null; }
}

// Versionsdatei schreiben (mit Größen-Check, 3 Versuche – crswap-Falle auf dem
// FAT-Laufwerk des Boards, vgl. storage.js). Liefert true bei Erfolg.
async function writeLibVersion(cpHandle, version) {
  const fh = await cpHandle.getFileHandle(BS_VERSION_FILE, { create: true });
  const payload  = version + '\n';
  const expected = new Blob([payload]).size;
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (attempt > 1) await _bsSleep(600 * attempt);
    try {
      const w = await fh.createWritable();
      await w.write(payload);
      await w.close();
      const file = await fh.getFile();
      if (file.size === expected) return true;
      console.warn(`writeLibVersion: Versuch ${attempt} ergab ${file.size} statt ${expected} Bytes`);
    } catch (e) {
      if (e && e.name === 'AbortError') throw e;
      console.warn(`writeLibVersion: Versuch ${attempt} fehlgeschlagen:`, e);
    }
  }
  return false;
}

// ---------- Button-Zustand ----------

function setButtonState(state) {
  _bsState = state;
  const btn = document.getElementById('btn-board-libs');
  if (!btn) return;
  const label = btn.querySelector('.btn-label');
  btn.classList.remove('btn-board-libs--ok', 'btn-board-libs--stale');
  if (state === 'ok') {
    btn.classList.add('btn-board-libs--ok');
    if (label) label.textContent = L('Libs aktuell', 'Libs up to date');
    btn.title = L('Bibliotheken auf dem Board sind aktuell', 'Board libraries are up to date');
  } else if (state === 'stale') {
    btn.classList.add('btn-board-libs--stale');
    if (label) label.textContent = L('Jetzt aktualisieren', 'Update now');
    btn.title = L('Bibliotheken (lib/) auf dem Board aktualisieren', 'Update the board\'s lib/ libraries');
  } else {
    if (label) label.textContent = L('Libs prüfen', 'Check libs');
    btn.title = L('Bibliotheken (lib/) auf dem Board prüfen', 'Check the board\'s lib/ libraries');
  }
}

function _bsToastIfStale(state) {
  if (state === 'stale' && !_bsToastShown) {
    _bsToastShown = true;
    showToast(
      L('Board hat veraltete lib/-Bibliotheken – „Jetzt aktualisieren“ drücken',
        'Board has outdated lib/ libraries – press “Update now”'),
      'warn');
  }
}

// ---------- Start-Check (leise, nur wenn Berechtigung vorliegt) ----------

// Liefert 'ok' | 'stale' | 'unknown' (unknown = kein Handle oder keine
// Berechtigung → Button bleibt neutral). Setzt dabei den Button-Zustand.
async function fastCheck() {
  if (typeof window.showDirectoryPicker !== 'function') { setButtonState('idle'); return 'unknown'; }
  const handle = await _bsLoadHandle('circuitpy').catch(() => null);
  if (!handle) { setButtonState('idle'); return 'unknown'; }
  let perm = 'prompt';
  try { perm = await handle.queryPermission({ mode: 'read' }); } catch (_) {}
  if (perm !== 'granted') { setButtonState('idle'); return 'unknown'; }
  const state = await _checkWithHandle(handle);
  setButtonState(state);
  _bsToastIfStale(state);
  return state;
}

async function _checkWithHandle(cpHandle) {
  const stored = await readLibVersion(cpHandle);
  const expected = (typeof window.LIB_MANIFEST !== 'undefined') ? window.LIB_MANIFEST.libVersion : null;
  return (stored && expected && stored === expected) ? 'ok' : 'stale';
}

// ---------- Handle sicherstellen (Picker/Berechtigung im Klick-Kontext) ----------

// Liefert ein CIRCUITPY-Volume-Handle mit der gewünschten Berechtigung oder
// null (abgebrochen/verweigert). Persistiert das Handle für den Start-Check.
async function _ensureCircuitPyHandle(mode) {
  let handle = await _bsLoadHandle('circuitpy').catch(() => null);
  if (!handle) {
    handle = await window.showDirectoryPicker({ mode });
    await _bsSaveHandle('circuitpy', handle).catch(() => {});
  }
  let perm = 'prompt';
  try { perm = await handle.queryPermission({ mode }); } catch (_) {}
  if (perm !== 'granted') {
    const asked = await handle.requestPermission({ mode });
    if (asked !== 'granted') return null;
  }
  return handle;
}

// Repo-Handle für lib/: einmalig wählen, persistieren, Validierung über
// makerspaceos.py. Bei veraltetem/ungültigem Handle neu wählen.
async function _ensureRepoLibHandle() {
  let handle = await _bsLoadHandle('repoLib').catch(() => null);
  if (handle && await _repoLibUsable(handle)) return handle;
  // (veraltetes Handle unten durch die Neuauswahl überschrieben)
  showToast(L('📂 Bitte den lib/-Ordner des makerSpaceOS-Editors wählen',
              '📂 Please select the lib/ folder of the makerSpaceOS-Editor'), 'ok');
  handle = await window.showDirectoryPicker();
  await _bsSaveHandle('repoLib', handle).catch(() => {});
  if (await _repoLibUsable(handle)) return handle;
  showToast(L('Das ist vermutlich nicht der lib/-Ordner (makerspaceos.py fehlt) – bitte neu wählen',
              'This is probably not the lib/ folder (makerspaceos.py is missing) – please pick again'), 'warn');
  return null;
}

async function _repoLibUsable(handle) {
  let perm = 'prompt';
  try { perm = await handle.queryPermission({ mode: 'read' }); } catch (_) { return false; }
  if (perm !== 'granted') {
    try {
      const asked = await handle.requestPermission({ mode: 'read' });
      if (asked !== 'granted') return false;
    } catch (_) { return false; }
  }
  try { await handle.getFileHandle('makerspaceos.py'); return true; } catch (_) { return false; }
}

// ---------- Klick-Handler (State-Maschine) ----------

async function onBoardLibsClick() {
  if (_bsCopying) return;
  if (typeof window.showDirectoryPicker !== 'function') {
    showToast(L('Browser unterstützt die Datei-System-API nicht – bitte lib/ manuell kopieren (scripts/sync_lib.sh)',
                'Browser does not support the File System Access API – please copy lib/ manually (scripts/sync_lib.sh)'),
              'warn');
    return;
  }
  try {
    if (_bsState === 'stale') {
      await updateBoardLibs();
    } else if (_bsState === 'ok') {
      // leiser Re-Check (Berechtigung darf nicht fehlen)
      const handle = await _ensureCircuitPyHandle('read');
      if (handle) { setButtonState(await _checkWithHandle(handle)); _bsToastIfStale(_bsState); }
    } else {
      // idle → CIRCUITPY-Volume wählen (falls nötig) und prüfen
      const handle = await _ensureCircuitPyHandle('read');
      if (!handle) return;
      setButtonState(await _checkWithHandle(handle));
      _bsToastIfStale(_bsState);
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;   // Picker/Dialog abgebrochen
    console.warn('board_setup: prüfen fehlgeschlagen:', e);
    showToast(L('Prüfen fehlgeschlagen: ', 'Check failed: ') + e.message, 'error');
  }
}

// ---------- Update-Flow: komplettes idempotentes Kopieren ----------

async function updateBoardLibs() {
  if (_bsCopying) return;
  _bsCopying = true;
  try {
    const cp = await _ensureCircuitPyHandle('readwrite');
    if (!cp) return;
    const lib = await _ensureRepoLibHandle();
    if (!lib) return;

    // Sinn-Check: CIRCUITPY-Volumen erkennen (code.py/boot.py/lib) – falls der
    // Nutzer versehentlich einen anderen Ordner gewählt hat.
    let isCircuitPy = false;
    for (const name of ['code.py', 'boot.py', 'lib']) {
      if (await _entryExists(cp, name)) { isCircuitPy = true; break; }
    }
    if (!isCircuitPy) {
      showToast(L('Das gewählte Laufwerk sieht nicht nach CIRCUITPY aus (kein code.py/boot.py/lib) – kopiere trotzdem weiter?',
                  'The selected drive does not look like CIRCUITPY (no code.py/boot.py/lib) – continuing anyway?'),
                'warn');
      await _bsSleep(2500);  // Toast anzeigen lassen, bevor's weitergeht
    }

    showToast(L('Bibliotheken werden auf das Board kopiert …', 'Copying libraries to the board …'), 'ok');
    const libDirOnBoard = await cp.getDirectoryHandle('lib', { create: true });
    let copied = 0;
    try {
      copied = await _copyLibTree(lib, libDirOnBoard, '');
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      console.warn('board_setup: Kopieren fehlgeschlagen:', e);
      showToast(L('Kopieren fehlgeschlagen (nach ' + copied + ' Dateien): ',
                  'Copy failed (after ' + copied + ' files): ') + e.message, 'error');
      return;
    }

    const versionOk = await writeLibVersion(cp, window.LIB_MANIFEST.libVersion);
    if (!versionOk) {
      showToast(L('Bibliotheken kopiert, aber Versionsdatei fehlgeschlagen – bitte Board neu starten',
                  'Libraries copied, but writing the version file failed – please reboot the board'), 'warn');
    }

    if (typeof serial !== 'undefined' && serial && serial.isConnected) {
      await _softRebootAndReconnect();
    } else {
      showToast(L('Bibliotheken aktualisiert – bitte Board neu starten (USB abziehen/einstecken)',
                  'Libraries updated – please reboot the board (unplug/replug USB)'), 'warn');
    }

    // Endkontrolle
    const state = await _checkWithHandle(cp).catch(() => 'stale');
    setButtonState(state);
    _bsToastIfStale(state);
    if (state === 'ok') {
      showToast(L('Bibliotheken sind aktuell ✓', 'Libraries are up to date ✓'), 'ok');
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;   // Picker abgebrochen
    console.warn('board_setup: Update fehlgeschlagen:', e);
    showToast(L('Update fehlgeschlagen: ', 'Update failed: ') + e.message, 'error');
  } finally {
    _bsCopying = false;
  }
}

// Rekursiver, idempotenter Kopiervorgang. srcDir/destDir = Directory-Handles,
// subPath = relativer Pfad (Schrittweise-Anlegen der Unterordner). __pycache__
// wird übersprungen. Liefert die Anzahl kopierter Dateien; wirft bei
// Schreibfehlern (nach 3 Versuchen) mit Dateinamen.
async function _copyLibTree(srcDir, destDir, subPath) {
  let dest = destDir;
  if (subPath) {
    for (const part of subPath.split('/')) {
      dest = await dest.getDirectoryHandle(part, { create: true });
    }
  }
  let count = 0;
  for await (const entry of srcDir.values()) {
    if (entry.kind === 'directory') {
      if (entry.name === '__pycache__') continue;
      count += await _copyLibTree(entry, destDir, subPath ? subPath + '/' + entry.name : entry.name);
    } else {
      const file = await entry.getFile();
      const destHandle = await dest.getFileHandle(entry.name, { create: true });
      const ok = await _writeFileVerified(destHandle, file);
      if (!ok) throw new Error(L('Datei konnte nicht geschrieben werden: ' + entry.name,
                                 'Could not write file: ' + entry.name));
      count++;
    }
  }
  return count;
}

// Dateiinhalte schreiben mit Größen-Check (crswap-0-Byte-Falle), 3 Versuche.
async function _writeFileVerified(fileHandle, file) {
  const expected = file.size;
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (attempt > 1) await _bsSleep(600 * attempt);
    try {
      const w = await fileHandle.createWritable();
      await w.write(file);
      await w.close();
      const check = await fileHandle.getFile();
      if (check.size === expected) return true;
      console.warn(`_writeFileVerified: ${fileHandle.name}: ${check.size} statt ${expected} Bytes (Versuch ${attempt})`);
    } catch (e) {
      if (e && e.name === 'AbortError') throw e;
      console.warn(`_writeFileVerified: ${fileHandle.name}: Versuch ${attempt} fehlgeschlagen:`, e);
    }
  }
  return false;
}

// ---------- Soft-Reboot über Serial + automatische Wiederverbindung ----------

// Sendet microcontroller.reboot() (unterdrückt dabei den „Board getrennt"-
// Toast), wartet auf das neu erscheinende USB-Gerät und öffnet den bereits
// autorisierten Port wieder (getPorts() – KEIN neues requestPort()-Dialog).
async function _softRebootAndReconnect() {
  showToast(L('Board wird neu gestartet …', 'Rebooting the board …'), 'ok');
  const prevOnDisconnect = serial.onDisconnect;
  serial.onDisconnect = null;   // erwartete Trennung nicht als Fehler anzeigen
  try {
    // Erst sicher ins normale REPL: laufendes Programm unterbrechen (Ctrl+C)
    // und die Raw-REPL verlassen (Ctrl+B) – dort würde eine reine Zeile
    // nämlich NICHT ausgeführt. Danach den Reboot-Befehl senden.
    await serial.stop();
    await _bsSleep(300);
    await serial.sendLine('import microcontroller; microcontroller.reboot()');
  } catch (_) { /* Board trennt sich, während die Zeile geschrieben wird */ }

  const ok = await _reconnectSerial(10000);
  serial.onDisconnect = prevOnDisconnect;
  if (typeof setConnected === 'function') setConnected(ok);
  if (!ok) {
    showToast(L('Automatische Wiederverbindung fehlgeschlagen – bitte Board manuell neu starten (USB abziehen/einstecken)',
                'Auto-reconnect failed – please reboot the board manually (unplug/replug USB)'), 'warn');
  }
}

async function _reconnectSerial(timeoutMs) {
  if (!('serial' in navigator)) return false;
  await _bsSleep(1500);   // altes USB-Gerät trennen + Board neu starten abwarten
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    let ports = [];
    try { ports = await navigator.serial.getPorts(); } catch (_) {}
    for (const port of ports) {
      if (!port || port.open || port === serial.port) continue;
      try {
        await port.open({ baudRate: 115200 });
        serial.port = port;
        serial._intentionalClose = false;
        serial._bindDisconnectEvent();
        serial._startReading();
        return true;
      } catch (_) { /* Gerät noch nicht bereit – weiter pollen */ }
    }
    await _bsSleep(500);
  }
  return false;
}

// ---------- Init (wird von app.js beim Start aufgerufen) ----------

async function initBoardSetup() {
  setButtonState('idle');
  try { await fastCheck(); } catch (e) { console.warn('board_setup: Start-Check fehlgeschlagen:', e); }
}
