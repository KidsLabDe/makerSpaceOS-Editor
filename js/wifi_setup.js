// wifi_setup.js – Dialog „WLAN einrichten“: schreibt SSID/Passwort in
// settings.toml auf dem Board (CIRCUITPY_WIFI_SSID / CIRCUITPY_WIFI_PASSWORD).
//
// Zugangsdaten landen NUR in settings.toml auf dem Board – nicht im Workspace,
// nicht im localStorage, nicht im Projekt-Export. Das Formular wird beim
// Schließen geleert.
//
// Zwei Wege je nach Board:
//  - Boards ohne CIRCUITPY-Laufwerk (klassischer ESP32: Robo ESP32, D1 R32,
//    BOARD.usbDrive === false): Das Dateisystem ist dort vom Board aus
//    beschreibbar → Schreiben per Raw REPL über Web Serial (serial.execSilent).
//  - Boards mit Laufwerk (ESP32-S2 …): CircuitPython sperrt das Schreiben vom
//    Board aus, solange der Computer das Laufwerk hat → Schreiben über die
//    File System Access API (CIRCUITPY-Handle aus board_setup.js).
// In beiden Fällen bleiben andere Einträge in settings.toml erhalten.
'use strict';

const _WIFI_KEYS = ['CIRCUITPY_WIFI_SSID', 'CIRCUITPY_WIFI_PASSWORD'];

function _wifiEl(id) { return document.getElementById(id); }

// TOML-String in Anführungszeichen (Backslash und " maskieren)
function _tomlString(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// Bestehenden settings.toml-Text mit neuen WLAN-Daten zusammenführen
function _mergeSettings(oldText, ssid, password) {
  const lines = String(oldText || '').split('\n')
    .filter(l => !_WIFI_KEYS.includes(l.split('=')[0].trim()));
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  lines.push(`CIRCUITPY_WIFI_SSID = ${_tomlString(ssid)}`,
             `CIRCUITPY_WIFI_PASSWORD = ${_tomlString(password)}`);
  return lines.join('\n') + '\n';
}

function _wifiStatus(text, kind) {
  const el = _wifiEl('wifi-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'fw-status' + (kind ? ' ' + kind : '');
}

function openWifiModal() {
  _wifiEl('wifi-ssid').value = '';
  _wifiEl('wifi-password').value = '';
  _wifiStatus('', '');
  _wifiEl('wifi-modal').hidden = false;
  _wifiEl('wifi-ssid').focus();
}

function closeWifiModal() {
  _wifiEl('wifi-modal').hidden = true;
  _wifiEl('wifi-ssid').value = '';
  _wifiEl('wifi-password').value = '';
  _wifiEl('wifi-password').type = 'password';
}

// ── Weg 1: per Raw REPL (Board schreibt selbst) ────────────────────────────

async function _wifiSaveViaSerial(ssid, password) {
  // Die Werte stehen als JSON-String-Literale im Python-Code (gültige
  // Python-Syntax, auch für " \ und Umlaute). Zusammenführen macht das Board.
  const code = [
    'def _q(s):',
    '    return \'"\' + s.replace("\\\\", "\\\\\\\\").replace(\'"\', \'\\\\"\') + \'"\'',
    '_p = "/settings.toml"',
    'try:',
    '    with open(_p) as _f:',
    '        _z = _f.read().split("\\n")',
    'except OSError:',
    '    _z = []',
    `_z = [l for l in _z if l.split("=")[0].strip() not in ${JSON.stringify(_WIFI_KEYS).replace('[', '(').replace(']', ')')}]`,
    'while _z and not _z[-1].strip():',
    '    _z.pop()',
    `_z.append("CIRCUITPY_WIFI_SSID = " + _q(${JSON.stringify(ssid)}))`,
    `_z.append("CIRCUITPY_WIFI_PASSWORD = " + _q(${JSON.stringify(password)}))`,
    'try:',
    '    with open(_p, "w") as _f:',
    '        _f.write("\\n".join(_z) + "\\n")',
    '    print(">>" + "GESPEICHERT<<")',
    'except OSError as _e:',
    '    print(">>" + "NURLESEN " + str(_e) + "<<")',
    '',
  ].join('\n');
  const out = await serial.execSilent(code, '<<', 5000);
  if (out.includes('>>GESPEICHERT<<')) return 'ok';
  if (out.includes('>>NURLESEN')) return 'readonly';
  console.warn('WLAN-Dialog: unerwartete Antwort', out);
  throw new Error(L('Das Board hat das Speichern nicht bestätigt.', 'The board did not confirm saving.'));
}

// ── Weg 2: über das CIRCUITPY-Laufwerk (File System Access API) ────────────

async function _wifiSaveViaDrive(ssid, password) {
  if (!window.showDirectoryPicker) {
    throw new Error(L('Dieser Browser kann nicht aufs Laufwerk schreiben – bitte Chrome oder Edge nutzen.',
                      'This browser cannot write to the drive – please use Chrome or Edge.'));
  }
  const dir = await _ensureCircuitPyHandle('readwrite');   // aus board_setup.js
  if (!dir) throw new Error(L('Kein Zugriff auf das CIRCUITPY-Laufwerk.', 'No access to the CIRCUITPY drive.'));
  let oldText = '';
  try { oldText = await (await (await dir.getFileHandle('settings.toml')).getFile()).text(); }
  catch (_) { /* Datei gibt es noch nicht */ }
  const fh = await dir.getFileHandle('settings.toml', { create: true });
  const blob = new Blob([_mergeSettings(oldText, ssid, password)], { type: 'text/plain' });
  if (!await _writeFileVerified(fh, blob)) {                // aus board_setup.js
    throw new Error(L('settings.toml konnte nicht geschrieben werden.', 'Could not write settings.toml.'));
  }
  return 'ok';
}

async function onWifiSave() {
  const ssid = _wifiEl('wifi-ssid').value;
  const password = _wifiEl('wifi-password').value;
  if (!ssid.trim()) {
    _wifiStatus(L('Bitte den WLAN-Namen eintragen.', 'Please enter the Wi-Fi name.'), 'warn');
    return;
  }
  if (password && password.length < 8) {
    _wifiStatus(L('WPA2-Passwörter haben mindestens 8 Zeichen.', 'WPA2 passwords have at least 8 characters.'), 'warn');
    return;
  }
  const btn = _wifiEl('wifi-save-btn');
  btn.disabled = true;
  try {
    let res;
    if (BOARD.usbDrive === false) {
      if (!serial.isConnected) {
        _wifiStatus(L('Bitte zuerst mit dem Board verbinden.', 'Please connect to the board first.'), 'warn');
        return;
      }
      _wifiStatus(L('Speichere auf dem Board …', 'Saving on the board …'), '');
      res = await _wifiSaveViaSerial(ssid, password);
    } else {
      _wifiStatus(L('Bitte das CIRCUITPY-Laufwerk wählen …', 'Please choose the CIRCUITPY drive …'), '');
      res = await _wifiSaveViaDrive(ssid, password);
    }
    if (res === 'readonly') {
      _wifiStatus(L('Das Board ist schreibgeschützt (Laufwerk am Computer). Bitte ein Board ohne Laufwerk nutzen oder settings.toml direkt auf CIRCUITPY anlegen.',
                    'The board is read-only (drive mounted on the computer). Please create settings.toml directly on CIRCUITPY.'), 'error');
      return;
    }
    _wifiStatus(L('Gespeichert. Mit „Verbindung testen“ prüfen, ob das Board ins WLAN kommt.',
                  'Saved. Use "Test connection" to check whether the board gets onto the Wi-Fi.'), '');
    showToast(L('WLAN-Daten auf dem Board gespeichert', 'Wi-Fi settings saved on the board'), 'ok');
  } catch (e) {
    if (e && e.name === 'AbortError') { _wifiStatus('', ''); return; }
    _wifiStatus(L('Fehler: ', 'Error: ') + e.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

// Verbindung mit den gespeicherten Daten testen (braucht die serielle Verbindung)
async function onWifiTest() {
  if (!serial.isConnected) {
    _wifiStatus(L('Zum Testen bitte zuerst mit dem Board verbinden.', 'Please connect to the board to test.'), 'warn');
    return;
  }
  const btn = _wifiEl('wifi-test-btn');
  btn.disabled = true;
  _wifiStatus(L('Teste Verbindung (bis zu 15 Sekunden) …', 'Testing connection (up to 15 seconds) …'), '');
  try {
    const code = [
      'import os',
      'try:',
      '    import wifi',
      '    _s = os.getenv("CIRCUITPY_WIFI_SSID")',
      '    if not _s:',
      '        print(">>" + "FEHLER keine Zugangsdaten in settings.toml<<")',
      '    else:',
      '        if not wifi.radio.connected:',
      '            wifi.radio.connect(_s, os.getenv("CIRCUITPY_WIFI_PASSWORD") or "", timeout=10)',
      '        print(">>" + "IP " + str(wifi.radio.ipv4_address) + " " + str(wifi.radio.ap_info.rssi) + "<<")',
      'except Exception as _e:',
      '    print(">>" + "FEHLER " + str(_e) + "<<")',
      '',
    ].join('\n');
    const out = await serial.execSilent(code, '<<', 15000);
    const ip = out.match(/>>IP (\S+) (-?\d+)<</);
    const err = out.match(/>>FEHLER (.*?)<</);
    if (ip) {
      _wifiStatus(L(`Verbunden! IP-Adresse ${ip[1]}, Signal ${ip[2]} dBm.`, `Connected! IP address ${ip[1]}, signal ${ip[2]} dBm.`), '');
    } else {
      _wifiStatus(L('Keine Verbindung: ', 'No connection: ') + (err ? err[1] : L('keine Antwort vom Board', 'no answer from the board')) +
                  L(' – Name/Passwort prüfen. Nur WPA2-Personal oder Handy-Hotspot, kein Schul-WLAN mit Anmeldung.',
                    ' – check name/password. Only WPA2-Personal or a phone hotspot, no school Wi-Fi with login.'), 'error');
    }
  } catch (e) {
    _wifiStatus(L('Fehler: ', 'Error: ') + e.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

function initWifiSetup() {
  const btn = _wifiEl('btn-wifi');
  if (!btn) return;
  btn.hidden = !BOARD.wifi;               // nur bei Boards mit WLAN
  btn.addEventListener('click', openWifiModal);
  _wifiEl('wifi-close').addEventListener('click', closeWifiModal);
  _wifiEl('wifi-close-btn').addEventListener('click', closeWifiModal);
  _wifiEl('wifi-save-btn').addEventListener('click', onWifiSave);
  _wifiEl('wifi-test-btn').addEventListener('click', onWifiTest);
  _wifiEl('wifi-show').addEventListener('change', (e) => {
    _wifiEl('wifi-password').type = e.target.checked ? 'text' : 'password';
  });
}

initWifiSetup();
