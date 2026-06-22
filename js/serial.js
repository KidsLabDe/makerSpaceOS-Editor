// serial.js – Web Serial API + CircuitPython Raw REPL

// Aufräum-Prolog: gibt alle Pins/Objekte des vorherigen REPL-Laufs frei
// (deinit/exit), bevor das neue Skript startet. So vermeidet man „GPx in use"
// OHNE Soft-Reboot – dadurch läuft code.py/main.py des Boards NICHT mit an.
const PIN_RESET_PRELUDE =
`for _cb_n in list(globals()):
    _cb_o = globals().get(_cb_n)
    try:
        _cb_o.deinit()
    except Exception:
        try:
            _cb_o.exit()
        except Exception:
            pass
`;

class CircuitPythonSerial {
  constructor() {
    this.port     = null;
    this.reader   = null;
    this.writer   = null;
    this._reading = false;
    this.onData   = null;  // callback(string)
    this.onDisconnect = null;        // callback() bei unerwartetem Verbindungsverlust
    this._intentionalClose = false;  // true = vom Nutzer ausgelöstes Trennen
    this._disconnectBound  = false;
  }

  get isConnected() {
    return this.port !== null;
  }

  async connect() {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API nicht verfügbar. Bitte Chrome oder Edge verwenden.');
    }
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 115200 });
    this._intentionalClose = false;
    this._bindDisconnectEvent();
    this._startReading();
  }

  // OS-Ereignis: Gerät physisch abgesteckt → Lese-Schleife beenden lassen
  _bindDisconnectEvent() {
    if (this._disconnectBound) return;
    this._disconnectBound = true;
    navigator.serial.addEventListener('disconnect', (e) => {
      const p = e.port || e.target;
      if (p && p === this.port) this._reading = false;
    });
  }

  async disconnect() {
    this._intentionalClose = true;
    this._reading = false;
    try { if (this.reader) { await this.reader.cancel(); this.reader = null; } } catch(_) {}
    try { if (this.writer) { this.writer.releaseLock(); this.writer = null; } } catch(_) {}
    try { if (this.port)   { await this.port.close();   this.port   = null; } } catch(_) {}
  }

  _startReading() {
    this._reading = true;
    const self = this;
    (async () => {
      try {
        // Solange lesbar: Reader holen und lesen. KEIN tight-retry – bei done/Fehler
        // endet die Schleife sauber (verhindert den Microtask-Busy-Loop = Freeze).
        while (self._reading && self.port && self.port.readable) {
          self.reader = self.port.readable.getReader();
          try {
            while (true) {
              const { value, done } = await self.reader.read();
              if (done) { self._reading = false; break; }   // Stream zu = getrennt
              if (value && self.onData) self.onData(new TextDecoder().decode(value));
            }
          } finally {
            try { self.reader.releaseLock(); } catch(_) {}
            self.reader = null;
          }
        }
      } catch (e) {
        // Lesefehler (abgesteckt / USB-Reset) – beenden, NICHT endlos weiterlaufen
        if (self._reading) console.warn('Serial read error:', e);
      }
      // Schleife beendet → aufräumen; bei unerwartetem Verlust das UI benachrichtigen
      const intentional = self._intentionalClose;
      self._intentionalClose = false;
      self._reading = false;
      if (!intentional) self._handleUnexpectedDisconnect();
    })();
  }

  _handleUnexpectedDisconnect() {
    try { if (this.writer) this.writer.releaseLock(); } catch(_) {}
    this.writer = null;
    try { if (this.port) this.port.close().catch(() => {}); } catch(_) {}
    this.port   = null;
    this.reader = null;
    if (this.onDisconnect) { try { this.onDisconnect(); } catch(_) {} }
  }

  async _write(data) {
    if (!this.port || !this.port.writable) return;
    const writer = this.port.writable.getWriter();
    try {
      if (typeof data === 'string') {
        await writer.write(new TextEncoder().encode(data));
      } else {
        await writer.write(data);
      }
    } finally {
      writer.releaseLock();
    }
  }

  async _delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Code per Raw REPL auf das Board laden und ausführen
  async uploadAndRun(code) {
    if (!this.port) throw new Error('Nicht verbunden');

    // 1. Laufenden Code unterbrechen (Ctrl+C)
    await this._write('\x03');
    await this._delay(150);
    await this._write('\x03');
    await this._delay(150);

    // 2. Raw REPL aktivieren (Ctrl+A)
    await this._write('\x01');
    await this._delay(300);

    // 3. Aufräum-Prolog (gibt Pins des vorherigen Laufs frei) + eigentlichen Code senden.
    //    Kein Soft-Reboot → code.py/main.py des Boards wird NICHT gestartet.
    await this._write(PIN_RESET_PRELUDE + '\n' + code);
    await this._delay(100);

    // 4. Ausführen (Ctrl+D)
    await this._write('\x04');
  }

  // Code stoppen (Ctrl+C)
  async stop() {
    await this._write('\x03');
    await this._delay(100);
    await this._write('\x03');
    // Zurück zu normalem REPL (Ctrl+B)
    await this._write('\x02');
  }

  // Einzelnen Befehl im normalen REPL senden
  async sendLine(line) {
    await this._write(line + '\r\n');
  }
}
