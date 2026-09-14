// firmware_flash.js – UF2-Firmware per Browser auf das Board flashen
//
// Mechanik: Das Board im BOOTSEL-Modus (BOOTSEL gedrückt, USB neu
// angesteckt) zeigt seine Bootloader-Partition als FAT-Volume
// (RP2040 / RPI-RP2). Der Browser kann über die File System Access API
// darauf schreiben: Das gewählte UF2-Image (per fetch() vom ausliefernden
// Server, Liste + Größe + SHA-256 aus dem generierten js/firmware_manifest.js)
// wird in die Wurzel des Volumes geschrieben; der Bootloader validiert das
// vollständige Image und startet automatisch in die Firmware.
//
// Einziger User-Gesture-Punkt: die einmalige Volume-Wahl per Picker.
// Sicherheitsaspekt: Der ROM-Bootloader ist über die Mass-Storage-Schnittstelle
// NICHT überschreibbar – ein defektes/abgebrochenes Image lässt das Board im
// BOOTSEL-Modus, von dem aus neu geflasht werden kann (kein Brick-Risiko).
//
// Nach einem erfolgreichen Flash ist das alte CIRCUITPY-Volume neu formatiert:
// der persistierte Handle aus board_setup.js ist dann ungültig – der Nutzer
// wählt das neue Volume erneut über den „Libs prüfen"-Button.
//
// Greift zur Laufzeit auf globale app.js-/i18n.js-/board_setup.js-Funktionen
// zu (showToast, L, _entryExists) – diese existieren beim Aufruf bereits.

const FW_CHUNK_SIZE = 256 * 1024;   // Schreib-Chunk: Fortschritt + Blockfluss des Bootloaders

let _fwVolume = null;   // Directory-Handle des gewählten UF2-Volumes (offener Dialog)
let _fwBusy   = false;  // Sperre gegen paralleles Flashen

function _fwEl(id) { return document.getElementById(id); }
function _fwSleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ---------- Dialog ----------

function _fwSetStatus(text, cls) {
  const el = _fwEl('fw-status');
  if (!el) return;
  el.textContent = text || '';
  el.className = 'fw-status' + (cls ? ' ' + cls : '');
}

// Rendert die UF2-Liste aus dem generierten Manifest (Radio-Auswahl).
function _fwRenderList() {
  const list = _fwEl('fw-list');
  if (!list) return;
  list.textContent = '';
  const files = (typeof window.FIRMWARE_MANIFEST !== 'undefined')
    ? window.FIRMWARE_MANIFEST.files : [];
  if (!files.length) {
    const empty = document.createElement('div');
    empty.className = 'fw-empty';
    empty.textContent = L('Keine UF2-Firmwares gefunden (firmware/*.uf2) – bitte Build ausführen: node scripts/build_blocks.js',
                          'No UF2 firmwares found (firmware/*.uf2) – please run the build: node scripts/build_blocks.js');
    list.appendChild(empty);
    return;
  }
  files.forEach((f, i) => {
    const row = document.createElement('label');
    row.className = 'fw-item';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'fw-file';
    radio.value = String(i);
    if (i === 0) radio.checked = true;
    const info = document.createElement('span');
    info.className = 'fw-item-info';
    const name = document.createElement('span');
    name.className = 'fw-item-name';
    name.textContent = f.name;
    const meta = document.createElement('span');
    meta.className = 'fw-item-meta';
    meta.textContent = (f.size / (1024 * 1024)).toFixed(1) + ' MB · SHA-256 ' + f.sha256.slice(0, 16) + '…';
    info.append(name, meta);
    row.append(radio, info);
    list.appendChild(row);
  });
}

function openFwModal(volumeHandle) {
  _fwVolume = volumeHandle;
  _fwRenderList();
  const vname = _fwEl('fw-volume-name');
  if (vname) vname.textContent = volumeHandle.name;
  _fwSetStatus('', '');
  const flashBtn = _fwEl('fw-flash-btn');
  if (flashBtn) flashBtn.disabled = false;
  const modal = _fwEl('fw-modal');
  if (modal) modal.hidden = false;
}

function closeFwModal() {
  const modal = _fwEl('fw-modal');
  if (modal) modal.hidden = true;
  closeFwHelp();   // offenes Hilfe-Overlay mit schließen
  _fwVolume = null;
}

// ---------- Hilfe (Schritt-für-Schritt-Fotos) ----------

function openFwHelp() {
  const help = _fwEl('fw-help-modal');
  if (help) help.hidden = false;
}

function closeFwHelp() {
  const help = _fwEl('fw-help-modal');
  if (help) help.hidden = true;
}

// "Los geht's" im Hilfe-Overlay: Anleitung schließen und weiterleiten –
// ohne gewähltes Volume zuerst der Laufwerk-Picker, dann der Modal-Dialog;
// wenn schon ein Volume gewählt ist, direkt der Flash.
function fwHelpContinue() {
  if (_fwBusy) return;
  closeFwHelp();
  if (_fwVolume) flashSelectedFirmware();
  else onFirmwareButton();
}

// ---------- Button-Handler ----------

async function onFirmwareButton() {
  if (_fwBusy) return;
  if (typeof window.showDirectoryPicker !== 'function') {
    showToast(L('Browser unterstützt die File System Access API nicht – manuell flashen: Board in BOOTSEL-Modus und firmware/*.uf2 auf das RP2040-Laufwerk kopieren',
                'Browser does not support the File System Access API – flash manually: put the board in BOOTSEL mode and copy firmware/*.uf2 to the RP2040 drive'),
              'warn');
    return;
  }
  let vol;
  try {
    vol = await window.showDirectoryPicker();
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    console.warn('firmware_flash: Picker fehlgeschlagen:', e);
    showToast(L('Laufwerk-Auswahl fehlgeschlagen: ', 'Drive selection failed: ') + e.message, 'error');
    return;
  }
  // Plausibilität: Das UF2-Boot-Volumen ist leer; CIRCUITPY hat code.py/boot.py/lib.
  // Auf ein CIRCUITPY-Volumen geschrieben zu werden, ist harmlos, aber nutzlos.
  for (const name of ['code.py', 'boot.py', 'lib']) {
    if (await _entryExists(vol, name)) {
      showToast(L('Das sieht nach einem CIRCUITPY-Volume aus, nicht nach dem UF2-Bootloader-Laufwerk – bitte BOOTSEL gedrückt halten, USB neu anstecken und erneut wählen',
                  'That looks like a CIRCUITPY volume, not the UF2 bootloader drive – hold BOOTSEL, replug USB and pick again'),
                'warn');
      return;
    }
  }
  openFwModal(vol);
}

// ---------- Flash-Flow ----------

async function _fwSha256Hex(blob) {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Lädt die gewählte Firmware, verifiziert sie gegen das Manifest und
// schreibt sie chunkweise auf das UF2-Volume. Der Bootloader rebootet
// nach dem kompletten Image – die Volume-Invalidation gilt als Erfolgsnachweis.
async function flashSelectedFirmware() {
  if (_fwBusy || !_fwVolume) return;
  const sel = document.querySelector('input[name="fw-file"]:checked');
  if (!sel) return;
  const files = (typeof window.FIRMWARE_MANIFEST !== 'undefined')
    ? window.FIRMWARE_MANIFEST.files : [];
  const file = files[Number(sel.value)];
  if (!file) return;

  _fwBusy = true;
  const flashBtn = _fwEl('fw-flash-btn');
  if (flashBtn) flashBtn.disabled = true;
  try {
    // 1) Laden + verifizieren
    _fwSetStatus(L('Lade ' + file.name + ' …', 'Loading ' + file.name + ' …'));
    const resp = await fetch('firmware/' + file.name, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(L('Laden fehlgeschlagen (HTTP ' + resp.status + ')',
                                    'Fetch failed (HTTP ' + resp.status + ')'));
    const blob = await resp.blob();
    if (blob.size !== file.size) {
      throw new Error(L('Größen-Mismatch: ' + blob.size + ' statt ' + file.size + ' Bytes (Manifest)',
                        'Size mismatch: ' + blob.size + ' instead of ' + file.size + ' bytes (manifest)'));
    }
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      _fwSetStatus(L('SHA-256 wird geprüft …', 'Verifying SHA-256 …'));
      const actual = await _fwSha256Hex(blob);
      if (actual !== file.sha256) {
        throw new Error(L('SHA-256 passt nicht zum Manifest – Datei nicht geflasht',
                          'SHA-256 does not match the manifest – file not flashed'));
      }
    } else {
      console.warn('firmware_flash: crypto.subtle nicht verfügbar (kein Secure Context) – nur Größen-Check');
    }

    // 2) Schreiben (chunkweise, mit Fortschritt)
    const fh = await _fwVolume.getFileHandle(file.name, { create: true });
    const total = blob.size;
    const w = await fh.createWritable();
    for (let off = 0; off < total; off += FW_CHUNK_SIZE) {
      const chunk = blob.slice(off, Math.min(off + FW_CHUNK_SIZE, total));
      await w.write(chunk);
      const done = Math.min(off + chunk.size, total);
      _fwSetStatus(L('Schreibe ' + Math.round((done / total) * 100) + ' % …',
                     'Writing ' + Math.round((done / total) * 100) + ' % …'));
    }
    _fwSetStatus(L('Abschließen … (das Board startet jetzt neu)',
                   'Finalizing … (the board will reboot now)'));
    let writeError = null;
    try { await w.close(); } catch (e) { writeError = e; }  // Gerät trennt sich oft genau hier

    // 3) Erfolgsnachweis: Bootloader-Neustart → Volume verschwindet
    let gone = false;
    for (let i = 0; i < 2 && !gone; i++) {
      await _fwSleep(2000);
      try {
        const fh2 = await _fwVolume.getFileHandle(file.name, { create: false });
        await fh2.getFile();
      } catch (_) { gone = true; }   // Handle ungültig/Datei weg → Gerät neu gestartet
    }

    if (gone) {
      showToast(L('Firmware geflasht ✓ – das Board startet in die neue Firmware. Hinweis: Das CIRCUITPY-Volume ist neu – bitte per „Libs prüfen" erneut auswählen',
                  'Firmware flashed ✓ – the board is booting into the new firmware. Note: the CIRCUITPY volume is fresh – please re-select it via “Check libs”'),
                'ok');
      closeFwModal();
    } else if (writeError) {
      throw writeError;
    } else {
      showToast(L('Schreiben abgeschlossen, aber das Board hat nicht neu gestartet – bitte BOOTSEL gedrückt halten, USB neu anstecken und erneut flashen',
                  'Write finished, but the board did not reboot – hold BOOTSEL, replug USB and flash again'),
                'warn');
      _fwSetStatus(L('Board hat nicht neu gestartet – siehe Toast', 'Board did not reboot – see toast'), 'warn');
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    console.warn('firmware_flash: Flashen fehlgeschlagen:', e);
    showToast(L('Flashen fehlgeschlagen: ', 'Flashing failed: ') + e.message +
              L(' (das Board sollte im BOOTSEL-Modus sein – bitte erneut versuchen)',
                ' (the board should be in BOOTSEL mode – please retry)'),
              'error');
    _fwSetStatus(L('Fehler – siehe Toast. Board bleibt im BOOTSEL-Modus, erneuter Versuch ist sicher.',
                   'Error – see toast. The board stays in BOOTSEL mode, retrying is safe.'), 'error');
  } finally {
    _fwBusy = false;
    if (_fwVolume && flashBtn && _fwEl('fw-modal') && !_fwEl('fw-modal').hidden) {
      flashBtn.disabled = false;
    }
  }
}
