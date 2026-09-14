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
// Der Update-Flow lädt den kompletten lib/-Baum per fetch() von dem Server,
// der den Editor ausliefert (Dateiliste + Größen aus dem generierten
// js/lib_manifest.js – kein lokaler Repo-Ordner nötig: ein Nutzer mit nur
// dem Browser kann so ein leeres Board bespielen) und kopiert ihn idempotent
// auf das Board, schreibt die Versionsdatei und startet das Board über Web
// Serial weich neu (Soft-Reboot) – danach wird automatisch wieder verbunden.
//
// CircuitPython lässt sein Laufwerk nicht per Serial beschreiben, daher
// File System Access API – die einmalige Wahl des CIRCUITPY-Volumens (per
// Picker) bleibt der einzige User-Gesture-Punkt. Greift zur Laufzeit auf
// globale app.js-/i18n.js-Funktionen zu (serial, showToast, setConnected, L)
// – diese existieren beim Aufruf bereits.

const BS_DB_NAME      = 'makerspaceos-fs';
const BS_DB_VERSION   = 1;
const BS_STORE        = 'handles';
const BS_VERSION_FILE = '.makerspaceos_lib_version';  // in der CIRCUITPY-Wurzel

let _bsState      = 'idle';    // 'idle' | 'ok' | 'stale'
let _bsToastShown = false;     // einmaliger Warn-Toast pro Sitzungsstart
let _bsCopying    = false;     // Sperre gegen parallele Updates

// ---------- IndexedDB: persistenter CIRCUITPY-Volume-Handle ----------

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

// ---------- Fetch-Quelle: lib/-Dateien vom ausliefernden Server ----------

// Lädt eine lib/-Datei per fetch() relativ zur Seite (z. B. "lib/neopixel.py")
// und liefert den Blob. Wirft bei fehlendem Manifest, HTTP-Fehler oder
// file://-Kontext (mit Hinweis im Error-Text).
async function _fetchLibFile(path) {
  if (typeof window.LIB_MANIFEST === 'undefined' || !Array.isArray(window.LIB_MANIFEST.files)) {
    throw new Error(L('lib_manifest.js fehlt – bitte Build ausführen (node scripts/build_blocks.js)',
                      'lib_manifest.js is missing – please run the build (node scripts/build_blocks.js)'));
  }
  const resp = await fetch('lib/' + path, { cache: 'no-cache' });
  let hint = '';
  if (!resp.ok && location.protocol === 'file:') {
    hint = L(' – Hinweis: Seite läuft unter file://, bitte per HTTP-Server ausliefern (z. B. python3 -m http.server) oder scripts/sync_lib.sh nutzen',
             ' – Note: page runs under file://, serve it via an HTTP server (e.g. python3 -m http.server) or use scripts/sync_lib.sh');
  }
  if (!resp.ok) throw new Error(L('Laden fehlgeschlagen: lib/' + path + ' (HTTP ' + resp.status + ')' + hint,
                                  'Fetch failed: lib/' + path + ' (HTTP ' + resp.status + ')' + hint));
  const blob = await resp.blob();
  const manifest = window.LIB_MANIFEST.files.find((f) => f.path === path);
  if (manifest && blob.size !== manifest.size) {
    console.warn(`_fetchLibFile: ${path}: ${blob.size} statt Manifest-Größe ${manifest.size} Bytes`);
  }
  return blob;
}

// Unterordner-Handle sicherstellen (idempotent, mit Cache gegen erneute
// FAT-Zugriffe). subPath = relativ zum lib/-Root, z. B. "adafruit_bus_device".
async function _ensureSubDir(libRoot, subPath, cache) {
  const parts = subPath.split('/');
  let dir = libRoot;
  for (let i = 0; i < parts.length; i++) {
    const key = parts.slice(0, i + 1).join('/');
    let next = cache.get(key);
    if (!next) { next = await dir.getDirectoryHandle(parts[i], { create: true }); cache.set(key, next); }
    dir = next;
  }
  return dir;
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

    const libDirOnBoard = await cp.getDirectoryHandle('lib', { create: true });
    let copied = 0;
    try {
      copied = await _copyLibTreeFromServer(libDirOnBoard);
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
    let msg = e.message;
    if (location.protocol === 'file:' && e && e.name === 'TypeError') {
      msg += L(' – Hinweis: Die Seite muss per HTTP-Server ausgeliefert werden (z. B. python3 -m http.server), Fallback: scripts/sync_lib.sh',
               ' – Note: the page must be served via an HTTP server (e.g. python3 -m http.server), fallback: scripts/sync_lib.sh');
    }
    showToast(L('Update fehlgeschlagen: ', 'Update failed: ') + msg, 'error');
  } finally {
    _bsCopying = false;
  }
}

// Idempotentes Kopieren des kompletten lib/-Baums: Die Dateiliste kommt aus
// dem generierten Manifest (window.LIB_MANIFEST.files – __pycache__ ist dort
// nicht enthalten), der Inhalt wird per fetch() von dem Server geladen, der
// die Seite ausliefert (kein lokaler Repo-Ordner nötig). Fortschritt als
// Toast pro Datei. Liefert die Anzahl kopierter Dateien; wirft bei
// Fetch-/Schreibfehlern mit Dateinamen.
async function _copyLibTreeFromServer(libRoot) {
  if (typeof window.LIB_MANIFEST === 'undefined' || !Array.isArray(window.LIB_MANIFEST.files)
      || window.LIB_MANIFEST.files.length === 0) {
    throw new Error(L('lib_manifest.js fehlt oder ist leer – bitte Build ausführen (node scripts/build_blocks.js)',
                      'lib_manifest.js is missing or empty – please run the build (node scripts/build_blocks.js)'));
  }
  const files = window.LIB_MANIFEST.files;
  const total = files.length;
  const dirCache = new Map();   // Subpfad → Directory-Handle (vermeidet FAT-Zugriffe)
  let copied = 0;
  for (let i = 0; i < total; i++) {
    const entry = files[i];
    showToast(L('Kopiere ' + (i + 1) + '/' + total + ': ' + entry.path,
                'Copying ' + (i + 1) + '/' + total + ': ' + entry.path), 'ok');
    const blob = await _fetchLibFile(entry.path);
    const parts = entry.path.split('/');
    const fileName = parts.pop();
    const dest = parts.length ? await _ensureSubDir(libRoot, parts.join('/'), dirCache) : libRoot;
    const fh = await dest.getFileHandle(fileName, { create: true });
    if (!await _writeFileVerified(fh, blob)) {
      throw new Error(L('Datei konnte nicht geschrieben werden: ' + entry.path,
                        'Could not write file: ' + entry.path));
    }
    copied++;
  }
  return copied;
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
